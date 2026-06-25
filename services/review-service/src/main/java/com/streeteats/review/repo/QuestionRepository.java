package com.streeteats.review.repo;

import com.streeteats.review.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuestionRepository extends JpaRepository<Question, UUID> {
    List<Question> findByVendorIdOrderByCreatedAtDesc(UUID vendorId);
}
