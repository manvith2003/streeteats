package com.streeteats.notify.service;

import com.streeteats.notify.model.*;
import com.streeteats.notify.repo.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final FollowRepository follows;
    private final DeviceTokenRepository devices;
    private final NotificationRepository notifications;
    private final PushSender push;

    public NotificationService(FollowRepository follows, DeviceTokenRepository devices,
                               NotificationRepository notifications, PushSender push) {
        this.follows = follows;
        this.devices = devices;
        this.notifications = notifications;
        this.push = push;
    }

    /** Fan out a "vendor is live" alert to everyone following the vendor. */
    public int notifyVendorLive(UUID vendorId, String vendorName) {
        List<Follow> followers = follows.findByVendorId(vendorId);
        String title = vendorName + " is live now";
        String body = "Your favourite cart just went live near you.";
        for (Follow f : followers) {
            persist(f.getUserId(), vendorId, title, body, "VENDOR_LIVE");
            push.send(devices.findByUserId(f.getUserId()), title, body);
        }
        return followers.size();
    }

    /** Alert followers a vendor moved to a spot near them. */
    public int notifyMovedNearby(UUID vendorId, String vendorName) {
        List<Follow> followers = follows.findByVendorId(vendorId);
        String title = vendorName + " moved near you";
        String body = vendorName + " just set up at a new spot nearby.";
        for (Follow f : followers) {
            persist(f.getUserId(), vendorId, title, body, "MOVED_NEARBY");
            push.send(devices.findByUserId(f.getUserId()), title, body);
        }
        return followers.size();
    }

    private void persist(String userId, UUID vendorId, String title, String body, String type) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setVendorId(vendorId);
        n.setTitle(title);
        n.setBody(body);
        n.setType(type);
        notifications.save(n);
    }
}
