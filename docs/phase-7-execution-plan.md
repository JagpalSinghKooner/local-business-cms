# Phase 7 Execution Plan - Enterprise Features

**Created:** October 23, 2025
**Phase:** Enterprise Features - 19 Tasks
**Current Progress:** 2/19 (11%)
**Target:** 19/19 (100%)

---

## Progress Overview

- **Total Tasks:** 19
- **Workflow & Publishing:** 5 tasks (content lifecycle)
- **Access Control:** 4 tasks (RBAC & permissions)
- **Integrations:** 4 tasks (webhooks & third-party)
- **Compliance:** 6 tasks (GDPR, CCPA, privacy)

---

## 📋 WORKFLOW & PUBLISHING (5 Tasks)

### Task 1: Content Workflow States
**Priority:** HIGH
**Estimated Time:** 2-3 hours

**Objective:** Implement content lifecycle (draft → review → approved → published)

**Implementation:**
- [ ] Add workflow state field to Sanity schemas
- [ ] Create workflow state schema type
- [ ] Add state indicators in Studio
- [ ] Build state transition logic
- [ ] Add validation rules per state
- [ ] Create workflow filter views in Studio

**States:**
- `draft` - Initial creation
- `in_review` - Submitted for approval
- `approved` - Approved, ready to publish
- `published` - Live on site
- `archived` - No longer active

**Files to Create:**
- `src/sanity/schemaTypes/objects/workflowState.ts`
- `src/sanity/lib/workflow-utils.ts`
- `src/sanity/plugins/workflowStatusTool.tsx`

---

### Task 2: Content Scheduling
**Priority:** HIGH
**Estimated Time:** 3-4 hours

**Objective:** Schedule content to publish/unpublish at specific times

**Implementation:**
- [ ] Add publishAt/unpublishAt fields to schemas
- [ ] Create scheduled publish plugin for Studio
- [ ] Build API route to check scheduled content
- [ ] Add cron job or Vercel cron for publishing
- [ ] Create scheduled content dashboard
- [ ] Add timezone support

**Features:**
- Schedule future publish date/time
- Schedule automatic unpublish
- Preview scheduled content
- Scheduled content list in Studio
- Email notifications for scheduled publishes

**Files to Create:**
- `src/sanity/schemaTypes/fields/scheduling.ts`
- `src/sanity/plugins/scheduledPublishTool.tsx`
- `src/app/api/cron/publish-scheduled/route.ts`
- `scripts/publish-scheduled-content.ts`

---

### Task 3: Approval Workflows
**Priority:** MEDIUM
**Estimated Time:** 2-3 hours

**Objective:** Multi-step approval process for content

**Implementation:**
- [ ] Add approver field to documents
- [ ] Create approval request system
- [ ] Build approval notification system
- [ ] Add approval history tracking
- [ ] Create approval dashboard in Studio
- [ ] Add approval comments

**Workflow:**
1. Author submits for review
2. Reviewer receives notification
3. Reviewer approves/rejects with comments
4. Author notified of decision
5. If approved, content moves to "approved" state

**Files to Create:**
- `src/sanity/schemaTypes/objects/approvalHistory.ts`
- `src/sanity/plugins/approvalWorkflowTool.tsx`
- `src/app/api/approval/request/route.ts`
- `src/app/api/approval/approve/route.ts`

---

### Task 4: Audit Logs
**Priority:** HIGH
**Estimated Time:** 2-3 hours

**Objective:** Track all content changes for compliance

**Implementation:**
- [ ] Create audit log document type
- [ ] Hook into Sanity mutation events
- [ ] Log create/update/delete operations
- [ ] Track user, timestamp, changes
- [ ] Build audit log viewer in Studio
- [ ] Add audit log export

**Tracked Events:**
- Document created
- Document updated (field-level changes)
- Document deleted
- Document published
- Workflow state changes
- Approvals

**Files to Create:**
- `src/sanity/schemaTypes/documents/auditLog.ts`
- `src/sanity/lib/audit-logger.ts`
- `src/sanity/plugins/auditLogTool.tsx`
- `scripts/export-audit-logs.ts`

---

### Task 5: Version History UI
**Priority:** MEDIUM
**Estimated Time:** 2 hours

