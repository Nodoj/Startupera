import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Role-Based Access Control (RBAC) Utilities
 * Enterprise-grade authorization system
 */

export type UserRole = 'user' | 'editor' | 'admin'

export interface UserWithRole {
  id: string
  email: string
  role: UserRole
  full_name?: string
  company?: string
}

/**
 * Get current user with role information
 */
export async function getCurrentUser(): Promise<UserWithRole | null> {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  // Get user profile with role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, full_name, company')
    .eq('id', user.id)
    .single()
  
  if (profileError || !profile) {
    return null
  }
  
  return {
    id: user.id,
    email: user.email!,
    role: profile.role as UserRole,
    full_name: profile.full_name,
    company: profile.company,
  }
}

/**
 * Require authentication - redirect to signin if not authenticated
 */
export async function requireAuth(): Promise<UserWithRole> {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/signin')
  }
  
  return user
}

/**
 * Require specific role - redirect if user doesn't have required role
 */
export async function requireRole(role: UserRole | UserRole[]): Promise<UserWithRole> {
  const user = await requireAuth()
  
  const requiredRoles = Array.isArray(role) ? role : [role]
  
  if (!requiredRoles.includes(user.role)) {
    redirect('/?error=Unauthorized access')
  }
  
  return user
}

/**
 * Require admin role
 */
export async function requireAdmin(): Promise<UserWithRole> {
  return requireRole('admin')
}

/**
 * Require editor or admin role
 */
export async function requireEditor(): Promise<UserWithRole> {
  return requireRole(['editor', 'admin'])
}

/**
 * Check if user has specific role (without redirect)
 */
export async function hasRole(role: UserRole | UserRole[]): Promise<boolean> {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }
  
  const requiredRoles = Array.isArray(role) ? role : [role]
  return requiredRoles.includes(user.role)
}

/**
 * Check if user is admin (without redirect)
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin')
}

/**
 * Check if user is editor or admin (without redirect)
 */
export async function isEditor(): Promise<boolean> {
  return hasRole(['editor', 'admin'])
}

/**
 * Check if user can access resource
 * Admins can access everything, users can only access their own resources
 */
export async function canAccessResource(resourceOwnerId: string): Promise<boolean> {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }
  
  // Admins can access everything
  if (user.role === 'admin') {
    return true
  }
  
  // Users can only access their own resources
  return user.id === resourceOwnerId
}

/**
 * Check if user can modify resource
 * Admins and editors can modify, users can only modify their own resources
 */
export async function canModifyResource(resourceOwnerId: string): Promise<boolean> {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }
  
  // Admins and editors can modify
  if (user.role === 'admin' || user.role === 'editor') {
    return true
  }
  
  // Users can only modify their own resources
  return user.id === resourceOwnerId
}

/**
 * Get role hierarchy level (higher number = more permissions)
 */
export function getRoleLevel(role: UserRole): number {
  const levels: Record<UserRole, number> = {
    user: 1,
    editor: 2,
    admin: 3,
  }
  return levels[role]
}

/**
 * Check if role A has higher or equal permissions than role B
 */
export function hasHigherOrEqualRole(roleA: UserRole, roleB: UserRole): boolean {
  return getRoleLevel(roleA) >= getRoleLevel(roleB)
}
