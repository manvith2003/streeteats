# Phase 7 — Auth (phone-OTP + JWT) & gateway security

## auth-service (:8088)
Phone-OTP login that issues JWTs.
- `POST /api/auth/request-otp {phone}` → generates a 6-digit OTP (logged in dev / SMS in prod).
- `POST /api/auth/verify-otp {phone, otp, role?}` → returns a signed **JWT** (role USER or VENDOR).
- `GET  /api/auth/me` (Bearer) → decodes the token.
- OTPs are short-lived (5 min), one-time use. `auth.expose-otp=false` hides the code in prod.

## api-gateway security
- **JwtAuthFilter** (global): GET requests and `/api/auth/**` are public (open discovery);
  writes (POST/PUT/PATCH/DELETE) require a valid Bearer JWT. On success it forwards
  `X-User-Phone` / `X-User-Role` to downstream services.
- **RateLimitFilter** (global): in-memory fixed-window per-IP limit (default 120 req/min;
  swap to Redis-backed RequestRateLimiter for multi-instance).

### Verified
- OTP → verify → JWT → `/me` round-trip; wrong OTP → 401.
- Through the gateway: unauthenticated `POST /api/vendors` → **401**; public `GET` and
  `/api/auth` pass the filter.

## Service map
| Service | Port |
|---------|------|
| api-gateway | 8080 |
| vendor / live-status / menu / review | 8081–8084 |
| search-geo · recommendation · notification | 8085 · 8086 · 8087 |
| auth | 8088 |
| web-app | 5173 |

## Next
- Frontend login screen + attach Bearer token to write calls
- Spark job to train the collaborative recommender from the Kafka event log
- Integration/load test the full stack
