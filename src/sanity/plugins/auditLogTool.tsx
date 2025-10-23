/**
 * Audit Log Tool
 *
 * Studio tool to view and search audit logs
 */

import { definePlugin } from 'sanity'
import { ActivityIcon } from '@sanity/icons'

export const auditLogTool = definePlugin({
  name: 'audit-log-tool',
  tools: [
    {
      name: 'audit-logs',
      title: 'Audit Logs',
      icon: ActivityIcon,
      component: () => <AuditLogComponent />,
    },
  ],
})

/**
 * Audit Log Component
 */
function AuditLogComponent() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Audit Logs
      </h1>

      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Track all content changes for compliance and security. View who changed what and when.
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
          Tracked Events
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <EventTypeCard
            title="Created"
            description="Document creation"
            count="View in list"
          />
          <EventTypeCard
            title="Updated"
            description="Document modifications"
            count="View in list"
          />
          <EventTypeCard
            title="Deleted"
            description="Document deletions"
            count="View in list"
          />
          <EventTypeCard
            title="Published"
            description="Content publishing"
            count="View in list"
          />
          <EventTypeCard
            title="Workflow Changed"
            description="Workflow state changes"
            count="View in list"
          />
          <EventTypeCard
            title="Scheduled"
            description="Scheduled publishing"
            count="View in list"
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
          How to Use
        </h2>

        <ol style={{ marginLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
          <li>Navigate to the "Audit Log" document type in the left sidebar</li>
          <li>Use filters to search by action, user, document type, or date</li>
          <li>Click on any log entry to view full details</li>
          <li>View field-level changes in the "Changes" array</li>
          <li>Export logs using the export script for compliance reports</li>
        </ol>
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
          💡 Audit Log Best Practices
        </h3>
        <ul style={{ marginLeft: '1.5rem', color: '#666', lineHeight: '1.8', marginTop: '0.5rem' }}>
          <li>Review logs regularly for suspicious activity</li>
          <li>Export logs monthly for compliance records</li>
          <li>Use filters to investigate specific incidents</li>
          <li>Logs are read-only and cannot be modified</li>
        </ul>
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
          📊 Export Audit Logs
        </h3>
        <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
          Use the CLI to export audit logs for compliance reports:
        </p>
        <code
          style={{
            display: 'block',
            padding: '0.75rem',
            backgroundColor: '#1F2937',
            color: '#F3F4F6',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            marginTop: '0.5rem',
          }}
        >
          pnpm export-audit-logs --start=2025-01-01 --end=2025-12-31
        </code>
      </div>
    </div>
  )
}

/**
 * Event Type Card Component
 */
function EventTypeCard({
  title,
  description,
  count,
}: {
  title: string
  description: string
  count: string
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
      <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{title}</h4>
      <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
        {description}
      </p>
      <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{count}</p>
    </div>
  )
}

export default auditLogTool
