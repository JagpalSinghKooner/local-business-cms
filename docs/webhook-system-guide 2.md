# Webhook System Guide

**Last Updated:** October 23, 2025

## Overview

The webhook system delivers real-time notifications to external applications when content changes occur. This enables integrations with deployment platforms, CRM systems, analytics tools, and custom applications.

---

## Key Features

- **Event-Driven:** Webhooks triggered automatically on content changes
- **Flexible Filtering:** Filter by event type and document type
- **Retry Logic:** Automatic retries with exponential backoff
- **Signature Verification:** HMAC-SHA256 signatures for security
- **Delivery Logging:** Track all webhook deliveries for debugging
- **Statistics Dashboard:** Monitor success rates and performance
- **Test Mode:** Test webhooks without real events
- **Custom Headers:** Add authentication headers

---

## Webhook Events

| Event | Description | When Triggered |
|-------|-------------|----------------|
| **document.created** | New document created | Document created in Studio or API |
| **document.updated** | Document modified | Document updated in Studio or API |
| **document.deleted** | Document deleted | Document removed from system |
| **document.published** | Content published | Document workflow state → published |
| **document.unpublished** | Content unpublished | Published document removed from site |
| **workflow.changed** | Workflow state transition | Any workflow state change |
| **scheduled.publish** | Scheduled publish set | Content scheduled for future publish |

---

## Webhook Payload

All webhooks send a POST request with JSON payload:

```json
{
  "event": "document.updated",
  "documentId": "service-123",
  "documentType": "service",
  "documentTitle": "Plumbing Services",
  "timestamp": "2025-10-23T10:00:00Z",
  "dataset": "site-budds",

  // Full document data (if available)
  "document": {
    "_id": "service-123",
    "_type": "service",
    "title": "Plumbing Services",
    // ... other fields
  },

  // Previous document data (for updates)
  "previousData": {
    "title": "Old Title",
    // ... previous values
  },

  // Field-level changes
  "changes": [
    {
      "field": "title",
      "oldValue": "Old Title",
      "newValue": "Plumbing Services"
    }
  ],

  // Additional metadata
  "metadata": {
    "userId": "user-456",
    "userName": "John Doe",
    "workflowState": "published",
    "previousWorkflowState": "approved"
  }
}
```

---

## Setting Up Webhooks

### Step 1: Create Webhook in Studio

1. Open Sanity Studio (`/studio`)
2. Navigate to "Webhook" document type
3. Click "Create"
4. Fill in webhook configuration:
   - **Name:** Descriptive name (e.g., "Deploy to Vercel")
   - **URL:** Endpoint URL (must be HTTPS)
   - **Events:** Select which events trigger this webhook
   - **Document Types:** Filter by document types (optional)
   - **Secret Key:** For signature verification (recommended)
   - **Custom Headers:** Additional authentication (optional)
   - **Retry Configuration:** Max retries and delay
   - **Timeout:** Request timeout in seconds

### Step 2: Configure Your Endpoint

Your webhook endpoint should:

```typescript
import crypto from 'crypto'

export async function POST(request: Request) {
  // 1. Verify signature (if secret configured)
  const signature = request.headers.get('x-webhook-signature')
  const body = await request.text()

  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    return new Response('Invalid signature', { status: 401 })
  }

  // 2. Parse payload
  const payload = JSON.parse(body)

  // 3. Handle event
  switch (payload.event) {
    case 'document.published':
      // Trigger deployment
      await triggerDeployment()
      break

    case 'document.created':
      // Sync to CRM
      await syncToCRM(payload.document)
      break

    // ... handle other events
  }

  // 4. Return success response
  return new Response('OK', { status: 200 })
}
```

### Step 3: Test Webhook

```bash
# Test webhook delivery
pnpm test-webhook --id=webhook-abc123

# Expected output:
# 🧪 Testing Webhook
# ✅ Webhook delivery successful
#    Status Code: 200
#    Duration: 245ms
```

### Step 4: Monitor Deliveries

```bash
# List all webhooks
pnpm test-webhook --list

# Show webhook statistics
pnpm test-webhook --stats

# View recent logs
pnpm test-webhook --logs

# View logs for specific webhook
pnpm test-webhook --logs --webhook=webhook-abc123 --limit=50
```

