package com.optiroute.controller;

import com.optiroute.model.DirectRoute;
import com.optiroute.model.User;
import com.optiroute.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String token = adminService.login(
                    loginRequest.get("username"),
                    loginRequest.get("password"));

            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "role", "ADMIN"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @GetMapping("/routes")
    public ResponseEntity<List<DirectRoute>> getRoutes(@RequestParam(required = false) String date) {
        // If date is provided, filter. Otherwise return all.
        // For simplicity of "Routes Today", frontend can pass today's date.
        // Here we just return all for now or filter in memory if needed.
        List<DirectRoute> routes = adminService.getAllRoutes();
        if (date != null) {
            LocalDate filterDate = LocalDate.parse(date);
            routes = routes.stream()
                    .filter(r -> r.getDate() != null && r.getDate().isEqual(filterDate))
                    .collect(Collectors.toList());
        }
        return ResponseEntity.ok(routes);
    }

    @PostMapping("/routes")
    public ResponseEntity<DirectRoute> addRoute(@RequestBody DirectRoute route) {
        return ResponseEntity.ok(adminService.addRoute(route));
    }

    @DeleteMapping("/routes/{id}")
    public ResponseEntity<?> deleteRoute(@PathVariable Long id) {
        adminService.deleteRoute(id);
        return ResponseEntity.ok("Route deleted successfully");
    }

    @PutMapping("/routes/{id}/operator")
    public ResponseEntity<DirectRoute> assignOperator(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String operator = body.get("operator");
        return ResponseEntity.ok(adminService.assignOperator(id, operator));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getAdminProfile() {
        try {
            String username = org.springframework.security.core.context.SecurityContextHolder.getContext()
                    .getAuthentication().getName();
            return ResponseEntity.ok(adminService.getAdminProfile(username));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching profile: " + e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateAdminProfile(@RequestBody com.optiroute.dto.UpdateProfileRequest request) {
        try {
            String username = org.springframework.security.core.context.SecurityContextHolder.getContext()
                    .getAuthentication().getName();
            return ResponseEntity.ok(adminService.updateAdminProfile(username, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile: " + e.getMessage());
        }
    }

    @PostMapping("/routes/{id}/stops")
    public ResponseEntity<?> addStop(@PathVariable Long id, @RequestBody com.optiroute.dto.AddStopRequest request) {
        try {
            adminService.addStopToRoute(id, request.getLocationName(), request.getLat(), request.getLon(),
                    request.getOrder(), request.getDistKm(), request.getTimeMins());
            return ResponseEntity.ok("Stop added successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding stop: " + e.getMessage());
        }
    }

}
