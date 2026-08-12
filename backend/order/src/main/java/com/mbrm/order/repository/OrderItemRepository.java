package com.mbrm.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mbrm.order.entity.OrderItem;

public interface OrderItemRepository
        extends JpaRepository<OrderItem, Long> {
}