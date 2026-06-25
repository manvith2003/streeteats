# Phase 1 — MVP (core slice complete)

## Services (all Spring Boot 3 / Java 17, verified: compile + boot + live API)
- **vendor-service** (:8081) — create vendor (incl. community-added, no account), get/list, **nearby** geo query, claim-a-listing, Kafka `vendor.created`.
- **live-status-service** (:8082) — go-live (GPS) / moving / close, **crowd confirm/deny** + freshness, **auto-decay** job, Kafka `vendor.status.changed`.
- **menu-service** (:8083) — post/replace today's menu, **reuse-yesterday**, **sold-out** toggle, daily specials, Kafka `vendor.menu.updated`.
- **review-service** (:8084) — ratings + comments, **avg-rating summary**, "is it open?" **Q&A** (ask/answer).
- **web-app** (React + Leaflet) — live map, colour-coded pins, tap-for-info popup showing **rating + today's menu (with sold-out)**, "Here now ✓" confirm. Falls back to demo data offline.

## Run locally
```bash
docker compose up -d                 # Postgres+PostGIS, Redis, Kafka
# each service:
cd services/<name> && mvn spring-boot:run
# or no-infra mode (H2, no Kafka):
mvn spring-boot:run -Dspring-boot.run.profiles=local
# frontend:
cd frontend/web-app && npm install && npm run dev   # http://localhost:5173
```

## Ports
| Service | Port |
|---------|------|
| vendor-service | 8081 |
| live-status-service | 8082 |
| menu-service | 8083 |
| review-service | 8084 |
| web-app (vite) | 5173 |

## Next
- search-geo-service backed by PostGIS index + combined nearby feed
- api-gateway + phone-OTP auth
- notification-service (FCM), then recommendation-service (Kafka + Spark)
