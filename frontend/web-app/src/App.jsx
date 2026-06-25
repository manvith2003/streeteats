import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { fetchNearby, fetchStatus, confirmHere } from './api.js'

// Default centre if geolocation is unavailable (Bengaluru).
const DEFAULT_CENTER = [12.9716, 77.5946]

const STATUS_COLOR = {
  OPEN: '#27ae60',        // green — set up & serving
  MOVING: '#f39c12',      // amber — on the move / opening soon
  CLOSED: '#7f8c8d',      // grey
  UNCONFIRMED: '#bdc3c7', // light grey
  UNKNOWN: '#c0392b'      // red pin for vendors with no status yet
}

function pinIcon(color) {
  return L.divIcon({
    className: 'se-pin',
    html: `<div style="background:${color};width:18px;height:18px;border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
    popupAnchor: [0, -18]
  })
}

// Demo vendors so the map is alive even before the backend is running.
const DEMO = [
  { id: 'demo-1', name: 'Sharma Chaat Bhandar', cuisine: 'chaat', lat: 12.9726, lng: 77.5946, source: 'COMMUNITY_ADDED', verified: false, _state: 'OPEN' },
  { id: 'demo-2', name: 'Dosa Express Cart', cuisine: 'dosa', lat: 12.9700, lng: 77.5975, source: 'VENDOR_ADDED', verified: true, _state: 'MOVING' },
  { id: 'demo-3', name: 'Momo Junction', cuisine: 'momos', lat: 12.9740, lng: 77.5910, source: 'COMMUNITY_ADDED', verified: false, _state: 'UNCONFIRMED' },
  { id: 'demo-4', name: 'Juice Wala', cuisine: 'juice', lat: 12.9690, lng: 77.5930, source: 'VENDOR_ADDED', verified: true, _state: 'OPEN' }
]

function Recenter({ center }) {
  const map = useMap()
  useEffect(() => { map.setView(center) }, [center, map])
  return null
}

export default function App() {
  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [vendors, setVendors] = useState([])
  const [usingDemo, setUsingDemo] = useState(false)

  // Ask for the user's location for the live map.
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        p => setCenter([p.coords.latitude, p.coords.longitude]),
        () => {}
      )
    }
  }, [])

  async function load() {
    try {
      const list = await fetchNearby(center[0], center[1], 5)
      const withStatus = await Promise.all(list.map(async v => {
        const s = await fetchStatus(v.id).catch(() => null)
        return { ...v, _state: s?.state || 'UNKNOWN', _mins: s?.minutesSinceConfirmed }
      }))
      setVendors(withStatus)
      setUsingDemo(false)
    } catch {
      setVendors(DEMO)   // backend not running — show demo data
      setUsingDemo(true)
    }
  }

  useEffect(() => { load() /* eslint-disable-next-line */ }, [center])

  async function onConfirm(v) {
    if (usingDemo) { alert('Demo mode — start the backend to record confirmations.'); return }
    await confirmHere(v.id)
    load()
  }

  const openCount = useMemo(() => vendors.filter(v => v._state === 'OPEN').length, [vendors])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ padding: '12px 16px', background: '#c0392b', color: '#fff' }}>
        <strong style={{ fontSize: 18 }}>StreetEats Live</strong>
        <span style={{ marginLeft: 10, opacity: .9, fontSize: 13 }}>
          {openCount} open near you {usingDemo && '· demo data'}
        </span>
      </header>

      <MapContainer center={center} zoom={15} style={{ height: 'calc(100vh - 92px)', width: '100%' }}>
        <Recenter center={center} />
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {vendors.map(v => (
          <Marker key={v.id} position={[v.lat, v.lng]} icon={pinIcon(STATUS_COLOR[v._state] || STATUS_COLOR.UNKNOWN)}>
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong>{v.name}</strong>{v.verified && ' ✓'}
                <div style={{ color: '#555', fontSize: 13 }}>{v.cuisine}</div>
                <div style={{ margin: '6px 0', fontSize: 13 }}>
                  Status: <b style={{ color: STATUS_COLOR[v._state] }}>{v._state}</b>
                  {typeof v._mins === 'number' && <span> · confirmed {v._mins} min ago</span>}
                </div>
                <div style={{ fontSize: 12, color: '#777' }}>
                  {v.source === 'COMMUNITY_ADDED' ? 'Community-tracked' : 'Vendor-verified'}
                </div>
                <button onClick={() => onConfirm(v)}
                        style={{ marginTop: 8, padding: '6px 10px', border: 'none',
                                 background: '#27ae60', color: '#fff', borderRadius: 6, cursor: 'pointer' }}>
                  Here now ✓
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <footer style={{ padding: '8px 16px', fontSize: 12, color: '#666', background: '#f7f7f7' }}>
        Green = open · Amber = moving · Grey = closed/unconfirmed · Red = no status yet
      </footer>
    </div>
  )
}
