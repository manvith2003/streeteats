import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { STATUS } from './Common.jsx'

function pin(color, pulse=false) {
  return L.divIcon({
    className:'se-pin',
    html:`<div style="background:${color};width:20px;height:20px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.4);
      ${pulse?'animation:pulse 1.4s infinite':''}"></div>
      <style>@keyframes pulse{0%{box-shadow:0 0 0 0 ${color}66}70%{box-shadow:0 0 0 12px ${color}00}100%{box-shadow:0 0 0 0 ${color}00}}</style>`,
    iconSize:[20,20], iconAnchor:[10,20], popupAnchor:[0,-20]
  })
}
const meIcon = L.divIcon({ className:'me', html:`<div style="width:16px;height:16px;border-radius:50%;
  background:#2d7ff9;border:3px solid #fff;box-shadow:0 0 0 3px #2d7ff955"></div>`, iconSize:[16,16], iconAnchor:[8,8] })
const walkIcon = L.divIcon({ className:'walk', html:`<div style="font-size:20px">🚶</div>`, iconSize:[20,20], iconAnchor:[10,10] })

function Fit({ a, b }) {
  const map = useMap()
  useEffect(() => { if (a&&b) map.fitBounds([a,b],{ padding:[60,60] }) }, [a,b,map])
  return null
}

// Build a gentle multi-point route between two coords (stand-in for a routing API like OSRM).
function routeBetween(a, b, n=24){
  const pts=[]
  for(let i=0;i<=n;i++){
    const t=i/n
    const lat=a[0]+(b[0]-a[0])*t + Math.sin(t*Math.PI)*0.0006*(i%2?1:-1)
    const lng=a[1]+(b[1]-a[1])*t + Math.cos(t*Math.PI)*0.0006*(i%2?-1:1)
    pts.push([lat,lng])
  }
  return pts
}

export default function MapScreen({ me, vendors, onOpen, directionsTo, clearDirections }) {
  const center = me || [12.9740, 77.6040]
  const [walkIdx, setWalkIdx] = useState(0)
  const timer = useRef(null)

  const route = useMemo(() =>
    directionsTo ? routeBetween(center, [directionsTo.lat, directionsTo.lng]) : null,
  [directionsTo, center])

  // animate the walking marker along the route ("show the movement")
  useEffect(() => {
    clearInterval(timer.current)
    if (!route) return
    setWalkIdx(0)
    timer.current = setInterval(() => {
      setWalkIdx(i => (i+1) % route.length)
    }, 220)
    return () => clearInterval(timer.current)
  }, [route])

  const km = directionsTo ? haversine(center, [directionsTo.lat, directionsTo.lng]) : 0
  const mins = Math.max(1, Math.round(km/5*60)) // ~5km/h walking

  return (
    <div style={{ position:'relative', height:'calc(100vh - 74px)' }}>
      <MapContainer center={center} zoom={15} style={{ height:'100%', width:'100%' }}>
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={center} icon={meIcon} />
        {vendors.map(v => {
          const s = STATUS[v.state] || STATUS.UNKNOWN
          return (
            <Marker key={v.id} position={[v.lat,v.lng]} icon={pin(s.c, v.state==='OPEN')}>
              <Popup>
                <b>{v.name}</b><br/>
                <span style={{color:s.c}}>● {s.t}</span> · {v.cuisine}<br/>
                {v.averageRating?`${v.averageRating}★ · `:''}{v.reviewCount||0} reviews<br/>
                <button onClick={()=>onOpen.vendor(v)}
                  style={{marginTop:6,border:0,background:'#fc6a2d',color:'#fff',padding:'6px 10px',borderRadius:8,cursor:'pointer'}}>
                  View details
                </button>
              </Popup>
            </Marker>
          )
        })}
        {route && <>
          <Polyline positions={route} pathOptions={{ color:'#2d7ff9', weight:5, opacity:.8 }} />
          <Marker position={route[walkIdx]} icon={walkIcon} />
          <Fit a={center} b={[directionsTo.lat,directionsTo.lng]} />
        </>}
      </MapContainer>

      {directionsTo && (
        <div className="dir-info">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div className="eta">{mins} min <span style={{fontSize:13,color:'#6b7280',fontWeight:600}}>walk</span></div>
              <div style={{color:'#6b7280',fontSize:13}}>{km.toFixed(1)} km to <b>{directionsTo.name}</b></div>
            </div>
            <button className="btn ghost" style={{flex:'0 0 auto',padding:'10px 14px'}} onClick={clearDirections}>End</button>
          </div>
        </div>
      )}
    </div>
  )
}

function haversine(a,b){
  const R=6371,d2r=Math.PI/180
  const dLat=(b[0]-a[0])*d2r, dLng=(b[1]-a[1])*d2r
  const s=Math.sin(dLat/2)**2+Math.cos(a[0]*d2r)*Math.cos(b[0]*d2r)*Math.sin(dLng/2)**2
  return 2*R*Math.asin(Math.sqrt(s))
}
