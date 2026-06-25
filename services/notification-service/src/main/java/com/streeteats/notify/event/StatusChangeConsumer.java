package com.streeteats.notify.event;

import com.streeteats.notify.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

/**
 * Listens to live-status-service's `vendor.status.changed`. When a vendor goes OPEN,
 * fan out alerts to its followers. Disabled by default; enable with
 * streeteats.kafka-consumer=true + a broker.
 */
@Component
@ConditionalOnProperty(name = "streeteats.kafka-consumer", havingValue = "true")
public class StatusChangeConsumer {

    private static final Logger log = LoggerFactory.getLogger(StatusChangeConsumer.class);
    private final NotificationService service;

    public StatusChangeConsumer(NotificationService service) {
        this.service = service;
    }

    @KafkaListener(topics = "vendor.status.changed", groupId = "notification-service")
    public void onStatusChange(Map<String, Object> event) {
        String state = String.valueOf(event.get("state"));
        if (!"OPEN".equals(state)) return;
        UUID vendorId = UUID.fromString(String.valueOf(event.get("vendorId")));
        int n = service.notifyVendorLive(vendorId, "Your cart");
        log.info("vendor {} live → notified {} follower(s)", vendorId, n);
    }
}
