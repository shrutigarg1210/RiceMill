package com.mbrm.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import com.mbrm.payment.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
   Optional<Payment> findByProviderOrderId(String providerOrderId);
   List<Payment> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    
}
