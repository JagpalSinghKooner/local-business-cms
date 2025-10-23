/**
 * GDPR Compliance Tools
 *
 * Utilities for GDPR data access and deletion requests
 */

import { createClient } from '@sanity/client'
import { exportAuditLogs } from '@/sanity/lib/audit-logger'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const token = process.env.SANITY_API_TOKEN

export interface DataAccessRequest {
  email: string
  requestType: 'access' | 'deletion' | 'portability'
  requestedAt: string
  status: 'pending' | 'completed' | 'rejected'
}

/**
 * Export all user data for GDPR access request
 */
export async function exportUserData(email: string): Promise<any> {
  if (!token) {
    throw new Error('SANITY_API_TOKEN not set')
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    // Get user profile
    const userProfile = await client.fetch<any>(
      `*[_type == "userProfile" && email == $email][0]`,
      { email }
    )

    // Get audit logs for user
    const auditLogs = await client.fetch<any[]>(
      `*[_type == "auditLog" && userEmail == $email] | order(timestamp desc)`,
      { email }
    )

    // Get leads created by this email
    const leads = await client.fetch<any[]>(
      `*[_type == "lead" && email == $email]`,
      { email }
    )

    return {
      userProfile,
      auditLogs,
      leads,
      exportedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Failed to export user data:', error)
    throw error
  }
}

/**
 * Delete all user data for GDPR deletion request
 */
export async function deleteUserData(email: string): Promise<void> {
  if (!token) {
    throw new Error('SANITY_API_TOKEN not set')
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    // Get all documents with this email
    const documentsToDelete = await client.fetch<string[]>(
      `*[email == $email]._id`,
      { email }
    )

    // Delete documents
    for (const id of documentsToDelete) {
      await client.delete(id)
    }

    // Anonymize audit logs (can't delete for compliance)
    const auditLogsToAnonymize = await client.fetch<string[]>(
      `*[_type == "auditLog" && userEmail == $email]._id`,
      { email }
    )

    for (const id of auditLogsToAnonymize) {
      await client
        .patch(id)
        .set({
          userEmail: '[DELETED]',
          userName: '[DELETED]',
        })
        .commit()
    }
  } catch (error) {
    console.error('Failed to delete user data:', error)
    throw error
  }
}
