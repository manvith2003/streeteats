package com.streeteats.notify.web;

import com.streeteats.notify.model.DeviceToken;
import com.streeteats.notify.model.Follow;
import com.streeteats.notify.model.Notification;
import com.streeteats.notify.repo.DeviceTokenRepository;
import com.streeteats.notify.repo.FollowRepository;
import com.streeteats.notify.repo.NotificationRepository;
import com.streeteats.notify.service.NotificationService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin
public class NotificationController {

    private final FollowRepository follows;
    private final DeviceTokenRepository devices;
    private final NotificationRepository notifications;
    private final NotificationService service;

    public NotificationController(FollowRepository follows, DeviceTokenRepository devices,
                                  NotificationRepository notifications, NotificationService service) {
        this.follows = follows;
        this.devices = devices;
        this.notifications = notifications;
        this.service = service;
    }

    @PostMapping("/follow")
    public Follow follow(@RequestBody Map<String, String> body) {
        Follow f = new Follow();
        f.setUserId(body.get("userId"));
        f.setVendorId(UUID.fromString(body.get("vendorId")));
        return follows.save(f);
    }

    @DeleteMapping("/follow")
    @Transactional
    public void unfollow(@RequestParam String userId, @RequestParam UUID vendorId) {
        follows.deleteByUserIdAndVendorId(userId, vendorId);
    }

    @GetMapping("/follows/{userId}")
    public List<Follow> myFollows(@PathVariable String userId) {
        return follows.findByUserId(userId);
    }

    @PostMapping("/devices")
    public DeviceToken registerDevice(@RequestBody Map<String, String> body) {
        DeviceToken d = new DeviceToken();
        d.setUserId(body.get("userId"));
        d.setToken(body.get("token"));
        d.setPlatform(body.getOrDefault("platform", "android"));
        return devices.save(d);
    }

    /** In-app notification inbox. */
    @GetMapping("/{userId}")
    public List<Notification> inbox(@PathVariable String userId) {
        return notifications.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /** Trigger fan-out (also driven by Kafka status events in production). */
    @PostMapping("/vendor-live")
    public Map<String, Object> vendorLive(@RequestBody Map<String, String> body) {
        UUID vendorId = UUID.fromString(body.get("vendorId"));
        String name = body.getOrDefault("vendorName", "A vendor");
        int n = service.notifyVendorLive(vendorId, name);
        return Map.of("notified", n);
    }
}
