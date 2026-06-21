package com.hjr.myproject.domain.guestbook.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GuestbookRequestDto {

    private String content;

    @JsonProperty("isAnonymous")
    private boolean isAnonymous;
}
