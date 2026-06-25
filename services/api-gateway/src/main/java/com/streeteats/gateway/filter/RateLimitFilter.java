package com.streeteats.gateway.filter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Simple in-memory fixed-window rate limit per client IP. Good enough for a single
 * gateway instance / demo. For multi-instance, switch to Spring Cloud Gateway's
 * RequestRateLimiter backed by Redis.
 */
@Component
public class RateLimitFilter implements GlobalFilter, Ordered {

    @Value("${ratelimit.requests-per-minute:120}")
    private int limit;

    private record Window(AtomicInteger count, long resetAt) {}
    private final ConcurrentHashMap<String, Window> windows = new ConcurrentHashMap<>();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String ip = exchange.getRequest().getRemoteAddress() != null
                ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress() : "unknown";
        long now = System.currentTimeMillis();
        Window w = windows.compute(ip, (k, cur) ->
                (cur == null || now > cur.resetAt()) ? new Window(new AtomicInteger(0), now + 60_000) : cur);
        if (w.count().incrementAndGet() > limit) {
            exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
            exchange.getResponse().getHeaders().add("X-RateLimit-Limit", String.valueOf(limit));
            return exchange.getResponse().setComplete();
        }
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() { return -200; } // before auth
}
