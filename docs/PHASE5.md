# Phase 5 — Notifications (all 8 services now have code)

## notification-service (:8087)
- **Follow / unfollow** vendors; list a user's follows.
- **Device registration** (FCM tokens, per platform).
- **Fan-out**: when a vendor goes live (or moves nearby), alert every follower —
  persisted to an in-app **inbox** and pushed to their devices.
- **Pluggable push**: `PushSender` logs in dev; drop in firebase-admin for real FCM
  (`fcm.enabled=true`).
- **Kafka**: `@KafkaListener` on `vendor.status.changed` triggers fan-out automatically
  (disabled by default; enable with `streeteats.kafka-consumer=true`).

### Endpoints
- `POST /api/notifications/follow` · `DELETE /api/notifications/follow`
- `GET  /api/notifications/follows/{userId}`
- `POST /api/notifications/devices`
- `GET  /api/notifications/{userId}` — inbox
- `POST /api/notifications/vendor-live` — trigger fan-out

### Verified
2 followers + 1 registered device → vendor-live fanned out to both inboxes and pushed
to the registered device.

## Service map (all ports)
| Service | Port | Status |
|---------|------|--------|
| api-gateway | 8080 | code |
| vendor | 8081 | code |
| live-status | 8082 | code |
| menu | 8083 | code |
| review | 8084 | code |
| search-geo | 8085 | code |
| recommendation | 8086 | code |
| notification | 8087 | code |
| web-app | 5173 | code |

## What's next (hardening, not new services)
- api-gateway: phone-OTP auth filter + rate limiting
- Spark batch job to train the collaborative recommender from the Kafka event log
- Run the whole stack via docker compose; integration/load tests
