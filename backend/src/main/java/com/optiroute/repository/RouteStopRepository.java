package com.optiroute.repository;

import com.optiroute.model.RouteStop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RouteStopRepository extends JpaRepository<RouteStop, Long> {
    List<RouteStop> findByLocationId(Long locationId);
}
