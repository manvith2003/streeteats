import { useEffect, useState } from 'react'
import './styles.css'
import 'leaflet/dist/leaflet.css'
import { fetchCombinedNearby } from './api.js'
import * as store from './store.js'
import Home from './components/Home.jsx'
import MapScreen from './components/MapScreen.jsx'
import VendorDetail from './components/VendorDetail.jsx'
import VendorForm from './components/VendorForm.jsx'
import Notifications from './components/Notifications.jsx'
import Profile from './components/Profile.jsx'
import BottomNav from './components/BottomNav.jsx'

const DEFAULT_ME = [12.9740, 77.6040]

export default function App() {
  const [tab, setTab] = useState('home')
  const [me, setMe] = useState(DEFAULT_ME)
  const [vendors, setVendors] = useState(store.all())
  const [usingDemo, setUsingDemo] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [directionsTo, setDirectionsTo] = useState(null)
  const [following, setFollowing] = useState([])
  const [form, setForm] = useState(null) // {mode:'add'} | {mode:'edit', vendor}

  useEffect(() => store.subscribe(setVendors), [])

  useEffect(() => {
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(
      p => setMe([p.coords.latitude, p.coords.longitude]), () => {})
  }, [])

  useEffect(() => { (async () => {
    try {
      const list = await fetchCombinedNearby(me[0], me[1], 5)
      if (Array.isArray(list) && list.length) { store.mergeFeed(list); setUsingDemo(false); return }
    } catch {}
    setUsingDemo(true)
  })() }, [me])

  const selected = selectedId ? vendors.find(v => v.id === selectedId) : null
  const selIdx = selected ? vendors.findIndex(v => v.id === selectedId) : 0

  const onOpen = { vendor: v => setSelectedId(v.id), profile: () => setTab('profile') }

  const startDirections = (v) => { setDirectionsTo(v); setSelectedId(null); setTab('map') }
  const toggleFollow = (v) => setFollowing(f => f.includes(v.id) ? f.filter(x=>x!==v.id) : [...f, v.id])
  const confirm = (v) => { store.setVendorStatus(v.id, 'confirm'); }

  const saveForm = async (data) => {
    if (form?.mode === 'edit') await store.editVendor(form.vendor.id, data)
    else await store.addVendor(data)
    setForm(null)
  }
  const onEdit = (v) => { setSelectedId(null); setForm({ mode:'edit', vendor:v }) }
  const onDelete = (v) => { store.removeVendor(v.id); setSelectedId(null) }
  const onReview = (v, r) => store.addReview(v.id, r)
  const onStatus = (v, action) => store.setVendorStatus(v.id, action)
  const onToggleSoldOut = (v, i) => store.toggleSoldOut(v.id, i)

  return (
    <div className="app">
      {tab==='home' && <Home vendors={vendors} usingDemo={usingDemo} onOpen={onOpen} onShowMap={()=>setTab('map')} />}
      {tab==='map' && <MapScreen me={me} vendors={vendors} onOpen={onOpen}
                        directionsTo={directionsTo} clearDirections={()=>setDirectionsTo(null)} />}
      {tab==='alerts' && <Notifications />}
      {tab==='profile' && <Profile following={following} onAdd={()=>setForm({ mode:'add' })} />}

      {selected && <VendorDetail vendor={selected} idx={selIdx} following={following.includes(selected.id)}
        onClose={()=>setSelectedId(null)} onDirections={startDirections} onToggleFollow={toggleFollow}
        onConfirm={confirm} onReview={onReview} onEdit={onEdit} onDelete={onDelete}
        onStatus={onStatus} onToggleSoldOut={onToggleSoldOut} />}

      {form && <VendorForm initial={form.mode==='edit'?form.vendor:null} me={me}
        onClose={()=>setForm(null)} onSave={saveForm} />}

      {(tab==='home' || tab==='map') && !selected && !form &&
        <button onClick={()=>setForm({ mode:'add' })} aria-label="Add vendor"
          style={{position:'fixed',right:'calc(50% - 230px + 16px)',bottom:90,zIndex:60,width:56,height:56,
                  borderRadius:'50%',border:0,background:'#fc6a2d',color:'#fff',fontSize:28,
                  boxShadow:'0 6px 18px rgba(252,106,45,.5)',cursor:'pointer'}}>＋</button>}

      <BottomNav tab={tab} setTab={setTab} notifCount={3} />
    </div>
  )
}
