/**
 * Enterprise Schema Migration Framework
 *
 * PURPOSE: Safe, reversible schema evolution with data migration
 * PREVENTS: Breaking changes, data loss, orphaned documents
 * USAGE: Define migrations when schema changes occur
 */

import { SanityClient } from '@sanity/client'

export interface Migration {
  /** Unique migration ID (semver or timestamp) */
  id: string
  /** Human-readable description */
  description: string
  /** Document types affected */
  documentTypes: string[]
  /** Forward migration function */
  up: (client: SanityClient) => Promise<MigrationResult>
  /** Rollback function */
  down?: (client: SanityClient) => Promise<MigrationResult>
  /** Validation function to check if migration needed */
  shouldRun?: (client: SanityClient) => Promise<boolean>
}

export interface MigrationResult {
  success: boolean
  documentsAffected: number
  errors: string[]
  warnings: string[]
}

/**
 * Migration: Add title and publishedAt to serviceLocation
 *
 * CONTEXT: serviceLocation documents were created without these fields
 * IMPACT: ~336 documents need backfilling
 * RISK: Low (additive only, no data loss)
 */
export const migration_addServiceLocationTitleAndDate: Migration = {
  id: '2025-10-24-serviceLocation-add-title-publishedAt',
  description: 'Add missing title and publishedAt fields to existing serviceLocation documents',
  documentTypes: ['serviceLocation'],

  shouldRun: async (client) => {
    // Check if any serviceLocation docs are missing the fields
    const missingFields = await client.fetch(
      `count(*[_type == "serviceLocation" && (!defined(title) || !defined(publishedAt))])`
    )
    return missingFields > 0
  },

  up: async (client) => {
    const result: MigrationResult = {
      success: true,
      documentsAffected: 0,
      errors: [],
      warnings: [],
    }

    try {
      // Fetch all serviceLocation documents missing fields
      const docs = await client.fetch<Array<{
        _id: string
        _type: string
        title?: string
        publishedAt?: string
        service: { title: string }
        location: { city: string }
        _createdAt: string
      }>>(
        `*[_type == "serviceLocation" && (!defined(title) || !defined(publishedAt))]{
          _id,
          _type,
          title,
          publishedAt,
          "service": service->{title},
          "location": location->{city},
          _createdAt
        }`
      )

      if (docs.length === 0) {
        result.warnings.push('No documents need migration')
        return result
      }

      // Batch update documents
      const transaction = client.transaction()

      for (const doc of docs) {
        const patches: Record<string, unknown> = {}

        // Generate title if missing
        if (!doc.title) {
          patches.title = `${doc.service.title} in ${doc.location.city}`
        }

        // Backfill publishedAt if missing
        if (!doc.publishedAt) {
          patches.publishedAt = doc._createdAt // Use creation date as published date
        }

        if (Object.keys(patches).length > 0) {
          transaction.patch(doc._id, { set: patches })
          result.documentsAffected++
        }
      }

      await transaction.commit()
      result.success = true

    } catch (error) {
      result.success = false
      result.errors.push(`Migration failed: ${String(error)}`)
    }

    return result
  },

  down: async (client) => {
    const result: MigrationResult = {
      success: true,
      documentsAffected: 0,
      errors: [],
      warnings: ['Rollback will remove title and publishedAt fields'],
    }

    try {
      const docs = await client.fetch<Array<{ _id: string }>>(
        `*[_type == "serviceLocation" && (defined(title) || defined(publishedAt))]{_id}`
      )

      const transaction = client.transaction()

      for (const doc of docs) {
        transaction.patch(doc._id, { unset: ['title', 'publishedAt'] })
        result.documentsAffected++
      }

      await transaction.commit()
      result.success = true

    } catch (error) {
      result.success = false
      result.errors.push(`Rollback failed: ${String(error)}`)
    }

    return result
  },
}

/**
 * Migration Runner
 *
 * Executes migrations with logging and error handling
 */
export class MigrationRunner {
  constructor(private client: SanityClient) {}

  /**
   * Run a single migration
   */
  async runMigration(migration: Migration): Promise<MigrationResult> {
    console.log(`[Migration] Starting: ${migration.id}`)
    console.log(`[Migration] Description: ${migration.description}`)
    console.log(`[Migration] Affects: ${migration.documentTypes.join(', ')}`)

    // Check if migration should run
    if (migration.shouldRun) {
      const shouldRun = await migration.shouldRun(this.client)
      if (!shouldRun) {
        console.log(`[Migration] Skipped: ${migration.id} (already applied)`)
        return {
          success: true,
          documentsAffected: 0,
          errors: [],
          warnings: ['Migration not needed'],
        }
      }
    }

    // Execute migration
    const result = await migration.up(this.client)

    // Log results
    console.log(`[Migration] Completed: ${migration.id}`)
    console.log(`[Migration] Success: ${result.success}`)
    console.log(`[Migration] Documents affected: ${result.documentsAffected}`)

    if (result.errors.length > 0) {
      console.error(`[Migration] Errors:`, result.errors)
    }

    if (result.warnings.length > 0) {
      console.warn(`[Migration] Warnings:`, result.warnings)
    }

    return result
  }

  /**
   * Run multiple migrations in sequence
   */
  async runMigrations(migrations: Migration[]): Promise<Record<string, MigrationResult>> {
    const results: Record<string, MigrationResult> = {}

    for (const migration of migrations) {
      results[migration.id] = await this.runMigration(migration)

      // Stop on failure if no rollback defined
      if (!results[migration.id].success && !migration.down) {
        console.error(`[Migration] Fatal error in ${migration.id}, stopping execution`)
        break
      }
    }

    return results
  }

  /**
   * Rollback a migration
   */
  async rollbackMigration(migration: Migration): Promise<MigrationResult> {
    if (!migration.down) {
      return {
        success: false,
        documentsAffected: 0,
        errors: ['No rollback function defined'],
        warnings: [],
      }
    }

    console.log(`[Migration] Rolling back: ${migration.id}`)
    const result = await migration.down(this.client)
    console.log(`[Migration] Rollback completed: ${migration.id}`)

    return result
  }
}

/**
 * Registry of all migrations
 *
 * ADD NEW MIGRATIONS HERE in chronological order
 */
export const allMigrations: Migration[] = [
  migration_addServiceLocationTitleAndDate,
  // Add future migrations here...
]
