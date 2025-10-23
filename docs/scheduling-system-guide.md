# Content Scheduling System Guide

**Last Updated:** October 23, 2025

## Overview

The scheduling system allows you to schedule content to automatically publish and unpublish at specific times. Perfect for:
- **Seasonal offers** (publish Black Friday deals automatically)
- **Limited-time promotions** (auto-unpublish after expiration)
- **Content embargoes** (publish press releases at exact time)
- **Event pages** (auto-remove after event ends)

---

## How It Works

### Publishing Flow

```
1. Create content → 2. Set publishAt date → 3. Wait → 4. Auto-publish at scheduled time
```

### Unpublishing Flow

```
1. Published content → 2. Set unpublishAt date → 3. Wait → 4. Auto-archive at scheduled time
```

### Automation

Content is automatically published/unpublished by:
- **Vercel Cron:** Runs every 15 minutes (configured in `vercel.json`)
- **Manual script:** `pnpm publish-scheduled` for testing or fallback

---

## Adding Scheduling to Documents

### Method 1: Individual Fields (Recommended)

Add `publishAt` and `unpublishAt` fields separately:

```typescript
import { defineType, defineField } from 'sanity'
import { publishAtField, unpublishAtField } from '../fields/scheduling'

export default defineType({
  name: 'offer',
  title: 'Special Offer',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    // ... other fields
    publishAtField,
    unpublishAtField,
  ],
})
```

### Method 2: Combined Scheduling Object

Use a grouped scheduling section:

```typescript
import { schedulingObject } from '../fields/scheduling'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    // ... other fields
    schedulingObject,
  ],
})
```

---

## Using Scheduling in Studio

### Scheduling a Document

1. Open document in Studio
2. Find "Publish At" field
3. Click calendar icon
4. Select date and time
5. Save document

### Scheduled Documents List

To view all scheduled documents:

1. Open document list
2. Add filter: `Publish At > Is not empty`
3. Sort by: `Publish At (ascending)`

---

## Cron Configuration

### Vercel Cron (Recommended)

Configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/publish-scheduled",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

**Schedule:** Every 15 minutes

**Security:** Requires `CRON_SECRET` environment variable

### Environment Variables

Required for cron to work:

```env
SANITY_API_TOKEN=your_token_here  # Write permissions
CRON_SECRET=your_secret_key_here  # For cron auth
```

### Testing Cron Endpoint

```bash
# Test the cron endpoint
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-site.com/api/cron/publish-scheduled
```

---

## Manual Publishing

### Using CLI Script

```bash
# Check what would be published (dry run)
pnpm publish-scheduled --dry-run

# Publish scheduled content
pnpm publish-scheduled

# Publish for specific dataset
pnpm publish-scheduled --dataset=site-budds

# Verbose mode
pnpm publish-scheduled --verbose
```

### Script Output

```
📅 Scheduled Content Publisher

Dataset: site-budds

📥 Checking for documents ready to publish...

Found 2 document(s) ready to publish:

  📄 Black Friday Sale 2025
     Type: offer
     Scheduled: 11/24/2025, 12:00:00 AM
     Current State: approved
     ✅ Published successfully

  📄 Holiday Hours
     Type: page
     Scheduled: 12/20/2025, 9:00:00 AM
     Current State: approved
     ✅ Published successfully

====================================================
SUMMARY
====================================================
Documents to publish: 2
Documents to unpublish: 0

✅ Scheduled publishing completed
```

---

## Use Cases

### Use Case 1: Black Friday Sale

**Scenario:** Launch Black Friday sale automatically at midnight

**Setup:**
1. Create offer document
2. Set workflow state to "Approved"
3. Set publishAt: `2025-11-29 00:00:00`
4. Set unpublishAt: `2025-12-02 23:59:59`
5. Save

**Result:**
- Offer auto-publishes Nov 29 at midnight
- Offer auto-archives Dec 2 at 11:59 PM

---

### Use Case 2: Press Release Embargo

**Scenario:** Publish press release at exact time

**Setup:**
1. Create page document
2. Write content
3. Set publishAt: `2025-12-01 09:00:00`
4. Approve content
5. Wait

**Result:**
- Page publishes exactly at 9:00 AM on Dec 1

---

### Use Case 3: Event Page

**Scenario:** Remove event page after event ends

**Setup:**
1. Publish event page manually
2. Set unpublishAt: `2025-06-15 23:59:59` (day after event)
3. Save

**Result:**
- Page automatically archived after event ends

---

### Use Case 4: Weekly Blog Posts

**Scenario:** Schedule blog posts for consistent weekly publishing

**Setup:**
1. Write 4 blog posts
2. Schedule them:
   - Post 1: Monday 9:00 AM
   - Post 2: Monday 9:00 AM (next week)
   - Post 3: Monday 9:00 AM (week after)
   - Post 4: Monday 9:00 AM (3 weeks out)

**Result:**
- New blog post publishes every Monday at 9 AM

---

## Timezone Support

### Setting Timezone (Scheduling Object Only)

When using `schedulingObject`:

```typescript
scheduling: {
  publishAt: '2025-12-01T09:00:00',
  timezone: 'America/New_York', // Eastern Time
}
```

**Available Timezones:**
- Eastern Time (ET): `America/New_York`
- Central Time (CT): `America/Chicago`
- Mountain Time (MT): `America/Denver`
- Pacific Time (PT): `America/Los_Angeles`
- UTC: `UTC`

### Without Timezone Field

When using individual `publishAt`/`unpublishAt` fields:
- Dates are stored in UTC
- Converted to local time in Studio
- Always use Studio's date picker for accurate times

