package com.grainmaster.demo.service;

 
import com.grainmaster.demo.Config.JwtUtil;
import com.grainmaster.demo.dto.*;
import com.grainmaster.demo.Model.User;
import com.grainmaster.demo.Repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.aspectj.lang.annotation.Before;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
 
@Service
@RequiredArgsConstructor
public class AuthService {
 
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
 
    //Registration — step 1: check duplicate email
// Before creating anything, we check if the email is already in the database. existsByEmail() fires a SELECT COUNT(*) — 
// cheaper than loading the full User object. If the email exists, we throw an exception immediately. The controller's 
// @ExceptionHandler catches this and returns a 400 Bad Request to the client. Never save first and let the database unique 
// constraint fail — that gives a cryptic SQL error instead of a clean message.
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered. Please login.");
        }
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(User.Role.CUSTOMER)
                .build();
        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole().name(), saved.getId());
        return AuthResponse.builder()
                .token(token).name(saved.getName())
                .email(saved.getEmail()).role(saved.getRole().name())
                .userId(saved.getId()).build();
    }
 
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("No account found with this email."));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect password.");
        }
        if (!user.isActive()) throw new RuntimeException("Account is deactivated.");
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return AuthResponse.builder()
                .token(token).name(user.getName())
                .email(user.getEmail()).role(user.getRole().name())
                .userId(user.getId()).build();
    }
 
    public User getProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
 