**Objective:** Enhanced UI for browsing document history

**Implementation:**
- [ ] Create custom document history view
- [ ] Add visual diff viewer
- [ ] Add restore from version functionality
- [ ] Add version comparison
- [ ] Add version labels/tags

**Features:**
- Timeline view of all changes
- Side-by-side diff viewer
- One-click restore
- Version bookmarking
- Export version history

**Files to Create:**
- `src/sanity/components/VersionHistoryPanel.tsx`
- `src/sanity/components/VersionDiffViewer.tsx`
- `src/sanity/plugins/enhancedHistoryTool.tsx`

---

## 🔐 ACCESS CONTROL (4 Tasks)

### Task 6: Role-Based Access Control (RBAC)
**Priority:** HIGH
**Estimated Time:** 3-4 hours

**Objective:** Implement role-based permissions in Sanity

**Implementation:**
- [ ] Define roles (admin, editor, contributor, viewer)
- [ ] Create role schema
- [ ] Implement document-level permissions
- [ ] Implement field-level permissions
- [ ] Add role assignment UI
- [ ] Test permission enforcement

**Roles:**
- **Super Admin** - Full access, all datasets
- **Admin** - Full access, single dataset
- **Editor** - Create, edit, publish content
- **Contributor** - Create, edit (no publish)
- **Viewer** - Read-only access

**Files to Create:**
- `src/sanity/schemaTypes/documents/userRole.ts`
- `src/sanity/lib/permissions.ts`
- `src/sanity/plugins/roleManagementTool.tsx`

---

### Task 7: Custom Roles
**Priority:** MEDIUM
**Estimated Time:** 2 hours

**Objective:** Allow custom role creation with granular permissions

**Implementation:**
- [ ] Create custom role builder UI
- [ ] Define permission matrix
- [ ] Add role templates
- [ ] Export/import role configurations
- [ ] Role duplication

**Permissions Matrix:**
- Create documents
- Edit documents
- Delete documents
- Publish documents
- Access specific document types
- Access specific datasets

**Files to Create:**
- `src/sanity/components/RoleBuilder.tsx`
- `src/sanity/lib/role-templates.ts`
- `scripts/export-roles.ts`

---

### Task 8: Permission Granularity
**Priority:** MEDIUM
**Estimated Time:** 2-3 hours

**Objective:** Fine-grained permissions (field-level, dataset-level)

**Implementation:**
- [ ] Field-level read/write permissions
- [ ] Dataset-level access control
- [ ] Document-type-level permissions
- [ ] Conditional permissions based on workflow state
- [ ] Permission inheritance

**Files to Create:**
- `src/sanity/lib/permission-rules.ts`
- `src/sanity/lib/permission-checker.ts`

---

### Task 9: User Management
**Priority:** MEDIUM
**Estimated Time:** 2 hours

**Objective:** Manage Sanity users and their roles

**Implementation:**
- [ ] User list view in Studio
- [ ] Role assignment interface
- [ ] User invitation system
- [ ] User deactivation
- [ ] Activity monitoring per user

**Files to Create:**
- `src/sanity/plugins/userManagementTool.tsx`
- `src/sanity/components/UserList.tsx`
- `scripts/audit-user-access.ts`

---

## 🔗 INTEGRATIONS (4 Tasks)

### Task 10: Webhook System
**Priority:** HIGH
**Estimated Time:** 3-4 hours

**Objective:** Send webhooks on content changes

**Implementation:**
- [ ] Create webhook configuration schema
- [ ] Build webhook delivery system
- [ ] Add retry logic with exponential backoff
- [ ] Create webhook log/history
- [ ] Test webhook deliveries
- [ ] Add webhook signature verification

**Events:**
- `document.created`
- `document.updated`
- `document.deleted`
- `document.published`
- `workflow.stateChanged`

**Files to Create:**
- `src/sanity/schemaTypes/documents/webhook.ts`
- `src/app/api/webhooks/send/route.ts`
- `src/lib/webhook-sender.ts`
- `scripts/test-webhooks.ts`
- `docs/webhook-integration-guide.md`

---

### Task 11: GA4 Server-Side Tracking
**Priority:** MEDIUM
**Estimated Time:** 2-3 hours

