# Audit Logs System Guide

**Last Updated:** October 23, 2025

## Overview

The audit logs system provides comprehensive tracking of all content changes for compliance, security, and accountability. Every content modification is automatically logged with user attribution, timestamps, and detailed change information.

---

## Key Features

- **Automatic Logging:** All content changes are tracked automatically
- **Immutable Records:** Audit logs cannot be modified or deleted
- **Detailed Change Tracking:** Field-level change tracking with before/after values
- **User Attribution:** Track who made each change
- **Compliance Ready:** Export logs for compliance reports (GDPR, CCPA, SOC 2)
- **Search & Filter:** Query logs by action, user, document type, or date range
- **Multiple Export Formats:** JSON and CSV export options

---

## Tracked Events

| Action | Description | When Triggered |
|--------|-------------|----------------|
| **created** | Document creation | New document created |
| **updated** | Document modification | Existing document updated |
| **deleted** | Document deletion | Document deleted |
| **published** | Content published | Document published to website |
| **unpublished** | Content unpublished | Published document unpublished |
| **workflow_changed** | Workflow state change | Workflow state transition |
| **scheduled** | Scheduled publish | Content scheduled for future publish |

---

## Audit Log Data Structure

Each audit log entry contains:

```typescript
{
  _type: 'auditLog',
  _id: 'unique-log-id',
  _createdAt: '2025-10-23T10:00:00Z',

  // Core Information
  action: 'updated',                    // Type of action
  documentId: 'doc-123',                // ID of affected document
  documentType: 'service',              // Type of document
  documentTitle: 'Plumbing Services',   // Title at time of change
  timestamp: '2025-10-23T10:00:00Z',    // When action occurred

  // User Information
  userId: 'user-456',                   // ID of user who made change
  userName: 'John Doe',                 // User's display name
  userEmail: 'john@example.com',        // User's email

  // Change Details
  changes: [
    {
      field: 'title',
      oldValue: 'Old Title',
      newValue: 'New Title'
    }
  ],

  // Metadata
  metadata: {
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    dataset: 'site-budds',
    previousWorkflowState: 'draft',
    newWorkflowState: 'published'
  },

  // Notes
  notes: 'Content published automatically by scheduler'
}
```

---

## Using Audit Logs

### Viewing Logs in Studio

1. Open Sanity Studio (`/studio`)
2. Click "Audit Logs" in the tools menu (top navigation)
3. View tracked events dashboard
4. Navigate to "Audit Log" document type to browse all logs

### Filtering Logs

Use GROQ queries to filter logs:

```groq
// All logs for a specific document
*[_type == "auditLog" && documentId == "doc-123"] | order(timestamp desc)

// All publish actions
*[_type == "auditLog" && action == "published"] | order(timestamp desc)

// All changes by a user
*[_type == "auditLog" && userId == "user-456"] | order(timestamp desc)

// All changes in date range
*[
  _type == "auditLog" &&
  timestamp >= "2025-01-01T00:00:00Z" &&
  timestamp <= "2025-12-31T23:59:59Z"
] | order(timestamp desc)
```

---

## Programmatic Usage

### Creating Audit Logs

```typescript
import { createAuditLog } from '@/sanity/lib/audit-logger'

// Create custom audit log
await createAuditLog({
  action: 'updated',
  documentId: doc._id,
  documentType: doc._type,
  documentTitle: doc.title,
  userId: user.id,
  userName: user.name,
  userEmail: user.email,
  changes: [
    {
      field: 'title',
      oldValue: 'Old Title',
      newValue: 'New Title',
    },
  ],
  metadata: {
    ipAddress: request.ip,
    userAgent: request.headers['user-agent'],
  },
  notes: 'Updated via API',
})
```

### Helper Functions

