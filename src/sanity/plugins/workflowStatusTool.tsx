/**
 * Workflow Status Tool
 *
 * Studio tool to view and manage content by workflow state
 */

import { definePlugin } from 'sanity'
import { DocumentsIcon } from '@sanity/icons'

export const workflowStatusTool = definePlugin({
  name: 'workflow-status-tool',
  tools: [
    {
      name: 'workflow-status',
      title: 'Workflow Status',
      icon: DocumentsIcon,
      component: () => <WorkflowStatusComponent />,
    },
  ],
})

/**
 * Workflow Status Component
 */
function WorkflowStatusComponent() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Workflow Status
      </h1>

      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          View and manage content by workflow state. Use the document list filters to see content
          in different workflow states.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        <WorkflowStateCard
          title="Draft"
          count="Use filters to count"
          color="#9CA3AF"
          description="Content being authored"
        />
        <WorkflowStateCard
          title="In Review"
          count="Use filters to count"
          color="#F59E0B"
          description="Awaiting approval"
        />
        <WorkflowStateCard
          title="Approved"
          count="Use filters to count"
          color="#10B981"
          description="Ready to publish"
        />
        <WorkflowStateCard
          title="Published"
          count="Use filters to count"
          color="#3B82F6"
          description="Live on website"
        />
        <WorkflowStateCard
          title="Archived"
          count="Use filters to count"
          color="#6B7280"
          description="No longer active"
        />
      </div>

      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#F3F4F6',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Workflow Transitions
        </h2>
        <ul style={{ listStyle: 'disc', marginLeft: '1.5rem', color: '#666' }}>
          <li>Draft → In Review (submit for approval)</li>
          <li>In Review → Approved (approve content)</li>
          <li>In Review → Draft (send back for revisions)</li>
          <li>Approved → Published (publish to website)</li>
          <li>Published → Archived (remove from website)</li>
          <li>Archived → Draft (restore content)</li>
        </ul>
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#EFF6FF',
          borderRadius: '8px',
          borderLeft: '4px solid #3B82F6',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          💡 Quick Tip
        </h3>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          Use document list filters to view content by workflow state. Add the workflow field to
          your document schemas to enable workflow management.
        </p>
      </div>
    </div>
  )
}

/**
 * Workflow State Card Component
 */
function WorkflowStateCard({
  title,
  count,
  color,
  description,
}: {
  title: string
  count: string
  color: string
  description: string
}) {
  return (
    <div
      style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: color,
            marginRight: '0.5rem',
          }}
        />
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{title}</h3>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
        {description}
      </p>
      <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{count}</p>
    </div>
  )
}

export default workflowStatusTool
