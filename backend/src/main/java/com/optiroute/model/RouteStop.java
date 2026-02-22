package com.optiroute.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "route_stops", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "direct_route_id", "stop_order" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "direct_route_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private DirectRoute directRoute;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(name = "stop_order", nullable = false)
    private Integer stopOrder; // 0 for Start, 1, 2... for stops, N for End

    @Column(name = "dist_from_start_km")
    private Double distFromStartKm;

    @Column(name = "time_from_start_mins")
    private Integer timeFromStartMins;
}
