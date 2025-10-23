/**
 * Site Switcher Component for Sanity Studio
 *
 * Multi-tenant architecture: Multiple Datasets approach
 *
 * This component displays the current site (dataset) being edited
 * and provides information about switching between sites.
 *
 * Note: With the Multiple Datasets approach, each Studio instance
 * is configured for a specific dataset via sanity.config.ts.
 * To switch sites, you need to:
 * 1. Deploy separate Studio instances with different dataset configs
 * 2. Or use URL-based dataset selection (advanced)
 */

import { useClient } from 'sanity'

export function SiteSwitcher() {
  const client = useClient()
  const currentDataset = client.config().dataset
  const projectId = client.config().projectId

  // Extract site ID from dataset name (e.g., "site-budds" → "budds")
  const siteId = currentDataset?.startsWith('site-')
    ? currentDataset.replace('site-', '')
    : currentDataset

  const isMultiTenantDataset = currentDataset?.startsWith('site-')

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Site Information</h1>
          <p className="text-gray-600">
            Multi-tenant architecture using Multiple Datasets approach
          </p>
        </div>

        {/* Current Site Info */}
        <div className="border-2 border-green-500 rounded-lg p-6 bg-green-50">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            Current Site
          </h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-green-700">
                {isMultiTenantDataset ? siteId : currentDataset}
              </span>
              {isMultiTenantDataset && (
                <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                  Multi-tenant
                </span>
              )}
            </div>

            <div className="text-sm text-gray-700">
              <p>
                <span className="font-medium">Dataset:</span>{' '}
                <code className="px-2 py-1 bg-white rounded border">{currentDataset}</code>
              </p>
            </div>

            <div className="text-sm text-gray-700">
              <p>
                <span className="font-medium">Project ID:</span>{' '}
                <code className="px-2 py-1 bg-white rounded border">{projectId}</code>
              </p>
            </div>
          </div>
        </div>

        {/* How to Switch Sites */}
        <div className="border border-yellow-400 rounded-lg p-6 bg-yellow-50">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to Switch Sites
          </h2>

          <p className="text-sm text-gray-700 mb-4">
            This Studio is configured for the <strong>{currentDataset}</strong> dataset.
            To edit a different site:
          </p>

          <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
            <li>
              Deploy separate Studio instances with different{' '}
              <code className="px-2 py-1 bg-white rounded border text-xs">
                SANITY_STUDIO_DATASET
              </code>{' '}
              environment variables
            </li>
            <li>
              Or use the{' '}
              <code className="px-2 py-1 bg-white rounded border text-xs">?dataset=site-name</code>{' '}
              URL parameter (advanced)
            </li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

          <a
            href={`https://www.sanity.io/manage/project/${projectId}/datasets`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Manage Datasets in Sanity
          </a>
        </div>

        {/* Architecture Notes */}
        <div className="border rounded-lg p-6 bg-blue-50">
          <h2 className="text-lg font-semibold mb-4">Architecture Notes</h2>

          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>Multiple Datasets Approach:</strong> Each site has its own Sanity dataset,
              providing perfect data isolation and independent evolution.
            </p>

            <p>
              <strong>Benefits:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Zero cross-contamination risk between sites</li>
              <li>Simple GROQ queries (no site filtering needed)</li>
              <li>Independent schema evolution per site</li>
              <li>Natural cache isolation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
