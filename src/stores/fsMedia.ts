import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type MediaKind = 'image' | 'video' | 'audio' | 'pdf' | 'other'

export interface MediaFile {
  id: string
  name: string
  nameClear: string
  relPath: string
  relDir: string
  ext: string
  kind: MediaKind
  file: File
  url: string
}

export interface FsMediaOptions {
  storageKey?: string
  mode?: 'read' | 'readwrite'
  includeExts?: string[]
  excludeHidden?: boolean
}

const DEFAULT_EXTS = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'gif',
  'avif',
  'svg',
  'mp4',
  'webm',
  'mov',
  'm4v',
  'ogv',
  '3gp',
  'avi',
  'mkv',
  'mp3',
  'wav',
  'flac',
  'm4a',
  'aac',
  'ogg',
  'opus',
  'pdf',
]

const DB_NAME = 'fs-handles-db'
const STORE = 'handles'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function dbSet<T>(key: string, val: T) {
  const db = await openDB()
  await new Promise<void>((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(val as any, key)
    tx.oncomplete = () => res()
    tx.onerror = () => rej(tx.error)
  })
  db.close()
}

async function dbGet<T>(key: string) {
  const db = await openDB()
  const out = await new Promise<T | undefined>((res, rej) => {
    const tx = db.transaction(STORE, 'readonly')
    const r = tx.objectStore(STORE).get(key)
    r.onsuccess = () => res(r.result as T | undefined)
    r.onerror = () => rej(r.error)
  })
  db.close()
  return out
}

async function dbDel(key: string) {
  const db = await openDB()
  await new Promise<void>((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(key)
    tx.oncomplete = () => res()
    tx.onerror = () => rej(tx.error)
  })
  db.close()
}

function kindByExt(ext: string): MediaKind {
  const e = ext.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'svg'].includes(e)) return 'image'
  if (['mp4', 'webm', 'mov', 'm4v', 'ogv', '3gp', 'avi', 'mkv'].includes(e)) return 'video'
  if (['mp3', 'wav', 'flac', 'm4a', 'aac', 'ogg', 'opus'].includes(e)) return 'audio'
  if (e === 'pdf') return 'pdf'
  return 'other'
}

async function walkDir(root: FileSystemDirectoryHandle, basePath = ''): Promise<[string, File][]> {
  const out: [string, File][] = []
  // @ts-expect-error тс отстань брат
  for await (const [name, handle] of root.entries() as AsyncIterable<[string, FileSystemHandle]>) {
    if (handle.kind === 'file') {
      const file = await (handle as FileSystemFileHandle).getFile()
      out.push([basePath + name, file])
    } else if (handle.kind === 'directory') {
      const nested = await walkDir(handle as FileSystemDirectoryHandle, basePath + name + '/')
      out.push(...nested)
    }
  }
  return out
}

function revokeAllUrls(list: MediaFile[]) {
  for (const f of list) {
    try {
      URL.revokeObjectURL(f.url)
    } catch {}
  }
}

