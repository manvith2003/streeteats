import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { fetchNearby, fetchStatus, confirmHere, fetchTodayMenu, fetchRating } from './api.js'

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
  { id: 'demo-1', name: 'Sharma Chaat Bhandar', cuisine: 'chaat', lat: 12.9726, lng: 77.5946, source: 'COMMUNITY_ADDED', verified: false, _state: 'OPEN',
    _menu: { items: [{ name: 'Pani Puri', price: 30, soldOut: false, special: true }, { name: 'Bhel', price: 40, soldOut: true }] }, _rating: { averageRating: 4.5, reviewCount: 23 } },
  { id: 'demo-2', name: 'Dosa Express Cart', cuisine: 'dosa', lat: 12.9700, lng: 77.5975, source: 'VENDOR_ADDED', verified: true, _state: 'MOVING',
    _menu: { items: [{ name: 'Masala Dosa', price: 60, soldOut: false }] }, _rating: { averageRating: 4.2, reviewCount: 11 } },
  { id: 'demo-3', name: 'Momo Junction', cuisine: 'momos', lat: 12.9740, lng: 77.5910, source: 'COMMUNITY_ADDED', verified: false, _state: 'UNCONFIRMED', _rating: { averageRating: 4.0, reviewCount: 5 } },
  { id: 'demo-4', name: 'Juice Wala', cuisine: 'juice', lat: 12.9690, lng: 77.5930, source: 'VENDOR_ADDED', verified: true, _state: 'OPEN',
    _menu: { items: [{ name: 'Mosambi Juice', price: 50, soldOut: false }] }, _rating: { averageRating: 4.7, reviewCount: 31 } }
]

function Recenter({ center }) {
  const map = useMap()
  useEffect(() => { map.setView(center) }, [center, map])
  return null
}

function Stars({ value }) {
  if (!value) return null
  return <span style={{ color: '#f1c40f' }}>{'★'.repeat(Math.round(value))}{'☆'.repeat(5 - Math.round(value))}</span>
}

export default function App() {
  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [vendors, setVendors] = useState([])
  const [usingDemo, setUsingDemo] = useState(false)

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
      const enriched = await Promise.all(list.map(async v => {
        const [s, menu, rating] = await Promise.all([
          fetchStatus(v.id).catch(() => null),
          fetchTodayMenu(v.id).catch(() => null),
          fetchRating(v.id).catch(() => null)
        ])
        return { ...v, _state: s?.state || 'UNKNOWN', _mins: s?.minutesSinceConfirmed, _menu: menu, _rating: rating }
      }))
      setVendors(enriched)
      setUsingDemo(false)
    } catch {
      setVendors(DEMO)
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
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {vendors.map(v => (
          <Marker key={v.id} position={[v.lat, v.lng]} icon={pinIcon(STATUS_COLOR[v._state] || STATUS_COLOR.UNKNOWN)}>
            <Popup>
              <div style={{ minWidth: 200 }}>
                <strong>{v.name}</strong>{v.verified && ' ✓'}
                <div style={{ color: '#555', fontSize: 13 }}>{v.cuisine}</div>

                {v._rating && v._rating.reviewCount > 0 && (
                  <div style={{ fontSize: 13, margin: '4px 0' }}>
                    <Stars value={v._rating.averageRating} /> {v._rating.averageRating} ({v._rating.reviewCount})
                  </div>
                )}

                <div style={{ margin: '6px 0', fontSize: 13 }}>
                  Status: <b style={{ color: STATUS_COLOR[v._state] }}>{v._state}</b>
                  {typeof v._mins === 'number' && <span> · confirmed {v._mins} min ago</span>}
                </div>

                {v._menu && v._menu.items && v._menu.items.length > 0 && (
                  <div style={{ margin: '6px 0', fontSize: 13 }}>
                    <div style={{ fontWeight: 600 }}>Today's menu</div>
                    {v._menu.items.map((it, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
                                            textDecoration: it.soldOut ? 'line-through' : 'none',
                                            color: it.soldOut ? '#aaa' : '#222' }}>
                        <span>{it.name}{it.special ? ' ⭐' : ''}{it.soldOut ? ' (sold out)' : ''}</span>
                        <span>{it.price != null ? `₹${it.price}` : ''}</span>
                      </div>
                    ))}
                  </div>
                )}

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
