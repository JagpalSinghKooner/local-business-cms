# Workflow System Guide

**Last Updated:** October 23, 2025

## Overview

The workflow system manages content lifecycle through defined states, ensuring proper review and approval before publishing.

---

## Workflow States

### State Diagram

```
DRAFT ──────→ IN REVIEW ──────→ APPROVED ──────→ PUBLISHED
  ↑              ↓ ↑               ↓ ↑                ↓
  └──────────────┘ └───────────────┘ └────────────────→ ARCHIVED
```

### States

| State | Description | Can Edit | Can Publish |
|-------|-------------|----------|-------------|
| **Draft** | Initial content creation | ✅ Yes | ❌ No |
| **In Review** | Submitted for approval | ✅ Yes | ❌ No |
| **Approved** | Ready to publish | ❌ No | ✅ Yes |
| **Published** | Live on website | ❌ No | ✅ Already published |
| **Archived** | No longer active | ❌ No | ❌ No |

---

## State Transitions

### Allowed Transitions

**From DRAFT:**
- → In Review (submit for approval)
- → Archived (cancel content)

**From IN REVIEW:**
- → Draft (send back for revisions)
- → Approved (approve content)
- → Archived (reject and archive)

**From APPROVED:**
- → In Review (send back for re-review)
- → Published (publish to website)
- → Archived (cancel publication)

**From PUBLISHED:**
- → Draft (unpublish and edit)
- → Archived (remove from website)

**From ARCHIVED:**
- → Draft (restore content)

---

## Adding Workflow to Documents

### Step 1: Import Workflow Field

```typescript
// In your document schema file
import { workflowField } from '../fields/workflow'
```

### Step 2: Add to Document Schema

```typescript
import { defineType, defineField } from 'sanity'
import { workflowField } from '../fields/workflow'

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
    }),
    // ... other fields
    workflowField, // Add workflow field
  ],
})
```

### Step 3: Test in Studio

1. Open Sanity Studio (`/studio`)
2. Create or edit a document
3. Go to "Settings" group
4. See "Workflow" field with state selector
5. Change workflow state
6. Observe state badge in document list

---

## Using Workflow in Code

### Check Workflow State

```typescript
import { canPublish, canEdit } from '@/sanity/lib/workflow-utils'

// Check if document can be published
if (canPublish(document.workflow.state)) {
  // Publish logic
}

// Check if document can be edited
if (canEdit(document.workflow.state)) {
  // Allow editing
}
```

### Validate State Transition

```typescript
import { validateWorkflowTransition } from '@/sanity/lib/workflow-utils'

const validation = validateWorkflowTransition(currentState, newState)

if (!validation.valid) {
  console.error(validation.error)
}
```

### Filter by Workflow State

```typescript
import { getPublishedFilter } from '@/sanity/lib/workflow-utils'

// GROQ query for published documents
const query = `*[_type == "post" && ${getPublishedFilter()}]{
  title,
  slug,
  workflow
}`
```

### Get Documents Ready to Publish

```typescript
import { getReadyToPublishFilter } from '@/sanity/lib/workflow-utils'

const query = `*[_type == "post" && ${getReadyToPublishFilter()}]{
  title,
  slug
}`
```

---

## Workflow UI in Studio

### Workflow Status Tool

Access the Workflow Status Tool from the Studio toolbar:

1. Click "Workflow Status" icon in toolbar
2. View counts by workflow state
3. See workflow transition diagram
4. Quick tips and documentation

### Document List Filtering

Filter documents by workflow state:

1. Open document list
2. Click filter icon
3. Add filter: `Workflow > State > Published`
4. See only published documents

### State Badges

Workflow states are color-coded:

- 🔵 **Draft** - Gray
- 🟡 **In Review** - Amber/Yellow
- 🟢 **Approved** - Green
- 🔷 **Published** - Blue
- ⚫ **Archived** - Dark Gray

---

## Best Practices

### ✅ DO

1. **Submit for review** before publishing important content
2. **Add notes** when changing workflow states
3. **Use Draft** for work-in-progress content
4. **Archive** old content instead of deleting
5. **Document reasons** for rejections in notes

### ❌ DON'T

1. **Skip review** for critical pages (homepage, services)
2. **Edit published content** directly - unpublish first
3. **Delete** content - use Archive instead
4. **Force invalid transitions** - respect the workflow
5. **Publish without approval** for team workflows

