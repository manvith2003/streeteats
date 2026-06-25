# Phase 1 — MVP (in progress)

## Done
- **vendor-service** (:8081, Spring Boot 3 / Java 17)
  - Create vendor (incl. community-added, no vendor account)
  - Get / list / **nearby** (Haversine geo query)
  - Claim a community listing → vendor-verified
  - Publishes `vendor.created` to Kafka (no-op without a broker)
- **live-status-service** (:8082)
  - Go-live (GPS) / moving / close
  - Crowd confirm / deny + freshness ("confirmed N min ago")
  - **Auto-decay** scheduled job: stale OPEN pins → UNCONFIRMED
  - Publishes `vendor.status.changed`
- **web-app** (React + Leaflet): live map, colour-coded pins, tap-for-info, confirm button

Both services verified: compile + boot + live API calls (H2 `local` profile).

## Run locally
```bash
docker compose up -d                 # Postgres+PostGIS, Redis, Kafka
# then in each service:  mvn spring-boot:run
# or quick no-infra mode: mvn spring-boot:run -Dspring-boot.run.profiles=local
cd frontend/web-app && npm install && npm run dev
```

## Next
- menu-service (daily menus, sold-out) + review-service
- search-geo-service backed by PostGIS index
- api-gateway + phone-OTP auth
- wire React to combined nearby+status feed
