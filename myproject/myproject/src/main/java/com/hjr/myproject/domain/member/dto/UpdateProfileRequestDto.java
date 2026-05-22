package com.hjr.myproject.domain.member.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateProfileRequestDto {


    @NotBlank
    @Size(min=2 , max=20, message = "닉네임은 2~20자 사이여야 합니다. ")
    private  String nickname;
}
