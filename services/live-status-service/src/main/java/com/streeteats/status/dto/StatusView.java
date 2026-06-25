package com.streeteats.status.dto;

import com.streeteats.status.model.StatusState;
import com.streeteats.status.model.VendorStatus;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

/** Status enriched with a freshness figure for the UI ("Confirmed 8 min ago"). */
public class StatusView {
    public UUID vendorId;
    public StatusState state;
    public Double lat;
    public Double lng;
    public Integer minutesSinceConfirmed;  // null if never confirmed
    public int confirmCount;
    public int denyCount;

    public static StatusView from(VendorStatus s) {
        StatusView v = new StatusView();
        v.vendorId = s.getVendorId();
        v.state = s.getState();
        v.lat = s.getLat();
        v.lng = s.getLng();
        v.confirmCount = s.getConfirmCount();
        v.denyCount = s.getDenyCount();
        if (s.getLastConfirmedAt() != null) {
            v.minutesSinceConfirmed = (int) Duration.between(s.getLastConfirmedAt(), Instant.now()).toMinutes();
        }
        return v;
    }
}
