package com.streeteats.reco.service;

import com.streeteats.reco.model.UserEvent;
import com.streeteats.reco.repo.UserEventRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Builds a per-user cuisine affinity from interaction history.
 * Recent and high-intent events count more (time-decayed, weighted).
 * This is the content-based model; at scale it is replaced/augmented by the
 * Spark-trained collaborative model, but the API stays the same.
 */
@Service
public class TasteProfile {

    private final UserEventRepository events;

    public TasteProfile(UserEventRepository events) {
        this.events = events;
    }

    /** cuisine -> normalised affinity in [0,1]. */
    public Map<String, Double> cuisineAffinity(String userId) {
        List<UserEvent> history = events.findByUserId(userId);
        Map<String, Double> raw = new HashMap<>();
        for (UserEvent e : history) {
            if (e.getCuisine() == null) continue;
            double recency = recencyDecay(e.getCreatedAt());
            raw.merge(e.getCuisine().toLowerCase(), e.getType().weight * recency, Double::sum);
        }
        double max = raw.values().stream().mapToDouble(Double::doubleValue).max().orElse(0.0);
        if (max <= 0) return raw;
        Map<String, Double> norm = new HashMap<>();
        raw.forEach((k, v) -> norm.put(k, v / max));
        return norm;
    }

    /** Half-life ~30 days. */
    private double recencyDecay(Instant when) {
        long days = Duration.between(when, Instant.now()).toDays();
        return Math.pow(0.5, days / 30.0);
    }
}
