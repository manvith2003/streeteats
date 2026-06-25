package com.streeteats.reco.model;

/** Signals of taste, ordered roughly by how strongly they imply a preference. */
public enum InteractionType {
    VIEW(1.0),        // opened the vendor card
    DIRECTIONS(2.0),  // tapped "on the way"
    CONFIRM(2.5),     // "here now" — actually went
    FOLLOW(3.0),      // followed the vendor
    REVIEW(4.0);      // left a review

    public final double weight;
    InteractionType(double w) { this.weight = w; }
}
