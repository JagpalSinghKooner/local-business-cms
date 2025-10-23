/**
 * Approval Tool
 *
 * Studio tool to manage approval requests
 */

import { definePlugin } from 'sanity'
import { CheckmarkCircleIcon } from '@sanity/icons'

export const approvalTool = definePlugin({
  name: 'approval-tool',
  tools: [
    {
      name: 'approvals',
      title: 'Approvals',
      icon: CheckmarkCircleIcon,
      component: () => <ApprovalComponent />,
    },
  ],
})

/**
 * Approval Component
 */
function ApprovalComponent() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Approval Workflows
      </h1>

      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Manage content approvals with flexible workflows. Request approvals from team members
          before publishing content.
        </p>
      </div>

      <div
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: '#F3F4F6',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
          Approval Types
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          <ApprovalTypeCard
            title="Single Approval"
            description="First approver's decision is final"
            icon="✅"
          />
          <ApprovalTypeCard
            title="All Approvers"
            description="All approvers must approve (any rejection fails)"
            icon="👥"
          />
          <ApprovalTypeCard
            title="Majority"
            description="Majority of approvers must approve"
            icon="📊"
          />
        </div>
      </div>

      <div
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
          Workflow Process
        </h2>

        <ol style={{ marginLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
          <li>Content creator requests approval from designated approvers</li>
          <li>Document workflow state changes to "In Review"</li>
          <li>Approvers receive notification of pending approval</li>
          <li>Approvers review content and submit approval/rejection</li>
          <li>
            Based on approval type, request is resolved when:
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Single: First decision</li>
              <li>All: All approve OR any rejection</li>
              <li>Majority: Majority approve OR majority reject</li>
            </ul>
          </li>
          <li>If approved: Document moves to "Approved" state (ready to publish)</li>
          <li>If rejected: Document returns to "Draft" state for revisions</li>
        </ol>
      </div>

      <div
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
          Managing Approvals
        </h2>

        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Request Approval
          </h3>
          <ol style={{ marginLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
            <li>Navigate to "Approval Request" document type</li>
            <li>Click "Create" to start a new approval request</li>
            <li>Select the document that needs approval</li>
            <li>Add approvers (users who can approve)</li>
            <li>Select approval type (single, all, majority)</li>
            <li>Add request notes and set priority/due date</li>
            <li>Save the request</li>
          </ol>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Approve/Reject Content
          </h3>
          <ol style={{ marginLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
            <li>Navigate to "Approval Request" document type</li>
            <li>Filter for pending requests assigned to you</li>
            <li>Open the approval request</li>
            <li>Review the content and request notes</li>
            <li>Add your approval/rejection with optional comment</li>
            <li>Save the request</li>
          </ol>
        </div>
      </div>

      <div
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: '#EFF6FF',
          borderRadius: '8px',
          borderLeft: '4px solid #3B82F6',
        }}
      >
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          📋 Best Practices
        </h3>
        <ul style={{ marginLeft: '1.5rem', color: '#666', lineHeight: '1.8', marginTop: '0.5rem' }}>
          <li>Use "Single Approval" for simple content updates</li>
          <li>Use "All Approvers" for critical content requiring multiple reviews</li>
          <li>Use "Majority" for larger approval groups</li>
          <li>Set due dates for time-sensitive approvals</li>
          <li>Use priority levels to highlight urgent approvals</li>
          <li>Add detailed request notes to provide context</li>
          <li>Reviewers should add comments explaining their decision</li>
        </ul>
      </div>

      <div
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
        }}
      >
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Status Indicators
        </h3>
        <div style={{ marginTop: '1rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⏳</span>
            <span style={{ marginLeft: '0.5rem', color: '#666' }}>Pending - Awaiting approval</span>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✅</span>
            <span style={{ marginLeft: '0.5rem', color: '#666' }}>Approved - Ready to publish</span>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>❌</span>
            <span style={{ marginLeft: '0.5rem', color: '#666' }}>
              Rejected - Needs revisions
            </span>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🚫</span>
            <span style={{ marginLeft: '0.5rem', color: '#666' }}>Cancelled - No longer needed</span>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: '#FEF3C7',
          borderRadius: '8px',
          borderLeft: '4px solid #F59E0B',
        }}
      >
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          🎯 Common Use Cases
        </h3>
        <ul style={{ marginLeft: '1.5rem', color: '#666', lineHeight: '1.8', marginTop: '0.5rem' }}>
          <li>
            <strong>Blog Posts:</strong> Editor reviews content before publishing
          </li>
          <li>
            <strong>Service Pages:</strong> Manager approves service descriptions and pricing
          </li>
          <li>
            <strong>Legal Content:</strong> Legal team reviews terms/privacy policies
          </li>
          <li>
            <strong>Marketing Offers:</strong> Marketing lead approves promotional content
          </li>
          <li>
            <strong>Location Pages:</strong> Regional manager approves location-specific content
          </li>
        </ul>
      </div>
    </div>
  )
}

/**
 * Approval Type Card Component
 */
function ApprovalTypeCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: string
}) {
  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '6px',
        border: '1px solid #E5E7EB',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{icon}</span>
        <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>{title}</h4>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#666' }}>{description}</p>
    </div>
  )
}

export default approvalTool
