/**
 * RBAC (Role-Based Access Control)
 *
 * Utilities for managing roles and checking permissions
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const token = process.env.SANITY_API_TOKEN

export type Permission = 'create' | 'read' | 'update' | 'delete' | 'publish'

export interface RolePermissions {
  documents: {
    create?: string[]
    read?: string[]
    update?: string[]
    delete?: string[]
    publish?: string[]
  }
  workflows: {
    changeState?: boolean
    requestApproval?: boolean
    approveContent?: boolean
    schedulePublish?: boolean
  }
  features: {
    viewAuditLogs?: boolean
    exportAuditLogs?: boolean
    manageWebhooks?: boolean
    manageRoles?: boolean
    manageUsers?: boolean
    viewAnalytics?: boolean
  }
}

export interface Role {
  _id: string
  name: string
  title: string
  description?: string
  permissions: RolePermissions
  isSystem: boolean
  userCount: number
}

/**
 * Get role by name
 */
export async function getRole(roleName: string): Promise<Role | null> {
  if (!token) {
    return null
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    const role = await client.fetch<Role | null>(
      `*[_type == "role" && name == $name][0]`,
      { name: roleName }
    )

    return role
  } catch (error) {
    console.error('Failed to get role:', error)
    return null
  }
}

/**
 * Get all roles
 */
export async function getAllRoles(): Promise<Role[]> {
  if (!token) {
    return []
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    const roles = await client.fetch<Role[]>(
      `*[_type == "role"] | order(isSystem desc, name asc)`
    )

    return roles
  } catch (error) {
    console.error('Failed to get roles:', error)
    return []
  }
}

/**
 * Check if role has permission for document type
 */
export function hasDocumentPermission(
  role: Role,
  permission: Permission,
  documentType: string
): boolean {
  const permissions = role.permissions.documents[permission] || []

  // Check for wildcard or specific type
  return permissions.includes('*') || permissions.includes(documentType)
}

/**
 * Check if role has workflow permission
 */
export function hasWorkflowPermission(
  role: Role,
  permission: keyof RolePermissions['workflows']
): boolean {
  return role.permissions.workflows[permission] === true
}

/**
 * Check if role has feature permission
 */
export function hasFeaturePermission(
  role: Role,
  permission: keyof RolePermissions['features']
): boolean {
  return role.permissions.features[permission] === true
}

/**
 * Check if user can perform action
 */
export async function canUserPerformAction(
  userId: string,
  action: {
    type: 'document' | 'workflow' | 'feature'
    permission: string
    documentType?: string
  }
): Promise<boolean> {
  // Get user's role
  const userRole = await getUserRole(userId)

  if (!userRole) {
    return false
  }

  // Check permission based on type
  switch (action.type) {
    case 'document':
      if (!action.documentType) return false
      return hasDocumentPermission(
        userRole,
        action.permission as Permission,
        action.documentType
      )

    case 'workflow':
      return hasWorkflowPermission(
        userRole,
        action.permission as keyof RolePermissions['workflows']
      )

    case 'feature':
      return hasFeaturePermission(
        userRole,
        action.permission as keyof RolePermissions['features']
      )

    default:
      return false
  }
}

/**
 * Get user's role
 */
export async function getUserRole(userId: string): Promise<Role | null> {
  if (!token) {
    return null
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    // Get user document
    const user = await client.fetch<any>(
      `*[_type == "userProfile" && userId == $userId][0] {
        role-> {
          _id,
          name,
          title,
          description,
          permissions,
          isSystem,
          userCount
        }
      }`,
      { userId }
    )

    return user?.role || null
  } catch (error) {
    console.error('Failed to get user role:', error)
    return null
  }
}

/**
 * Assign role to user
 */
