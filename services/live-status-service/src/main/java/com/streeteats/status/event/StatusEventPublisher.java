package com.streeteats.status.event;

import com.streeteats.status.model.VendorStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class StatusEventPublisher {
    private static final Logger log = LoggerFactory.getLogger(StatusEventPublisher.class);
    public static final String TOPIC = "vendor.status.changed";

    @Autowired(required = false)
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void publish(VendorStatus s) {
        Map<String, Object> event = Map.of(
                "vendorId", s.getVendorId().toString(),
                "state", s.getState().name(),
                "lat", String.valueOf(s.getLat()),
                "lng", String.valueOf(s.getLng()));
        if (kafkaTemplate != null) {
            kafkaTemplate.send(TOPIC, s.getVendorId().toString(), event);
            log.info("Published status change {} to {}", event, TOPIC);
        } else {
            log.info("[no-kafka] would publish {} to {}", event, TOPIC);
        }
    }
}
