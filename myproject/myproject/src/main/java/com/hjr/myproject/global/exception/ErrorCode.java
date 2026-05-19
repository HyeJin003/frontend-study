package com.hjr.myproject.global.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {

    DUPLICATE_EMAIL(409, "이미 사용 중인 이메일입니다"),
    INVALID_PASSWORD(401, "비밀번호가 올바르지 않습니다"),
    USER_NOT_FOUND(404, "존재하지 않는 사용자입니다"),
    INVALID_TOKEN(401, "유효하지 않은 토큰입니다"),
    EXPIRED_TOKEN(401, "만료된 토큰입니다");

    private final int status;
    private final String message;

    ErrorCode(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
