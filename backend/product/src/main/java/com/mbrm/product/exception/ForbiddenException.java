package com.mbrm.product.exception;

import org.springframework.http.HttpStatus;

public class ForbiddenException
        extends BusinessException {

    public ForbiddenException() {

        super(HttpStatus.FORBIDDEN,
                ErrorCode.ACCESS_DENIED);
    }
}