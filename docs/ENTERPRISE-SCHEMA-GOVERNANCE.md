# Enterprise Schema Governance System

**Status**: ✅ Production Ready
**Last Updated**: 2025-10-24
**Owner**: Engineering

## Overview

This document describes the **3-tier enterprise schema governance system** that prevents schema drift, data corruption, and breaking changes in production.

## The Problem We Solved

### Before (Chaos)
- ❌ API routes created documents with fields not in schema
- ❌ Schema changes broke existing documents
- ❌ "Unknown fields" errors in Sanity Studio
- ❌ No validation between code and CMS
- ❌ Manual schema changes with no migration path

### After (Enterprise)
- ✅ **Runtime validation** enforces schema compliance
- ✅ **Automated migrations** for safe schema evolution
- ✅ **Pre-commit hooks** prevent breaking changes
- ✅ **Type safety** from API → Schema → Database
- ✅ **Rollback support** for safe reversal

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     TIER 1: Prevention                      │
│                     (Pre-Commit Hooks)                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     TIER 2: Validation                      │
│                  (Runtime Schema Validators)                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     TIER 3: Migration                       │
│                  (Safe Schema Evolution)                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Tier 1: Prevention (Pre-Commit)

### What It Does
Validates schema changes **before** they're committed to git.

### Location
- Hook: `.husky/pre-commit`
- Script: `scripts/validate-schema-changes.ts`

### Checks
1. **Field removal detection** - Warns if fields are removed
2. **Validator sync** - Ensures `schema-validators.ts` is updated
3. **Type generation** - Ensures `sanitize:types` was run
4. **Migration reminder** - Prompts to create migration if needed

### Example Output
```bash
🔍 Validating schema changes...

📝 Changed schema files:
   - src/sanity/schemaTypes/documents/serviceLocation.ts

⚠️  serviceLocation schema modified!
📋 Required actions:

   1. Update schema validator: src/lib/sanity/schema-validators.ts
   2. Create migration if needed: src/lib/sanity/migrations.ts
   3. Run: pnpm sanitize:types
   4. Run: pnpm migrate:status

❌ Validation failed:
   ❌ Schema validator not updated
   ❌ TypeScript types not regenerated

💡 Follow the required actions above before committing.
```

---

## Tier 2: Runtime Validation

### What It Does
Validates all document writes **at runtime** before they reach Sanity.

### Location
`src/lib/sanity/schema-validators.ts`

### How It Works
```typescript
// Before: No validation ❌
await writeClient.create({
  _type: 'serviceLocation',
  randomField: 'oops', // ❌ Would silently create orphaned field
})

// After: Enterprise validation ✅
const validatedData = validateServiceLocationCreate(documentData)
await writeClient.create(validatedData) // ✅ Throws error if invalid
```

### Error Handling
```typescript
try {
  const validatedData = validateServiceLocationCreate(documentData)
  await writeClient.create(validatedData)
} catch (error) {
  if (error instanceof SchemaValidationError) {
    // Log structured error with field paths
    console.error(error.toJSON())
  }
}
```

### Adding Validators for New Document Types
```typescript
// 1. Create Zod schema
export const myDocumentCreateSchema = z.object({
  _type: z.literal('myDocument'),
  title: z.string(),
  // ... other fields
})

// 2. Create validator function
export const validateMyDocumentCreate = createValidator(
  myDocumentCreateSchema,
  'myDocument'
)

// 3. Use in API routes
const validatedData = validateMyDocumentCreate(data)
await writeClient.create(validatedData)
```

---

## Tier 3: Schema Migrations

### What It Does
Safely migrates existing documents when schema changes.

### Location
`src/lib/sanity/migrations.ts`

### Commands
```bash
# Check migration status
pnpm migrate:status

# Run all pending migrations
pnpm migrate

# Rollback last migration
pnpm migrate:rollback
```

### Migration Anatomy
```typescript
export const migration_example: Migration = {
  id: '2025-10-24-example',
  description: 'Human-readable description',
  documentTypes: ['serviceLocation'],

  // Check if migration needed
  shouldRun: async (client) => {
    const count = await client.fetch(
      `count(*[_type == "serviceLocation" && !defined(newField)])`
    )
    return count > 0
  },

  // Forward migration
  up: async (client) => {
    // Fetch documents
    // Transform data
    // Batch update
    return { success: true, documentsAffected: 100, errors: [], warnings: [] }
  },

  // Rollback (optional but recommended)
  down: async (client) => {
    // Reverse the changes
    return { success: true, documentsAffected: 100, errors: [], warnings: [] }
  },
}
```

### Creating a New Migration

