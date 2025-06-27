import { supabase } from './supabaseApi'

export const STORAGE_BUCKETS = {
  PAULEAN_FILES: 'paulean-files',
  CHAT_ATTACHMENTS: 'chat-attachments',
  USER_UPLOADS: 'user-uploads'
}

export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
  fileName?: string
  fileSize?: number
  fileType?: string
}

export async function uploadFile(
  file: File, 
  bucket: string = STORAGE_BUCKETS.PAULEAN_FILES,
  folder: string = 'uploads'
): Promise<UploadResult> {
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${MAX_FILE_SIZE / 1024 / 1024}MB)`
      }
    }

    // Validate file type
    const isValidImage = ALLOWED_FILE_TYPES.IMAGES.includes(file.type)
    const isValidDocument = ALLOWED_FILE_TYPES.DOCUMENTS.includes(file.type)
    
    if (!isValidImage && !isValidDocument) {
      return {
        success: false,
        error: `File type ${file.type} is not supported. Please upload images or documents only.`
      }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await (supabase.storage as any)
      .from(bucket)
      .upload(filePath, file)

    if (error) {
      console.error('Storage upload error:', error)
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return {
      success: true,
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    }

  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error'
    }
  }
}

export async function deleteFile(
  filePath: string, 
  bucket: string = STORAGE_BUCKETS.PAULEAN_FILES
): Promise<boolean> {
  try {
    const { error } = await (supabase.storage as any)
      .from(bucket)
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

export function getFileTypeCategory(mimeType: string): 'image' | 'document' | 'unknown' {
  if (ALLOWED_FILE_TYPES.IMAGES.includes(mimeType)) {
    return 'image'
  }
  if (ALLOWED_FILE_TYPES.DOCUMENTS.includes(mimeType)) {
    return 'document'
  }
  return 'unknown'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function isValidFileType(file: File): boolean {
  return ALLOWED_FILE_TYPES.IMAGES.includes(file.type) || 
         ALLOWED_FILE_TYPES.DOCUMENTS.includes(file.type)
}

export function getFileIcon(mimeType: string): string {
  if (mimeType.includes('image')) return '🖼️'
  if (mimeType.includes('pdf')) return '📄'
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝'
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📊'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📈'
  if (mimeType.includes('text')) return '��'
  return '📁'
} 