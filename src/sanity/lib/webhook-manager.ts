/**
 * Webhook Manager
 *
 * Trigger and deliver webhooks for content changes
 */

import { createClient } from '@sanity/client'
import crypto from 'crypto'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const token = process.env.SANITY_API_TOKEN

export type WebhookEvent =
  | 'document.created'
  | 'document.updated'
  | 'document.deleted'
  | 'document.published'
  | 'document.unpublished'
  | 'workflow.changed'
  | 'scheduled.publish'

export interface WebhookPayload {
  event: WebhookEvent
  documentId: string
  documentType: string
  documentTitle?: string
  timestamp: string
  dataset: string
  document?: any
  previousData?: any
  changes?: Array<{
    field: string
    oldValue?: any
    newValue?: any
  }>
  metadata?: {
    userId?: string
    userName?: string
    workflowState?: string
    previousWorkflowState?: string
  }
}

export interface WebhookConfig {
  _id: string
  name: string
  url: string
  enabled: boolean
  events: string[]
  documentTypes?: string[]
  secret?: string
  headers?: Array<{ key: string; value: string }>
  retryConfig?: {
    maxRetries: number
    retryDelay: number
  }
  timeout?: number
  statistics?: {
    totalDeliveries: number
    successfulDeliveries: number
    failedDeliveries: number
    lastDeliveryAt?: string
    lastDeliveryStatus?: string
  }
}

/**
 * Get all enabled webhooks for an event
 */
export async function getWebhooksForEvent(
  event: WebhookEvent,
  documentType: string
): Promise<WebhookConfig[]> {
  if (!token) {
    console.warn('SANITY_API_TOKEN not set, skipping webhooks')
    return []
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    const webhooks = await client.fetch<WebhookConfig[]>(`
      *[
        _type == "webhook" &&
        enabled == true &&
        $event in events &&
        (
          !defined(documentTypes) ||
          count(documentTypes) == 0 ||
          "*" in documentTypes ||
          $documentType in documentTypes
        )
      ] {
        _id,
        name,
        url,
        enabled,
        events,
        documentTypes,
        secret,
        headers,
        retryConfig,
        timeout,
        statistics
      }
    `, { event, documentType })

    return webhooks
  } catch (error) {
    console.error('Failed to fetch webhooks:', error)
    return []
  }
}

/**
 * Sign webhook payload with HMAC-SHA256
 */
function signPayload(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

/**
 * Deliver webhook to endpoint
 */
async function deliverWebhook(
  webhook: WebhookConfig,
  payload: WebhookPayload,
  attemptNumber: number = 1
): Promise<{
  success: boolean
  statusCode?: number
  responseBody?: string
  error?: string
  duration: number
}> {
  const startTime = Date.now()
  const payloadString = JSON.stringify(payload)

  try {
    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Sanity-Webhook/1.0',
      'X-Webhook-Event': payload.event,
      'X-Webhook-Delivery': crypto.randomUUID(),
      'X-Webhook-Attempt': String(attemptNumber),
    }

    // Add signature if secret is configured
    if (webhook.secret) {
      const signature = signPayload(payloadString, webhook.secret)
      headers['X-Webhook-Signature'] = signature
      headers['X-Webhook-Signature-256'] = `sha256=${signature}`
    }

    // Add custom headers
    if (webhook.headers) {
      webhook.headers.forEach((header) => {
        headers[header.key] = header.value
      })
    }

    // Make request
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers,
      body: payloadString,
      signal: AbortSignal.timeout((webhook.timeout || 30) * 1000),
    })

    const duration = Date.now() - startTime
    const responseBody = await response.text().catch(() => '')

    return {
      success: response.ok,
      statusCode: response.status,
      responseBody: responseBody.substring(0, 1000), // Limit response size
      duration,
    }
  } catch (error: any) {
    const duration = Date.now() - startTime

    return {
      success: false,
      error: error.message || 'Unknown error',
      duration,
    }
  }
}

/**
 * Log webhook delivery attempt
 */
async function logWebhookDelivery(
  webhook: WebhookConfig,
  payload: WebhookPayload,
  result: {
    success: boolean
    statusCode?: number
    responseBody?: string
    error?: string
    duration: number
  },
  attemptNumber: number,
  willRetry: boolean
): Promise<void> {
  if (!token) return

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    await client.create({
      _type: 'webhookLog',
      webhookId: webhook._id,
      webhookName: webhook.name,
      event: payload.event,
      documentId: payload.documentId,
      documentType: payload.documentType,
      documentTitle: payload.documentTitle,
      timestamp: payload.timestamp,
      url: webhook.url,
      method: 'POST',
      payload: JSON.stringify(payload, null, 2),
      headers: JSON.stringify(
        {
          'Content-Type': 'application/json',
          'X-Webhook-Event': payload.event,
          ...(webhook.secret && { 'X-Webhook-Signature': '[REDACTED]' }),
        },
        null,
        2
      ),
      statusCode: result.statusCode,
      responseBody: result.responseBody,
      success: result.success,
      error: result.error,
      duration: result.duration,
      attemptNumber,
      willRetry,
    })
  } catch (error) {
    console.error('Failed to log webhook delivery:', error)
  }
}

