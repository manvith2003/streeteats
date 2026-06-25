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
