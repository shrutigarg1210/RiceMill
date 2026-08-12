package com.mbrm.auth.exception;


import lombok.Getter;

@Getter
public enum ErrorCode {

    PRODUCT_NOT_FOUND("Product not found"),

    USER_NOT_FOUND("User not found"),

    ORDER_NOT_FOUND("Order not found"),

    PAYMENT_NOT_FOUND("Payment not found"),

    INSUFFICIENT_STOCK("Insufficient stock"),

    INVALID_CREDENTIALS("Invalid credentials"),

    ACCESS_DENIED("Access denied"),

    BAD_REQUEST("Bad request");

    private final String message;

    ErrorCode(String message) {
        this.message = message;
    }
}