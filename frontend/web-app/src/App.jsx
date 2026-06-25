import { useEffect, useState } from 'react'
import './styles.css'
import 'leaflet/dist/leaflet.css'
import { fetchCombinedNearby } from './api.js'
import * as store from './store.js'
import { canEditVendor } from './perms.js'
import Home from './components/Home.jsx'
import MapScreen from './components/MapScreen.jsx'
import VendorDetail from './components/VendorDetail.jsx'
import PostForm from './components/PostForm.jsx'
import VendorForm from './components/VendorForm.jsx'
import Notifications from './components/Notifications.jsx'
import Profile from './components/Profile.jsx'
import BottomNav from './components/BottomNav.jsx'

const DEFAULT_ME = [12.9740, 77.6040]

export default function App() {
  const [tab, setTab] = useState('home')
  const [me, setMe] = useState(DEFAULT_ME)
  const [vendors, setVendors] = useState(store.all())
  const [posts, setPosts] = useState(store.allPosts())
  const [usingDemo, setUsingDemo] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [directionsTo, setDirectionsTo] = useState(null)
  const [following, setFollowing] = useState([])
  const [role, setRole] = useState('USER')
  const [postForm, setPostForm] = useState(null) // {prefill?}
  const [editForm, setEditForm] = useState(null)  // {vendor} (vendor/admin only)

  useEffect(() => store.subscribe(setVendors), [])
  useEffect(() => store.subscribePosts(setPosts), [])
  useEffect(() => {
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(
      p => setMe([p.coords.latitude, p.coords.longitude]), () => {})
  }, [])
  useEffect(() => { (async () => {
    try { const list = await fetchCombinedNearby(me[0], me[1], 5)
      if (Array.isArray(list) && list.length) { store.mergeFeed(list); setUsingDemo(false); return } } catch {}
    setUsingDemo(true)
  })() }, [me])

  const selected = selectedId ? vendors.find(v => v.id === selectedId) : null
  const selIdx = selected ? vendors.findIndex(v => v.id === selectedId) : 0
  const nearbyPosts = store.postsNear(me, 5)

  const onOpen = { vendor: v => setSelectedId(v.id), profile: () => setTab('profile') }
  const startDirections = (v) => { setDirectionsTo(v); setSelectedId(null); setTab('map') }
  const toggleFollow = (v) => setFollowing(f => f.includes(v.id) ? f.filter(x=>x!==v.id) : [...f, v.id])
  const confirm = (v) => store.setVendorStatus(v.id, 'confirm')
  const onReview = (v, r) => store.addReview(v.id, r)

  // Vendor/Admin-only mutations (UI already gates, double-check here)
  const onStatus = (v, action) => { if (canEditVendor(role, v)) store.setVendorStatus(v.id, action) }
  const onToggleSoldOut = (v, i) => { if (canEditVendor(role, v)) store.toggleSoldOut(v.id, i) }
  const onEdit = (v) => { if (canEditVendor(role, v)) { setSelectedId(null); setEditForm({ vendor:v }) } }
  const onDelete = (v) => { if (canEditVendor(role, v)) { store.removeVendor(v.id); setSelectedId(null) } }
  const saveEdit = async (data) => { await store.editVendor(editForm.vendor.id, data); setEditForm(null) }

  // Anyone: post a sighting
  const openPost = (prefill=null) => { setSelectedId(null); setPostForm({ prefill }) }
  const savePost = async (data) => { await store.addPost(data); setPostForm(null); setTab('home') }
  const openPostFromVendor = (v) => openPost({ name:v.name, cuisine:v.cuisine, address:v.address, lat:v.lat, lng:v.lng })
  const openPostFromPost = (p) => { const v = vendors.find(x=>x.id===p.vendorId); if (v) setSelectedId(v.id) }

  return (
    <div className="app">
      {tab==='home' && <Home vendors={vendors} posts={nearbyPosts} usingDemo={usingDemo}
                        onOpen={onOpen} onShowMap={()=>setTab('map')} onOpenPost={openPostFromPost} />}
      {tab==='map' && <MapScreen me={me} vendors={vendors} onOpen={onOpen}
                        directionsTo={directionsTo} clearDirections={()=>setDirectionsTo(null)} />}
      {tab==='alerts' && <Notifications />}
      {tab==='profile' && <Profile following={following} role={role} setRole={setRole} onPost={()=>openPost()} />}

      {selected && <VendorDetail vendor={selected} idx={selIdx} role={role} following={following.includes(selected.id)}
        onClose={()=>setSelectedId(null)} onDirections={startDirections} onToggleFollow={toggleFollow}
        onConfirm={confirm} onReview={onReview} onEdit={onEdit} onDelete={onDelete}
        onStatus={onStatus} onToggleSoldOut={onToggleSoldOut} onPostAbout={openPostFromVendor} />}

      {postForm && <PostForm initial={postForm.prefill} me={me} onClose={()=>setPostForm(null)} onSave={savePost} />}
      {editForm && <VendorForm initial={editForm.vendor} me={me} onClose={()=>setEditForm(null)} onSave={saveEdit} />}

      {(tab==='home' || tab==='map') && !selected && !postForm && !editForm &&
        <button onClick={()=>openPost()} aria-label="Post a sighting"
          style={{position:'fixed',right:'calc(50% - 230px + 16px)',bottom:90,zIndex:60,width:56,height:56,
                  borderRadius:'50%',border:0,background:'#fc6a2d',color:'#fff',fontSize:26,
                  boxShadow:'0 6px 18px rgba(252,106,45,.5)',cursor:'pointer'}}>📸</button>}

      <BottomNav tab={tab} setTab={setTab} notifCount={3} />
    </div>
  )
}
