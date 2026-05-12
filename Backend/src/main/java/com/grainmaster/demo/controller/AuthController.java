package com.grainmaster.demo.controller;

 
import com.grainmaster.demo.dto.*;
import com.grainmaster.demo.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
 
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
 
    private final AuthService authService;
 
    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest req) {
        AuthResponse auth = authService.register(req);
        return ResponseEntity.ok(ApiResponse.ok("Account created successfully!", auth));
    }
 
    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req) {
        AuthResponse auth = authService.login(req);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", auth));
    }
 
    // GET /api/auth/profile
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<?>> profile(Authentication auth) {
        var user = authService.getProfile(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok("Profile fetched", user));
    }
}
 