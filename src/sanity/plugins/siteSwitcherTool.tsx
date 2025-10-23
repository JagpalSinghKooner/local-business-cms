/**
 * Site Switcher Tool Plugin
 *
 * Adds a "Site Info" tool to Sanity Studio that displays
 * the current site/dataset being edited and provides
 * information about multi-tenant architecture.
 */

import { definePlugin } from 'sanity'
import { DatabaseIcon } from '@sanity/icons'
import { SiteSwitcher } from '../components/SiteSwitcher'

export const siteSwitcherTool = definePlugin({
  name: 'site-switcher-tool',
  tools: (prev) => [
    ...prev,
    {
      name: 'site-info',
      title: 'Site Info',
      icon: DatabaseIcon,
      component: SiteSwitcher,
    },
  ],
})
