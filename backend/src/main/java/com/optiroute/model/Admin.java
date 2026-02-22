package com.optiroute.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "admins")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String password;

    @Column
    private String mobileNumber;

    // Default constructor
    public Admin() {
    }

    public Admin(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