---

## Security

### Signature Verification

Webhooks include HMAC-SHA256 signatures in headers:

```
X-Webhook-Signature: abc123...
X-Webhook-Signature-256: sha256=abc123...
```

**Verify signatures in your endpoint:**

```typescript
import crypto from 'crypto'

function verifySignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  )
}

// In your webhook handler
const signature = request.headers.get('x-webhook-signature')
const body = await request.text()

if (!verifySignature(body, signature, process.env.WEBHOOK_SECRET!)) {
  return new Response('Invalid signature', { status: 401 })
}
```

### Best Practices

1. **Always use HTTPS** - Never use HTTP endpoints
2. **Configure secrets** - Enable signature verification
3. **Implement verification** - Always verify signatures
4. **Use custom headers** - Add additional authentication
5. **Monitor logs** - Watch for suspicious activity
6. **Rotate secrets** - Periodically change webhook secrets
7. **Rate limiting** - Implement rate limits on your endpoint
8. **Timeout handling** - Set appropriate timeouts
9. **Idempotency** - Handle duplicate deliveries gracefully

---

## Retry Logic

Failed webhook deliveries are automatically retried:

- **Initial Delay:** 5 seconds (configurable)
- **Exponential Backoff:** Delay doubles with each retry
- **Max Retries:** 3 (configurable)
- **Success Codes:** 2xx status codes
- **Retry Codes:** 5xx server errors, timeouts, network failures
- **No Retry:** 4xx client errors (except 408 timeout)

**Example retry sequence:**

```
Attempt 1: Immediate (fails with 500)
Attempt 2: 5 seconds later (fails with timeout)
Attempt 3: 10 seconds later (fails with 503)
Attempt 4: 20 seconds later (succeeds with 200)
```

---

## Common Use Cases

### 1. Deploy on Publish

Trigger Vercel deployment when content is published:

**Webhook Configuration:**
- **URL:** `https://api.vercel.com/v1/integrations/deploy/[...]/[...]`
- **Events:** `document.published`
- **Document Types:** `page`, `post`, `service`, `location`

**Endpoint:**
```typescript
// Vercel webhook endpoint
export async function POST(request: Request) {
  const payload = await request.json()

  // Trigger deployment
  await fetch(`${process.env.VERCEL_DEPLOY_HOOK}`, {
    method: 'POST'
  })

  return new Response('Deployment triggered', { status: 200 })
}
```

### 2. Sync Leads to CRM

Automatically sync new leads to Salesforce/HubSpot:

**Webhook Configuration:**
- **URL:** `https://api.yourapp.com/webhooks/sync-lead`
- **Events:** `document.created`
- **Document Types:** `lead`

**Endpoint:**
```typescript
export async function POST(request: Request) {
  const payload = await request.json()

  if (payload.event === 'document.created' && payload.documentType === 'lead') {
    // Sync to CRM
    await syncToSalesforce(payload.document)
  }

  return new Response('OK', { status: 200 })
}
```

### 3. Slack Notifications

Send team notifications on content changes:

**Webhook Configuration:**
- **URL:** `https://hooks.slack.com/services/[...]`
- **Events:** `document.published`, `document.deleted`
- **Document Types:** All types

**Endpoint:**
```typescript
export async function POST(request: Request) {
  const payload = await request.json()

  const message = {
    text: `📝 ${payload.event}: ${payload.documentTitle}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${payload.event.toUpperCase()}*\n${payload.documentTitle} (${payload.documentType})\nBy: ${payload.metadata.userName}`
        }
      }
    ]
  }

  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  })

  return new Response('OK', { status: 200 })
}
```

### 4. Update Search Index

Automatically update Algolia when content changes:

**Webhook Configuration:**
- **URL:** `https://api.yourapp.com/webhooks/index-search`
- **Events:** `document.published`, `document.updated`, `document.deleted`
- **Document Types:** `page`, `post`, `service`

