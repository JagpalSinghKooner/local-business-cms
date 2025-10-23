/**
 * Version History Tool
 *
 * Studio tool to view version history and document changes
 */

import { definePlugin } from 'sanity'
import { RestoreIcon } from '@sanity/icons'

export const versionHistoryTool = definePlugin({
  name: 'version-history-tool',
  tools: [
    {
      name: 'version-history',
      title: 'Version History',
      icon: RestoreIcon,
      component: () => <VersionHistoryComponent />,
    },
  ],
})

/**
 * Version History Component
 */
function VersionHistoryComponent() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Version History
      </h1>

      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Sanity automatically tracks all document changes with full version history. View,
          compare, and restore previous versions of any document.
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
          Tracked Information
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <InfoCard title="User" description="Who made the change" icon="👤" />
          <InfoCard title="Timestamp" description="When the change was made" icon="⏰" />
          <InfoCard title="Changes" description="What fields were modified" icon="📝" />
          <InfoCard title="Version" description="Complete snapshot of document" icon="📸" />
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
          Viewing Version History
        </h2>

        <ol style={{ marginLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
          <li>Open any document in the Studio</li>
          <li>Click the "History" button in the top right corner</li>
          <li>Browse through the timeline of changes</li>
          <li>Click on any version to see its content</li>
          <li>Compare versions side-by-side</li>
          <li>See who made changes and when</li>
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
          Restoring Previous Versions
        </h2>

        <ol style={{ marginLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
          <li>Open the document you want to restore</li>
          <li>Click "History" in the top right</li>
          <li>Browse to the version you want to restore</li>
          <li>Click "Restore this version"</li>
          <li>Review the restored content</li>
          <li>Save or publish the restored version</li>
        </ol>

        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#FEF3C7',
            borderRadius: '6px',
            borderLeft: '4px solid #F59E0B',
          }}
        >
          <p style={{ color: '#92400E', fontSize: '0.875rem', margin: 0 }}>
            <strong>⚠️ Note:</strong> Restoring a version creates a new version. The history is
            never deleted, so you can always restore any previous version.
          </p>
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
          💡 Best Practices
        </h3>
        <ul style={{ marginLeft: '1.5rem', color: '#666', lineHeight: '1.8', marginTop: '0.5rem' }}>
          <li>Review history before making major changes</li>
          <li>Use history to track who made specific changes</li>
          <li>Compare versions to understand what changed</li>
          <li>Restore versions carefully - review before saving</li>
          <li>Use audit logs for compliance tracking (history is for content review)</li>
          <li>Combine with workflow states for complete content lifecycle</li>
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
          History vs Audit Logs
        </h3>

        <div style={{ marginTop: '1rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Version History (Sanity Built-in)
          </h4>
          <ul style={{ marginLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
            <li>Visual timeline of document changes</li>
            <li>Side-by-side comparison</li>
            <li>One-click restore</li>
            <li>Per-document view</li>
            <li>Great for content review and rollback</li>
          </ul>

          <h4
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              marginTop: '1rem',
            }}
          >
            Audit Logs (Custom System)
          </h4>
          <ul style={{ marginLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
            <li>Comprehensive audit trail</li>
            <li>Cross-document search and filtering</li>
            <li>Export for compliance reports</li>
            <li>Tracks workflow changes and events</li>
            <li>Great for security and compliance</li>
          </ul>
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
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Keyboard Shortcuts
        </h3>

        <div style={{ marginTop: '1rem' }}>
          <div style={{ marginBottom: '0.5rem', fontFamily: 'monospace', color: '#666' }}>
            <strong>Ctrl/Cmd + H</strong> - Open history panel
          </div>
          <div style={{ marginBottom: '0.5rem', fontFamily: 'monospace', color: '#666' }}>
            <strong>← →</strong> - Navigate between versions
          </div>
          <div style={{ marginBottom: '0.5rem', fontFamily: 'monospace', color: '#666' }}>
            <strong>Esc</strong> - Close history panel
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
            <strong>Accidental Changes:</strong> Quickly restore content after mistaken edits
          </li>
          <li>
            <strong>Content Review:</strong> Compare current version with previous drafts
          </li>
          <li>
            <strong>Blame/Attribution:</strong> See who made specific changes and when
          </li>
          <li>
            <strong>Rollback:</strong> Restore content to a known good state
          </li>
          <li>
            <strong>Collaboration:</strong> Track team member contributions
          </li>
          <li>
            <strong>Quality Control:</strong> Review changes before publishing
          </li>
        </ul>
      </div>
    </div>
  )
}

/**
 * Info Card Component
 */
function InfoCard({
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

export default versionHistoryTool
