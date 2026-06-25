// Thin API client for the Phase 1 services (proxied by Vite in dev).
export async function fetchNearby(lat, lng, radiusKm = 3) {
  const r = await fetch(`/api/vendors/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`);
  if (!r.ok) throw new Error('nearby failed');
  return r.json();
}

export async function fetchStatus(vendorId) {
  const r = await fetch(`/api/status/${vendorId}`);
  if (!r.ok) return null;
  return r.json();
}

export async function goLive(vendorId, lat, lng) {
  const r = await fetch(`/api/status/${vendorId}/go-live`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng })
  });
  return r.json();
}

export async function confirmHere(vendorId) {
  const r = await fetch(`/api/status/${vendorId}/confirm`, { method: 'POST' });
  return r.json();
}

export async function addVendor(payload) {
  const r = await fetch('/api/vendors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return r.json();
}

export async function fetchTodayMenu(vendorId) {
  const r = await fetch(`/api/menu/${vendorId}/today`);
  if (!r.ok) return null;            // 404 = no menu posted today
  return r.json();
}

export async function fetchRating(vendorId) {
  const r = await fetch(`/api/reviews/${vendorId}/summary`);
  if (!r.ok) return null;
  return r.json();
}

// Combined feed from search-geo-service: vendors enriched with status + rating + menu in one call.
export async function fetchCombinedNearby(lat, lng, radiusKm = 3) {
  const r = await fetch(`/api/search/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`);
  if (!r.ok) throw new Error('combined nearby failed');
  return r.json();
}

export async function updateVendor(id, payload) {
  const r = await fetch(`/api/vendors/${id}`, { method:'PUT',
    headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) })
  if (!r.ok) throw new Error('update failed'); return r.json()
}
export async function deleteVendor(id) {
  const r = await fetch(`/api/vendors/${id}`, { method:'DELETE' })
  if (!r.ok) throw new Error('delete failed'); return true
}
export async function postReview(vendorId, body) {
  const r = await fetch(`/api/reviews/${vendorId}`, { method:'POST',
    headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) })
  if (!r.ok) throw new Error('review failed'); return r.json()
}
export async function postMenu(vendorId, items) {
  const r = await fetch(`/api/menu/${vendorId}`, { method:'POST',
    headers:{'Content-Type':'application/json'}, body:JSON.stringify({items}) })
  if (!r.ok) throw new Error('menu failed'); return r.json()
}
export async function setStatus(vendorId, action, body) {
  const r = await fetch(`/api/status/${vendorId}/${action}`, { method:'POST',
    headers:{'Content-Type':'application/json'}, body: body?JSON.stringify(body):undefined })
  if (!r.ok) throw new Error('status failed'); return r.json()
}