```typescript
import {
  logDocumentCreated,
  logDocumentUpdated,
  logDocumentDeleted,
  logWorkflowChanged,
  logContentPublished,
  logContentUnpublished,
  logScheduledPublish,
} from '@/sanity/lib/audit-logger'

// Log document creation
await logDocumentCreated(
  documentId,
  documentType,
  documentTitle,
  userId,
  userName
)

// Log document update with field changes
await logDocumentUpdated(
  documentId,
  documentType,
  documentTitle,
  [
    { field: 'title', oldValue: 'Old', newValue: 'New' },
    { field: 'description', oldValue: 'Old desc', newValue: 'New desc' },
  ],
  userId,
  userName
)

// Log workflow state change
await logWorkflowChanged(
  documentId,
  documentType,
  documentTitle,
  'draft',      // previousState
  'published',  // newState
  userId,
  userName,
  'Published after review'
)
```

### Querying Logs

```typescript
import {
  getAuditLogsForDocument,
  getRecentAuditLogs,
  getAuditLogsByAction,
  getAuditLogsByUser,
} from '@/sanity/lib/audit-logger'

// Get logs for specific document (last 50)
const logs = await getAuditLogsForDocument('doc-123', 50)

// Get recent logs (last 100)
const recentLogs = await getRecentAuditLogs(100)

// Get all publish actions (last 50)
const publishLogs = await getAuditLogsByAction('published', 50)

// Get all changes by user (last 50)
const userLogs = await getAuditLogsByUser('user-456', 50)
```

---

## Exporting Audit Logs

### CLI Export

Use the `export-audit-logs` command to export logs for compliance reports:

```bash
# Export all logs
pnpm export-audit-logs

# Export logs for date range
pnpm export-audit-logs --start=2025-01-01 --end=2025-12-31

# Export specific action type
pnpm export-audit-logs --action=published

# Export logs by user
pnpm export-audit-logs --user=user-456

# Export logs by document type
pnpm export-audit-logs --type=service

# Export to CSV format
pnpm export-audit-logs --format=csv

# Custom output filename
pnpm export-audit-logs --output=compliance-report-2025.json

# Verbose output with sample entries
pnpm export-audit-logs --verbose

# Multi-dataset export
pnpm export-audit-logs --dataset=site-budds
pnpm export-audit-logs --dataset=site-hvac
```

### Export Output

**JSON Format:**
```json
[
  {
    "_id": "audit-123",
    "_type": "auditLog",
    "action": "published",
    "documentId": "doc-456",
    "documentType": "service",
    "documentTitle": "Plumbing Services",
    "userId": "user-789",
    "userName": "John Doe",
    "timestamp": "2025-10-23T10:00:00Z",
    "changes": [...],
    "metadata": {...},
    "notes": "Published after approval"
  }
]
```

**CSV Format:**
```csv
Timestamp,Action,Document ID,Document Type,Document Title,User ID,User Name,User Email,Changes,Notes,IP Address,Dataset
2025-10-23T10:00:00Z,published,doc-456,service,Plumbing Services,user-789,John Doe,john@example.com,"title: Old → New",Published after approval,192.168.1.1,site-budds
```

### Programmatic Export

```typescript
import { exportAuditLogs } from '@/sanity/lib/audit-logger'

// Export all logs
const allLogs = await exportAuditLogs()

// Export logs for date range
const logs = await exportAuditLogs(
  '2025-01-01T00:00:00Z',  // startDate
  '2025-12-31T23:59:59Z'   // endDate
)

// Save to file
import fs from 'fs'
fs.writeFileSync('audit-logs.json', JSON.stringify(logs, null, 2))
```

---

## Compliance Use Cases

### GDPR Compliance

**Right to Access:**
```bash
# Export all logs for a specific user
pnpm export-audit-logs --user=user-123 --output=user-data-request.json
```

**Right to Erasure:**
```typescript
// Query logs before deleting user data
const userLogs = await getAuditLogsByUser(userId)
// Document what data was deleted
await logDocumentDeleted(userId, 'user', userName, 'system', 'GDPR deletion request')
```

### SOC 2 Compliance

