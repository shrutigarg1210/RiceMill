package com.mbrm.order.repository;

import com.mbrm.order.entity.Order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserEmailOrderByCreatedAtDesc(String userEmail);

}
