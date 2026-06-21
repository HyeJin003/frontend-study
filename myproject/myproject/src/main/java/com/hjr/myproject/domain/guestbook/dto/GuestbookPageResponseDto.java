package com.hjr.myproject.domain.guestbook.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class GuestbookPageResponseDto {



    // 필드 3개 지금 화면에 보여줄거 다음 요청 시작점 다음이 있냐 없냐

     private List<GuestbookResponseDto> guestbooks;
     private Long nextCursor;
     private boolean hasNext;

}
