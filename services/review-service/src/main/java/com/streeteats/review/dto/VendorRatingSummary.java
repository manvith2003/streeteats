package com.streeteats.review.dto;

import java.util.UUID;

public class VendorRatingSummary {
    public UUID vendorId;
    public double averageRating;
    public long reviewCount;
    public VendorRatingSummary(UUID vendorId, double averageRating, long reviewCount) {
        this.vendorId = vendorId;
        this.averageRating = averageRating;
        this.reviewCount = reviewCount;
    }
}
