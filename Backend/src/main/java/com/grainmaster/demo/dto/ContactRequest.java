package com.grainmaster.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContactRequest {
      @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100)
    private String name;
 
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    private String email;
 
    private String phone;
 
    @NotBlank(message = "Subject is required")
    @Size(max = 200)
    private String subject;
 
    @NotBlank(message = "Message is required")
    @Size(min = 10, max = 2000, message = "Message must be 10–2000 characters")
    private String message;
}
