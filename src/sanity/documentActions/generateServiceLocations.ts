import { DocumentActionComponent } from 'sanity'

/**
 * Document Action: Auto-generate ServiceLocation documents
 *
 * Adds a button to Service and Location documents that triggers
 * automatic generation of serviceLocation combinations.
 */
export const generateServiceLocationsAction: DocumentActionComponent = (props) => {
  const { type, id, published } = props

  // Only show for service and location document types
  if (type !== 'service' && type !== 'location') {
    return null
  }

  // Only show for published documents
  if (!published) {
    return null
  }

  return {
    label: 'Generate Service+Location Pages',
    icon: () => '🔄',
    onHandle: async () => {
      try {
        const mode = 'single'
        const payload =
          type === 'service'
            ? { mode, serviceId: id }
            : { mode, locationId: id }

        const response = await fetch('/api/generate-service-locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const result = await response.json()

        if (response.ok) {
          const message =
            result.created > 0
              ? `✅ Created ${result.created} new serviceLocation pages!`
              : `✓ All serviceLocation pages already exist (${result.skipped} skipped)`

          props.onComplete()

          // Show success message
          alert(message)
        } else {
          throw new Error(result.error || 'Failed to generate pages')
        }
      } catch (error) {
        console.error('Error generating serviceLocations:', error)
        alert(`❌ Error: ${String(error)}`)
      }
    },
  }
}