export const useFsMediaStore = defineStore('fsMedia', () => {
  const storageKey = ref('presentations-dir')
  const mode = ref<'read' | 'readwrite'>('read')
  const includeExts = ref(DEFAULT_EXTS.map((e) => e.toLowerCase()))
  const excludeHidden = ref(true)

  const dirHandle = ref<FileSystemDirectoryHandle | null>(null)
  const files = ref<MediaFile[]>([])
  const status = ref('')
  const hasAccess = ref(false)

  const needsPermission = computed(() => !hasAccess.value)
  const images = computed(() => files.value.filter((f) => f.kind === 'image'))
  const videos = computed(() => files.value.filter((f) => f.kind === 'video'))
  const audios = computed(() => files.value.filter((f) => f.kind === 'audio'))
  const pdfs = computed(() => files.value.filter((f) => f.kind === 'pdf'))

  const byDir = computed(() => {
    const map = new Map<string, MediaFile[]>()
    for (const f of files.value) {
      const key = f.relDir || '.'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(f)
    }
    return map
  })

  function inDir(dir: string) {
    const norm = dir.replace(/^\/+|\/+$/g, '')
    return files.value.filter((f) => f.relDir === norm)
  }

  function search(q: string) {
    const s = q.toLowerCase()
    return files.value.filter(
      (f) =>
        f.name.toLowerCase().includes(s) ||
        f.relDir.toLowerCase().includes(s) ||
        f.ext.toLowerCase() === s,
    )
  }

  function extAllowed(ext: string) {
    return includeExts.value.length === 0 || includeExts.value.includes(ext.toLowerCase())
  }

  function initOptions(opts: FsMediaOptions = {}) {
    if (opts.storageKey) storageKey.value = opts.storageKey
    if (opts.mode) mode.value = opts.mode
    includeExts.value = (opts.includeExts ?? DEFAULT_EXTS).map((e) => e.toLowerCase())
    excludeHidden.value = opts.excludeHidden ?? true
  }

  async function ensureAccess(): Promise<FileSystemDirectoryHandle> {
    let handle = await dbGet<FileSystemDirectoryHandle>(storageKey.value)
    if (!handle) {
      handle = await (window as any).showDirectoryPicker()
      await dbSet(storageKey.value, handle)
    }
    // @ts-expect-error тс отстань брат
    let perm = (await handle.queryPermission?.({ mode: mode.value })) ?? 'granted'
    if (perm !== 'granted') {
      // @ts-expect-error тс отстань брат
      perm = await handle.requestPermission?.({ mode: mode.value })
    }
    hasAccess.value = perm === 'granted'
    if (!hasAccess.value) {
      await dbDel(storageKey.value)
      throw new Error('Доступ к папке не предоставлен')
    }
    // @ts-expect-error тс отстань брат
    dirHandle.value = handle
    // @ts-expect-error тс отстань брат
    return handle
  }

  async function pickDirectory() {
    const handle = await (window as any).showDirectoryPicker()
    await dbSet(storageKey.value, handle)
    dirHandle.value = handle

    let perm = (await handle.queryPermission?.({ mode: mode.value })) ?? 'granted'
    if (perm !== 'granted') {
      perm = await handle.requestPermission?.({ mode: mode.value })
    }
    hasAccess.value = perm === 'granted'

    await rescan()

    return handle
  }

  async function rescan() {
    if (!dirHandle.value) await ensureAccess()

    status.value = 'Читаю файлы…'
    const list = await walkDir(dirHandle.value!)

    revokeAllUrls(files.value)

    files.value = list
      .filter(([relPath]) => {
        if (!excludeHidden.value) return true
        return !relPath.split('/').some((seg) => seg.startsWith('.'))
      })
      .map(([relPath, file]) => {
        const name = relPath.split('/').pop() ?? relPath
        const relDir = relPath.slice(0, -name.length).replace(/\/$/, '')
        const ext = (name.split('.').pop() ?? '').toLowerCase()
        return { relPath, file, name, relDir, ext }
      })
      .filter((f) => (includeExts.value.length ? extAllowed(f.ext) : true))
      .map((f) => ({
        id: f.relPath,
        name: f.name,
        nameClear: f.name.split('.').shift() || '',
        relPath: f.relPath,
        relDir: f.relDir,
        ext: f.ext,
        kind: kindByExt(f.ext),
        file: f.file,
        url: URL.createObjectURL(f.file),
      }))
      .sort((a, b) => a.relPath.localeCompare(b.relPath, 'ru'))
    status.value = `Готово: ${files.value.length} файл(ов)`
  }

  async function tryRestoreOnInit() {
    try {
      const saved = await dbGet<FileSystemDirectoryHandle>(storageKey.value)
      if (!saved) {
        hasAccess.value = false
        return
      }
      // @ts-expect-error тс отстань брат
      let perm = (await saved.queryPermission?.({ mode: mode.value })) ?? 'granted'
      if (perm !== 'granted') {
        // @ts-expect-error тс отстань брат
        perm = await saved.requestPermission?.({ mode: mode.value })
      }
      hasAccess.value = perm === 'granted'
      if (hasAccess.value) {
        dirHandle.value = saved
        await rescan()
      }
    } catch {
      hasAccess.value = false
    }
  }

  async function revokeAccess() {
    await dbDel(storageKey.value)
    revokeAllUrls(files.value)
    files.value = []
    dirHandle.value = null
    hasAccess.value = false
  }

  return {
    dirHandle,
    files,
    status,
    hasAccess,
    initOptions,
    needsPermission,
    images,
    videos,
    audios,
    pdfs,
    byDir,
    inDir,
    search,
    ensureAccess,
    pickDirectory,
    rescan,
    tryRestoreOnInit,
    revokeAccess,
  }
})
