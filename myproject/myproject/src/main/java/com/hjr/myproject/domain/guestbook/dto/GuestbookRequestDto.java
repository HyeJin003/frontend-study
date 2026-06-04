package com.hjr.myproject.domain.guestbook.dto;


import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@NoArgsConstructor
public class GuestbookRequestDto { // 프론트에서 서버로 보내는 데이터



  private String content;
  private boolean isAnonymous;

}
