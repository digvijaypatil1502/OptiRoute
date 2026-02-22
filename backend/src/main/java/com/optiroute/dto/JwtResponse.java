package com.optiroute.dto;

public class JwtResponse {
    private String token;

    private String role;

    // No-args constructor
    public JwtResponse() {
    }

    // All-args constructor
    public JwtResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }

    // Getter
    public String getToken() {
        return token;
    }

    // Setter
    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}