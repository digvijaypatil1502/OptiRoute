package com.optiroute.dto;

public class ResetPasswordRequest {
    private String email;
    private String securityAnswer;
    private String newPassword;

    // Default Constructor
    public ResetPasswordRequest() {
    }

    // All-Args Constructor
    public ResetPasswordRequest(String email, String securityAnswer, String newPassword) {
        this.email = email;
        this.securityAnswer = securityAnswer;
        this.newPassword = newPassword;
    }

    // --- Getters ---
    public String getEmail() {
        return email;
    }

    public String getSecurityAnswer() {
        return securityAnswer;
    }

    public String getNewPassword() {
        return newPassword;
    }

    // --- Setters ---
    public void setEmail(String email) {
        this.email = email;
    }

    public void setSecurityAnswer(String securityAnswer) {
        this.securityAnswer = securityAnswer;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}