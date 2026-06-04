package com.hjr.myproject.domain.guestbook.controller;

import com.hjr.myproject.domain.guestbook.dto.GuestbookRequestDto;
import com.hjr.myproject.domain.guestbook.dto.GuestbookResponseDto;
import com.hjr.myproject.domain.guestbook.service.GuestbookService;
import com.hjr.myproject.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guestbook")
@RequiredArgsConstructor
public class GuestbookController {

    private final GuestbookService guestbookService;

    @Operation(summary = "방명록 작성")
    @PostMapping("/{nickname}")
    public ResponseEntity<ApiResponse<Void>> write(
            @PathVariable String nickname,
            @RequestHeader("Authorization") String bearerToken,
            @RequestBody GuestbookRequestDto dto) {

        String token = bearerToken.substring(7);
        guestbookService.write(nickname, token, dto);
        return ResponseEntity.ok(ApiResponse.success("방명록 작성 성공", null));
    }

    @Operation(summary = "방명록 조회")
    @GetMapping("/{nickname}")
    public ResponseEntity<ApiResponse<List<GuestbookResponseDto>>> getGuestbooks(
            @PathVariable String nickname) {

        List<GuestbookResponseDto> result = guestbookService.getGusetbooks(nickname);
        return ResponseEntity.ok(ApiResponse.success("방명록 조회 성공", result));
    }

    @Operation(summary = "방명록 삭제")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @RequestHeader("Authorization") String bearerToken) {

        String token = bearerToken.substring(7);
        guestbookService.delete(id, token);
        return ResponseEntity.ok(ApiResponse.success("방명록 삭제 성공", null));
    }
}
