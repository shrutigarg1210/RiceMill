package com.grainmaster.demo.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
 
@Data
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;
 
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    private String email;
 
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
 
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number")
    private String phone;
}