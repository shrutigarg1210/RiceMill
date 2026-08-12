package com.mbrm.product.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class BusinessException extends RuntimeException {

    protected final HttpStatus status;

    private final ErrorCode errorCode;

    public BusinessException(HttpStatus status,
                             ErrorCode errorCode) {

        super(errorCode.getMessage());

        this.status = status;
        this.errorCode = errorCode;
    }
}