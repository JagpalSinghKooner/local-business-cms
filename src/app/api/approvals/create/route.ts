/**
 * Create Approval Request API Route
 */

import { NextRequest, NextResponse } from 'next/server'
import { createApprovalRequest } from '@/sanity/lib/approval-manager'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Verify authorization
function verifyAuthorization(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  const apiToken = process.env.SANITY_API_TOKEN

  if (!apiToken || token !== apiToken) {
    return false
  }

  return true
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAuthorization(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const {
      documentId,
      documentTitle,
      documentType,
      requestedBy,
      approvers,
      approvalType,
      requestNotes,
      dueDate,
      priority,
      tags,
    } = body

    // Validate required fields
    if (!documentId || !documentTitle || !documentType || !requestedBy || !approvers) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['documentId', 'documentTitle', 'documentType', 'requestedBy', 'approvers'],
        },
        { status: 400 }
      )
    }

    const approvalRequestId = await createApprovalRequest({
      documentId,
      documentTitle,
      documentType,
      requestedBy,
      approvers,
      approvalType,
      requestNotes,
      dueDate,
      priority,
      tags,
    })

    return NextResponse.json({
      success: true,
      approvalRequestId,
    })
  } catch (error: any) {
    console.error('Failed to create approval request:', error)

    return NextResponse.json(
      {
        error: 'Failed to create approval request',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
