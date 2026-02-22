package com.optiroute.repository;

import com.optiroute.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {
    Optional<Location> findByNameIgnoreCase(String name);

    java.util.List<Location> findByNameIgnoreCaseContaining(String name);

}
