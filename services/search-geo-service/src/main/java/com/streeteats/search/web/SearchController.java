package com.streeteats.search.web;

import com.streeteats.search.client.UpstreamClient;
import com.streeteats.search.dto.EnrichedVendor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@CrossOrigin
public class SearchController {

    private final UpstreamClient upstream;

    public SearchController(UpstreamClient upstream) {
        this.upstream = upstream;
    }

    /**
     * The combined map feed: nearby vendors, each enriched with live status,
     * rating and today's menu — one call for the whole map.
     */
    @GetMapping("/nearby")
    public Mono<List<EnrichedVendor>> nearby(@RequestParam double lat,
                                             @RequestParam double lng,
                                             @RequestParam(defaultValue = "3") double radiusKm) {
        return upstream.nearbyVendors(lat, lng, radiusKm)
                .flatMapMany(Flux::fromIterable)
                .flatMap(this::enrich)
                .collectList();
    }

    private Mono<EnrichedVendor> enrich(Map<String, Object> v) {
        String id = String.valueOf(v.get("id"));
        return Mono.zip(
                upstream.status(id),
                upstream.ratingSummary(id),
                upstream.todayMenu(id)
        ).map(t -> {
            Map<String, Object> status = t.getT1();
            Map<String, Object> rating = t.getT2();
            Map<String, Object> menu = t.getT3();

            EnrichedVendor e = new EnrichedVendor();
            e.id = v.get("id");
            e.name = (String) v.get("name");
            e.cuisine = (String) v.get("cuisine");
            e.lat = asDouble(v.get("lat"));
            e.lng = asDouble(v.get("lng"));
            e.source = (String) v.get("source");
            e.verified = Boolean.TRUE.equals(v.get("verified"));

            e.state = status.isEmpty() ? "UNKNOWN" : String.valueOf(status.get("state"));
            e.minutesSinceConfirmed = status.get("minutesSinceConfirmed") instanceof Number n ? n.intValue() : null;
            e.averageRating = asDouble(rating.get("averageRating"));
            e.reviewCount = rating.get("reviewCount") instanceof Number n ? n.longValue() : null;
            //noinspection unchecked
            e.menuItems = menu.get("items") instanceof List<?> items ? (List<Map<String, Object>>) items : null;
            return e;
        });
    }

    private static Double asDouble(Object o) {
        return o instanceof Number n ? n.doubleValue() : null;
    }
}
