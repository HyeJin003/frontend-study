package com.hjr.myproject.domain.friendship.dto;

import com.hjr.myproject.domain.friendship.entity.Friendship;
import com.hjr.myproject.domain.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class FriendshipResponse {


    private Long id;
    private String friendNickname;
    private String friendBio;
    private Friendship.FriendshipStatus status;
    private LocalDateTime createdAt;

    public static FriendshipResponse from(Friendship friendship , Member member){
        return FriendshipResponse.builder()
                .id(friendship.getId())
                .friendNickname(member.getNickname())
                .friendBio(member.getBio())
                .status(friendship.getStatus())
                .createdAt(friendship.getCreatedAt())
                .build();
    }
}