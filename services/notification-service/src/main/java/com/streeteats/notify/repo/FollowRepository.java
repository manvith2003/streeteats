package com.streeteats.notify.repo;

import com.streeteats.notify.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FollowRepository extends JpaRepository<Follow, UUID> {
    List<Follow> findByVendorId(UUID vendorId);
    List<Follow> findByUserId(String userId);
    void deleteByUserIdAndVendorId(String userId, UUID vendorId);
}
