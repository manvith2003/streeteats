package com.streeteats.status.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/** One live-status row per vendor. */
@Entity
@Table(name = "vendor_status")
public class VendorStatus {

    @Id
    private UUID vendorId;   // shared id with the vendor in vendor-service

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusState state = StatusState.UNCONFIRMED;

    private Double lat;
    private Double lng;

    private Instant lastConfirmedAt;   // last time vendor or a customer confirmed presence
    private int confirmCount;          // crowd "here now" votes
    private int denyCount;             // crowd "not here" votes

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    public UUID getVendorId() { return vendorId; }
    public void setVendorId(UUID vendorId) { this.vendorId = vendorId; }
    public StatusState getState() { return state; }
    public void setState(StatusState state) { this.state = state; }
    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }
    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }
    public Instant getLastConfirmedAt() { return lastConfirmedAt; }
    public void setLastConfirmedAt(Instant t) { this.lastConfirmedAt = t; }
    public int getConfirmCount() { return confirmCount; }
    public void setConfirmCount(int c) { this.confirmCount = c; }
    public int getDenyCount() { return denyCount; }
    public void setDenyCount(int c) { this.denyCount = c; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant t) { this.updatedAt = t; }
}