---

## Workflow for Different Teams

### Solo Author

```
Draft → Published (simple workflow)
```

Skip In Review and Approved states for quick publishing.

### Small Team (2-3 people)

```
Draft → In Review → Published
```

One person creates, another approves.

### Large Team (4+ people)

```
Draft → In Review → Approved → Published
```

Full workflow with dedicated reviewers and publishers.

---

## Example Workflows

### Blog Post Workflow

1. **Author** creates post in Draft state
2. **Author** submits to In Review
3. **Editor** reviews and either:
   - Approves → Approved state
   - Sends back → Draft state (with notes)
4. **Publisher** publishes Approved content → Published state
5. After time, **Archive** old posts

### Service Page Workflow

1. **Marketing** creates service page in Draft
2. **Subject Expert** reviews in In Review
3. **Manager** approves in Approved
4. **Admin** publishes to Published
5. **Archive** when service discontinued

### Seasonal Content Workflow

1. Create content in Draft
2. Review and approve ahead of time
3. Wait for season
4. Publish when ready
5. Archive after season ends

---

## Troubleshooting

### Can't Change State

**Problem:** Transition not allowed

**Solution:** Check allowed transitions diagram. You may need to go through intermediate states.

### State Not Showing

**Problem:** Workflow field not visible

**Solution:**
1. Ensure workflow field added to schema
2. Check if field is in correct group
3. Refresh Studio

### Published Content Still Editable

**Problem:** Published content can be edited

**Solution:** Workflow doesn't prevent editing by default. Implement custom validation or actions to enforce read-only for published content.

---

## Advanced: Custom Workflow Actions

### Create Custom Action

```typescript
// src/sanity/actions/submitForReview.ts
import { defineAction } from 'sanity'
import { WORKFLOW_STATES } from '../schemaTypes/objects/workflowState'

export const submitForReviewAction = defineAction({
  name: 'submitForReview',
  title: 'Submit for Review',
  onHandle: async ({ draft, published }) => {
    const doc = draft || published

    if (doc?.workflow?.state === WORKFLOW_STATES.DRAFT) {
      // Update workflow state to IN_REVIEW
      // Notify reviewers
      // Return success
    }
  },
})
```

---

## API Reference

### Workflow Utilities

```typescript
import {
  isValidTransition,
  getAllowedNextStates,
  validateWorkflowTransition,
  canPublish,
  canEdit,
  getWorkflowStateDescription,
  createInitialWorkflowState,
  updateWorkflowState,
} from '@/sanity/lib/workflow-utils'
```

**`isValidTransition(current, next): boolean`**
- Check if transition is allowed

**`getAllowedNextStates(current): WorkflowState[]`**
- Get list of allowed next states

**`validateWorkflowTransition(current, next)`**
- Validate transition and return error message if invalid

**`canPublish(state): boolean`**
- Check if document can be published

**`canEdit(state): boolean`**
- Check if document can be edited

**`getWorkflowStateDescription(state): string`**
- Get human-readable description

**`createInitialWorkflowState(userId?): object`**
- Create initial workflow state (Draft)

**`updateWorkflowState(current, next, userId?, notes?): object | null`**
- Update workflow state with validation

---

## Integration with Other Systems

### Email Notifications

Send emails when workflow state changes:

```typescript
// When state changes to IN_REVIEW
sendEmail({
  to: 'reviewer@example.com',
  subject: 'Content ready for review',
  body: `${documentTitle} is ready for your review`,
})
```

### Slack Notifications

Post to Slack when content approved:

```typescript
// When state changes to APPROVED
postToSlack({
  channel: '#content-approvals',
  message: `✅ ${documentTitle} approved and ready to publish`,
})
```

---

## Future Enhancements

Potential improvements:

1. **Auto-transitions** - Automatically move to next state after time period
2. **Role-based transitions** - Only certain roles can approve
3. **Multi-step approvals** - Require 2+ approvals
4. **Workflow templates** - Different workflows for different content types
5. **Notification system** - Built-in email/Slack notifications
6. **Deadline tracking** - Set deadlines for each workflow stage

---

## Support

For workflow issues:

1. Check this guide
2. Review allowed state transitions
3. Verify workflow field is added to schema
4. Check Studio console for errors

---

**Remember:** Workflow states help maintain quality control. Always follow your team's workflow process before publishing content.
