package com.hjr.myproject.global.exception;

import com.hjr.myproject.global.common.ApiResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ApiResponse<Void> handleCustomException(CustomException error) {
        return ApiResponse.error(error.getMessage());
    }
}
