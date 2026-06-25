package com.streeteats.auth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Issues and verifies short-lived OTPs. In-memory + time-limited (fine for a single
 * instance / dev). In production, store in Redis and send via an SMS provider.
 */
@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private static final long TTL_MS = 5 * 60 * 1000;
    private final SecureRandom rnd = new SecureRandom();
    private final ConcurrentHashMap<String, Entry> store = new ConcurrentHashMap<>();

    private record Entry(String otp, long expiresAt) {}

    /** Generate + "send" an OTP. Returns the code (dev only — real SMS would not). */
    public String requestOtp(String phone) {
        String otp = String.format("%06d", rnd.nextInt(1_000_000));
        store.put(phone, new Entry(otp, Instant.now().toEpochMilli() + TTL_MS));
        log.info("[otp] {} -> {} (dev: logged instead of SMS)", phone, otp);
        return otp;
    }

    public boolean verify(String phone, String otp) {
        Entry e = store.get(phone);
        if (e == null || Instant.now().toEpochMilli() > e.expiresAt()) return false;
        boolean ok = e.otp().equals(otp);
        if (ok) store.remove(phone);   // one-time use
        return ok;
    }
}
