import { z } from 'zod'

/**
 * Environment Variable Schema
 *
 * This validates all required and optional environment variables at build/runtime.
 * The application will fail fast if required variables are missing.
 *
 * Multi-Tenant Support:
 * - Each site deployment uses a different NEXT_PUBLIC_SANITY_DATASET
 * - Dataset name format: "site-{id}" (e.g., "site-budds", "site-hvac")
 * - SITE_ID is optional but recommended for logging/monitoring
 */
const envSchema = z.object({
  // Required: Sanity Configuration
  NEXT_PUBLIC_SANITY_PROJECT_ID: z
    .string()
    .min(1, 'NEXT_PUBLIC_SANITY_PROJECT_ID is required'),
  NEXT_PUBLIC_SANITY_DATASET: z
    .string()
    .min(1, 'NEXT_PUBLIC_SANITY_DATASET is required')
    .refine(
      (val) => {
        // Validate dataset naming convention for multi-tenant
        // Accept: "production" (legacy), "site-*" (multi-tenant), or any valid dataset name
        return /^[a-z0-9_-]+$/.test(val)
      },
      { message: 'NEXT_PUBLIC_SANITY_DATASET must contain only lowercase letters, numbers, hyphens, and underscores' }
    ),

  // Required: Site Configuration
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url('NEXT_PUBLIC_SITE_URL must be a valid URL')
    .min(1, 'NEXT_PUBLIC_SITE_URL is required for production builds'),

  // Optional: Site ID for multi-tenant deployments
  SITE_ID: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'SITE_ID must contain only lowercase letters, numbers, and hyphens')
    .optional()
    .describe('Unique identifier for this site (e.g., "budds-plumbing"). Used for logging and monitoring.'),

  // Optional: Sanity API Token (for preview/draft mode)
  SANITY_API_TOKEN: z.string().optional(),

  // Optional: Canonical host for redirects
  CANONICAL_HOST: z.string().optional(),

  // Optional: Multi-tenant mode flag
  MULTI_TENANT_ENABLED: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true')
    .describe('Enable multi-tenant features (domain detection, site-specific configs)'),

  // Optional: Node environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
})

/**
 * Validates and parses environment variables
 * @throws {z.ZodError} If validation fails
 */
function validateEnv() {
  try {
    const parsed = envSchema.parse({
      NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      SITE_ID: process.env.SITE_ID,
      SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
      CANONICAL_HOST: process.env.CANONICAL_HOST,
      MULTI_TENANT_ENABLED: process.env.MULTI_TENANT_ENABLED,
      NODE_ENV: process.env.NODE_ENV,
    })

    // Log multi-tenant configuration in development
    if (process.env.NODE_ENV === 'development' && parsed.MULTI_TENANT_ENABLED) {
      console.log('🌐 Multi-tenant mode enabled')
      console.log(`📦 Dataset: ${parsed.NEXT_PUBLIC_SANITY_DATASET}`)
      if (parsed.SITE_ID) {
        console.log(`🏷️  Site ID: ${parsed.SITE_ID}`)
      }
    }

    return parsed
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:')
      error.issues.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
      throw new Error('Invalid environment variables. Check the errors above.')
    }
    throw error
  }
}

/**
 * Validated environment variables
 * Safe to use throughout the application
 */
export const env = validateEnv()

/**
 * Type-safe environment variables
 */
export type Env = z.infer<typeof envSchema>
