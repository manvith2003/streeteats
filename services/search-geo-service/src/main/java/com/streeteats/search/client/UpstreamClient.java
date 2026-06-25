package com.streeteats.search.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.Map;

/**
 * Calls the domain services. Each call is defensive: on any error it resolves to an
 * empty/absent value so one slow or down service never breaks the whole feed.
 */
@Component
public class UpstreamClient {

    private final WebClient http;
    private final String vendorBase;
    private final String statusBase;
    private final String reviewBase;
    private final String menuBase;

    public UpstreamClient(WebClient http,
                          @Value("${services.vendor:http://localhost:8081}") String vendorBase,
                          @Value("${services.status:http://localhost:8082}") String statusBase,
                          @Value("${services.menu:http://localhost:8083}") String menuBase,
                          @Value("${services.review:http://localhost:8084}") String reviewBase) {
        this.http = http;
        this.vendorBase = vendorBase;
        this.statusBase = statusBase;
        this.menuBase = menuBase;
        this.reviewBase = reviewBase;
    }

    @SuppressWarnings("unchecked")
    public Mono<List<Map<String, Object>>> nearbyVendors(double lat, double lng, double radiusKm) {
        return http.get()
                .uri(vendorBase + "/api/vendors/nearby?lat={lat}&lng={lng}&radiusKm={r}", lat, lng, radiusKm)
                .retrieve().bodyToMono(List.class).map(l -> (List<Map<String, Object>>) l)
                .timeout(Duration.ofSeconds(3))
                .onErrorReturn(List.of());
    }

    @SuppressWarnings("unchecked")
    public Mono<Map<String, Object>> status(String vendorId) {
        return http.get().uri(statusBase + "/api/status/{id}", vendorId)
                .retrieve().bodyToMono(Map.class).map(m -> (Map<String, Object>) m)
                .timeout(Duration.ofSeconds(2)).onErrorReturn(Map.of());
    }

    @SuppressWarnings("unchecked")
    public Mono<Map<String, Object>> ratingSummary(String vendorId) {
        return http.get().uri(reviewBase + "/api/reviews/{id}/summary", vendorId)
                .retrieve().bodyToMono(Map.class).map(m -> (Map<String, Object>) m)
                .timeout(Duration.ofSeconds(2)).onErrorReturn(Map.of());
    }

    @SuppressWarnings("unchecked")
    public Mono<Map<String, Object>> todayMenu(String vendorId) {
        return http.get().uri(menuBase + "/api/menu/{id}/today", vendorId)
                .retrieve().bodyToMono(Map.class).map(m -> (Map<String, Object>) m)
                .timeout(Duration.ofSeconds(2)).onErrorReturn(Map.of());
    }
}
