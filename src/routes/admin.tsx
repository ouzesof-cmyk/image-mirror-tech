// @ts-nocheck
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Trash2, Plus, LogOut, Upload, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

const CATEGORIES = ['ad-campaigns', 'graphic-design', 'photography', 'video-production', 'web-development']

type Project = {
  id: string
  category: string
  title: string
  slug: string
  description: string | null
  cover_image: string | null
  client: string | null
  year: number | null
  featured: boolean
  published: boolean
  sort_order: number
  display_type: 'carousel' | 'grid'
}

type Submission = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  read: boolean
  created_at: string
}

function AdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate({ to: '/auth/login' })
  }, [user, isAdmin, loading, navigate])

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin" />
      </main>
    )
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6">
        <h1 className="font-serif text-2xl">Not authorized</h1>
        <p className="text-foreground-secondary">Your account is not an admin.</p>
        <Button onClick={() => signOut()}>Sign out</Button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Admin</h1>
            <p className="text-sm text-foreground-secondary">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="text-sm underline self-center">View site</Link>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </header>

        <Tabs defaultValue="categories">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="content">Site Content</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>
          <TabsContent value="categories" className="mt-6"><CategoriesTab /></TabsContent>
          <TabsContent value="projects" className="mt-6"><ProjectsTab /></TabsContent>
          <TabsContent value="content" className="mt-6"><ContentTab /></TabsContent>
          <TabsContent value="submissions" className="mt-6"><SubmissionsTab /></TabsContent>
          <TabsContent value="media" className="mt-6"><MediaTab /></TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

