export class ResourceService {
  static async listResources(type?: string) {
    const url = type ? `/api/resources?type=${type}` : "/api/resources"
    const res = await fetch(url)
    return res.ok ? res.json() : []
  }

  static async uploadResource(data: any) {
    let options: any = { method: "POST" }
    if (typeof window !== "undefined" && data instanceof FormData) {
      options.body = data
      // Let browser set Content-Type for FormData
    } else {
      options.headers = { "Content-Type": "application/json" }
      options.body = JSON.stringify(data)
    }
    const res = await fetch("/api/resources", options)
    return res.ok ? res.json() : null
  }

  static async deleteResource(id: string) {
    const res = await fetch("/api/resources", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    return res.ok
  }

  static getResourceUrl(resource: any) {
    return resource?.file_url || ""
  }
} 