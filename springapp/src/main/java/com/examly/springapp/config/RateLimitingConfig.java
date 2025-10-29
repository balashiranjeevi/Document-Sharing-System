package com.examly.springapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Configuration
public class RateLimitingConfig {

    @Bean
    public RateLimitingFilter rateLimitingFilter() {
        return new RateLimitingFilter();
    }

    public static class RateLimitingFilter extends OncePerRequestFilter {
        private final ConcurrentHashMap<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
        private final ConcurrentHashMap<String, Long> requestTimes = new ConcurrentHashMap<>();
        private final int MAX_REQUESTS_PER_MINUTE = 100;
        private final long TIME_WINDOW = 60000; // 1 minute

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                FilterChain filterChain) throws ServletException, IOException {
            
            String clientIp = getClientIp(request);
            String key = clientIp + ":" + request.getRequestURI();
            
            // Skip rate limiting for static resources
            if (request.getRequestURI().startsWith("/static/") || 
                request.getRequestURI().startsWith("/css/") ||
                request.getRequestURI().startsWith("/js/")) {
                filterChain.doFilter(request, response);
                return;
            }
            
            long currentTime = System.currentTimeMillis();
            
            // Clean up old entries
            requestTimes.entrySet().removeIf(entry -> 
                currentTime - entry.getValue() > TIME_WINDOW);
            requestCounts.entrySet().removeIf(entry -> 
                !requestTimes.containsKey(entry.getKey()));
            
            // Check rate limit
            AtomicInteger count = requestCounts.computeIfAbsent(key, k -> new AtomicInteger(0));
            Long firstRequestTime = requestTimes.get(key);
            
            if (firstRequestTime == null) {
                requestTimes.put(key, currentTime);
                count.set(1);
            } else if (currentTime - firstRequestTime < TIME_WINDOW) {
                if (count.incrementAndGet() > MAX_REQUESTS_PER_MINUTE) {
                    response.setStatus(429); // Too Many Requests
                    response.getWriter().write("{\"error\":\"Rate limit exceeded\"}");
                    return;
                }
            } else {
                // Reset window
                requestTimes.put(key, currentTime);
                count.set(1);
            }
            
            filterChain.doFilter(request, response);
        }
        
        private String getClientIp(HttpServletRequest request) {
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                return xForwardedFor.split(",")[0].trim();
            }
            
            String xRealIp = request.getHeader("X-Real-IP");
            if (xRealIp != null && !xRealIp.isEmpty()) {
                return xRealIp;
            }
            
            return request.getRemoteAddr();
        }
    }
}