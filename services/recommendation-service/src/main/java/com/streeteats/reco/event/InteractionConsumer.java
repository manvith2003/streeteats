package com.streeteats.reco.event;

import com.streeteats.reco.dto.EventRequest;
import com.streeteats.reco.model.UserEvent;
import com.streeteats.reco.repo.UserEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Ingests user interactions from Kafka so the taste profile updates in real time.
 * Disabled by default (no broker needed for local dev); enable with
 * streeteats.kafka-consumer=true.
 */
@Component
@ConditionalOnProperty(name = "streeteats.kafka-consumer", havingValue = "true")
public class InteractionConsumer {

    private static final Logger log = LoggerFactory.getLogger(InteractionConsumer.class);
    private final UserEventRepository events;

    public InteractionConsumer(UserEventRepository events) {
        this.events = events;
    }

    @KafkaListener(topics = "user.interaction", groupId = "recommendation-service")
    public void onInteraction(EventRequest req) {
        UserEvent e = new UserEvent();
        e.setUserId(req.getUserId());
        e.setVendorId(req.getVendorId());
        e.setCuisine(req.getCuisine());
        e.setType(req.getType());
        events.save(e);
        log.info("Ingested interaction for user {} ({})", req.getUserId(), req.getCuisine());
    }
}
