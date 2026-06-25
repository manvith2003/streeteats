import { useEffect, useState } from 'react'
import './styles.css'
import 'leaflet/dist/leaflet.css'
import { DEMO } from './data.js'
import { fetchCombinedNearby, confirmHere } from './api.js'
import Home from './components/Home.jsx'
import MapScreen from './components/MapScreen.jsx'
import VendorDetail from './components/VendorDetail.jsx'
import Notifications from './components/Notifications.jsx'
import Profile from './components/Profile.jsx'
import BottomNav from './components/BottomNav.jsx'

const DEFAULT_ME = [12.9740, 77.6040]

export default function App() {
  const [tab, setTab] = useState('home')
  const [me, setMe] = useState(DEFAULT_ME)
  const [vendors, setVendors] = useState(DEMO)
  const [usingDemo, setUsingDemo] = useState(true)
  const [selected, setSelected] = useState(null)
  const [selIdx, setSelIdx] = useState(0)
  const [directionsTo, setDirectionsTo] = useState(null)
  const [following, setFollowing] = useState([])

  useEffect(() => {
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(
      p => setMe([p.coords.latitude, p.coords.longitude]), () => {})
  }, [])

  useEffect(() => { (async () => {
    try {
      const list = await fetchCombinedNearby(me[0], me[1], 5)
      if (Array.isArray(list) && list.length) {
        setVendors(list.map(v => ({ ...v, emoji: emojiFor(v.cuisine) })))
        setUsingDemo(false)
        return
      }
    } catch { /* keep demo */ }
    setVendors(DEMO); setUsingDemo(true)
  })() }, [me])

  const openVendor = (v) => { setSelected(v); setSelIdx(vendors.findIndex(x=>x.id===v.id)) }
  const closeVendor = () => setSelected(null)

  const startDirections = (v) => { setDirectionsTo(v); setSelected(null); setTab('map') }
  const toggleFollow = (v) => setFollowing(f => f.includes(v.id) ? f.filter(x=>x!==v.id) : [...f, v.id])
  const confirm = async (v) => {
    if (!usingDemo) { try { await confirmHere(v.id) } catch {} }
    alert(`Thanks! Marked "${v.name}" as here now ✓`)
  }

  const onOpen = { vendor: openVendor, profile: () => setTab('profile') }

  return (
    <div className="app">
      {tab==='home' && <Home vendors={vendors} usingDemo={usingDemo} onOpen={onOpen} onShowMap={()=>setTab('map')} />}
      {tab==='map' && <MapScreen me={me} vendors={vendors} onOpen={onOpen}
                        directionsTo={directionsTo} clearDirections={()=>setDirectionsTo(null)} />}
      {tab==='alerts' && <Notifications />}
      {tab==='profile' && <Profile following={following} />}

      {selected && <VendorDetail vendor={selected} idx={selIdx} following={following.includes(selected.id)}
        onClose={closeVendor} onDirections={startDirections}
        onToggleFollow={toggleFollow} onConfirm={confirm} />}

      <BottomNav tab={tab} setTab={setTab} notifCount={3} />
    </div>
  )
}

function emojiFor(c='') {
  const m = { chaat:'🥘', dosa:'🥞', momos:'🥟', juice:'🥤', rolls:'🌯', sweets:'🍮', tea:'☕' }
  return m[(c||'').toLowerCase()] || '🍴'
}
