package com.grainmaster.demo.service;

import com.grainmaster.demo.dto.ContactRequest;
import com.grainmaster.demo.Model.Contact;
import com.grainmaster.demo.Repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContactService {

    private final ContactRepository contactRepository;

    public Contact saveContact(ContactRequest request) {
        Contact contact = Contact.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .subject(request.getSubject())
                .message(request.getMessage())
                .build();
        Contact saved = contactRepository.save(contact);
        log.info("Contact message saved from: {}", saved.getEmail());
        return saved;
    }

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public Contact markAsRead(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found: " + id));
        contact.setStatus(Contact.ContactStatus.READ);
        return contactRepository.save(contact);
    }
}