---

## Workflow Integration

Scheduling works with workflow states:

| Workflow State | Scheduling Behavior |
|----------------|---------------------|
| **Draft** | Scheduled publish won't trigger (needs approval first) |
| **In Review** | Scheduled publish won't trigger |
| **Approved** | ✅ Will auto-publish at scheduled time |
| **Published** | Will auto-unpublish if unpublishAt set |
| **Archived** | Scheduled dates ignored |

**Best Practice:** Approve content before scheduling to publish

---

## Monitoring Scheduled Content

### View Upcoming Scheduled Publishes

GROQ Query:

```groq
*[publishAt != null && publishAt > now()] | order(publishAt asc) {
  title,
  publishAt,
  unpublishAt,
  workflow
}
```

### View Past Due (Should Have Published)

```groq
*[
  publishAt != null &&
  publishAt <= now() &&
  workflow.state != "published"
] {
  title,
  publishAt,
  workflow
}
```

### Check Cron Job Status

View logs in Vercel dashboard:
1. Go to Vercel project
2. Click "Deployments"
3. Click latest deployment
4. Click "Functions" tab
5. Find `/api/cron/publish-scheduled`
6. View execution logs

---

## Troubleshooting

### Scheduled Content Not Publishing

**Problem:** Content scheduled but didn't publish

**Possible Causes:**
1. **Workflow state wrong** - Must be "Approved" to auto-publish
2. **Cron not running** - Check Vercel cron logs
3. **CRON_SECRET mismatch** - Verify environment variable
4. **No write token** - Check SANITY_API_TOKEN is set
5. **Timezone confusion** - Double-check scheduled time

**Solutions:**
- Run manually: `pnpm publish-scheduled`
- Check cron logs in Vercel
- Verify environment variables
- Test cron endpoint manually

---

### Content Published Too Early/Late

**Problem:** Published at wrong time

**Solutions:**
1. Check timezone settings
2. Verify Vercel cron schedule (15-minute intervals)
3. Use exact times divisible by 15 (9:00, 9:15, 9:30, 9:45)

---

### Cron Endpoint Returns 401

**Problem:** Unauthorized error when calling cron

**Solution:**
- Ensure `CRON_SECRET` is set in Vercel
- Include secret in Authorization header
- Regenerate secret if compromised

---

## Best Practices

### ✅ DO

1. **Approve content first** before scheduling
2. **Test with dry-run** before real scheduling
3. **Monitor cron logs** regularly
4. **Set both publish and unpublish** for limited-time content
5. **Use consistent timezone** across team
6. **Schedule 1+ hour ahead** for safety buffer

### ❌ DON'T

1. **Schedule in Draft state** - won't publish
2. **Rely on second-level precision** - cron runs every 15 min
3. **Forget to set workflow** to Approved
4. **Schedule past dates** unless you want immediate publish
5. **Skip testing** - always dry-run first

---

## Advanced: Custom Cron Schedule

### Change Cron Frequency

Edit `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/publish-scheduled",
      "schedule": "*/5 * * * *"  // Every 5 minutes
    }
  ]
}
```

**Cron Expression Format:**
```
*/15  *  *  *  *
 │    │  │  │  │
 │    │  │  │  └─ day of week (0-7)
 │    │  │  └──── month (1-12)
 │    │  └─────── day of month (1-31)
 │    └────────── hour (0-23)
 └─────────────── minute (0-59)
```

**Examples:**
- `*/5 * * * *` - Every 5 minutes
- `0 * * * *` - Every hour
- `0 9 * * *` - Daily at 9:00 AM
- `0 9 * * 1` - Every Monday at 9:00 AM

---

## API Reference

### Scheduling Utilities

```typescript
import {
  shouldPublishNow,
  shouldUnpublishNow,
  isScheduledForFuture,
  getTimeUntilPublish,
  formatTimeUntilPublish,
  hasScheduling,
  getSchedulingSummary,
} from '@/lib/scheduling-utils'
```

**`shouldPublishNow(doc): boolean`**
- Returns true if document should be published now

**`shouldUnpublishNow(doc): boolean`**
- Returns true if document should be unpublished now

**`isScheduledForFuture(doc): boolean`**
- Returns true if document is scheduled for future publish

**`getTimeUntilPublish(doc): number | null`**
- Returns milliseconds until publish time

**`formatTimeUntilPublish(doc): string | null`**
- Returns human-readable time until publish ("2 days", "3 hours")

**`hasScheduling(doc): boolean`**
- Returns true if document has scheduling configured

**`getSchedulingSummary(doc): object`**
- Returns comprehensive scheduling status

---

## Security Considerations

1. **CRON_SECRET** - Keep secret, rotate regularly
2. **SANITY_API_TOKEN** - Needs write permissions (secure)
3. **Endpoint protection** - Only accessible with correct secret
4. **Audit trail** - All auto-publishes logged in workflow notes

---

## Future Enhancements

Potential improvements:

1. **Email notifications** - Alert when content publishes
2. **Slack integration** - Post to channel on publish
3. **Scheduling dashboard** - Visual calendar of scheduled content
4. **Bulk scheduling** - Schedule multiple documents at once
5. **Recurring schedules** - Publish same content weekly/monthly
6. **Preview scheduled state** - See how published content will look

---

## Support

For scheduling issues:

1. Check this guide
2. Run dry-run: `pnpm publish-scheduled --dry-run`
3. Check Vercel cron logs
4. Test cron endpoint manually
5. Verify environment variables

---

**Remember:** Scheduling automates publishing, but you control the schedule. Always approve content before scheduling to ensure quality!
