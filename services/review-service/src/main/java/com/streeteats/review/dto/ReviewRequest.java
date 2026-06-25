package com.streeteats.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class ReviewRequest {
    private String userId;
    @Min(1) @Max(5)
    private int rating;
    private String comment;
    private String photoUrl;
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
}
