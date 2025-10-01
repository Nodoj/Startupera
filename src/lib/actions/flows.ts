'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Database } from '@/types/database'

type Flow = Database['public']['Tables']['flows']['Row']
type FlowInsert = Database['public']['Tables']['flows']['Insert']
type FlowUpdate = Database['public']['Tables']['flows']['Update']

export interface FlowFilters {
  category?: string
  complexity?: string
  technologies?: string[]
  status?: string
  search?: string
}

export async function getFlows(filters?: FlowFilters) {
  const supabase = await createClient()
  
  let query = supabase
    .from('flows')
    .select(`
      *,
      profiles:author_id (
        full_name,
        avatar_url
      )
    `)
  
  // Apply filters
  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  
  if (filters?.complexity) {
    query = query.eq('complexity', filters.complexity)
  }
  
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  
  if (filters?.technologies && filters.technologies.length > 0) {
    query = query.overlaps('technologies', filters.technologies)
  }
  
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching flows:', error)
    return []
  }
  
  return data
}

export async function getFlow(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('flows')
    .select(`
      *,
      profiles:author_id (
        full_name,
        avatar_url
      )
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching flow:', error)
    return null
  }
  
  return data
}

export async function createFlow(flowData: FlowInsert) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }
  
  const { data, error } = await supabase
    .from('flows')
    .insert({
      ...flowData,
      author_id: user.id,
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating flow:', error)
    throw new Error('Failed to create flow')
  }
  
  revalidatePath('/admin/flows')
  revalidatePath('/flows')
  return data
}

export async function updateFlow(id: string, flowData: FlowUpdate) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('flows')
    .update({
      ...flowData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating flow:', error)
    throw new Error('Failed to update flow')
  }
  
  revalidatePath('/admin/flows')
  revalidatePath('/flows')
  return data
}

export async function deleteFlow(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('flows')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting flow:', error)
    throw new Error('Failed to delete flow')
  }
  
  revalidatePath('/admin/flows')
  revalidatePath('/flows')
}

export async function publishFlow(id: string) {
  return updateFlow(id, { status: 'published' })
}

export async function unpublishFlow(id: string) {
  return updateFlow(id, { status: 'draft' })
}

export async function getFlowCategories() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('flows')
    .select('category')
    .not('category', 'is', null)
  
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  
  const categories = [...new Set(data.map(item => item.category))]
  return categories
}

export async function getFlowTechnologies() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('flows')
    .select('technologies')
    .not('technologies', 'is', null)
  
  if (error) {
    console.error('Error fetching technologies:', error)
    return []
  }
  
  const allTechnologies = data.flatMap(item => item.technologies || [])
  const uniqueTechnologies = [...new Set(allTechnologies)]
  return uniqueTechnologies
}
