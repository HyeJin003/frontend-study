package com.hjr.myproject.domain.member.controller;


import com.hjr.myproject.domain.member.dto.ChangePasswordRequestDto;
import com.hjr.myproject.domain.member.dto.MemberResponseDto;
import com.hjr.myproject.domain.member.dto.UpdateProfileRequestDto;
import com.hjr.myproject.domain.member.entity.Member;
import com.hjr.myproject.domain.member.service.MemberService;
import com.hjr.myproject.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;



    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberResponseDto>> getMyInfo(
            @RequestHeader("Authorization") String bearerToken) {
        // 1. bearerToken.substring(7) 로 토큰 추출
     String accessToken =   bearerToken.substring(7);

        // 2. memberService.getMyInfo(token) 호출
//        Member member = memberService.getMyInfo(accessToken);

        MemberResponseDto response = memberService.getMyInfo(accessToken);
        // 3. ApiResponse.success() 로 반환
        return   ResponseEntity.ok(ApiResponse.success("멤버조회 성공", response));
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<MemberResponseDto>> updateProfile(
            @RequestHeader("Authorization") String bearerToken,
            @RequestBody @Valid UpdateProfileRequestDto dto) {

        // 1. bearerToken.substring(7)
        String accessToken = bearerToken.substring(7);
        // 2. memberService.updateProfile(accessToken, dto) 호출
        MemberResponseDto member =  memberService.updateProfile(accessToken, dto);
        // 3. ApiResponse.success() 반환
        return   ResponseEntity.ok(ApiResponse.success("프로필 수정 성공", member));
    }

    //비밀번호 변경
    @PatchMapping("/me/password")
    public  ResponseEntity<ApiResponse<Void>> updatePassword(@RequestHeader("Authorization") String bearerToken
    , @RequestBody @Valid ChangePasswordRequestDto dto){

        // 1. substring(7)
         String accessToken =bearerToken.substring(7);
        // 2. memberService.changePassword(accessToken, dto)
        memberService.changePassword(accessToken, dto);

        return   ResponseEntity.ok(ApiResponse.success("비밀번호 변경성공", null));
    }

    //회원 탈퇴
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteProfile (@RequestHeader("Authorization") String bearerToken, RedirectAttributes redirectAttributes){
        String accessToken =bearerToken.substring(7);
        memberService.withdraw(accessToken);
        return ResponseEntity.ok(ApiResponse.success("회원 탈퇴 성공", null));
    }

}
