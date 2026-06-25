# Phase 9 — Interactive frontend (add / edit / remove + actions)

The app is now fully interactive, not just view-only. Changes persist via localStorage
and are synced to the backend (best-effort) when it's running.

## New capabilities
- **Add a vendor** — floating ＋ button (Home/Map) and Profile → "Add / list a vendor".
  Form: name, cuisine, veg/non-veg, ₹-for-two, landmark, and a dynamic **menu builder**.
- **Edit vendor** — change any detail / today's menu from the detail sheet.
- **Remove vendor** — with confirm.
- **Write a review** — star picker + comment; updates the average rating live.
- **Vendor mode** (in detail): **Go live**, **On the move**, **Close**, and tap a menu
  item to toggle **sold out**.
- **Here now** crowd-confirm and **follow/unfollow** (already present).

## How state works
- `store.js` is a local-first store: demo + user data in localStorage, published to React
  via subscribe. Every mutation also calls the matching backend API (create/update/delete
  vendor, post review, post menu, set status) and silently no-ops if the backend is down.
- `mergeFeed()` blends a live backend feed without dropping locally-added vendors.

## Backend
- vendor-service gained **PUT /api/vendors/{id}** (update) and **DELETE /api/vendors/{id}**
  so edit/remove are real, not just local.

## Run
```bash
cd frontend/web-app && npm install && npm run dev   # http://localhost:5173
```