**Objective:** Server-side Google Analytics 4 event tracking

**Implementation:**
- [ ] Set up GA4 Measurement Protocol
- [ ] Track server-side events (form submissions, conversions)
- [ ] Add event batching
- [ ] Create event builder utilities
- [ ] Test GA4 events in dashboard

**Tracked Events:**
- Form submissions (leads, contact)
- Phone number reveals
- Service inquiries
- Offer redemptions

**Files to Create:**
- `src/lib/ga4-server.ts`
- `src/app/api/track/route.ts`
- `docs/ga4-server-side-guide.md`

---

### Task 12: CRM Integrations
**Priority:** MEDIUM
**Estimated Time:** 3-4 hours

**Objective:** Sync leads to CRM systems

**Implementation:**
- [ ] Create CRM integration framework
- [ ] Add Salesforce integration
- [ ] Add HubSpot integration
- [ ] Add generic webhook integration
- [ ] Add field mapping configuration
- [ ] Test lead sync

**Supported CRMs:**
- Salesforce
- HubSpot
- Generic webhook (for any CRM)

**Files to Create:**
- `src/lib/crm/integration-framework.ts`
- `src/lib/crm/salesforce.ts`
- `src/lib/crm/hubspot.ts`
- `src/sanity/schemaTypes/documents/crmIntegration.ts`
- `docs/crm-integration-guide.md`

---

### Task 13: Email Marketing Sync
**Priority:** LOW
**Estimated Time:** 2-3 hours

**Objective:** Sync contacts to email marketing platforms

**Implementation:**
- [ ] Add Mailchimp integration
- [ ] Add SendGrid integration
- [ ] Add newsletter subscription tracking
- [ ] Add unsubscribe handling
- [ ] Test email sync

**Platforms:**
- Mailchimp
- SendGrid
- Generic API integration

**Files to Create:**
- `src/lib/email-marketing/mailchimp.ts`
- `src/lib/email-marketing/sendgrid.ts`
- `docs/email-marketing-guide.md`

---

## ⚖️ COMPLIANCE (6 Tasks)

### Task 14: Cookie Consent Management
**Priority:** HIGH
**Estimated Time:** 3-4 hours

**Objective:** GDPR/CCPA compliant cookie consent

**Implementation:**
- [ ] Create cookie consent banner component
- [ ] Add consent preferences storage
- [ ] Build cookie policy page generator
- [ ] Add consent mode for analytics
- [ ] Add granular consent categories
- [ ] Create consent management UI

**Consent Categories:**
- Essential (always on)
- Analytics (optional)
- Marketing (optional)
- Preferences (optional)

**Files to Create:**
- `src/components/compliance/CookieConsent.tsx`
- `src/lib/consent-manager.ts`
- `src/sanity/schemaTypes/singletons/cookiePolicy.ts`
- `src/app/cookie-policy/page.tsx`

---

### Task 15: GDPR Compliance Tools
**Priority:** HIGH
**Estimated Time:** 3 hours

**Objective:** GDPR data subject rights implementation

**Implementation:**
- [ ] Add data export functionality (right to access)
- [ ] Add data deletion functionality (right to erasure)
- [ ] Create data processing registry
- [ ] Add consent audit trail
- [ ] Create privacy notice generator
- [ ] Add data breach notification system

**GDPR Rights:**
- Right to access
- Right to erasure
- Right to rectification
- Right to data portability
- Right to restrict processing

**Files to Create:**
- `src/app/api/gdpr/export/route.ts`
- `src/app/api/gdpr/delete/route.ts`
- `src/lib/gdpr-compliance.ts`
- `docs/gdpr-compliance-guide.md`

---

### Task 16: CCPA Compliance Tools
**Priority:** HIGH
**Estimated Time:** 2 hours

**Objective:** California Consumer Privacy Act compliance

**Implementation:**
- [ ] Add "Do Not Sell" opt-out
- [ ] Create CCPA disclosure page
- [ ] Add data sale opt-out tracking
- [ ] Build CCPA request handler
- [ ] Add California-specific notices

**Files to Create:**
- `src/components/compliance/DoNotSell.tsx`
- `src/app/api/ccpa/opt-out/route.ts`
- `src/app/ccpa-privacy-notice/page.tsx`

