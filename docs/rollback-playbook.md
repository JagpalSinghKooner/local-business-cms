# Rollback Playbook

**Last Updated:** October 23, 2025
**Priority:** CRITICAL - Read this before deploying to production

## Overview

This playbook provides step-by-step procedures for rolling back different types of changes in the multi-tenant platform. **Keep this document accessible during all deployments.**

---

## Quick Reference

| Type | Rollback Time | Downtime | Risk Level |
|------|---------------|----------|------------|
| Vercel Deployment | < 1 minute | None | ✅ Low |
| Git Revert | 2-5 minutes | None (CI/CD) | ✅ Low |
| Schema Changes | 5-15 minutes | Minimal | ⚠️ Medium |
| Content Changes | 1-2 minutes | None | ✅ Low |
| Configuration | 2-5 minutes | None | ⚠️ Medium |
| Database Migration | 15-30 minutes | Possible | 🔴 High |

---

## Emergency Rollback Command

```bash
# Quick rollback script (automated)
pnpm rollback --type=deployment --target=DEPLOYMENT_ID

# Or manual Vercel rollback
vercel rollback DEPLOYMENT_URL --yes
```

---

## 1. Vercel Deployment Rollback

### When to Use
- Production issues after deployment
- Performance degradation
- Critical bugs in production
- Failed deployment verification

### ✅ Instant Rollback (Recommended)

**Time:** < 1 minute | **Downtime:** None

```bash
# Via Vercel CLI
vercel rollback https://your-site.vercel.app --yes

# Or via Vercel Dashboard
# 1. Go to vercel.com/dashboard
# 2. Select project
# 3. Click "Deployments"
# 4. Find previous working deployment
# 5. Click "..." → "Promote to Production"
```

**Verification:**
```bash
# Check deployment is live
curl -I https://your-site.com

# Run smoke tests
pnpm test:smoke --url=https://your-site.com
```

### 🔄 Rollback with CI/CD

**Time:** 3-5 minutes | **Downtime:** None

```bash
# 1. Identify last good deployment
git log --oneline -10

# 2. Create revert commit
git revert <commit-hash>

# 3. Push to trigger new deployment
git push origin main

# 4. Monitor deployment
vercel --prod
```

---

## 2. Git Code Rollback

### When to Use
- Bug introduced in recent commit
- Feature needs to be removed
- Breaking changes discovered
- CI/CD pipeline failed

### Single Commit Revert

```bash
# 1. Identify problematic commit
git log --oneline -10

# 2. Revert the commit
git revert <commit-hash>

# 3. Push revert
git push origin main

# 4. Verify CI/CD triggered
# Check GitHub Actions or Vercel dashboard
```

### Multiple Commits Revert

```bash
# Revert range of commits (oldest to newest)
git revert <oldest-commit>..<newest-commit>

# Or revert multiple specific commits
git revert <commit1> <commit2> <commit3>

# Push all reverts
git push origin main
```

### Hard Reset (Use with Caution)

**⚠️ WARNING:** Only use if you're the only developer or after team coordination.

```bash
# 1. Identify target commit
git log --oneline -10

# 2. Reset to target commit
git reset --hard <target-commit>

# 3. Force push (DANGEROUS)
git push --force origin main

# 4. Notify team immediately
```

---

## 3. Sanity Schema Rollback

### When to Use
- Schema deployment broke Studio
- Field changes cause validation errors
- Migration failed

### ⚠️ Important Notes
- Schema changes are **immediately live** across all datasets
- Can't "undo" - must deploy corrected schema
- May affect existing content

### Rollback Procedure

**Time:** 5-15 minutes | **Risk:** Medium

```bash
# 1. Identify last working schema
git log --oneline src/sanity/schemaTypes/

# 2. Checkout previous schema files
git checkout <commit-hash> -- src/sanity/schemaTypes/

# 3. Verify schema locally
# Open Studio and check for errors

# 4. Deploy corrected schema
pnpm deploy-schema-all

# 5. Verify in Studio
# Open Studio for each dataset and test
```

### Emergency: Disable Field

If a field is causing issues but you can't fully revert:

```typescript
// Temporarily hide problematic field
defineField({
  name: 'problematicField',
  type: 'string',
  hidden: true, // 👈 Hide from Studio
  readOnly: true, // 👈 Prevent edits
})
```

### Rollback Checklist

