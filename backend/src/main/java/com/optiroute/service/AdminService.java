package com.optiroute.service;

import com.optiroute.model.Admin;
import com.optiroute.model.DirectRoute;
import com.optiroute.model.User;
import com.optiroute.repository.AdminRepository;
import com.optiroute.repository.DirectRouteRepository;
import com.optiroute.repository.UserRepository;
import com.optiroute.model.Location;
import com.optiroute.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DirectRouteRepository routeRepository;

    @Autowired
    private LocationService locationService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public String login(String username, String password) {
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);

        // For simplicity as requested, we can also check hardcoded credentials if DB is
        // empty
        if (adminOpt.isEmpty() && "admin".equals(username) && "admin123".equals(password)) {
            // Create default admin if not exists
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            adminRepository.save(admin);
            return jwtTokenProvider.createToken(username, "ROLE_ADMIN");
        }

        if (adminOpt.isPresent()) {
            if (passwordEncoder.matches(password, adminOpt.get().getPassword())) {
                return jwtTokenProvider.createToken(username, "ROLE_ADMIN");
            }
        }

        throw new RuntimeException("Invalid admin credentials");
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    public List<DirectRoute> getAllRoutes() {
        return routeRepository.findAll();
    }

    @org.springframework.cache.annotation.CacheEvict(value = "routes", allEntries = true)
    public DirectRoute addRoute(DirectRoute route) {
        // Resolve From Location
        if (route.getFromLocation() != null) {
            String name = route.getFromLocation().getName();
            Long id = route.getFromLocation().getId();
            Location loc = null;
            if (name != null && !name.isEmpty()) {
                loc = locationService.findByNameOrCreate(name);
            } else if (id != null) {
                loc = locationService.findById(id)
                        .orElseThrow(() -> new RuntimeException("From Location ID not found: " + id));
            }
            if (loc != null)
                route.setFromLocation(loc);
        }

        // Resolve To Location
        if (route.getToLocation() != null) {
            String name = route.getToLocation().getName();
            Long id = route.getToLocation().getId();
            Location loc = null;
            if (name != null && !name.isEmpty()) {
                loc = locationService.findByNameOrCreate(name);
            } else if (id != null) {
                loc = locationService.findById(id)
                        .orElseThrow(() -> new RuntimeException("To Location ID not found: " + id));
            }
            if (loc != null)
                route.setToLocation(loc);
        }

        return routeRepository.save(route);
    }

    @org.springframework.cache.annotation.CacheEvict(value = "routes", allEntries = true)
    public void deleteRoute(Long routeId) {
        routeRepository.deleteById(routeId);
    }

    @org.springframework.cache.annotation.CacheEvict(value = "routes", allEntries = true)
    public DirectRoute assignOperator(Long routeId, String operatorName) {
        DirectRoute route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        route.setOperator(operatorName);
        return routeRepository.save(route);
    }

    public com.optiroute.dto.UserProfileDto getAdminProfile(String username) {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        return new com.optiroute.dto.UserProfileDto(admin.getUsername(), admin.getEmail(), admin.getMobileNumber());
    }

    public String updateAdminProfile(String username, com.optiroute.dto.UpdateProfileRequest request) {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (request.getMobileNumber() != null) { // Allow clearing or setting
            admin.setMobileNumber(request.getMobileNumber());
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            admin.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        adminRepository.save(admin);
        return "Admin profile updated successfully";
    }

    @org.springframework.cache.annotation.CacheEvict(value = "routes", allEntries = true)
    public void addStopToRoute(Long routeId, String locationName, Double lat, Double lon, Integer order, Double distKm,
            Integer timeMins) {
        DirectRoute route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found: " + routeId));

        Location stopLoc = locationService.findByNameIgnoreCase(locationName)
                .orElseGet(() -> {
                    Location newLoc = new Location();
                    newLoc.setName(locationName);
                    // Default type
                    newLoc.setType(com.optiroute.model.LocationType.CITY);
                    newLoc.setLatitude(lat);
                    newLoc.setLongitude(lon);
                    return locationService.save(newLoc);
                });

        // Update lat/lon if existing location didn't have them
        if (stopLoc.getLatitude() == null || stopLoc.getLongitude() == null) {
            stopLoc.setLatitude(lat);
            stopLoc.setLongitude(lon);
            locationService.save(stopLoc);
        }

        // Geo Validation (Bounding Box)
        // Only validate if Start and End locations have coordinates
        Location from = route.getFromLocation();
        Location to = route.getToLocation();

        if (from.getLatitude() != null && from.getLongitude() != null &&
                to.getLatitude() != null && to.getLongitude() != null && lat != null && lon != null) {

            double minLat = Math.min(from.getLatitude(), to.getLatitude());
            double maxLat = Math.max(from.getLatitude(), to.getLatitude());
            double minLon = Math.min(from.getLongitude(), to.getLongitude());
            double maxLon = Math.max(from.getLongitude(), to.getLongitude());

            // Buffer
            double buffer = 0.5; // ~50km buffer

            if (lat < minLat - buffer || lat > maxLat + buffer || lon < minLon - buffer || lon > maxLon + buffer) {
                // For now log warning or throw strict error? Requirement says "Reject invalid
                // locations"
                // Check if it's strictly between? "Must lie within the geographical path or
                // bounding region"
                // Bounding region implies Rectangle.
                throw new RuntimeException("Stop location is outside the route's geographical bounding region.");
            }
        }

        com.optiroute.model.RouteStop stop = new com.optiroute.model.RouteStop();
        stop.setDirectRoute(route);
        stop.setLocation(stopLoc);
        stop.setStopOrder(order);
        stop.setDistFromStartKm(distKm);
        stop.setTimeFromStartMins(timeMins);

        route.getStops().add(stop);
        routeRepository.save(route);
    }
}
