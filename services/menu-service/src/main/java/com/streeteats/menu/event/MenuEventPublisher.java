package com.streeteats.menu.event;

import com.streeteats.menu.model.DailyMenu;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class MenuEventPublisher {
    private static final Logger log = LoggerFactory.getLogger(MenuEventPublisher.class);
    public static final String TOPIC = "vendor.menu.updated";

    @Autowired(required = false)
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void publish(DailyMenu m) {
        Map<String, Object> event = Map.of(
                "vendorId", m.getVendorId().toString(),
                "menuDate", m.getMenuDate().toString(),
                "itemCount", m.getItems().size());
        if (kafkaTemplate != null) {
            kafkaTemplate.send(TOPIC, m.getVendorId().toString(), event);
            log.info("Published {} to {}", event, TOPIC);
        } else {
            log.info("[no-kafka] would publish {} to {}", event, TOPIC);
        }
    }
}
