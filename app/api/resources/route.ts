import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

// In-memory resource store (replace with DB/storage in production)
let resources: any[] = [
  { id: "1", type: "sermon", title: "Faith Over Fear", file: "faith-over-fear.pdf", date: "2024-05-01", speaker: "Pastor John" },
  { id: "2", type: "media", title: "Worship Night 2024", file: "worship-night.mp4", mediaType: "video" },
  { id: "3", type: "document", title: "Church Bulletin May", file: "bulletin-may.pdf" },
]

export async function GET(request: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  let query = supabase.from("resources").select("*").order("created_at", { ascending: false })
  if (type) query = query.eq("type", type)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = createAdminClient()
  const formData = await request.formData()
  const file = formData.get("file") as File
  const title = formData.get("title") as string
  const type = formData.get("type") as string
  if (!file || !title || !type) {
    return NextResponse.json({ error: "Missing file, title, or type" }, { status: 400 })
  }
  // Upload file to Supabase Storage
  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${title.replace(/\s+/g, "-")}.${fileExt}`
  const arrayBuffer = await file.arrayBuffer()
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("resources")
    .upload(fileName, Buffer.from(arrayBuffer), { contentType: file.type })
  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }
  // Get public URL
  const { data: publicUrlData } = supabase.storage.from("resources").getPublicUrl(fileName)
  const file_url = publicUrlData?.publicUrl
  // Insert metadata into resources table
  const { data: resource, error: insertError } = await supabase
    .from("resources")
    .insert({ title, type, file_url })
    .select()
    .single()
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }
  return NextResponse.json(resource, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const supabase = createAdminClient()
  const { id } = await request.json()
  // Optionally: delete file from storage as well
  const { data: resource } = await supabase.from("resources").select("*").eq("id", id).single()
  if (resource?.file_url) {
    const filePath = resource.file_url.split("/resources/")[1]
    if (filePath) {
      await supabase.storage.from("resources").remove([filePath])
    }
  }
  await supabase.from("resources").delete().eq("id", id)
  return NextResponse.json({ success: true })
} 