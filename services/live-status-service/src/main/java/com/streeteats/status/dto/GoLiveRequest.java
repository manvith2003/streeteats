package com.streeteats.status.dto;

import jakarta.validation.constraints.NotNull;

/** Vendor taps "Go live here" — snaps to current GPS. */
public class GoLiveRequest {
    @NotNull private Double lat;
    @NotNull private Double lng;
    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }
    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }
}
