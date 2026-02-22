package com.optiroute.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class TokenBlacklistService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String BLACKLIST_PREFIX = "BLACKLIST_TOKEN:";

    public void blacklistToken(String token, long durationInMillis) {
        // Set key with TTL
        redisTemplate.opsForValue().set(BLACKLIST_PREFIX + token, "revoked", durationInMillis, TimeUnit.MILLISECONDS);
    }

    public boolean isBlacklisted(String token) {
        return redisTemplate.hasKey(BLACKLIST_PREFIX + token);
    }
}
