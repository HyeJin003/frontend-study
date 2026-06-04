package com.hjr.myproject.domain.guestbook.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import com.hjr.myproject.domain.guestbook.entity.Guestbook;
import java.time.LocalDateTime;


@Getter
@Builder
@AllArgsConstructor
public class GuestbookResponseDto{


    private Long id;
    private String writerNickname;
    private String content;
    private LocalDateTime createdAt;

    public static GuestbookResponseDto from(Guestbook guestbook) {
        return GuestbookResponseDto.builder()
                .id(guestbook.getId())
                .writerNickname(guestbook.isAnonymous() ? "익명" : guestbook.getWriter().getNickname())
                .content(guestbook.getContent())
                .createdAt(guestbook.getCreatedAt())
                .build();
    }
}
