package com.mbrm.auth.exception;

public class BadRequestException extends BusinessException {

    public BadRequestException(String message) {

        super(ErrorCode.BAD_REQUEST);

    }
}