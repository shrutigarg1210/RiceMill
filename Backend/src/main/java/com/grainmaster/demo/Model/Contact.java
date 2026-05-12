package com.grainmaster.demo.Model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "contacts")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

     @Column(nullable = false)
    private String name;
 
    @Column(nullable = false)
    private String email;
 
    private String phone;
 
    @Column(nullable = false)
    private String subject;
 
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;
 
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ContactStatus status = ContactStatus.NEW;
 
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
 
    public enum ContactStatus {
        NEW, READ, REPLIED
    }
}
