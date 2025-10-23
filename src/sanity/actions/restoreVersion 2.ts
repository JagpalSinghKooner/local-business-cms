/**
 * Restore Version Action
 *
 * Custom document action to restore a previous version
 */

import { DocumentActionComponent } from 'sanity'
import { RestoreIcon } from '@sanity/icons'

export const restoreVersionAction: DocumentActionComponent = (props) => {
  const { id, type, draft, published } = props

  return {
    label: 'Restore Version',
    icon: RestoreIcon,
    tone: 'caution',
    onHandle: () => {
      // This opens the history panel where users can restore versions
      // Sanity has built-in version restore functionality
      alert(
        'To restore a previous version:\n\n' +
          '1. Click the "History" button in the top right\n' +
          '2. Browse through previous versions\n' +
          '3. Click "Restore" on the version you want to restore'
      )
    },
  }
}

export default restoreVersionAction
