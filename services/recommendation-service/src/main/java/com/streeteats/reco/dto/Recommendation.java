package com.streeteats.reco.dto;

import java.util.Map;

/** A scored vendor with a human-readable reason ("you often pick chaat"). */
public class Recommendation {
    public Object vendorId;
    public String name;
    public String cuisine;
    public Double lat;
    public Double lng;
    public String state;
    public Double averageRating;
    public double score;
    public String reason;
    public Map<String, Double> scoreBreakdown;
}
