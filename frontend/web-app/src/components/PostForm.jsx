import { useState } from 'react'
import { CATEGORIES } from '../data.js'

// Instagram-style "I found this cart" post. Users describe the vendor + claimed menu
// + where it is. It does NOT edit any official record — it creates a community post.
export default function PostForm({ initial, me, onClose, onSave }) {
  const [name, setName] = useState(initial?.name || '')
  const [cuisine, setCuisine] = useState(initial?.cuisine || 'chaat')
  const [veg, setVeg] = useState(true)
  const [address, setAddress] = useState(initial?.address || '')
  const [caption, setCaption] = useState('')
  const [menuText, setMenuText] = useState('')

  const submit = () => {
    if (!name.trim()) { alert('What\'s the cart called? (or describe it)'); return }
    onSave({
      name: name.trim(), cuisine, veg, address: address.trim(), caption: caption.trim(),
      menuLines: menuText.split('\n').map(s=>s.trim()).filter(Boolean),
      loc: me, lat: initial?.lat, lng: initial?.lng
    })
  }
  const F = { display:'block', width:'100%', padding:'11px 12px', border:'1px solid #e3e5ea',
              borderRadius:12, fontSize:15, marginTop:6 }

  return (
    <div className="sheet-bg" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="pad">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h2 style={{margin:0}}>📸 Post a sighting</h2>
            <button className="close" style={{position:'static',background:'#eee',color:'#333'}} onClick={onClose}>✕</button>
          </div>
          <p style={{color:'#6b7280',fontSize:13,marginTop:4}}>
            Share a cart you found — its menu and where it is. Posts appear to people nearby.
            Only the vendor can edit the official menu &amp; location later.
          </p>

          <label style={{fontSize:13,fontWeight:700}}>Cart name / description
            <input style={F} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Anna's dosa cart near the temple" /></label>

          <div style={{display:'flex',gap:10,marginTop:12}}>
            <label style={{fontSize:13,fontWeight:700,flex:1}}>Cuisine
              <select style={F} value={cuisine} onChange={e=>setCuisine(e.target.value)}>
                {CATEGORIES.filter(c=>c.key!=='all').map(c=><option key={c.key} value={c.key}>{c.label}</option>)}
              </select></label>
            <div style={{flex:1,display:'flex',gap:12,alignItems:'flex-end',paddingBottom:8}}>
              <label style={{fontSize:14,display:'flex',gap:6,alignItems:'center'}}>
                <input type="radio" checked={veg} onChange={()=>setVeg(true)} /> Veg</label>
              <label style={{fontSize:14,display:'flex',gap:6,alignItems:'center'}}>
                <input type="radio" checked={!veg} onChange={()=>setVeg(false)} /> Non-veg</label>
            </div>
          </div>

          <label style={{fontSize:13,fontWeight:700,display:'block',marginTop:12}}>Where is it? (landmark)
            <input style={F} value={address} onChange={e=>setAddress(e.target.value)} placeholder="e.g. Outside MG Road metro gate 2" /></label>

          <label style={{fontSize:13,fontWeight:700,display:'block',marginTop:12}}>Caption
            <input style={F} value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Best pani puri I've had! 🔥" /></label>

          <label style={{fontSize:13,fontWeight:700,display:'block',marginTop:12}}>Menu you saw (one item per line)
            <textarea style={{...F,minHeight:90}} value={menuText} onChange={e=>setMenuText(e.target.value)}
              placeholder={"Pani Puri\nBhel Puri\nSev Puri"} /></label>

          <div className="btnrow">
            <button className="btn ghost" onClick={onClose}>Cancel</button>
            <button className="btn primary" onClick={submit}>Post</button>
          </div>
        </div>
      </div>
    </div>
  )
}