**Access Control Audit:**
```bash
# Export all creation and deletion events
pnpm export-audit-logs --action=created --output=access-audit-created.json
pnpm export-audit-logs --action=deleted --output=access-audit-deleted.json
```

**Change Management:**
```bash
# Export all workflow changes
pnpm export-audit-logs --action=workflow_changed --output=workflow-audit.json
```

### Regular Compliance Reports

**Monthly Reports:**
```bash
# Export logs for previous month
pnpm export-audit-logs \
  --start=2025-09-01 \
  --end=2025-09-30 \
  --format=csv \
  --output=audit-report-sept-2025.csv
```

**Quarterly Reviews:**
```bash
# Export Q4 2025 logs
pnpm export-audit-logs \
  --start=2025-10-01 \
  --end=2025-12-31 \
  --format=csv \
  --output=audit-report-q4-2025.csv
```

---

## Automatic Audit Logging

### Document Actions

Audit logs are automatically created for:

1. **Document Creation** (via Studio or API)
2. **Document Updates** (via Studio or API)
3. **Document Deletion** (via Studio or API)
4. **Workflow State Changes** (via workflow system)
5. **Scheduled Publishing** (via cron job)

### Integration with Workflow System

```typescript
// Example: Workflow transition automatically creates audit log
import { updateWorkflowState } from '@/sanity/lib/workflow-utils'
import { logWorkflowChanged } from '@/sanity/lib/audit-logger'

async function transitionWorkflow(
  documentId: string,
  documentType: string,
  documentTitle: string,
  newState: WorkflowState,
  userId: string,
  userName: string
) {
  const currentState = await getCurrentWorkflowState(documentId)

  // Update workflow state
  await updateWorkflowState(documentId, newState, userId)

  // Automatically log the change
  await logWorkflowChanged(
    documentId,
    documentType,
    documentTitle,
    currentState,
    newState,
    userId,
    userName
  )
}
```

---

## Security & Best Practices

### Security

1. **Immutable Logs:** Set `readOnly: true` on audit log schema
2. **API Token Required:** Use `SANITY_API_TOKEN` for write operations
3. **No Manual Editing:** Users cannot modify logs via Studio
4. **Tamper Detection:** All logs include creation timestamp

### Best Practices

1. **Review Regularly:** Check logs weekly for suspicious activity
2. **Export Monthly:** Export logs monthly for compliance records
3. **Use Filters:** Use filters to investigate specific incidents
4. **Monitor Users:** Track high-privilege user actions
5. **Retention Policy:** Define how long to retain logs (e.g., 7 years for compliance)
6. **Backup Exports:** Store exported logs in secure, backed-up location
7. **Incident Response:** Use logs to investigate security incidents

### Retention & Storage

```typescript
// Example: Delete logs older than 7 years (compliance retention)
const sevenYearsAgo = new Date()
sevenYearsAgo.setFullYear(sevenYearsAgo.getFullYear() - 7)

const oldLogs = await client.fetch(`
  *[_type == "auditLog" && timestamp < $cutoffDate]._id
`, { cutoffDate: sevenYearsAgo.toISOString() })

// Archive before deletion
await exportAuditLogs(undefined, sevenYearsAgo.toISOString())

// Then delete (only after archiving!)
for (const id of oldLogs) {
  await client.delete(id)
}
```

---

## Troubleshooting

### Logs Not Being Created

**Check 1: API Token**
```bash
# Verify SANITY_API_TOKEN is set
echo $SANITY_API_TOKEN
```

**Check 2: Schema Registration**
```typescript
// Verify auditLog is in schema index
import auditLog from './documents/auditLog'
const documentTypes = [
  // ...
  auditLog, // ✅ Must be included
]
```

**Check 3: Logger Import**
```typescript
// Verify you're importing from correct path
import { createAuditLog } from '@/sanity/lib/audit-logger' // ✅ Correct
```

### Export Failing

**Check 1: Permissions**
```bash
# Verify token has read permissions
# Check Sanity project settings > API > Tokens
```

