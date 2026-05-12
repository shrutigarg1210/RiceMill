package com.grainmaster.demo.Config;

import com.grainmaster.demo.Model.Product;
import com.grainmaster.demo.Model.User;
import com.grainmaster.demo.Repository.ProductRepository;
import com.grainmaster.demo.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;


@Configuration
public class DataSeeder {

    @Value("${app.admin.email:}")
private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

     @Bean
    CommandLineRunner seedAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder,ProductRepository productRepository) {
        return args -> {
            if (!userRepository.existsByEmail(adminEmail)) {
                userRepository.save(User.builder()
                    .name("Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .phone("9999999999")
                    .role(User.Role.ADMIN)
                    .build());
                System.out.println("✅ Admin account created: admin@grainmaster.in / admin123");
            }

             if (productRepository.count() == 0) {
                List<Product> products = List.of(
                    Product.builder()
                        .name("Premium Basmati")
                        .grade("Grade A")
                        .origin("Himalayan Foothills")
                        .pricePerKg(new BigDecimal("120.00"))
                        .description("Long-grain aromatic rice with a delicate floral scent and silky texture.")
                        .icon("🌾")
                        .available(true)
                        .stockQuantityMT(new BigDecimal("500.00"))
                        .build(),
 
                    Product.builder()
                        .name("Sona Masoori")
                        .grade("Grade A+")
                        .origin("Haryana")
                        .pricePerKg(new BigDecimal("85.00"))
                        .description("Lightweight, low-starch rice ideal for daily meals and special dishes.")
                        .icon("✨")
                        .available(true)
                        .stockQuantityMT(new BigDecimal("800.00"))
                        .build(),
 
                    Product.builder()
                        .name("Brown Rice")
                        .grade("Organic")
                        .origin("Local Farms")
                        .pricePerKg(new BigDecimal("95.00"))
                        .description("Whole grain goodness with nutty flavor, packed with fiber and nutrients.")
                        .icon("🌿")
                        .available(true)
                        .stockQuantityMT(new BigDecimal("200.00"))
                        .build(),
 
                    Product.builder()
                        .name("Parboiled Rice")
                        .grade("Standard")
                        .origin("Uttar Pradesh")
                        .pricePerKg(new BigDecimal("65.00"))
                        .description("Partially pre-cooked for better nutrition retention and longer shelf life.")
                        .icon("⚡")
                        .available(true)
                        .stockQuantityMT(new BigDecimal("1000.00"))
                        .build(),
 
                    Product.builder()
                        .name("Steam Rice")
                        .grade("Premium")
                        .origin("Haryana")
                        .pricePerKg(new BigDecimal("75.00"))
                        .description("Soft, fluffy grains perfect for biryanis, pulao, and festive cooking.")
                        .icon("💨")
                        .available(true)
                        .stockQuantityMT(new BigDecimal("600.00"))
                        .build(),
 
                    Product.builder()
                        .name("Raw White Rice")
                        .grade("Standard")
                        .origin("Punjab")
                        .pricePerKg(new BigDecimal("55.00"))
                        .description("Classic milled white rice, clean and bright, a staple for every kitchen.")
                        .icon("🍚")
                        .available(true)
                        .stockQuantityMT(new BigDecimal("1500.00"))
                        .build()
                );
 
                productRepository.saveAll(products);
                System.out.println("✅ Products seeded successfully.");
            }
        };
    }
    @Bean
    CommandLineRunner seedProducts(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() == 0) {
                List<Product> products = List.of(
                    Product.builder()
                        .name("Premium Basmati")
                        .grade("Grade A")
                        .origin("Himalayan Foothills")
                        .pricePerKg(new BigDecimal("120.00"))
                        .description("Long-grain aromatic rice with a delicate floral scent and silky texture.")
                        .icon("🌾")
                        .available(true)
                        .stockQuantityMT(new BigDecimal("500.00"))
                        .build(),

                    Product.builder()
                        .name("Sona Masoori")
                        .grade("Grade A+")
                        .origin("Haryana")
                        .pricePerKg(new BigDecimal("85.00"))
                        .description("Lightweight, low-starch rice ideal for daily meals and special dishes.")
                        .icon("✨")
                        .available(true)
                        .stockQuantityMT(new BigDecimal("800.00"))
                        .build(),

                    Product.builder()
                        .name("Brown Rice")
                        .grade("Organic")
                        .origin("Local Farms")
                        .pricePerKg(new BigDecimal("95.00"))
                        .description("Whole grain goodness with nutty flavor, packed with fiber and nutrients.")
                        .icon("🌿")
                        .available(true)
                        .stockQuantityMT(new BigDecimal("200.00"))
                        .build(),

                    Product.builder()
                        .name("Parboiled Rice")
                        .grade("Standard")
                        .origin("Uttar Pradesh")
                        .pricePerKg(new BigDecimal("65.00"))
                        .description("Partially pre-cooked for better nutrition retention and longer shelf life.")
                        .icon("⚡")
                        .available(true)
                        .stockQuantityMT(new BigDecimal("1000.00"))
                        .build(),

                    Product.builder()
                        .name("Steam Rice")
                        .grade("Premium")
                        .origin("Haryana")
                        .pricePerKg(new BigDecimal("75.00"))
                        .description("Soft, fluffy grains perfect for biryanis, pulao, and festive cooking.")
                        .icon("💨")
                        .available(true)
                        .stockQuantityMT(new BigDecimal("600.00"))
                        .build(),

                    Product.builder()
                        .name("Raw White Rice")
                        .grade("Standard")
                        .origin("Punjab")
                        .pricePerKg(new BigDecimal("55.00"))
                        .description("Classic milled white rice, clean and bright, a staple for every kitchen.")
                        .icon("🍚")
                        .available(true)
                        .stockQuantityMT(new BigDecimal("1500.00"))
                        .build()
                );

                productRepository.saveAll(products);
                System.out.println("✅ Products seeded successfully.");
            }
        };
    }
}