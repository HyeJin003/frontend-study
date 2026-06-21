package com.hjr.myproject.domain.post.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostCreateRequest {

    private String title;
    private String content;

    @JsonProperty("isPublic")
    private boolean isPublic;

}


// 글 작성시 보내야 할거 글쓰는 사람의 아이디?
// ,제목, 내용 ,공개 / 비공개 , 본사람 횟수, 만든 날짜, 수정 날짜