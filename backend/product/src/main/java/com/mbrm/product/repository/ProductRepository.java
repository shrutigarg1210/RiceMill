package com.mbrm.product.repository;

import com.mbrm.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByVariety(String variety);

    List<Product> findByActiveTrue();

    List<Product> findByVarietyContainingIgnoreCase(String keyword);
}