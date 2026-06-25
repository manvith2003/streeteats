# Phase 3 — Gateway + combined feed

## Added
- **api-gateway** (:8080, Spring Cloud Gateway) — single entry point. Routes:
  `/api/vendors/**`→8081, `/api/status/**`→8082, `/api/menu/**`→8083,
  `/api/reviews/**`→8084, `/api/search/**`→8085. CORS enabled.
- **search-geo-service** (:8085) — combined "near me" feed. One call returns nearby
  vendors each enriched with live **status**, **rating** and **today's menu**. Calls are
  defensive (per-call timeout + fallback) so one slow service never breaks the map.
- **web-app** now calls `/api/search/nearby` (one request) with a graceful fallback to
  per-service calls, then demo data.

Verified: search-geo boots and correctly merges status + rating + menu into one feed
(tested against mock upstreams). api-gateway compiles.

## Run order
```bash
docker compose up -d
# domain services (8081-8084), then:
cd services/search-geo-service && mvn spring-boot:run
cd services/api-gateway && mvn spring-boot:run
cd frontend/web-app && npm install && npm run dev
```

## Ports
| Service | Port |
|---------|------|
| api-gateway | 8080 |
| vendor / status / menu / review | 8081 / 8082 / 8083 / 8084 |
| search-geo | 8085 |
| web-app | 5173 |

## Next
- api-gateway: phone-OTP auth filter + rate limiting
- notification-service (FCM): go-live / moved-near-you alerts
- recommendation-service: Kafka consumer → Spark taste profiles → "for you" feed
