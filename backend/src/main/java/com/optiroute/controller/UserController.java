package com.optiroute.controller;

import com.optiroute.dto.UpdateProfileRequest;
import com.optiroute.dto.UserProfileDto;
import com.optiroute.service.UserService;
import com.optiroute.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // Helper to get email from Security Context
    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName(); // In our case, this is the email/username from CustomUserDetailsService
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        try {
            String email = getCurrentUserEmail();
            return ResponseEntity.ok(userService.getUserProfile(email));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching profile: " + e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody UpdateProfileRequest request) {
        try {
            String email = getCurrentUserEmail();
            return ResponseEntity.ok(userService.updateUserProfile(email, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile: " + e.getMessage());
        }
    }

    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteUserProfile() {
        try {
            String email = getCurrentUserEmail();
            userService.deleteUserProfile(email);
            return ResponseEntity.ok("Account deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting account: " + e.getMessage());
        }
    }
}
