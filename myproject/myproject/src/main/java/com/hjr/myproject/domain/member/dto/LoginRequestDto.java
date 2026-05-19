package com.hjr.myproject.domain.member.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

//로그인 요청
@Getter
@NoArgsConstructor
public class LoginRequestDto {

    @NotBlank
    @Email
    private String email;

    @NotBlank

    private String password;
}