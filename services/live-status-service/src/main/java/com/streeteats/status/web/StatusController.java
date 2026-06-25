package com.streeteats.status.web;

import com.streeteats.status.dto.GoLiveRequest;
import com.streeteats.status.dto.StatusView;
import com.streeteats.status.event.StatusEventPublisher;
import com.streeteats.status.model.StatusState;
import com.streeteats.status.model.VendorStatus;
import com.streeteats.status.repo.VendorStatusRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/status")
@CrossOrigin
public class StatusController {

    private final VendorStatusRepository repo;
    private final StatusEventPublisher events;

    public StatusController(VendorStatusRepository repo, StatusEventPublisher events) {
        this.repo = repo;
        this.events = events;
    }

    private VendorStatus load(UUID vendorId) {
        return repo.findById(vendorId).orElseGet(() -> {
            VendorStatus s = new VendorStatus();
            s.setVendorId(vendorId);
            return s;
        });
    }

    private VendorStatus save(VendorStatus s) {
        s.setUpdatedAt(Instant.now());
        VendorStatus saved = repo.save(s);
        events.publish(saved);
        return saved;
    }

    /** Vendor sets up and goes live at their current GPS spot. */
    @PostMapping("/{vendorId}/go-live")
    public StatusView goLive(@PathVariable UUID vendorId, @Valid @RequestBody GoLiveRequest req) {
        VendorStatus s = load(vendorId);
        s.setState(StatusState.OPEN);
        s.setLat(req.getLat());
        s.setLng(req.getLng());
        s.setLastConfirmedAt(Instant.now());
        s.setConfirmCount(0);
        s.setDenyCount(0);
        return StatusView.from(save(s));
    }

    @PostMapping("/{vendorId}/moving")
    public StatusView moving(@PathVariable UUID vendorId) {
        VendorStatus s = load(vendorId);
        s.setState(StatusState.MOVING);
        return StatusView.from(save(s));
    }

    @PostMapping("/{vendorId}/close")
    public StatusView close(@PathVariable UUID vendorId) {
        VendorStatus s = load(vendorId);
        s.setState(StatusState.CLOSED);
        return StatusView.from(save(s));
    }

    /** Crowd confirmation: a nearby user taps "Here now". Refreshes freshness. */
    @PostMapping("/{vendorId}/confirm")
    public StatusView confirm(@PathVariable UUID vendorId) {
        VendorStatus s = load(vendorId);
        s.setConfirmCount(s.getConfirmCount() + 1);
        s.setLastConfirmedAt(Instant.now());
        if (s.getState() == StatusState.UNCONFIRMED) s.setState(StatusState.OPEN);
        return StatusView.from(save(s));
    }

    /** Crowd "Not here" vote. */
    @PostMapping("/{vendorId}/deny")
    public StatusView deny(@PathVariable UUID vendorId) {
        VendorStatus s = load(vendorId);
        s.setDenyCount(s.getDenyCount() + 1);
        // enough denies vs confirms => treat as gone
        if (s.getDenyCount() >= 3 && s.getDenyCount() > s.getConfirmCount()) {
            s.setState(StatusState.UNCONFIRMED);
        }
        return StatusView.from(save(s));
    }

    @GetMapping("/{vendorId}")
    public StatusView get(@PathVariable UUID vendorId) {
        return StatusView.from(load(vendorId));
    }

    /** All currently-open vendors — used to colour the map pins. */
    @GetMapping("/active")
    public List<StatusView> active() {
        return repo.findByState(StatusState.OPEN).stream().map(StatusView::from).toList();
    }
}
