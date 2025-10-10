import { createClient } from '@/utils/supabase/client'

export async function uploadFlowImage(file: File): Promise<string | null> {
  try {
    const supabase = createClient()
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `flows/${fileName}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('flow-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('flow-images')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

export async function uploadContentImage(file: File): Promise<string | null> {
  try {
    const supabase = createClient()
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `content-images/${fileName}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('flow-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('flow-images')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error uploading content image:', error)
    return null
  }
}

export async function deleteFlowImage(url: string): Promise<boolean> {
  try {
    const supabase = createClient()
    
    // Extract file path from URL
    const urlParts = url.split('/flow-images/')
    if (urlParts.length < 2) return false
    
    const filePath = urlParts[1]

    const { error } = await supabase.storage
      .from('flow-images')
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}
