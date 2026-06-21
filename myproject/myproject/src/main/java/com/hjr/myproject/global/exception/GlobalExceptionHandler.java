package com.hjr.myproject.global.exception;

import com.hjr.myproject.global.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.lang.reflect.Method;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<Void>> handleCustomException(CustomException error) {
        return ResponseEntity
                .status(error.getErrorCode().getStatus())
                .body(ApiResponse.error(error.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException error){
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.error(error.getBindingResult().getFieldErrors().get(0).getDefaultMessage()));
    }

}
