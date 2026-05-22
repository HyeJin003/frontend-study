package com.hjr.myproject.domain.member.dto;


import com.hjr.myproject.domain.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class MemberResponseDto {

    private  Long id;
    private String email;
    private String nickname;
    private Member.AuthProvider provider;
    private LocalDateTime createdAt;

    public  static MemberResponseDto from ( Member member){

        return new MemberResponseDto( member.getId(), member.getEmail(),member.getNickname(), member.getProvider() ,  member.getCreatedAt());
    }

}
