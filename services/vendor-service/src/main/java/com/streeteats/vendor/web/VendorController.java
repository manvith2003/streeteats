package com.streeteats.vendor.web;

import com.streeteats.vendor.dto.CreateVendorRequest;
import com.streeteats.vendor.event.VendorEventPublisher;
import com.streeteats.vendor.model.Vendor;
import com.streeteats.vendor.model.VendorSource;
import com.streeteats.vendor.repo.VendorRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin // allow the React dev server during Phase 1
public class VendorController {

    private final VendorRepository repo;
    private final VendorEventPublisher events;

    public VendorController(VendorRepository repo, VendorEventPublisher events) {
        this.repo = repo;
        this.events = events;
    }

    /** Create a vendor. Customers can add community vendors (no vendor account needed). */
    @PostMapping
    public ResponseEntity<Vendor> create(@Valid @RequestBody CreateVendorRequest req) {
        Vendor v = new Vendor();
        v.setName(req.getName());
        v.setCuisine(req.getCuisine());
        v.setDescription(req.getDescription());
        v.setPhotoUrl(req.getPhotoUrl());
        v.setAddress(req.getAddress());
        v.setLat(req.getLat());
        v.setLng(req.getLng());
        v.setSource(req.getSource() != null ? req.getSource() : VendorSource.COMMUNITY_ADDED);
        v.setCreatedBy(req.getCreatedBy());
        Vendor saved = repo.save(v);
        events.publishVendorCreated(saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}")
    public Vendor get(@PathVariable UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendor not found"));
    }

    @GetMapping
    public List<Vendor> all() {
        return repo.findAll();
    }

    /** "Vendors near me" — the heart of the map. */
    @GetMapping("/nearby")
    public List<Vendor> nearby(@RequestParam double lat,
                               @RequestParam double lng,
                               @RequestParam(defaultValue = "3") double radiusKm) {
        return repo.findNearby(lat, lng, radiusKm);
    }

    /** A vendor claims a community-added listing (e.g. once they get a smartphone). */
    @PostMapping("/{id}/claim")
    public Vendor claim(@PathVariable UUID id) {
        Vendor v = get(id);
        v.setVerified(true);
        v.setSource(VendorSource.VENDOR_ADDED);
        v.setUpdatedAt(Instant.now());
        return repo.save(v);
    }
}
