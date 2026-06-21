package com.hjr.myproject.domain.comment.dto;

import com.hjr.myproject.domain.comment.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;



@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {

    private Long id;
    private String content;
    private String nickname;
    private LocalDateTime createdAt;


    public static CommentResponse from (Comment comment){
        return new CommentResponse(comment.getId(),  comment.getContent(), comment.getMember().getNickname(), comment.getCreatedAt());
    }

}
