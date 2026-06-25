import { ROLES } from '../perms.js'

export default function Profile({ following=[], role='USER', setRole, onPost }) {
  const rows = [
    ['❤️','Following', `${following.length} vendors`, null],
    ['📸','Post a sighting','Share a cart you found', onPost],
    ['📍','Saved addresses','MG Road, Home, Work', null],
    ['🧾','Order & visit history','—', null],
    ['⚙️','Settings','Notifications, language', null],
    ['↪️','Log out','', null],
  ]
  return (
    <div>
      <div className="topbar">
        <div className="row">
          <div>
            <div className="loc-label">Signed in as</div>
            <div className="loc">Manvith</div>
            <div style={{fontSize:13,opacity:.9,marginTop:2}}>+91 99990 00011 · {role}</div>
          </div>
          <div className="avatar" style={{width:54,height:54,fontSize:22}}>M</div>
        </div>
      </div>

      <div style={{padding:'14px 16px 0'}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:6}}>View the app as (demo)</div>
        <div className="toggle" style={{width:'100%'}}>
          {ROLES.map(r=>(
            <button key={r} className={role===r?'on':''} style={{flex:1}} onClick={()=>setRole(r)}>{r}</button>
          ))}
        </div>
        <div style={{fontSize:12,color:'#9aa0a6',marginTop:6}}>
          USER can post sightings &amp; reviews but not edit menus/location. VENDOR edits their own
          verified cart. ADMIN can moderate any listing.
        </div>
      </div>

      <div className="cards" style={{marginTop:14}}>
        {rows.map((r,i)=>(
          <div key={i} className="vcard" style={{cursor:'pointer'}} onClick={r[3]||undefined}>
            <div className="body" style={{display:'flex',gap:12,alignItems:'center'}}>
              <span style={{fontSize:22}}>{r[0]}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700}}>{r[1]}</div>
                {r[2] && <div style={{color:'#6b7280',fontSize:13}}>{r[2]}</div>}
              </div>
              <span style={{color:'#bcc1c7'}}>›</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
