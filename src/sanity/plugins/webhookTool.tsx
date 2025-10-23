/**
 * Webhook Tool
 *
 * Studio tool to view webhook statistics and manage integrations
 */

import { definePlugin } from 'sanity'
import { PlugIcon } from '@sanity/icons'

export const webhookTool = definePlugin({
  name: 'webhook-tool',
  tools: [
    {
      name: 'webhooks',
      title: 'Webhooks',
      icon: PlugIcon,
      component: () => <WebhookComponent />,
    },
  ],
})

/**
 * Webhook Component
 */
function WebhookComponent() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Webhook Integrations
      </h1>

      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Trigger external integrations when content changes. Webhooks deliver real-time
          notifications to your applications.
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
          Available Events
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <EventCard
            title="Document Created"
            description="New document created"
            event="document.created"
          />
          <EventCard
            title="Document Updated"
            description="Existing document modified"
            event="document.updated"
          />
          <EventCard
            title="Document Deleted"
            description="Document removed"
            event="document.deleted"
          />
          <EventCard
            title="Document Published"
            description="Content published to website"
            event="document.published"
          />
          <EventCard
            title="Document Unpublished"
            description="Published content removed"
            event="document.unpublished"
          />
          <EventCard
            title="Workflow Changed"
            description="Workflow state transition"
            event="workflow.changed"
          />
          <EventCard
            title="Scheduled Publish"
            description="Content scheduled for publishing"
            event="scheduled.publish"
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
          Getting Started
        </h2>

        <ol style={{ marginLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
          <li>Navigate to the "Webhook" document type in the left sidebar</li>
          <li>Click "Create" to add a new webhook</li>
          <li>Enter your endpoint URL and select events to trigger</li>
          <li>Optionally configure a secret key for signature verification</li>
          <li>Save and enable the webhook</li>
          <li>Test the webhook using the test button</li>
          <li>Monitor deliveries in "Webhook Log" document type</li>
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
          🔒 Security Best Practices
        </h3>
        <ul style={{ marginLeft: '1.5rem', color: '#666', lineHeight: '1.8', marginTop: '0.5rem' }}>
          <li>Always use HTTPS endpoints</li>
          <li>Configure a secret key to verify webhook signatures</li>
          <li>Implement signature verification in your endpoint</li>
          <li>Monitor webhook logs for suspicious activity</li>
          <li>Use custom headers for additional authentication</li>
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
          Webhook Payload Structure
        </h3>
        <code
          style={{
            display: 'block',
            padding: '1rem',
            backgroundColor: '#1F2937',
            color: '#F3F4F6',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            marginTop: '0.5rem',
            overflow: 'auto',
          }}
        >
          {`{
  "event": "document.updated",
  "documentId": "doc-123",
  "documentType": "service",
  "documentTitle": "Plumbing Services",
  "timestamp": "2025-10-23T10:00:00Z",
  "dataset": "site-budds",
  "document": {...},
  "previousData": {...},
  "changes": [
    {
      "field": "title",
      "oldValue": "Old Title",
      "newValue": "New Title"
    }
  ],
  "metadata": {
    "userId": "user-123",
    "userName": "John Doe",
    "workflowState": "published"
  }
}`}
        </code>
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
          Signature Verification
        </h3>
        <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
          Verify webhook signatures in your endpoint:
        </p>
        <code
          style={{
            display: 'block',
            padding: '1rem',
            backgroundColor: '#1F2937',
            color: '#F3F4F6',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            marginTop: '0.5rem',
            overflow: 'auto',
          }}
        >
          {`const crypto = require('crypto');

// Get signature from header
const signature = request.headers['x-webhook-signature'];
const body = JSON.stringify(request.body);

// Compute expected signature
const expected = crypto
  .createHmac('sha256', SECRET_KEY)
  .update(body)
  .digest('hex');

// Verify signature
if (signature === expected) {
  // Signature valid, process webhook
} else {
  // Signature invalid, reject request
}`}
        </code>
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
          ⚡ Common Use Cases
        </h3>
        <ul style={{ marginLeft: '1.5rem', color: '#666', lineHeight: '1.8', marginTop: '0.5rem' }}>
          <li>
            <strong>Deploy Website:</strong> Trigger Vercel/Netlify deployment when content
            published
          </li>
          <li>
            <strong>Sync to CRM:</strong> Update leads in Salesforce/HubSpot when created
          </li>
          <li>
            <strong>Notifications:</strong> Send Slack/Discord alerts on content changes
          </li>
          <li>
            <strong>Analytics:</strong> Track content changes in Google Analytics or Mixpanel
          </li>
          <li>
            <strong>Search Index:</strong> Update Algolia/Elasticsearch when documents change
          </li>
          <li>
            <strong>Email Marketing:</strong> Sync contacts to Mailchimp/SendGrid
          </li>
        </ul>
      </div>
    </div>
  )
}

/**
 * Event Card Component
 */
function EventCard({
  title,
  description,
  event,
}: {
  title: string
  description: string
  event: string
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
      <p style={{ fontSize: '0.75rem', color: '#9CA3AF', fontFamily: 'monospace' }}>{event}</p>
    </div>
  )
}

export default webhookTool
