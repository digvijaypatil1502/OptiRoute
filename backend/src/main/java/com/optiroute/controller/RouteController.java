package com.optiroute.controller;

import com.optiroute.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "*")
public class RouteController {

    @Autowired
    private RouteService routeService;

    @GetMapping("/suggest")
    public ResponseEntity<?> suggestRoutes(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam(defaultValue = "0.5") Double timeWeight,
            @RequestParam(defaultValue = "0.5") Double costWeight) {
        try {
            // Validate weights
            if (Math.abs((timeWeight + costWeight) - 1.0) > 0.001) {
                return ResponseEntity.badRequest().body("Error: Sum of weights must be 1.0");
            }
            if (timeWeight < 0 || timeWeight > 1 || costWeight < 0 || costWeight > 1) {
                return ResponseEntity.badRequest().body("Error: Weights must be between 0 and 1");
            }

            System.out.println(
                    "Searching routes for: " + from + " -> " + to + " [T: " + timeWeight + ", C: " + costWeight + "]");
            return ResponseEntity.ok(routeService.getSuggestions(from, to, timeWeight, costWeight));
        } catch (Exception e) {
            System.out.println("Error searching routes: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @Autowired
    private com.optiroute.repository.UserRepository userRepository;

    @GetMapping("/debug/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
