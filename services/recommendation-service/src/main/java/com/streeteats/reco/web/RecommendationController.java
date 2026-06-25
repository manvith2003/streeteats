package com.streeteats.reco.web;

import com.streeteats.reco.dto.EventRequest;
import com.streeteats.reco.dto.Recommendation;
import com.streeteats.reco.model.UserEvent;
import com.streeteats.reco.repo.UserEventRepository;
import com.streeteats.reco.service.Recommender;
import com.streeteats.reco.service.TasteProfile;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin
public class RecommendationController {

    private final UserEventRepository events;
    private final TasteProfile taste;
    private final Recommender recommender;

    public RecommendationController(UserEventRepository events, TasteProfile taste, Recommender recommender) {
        this.events = events;
        this.taste = taste;
        this.recommender = recommender;
    }

    /** Record a user interaction (also accepted from Kafka in production). */
    @PostMapping("/events")
    public UserEvent record(@RequestBody EventRequest req) {
        UserEvent e = new UserEvent();
        e.setUserId(req.getUserId());
        e.setVendorId(req.getVendorId());
        e.setCuisine(req.getCuisine());
        e.setType(req.getType());
        return events.save(e);
    }

    /** Inspect a user's learned taste profile. */
    @GetMapping("/{userId}/taste")
    public Map<String, Double> taste(@PathVariable String userId) {
        return taste.cuisineAffinity(userId);
    }

    /** The personalised "for you" feed. */
    @GetMapping("/for-you")
    public List<Recommendation> forYou(@RequestParam String userId,
                                       @RequestParam double lat,
                                       @RequestParam double lng,
                                       @RequestParam(defaultValue = "3") double radiusKm,
                                       @RequestParam(defaultValue = "10") int limit) {
        return recommender.forYou(userId, lat, lng, radiusKm, limit);
    }
}
