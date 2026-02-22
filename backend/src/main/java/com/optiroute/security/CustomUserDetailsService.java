package com.optiroute.security;

import com.optiroute.model.User;
import com.optiroute.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.optiroute.model.Admin;
import com.optiroute.repository.AdminRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        System.out.println("CustomUserDetailsService: Attempting to load user: " + identifier);

        // Try finding admin by username
        Optional<Admin> adminOpt = adminRepository.findByUsername(identifier);
        if (adminOpt.isPresent()) {
            System.out.println("Found ADMIN with username: " + identifier);
            Admin admin = adminOpt.get();
            List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
            return new org.springframework.security.core.userdetails.User(admin.getUsername(), admin.getPassword(),
                    authorities);
        }

        // Try finding admin by email
        Optional<Admin> adminEmailOpt = adminRepository.findByEmail(identifier);
        if (adminEmailOpt.isPresent()) {
            System.out.println("Found ADMIN with email: " + identifier);
            Admin admin = adminEmailOpt.get();
            List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
            return new org.springframework.security.core.userdetails.User(admin.getEmail(), admin.getPassword(),
                    authorities);
        }

        // Try finding user by email
        Optional<User> userEmailOpt = userRepository.findByEmail(identifier);
        if (userEmailOpt.isPresent()) {
            System.out.println("Found USER with email: " + identifier);
            User user = userEmailOpt.get();
            List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
            return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),
                    authorities);
        }

        // Try finding user by username
        Optional<User> userOpt = userRepository.findByUsername(identifier);
        if (userOpt.isPresent()) {
            System.out.println("Found USER with username: " + identifier);
            User user = userOpt.get();
            List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
            // We still return email as the username for consistency in token subject
            return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),
                    authorities);
        }

        System.out.println("User/Admin NOT FOUND: " + identifier);
        throw new UsernameNotFoundException("User or Admin not found with identifier: " + identifier);
    }
}
