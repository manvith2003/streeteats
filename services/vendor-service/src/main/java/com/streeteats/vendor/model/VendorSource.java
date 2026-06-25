package com.streeteats.vendor.model;

/** Who created the listing. Community-added vendors may have no smartphone. */
public enum VendorSource {
    VENDOR_ADDED,    // created/claimed by the vendor themselves
    COMMUNITY_ADDED  // added by a customer; status comes from crowd confirmation
}
