package com.streeteats.notify.model;

import jakarta.persistence.*;
import java.util.UUID;

/** A user's push token (FCM registration token). */
@Entity
@Table(name = "device_token", uniqueConstraints = @UniqueConstraint(columnNames = "token"))
public class DeviceToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false, length = 512)
    private String token;

    private String platform; // android / ios / web

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }
}
