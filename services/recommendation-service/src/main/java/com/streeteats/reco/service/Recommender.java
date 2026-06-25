package com.streeteats.reco.service;

import com.streeteats.reco.client.FeedClient;
import com.streeteats.reco.dto.Recommendation;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Ranks nearby vendors for a user by blending: taste match, rating, open-now,
 * and freshness. Distance is already bounded by the nearby radius.
 */
@Service
public class Recommender {

    // weights — tunable; later learned.
    private static final double W_TASTE = 0.45;
    private static final double W_RATING = 0.25;
    private static final double W_OPEN = 0.20;
    private static final double W_FRESH = 0.10;

    private final FeedClient feed;
    private final TasteProfile taste;

    public Recommender(FeedClient feed, TasteProfile taste) {
        this.feed = feed;
        this.taste = taste;
    }

    public List<Recommendation> forYou(String userId, double lat, double lng, double radiusKm, int limit) {
        Map<String, Double> affinity = taste.cuisineAffinity(userId);
        List<Map<String, Object>> vendors = feed.nearby(lat, lng, radiusKm);

        List<Recommendation> recs = new ArrayList<>();
        for (Map<String, Object> v : vendors) {
            String cuisine = str(v.get("cuisine"));
            double tasteMatch = cuisine == null ? 0.0 : affinity.getOrDefault(cuisine.toLowerCase(), 0.0);
            double rating = num(v.get("averageRating")) / 5.0;
            String state = str(v.get("state"));
            double open = "OPEN".equals(state) ? 1.0 : ("MOVING".equals(state) ? 0.4 : 0.0);
            double fresh = freshness(v.get("minutesSinceConfirmed"));

            double score = W_TASTE * tasteMatch + W_RATING * rating + W_OPEN * open + W_FRESH * fresh;

            Recommendation r = new Recommendation();
            r.vendorId = v.get("id");
            r.name = str(v.get("name"));
            r.cuisine = cuisine;
            r.lat = numOrNull(v.get("lat"));
            r.lng = numOrNull(v.get("lng"));
            r.state = state;
            r.averageRating = numOrNull(v.get("averageRating"));
            r.score = Math.round(score * 1000) / 1000.0;
            r.reason = reason(tasteMatch, open, rating, cuisine);
            r.scoreBreakdown = Map.of("taste", round(W_TASTE * tasteMatch),
                                      "rating", round(W_RATING * rating),
                                      "open", round(W_OPEN * open),
                                      "fresh", round(W_FRESH * fresh));
            recs.add(r);
        }
        recs.sort(Comparator.comparingDouble((Recommendation r) -> r.score).reversed());
        return recs.size() > limit ? recs.subList(0, limit) : recs;
    }

    private String reason(double taste, double open, double rating, String cuisine) {
        if (taste > 0.5 && cuisine != null) return "You often go for " + cuisine;
        if (open >= 1.0 && rating > 0.8) return "Open now and highly rated";
        if (open >= 1.0) return "Open right now near you";
        if (rating > 0.8) return "Highly rated nearby";
        return "Near you";
    }

    private double freshness(Object mins) {
        if (!(mins instanceof Number n)) return 0.0;
        double m = n.doubleValue();
        return Math.max(0.0, 1.0 - m / 180.0); // fades over the 3h freshness window
    }

    private static String str(Object o) { return o == null ? null : String.valueOf(o); }
    private static double num(Object o) { return o instanceof Number n ? n.doubleValue() : 0.0; }
    private static Double numOrNull(Object o) { return o instanceof Number n ? n.doubleValue() : null; }
    private static double round(double d) { return Math.round(d * 1000) / 1000.0; }
}
