import { z } from 'zod'

/**
 * Environment Variable Schema
 *
 * This validates all required and optional environment variables at build/runtime.
 * The application will fail fast if required variables are missing.
 */
const envSchema = z.object({
  // Required: Sanity Configuration
  NEXT_PUBLIC_SANITY_PROJECT_ID: z
    .string()
    .min(1, 'NEXT_PUBLIC_SANITY_PROJECT_ID is required'),
  NEXT_PUBLIC_SANITY_DATASET: z
    .string()
    .min(1, 'NEXT_PUBLIC_SANITY_DATASET is required'),

  // Required: Site Configuration
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url('NEXT_PUBLIC_SITE_URL must be a valid URL')
    .min(1, 'NEXT_PUBLIC_SITE_URL is required for production builds'),

  // Optional: Sanity API Token (for preview/draft mode)
  SANITY_API_TOKEN: z.string().optional(),

  // Optional: Canonical host for redirects
  CANONICAL_HOST: z.string().optional(),

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
    return envSchema.parse({
      NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
      CANONICAL_HOST: process.env.CANONICAL_HOST,
      NODE_ENV: process.env.NODE_ENV,
    })
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
