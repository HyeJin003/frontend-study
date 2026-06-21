package com.hjr.myproject.domain.post.dto;




//글 조회시 서버-> 클라이언트


import com.hjr.myproject.domain.post.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponse {

    private Long id;
    private String title;
    private String content;
    private boolean isPublic;
    private int viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String nickname;

    public  static  PostResponse from (Post post){
    return new PostResponse(post.getId() , post.getTitle(), post.getContent(), post.isPublic(), post.getViewCount(), post.getCreatedAt(),post.getUpdatedAt(),post.getMember().getNickname());
    }

}