**Endpoint:**
```typescript
import algoliasearch from 'algoliasearch'

const client = algoliasearch(APP_ID, API_KEY)
const index = client.initIndex('content')

export async function POST(request: Request) {
  const payload = await request.json()

  switch (payload.event) {
    case 'document.published':
    case 'document.updated':
      // Add/update in index
      await index.saveObject({
        objectID: payload.documentId,
        title: payload.document.title,
        content: payload.document.content,
        // ... other fields
      })
      break

    case 'document.deleted':
      // Remove from index
      await index.deleteObject(payload.documentId)
      break
  }

  return new Response('OK', { status: 200 })
}
```

### 5. Analytics Tracking

Track content changes in Google Analytics:

**Webhook Configuration:**
- **URL:** `https://api.yourapp.com/webhooks/analytics`
- **Events:** `document.published`, `document.updated`
- **Document Types:** All types

**Endpoint:**
```typescript
export async function POST(request: Request) {
  const payload = await request.json()

  // Send to Google Analytics 4
  await fetch('https://www.google-analytics.com/mp/collect', {
    method: 'POST',
    body: JSON.stringify({
      client_id: 'cms-system',
      events: [{
        name: 'content_change',
        params: {
          event_type: payload.event,
          document_type: payload.documentType,
          document_id: payload.documentId,
          user_id: payload.metadata.userId
        }
      }]
    })
  })

  return new Response('OK', { status: 200 })
}
```

---

## API Integration

### Trigger Webhooks Programmatically

```typescript
// POST /api/webhooks/trigger
const response = await fetch('/api/webhooks/trigger', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SANITY_API_TOKEN}`
  },
  body: JSON.stringify({
    event: 'document.updated',
    documentId: 'doc-123',
    documentType: 'service',
    documentTitle: 'Plumbing Services',
    document: {...},
    metadata: {
      userId: 'user-456',
      userName: 'John Doe'
    }
  })
})
```

### Test Webhook

```typescript
// POST /api/webhooks/test
const response = await fetch('/api/webhooks/test', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SANITY_API_TOKEN}`
  },
  body: JSON.stringify({
    webhookId: 'webhook-abc123'
  })
})

const result = await response.json()
// { success: true, statusCode: 200, duration: 245 }
```

---

## CLI Commands

### List Webhooks

```bash
pnpm test-webhook --list

# Output:
# ✅ Deploy to Vercel
#    ID: webhook-abc123
#    URL: https://api.vercel.com/...
#    Events: 1
#    Document Types: All
#    Total Deliveries: 145
#    Success Rate: 98%
```

### View Statistics

```bash
pnpm test-webhook --stats

# Output:
# OVERALL STATISTICS
# Total Webhooks: 5
# Enabled Webhooks: 4
# Total Deliveries: 523
# Successful: 512
# Failed: 11
# Success Rate: 97.90%
```

### View Logs

```bash
# Recent logs (all webhooks)
pnpm test-webhook --logs

# Logs for specific webhook
pnpm test-webhook --logs --webhook=webhook-abc123

# More logs
pnpm test-webhook --logs --limit=100

# Output:
# ✅ document.published
#    Webhook: Deploy to Vercel
#    Document: Plumbing Services
#    Time: 10/23/2025, 10:00:00 AM
#    Status Code: 200
#    Duration: 245ms
```

### Test Delivery

```bash
pnpm test-webhook --id=webhook-abc123

# Output:
# 🧪 Testing Webhook
# ✅ Webhook delivery successful
#    Status Code: 200
#    Duration: 245ms
```

---

## Troubleshooting

### Webhooks Not Triggering

**Check 1: Webhook Enabled**
```bash
pnpm test-webhook --list
# Verify webhook shows ✅ (enabled)
```

**Check 2: Event Configuration**
- Verify event type matches action (e.g., `document.published` for publishing)
- Check document type filter matches

**Check 3: Audit Logs Integration**
- Webhooks triggered via audit logger
- Verify audit logs are being created

### Delivery Failures

**Check 1: Endpoint Status**
```bash
# Test webhook delivery
pnpm test-webhook --id=webhook-abc123

# Check logs for errors
pnpm test-webhook --logs --webhook=webhook-abc123
```

**Check 2: Signature Verification**
- Verify secret key matches in both systems
- Check signature verification implementation

**Check 3: Timeout Issues**
- Increase timeout in webhook configuration
- Optimize endpoint response time

