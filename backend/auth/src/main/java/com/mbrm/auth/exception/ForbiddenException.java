package com.mbrm.auth.exception;

public class ForbiddenException extends BusinessException {

    public ForbiddenException() {

        super(ErrorCode.ACCESS_DENIED);

    }
}