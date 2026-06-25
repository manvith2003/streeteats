package com.streeteats.search.dto;

import java.util.List;
import java.util.Map;

/** One vendor enriched with live status, rating and today's menu — the combined map feed. */
public class EnrichedVendor {
    public Object id;
    public String name;
    public String cuisine;
    public Double lat;
    public Double lng;
    public String source;
    public boolean verified;

    public String state;                 // OPEN / MOVING / CLOSED / UNCONFIRMED / UNKNOWN
    public Integer minutesSinceConfirmed;
    public Double averageRating;
    public Long reviewCount;
    public List<Map<String, Object>> menuItems;  // today's items (may be null)
}