- [ ] Identify exact schema changes that broke
- [ ] Test schema fix locally
- [ ] Deploy to staging/test dataset first
- [ ] Verify Studio loads without errors
- [ ] Deploy to production datasets
- [ ] Run schema diff: `pnpm schema-diff --all`
- [ ] Document what went wrong

---

## 4. Content Rollback (Sanity Documents)

### When to Use
- Accidental content deletion
- Bad bulk update
- Content corruption
- Test data in production

### Using Sanity History (Recommended)

**Time:** 1-2 minutes | **Downtime:** None

```bash
# Via Sanity Studio UI:
# 1. Open document
# 2. Click "..." menu → "Review changes"
# 3. Browse document history
# 4. Click on previous version
# 5. Click "Restore this version"
```

### Via Sanity CLI

```bash
# Export current state (backup)
pnpm sanity:export --dataset=site-budds

# View document history
sanity documents query '*[_id == "doc-id"]' --dataset=site-budds --api-version=v2021-10-21

# Restore from backup (if needed)
pnpm sanity:import backup.ndjson --dataset=site-budds
```

### Bulk Content Rollback

If you made a bad bulk update:

```bash
# 1. Export current state
pnpm sanity:export --dataset=site-budds --output=pre-rollback-$(date +%Y%m%d).ndjson

# 2. Identify documents to fix
pnpm bulk-update --dataset=site-budds --type=service --dry-run --show-affected

# 3. Revert changes (if you have backup)
pnpm migrate-content --from=BACKUP_DATASET --to=site-budds --type=service --all --update-existing
```

---

## 5. Environment Configuration Rollback

### When to Use
- Bad environment variable update
- API key rotation issues
- Feature flag mishap

### Vercel Environment Variables

```bash
# Via Vercel Dashboard:
# 1. Go to Project Settings → Environment Variables
# 2. Find the variable
# 3. Click "..." → "Edit"
# 4. Restore previous value
# 5. Redeploy: vercel --prod

# Via Vercel CLI:
vercel env pull .env.local
# Edit .env.local to restore values
vercel env add VARIABLE_NAME production
vercel --prod
```

### Emergency: Disable Feature Flag

```bash
# Temporarily disable feature via env var
vercel env add FEATURE_ENABLED false production
vercel --prod
```

---

## 6. Database/Dataset Rollback

### When to Use
- Corrupted dataset
- Failed migration
- Data loss

### Full Dataset Restore

**Time:** 15-30 minutes | **Risk:** HIGH

```bash
# 1. Create new backup dataset
pnpm clone-site site-budds site-budds-backup-$(date +%Y%m%d)

# 2. Export current state
pnpm sanity:export --dataset=site-budds --output=current-$(date +%Y%m%d).ndjson

# 3. Delete corrupted data (if necessary)
# Use Sanity Studio or bulk-update script

# 4. Import from backup
pnpm sanity:import backup-YYYYMMDD.ndjson --dataset=site-budds

# 5. Verify data integrity
pnpm schema-diff --compare site-budds,site-budds-backup

# 6. Run smoke tests
pnpm test:smoke --dataset=site-budds --url=https://site.com
```

### Partial Dataset Rollback

```bash
# Rollback specific document type
pnpm migrate-content --from=site-budds-backup --to=site-budds --type=service --all --update-existing
```

---

## 7. Automated Rollback Script

Use the automated rollback script for common scenarios:

```bash
# Rollback Vercel deployment
pnpm rollback --type=deployment --id=DEPLOYMENT_ID

# Rollback to specific git commit
pnpm rollback --type=git --commit=abc123

# Rollback schema to previous version
pnpm rollback --type=schema --dataset=site-budds

# Rollback content from backup
pnpm rollback --type=content --dataset=site-budds --backup=BACKUP_DATE
```

---

## Rollback Decision Tree

```
Is production down?
├─ YES → Vercel Instant Rollback (< 1 min)
└─ NO → Continue

Is it a code issue?
├─ YES → Git revert + CI/CD (3-5 min)
└─ NO → Continue

Is it a schema issue?
├─ YES → Deploy corrected schema (5-15 min)
└─ NO → Continue

Is it content corruption?
├─ YES → Restore from Sanity history (1-2 min)
└─ NO → Continue

Is it an env var issue?
└─ YES → Update Vercel env vars + redeploy (2-5 min)
```

---

## Pre-Deployment Checklist (Prevent Rollbacks)

