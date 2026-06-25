# StreetEats Live

A live, map-first discovery app for roadside food vendors — the carts and stalls that **move location through the day** and **change their menu daily**. Open the app, see which vendors are near you right now, whether they're set up and serving, today's menu, and what people are saying — then walk over with in-app directions.

> Where Zomato/Swiggy assume a fixed restaurant, fixed address, fixed menu — StreetEats Live assumes the opposite.

## Core features
- **Live map** of all nearby vendors as pins; tap any pin for info (name, photo, today's menu, status, rating, distance).
- **Live status** — vendors tap *Go live* (GPS pin), *On the move*, *Closed*; auto-decay + crowd confirmation keep it honest.
- **Today's menu** — daily menus, reuse-yesterday, sold-out flags.
- **Community-added vendors** — users can add great carts even if the vendor has no smartphone; status comes from crowd confirmation. Vendor can claim the listing later.
- **In-app directions** — route drawn inside the app, no hand-off to external maps.
- **Reviews, comments, follow & notifications.**
- **AI/ML recommendations** — learns each user's taste and suggests vendors they'll love nearby.

## Tech stack
| Layer | Tech |
|-------|------|
| Frontend | React (web + PWA), map SDK (Google Maps / Mapbox) |
| Services | Java 21 + Spring Boot microservices behind an API gateway |
| Eventing | Apache Kafka (all actions published as events) |
| Big data / ML | Apache Spark (taste profiles, ranking models) |
| Database | PostgreSQL + PostGIS, Redis (hot status), Elasticsearch (search), pgvector (similar vendors) |
| Infra | Docker + (Kubernetes), CI/CD, FCM push |

## Services
| Service | Responsibility |
|---------|----------------|
| `api-gateway` | Routing, auth (phone-OTP / JWT), rate limiting |
| `vendor-service` | Vendor profiles, onboarding, community-added & claim |
| `live-status-service` | Go-live / status, crowd confirmation, freshness, auto-decay |
| `menu-service` | Daily menus, sold-out, prices |
| `review-service` | Ratings, comments, Q&A, badges, moderation |
| `search-geo-service` | Geospatial "near me", filters, search index |
| `notification-service` | Push alerts & digests |
| `recommendation-service` | Personalised "for you" vendors (Kafka + Spark) |

## Repo layout
```
streeteats-live/
├── services/            # Java/Spring Boot microservices
├── frontend/web-app/    # React client + vendor dashboard
├── infra/               # Kafka, Postgres init, etc.
├── docs/                # Plan & architecture docs
└── docker-compose.yml   # Local dev infra (Kafka, Postgres+PostGIS, Redis)
```

## Getting started (full stack)
```bash
docker compose up --build -d     # builds & starts all 8 services + Postgres/PostGIS, Redis, Kafka
make seed                        # seed a demo vendor (status + menu + review) via the gateway
make fe                          # run the React map at http://localhost:5173
```
All API traffic goes through the **api-gateway** at `http://localhost:8080`.

| Service | Port |
|---------|------|
| api-gateway | 8080 |
| vendor / live-status / menu / review | 8081 / 8082 / 8083 / 8084 |
| search-geo · recommendation · notification | 8085 · 8086 · 8087 |
| web-app (vite) | 5173 |

## Roadmap
- **Phase 0 — Validate:** hand-map 30–50 vendors in one area.
- **Phase 1 — MVP:** customer app (map, status, menu, reviews, follow) + vendor app (go-live, menu, sold-out, close) + crowd confirmation & auto-decay. *(starts next)*
- **Phase 2 — Density:** notifications, badges, search/filters, Kafka+Spark pipeline.
- **Phase 3 — Personalise & monetise:** AI/ML recommendations, featured pins, pre-order, expand city by city.

---
*Scaffold initialized. Phase 1 implementation begins on the next step.*
