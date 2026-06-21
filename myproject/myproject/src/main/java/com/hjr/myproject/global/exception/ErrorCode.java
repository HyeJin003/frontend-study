package com.hjr.myproject.global.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {

    DUPLICATE_EMAIL(409, "이미 사용 중인 이메일입니다"),
    INVALID_PASSWORD(401, "비밀번호가 올바르지 않습니다"),
    USER_NOT_FOUND(404, "존재하지 않는 사용자입니다"),
    INVALID_TOKEN(401, "유효하지 않은 토큰입니다"),
    EXPIRED_TOKEN(401, "만료된 토큰입니다"),
    WRONG_PASSWORD(401, "현재 비밀번호가 올바르지않습니다"),
    SOCIAL_LOGIN_MEMBER(400, "소셜 로그인 회원은 비밀번호를 변경할 수 없습니다."),
    PASSWORD_NOT_MATCH(400, "새 비밀번호가 일치하지 않습니다"),
    GUESTBOOK_NOT_FOUND(404, "존재하지 않는 방명록입니다"),
    UNAUTHORIZED_ACCESS(403, "삭제 권한이 없습니다"),
    POST_NOT_FOUND(404, "게시글을 찾을 수 없습니다"),
    POST_ACCESS_DENIED(403, "비공개 게시글입니다"),
    POST_FORBIDDEN(403, "작성자만 수정/삭제할 수 있습니다"),
    COMMENT_NOT_FOUND(404, "댓글을 찾을 수 없습니다"),
    COMMENT_FORBIDDEN(403, "작성자만 삭제할 수 있습니다");

    private final int status;
    private final String message;

    ErrorCode(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
