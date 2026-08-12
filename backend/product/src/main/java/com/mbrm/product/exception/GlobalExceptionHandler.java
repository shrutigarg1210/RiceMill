package com.mbrm.product.exception;

import jakarta.servlet.http.HttpServletRequest;

import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.support.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
        @ExceptionHandler(BusinessException.class)
public ResponseEntity<ApiError> handleBusinessException(
        BusinessException ex,
        HttpServletRequest request) {

    String traceId = UUID.randomUUID().toString();

    log.error("TraceId={} Business Exception", traceId, ex);

    ApiError error =
            ApiError.builder()
                    .timestamp(LocalDateTime.now())
                    .status(ex.getStatus().value())
                    .error(ex.getStatus().getReasonPhrase())
                    .message(ex.getMessage())
                    .path(request.getRequestURI())
                    .method(request.getMethod())
                    .traceId(traceId)
                    .build();

    return ResponseEntity
            .status(ex.getStatus())
            .body(error);
}
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ApiError> handleValidation(
        MethodArgumentNotValidException ex,
        HttpServletRequest request) {

    List<String> errors =
            ex.getBindingResult()
                    .getFieldErrors()
                    .stream()
                    .map(field ->
                            field.getField() +
                            " : " +
                            field.getDefaultMessage())
                    .toList();

    ApiError response =
            ApiError.builder()
                    .timestamp(LocalDateTime.now())
                    .status(400)
                    .error("Validation Failed")
                    .message("Validation Error")
                    .validationErrors(errors)
                    .path(request.getRequestURI())
                    .method(request.getMethod())
                    .traceId(UUID.randomUUID().toString())
                    .build();

    return ResponseEntity.badRequest().body(response);
}

@ExceptionHandler(Exception.class)
public ResponseEntity<ApiError> handleException(
        Exception ex,
        HttpServletRequest request) {

    String traceId = UUID.randomUUID().toString();

    log.error("TraceId={} Unexpected Exception", traceId, ex);

    ApiError error =
            ApiError.builder()
                    .timestamp(LocalDateTime.now())
                    .status(500)
                    .error("Internal Server Error")
                    .message("Something went wrong. Contact support with Trace ID: " + traceId)
                    .path(request.getRequestURI())
                    .method(request.getMethod())
                    .traceId(traceId)
                    .build();

    return ResponseEntity.internalServerError()
            .body(error);
}
}