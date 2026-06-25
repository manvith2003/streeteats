import { useState } from 'react'
import { CATEGORIES } from '../data.js'

export default function VendorForm({ initial, me, onClose, onSave }) {
  const editing = !!initial
  const [name, setName] = useState(initial?.name || '')
  const [cuisine, setCuisine] = useState(initial?.cuisine || 'chaat')
  const [veg, setVeg] = useState(initial?.veg ?? true)
  const [address, setAddress] = useState(initial?.address || '')
  const [priceForTwo, setPrice] = useState(initial?.priceForTwo || '')
  const [items, setItems] = useState(
    (initial?.menuItems?.length ? initial.menuItems : [{ name:'', price:'' }]).map(i=>({ ...i })))

  const setItem = (i, k, val) => setItems(arr => arr.map((it,idx)=> idx===i ? { ...it, [k]:val } : it))
  const addRow = () => setItems(a => [...a, { name:'', price:'' }])
  const delRow = (i) => setItems(a => a.filter((_,idx)=>idx!==i))

  const submit = () => {
    if (!name.trim()) { alert('Please enter a vendor name'); return }
    const loc = me || [12.9740, 77.6040]
    onSave({
      name: name.trim(), cuisine, veg, address: address.trim(),
      priceForTwo: priceForTwo ? Number(priceForTwo) : null,
      lat: initial?.lat ?? loc[0] + (Math.random()-.5)*0.01,
      lng: initial?.lng ?? loc[1] + (Math.random()-.5)*0.01,
      menuItems: items.filter(i=>i.name.trim()).map(i=>({ name:i.name.trim(), price:i.price?Number(i.price):null, special:!!i.special, soldOut:!!i.soldOut }))
    })
  }

  const F = { display:'block', width:'100%', padding:'11px 12px', border:'1px solid var(--line,#eceef3)',
              borderRadius:12, fontSize:15, marginTop:6 }

  return (
    <div className="sheet-bg" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="pad">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h2 style={{margin:0}}>{editing ? 'Edit vendor' : 'Add a vendor'}</h2>
            <button className="close" style={{position:'static',background:'#eee',color:'#333'}} onClick={onClose}>✕</button>
          </div>
          <p style={{color:'#6b7280',fontSize:13,marginTop:4}}>
            Spotted a great cart? Add it for everyone — even if the vendor has no smartphone.
          </p>

          <label style={{fontSize:13,fontWeight:700}}>Name
            <input style={F} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Sharma Chaat Bhandar" /></label>

          <div style={{display:'flex',gap:10,marginTop:12}}>
            <label style={{fontSize:13,fontWeight:700,flex:1}}>Cuisine
              <select style={F} value={cuisine} onChange={e=>setCuisine(e.target.value)}>
                {CATEGORIES.filter(c=>c.key!=='all').map(c=><option key={c.key} value={c.key}>{c.label}</option>)}
              </select></label>
            <label style={{fontSize:13,fontWeight:700,flex:1}}>₹ for two
              <input style={F} type="number" value={priceForTwo} onChange={e=>setPrice(e.target.value)} placeholder="120" /></label>
          </div>

          <label style={{fontSize:13,fontWeight:700,display:'block',marginTop:12}}>Where is it? (landmark)
            <input style={F} value={address} onChange={e=>setAddress(e.target.value)} placeholder="e.g. Near MG Road metro gate 2" /></label>

          <div style={{display:'flex',gap:14,marginTop:12,alignItems:'center'}}>
            <label style={{fontSize:14,display:'flex',gap:6,alignItems:'center'}}>
              <input type="radio" checked={veg} onChange={()=>setVeg(true)} /> Veg</label>
            <label style={{fontSize:14,display:'flex',gap:6,alignItems:'center'}}>
              <input type="radio" checked={!veg} onChange={()=>setVeg(false)} /> Non-veg</label>
          </div>

          <div className="h4">Menu items</div>
          {items.map((it,i)=>(
            <div key={i} style={{display:'flex',gap:8,marginBottom:8,alignItems:'center'}}>
              <input style={{...F,marginTop:0,flex:1}} value={it.name} onChange={e=>setItem(i,'name',e.target.value)} placeholder="Dish" />
              <input style={{...F,marginTop:0,width:80}} type="number" value={it.price||''} onChange={e=>setItem(i,'price',e.target.value)} placeholder="₹" />
              <button onClick={()=>delRow(i)} style={{border:0,background:'#f1f2f6',borderRadius:10,width:38,height:40,cursor:'pointer'}}>✕</button>
            </div>
          ))}
          <button className="btn ghost" onClick={addRow} style={{width:'100%'}}>+ Add item</button>

          <div className="btnrow">
            <button className="btn ghost" onClick={onClose}>Cancel</button>
            <button className="btn primary" onClick={submit}>{editing ? 'Save changes' : 'Add vendor'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
