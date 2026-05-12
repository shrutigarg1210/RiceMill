package com.grainmaster.demo.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grainmaster.demo.Model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
 List<Product> findByAvailableTrue();
    Optional<Product> findByName(String name);
    List<Product> findByGrade(String grade);
    
}
