import { useState, useEffect, useRef } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Search, FileText, Video, Music, BookOpen, Download, Eye, Trash2 } from "lucide-react"
import { ResourceService } from "@/lib/resource-service"

export default function ResourceLibrary() {
  const [tab, setTab] = useState("sermons")
  const [search, setSearch] = useState("")
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadResources = async () => {
    setLoading(true)
    const type = tab === "sermons" ? "sermon" : tab === "media" ? "media" : "document"
    const data = await ResourceService.listResources(type)
    setResources(data)
    setLoading(false)
  }

  useEffect(() => {
    loadResources()
    // eslint-disable-next-line
  }, [tab])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const title = window.prompt("Enter resource title:")
    if (!title) return
    setUploading(true)
    const type = tab === "sermons" ? "sermon" : tab === "media" ? "media" : "document"
    const formData = new FormData()
    formData.append("file", file)
    formData.append("title", title)
    formData.append("type", type)
    await ResourceService.uploadResource(formData)
    setUploading(false)
    loadResources()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this resource?")) return
    await ResourceService.deleteResource(id)
    loadResources()
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Resource Library</h2>
          <p className="text-gray-600">Sermons, media, and document management for your church</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.mp3,.mp4,.doc,.docx,.jpg,.jpeg,.png,.ppt,.pptx"
          />
          <Button className="flex items-center gap-2" onClick={handleUploadClick} disabled={uploading}>
            <Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="sermons"><BookOpen className="h-4 w-4 mr-1" /> Sermons</TabsTrigger>
          <TabsTrigger value="media"><Video className="h-4 w-4 mr-1" /> Media</TabsTrigger>
          <TabsTrigger value="documents"><FileText className="h-4 w-4 mr-1" /> Documents</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search resources..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <TabsContent value="sermons">
          {loading ? <div>Loading...</div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.filter(s => s.title.toLowerCase().includes(search.toLowerCase())).map(sermon => (
                <Card key={sermon.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" /> {sermon.title}
                    </CardTitle>
                    <div className="text-sm text-gray-500">{sermon.speaker} {sermon.date ? `• ${sermon.date}` : null}</div>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-1" /> Preview</Button>
                    <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Download</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(sermon.id)}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="media">
          {loading ? <div>Loading...</div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.filter(m => m.title.toLowerCase().includes(search.toLowerCase())).map(media => (
                <Card key={media.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {media.mediaType === "video" ? <Video className="h-5 w-5 text-purple-600" /> : <Music className="h-5 w-5 text-green-600" />} {media.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-1" /> Preview</Button>
                    <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Download</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(media.id)}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="documents">
          {loading ? <div>Loading...</div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.filter(d => d.title.toLowerCase().includes(search.toLowerCase())).map(doc => (
                <Card key={doc.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-orange-600" /> {doc.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-1" /> Preview</Button>
                    <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Download</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(doc.id)}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 