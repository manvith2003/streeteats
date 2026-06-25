package com.streeteats.status.job;

import com.streeteats.status.model.StatusState;
import com.streeteats.status.model.VendorStatus;
import com.streeteats.status.repo.VendorStatusRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Safety net: any OPEN pin not confirmed within the freshness window decays to
 * UNCONFIRMED, so the map never shows a stale vendor as "open".
 */
@Component
public class AutoDecayJob {

    private static final Logger log = LoggerFactory.getLogger(AutoDecayJob.class);

    @Value("${streeteats.freshness-minutes:180}")
    private long freshnessMinutes;

    private final VendorStatusRepository repo;

    public AutoDecayJob(VendorStatusRepository repo) {
        this.repo = repo;
    }

    @Scheduled(fixedDelayString = "${streeteats.decay-interval-ms:300000}") // every 5 min
    public void decayStale() {
        Instant cutoff = Instant.now().minus(freshnessMinutes, ChronoUnit.MINUTES);
        List<VendorStatus> stale = repo.findByStateAndLastConfirmedAtBefore(StatusState.OPEN, cutoff);
        for (VendorStatus s : stale) {
            s.setState(StatusState.UNCONFIRMED);
            s.setUpdatedAt(Instant.now());
        }
        if (!stale.isEmpty()) {
            repo.saveAll(stale);
            log.info("Auto-decayed {} stale OPEN vendors to UNCONFIRMED", stale.size());
        }
    }
}
