package  com.mbrm.auth.controller;


import com.mbrm.auth.dto.*;
import com.mbrm.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PatchMapping("/users/{id}/make-admin")
    public ResponseEntity<Void> makeAdmin(@PathVariable Long id) { 
        authService.makeAdmin(id); 
        return ResponseEntity.ok().build(); 
    }
}