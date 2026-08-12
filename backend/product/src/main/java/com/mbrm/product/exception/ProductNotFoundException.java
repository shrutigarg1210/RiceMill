package com.mbrm.product.exception;

import org.springframework.http.HttpStatus;

public class ProductNotFoundException extends BusinessException {

    public ProductNotFoundException() {

        super(HttpStatus.NOT_FOUND,
                ErrorCode.PRODUCT_NOT_FOUND);
    }
}