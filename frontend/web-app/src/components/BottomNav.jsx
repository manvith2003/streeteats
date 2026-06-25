export default function BottomNav({ tab, setTab, notifCount=0 }) {
  const items = [['home','🏠','Home'],['map','🗺️','Map'],['alerts','🔔','Alerts'],['profile','👤','Profile']]
  return (
    <div className="nav">
      {items.map(([k,ic,lbl])=>(
        <button key={k} className={tab===k?'on':''} onClick={()=>setTab(k)}>
          <span className="ico">{ic}{k==='alerts'&&notifCount>0 && <span className="badge-n">{notifCount}</span>}</span>
          <span>{lbl}</span>
        </button>
      ))}
    </div>
  )
}
