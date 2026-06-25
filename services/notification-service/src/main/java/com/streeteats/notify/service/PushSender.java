package com.streeteats.notify.service;

import com.streeteats.notify.model.DeviceToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Sends push notifications. Pluggable: when no FCM credentials are configured it logs
 * (safe for local dev). Swap in firebase-admin in sendViaFcm() for production.
 */
@Component
public class PushSender {

    private static final Logger log = LoggerFactory.getLogger(PushSender.class);

    @Value("${fcm.enabled:false}")
    private boolean fcmEnabled;

    public void send(List<DeviceToken> devices, String title, String body) {
        if (devices.isEmpty()) {
            log.info("No devices to push to: {} - {}", title, body);
            return;
        }
        if (fcmEnabled) {
            sendViaFcm(devices, title, body);
        } else {
            for (DeviceToken d : devices) {
                log.info("[push:dev] -> {} ({}): {} — {}", d.getUserId(), d.getPlatform(), title, body);
            }
        }
    }

    private void sendViaFcm(List<DeviceToken> devices, String title, String body) {
        // TODO: integrate com.google.firebase:firebase-admin
        // FirebaseMessaging.getInstance().sendEachForMulticast(...)
        log.info("[push:fcm] would send '{}' to {} device(s)", title, devices.size());
    }
}
