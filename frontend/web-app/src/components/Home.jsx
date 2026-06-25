import { useMemo, useState } from 'react'
import { CATEGORIES, bg } from '../data.js'
import { STATUS } from './Common.jsx'

export default function Home({ vendors, usingDemo, onOpen, onShowMap }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')

  const filtered = useMemo(() => {
    return vendors.filter(v => {
      const okCat = cat === 'all' || (v.cuisine || '').toLowerCase() === cat
      const okQ = !q || (v.name || '').toLowerCase().includes(q.toLowerCase())
                 || (v.cuisine || '').toLowerCase().includes(q.toLowerCase())
      return okCat && okQ
    }).sort((a,b) => (b.state==='OPEN') - (a.state==='OPEN') || (b.averageRating||0)-(a.averageRating||0))
  }, [vendors, q, cat])

  return (
    <div>
      <div className="topbar">
        <div className="row">
          <div>
            <div className="loc-label">Delivering hunger to</div>
            <div className="loc">📍 MG Road, Bengaluru ▾</div>
          </div>
          <div className="avatar" onClick={() => onOpen.profile()}>M</div>
        </div>
        <div className="search">
          <span className="ic">🔍</span>
          <input placeholder="Search vendors, dishes…" value={q} onChange={e=>setQ(e.target.value)} />
        </div>
      </div>

      <div className="cats h-scroll" style={{ marginTop:14 }}>
        {CATEGORIES.map(c => (
          <div key={c.key} className={'cat'+(cat===c.key?' active':'')} onClick={()=>setCat(c.key)}>
            <div className="emoji">{c.emoji}</div>
            <div className="lbl">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="section-h">
        <h3>{filtered.length} vendors near you{usingDemo?' · demo':''}</h3>
        <div className="toggle">
          <button className="on">List</button>
          <button onClick={onShowMap}>Map</button>
        </div>
      </div>

      <div className="cards">
        {filtered.map((v,i) => {
          const s = STATUS[v.state] || STATUS.UNKNOWN
          return (
            <div className="vcard" key={v.id} onClick={()=>onOpen.vendor(v)}>
              <div className="photo" style={{ background:bg(i) }}>
                <span>{v.emoji || '🍴'}</span>
                <div className="badge"><span className="dot" style={{background:s.c}} />{s.t}</div>
              </div>
              <div className="body">
                <div className="t">
                  <span className="name">{v.name}{v.verified?' ✓':''}</span>
                  {v.averageRating ? <span className="rating">{v.averageRating} ★</span> : null}
                </div>
                <div className="sub">
                  <span>{v.cuisine}</span>
                  {v.veg!=null && <span className={'pill'+(v.veg?' veg':'')}>{v.veg?'● Veg':'Non-veg'}</span>}
                  {v.priceForTwo && <span>₹{v.priceForTwo} for two</span>}
                </div>
                <div className="metaline">
                  <span>{v.source==='COMMUNITY_ADDED'?'Community-tracked':'Vendor-verified'}</span>
                  <span>{v.reviewCount?`${v.reviewCount} reviews`:'New'}</span>
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length===0 && <div className="empty">No vendors match. Try another category.</div>}
      </div>
    </div>
  )
}
