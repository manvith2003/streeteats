package com.streeteats.reco.repo;

import com.streeteats.reco.model.UserEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserEventRepository extends JpaRepository<UserEvent, java.util.UUID> {
    List<UserEvent> findByUserId(String userId);
}
