package com.streeteats.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private final SecretKey key;
    private final long ttlMs;

    public JwtService(@Value("${jwt.secret:streeteats-dev-secret-change-me-please-32+chars}") String secret,
                      @Value("${jwt.ttl-ms:86400000}") long ttlMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.ttlMs = ttlMs;
    }

    public String issue(String phone, String role) {
        Date now = new Date();
        return Jwts.builder()
                .subject(phone)
                .claims(Map.of("role", role))
                .issuedAt(now)
                .expiration(new Date(now.getTime() + ttlMs))
                .signWith(key)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    public long getTtlMs() { return ttlMs; }
}