**Check 2: Date Format**
```bash
# Use ISO 8601 format
pnpm export-audit-logs --start=2025-01-01 # ✅ Correct
pnpm export-audit-logs --start=01/01/2025 # ❌ Wrong format
```

**Check 3: Dataset**
```bash
# Specify dataset explicitly
pnpm export-audit-logs --dataset=site-budds
```

### Performance

**Issue: Slow Queries**
```typescript
// Use indexed fields in queries
*[_type == "auditLog" && timestamp >= $start] // ✅ Fast (timestamp indexed)
*[_type == "auditLog" && notes match "*error*"] // ❌ Slow (full text search)
```

**Issue: Large Exports**
```typescript
// Export in batches by date range
await exportAuditLogs('2025-01-01', '2025-03-31') // Q1
await exportAuditLogs('2025-04-01', '2025-06-30') // Q2
await exportAuditLogs('2025-07-01', '2025-09-30') // Q3
await exportAuditLogs('2025-10-01', '2025-12-31') // Q4
```

---

## API Reference

### Core Functions

#### `createAuditLog(entry: AuditLogEntry): Promise<void>`
Creates a new audit log entry.

**Parameters:**
- `entry`: Audit log entry object

**Returns:** Promise that resolves when log is created

#### `logDocumentCreated(documentId, documentType, documentTitle?, userId?, userName?): Promise<void>`
Logs document creation.

#### `logDocumentUpdated(documentId, documentType, documentTitle?, changes?, userId?, userName?): Promise<void>`
Logs document update with optional field changes.

#### `logDocumentDeleted(documentId, documentType, documentTitle?, userId?, userName?): Promise<void>`
Logs document deletion.

#### `logWorkflowChanged(documentId, documentType, documentTitle, previousState, newState, userId?, userName?, notes?): Promise<void>`
Logs workflow state change.

#### `logContentPublished(documentId, documentType, documentTitle?, userId?, userName?): Promise<void>`
Logs content publication.

#### `logContentUnpublished(documentId, documentType, documentTitle?, userId?, userName?): Promise<void>`
Logs content unpublication.

#### `logScheduledPublish(documentId, documentType, documentTitle, publishAt, unpublishAt?): Promise<void>`
Logs scheduled publish action.

### Query Functions

#### `getAuditLogsForDocument(documentId, limit?): Promise<any[]>`
Gets audit logs for a specific document.

**Parameters:**
- `documentId`: Document ID to query
- `limit`: Max number of logs (default: 50)

**Returns:** Array of audit log entries

#### `getRecentAuditLogs(limit?): Promise<any[]>`
Gets recent audit logs across all documents.

**Parameters:**
- `limit`: Max number of logs (default: 100)

**Returns:** Array of audit log entries

#### `getAuditLogsByAction(action, limit?): Promise<any[]>`
Gets audit logs filtered by action type.

**Parameters:**
- `action`: Action type (created, updated, deleted, etc.)
- `limit`: Max number of logs (default: 50)

**Returns:** Array of audit log entries

#### `getAuditLogsByUser(userId, limit?): Promise<any[]>`
Gets audit logs for a specific user.

**Parameters:**
- `userId`: User ID to query
- `limit`: Max number of logs (default: 50)

**Returns:** Array of audit log entries

#### `exportAuditLogs(startDate?, endDate?): Promise<any[]>`
Exports audit logs for a date range.

**Parameters:**
- `startDate`: Start date (ISO 8601 format)
- `endDate`: End date (ISO 8601 format)

**Returns:** Array of all matching audit log entries

---

## Related Documentation

- [Workflow System Guide](./workflow-system-guide.md) - Content workflow states
- [Scheduling System Guide](./scheduling-system-guide.md) - Scheduled publishing
- [CMS Modernization Roadmap](./cms-modernization-roadmap.md) - Overall project roadmap

---

## Support

For questions or issues:
1. Check this guide
2. Review existing audit logs in Studio
3. Test with `--dry-run` flags when available
4. Consult the team for compliance requirements
