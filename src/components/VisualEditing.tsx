/**
 * Visual Editing Component
 * Enables Sanity's visual editing capabilities in draft mode
 * Uses next-sanity's built-in VisualEditing component for App Router
 */
import { VisualEditing as NextSanityVisualEditing } from 'next-sanity/visual-editing'

export function VisualEditing() {
  return <NextSanityVisualEditing />
}
