# Phase 4 — Recommendations (AI/ML, content-based first)

## recommendation-service (:8086)
Personalised "for you" street-food feed.

- **Learns taste**: every interaction (VIEW / DIRECTIONS / CONFIRM / FOLLOW / REVIEW)
  is recorded; higher-intent and more recent events count more (time-decayed, ~30-day half-life).
- **Taste profile**: per-user cuisine affinity, normalised to [0,1]. `GET /{userId}/taste`.
- **Ranking**: pulls the combined nearby feed from search-geo and scores each vendor:
  `0.45·tasteMatch + 0.25·rating + 0.20·openNow + 0.10·freshness`, returns sorted
  results with a human reason and a transparent score breakdown.
- **Kafka ingestion**: `@KafkaListener` on `user.interaction` (disabled by default;
  enable with `streeteats.kafka-consumer=true` + a broker).

### Endpoints
- `POST /api/recommendations/events` — record an interaction
- `GET  /api/recommendations/{userId}/taste` — inspect learned profile
- `GET  /api/recommendations/for-you?userId&lat&lng&radiusKm&limit` — personalised feed

### Verified
With a user who loves chaat, the 4.2★ chaat cart out-ranked a 4.8★ dosa cart
(taste match beat raw rating) — exactly the intended behaviour.

## Why no Spark yet
This is the classic content-based recommender — the right first step. It already
personalises well and needs no cluster. Spark/collaborative filtering comes later for
scale (learning "people who like X also like Y" across all users); the service API stays
the same, so swapping in the Spark-trained model is non-breaking.

## Next
- api-gateway route for `/api/recommendations/**` + auth
- notification-service (FCM)
- Spark batch job to train collaborative model from the Kafka event log
