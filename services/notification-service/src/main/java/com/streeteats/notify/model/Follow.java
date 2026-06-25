package com.streeteats.notify.model;

import jakarta.persistence.*;
import java.util.UUID;

/** A user following a vendor → gets alerts when it goes live / moves near them. */
@Entity
@Table(name = "follow", uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "vendorId"}))
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private UUID vendorId;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public UUID getVendorId() { return vendorId; }
    public void setVendorId(UUID vendorId) { this.vendorId = vendorId; }
}
