# Phase 8 — Modern app UI (Zomato/Swiggy-style)

Complete redesign of the React web-app into a polished mobile experience.

## Screens
- **Home / Discovery**: gradient location header, search bar, scrollable **food category**
  chips, and rich **vendor cards** (photo, live-status badge, rating, veg/non-veg,
  ₹-for-two, reviews) sorted with open vendors first. List/Map toggle.
- **Map**: full map with colour-coded, pulsing pins (green=open), your location dot,
  tap a pin → details. **In-app directions**: draws a route line and animates a
  walking marker along it ("shows the movement"), with live distance + ETA panel.
- **Vendor detail sheet**: hero, live status + freshness, community-tracked vs
  vendor-verified, **Directions / Here-now / Follow** buttons, tabs for **Today's Menu**
  (specials, sold-out, prices) and **Reviews/comments** + "is it open?" ask.
- **Notifications**: go-live / moved-near-you / specials / menu alerts inbox.
- **Profile**: account, following count, saved addresses, "become a vendor", settings.
- **Bottom navigation** (Home / Map / Alerts / Profile) with unread badge.

## Data
- Pulls the live combined feed from `search-geo` when available; otherwise falls back to
  a rich demo dataset so the UI always looks complete.

## Run
```bash
cd frontend/web-app && npm install && npm run dev   # http://localhost:5173
```
