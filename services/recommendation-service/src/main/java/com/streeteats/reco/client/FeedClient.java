package com.streeteats.reco.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/** Pulls the combined nearby feed from search-geo-service to rank for a user. */
@Component
public class FeedClient {

    private final RestClient http;
    private final String searchBase;

    public FeedClient(@Value("${services.search:http://localhost:8085}") String searchBase) {
        this.searchBase = searchBase;
        this.http = RestClient.create();
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> nearby(double lat, double lng, double radiusKm) {
        try {
            return http.get()
                    .uri(searchBase + "/api/search/nearby?lat={lat}&lng={lng}&radiusKm={r}", lat, lng, radiusKm)
                    .retrieve()
                    .body(List.class);
        } catch (Exception e) {
            return List.of();
        }
    }
}
