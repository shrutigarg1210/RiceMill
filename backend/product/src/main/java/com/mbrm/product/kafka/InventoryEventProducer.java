package com.mbrm.product.kafka;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InventoryEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public void stockUpdated(Long productId, String quantity) {
        kafkaTemplate.send(
                "inventory-updated",
                productId + ":" + quantity
        );
    }
}