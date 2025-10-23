/**
 * Role Document Schema
 *
 * Define custom roles with specific permissions
 */

import { defineType, defineField } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export default defineType({
  name: 'role',
  title: 'Role',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Role Name',
      type: 'string',
      description: 'Unique name for this role',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Display Title',
      type: 'string',
      description: 'Human-readable title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'What this role is for',
    }),
    defineField({
      name: 'permissions',
      title: 'Permissions',
      type: 'object',
      description: 'Granular permissions for this role',
      fields: [
        {
          name: 'documents',
          title: 'Document Permissions',
          type: 'object',
          fields: [
            {
              name: 'create',
              title: 'Create Documents',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                list: [
                  { title: 'All Types', value: '*' },
                  { title: 'Pages', value: 'page' },
                  { title: 'Posts', value: 'post' },
                  { title: 'Services', value: 'service' },
                  { title: 'Locations', value: 'location' },
                  { title: 'Offers', value: 'offer' },
                  { title: 'Coupons', value: 'coupon' },
                ],
              },
            },
            {
              name: 'read',
              title: 'Read Documents',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                list: [
                  { title: 'All Types', value: '*' },
                  { title: 'Pages', value: 'page' },
                  { title: 'Posts', value: 'post' },
                  { title: 'Services', value: 'service' },
                  { title: 'Locations', value: 'location' },
                  { title: 'Offers', value: 'offer' },
                  { title: 'Coupons', value: 'coupon' },
                ],
              },
            },
            {
              name: 'update',
              title: 'Update Documents',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                list: [
                  { title: 'All Types', value: '*' },
                  { title: 'Pages', value: 'page' },
                  { title: 'Posts', value: 'post' },
                  { title: 'Services', value: 'service' },
                  { title: 'Locations', value: 'location' },
                  { title: 'Offers', value: 'offer' },
                  { title: 'Coupons', value: 'coupon' },
                ],
              },
            },
            {
              name: 'delete',
              title: 'Delete Documents',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                list: [
                  { title: 'All Types', value: '*' },
                  { title: 'Pages', value: 'page' },
                  { title: 'Posts', value: 'post' },
                  { title: 'Services', value: 'service' },
                  { title: 'Locations', value: 'location' },
                  { title: 'Offers', value: 'offer' },
                  { title: 'Coupons', value: 'coupon' },
                ],
              },
            },
            {
              name: 'publish',
              title: 'Publish Documents',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                list: [
                  { title: 'All Types', value: '*' },
                  { title: 'Pages', value: 'page' },
                  { title: 'Posts', value: 'post' },
                  { title: 'Services', value: 'service' },
                  { title: 'Locations', value: 'location' },
                  { title: 'Offers', value: 'offer' },
                  { title: 'Coupons', value: 'coupon' },
                ],
              },
            },
          ],
        },
        {
          name: 'workflows',
          title: 'Workflow Permissions',
          type: 'object',
          fields: [
            {
              name: 'changeState',
              title: 'Change Workflow State',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'requestApproval',
              title: 'Request Approval',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'approveContent',
              title: 'Approve Content',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'schedulePublish',
              title: 'Schedule Publishing',
              type: 'boolean',
              initialValue: false,
            },
          ],
        },
        {
          name: 'features',
          title: 'Feature Permissions',
          type: 'object',
          fields: [
            {
              name: 'viewAuditLogs',
              title: 'View Audit Logs',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'exportAuditLogs',
              title: 'Export Audit Logs',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'manageWebhooks',
              title: 'Manage Webhooks',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'manageRoles',
              title: 'Manage Roles',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'manageUsers',
              title: 'Manage Users',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'viewAnalytics',
              title: 'View Analytics',
              type: 'boolean',
              initialValue: false,
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'isSystem',
      title: 'System Role',
      type: 'boolean',
      description: 'System roles cannot be deleted',
      initialValue: false,
      readOnly: true,
    }),
    defineField({
      name: 'userCount',
      title: 'User Count',
      type: 'number',
      description: 'Number of users with this role',
      readOnly: true,
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      name: 'name',
      isSystem: 'isSystem',
      userCount: 'userCount',
    },
    prepare({ title, name, isSystem, userCount }) {
      const icon = isSystem ? '🔒' : '👥'
      const users = userCount ? `${userCount} user${userCount !== 1 ? 's' : ''}` : 'No users'

      return {
        title: `${icon} ${title}`,
        subtitle: `${name} · ${users}`,
        media: UsersIcon,
      }
    },
  },
})
