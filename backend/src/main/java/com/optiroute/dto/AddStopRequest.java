package com.optiroute.dto;

import lombok.Data;

@Data
public class AddStopRequest {
    private String locationName;
    private Double lat;
    private Double lon;
    private Integer order;
    private Double distKm;
    private Integer timeMins;
}
