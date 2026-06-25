const SEED = [
  { type:'VENDOR_LIVE', title:'Sharma Chaat Bhandar is live now', body:'Your favourite cart just went live 300m away.', t:'2 min ago', emoji:'🟢' },
  { type:'MOVED_NEARBY', title:'Dosa Express moved near you', body:'Now set up at Brigade Road junction.', t:'25 min ago', emoji:'📍' },
  { type:'SPECIAL', title:'Fresh jalebis at Annapurna Sweets', body:'Hot batch ready — limited today!', t:'1 hr ago', emoji:'🍮' },
  { type:'FOLLOW', title:'Momo Junction posted today\'s menu', body:'Fried momos are back on the menu.', t:'3 hr ago', emoji:'🥟' },
]
export default function Notifications({ items }) {
  const list = (items && items.length) ? items : SEED
  return (
    <div>
      <div className="topbar"><div className="loc">🔔 Notifications</div></div>
      <div className="cards" style={{marginTop:14}}>
        {list.map((n,i)=>(
          <div key={i} className="vcard" style={{cursor:'default'}}>
            <div className="body" style={{display:'flex',gap:12,alignItems:'flex-start'}}>
              <div style={{fontSize:26}}>{n.emoji||'🔔'}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:15}}>{n.title}</div>
                <div style={{color:'#6b7280',fontSize:13,marginTop:3}}>{n.body}</div>
                <div style={{color:'#9aa0a6',fontSize:11,marginTop:6}}>{n.t||'just now'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
