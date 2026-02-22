package com.optiroute.repository;

import com.optiroute.model.DirectRoute;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DirectRouteRepository extends JpaRepository<DirectRoute, Long> {
    List<DirectRoute> findByFromLocationAndToLocation(com.optiroute.model.Location fromLocation,
            com.optiroute.model.Location toLocation);
}
