import { useState } from 'react'
import { bg } from '../data.js'
import { STATUS, Stars } from './Common.jsx'

export default function VendorDetail({ vendor, idx, following, onClose, onDirections, onToggleFollow, onConfirm }) {
  const [tab, setTab] = useState('menu')
  const s = STATUS[vendor.state] || STATUS.UNKNOWN
  const items = vendor.menuItems || []
  const reviews = vendor.reviews || []

  return (
    <div className="sheet-bg" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="hero" style={{ background:bg(idx||0) }}>
          <span>{vendor.emoji || '🍴'}</span>
          <button className="close" onClick={onClose}>✕</button>
        </div>
        <div className="pad">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <h2 style={{margin:'0 0 4px'}}>{vendor.name}{vendor.verified?' ✓':''}</h2>
              <div style={{color:'#6b7280',fontSize:14}}>{vendor.cuisine}{vendor.priceForTwo?` · ₹${vendor.priceForTwo} for two`:''}</div>
            </div>
            {vendor.averageRating ? <span className="rating" style={{fontSize:14}}>{vendor.averageRating} ★</span> : null}
          </div>

          <div className="statusrow" style={{marginTop:10}}>
            <span className="chip-status" style={{background:s.c}}>{s.t}</span>
            {typeof vendor.minutesSinceConfirmed==='number' &&
              <span style={{color:'#6b7280'}}>confirmed {vendor.minutesSinceConfirmed} min ago</span>}
          </div>
          <div style={{fontSize:12,color:'#9aa0a6',marginTop:6}}>
            {vendor.source==='COMMUNITY_ADDED'
              ? 'Community-tracked — location kept fresh by people nearby'
              : 'Vendor-verified — updated by the vendor'}
          </div>

          <div className="btnrow">
            <button className="btn primary" onClick={()=>onDirections(vendor)}>🧭 Directions</button>
            <button className="btn ghost" onClick={()=>onConfirm(vendor)}>✓ Here now</button>
            <button className={'btn '+(following?'ghost':'follow')} style={{flex:'0 0 46px'}}
              onClick={()=>onToggleFollow(vendor)}>{following?'♥':'♡'}</button>
          </div>

          <div className="toggle" style={{width:'fit-content'}}>
            <button className={tab==='menu'?'on':''} onClick={()=>setTab('menu')}>Today's Menu</button>
            <button className={tab==='reviews'?'on':''} onClick={()=>setTab('reviews')}>Reviews ({reviews.length})</button>
          </div>

          {tab==='menu' && (
            <div style={{marginTop:8}}>
              {items.length===0 && <div className="empty">No menu posted today yet.</div>}
              {items.map((it,i)=>(
                <div key={i} className={'menu-item'+(it.soldOut?' out':'')}>
                  <div>
                    {vendor.veg && <span className="veg-i" />}
                    <span className="nm">{it.name}</span>
                    {it.special && <span className="tag-special">TODAY'S SPECIAL</span>}
                    {it.soldOut && <span style={{color:'#e8451f',fontSize:12,marginLeft:6}}>Sold out</span>}
                  </div>
                  <div style={{fontWeight:700}}>{it.price!=null?`₹${it.price}`:''}</div>
                </div>
              ))}
            </div>
          )}

          {tab==='reviews' && (
            <div style={{marginTop:8}}>
              <div style={{display:'flex',gap:8,marginBottom:6}}>
                <button className="btn ghost" style={{flex:1}} onClick={()=>onConfirm(vendor)}>“Is it open?” · ask nearby</button>
              </div>
              {reviews.length===0 && <div className="empty">No reviews yet. Be the first!</div>}
              {reviews.map((r,i)=>(
                <div key={i} className="review">
                  <div className="who"><span>{r.who}</span><span><Stars v={r.rating}/></span></div>
                  <div className="cmt">{r.cmt}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
