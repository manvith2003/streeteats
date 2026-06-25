package com.streeteats.auth.web;

import com.streeteats.auth.service.JwtService;
import com.streeteats.auth.service.OtpService;
import io.jsonwebtoken.Claims;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final OtpService otp;
    private final JwtService jwt;

    @Value("${auth.expose-otp:true}")  // dev convenience; set false in prod
    private boolean exposeOtp;

    public AuthController(OtpService otp, JwtService jwt) {
        this.otp = otp;
        this.jwt = jwt;
    }

    /** Step 1: request an OTP for a phone number. */
    @PostMapping("/request-otp")
    public Map<String, Object> requestOtp(@RequestBody PhoneRequest req) {
        String code = otp.requestOtp(req.phone);
        return exposeOtp ? Map.of("sent", true, "devOtp", code) : Map.of("sent", true);
    }

    /** Step 2: verify the OTP and receive a JWT. */
    @PostMapping("/verify-otp")
    public Map<String, Object> verifyOtp(@RequestBody VerifyRequest req) {
        if (!otp.verify(req.phone, req.otp)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired OTP");
        }
        String role = req.role != null ? req.role : "USER";   // USER or VENDOR
        String token = jwt.issue(req.phone, role);
        return Map.of("token", token, "tokenType", "Bearer", "expiresInMs", jwt.getTtlMs(), "role", role);
    }

    /** Validate a token (handy for clients / debugging). */
    @GetMapping("/me")
    public Map<String, Object> me(@RequestHeader("Authorization") String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing bearer token");
        }
        try {
            Claims c = jwt.parse(authorization.substring(7));
            return Map.of("phone", c.getSubject(), "role", c.get("role"), "expiresAt", c.getExpiration().toString());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }
    }

    public static class PhoneRequest { @NotBlank public String phone; }
    public static class VerifyRequest { @NotBlank public String phone; @NotBlank public String otp; public String role; }
}
