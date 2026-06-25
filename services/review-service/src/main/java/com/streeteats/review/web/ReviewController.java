package com.streeteats.review.web;

import com.streeteats.review.dto.ReviewRequest;
import com.streeteats.review.dto.VendorRatingSummary;
import com.streeteats.review.model.Question;
import com.streeteats.review.model.Review;
import com.streeteats.review.repo.QuestionRepository;
import com.streeteats.review.repo.ReviewRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
public class ReviewController {

    private final ReviewRepository reviews;
    private final QuestionRepository questions;

    public ReviewController(ReviewRepository reviews, QuestionRepository questions) {
        this.reviews = reviews;
        this.questions = questions;
    }

    @PostMapping("/{vendorId}")
    public Review add(@PathVariable UUID vendorId, @Valid @RequestBody ReviewRequest req) {
        Review r = new Review();
        r.setVendorId(vendorId);
        r.setUserId(req.getUserId());
        r.setRating(req.getRating());
        r.setComment(req.getComment());
        r.setPhotoUrl(req.getPhotoUrl());
        return reviews.save(r);
    }

    @GetMapping("/{vendorId}")
    public List<Review> list(@PathVariable UUID vendorId) {
        return reviews.findByVendorIdOrderByCreatedAtDesc(vendorId);
    }

    /** Average rating + count — shown on the map popup and vendor page. */
    @GetMapping("/{vendorId}/summary")
    public VendorRatingSummary summary(@PathVariable UUID vendorId) {
        List<Review> list = reviews.findByVendorIdOrderByCreatedAtDesc(vendorId);
        double avg = list.stream().mapToInt(Review::getRating).average().orElse(0.0);
        return new VendorRatingSummary(vendorId, Math.round(avg * 10) / 10.0, list.size());
    }

    // --- "Is it open?" Q&A ---

    @PostMapping("/{vendorId}/questions")
    public Question ask(@PathVariable UUID vendorId, @RequestBody Map<String, String> body) {
        Question q = new Question();
        q.setVendorId(vendorId);
        q.setAskedBy(body.get("askedBy"));
        q.setText(body.getOrDefault("text", "Is it open now?"));
        return questions.save(q);
    }

    @GetMapping("/{vendorId}/questions")
    public List<Question> listQuestions(@PathVariable UUID vendorId) {
        return questions.findByVendorIdOrderByCreatedAtDesc(vendorId);
    }

    @PostMapping("/questions/{questionId}/answer")
    public Question answer(@PathVariable UUID questionId, @RequestBody Map<String, String> body) {
        Question q = questions.findById(questionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found"));
        q.setAnswer(body.get("answer"));
        q.setAnsweredBy(body.get("answeredBy"));
        q.setAnsweredAt(Instant.now());
        return questions.save(q);
    }
}
