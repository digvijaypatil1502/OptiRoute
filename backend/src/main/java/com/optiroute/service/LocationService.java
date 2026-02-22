package com.optiroute.service;

import com.optiroute.model.Location;
import com.optiroute.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    // @Cacheable(value = "locations", key = "#name.toLowerCase()")
    public Optional<Location> findByNameIgnoreCase(String name) {
        return locationRepository.findByNameIgnoreCase(name);
    }

    // Caching list search results might be tricky if the pattern varies widely,
    // but specific common searches could theoretically benefit.
    // For now, per requirements, we cache "read-heavy location data".
    // Individual city lookup is definitely read-heavy for routing.
    // We can also cache the "containing" search if it's used for autocomplete,
    // but let's stick to the strict "read-heavy" data like city details.

    public List<Location> findByNameIgnoreCaseContaining(String name) {
        return locationRepository.findByNameIgnoreCaseContaining(name);
    }

    @org.springframework.cache.annotation.CacheEvict(value = "locations", key = "#location.name.toLowerCase()")
    public Location save(Location location) {
        return locationRepository.save(location);
    }

    public synchronized Location findByNameOrCreate(String name) {
        return findByNameIgnoreCase(name)
                .orElseGet(() -> {
                    try {
                        Location newLoc = new Location();
                        newLoc.setName(name);
                        newLoc.setType(com.optiroute.model.LocationType.CITY);
                        return save(newLoc);
                    } catch (org.springframework.dao.DataIntegrityViolationException e) {
                        // Concurrency edge case: someone else created it in between
                        return findByNameIgnoreCase(name)
                                .orElseThrow(() -> new RuntimeException(
                                        "Unexpected error retrieving location after concurrency conflict"));
                    }
                });
    }

    public Optional<Location> findById(Long id) {
        return locationRepository.findById(id);
    }

    // Additional method to simply fetch all if needed for valid lists, etc.
    // @Cacheable(value = "locations", key = "'all'")
    // public List<Location> findAll() { return locationRepository.findAll(); }
}
