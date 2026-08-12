package com.mbrm.auth.exception;

public class OrderNotFound extends BusinessException {

    public OrderNotFound() {
        super(ErrorCode.ORDER_NOT_FOUND);
    }
}