**Check 4: Network Issues**
- Verify endpoint is publicly accessible
- Check firewall rules

### High Failure Rates

**Check Statistics:**
```bash
pnpm test-webhook --stats
```

**Common Causes:**
1. **4xx Errors:** Invalid authentication, bad request format
2. **5xx Errors:** Server errors on endpoint
3. **Timeouts:** Endpoint taking too long to respond
4. **Network Errors:** DNS issues, connection refused

**Solutions:**
1. Monitor webhook logs regularly
2. Implement proper error handling in endpoint
3. Set appropriate timeouts
4. Use retry logic in endpoint
5. Return 200 status quickly, process async

---

## Monitoring & Maintenance

### Regular Checks

**Weekly:**
```bash
# Check success rates
pnpm test-webhook --stats

# Review recent failures
pnpm test-webhook --logs --limit=100 | grep "❌"
```

**Monthly:**
1. Review webhook configurations
2. Test all webhooks
3. Clean up old webhook logs
4. Rotate webhook secrets
5. Update endpoint URLs if needed

### Performance Optimization

**1. Respond Quickly**
```typescript
// ❌ Bad: Process synchronously
export async function POST(request: Request) {
  await heavyProcessing() // Blocks webhook
  return new Response('OK')
}

// ✅ Good: Process asynchronously
export async function POST(request: Request) {
  const payload = await request.json()

  // Queue for async processing
  await queue.add('process-webhook', payload)

  // Return immediately
  return new Response('OK', { status: 200 })
}
```

**2. Implement Idempotency**
```typescript
// Track processed webhooks
const processedWebhooks = new Set<string>()

export async function POST(request: Request) {
  const deliveryId = request.headers.get('x-webhook-delivery')

  // Skip if already processed
  if (processedWebhooks.has(deliveryId)) {
    return new Response('Already processed', { status: 200 })
  }

  // Process webhook
  await processWebhook(payload)

  // Mark as processed
  processedWebhooks.add(deliveryId)

  return new Response('OK', { status: 200 })
}
```

**3. Batch Updates**
```typescript
// Instead of processing each webhook individually,
// batch updates to reduce API calls
let batch = []

export async function POST(request: Request) {
  const payload = await request.json()

  batch.push(payload)

  // Process in batches of 10
  if (batch.length >= 10) {
    await processBatch(batch)
    batch = []
  }

  return new Response('OK', { status: 200 })
}
```

---

## API Reference

### Webhook Configuration Schema

```typescript
interface WebhookConfig {
  _id: string
  name: string                    // Descriptive name
  url: string                     // Endpoint URL (HTTPS)
  enabled: boolean                // Enable/disable webhook
  events: string[]                // Events to trigger on
  documentTypes?: string[]        // Filter by document types
  secret?: string                 // HMAC-SHA256 secret
  headers?: Array<{               // Custom headers
    key: string
    value: string
  }>
  retryConfig?: {
    maxRetries: number            // Max retry attempts
    retryDelay: number            // Initial delay (seconds)
  }
  timeout?: number                // Request timeout (seconds)
  statistics?: {
    totalDeliveries: number
    successfulDeliveries: number
    failedDeliveries: number
    lastDeliveryAt?: string
    lastDeliveryStatus?: string
  }
}
```

### Webhook Payload Schema

```typescript
interface WebhookPayload {
  event: WebhookEvent             // Event type
  documentId: string              // Document ID
  documentType: string            // Document type
  documentTitle?: string          // Document title
  timestamp: string               // ISO 8601 timestamp
  dataset: string                 // Sanity dataset name
  document?: any                  // Full document data
  previousData?: any              // Previous document data
  changes?: Array<{               // Field changes
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
```

---

## Related Documentation

- [Audit Logs Guide](./audit-logs-guide.md) - Audit logging system (triggers webhooks)
- [Workflow System Guide](./workflow-system-guide.md) - Content workflow states
- [Scheduling System Guide](./scheduling-system-guide.md) - Scheduled publishing

---

## Support

For questions or issues:
1. Test webhook delivery with `pnpm test-webhook`
2. Check webhook logs for errors
3. Verify signature verification
4. Monitor webhook statistics
5. Review endpoint implementation
