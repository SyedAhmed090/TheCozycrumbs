import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif',
}
const ALLOWED_FOLDERS = ['products', 'references']
const MAX_SIZE = 5 * 1024 * 1024

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, WebP, and GIF images are allowed' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 })
    }

    // Extension from validated MIME type, folder from allowlist — never from user input
    const ext = EXT_BY_TYPE[file.type] ?? 'jpg'
    const folderRaw = (formData.get('folder') as string | null)?.trim()
    const folder = folderRaw && ALLOWED_FOLDERS.includes(folderRaw) ? folderRaw : null
    const filename = folder
      ? `${folder}/${crypto.randomUUID()}.${ext}`
      : `${crypto.randomUUID()}.${ext}`
    const buffer = await file.arrayBuffer()

    const supabase = createAdminClient()
    const { error } = await supabase.storage
      .from('reference-images')
      .upload(filename, buffer, { contentType: file.type, upsert: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('reference-images')
      .getPublicUrl(filename)

    return NextResponse.json({ url: publicUrl })
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
