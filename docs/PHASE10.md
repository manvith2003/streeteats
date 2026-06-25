# Phase 10 — Roles & community posts (abuse-proof editing)

Fixes the permission model so random users can't tamper with menus/locations.

## Roles
- **USER** (default): view, follow, "here now", **write reviews**, and **post sightings**
  (Instagram-style). CANNOT edit menus, location, status, or remove vendors.
- **VENDOR**: edits **their own** (vendor-verified) cart — menu, location, go-live/close,
  sold-out.
- **ADMIN**: can edit/remove **any** listing (moderation).
- Switch role in Profile → "View the app as" (demo).

## Community posts (Instagram-style)
- The ＋ button and Profile → "Post a sighting" open a post form: cart name, cuisine,
  veg/non-veg, landmark, caption, and the **menu you saw** (one line per item).
- A post creates a **community-tracked pin** (unverified) + a feed entry. It is NOT an
  authoritative edit — the real vendor can later claim and correct it.
- **"Posts near you"** carousel on Home surfaces recent sightings within ~5 km — the
  nearby posts that "pop up" for users.

## Detail sheet
- Everyone: Directions, Here-now, Follow, **Post about this cart**, Write a review.
- Vendor/Admin only: Go live / On the move / Close, **Edit menu & details**, Remove,
  toggle sold-out. These controls are hidden for regular users.

## Files
- `perms.js` — central permission rules (canEditVendor / canDelete).
- `store.js` — adds posts + `postsNear()`; mutations still sync to backend best-effort.
- `components/PostForm.jsx` — the sighting composer.
