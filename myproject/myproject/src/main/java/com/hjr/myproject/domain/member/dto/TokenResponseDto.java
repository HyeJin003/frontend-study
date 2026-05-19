package com.hjr.myproject.domain.member.dto;
// 토큰 응답

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TokenResponseDto {

    private String accessToken;
    private String refreshToken;

}
