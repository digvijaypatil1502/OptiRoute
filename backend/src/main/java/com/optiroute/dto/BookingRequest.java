package com.optiroute.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingRequest {
    private Long routeId;
    private LocalDate journeyDate;
    private String fromCity;
    private String toCity;
}