1. **Define the migration** in `src/lib/sanity/migrations.ts`:
```typescript
export const migration_addMyField: Migration = {
  id: '2025-10-24-add-my-field',
  description: 'Add myField to all documents',
  documentTypes: ['myDocument'],
  up: async (client) => {
    const docs = await client.fetch(`*[_type == "myDocument" && !defined(myField)]`)
    const transaction = client.transaction()

    docs.forEach(doc => {
      transaction.patch(doc._id, { set: { myField: 'default' } })
    })

    await transaction.commit()
    return { success: true, documentsAffected: docs.length, errors: [], warnings: [] }
  },
}
```

2. **Add to registry**:
```typescript
export const allMigrations: Migration[] = [
  migration_addServiceLocationTitleAndDate,
  migration_addMyField, // ← Add here
]
```

3. **Test the migration**:
```bash
pnpm migrate:status  # Check if it will run
pnpm migrate         # Run it
```

---

## Workflow: Making Schema Changes

### Step-by-Step Process

1. **Modify the schema** (`src/sanity/schemaTypes/documents/*.ts`)
   ```typescript
   defineField({
     name: 'newField',
     type: 'string',
     validation: (rule) => rule.required(),
   })
   ```

2. **Update the validator** (`src/lib/sanity/schema-validators.ts`)
   ```typescript
   export const serviceLocationCreateSchema = z.object({
     // ... existing fields
     newField: z.string().min(1), // ← Add validation
   })
   ```

3. **Regenerate types**
   ```bash
   pnpm sanitize:types
   ```

4. **Create migration** (if needed for existing data)
   ```typescript
   export const migration_addNewField: Migration = {
     id: '2025-10-24-add-new-field',
     description: 'Backfill newField for existing documents',
     // ... implementation
   }
   ```

5. **Test locally**
   ```bash
   pnpm migrate:status  # Check migration
   pnpm migrate         # Run migration
   ```

6. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add newField to serviceLocation"
   # Pre-commit hook validates everything ✅
   ```

7. **Deploy**
   ```bash
   # In production, run migrations after deployment
   pnpm migrate
   ```

---

## Safety Guarantees

### 1. Type Safety
- **Zod schemas** validate at runtime
- **TypeScript types** catch errors at compile time
- **Sanity schema** enforces at database level

### 2. Atomic Operations
- All migrations use **transactions**
- Either all documents update or none do
- No partial failures

### 3. Rollback Support
- Every migration has optional `down()` function
- Can revert changes if issues arise
- Preserves data integrity

### 4. Audit Trail
- Migration IDs are timestamped
- Logs show documents affected
- Errors are captured and reported

---

## Monitoring & Alerts

### Check Migration Status
```bash
pnpm migrate:status
```

### Production Monitoring
```typescript
// In production, log migration results
const results = await runner.runMigrations(allMigrations)

if (Object.values(results).some(r => !r.success)) {
  // Alert: Migration failed
  await notifyTeam({ severity: 'critical', message: 'Migration failure' })
}
```

---

## Best Practices

### ✅ DO
- Always create migrations for breaking changes
- Run `pnpm sanitize:types` after schema changes
- Test migrations on staging data first
- Use descriptive migration IDs and descriptions
- Add rollback functions when possible
- Validate all API writes with schema validators

### ❌ DON'T
- Skip validator updates when changing schema
- Commit schema changes without running `sanitize:types`
- Remove fields without migration
- Create documents without validation
- Deploy schema changes without running migrations

---

## Troubleshooting

### "Unknown fields found" in Studio
**Cause**: Documents have fields not in schema
**Fix**:
1. Add missing fields to schema
2. Update validator
3. Run `pnpm sanitize:types`
4. Restart Studio

### Slug validation errors
**Cause**: Duplicate slugs or incorrect validation logic
**Fix**: Check slug validation in schema, ensure draft/published are excluded

### Migration fails mid-execution
**Cause**: Data inconsistency or validation error
**Fix**:
1. Check migration logs for specific error
2. Fix data manually if needed
3. Run `pnpm migrate:rollback` if supported
4. Adjust migration and retry

---

## Future Enhancements

1. **Automated schema diff** - Compare schemas across deployments
2. **Migration preview** - Dry-run mode to see what will change
3. **Schema versioning** - Track schema version in documents
4. **Conflict detection** - Alert when multiple developers change same schema
5. **CI/CD integration** - Automated migration runs on deployment

---

## Summary

This enterprise system ensures:
- **Zero schema drift** - Code and CMS always in sync
- **Zero data corruption** - All writes are validated
- **Zero downtime** - Migrations run safely in production
- **Full auditability** - Complete history of schema changes
- **Rollback safety** - Can revert changes if needed

**The result?** Sanity Studio that never breaks, data that stays clean, and confidence in schema evolution.