Before deploying:

- [ ] Run full test suite: `pnpm test`
- [ ] Run type check: `pnpm type-check`
- [ ] Run lint: `pnpm lint`
- [ ] Generate deployment checklist: `pnpm generate-checklist`
- [ ] Test in staging environment first
- [ ] Have rollback plan ready
- [ ] Backup critical datasets
- [ ] Monitor deployments for 15 minutes post-deploy
- [ ] Keep this playbook open

---

## Post-Rollback Procedures

After rolling back:

### 1. Immediate Actions
- [ ] Verify site is working
- [ ] Run smoke tests
- [ ] Monitor error logs
- [ ] Notify team of rollback
- [ ] Update status page (if applicable)

### 2. Root Cause Analysis
- [ ] Identify what went wrong
- [ ] Document the issue
- [ ] Create issue in GitHub
- [ ] Add to pre-deployment checklist
- [ ] Update tests to catch similar issues

### 3. Prevention
- [ ] Fix the underlying bug
- [ ] Add test coverage
- [ ] Update deployment checklist
- [ ] Team retrospective

---

## Rollback Communication Template

```
🚨 ROLLBACK EXECUTED

Time: [timestamp]
Type: [Vercel/Git/Schema/Content/Config]
Reason: [brief description]
Affected Sites: [site-budds, site-hvac, etc.]
Downtime: [None/X minutes]
Status: [Completed/In Progress]

Action Taken:
- [step 1]
- [step 2]

Verification:
- [x] Site loads correctly
- [x] Smoke tests passed
- [x] Error rates normal

Next Steps:
- [fix description]
- [timeline]

Lead: [your name]
```

---

## Emergency Contacts

**Vercel Support:** support@vercel.com
**Sanity Support:** support@sanity.io
**Team Lead:** [contact]
**On-Call Engineer:** [contact]

---

## Rollback Logs

Keep a log of all rollbacks for analysis:

```markdown
## 2025-10-23 - Vercel Deployment Rollback
- **Time:** 14:32 UTC
- **Reason:** Image optimization causing 500 errors
- **Method:** Vercel instant rollback
- **Downtime:** None
- **Lessons:** Add image URL validation in pre-deployment tests
```

---

## Testing Rollback Procedures

**Practice rollbacks regularly in staging:**

```bash
# Staging rollback drill (monthly)
# 1. Deploy test change to staging
# 2. Immediately roll back
# 3. Verify rollback worked
# 4. Time the process
# 5. Document any issues
```

---

## Advanced Rollback Scenarios

### Scenario 1: Schema Change + Content Migration

If you deployed schema + migrated content:

1. Rollback schema first
2. Then rollback content migration
3. Verify data integrity
4. Re-test migration

### Scenario 2: Multi-Dataset Deployment

If change affects all datasets:

```bash
# Rollback all datasets in sequence
for dataset in site-budds site-hvac site-plumber; do
  pnpm rollback --type=schema --dataset=$dataset
  pnpm test:smoke --dataset=$dataset
done
```

### Scenario 3: Partial Rollback

If only some sites are affected:

```bash
# Deploy fix to affected sites only
vercel --prod --env NEXT_PUBLIC_SANITY_DATASET=site-budds
```

---

## Monitoring Post-Rollback

After rollback, monitor for 30 minutes:

```bash
# Monitor error rates
vercel logs --follow

# Monitor performance
lighthouse https://your-site.com --view

# Monitor user sessions (if analytics available)
# Check for elevated bounce rates or errors
```

---

## Rollback Best Practices

### ✅ DO
1. Keep backups before major changes
2. Test rollback procedures in staging
3. Document all rollbacks
4. Communicate with team
5. Monitor post-rollback metrics
6. Perform root cause analysis

### ❌ DON'T
1. Force push without team coordination
2. Skip verification after rollback
3. Rollback without understanding the issue
4. Delete backups immediately
5. Skip post-mortem
6. Ignore warning signs

---

## Success Metrics

**Rollback goals:**
- **Speed:** < 5 minutes for critical issues
- **Accuracy:** 100% service restoration
- **Communication:** Team notified within 2 minutes
- **Documentation:** Issue logged within 1 hour
- **Prevention:** Similar issue doesn't recur

---

**Remember:** The best rollback is the one you never need to execute. Invest in testing, staging deployments, and pre-deployment checklists.
