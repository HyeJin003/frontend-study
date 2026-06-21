package com.hjr.myproject.domain.member.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateProfileRequestDto {



    @Size(min=2 , max=20, message = "닉네임은 2~20자 사이여야 합니다. ")
    private  String nickname;


    @Size(max=200, message = "한마디는 200자 이내로 입력해주세요")
    private String bio;
}
