package com.streeteats.status.repo;

import com.streeteats.status.model.StatusState;
import com.streeteats.status.model.VendorStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface VendorStatusRepository extends JpaRepository<VendorStatus, UUID> {
    List<VendorStatus> findByState(StatusState state);
    List<VendorStatus> findByStateAndLastConfirmedAtBefore(StatusState state, Instant cutoff);
}
