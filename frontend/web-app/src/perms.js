// Permission model.
// USER  : view, follow, "here now", write reviews, create POSTS (Instagram-style sightings).
//         CANNOT edit menus, location, status, or delete vendors (prevents abuse).
// VENDOR : everything a user can + edit/close/go-live + edit menu/location for THEIR OWN
//          (vendor-verified) listing, and claim a community listing.
// ADMIN  : can edit / remove ANY vendor (moderation).
export const ROLES = ['USER', 'VENDOR', 'ADMIN']

export function canEditVendor(role, vendor) {
  if (role === 'ADMIN') return true
  if (role === 'VENDOR') return !!vendor?.verified   // the owning vendor
  return false
}
export const canEditMenu   = canEditVendor
export const canSetStatus  = canEditVendor
export function canDelete(role, vendor) {
  if (role === 'ADMIN') return true
  if (role === 'VENDOR') return !!vendor?.verified
  return false
}
// Anyone signed in can post a sighting / review / confirm.
export const canPost = () => true