export async function assignRoleToUser(
  userId: string,
  roleId: string
): Promise<void> {
  if (!token) {
    throw new Error('SANITY_API_TOKEN not set')
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    // Check if user profile exists
    const existingProfile = await client.fetch<any>(
      `*[_type == "userProfile" && userId == $userId][0]`,
      { userId }
    )

    if (existingProfile) {
      // Update existing profile
      await client
        .patch(existingProfile._id)
        .set({
          role: {
            _type: 'reference',
            _ref: roleId,
          },
        })
        .commit()
    } else {
      // Create new profile
      await client.create({
        _type: 'userProfile',
        userId,
        role: {
          _type: 'reference',
          _ref: roleId,
        },
      })
    }

    // Update role user count
    await updateRoleUserCount(roleId)
  } catch (error) {
    console.error('Failed to assign role to user:', error)
    throw error
  }
}

/**
 * Update role user count
 */
async function updateRoleUserCount(roleId: string): Promise<void> {
  if (!token) return

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    const count = await client.fetch<number>(
      `count(*[_type == "userProfile" && role._ref == $roleId])`,
      { roleId }
    )

    await client.patch(roleId).set({ userCount: count }).commit()
  } catch (error) {
    console.error('Failed to update role user count:', error)
  }
}

/**
 * Create default system roles
 */
export async function createDefaultRoles(): Promise<void> {
  if (!token) {
    throw new Error('SANITY_API_TOKEN not set')
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    })

    // Check if roles already exist
    const existingRoles = await client.fetch<any[]>(
      `*[_type == "role" && isSystem == true]`
    )

    if (existingRoles.length > 0) {
      console.log('Default roles already exist')
      return
    }

    // Create Admin role
    await client.create({
      _type: 'role',
      name: 'admin',
      title: 'Administrator',
      description: 'Full access to all features and content',
      isSystem: true,
      userCount: 0,
      permissions: {
        documents: {
          create: ['*'],
          read: ['*'],
          update: ['*'],
          delete: ['*'],
          publish: ['*'],
        },
        workflows: {
          changeState: true,
          requestApproval: true,
          approveContent: true,
          schedulePublish: true,
        },
        features: {
          viewAuditLogs: true,
          exportAuditLogs: true,
          manageWebhooks: true,
          manageRoles: true,
          manageUsers: true,
          viewAnalytics: true,
        },
      },
    })

    // Create Editor role
    await client.create({
      _type: 'role',
      name: 'editor',
      title: 'Editor',
      description: 'Can create and edit content, request approvals',
      isSystem: true,
      userCount: 0,
      permissions: {
        documents: {
          create: ['*'],
          read: ['*'],
          update: ['*'],
          delete: [],
          publish: [],
        },
        workflows: {
          changeState: true,
          requestApproval: true,
          approveContent: false,
          schedulePublish: false,
        },
        features: {
          viewAuditLogs: true,
          exportAuditLogs: false,
          manageWebhooks: false,
          manageRoles: false,
          manageUsers: false,
          viewAnalytics: true,
        },
      },
    })

    // Create Reviewer role
    await client.create({
      _type: 'role',
      name: 'reviewer',
      title: 'Reviewer',
      description: 'Can review and approve content',
      isSystem: true,
      userCount: 0,
      permissions: {
        documents: {
          create: [],
          read: ['*'],
          update: [],
          delete: [],
          publish: ['*'],
        },
        workflows: {
          changeState: false,
          requestApproval: false,
          approveContent: true,
          schedulePublish: true,
        },
        features: {
          viewAuditLogs: true,
          exportAuditLogs: false,
          manageWebhooks: false,
          manageRoles: false,
          manageUsers: false,
          viewAnalytics: true,
        },
      },
    })

    // Create Viewer role
    await client.create({
      _type: 'role',
      name: 'viewer',
      title: 'Viewer',
      description: 'Read-only access to content',
      isSystem: true,
      userCount: 0,
      permissions: {
        documents: {
          create: [],
          read: ['*'],
          update: [],
          delete: [],
          publish: [],
        },
        workflows: {
          changeState: false,
          requestApproval: false,
          approveContent: false,
          schedulePublish: false,
        },
        features: {
          viewAuditLogs: false,
          exportAuditLogs: false,
          manageWebhooks: false,
          manageRoles: false,
          manageUsers: false,
          viewAnalytics: false,
        },
      },
    })

    console.log('Default roles created successfully')
  } catch (error) {
    console.error('Failed to create default roles:', error)
    throw error
  }
}
