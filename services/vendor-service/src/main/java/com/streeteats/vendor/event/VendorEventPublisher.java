package com.streeteats.vendor.event;

import com.streeteats.vendor.model.Vendor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class VendorEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(VendorEventPublisher.class);
    public static final String TOPIC = "vendor.created";

    // Optional so the service still runs locally without a Kafka broker.
    @Autowired(required = false)
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void publishVendorCreated(Vendor v) {
        VendorCreatedEvent event = new VendorCreatedEvent(
                v.getId(), v.getName(), v.getCuisine(), v.getLat(), v.getLng(), v.getSource().name());
        if (kafkaTemplate != null) {
            kafkaTemplate.send(TOPIC, v.getId().toString(), event);
            log.info("Published {} to topic {}", event, TOPIC);
        } else {
            log.info("[no-kafka] would publish {} to {}", event, TOPIC);
        }
    }
}
