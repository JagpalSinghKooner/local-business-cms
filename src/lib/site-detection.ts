/**
 * Site Detection Utility
 *
 * Determines which site is being accessed based on domain/environment.
 * Used for multi-tenant architecture with Multiple Datasets approach.
 *
 * Architecture:
 * - Each site = separate Sanity dataset
 * - Dataset determined by environment variable (NEXT_PUBLIC_SANITY_DATASET)
 * - Optional: Domain-based detection for advanced routing
 */

import { env } from './env'

export interface SiteInfo {
  /** Unique site identifier (e.g., "budds-plumbing") */
  siteId: string
  /** Sanity dataset name (e.g., "site-budds") */
  dataset: string
  /** Primary domain (e.g., "buddsplumbing.com") */
  domain: string
  /** Whether this is the current active site */
  isActive: boolean
}

/**
 * Get current site information from environment
 */
export function getCurrentSite(): SiteInfo {
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET
  const siteId = env.SITE_ID || extractSiteIdFromDataset(dataset)
  const domain = extractDomainFromSiteUrl(env.NEXT_PUBLIC_SITE_URL)

  return {
    siteId,
    dataset,
    domain,
    isActive: true,
  }
}

/**
 * Extract site ID from dataset name
 * Examples:
 * - "site-budds" → "budds"
 * - "site-acme-hvac" → "acme-hvac"
 * - "production" → "production" (legacy)
 */
function extractSiteIdFromDataset(dataset: string): string {
  const match = dataset.match(/^site-(.+)$/)
  return match ? match[1] : dataset
}

/**
 * Extract domain from NEXT_PUBLIC_SITE_URL
 * Examples:
 * - "https://buddsplumbing.com" → "buddsplumbing.com"
 * - "https://www.acme-hvac.com" → "www.acme-hvac.com"
 */
function extractDomainFromSiteUrl(siteUrl: string): string {
  try {
    const url = new URL(siteUrl)
    return url.hostname
  } catch {
    return ''
  }
}

/**
 * Get cache key prefix for current site
 * Ensures cache isolation between sites
 */
export function getSiteCachePrefix(): string {
  const { dataset } = getCurrentSite()
  return `site:${dataset}`
}

/**
 * Check if multi-tenant mode is enabled
 */
export function isMultiTenantEnabled(): boolean {
  return env.MULTI_TENANT_ENABLED === true
}

/**
 * Validate dataset name follows multi-tenant conventions
 */
export function isMultiTenantDataset(dataset: string): boolean {
  return dataset.startsWith('site-')
}

/**
 * Get site info for logging/monitoring
 */
export function getSiteContext() {
  const site = getCurrentSite()

  return {
    siteId: site.siteId,
    dataset: site.dataset,
    domain: site.domain,
    multiTenant: isMultiTenantEnabled(),
    environment: env.NODE_ENV,
  }
}

/**
 * Domain-based site detection (for advanced multi-tenant routing)
 *
 * Maps domains to datasets. Useful when running multiple sites from
 * single Next.js deployment with domain-based routing.
 *
 * Example domain mapping:
 * - buddsplumbing.com → site-budds
 * - acme-hvac.com → site-hvac
 * - legal-firm.com → site-legal
 *
 * Note: For simplest deployment, use separate Next.js projects per site
 * with different NEXT_PUBLIC_SANITY_DATASET env vars instead.
 */
export type DomainToDatasetMap = Record<string, string>

const DOMAIN_DATASET_MAP: DomainToDatasetMap = {
  // Add domain mappings here for advanced routing
  // 'buddsplumbing.com': 'site-budds',
  // 'acme-hvac.com': 'site-hvac',
}

/**
 * Get dataset for a given domain
 * Returns null if domain not found in mapping
 */
export function getDatasetForDomain(domain: string): string | null {
  // Normalize domain (remove www prefix for matching)
  const normalizedDomain = domain.replace(/^www\./, '')

  return DOMAIN_DATASET_MAP[normalizedDomain] || DOMAIN_DATASET_MAP[domain] || null
}

/**
 * Check if domain is registered in multi-tenant config
 */
export function isDomainRegistered(domain: string): boolean {
  return getDatasetForDomain(domain) !== null
}
