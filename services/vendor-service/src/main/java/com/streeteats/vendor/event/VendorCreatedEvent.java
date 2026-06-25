package com.streeteats.vendor.event;

import java.util.UUID;

/** Published to Kafka when a vendor is created, so other services (search, recommendations) can react. */
public record VendorCreatedEvent(UUID vendorId, String name, String cuisine,
                                 Double lat, Double lng, String source) {}
