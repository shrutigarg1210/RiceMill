package com.grainmaster.demo.controller;

import com.grainmaster.demo.dto.ApiResponse;
import com.grainmaster.demo.dto.ContactRequest;
import com.grainmaster.demo.Model.Contact;
import com.grainmaster.demo.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    // POST /api/contacts
    @PostMapping
    public ResponseEntity<ApiResponse<Contact>> submitContact(
            @Valid @RequestBody ContactRequest request) {
        Contact saved = contactService.saveContact(request);
        return ResponseEntity.ok(ApiResponse.ok("Message received! We'll reply shortly.", saved));
    }

    // GET /api/contacts (admin)
    @GetMapping
    public ResponseEntity<ApiResponse<List<Contact>>> getAllContacts() {
        return ResponseEntity.ok(ApiResponse.ok("Contacts fetched", contactService.getAllContacts()));
    }

    // PUT /api/contacts/{id}/read
    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Contact>> markAsRead(@PathVariable Long id) {
        Contact updated = contactService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.ok("Marked as read", updated));
    }
}
