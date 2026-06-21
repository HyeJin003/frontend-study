package com.hjr.myproject.domain.post.dto;

import com.hjr.myproject.domain.post.entity.PostLike;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostLikeResponse {


    private long likeCount;
    private long dislikeCount;


}
