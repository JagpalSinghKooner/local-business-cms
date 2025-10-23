/**
 * Scheduled Publishing Cron Job
 *
 * Checks for content scheduled to publish/unpublish and updates workflow states
 *
 * Called by:
 * - Vercel Cron (configured in vercel.json)
 * - External cron service
 * - Manual trigger for testing
 *
 * GET /api/cron/publish-scheduled
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { WORKFLOW_STATES } from '@/sanity/schemaTypes/objects/workflowState'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const token = process.env.SANITY_API_TOKEN

// Security: Require cron secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET || 'your-secret-key-here'

export const dynamic = 'force-dynamic'

interface ProcessResult {
  published: number
  unpublished: number
  errors: number
  documents: Array<{
    id: string
    type: string
    title?: string
    action: 'published' | 'unpublished' | 'error'
    error?: string
  }>
}

/**
 * GET /api/cron/publish-scheduled
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    const providedSecret = authHeader?.replace('Bearer ', '')

    if (providedSecret !== CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!token) {
      return NextResponse.json(
        { error: 'SANITY_API_TOKEN not configured' },
        { status: 500 }
      )
    }

    // Create Sanity client with write permissions
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    const result: ProcessResult = {
      published: 0,
      unpublished: 0,
      errors: 0,
      documents: [],
    }

    // Find documents ready to publish
    const documentsToPublish = await client.fetch<any[]>(`
      *[
        publishAt != null &&
        publishAt <= now() &&
        workflow.state != "${WORKFLOW_STATES.PUBLISHED}"
      ]{
        _id,
        _type,
        title,
        publishAt,
        workflow
      }
    `)

    // Publish documents
    for (const doc of documentsToPublish) {
      try {
        await client
          .patch(doc._id)
          .set({
            'workflow.state': WORKFLOW_STATES.PUBLISHED,
            'workflow.changedAt': new Date().toISOString(),
            'workflow.changedBy': 'system',
            'workflow.notes': 'Published automatically by scheduled publish',
          })
          .commit()

        result.published++
        result.documents.push({
          id: doc._id,
          type: doc._type,
          title: doc.title,
          action: 'published',
        })
      } catch (error: any) {
        result.errors++
        result.documents.push({
          id: doc._id,
          type: doc._type,
          title: doc.title,
          action: 'error',
          error: error.message,
        })
      }
    }

    // Find documents ready to unpublish
    const documentsToUnpublish = await client.fetch<any[]>(`
      *[
        unpublishAt != null &&
        unpublishAt <= now() &&
        workflow.state == "${WORKFLOW_STATES.PUBLISHED}"
      ]{
        _id,
        _type,
        title,
        unpublishAt,
        workflow
      }
    `)

    // Unpublish documents
    for (const doc of documentsToUnpublish) {
      try {
        await client
          .patch(doc._id)
          .set({
            'workflow.state': WORKFLOW_STATES.ARCHIVED,
            'workflow.changedAt': new Date().toISOString(),
            'workflow.changedBy': 'system',
            'workflow.notes': 'Unpublished automatically by scheduled unpublish',
          })
          .commit()

        result.unpublished++
        result.documents.push({
          id: doc._id,
          type: doc._type,
          title: doc.title,
          action: 'unpublished',
        })
      } catch (error: any) {
        result.errors++
        result.documents.push({
          id: doc._id,
          type: doc._type,
          title: doc.title,
          action: 'error',
          error: error.message,
        })
      }
    }

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        result,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error: any) {
    console.error('Scheduled publish cron error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  }
}