/* -------------------- Projects -------------------- */
function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Project> | null>(null)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('portfolio_projects').select('*').order('sort_order').order('created_at', { ascending: false })
    if (error) toast.error(error.message)
    else setProjects(data as Project[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return
    const { error } = await supabase.from('portfolio_projects').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); load() }
  }

  const save = async (p: Partial<Project>) => {
    const payload = {
      category: p.category!,
      title: p.title!,
      slug: p.slug || p.title!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      description: p.description ?? null,
      cover_image: p.cover_image ?? null,
      client: p.client ?? null,
      year: p.year ?? null,
      featured: !!p.featured,
      published: p.published ?? true,
      sort_order: p.sort_order ?? 0,
      display_type: p.display_type ?? 'grid',
    }
    const q = p.id
      ? supabase.from('portfolio_projects').update(payload).eq('id', p.id)
      : supabase.from('portfolio_projects').insert(payload)
    const { error } = await q
    if (error) toast.error(error.message)
    else { toast.success('Saved'); setEditing(null); load() }
  }

  if (editing) return <ProjectForm project={editing} onSave={save} onCancel={() => setEditing(null)} />

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="font-serif text-xl">Portfolio Projects</h2>
        <Button onClick={() => setEditing({ category: CATEGORIES[0], featured: false, published: true, display_type: 'grid' })}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="rounded-lg border border-border">
          {projects.length === 0 ? (
            <p className="p-8 text-center text-foreground-secondary">No projects yet.</p>
          ) : projects.map(p => (
            <div key={p.id} className="flex items-center gap-4 border-b border-border p-4 last:border-0">
              {p.cover_image && <img src={p.cover_image} alt="" className="h-12 w-12 rounded object-cover" />}
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{p.title}</p>
                <p className="text-xs text-foreground-secondary">{p.category} · {p.year ?? '—'}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{p.display_type === 'carousel' ? 'Carousel' : 'Grid'}</Badge>
                {p.featured && <Badge variant="secondary">Featured</Badge>}
                {!p.published && <Badge variant="outline">Draft</Badge>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setEditing(p)}>Edit</Button>
              <Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectForm({ project, onSave, onCancel }: { project: Partial<Project>; onSave: (p: Partial<Project>) => void; onCancel: () => void }) {
  const [p, setP] = useState<Partial<Project>>(project)
  const [uploading, setUploading] = useState(false)

  const upload = async (file: File) => {
    setUploading(true)
    const path = `projects/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const { error } = await supabase.storage.from('media').upload(path, file)
    if (error) { toast.error(error.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)
    setP({ ...p, cover_image: publicUrl })
    setUploading(false)
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(p) }} className="space-y-4 rounded-lg border border-border p-6">
      <h2 className="font-serif text-xl">{p.id ? 'Edit Project' : 'New Project'}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input required value={p.title ?? ''} onChange={(e) => setP({ ...p, title: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Slug (auto from title if empty)</Label>
          <Input value={p.slug ?? ''} onChange={(e) => setP({ ...p, slug: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={p.category} onValueChange={(v) => setP({ ...p, category: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Display as</Label>
          <Select value={p.display_type ?? 'grid'} onValueChange={(v) => setP({ ...p, display_type: v as 'carousel' | 'grid' })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="carousel">Carousel card (top)</SelectItem>
              <SelectItem value="grid">Grid item (below)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Client</Label>
          <Input value={p.client ?? ''} onChange={(e) => setP({ ...p, client: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Year</Label>
          <Input type="number" value={p.year ?? ''} onChange={(e) => setP({ ...p, year: e.target.value ? +e.target.value : null })} />
        </div>
        <div className="space-y-2">
          <Label>Sort order</Label>
          <Input type="number" value={p.sort_order ?? 0} onChange={(e) => setP({ ...p, sort_order: +e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea rows={4} value={p.description ?? ''} onChange={(e) => setP({ ...p, description: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Cover image</Label>
        <div className="flex items-center gap-3">
          <Input type="url" placeholder="Image URL" value={p.cover_image ?? ''} onChange={(e) => setP({ ...p, cover_image: e.target.value })} />
          <label className="inline-flex items-center gap-2 cursor-pointer rounded border border-border px-3 py-2 text-sm">
            <Upload className="h-4 w-4" /> {uploading ? 'Uploading…' : 'Upload'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          </label>
        </div>
        {p.cover_image && <img src={p.cover_image} alt="" className="h-32 rounded object-cover" />}
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2"><Switch checked={!!p.featured} onCheckedChange={(v) => setP({ ...p, featured: v })} /> Featured</label>
        <label className="flex items-center gap-2"><Switch checked={p.published ?? true} onCheckedChange={(v) => setP({ ...p, published: v })} /> Published</label>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

/* -------------------- Site Content -------------------- */
function ContentTab() {
  const [items, setItems] = useState<{ id: string; section: string; content: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [newSection, setNewSection] = useState('')

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('site_content').select('*').order('section')
    if (error) toast.error(error.message)
    else setItems((data ?? []).map((d: any) => ({ id: d.id, section: d.section, content: JSON.stringify(d.content, null, 2) })))
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const save = async (id: string, section: string, content: string) => {
    let parsed: any
    try { parsed = JSON.parse(content) } catch { return toast.error('Invalid JSON') }
    const { error } = await supabase.from('site_content').update({ content: parsed }).eq('id', id)
    if (error) toast.error(error.message); else toast.success(`Saved ${section}`)
  }

  const create = async () => {
    if (!newSection) return
    const { error } = await supabase.from('site_content').insert({ section: newSection, content: {} })
    if (error) toast.error(error.message); else { setNewSection(''); load() }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this section?')) return
    const { error } = await supabase.from('site_content').delete().eq('id', id)
    if (error) toast.error(error.message); else load()
  }

  if (loading) return <Loader2 className="h-5 w-5 animate-spin" />

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="New section key (e.g. hero)" value={newSection} onChange={(e) => setNewSection(e.target.value)} />
        <Button onClick={create}><Plus className="mr-2 h-4 w-4" />Add Section</Button>
      </div>
      {items.length === 0 && <p className="text-foreground-secondary">No content sections yet. Add one above.</p>}
      {items.map((it, i) => (
        <div key={it.id} className="rounded-lg border border-border p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-mono text-sm">{it.section}</h3>
            <Button variant="ghost" size="icon" onClick={() => remove(it.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
          <Textarea rows={8} className="font-mono text-xs" value={it.content}
            onChange={(e) => setItems(items.map((x, j) => j === i ? { ...x, content: e.target.value } : x))} />
          <Button className="mt-2" size="sm" onClick={() => save(it.id, it.section, it.content)}>Save</Button>
        </div>
      ))}
    </div>
  )
}

/* -------------------- Submissions -------------------- */
function SubmissionsTab() {
  const [items, setItems] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
    if (error) toast.error(error.message); else setItems(data as Submission[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const toggleRead = async (s: Submission) => {
    await supabase.from('contact_submissions').update({ read: !s.read }).eq('id', s.id)
    load()
  }
  const remove = async (id: string) => {
    if (!confirm('Delete?')) return
    await supabase.from('contact_submissions').delete().eq('id', id)
    load()
  }

  if (loading) return <Loader2 className="h-5 w-5 animate-spin" />
  if (items.length === 0) return <p className="text-foreground-secondary">No submissions yet.</p>

  return (
    <div className="space-y-3">
      {items.map(s => (
        <div key={s.id} className={`rounded-lg border border-border p-4 ${s.read ? 'opacity-70' : ''}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{s.name}</p>
                <a href={`mailto:${s.email}`} className="text-sm text-accent-gold underline">{s.email}</a>
                {!s.read && <Badge>New</Badge>}
              </div>
              {s.subject && <p className="text-sm font-medium mt-1">{s.subject}</p>}
              <p className="mt-2 whitespace-pre-wrap text-sm">{s.message}</p>
              <p className="mt-2 text-xs text-foreground-secondary">{new Date(s.created_at).toLocaleString()}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" onClick={() => toggleRead(s)}>{s.read ? 'Mark unread' : 'Mark read'}</Button>
              <Button variant="ghost" size="icon" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* -------------------- Media -------------------- */
function MediaTab() {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.storage.from('media').list('uploads', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })
    if (error) toast.error(error.message)
    else {
      const items = (data ?? []).filter(f => f.name).map(f => {
        const path = `uploads/${f.name}`
        return { name: f.name, url: supabase.storage.from('media').getPublicUrl(path).data.publicUrl }
      })
      setFiles(items)
    }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const upload = async (file: File) => {
    setUploading(true)
    const path = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const { error } = await supabase.storage.from('media').upload(path, file)
    setUploading(false)
    if (error) toast.error(error.message); else { toast.success('Uploaded'); load() }
  }

  const remove = async (name: string) => {
    if (!confirm('Delete file?')) return
    const { error } = await supabase.storage.from('media').remove([`uploads/${name}`])
    if (error) toast.error(error.message); else load()
  }

  return (
    <div className="space-y-4">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-border px-4 py-2">
        <Upload className="h-4 w-4" /> {uploading ? 'Uploading…' : 'Upload file'}
        <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      </label>
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {files.length === 0 && <p className="text-foreground-secondary">No files uploaded.</p>}
          {files.map(f => (
            <div key={f.name} className="group relative overflow-hidden rounded border border-border">
              {/\.(png|jpe?g|webp|gif|svg)$/i.test(f.name) ? (
                <img src={f.url} alt={f.name} className="aspect-square w-full object-cover" />
              ) : (
                <div className="flex aspect-square items-center justify-center bg-muted text-xs">{f.name.split('.').pop()}</div>
              )}
              <div className="p-2">
                <p className="truncate text-xs">{f.name}</p>
                <div className="mt-1 flex gap-1">
                  <button type="button" className="text-xs underline" onClick={() => navigator.clipboard.writeText(f.url).then(() => toast.success('URL copied'))}>Copy URL</button>
                  <button type="button" className="ml-auto text-xs text-destructive" onClick={() => remove(f.name)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* -------------------- Categories -------------------- */
type Category = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  image_url: string | null
  display_order: number
  display_mode: 'carousel' | 'grid' | 'both'
  published: boolean
}

function CategoriesTab() {
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Category> | null>(null)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('portfolio_categories').select('*').order('display_order')
    if (error) toast.error(error.message)
    else setItems(data as Category[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const remove = async (id: string) => {
    if (!confirm('Delete this category?')) return
    const { error } = await supabase.from('portfolio_categories').delete().eq('id', id)
    if (error) toast.error(error.message); else { toast.success('Deleted'); load() }
  }

  const save = async (c: Partial<Category>) => {
    const payload = {
      slug: (c.slug || c.title!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')),
      title: c.title!,
      subtitle: c.subtitle ?? null,
      image_url: c.image_url ?? null,
      display_order: c.display_order ?? 0,
      display_mode: (c.display_mode ?? 'carousel') as 'carousel' | 'grid' | 'both',
      published: c.published ?? true,
    }
    const q = c.id
      ? supabase.from('portfolio_categories').update(payload).eq('id', c.id)
      : supabase.from('portfolio_categories').insert(payload)
    const { error } = await q
    if (error) toast.error(error.message); else { toast.success('Saved'); setEditing(null); load() }
  }

  if (editing) return <CategoryForm category={editing} onSave={save} onCancel={() => setEditing(null)} />

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="font-serif text-xl">Portfolio Categories (homepage Work section)</h2>
        <Button onClick={() => setEditing({ display_mode: 'carousel', published: true, display_order: items.length + 1 })}>
          <Plus className="mr-2 h-4 w-4" /> New Category
        </Button>
      </div>
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="rounded-lg border border-border">
          {items.length === 0 ? (
            <p className="p-8 text-center text-foreground-secondary">No categories yet.</p>
          ) : items.map(c => (
            <div key={c.id} className="flex items-center gap-4 border-b border-border p-4 last:border-0">
              {c.image_url && <img src={c.image_url} alt="" className="h-12 w-12 rounded object-cover" />}
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{c.title} <span className="text-xs text-foreground-secondary">/{c.slug}</span></p>
                <p className="text-xs text-foreground-secondary">{c.subtitle}</p>
              </div>
              <Badge variant="secondary">{c.display_mode}</Badge>
              <span className="text-xs text-foreground-secondary">#{c.display_order}</span>
              {!c.published && <Badge variant="outline">Hidden</Badge>}
              <Button variant="ghost" size="sm" onClick={() => setEditing(c)}>Edit</Button>
              <Button variant="ghost" size="icon" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryForm({ category, onSave, onCancel }: { category: Partial<Category>; onSave: (c: Partial<Category>) => void; onCancel: () => void }) {
  const [c, setC] = useState<Partial<Category>>(category)
  const [uploading, setUploading] = useState(false)

  const upload = async (file: File) => {
    setUploading(true)
    const path = `categories/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const { error } = await supabase.storage.from('media').upload(path, file)
    if (error) { toast.error(error.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)
    setC({ ...c, image_url: publicUrl })
    setUploading(false)
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(c) }} className="space-y-4 rounded-lg border border-border p-6">
      <h2 className="font-serif text-xl">{c.id ? 'Edit Category' : 'New Category'}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input required value={c.title ?? ''} onChange={(e) => setC({ ...c, title: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Slug (links to /portfolio/&lt;slug&gt;)</Label>
          <Input value={c.slug ?? ''} onChange={(e) => setC({ ...c, slug: e.target.value })} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Subtitle</Label>
          <Input value={c.subtitle ?? ''} onChange={(e) => setC({ ...c, subtitle: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Display mode</Label>
          <Select value={c.display_mode ?? 'carousel'} onValueChange={(v) => setC({ ...c, display_mode: v as Category['display_mode'] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="carousel">Carousel only</SelectItem>
              <SelectItem value="grid">Grid only</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Display order</Label>
          <Input type="number" value={c.display_order ?? 0} onChange={(e) => setC({ ...c, display_order: +e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Image</Label>
        <div className="flex items-center gap-3">
          <Input type="url" placeholder="Image URL" value={c.image_url ?? ''} onChange={(e) => setC({ ...c, image_url: e.target.value })} />
          <label className="inline-flex items-center gap-2 cursor-pointer rounded border border-border px-3 py-2 text-sm">
            <Upload className="h-4 w-4" /> {uploading ? 'Uploading…' : 'Upload'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          </label>
        </div>
        {c.image_url && <img src={c.image_url} alt="" className="h-32 rounded object-cover" />}
      </div>
      <label className="flex items-center gap-2"><Switch checked={c.published ?? true} onCheckedChange={(v) => setC({ ...c, published: v })} /> Published</label>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}
