// Local-first store: keeps the vendor list (demo + user-added/edited) in localStorage so
// add / edit / remove / review / menu / status changes survive reloads. When the backend
// is reachable, mutations are also sent there (best-effort).
import { DEMO } from './data.js'
import * as api from './api.js'

const KEY = 'streeteats.vendors.v1'

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (Array.isArray(saved) && saved.length) return saved
  } catch {}
  return structuredClone(DEMO)
}
function persist(list) { try { localStorage.setItem(KEY, JSON.stringify(list)) } catch {} }

let vendors = load()
const subs = new Set()
function emit() { persist(vendors); subs.forEach(fn => fn([...vendors])) }

export function subscribe(fn) { subs.add(fn); fn([...vendors]); return () => subs.delete(fn) }
export function all() { return [...vendors] }
export function get(id) { return vendors.find(v => v.id === id) }

const uid = () => 'u-' + Math.random().toString(36).slice(2, 9)
const emojiFor = (c='') => ({chaat:'🥘',dosa:'🥞',momos:'🥟',juice:'🥤',rolls:'🌯',sweets:'🍮',tea:'☕'}[(c||'').toLowerCase()] || '🍴')

export async function addVendor(v) {
  const local = {
    id: uid(), name:v.name, cuisine:v.cuisine, emoji:emojiFor(v.cuisine), veg:!!v.veg,
    lat:v.lat, lng:v.lng, address:v.address, state:'UNCONFIRMED', minutesSinceConfirmed:null,
    averageRating:0, reviewCount:0, priceForTwo:v.priceForTwo||null,
    source:'COMMUNITY_ADDED', verified:false, mine:true,
    menuItems:(v.menuItems||[]).filter(i=>i.name), reviews:[]
  }
  try { const saved = await api.addVendor({ ...v, source:'COMMUNITY_ADDED' }); if (saved?.id) local.id = saved.id } catch {}
  vendors = [local, ...vendors]; emit(); return local
}

export async function editVendor(id, patch) {
  vendors = vendors.map(v => v.id===id ? { ...v, ...patch, emoji:emojiFor(patch.cuisine||v.cuisine) } : v)
  emit()
  try { await api.updateVendor(id, patch) } catch {}
}

export async function removeVendor(id) {
  vendors = vendors.filter(v => v.id !== id); emit()
  try { await api.deleteVendor(id) } catch {}
}

export async function addReview(id, review) {
  vendors = vendors.map(v => {
    if (v.id!==id) return v
    const reviews = [{ who:review.who||'You', rating:review.rating, cmt:review.cmt }, ...(v.reviews||[])]
    const avg = reviews.reduce((s,r)=>s+r.rating,0)/reviews.length
    return { ...v, reviews, reviewCount:(v.reviewCount||0)+1, averageRating:Math.round(avg*10)/10 }
  })
  emit()
  try { await api.postReview(id, { userId:'me', rating:review.rating, comment:review.cmt }) } catch {}
}

export async function setVendorStatus(id, action) {
  const map = { 'go-live':'OPEN', moving:'MOVING', close:'CLOSED', confirm:'OPEN' }
  vendors = vendors.map(v => v.id===id
    ? { ...v, state: map[action]||v.state, minutesSinceConfirmed: action==='close'?null:0 } : v)
  emit()
  try {
    const v = get(id)
    await api.setStatus(id, action, action==='go-live' ? { lat:v.lat, lng:v.lng } : null)
  } catch {}
}

export async function saveMenu(id, items) {
  vendors = vendors.map(v => v.id===id ? { ...v, menuItems:[...items] } : v); emit()
  try { await api.postMenu(id, items) } catch {}
}

export function toggleSoldOut(id, idx) {
  vendors = vendors.map(v => {
    if (v.id!==id) return v
    const menuItems = (v.menuItems||[]).map((it,i)=> i===idx ? { ...it, soldOut:!it.soldOut } : it)
    return { ...v, menuItems }
  })
  emit()
}

// Merge a fresh backend feed without losing locally-added vendors.
export function mergeFeed(feed) {
  if (!Array.isArray(feed) || !feed.length) return
  const byId = new Map(vendors.map(v => [v.id, v]))
  feed.forEach(f => {
    const ex = byId.get(f.id) || {}
    byId.set(f.id, { ...ex, ...f, emoji: ex.emoji || emojiFor(f.cuisine),
      reviews: ex.reviews || [], menuItems: f.menuItems || ex.menuItems || [] })
  })
  vendors = [...byId.values()]; emit()
}

// ---------------- Community posts (Instagram-style sightings) ----------------
const PKEY = 'streeteats.posts.v1'
function loadPosts() { try { return JSON.parse(localStorage.getItem(PKEY) || '[]') } catch { return [] } }
function persistPosts(list) { try { localStorage.setItem(PKEY, JSON.stringify(list)) } catch {} }

let posts = loadPosts()
const psubs = new Set()
function pemit() { persistPosts(posts); psubs.forEach(fn => fn([...posts])) }

export function subscribePosts(fn) { psubs.add(fn); fn([...posts]); return () => psubs.delete(fn) }
export function allPosts() { return [...posts] }

/**
 * A user posts a sighting: "found this cart, here's the menu + where it is".
 * This is NOT an authoritative edit — it creates a community post AND a
 * community-tracked vendor pin (unverified) that the real vendor can later claim.
 */
export async function addPost(p) {
  const loc = p.loc || [12.9740, 77.6040]
  const lat = p.lat ?? loc[0] + (Math.random()-.5)*0.01
  const lng = p.lng ?? loc[1] + (Math.random()-.5)*0.01
  const vendor = await addVendor({
    name: p.name, cuisine: p.cuisine, veg: p.veg, address: p.address,
    lat, lng, priceForTwo: p.priceForTwo || null,
    menuItems: (p.menuLines || []).map(name => ({ name }))   // claimed menu (community)
  })
  const post = {
    id: 'p-' + Math.random().toString(36).slice(2,9),
    vendorId: vendor.id, author: p.author || 'You', caption: p.caption || '',
    emoji: vendor.emoji, name: p.name, cuisine: p.cuisine, address: p.address,
    menuLines: p.menuLines || [], lat, lng, createdAt: Date.now()
  }
  posts = [post, ...posts]; pemit()
  return post
}

function km(a, b) {
  const R=6371, d=Math.PI/180
  const dLat=(b[0]-a[0])*d, dLng=(b[1]-a[1])*d
  const s=Math.sin(dLat/2)**2+Math.cos(a[0]*d)*Math.cos(b[0]*d)*Math.sin(dLng/2)**2
  return 2*R*Math.asin(Math.sqrt(s))
}
/** Recent posts near the user — these "pop up" in the feed. */
export function postsNear(me, radiusKm = 3) {
  if (!me) return [...posts]
  return posts
    .map(p => ({ ...p, distanceKm: km(me, [p.lat, p.lng]) }))
    .filter(p => p.distanceKm <= radiusKm)
    .sort((a,b) => b.createdAt - a.createdAt)
}
