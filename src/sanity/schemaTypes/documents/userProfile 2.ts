/**
 * User Profile Document Schema
 *
 * Store user-specific data including role assignment
 */

import { defineType, defineField } from 'sanity'
import { UserIcon } from '@sanity/icons'

export default defineType({
  name: 'userProfile',
  title: 'User Profile',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'Unique user identifier from authentication system',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'reference',
      to: [{ type: 'role' }],
      description: 'User role with associated permissions',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Whether user account is active',
      initialValue: true,
    }),
    defineField({
      name: 'lastLoginAt',
      title: 'Last Login At',
      type: 'datetime',
      description: 'When user last logged in',
      readOnly: true,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      description: 'When user profile was created',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      email: 'email',
      role: 'role.title',
      active: 'active',
    },
    prepare({ name, email, role, active }) {
      const status = active ? '✅' : '❌'

      return {
        title: `${status} ${name || 'Unnamed User'}`,
        subtitle: `${email || 'No email'} · ${role || 'No role'}`,
        media: UserIcon,
      }
    },
  },
})