/**
 * Update webhook statistics
 */
async function updateWebhookStatistics(
  webhookId: string,
  success: boolean
): Promise<void> {
  if (!token) return

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    const webhook = await client.fetch<WebhookConfig>(`*[_type == "webhook" && _id == $id][0]`, {
      id: webhookId,
    })

    if (!webhook) return

    const stats = webhook.statistics || {
      totalDeliveries: 0,
      successfulDeliveries: 0,
      failedDeliveries: 0,
    }

    await client
      .patch(webhookId)
      .set({
        'statistics.totalDeliveries': stats.totalDeliveries + 1,
        'statistics.successfulDeliveries': success
          ? stats.successfulDeliveries + 1
          : stats.successfulDeliveries,
        'statistics.failedDeliveries': success
          ? stats.failedDeliveries
          : stats.failedDeliveries + 1,
        'statistics.lastDeliveryAt': new Date().toISOString(),
        'statistics.lastDeliveryStatus': success ? 'success' : 'failed',
      })
      .commit()
  } catch (error) {
    console.error('Failed to update webhook statistics:', error)
  }
}

/**
 * Trigger webhooks for an event with retry logic
 */
export async function triggerWebhooks(
  event: WebhookEvent,
  documentId: string,
  documentType: string,
  documentTitle?: string,
  document?: any,
  previousData?: any,
  metadata?: {
    userId?: string
    userName?: string
    workflowState?: string
    previousWorkflowState?: string
    changes?: Array<{ field: string; oldValue?: any; newValue?: any }>
  }
): Promise<void> {
  // Get webhooks for this event
  const webhooks = await getWebhooksForEvent(event, documentType)

  if (webhooks.length === 0) {
    return
  }

  // Build payload
  const payload: WebhookPayload = {
    event,
    documentId,
    documentType,
    documentTitle,
    timestamp: new Date().toISOString(),
    dataset,
    document,
    previousData,
    changes: metadata?.changes,
    metadata: {
      userId: metadata?.userId,
      userName: metadata?.userName,
      workflowState: metadata?.workflowState,
      previousWorkflowState: metadata?.previousWorkflowState,
    },
  }

  // Trigger webhooks in parallel
  await Promise.all(
    webhooks.map(async (webhook) => {
      let attemptNumber = 1
      let success = false
      let lastResult: any

      const maxRetries = webhook.retryConfig?.maxRetries ?? 3
      const retryDelay = webhook.retryConfig?.retryDelay ?? 5

      // Initial attempt + retries
      while (attemptNumber <= maxRetries + 1 && !success) {
        lastResult = await deliverWebhook(webhook, payload, attemptNumber)
        success = lastResult.success

        const willRetry = !success && attemptNumber <= maxRetries

        // Log delivery
        await logWebhookDelivery(webhook, payload, lastResult, attemptNumber, willRetry)

        if (!success && willRetry) {
          // Exponential backoff
          const delay = retryDelay * Math.pow(2, attemptNumber - 1) * 1000
          await new Promise((resolve) => setTimeout(resolve, delay))
          attemptNumber++
        } else {
          break
        }
      }

      // Update statistics
      await updateWebhookStatistics(webhook._id, success)
    })
  )
}

/**
 * Test webhook delivery
 */
export async function testWebhook(webhookId: string): Promise<{
  success: boolean
  statusCode?: number
  responseBody?: string
  error?: string
  duration: number
}> {
  if (!token) {
    return {
      success: false,
      error: 'SANITY_API_TOKEN not set',
      duration: 0,
    }
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    const webhook = await client.fetch<WebhookConfig>(`*[_type == "webhook" && _id == $id][0]`, {
      id: webhookId,
    })

    if (!webhook) {
      return {
        success: false,
        error: 'Webhook not found',
        duration: 0,
      }
    }

    // Build test payload
    const testPayload: WebhookPayload = {
      event: 'document.updated',
      documentId: 'test-document-id',
      documentType: 'test',
      documentTitle: 'Test Webhook Delivery',
      timestamp: new Date().toISOString(),
      dataset,
      metadata: {
        userId: 'system',
        userName: 'System Test',
      },
    }

    const result = await deliverWebhook(webhook, testPayload, 1)

    // Log test delivery
    await logWebhookDelivery(webhook, testPayload, result, 1, false)

    return result
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unknown error',
      duration: 0,
    }
  }
}