---

### Task 17: Data Export/Deletion
**Priority:** HIGH
**Estimated Time:** 2-3 hours

**Objective:** Automated data export and deletion for users

**Implementation:**
- [ ] Build user data export API
- [ ] Create data deletion workflow
- [ ] Add verification before deletion
- [ ] Export data in machine-readable format (JSON)
- [ ] Send export via email
- [ ] Log all export/deletion requests

**Files to Create:**
- `src/app/api/data/export/route.ts`
- `src/app/api/data/delete/route.ts`
- `src/lib/data-export.ts`
- `scripts/batch-data-deletion.ts`

---

### Task 18: Privacy Policy Automation
**Priority:** MEDIUM
**Estimated Time:** 2 hours

**Objective:** Dynamic privacy policy generation

**Implementation:**
- [ ] Create privacy policy schema
- [ ] Add policy sections (data collection, usage, sharing)
- [ ] Build policy template system
- [ ] Add last updated tracking
- [ ] Create policy version history
- [ ] Generate PDF exports

**Files to Create:**
- `src/sanity/schemaTypes/singletons/privacyPolicy.ts`
- `src/app/privacy-policy/page.tsx`
- `src/lib/policy-generator.ts`

---

### Task 19: Terms of Service Management
**Priority:** MEDIUM
**Estimated Time:** 2 hours

**Objective:** Manage and version terms of service

**Implementation:**
- [ ] Create ToS schema
- [ ] Add version tracking
- [ ] Build acceptance tracking
- [ ] Add effective date management
- [ ] Create ToS acceptance modal
- [ ] Generate PDF exports

**Files to Create:**
- `src/sanity/schemaTypes/singletons/termsOfService.ts`
- `src/app/terms-of-service/page.tsx`
- `src/components/compliance/TosAcceptance.tsx`

---

## 📊 Session Plan

### Session 1 (4-5 hours)
**Focus:** Workflow & Publishing (Tasks 1-2)
- Task 1: Content workflow states
- Task 2: Content scheduling

### Session 2 (4-5 hours)
**Focus:** Workflow & Publishing + Access Control (Tasks 3-6)
- Task 3: Approval workflows
- Task 4: Audit logs
- Task 5: Version history UI
- Task 6: RBAC basics

### Session 3 (3-4 hours)
**Focus:** Access Control (Tasks 7-9)
- Task 7: Custom roles
- Task 8: Permission granularity
- Task 9: User management

### Session 4 (4-5 hours)
**Focus:** Integrations (Tasks 10-11)
- Task 10: Webhook system
- Task 11: GA4 server-side tracking

### Session 5 (4-5 hours)
**Focus:** Integrations + Compliance Start (Tasks 12-14)
- Task 12: CRM integrations
- Task 13: Email marketing sync
- Task 14: Cookie consent

### Session 6 (4-5 hours)
**Focus:** Compliance (Tasks 15-19)
- Task 15: GDPR tools
- Task 16: CCPA tools
- Task 17: Data export/deletion
- Task 18: Privacy policy automation
- Task 19: Terms of service management

---

## ✅ Completion Checklist

**Phase 7 Complete When:**
- [ ] All 19 tasks complete
- [ ] Documentation updated
- [ ] All tests passing
- [ ] TypeScript errors: 0
- [ ] Security review complete
- [ ] Compliance verified

**Production Ready When:**
- [ ] Workflow states enforce content lifecycle
- [ ] Scheduled publishing tested
- [ ] RBAC prevents unauthorized access
- [ ] Webhooks deliver reliably
- [ ] Cookie consent is GDPR/CCPA compliant
- [ ] Data export/deletion works
- [ ] All integrations tested

---

## 🎯 Success Metrics

**Target Outcomes:**
- 100% Phase 7 completion (19/19 tasks)
- Enterprise-grade workflow system
- Full compliance with GDPR/CCPA
- Reliable webhook integrations
- Comprehensive access control
- Audit trail for all changes

---

## 📝 Notes & Decisions

**2025-10-23:** Phase 7 plan created, ready to start

---

**Last Updated:** October 23, 2025
**Next Session:** Task 1 - Content Workflow States
**Overall Phase 7 Progress:** 0/19 → Target 19/19
