package com.optiroute.controller;

import com.optiroute.dto.JwtResponse;
import com.optiroute.dto.LoginRequest;
import com.optiroute.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // For development simplicity
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private com.optiroute.service.TokenBlacklistService tokenBlacklistService;

    @PostMapping("/logout")
    public ResponseEntity<?> logout(jakarta.servlet.http.HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (org.springframework.util.StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            String jwt = bearerToken.substring(7);
            // Blacklist for 1 day (or token expiration time logically, but 1 day is safe
            // default matching jwt exp)
            long expiration = 86400000;
            tokenBlacklistService.blacklistToken(jwt, expiration);
            return ResponseEntity.ok("Logged out successfully");
        }
        return ResponseEntity.badRequest().body("No token provided");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            return ResponseEntity.ok(userService.login(loginRequest));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error: Invalid email or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody com.optiroute.dto.RegisterRequest registerRequest) {
        System.out.println("Registration request received for email: " + registerRequest.getEmail());
        try {
            String result = userService.registerUser(registerRequest);
            System.out.println("Registration successful for: " + registerRequest.getEmail());
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            System.err.println("Registration failed (Runtime): " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Registration failed (Unexpected): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }

    @GetMapping("/security-question/{email:.+}")
    public ResponseEntity<String> getSecurityQuestion(@PathVariable String email) {
        try {
            return ResponseEntity.ok(userService.getSecurityQuestion(email));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody com.optiroute.dto.ResetPasswordRequest request) {
        try {
            return ResponseEntity.ok(userService.resetPassword(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
