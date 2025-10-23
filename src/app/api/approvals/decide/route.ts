/**
 * Submit Approval Decision API Route
 */

import { NextRequest, NextResponse } from 'next/server'
import { submitApprovalDecision } from '@/sanity/lib/approval-manager'

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

    const { approvalRequestId, userId, userName, decision, comment } = body

    // Validate required fields
    if (!approvalRequestId || !userId || !userName || !decision) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['approvalRequestId', 'userId', 'userName', 'decision'],
        },
        { status: 400 }
      )
    }

    if (decision !== 'approved' && decision !== 'rejected') {
      return NextResponse.json(
        {
          error: 'Invalid decision',
          message: 'Decision must be "approved" or "rejected"',
        },
        { status: 400 }
      )
    }

    await submitApprovalDecision(approvalRequestId, userId, userName, decision, comment)

    return NextResponse.json({
      success: true,
      message: `Approval ${decision}`,
    })
  } catch (error: any) {
    console.error('Failed to submit approval decision:', error)

    return NextResponse.json(
      {
        error: 'Failed to submit approval decision',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
