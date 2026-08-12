package com.mbrm.product.exception;

import org.springframework.http.HttpStatus;

public class UnauthorizedException
        extends BusinessException {

    public UnauthorizedException() {

        super(HttpStatus.UNAUTHORIZED,
                ErrorCode.INVALID_CREDENTIALS);
    }
}