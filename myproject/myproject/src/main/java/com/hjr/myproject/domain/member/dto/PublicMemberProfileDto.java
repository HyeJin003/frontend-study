package com.hjr.myproject.domain.member.dto;

import com.hjr.myproject.domain.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class PublicMemberProfileDto {

    private Long id;
    private String nickname;
    private String profileImage;
    private  String bio;
    private LocalDateTime createdAt;

    public static PublicMemberProfileDto from(Member member){

        return new PublicMemberProfileDto(

                member.getId(),
                member.getNickname(),
                member.getProfileImage(),
                member.getBio(),
                member.getCreatedAt()
                );
    }


}
