package com.streeteats.review.repo;

import com.streeteats.review.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByVendorIdOrderByCreatedAtDesc(UUID vendorId);
    long countByVendorId(UUID vendorId);
}
