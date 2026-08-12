package com.mbrm.product.exception;

import org.springframework.http.HttpStatus;

public class InsufficientStockException
        extends BusinessException {

    public InsufficientStockException() {

        super(HttpStatus.CONFLICT,
                ErrorCode.INSUFFICIENT_STOCK);
    }
}