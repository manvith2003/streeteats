export const STATUS = {
  OPEN:        { c:'#1faa59', t:'Open now' },
  MOVING:      { c:'#f5a623', t:'On the move' },
  CLOSED:      { c:'#9aa0a6', t:'Closed' },
  UNCONFIRMED: { c:'#bcc1c7', t:'Unconfirmed' },
  UNKNOWN:     { c:'#bcc1c7', t:'Unknown' },
}

export function Stars({ v }) {
  if (!v) return null
  const full = Math.round(v)
  return <span style={{ color:'#f5a623' }}>{'★'.repeat(full)}{'☆'.repeat(5-full)}</span>
}

export function StatusDot({ state }) {
  const s = STATUS[state] || STATUS.UNKNOWN
  return <span className="dot" style={{ background:s.c }} />
}
