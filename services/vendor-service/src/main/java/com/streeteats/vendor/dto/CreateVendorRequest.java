package com.streeteats.vendor.dto;

import com.streeteats.vendor.model.VendorSource;
import jakarta.validation.constraints.NotBlank;

public class CreateVendorRequest {
    @NotBlank
    private String name;
    private String cuisine;
    private String description;
    private String photoUrl;
    private String address;
    private Double lat;
    private Double lng;
    private VendorSource source;   // optional; defaults to COMMUNITY_ADDED
    private String createdBy;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCuisine() { return cuisine; }
    public void setCuisine(String cuisine) { this.cuisine = cuisine; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }
    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }
    public VendorSource getSource() { return source; }
    public void setSource(VendorSource source) { this.source = source; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}
