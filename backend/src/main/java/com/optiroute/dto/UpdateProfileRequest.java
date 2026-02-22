package com.optiroute.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank(message = "Username cannot be empty")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Mobile number cannot be empty")
    @Pattern(regexp = "^\\d{10}$", message = "Mobile number must be exactly 10 digits")
    private String mobileNumber;

    // Optional for updates
    @Size(min = 6, message = "Password must be at least 6 characters if provided")
    private String password;
    // Email update is kept separate or disabled for now due to complexity
}
