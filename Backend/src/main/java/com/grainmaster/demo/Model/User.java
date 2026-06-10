////USER.JAVA — MAPS TO THE "USERS" TABLE IN MYSQL
package com.grainmaster.demo.Model;

import java.security.Security;
import java.time.LocalDateTime;

import javax.print.attribute.standard.MediaSize.Other;

import org.hibernate.Hibernate;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity //marks this class as a database table
@Table(name = "users")
@Data 
@Builder
 @NoArgsConstructor @AllArgsConstructor

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //tells Hibernate to let MySQL handle ID generation using AUTO_INCREMENT. 
    // So when you insert a new user, you don't provide an ID — MySQL assigns the
    //  next available integer automatically.

//  Other strategies: SEQUENCE (PostgreSQL), TABLE (database-agnostic but slow), 
// AUTO (Hibernate decides). IDENTITY is correct for MySQL.
    @Column(nullable = false)
    private String name;
 
    @Column(nullable = false, unique = true)
    private String email;
 
    @Column(nullable = false)
    private String password; // BCrypt hashed
//  When a user registers, the service layer calls passwordEncoder.encode(rawPassword) 
//  and stores the result here — something like $2a$10$xyz.... 
//  During login, Spring Security calls passwordEncoder.matches(rawPassword, storedHash) 
//  — it never decodes the hash, it re-hashes and compares.
    @Column(nullable = false)
    private String phone;
    //@Enumerated — stores enum as string in DB ⭐

    //EnumType.STRING → stores "USER" or "ADMIN" as text in MySQL. Readable, safe.
    //EnumType.ORDINAL → stores 0 or 1 (the position in the enum). 
    //Dangerous — if you add a new enum value in the middle, all existing data is wrong.
    //Always use EnumType.STRING. An interviewer will specifically ask this.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)

    @Builder.Default
    private Role role = Role.CUSTOMER;
 
    @Column(name = "is_active")
    @Builder.Default
    private boolean active = true;
//  @PrePersist — auto-set timestamp before saving
// @PrePersist is a JPA lifecycle callback. Hibernate calls the annotated method automatically just before inserting a new record into the database. So you never manually set createdAt — it's always set to the current time at insert. Similarly @PreUpdate can auto-set an updatedAt field before every UPDATE.
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
 
    public enum Role { CUSTOMER, ADMIN }
}
