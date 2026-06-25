package com.streeteats.reco.dto;

import com.streeteats.reco.model.InteractionType;
import java.util.UUID;

public class EventRequest {
    private String userId;
    private UUID vendorId;
    private String cuisine;
    private InteractionType type;
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public UUID getVendorId() { return vendorId; }
    public void setVendorId(UUID vendorId) { this.vendorId = vendorId; }
    public String getCuisine() { return cuisine; }
    public void setCuisine(String cuisine) { this.cuisine = cuisine; }
    public InteractionType getType() { return type; }
    public void setType(InteractionType type) { this.type = type; }
}
