package com.hjr.myproject.domain.member.controller;

import com.hjr.myproject.domain.member.dto.LoginRequestDto;
import com.hjr.myproject.domain.member.dto.MemberResponseDto;
import com.hjr.myproject.domain.member.dto.SignupRequestDto;
import com.hjr.myproject.domain.member.dto.TokenResponseDto;
import com.hjr.myproject.domain.member.entity.Member;
import com.hjr.myproject.domain.member.service.AuthService;
import com.hjr.myproject.global.common.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") // ← "/api/auth" 공통 부분 한 번만 선언
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "회원가입")
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<TokenResponseDto>> signup(@RequestBody @Valid SignupRequestDto dto){
                TokenResponseDto token =  authService.signup(dto);
                return ResponseEntity.ok(ApiResponse.success("회원가입 성공", token));


    }
    //로그인 성공
    @Operation(summary = "로그인")
    @PostMapping("/login")
    public  ResponseEntity<ApiResponse<TokenResponseDto>> login(@RequestBody @Valid LoginRequestDto dto){
            TokenResponseDto token = authService.login(dto);
            return ResponseEntity.ok(ApiResponse.success("로그인 성공" , token));
    }

    @Operation(summary = "토큰 재발급")
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<String>> refresh (@RequestHeader("Authorization") String bearerToken){
        bearerToken = bearerToken.substring(7);
        String newAccessToken = authService.refresh(bearerToken);
        return ResponseEntity.ok(ApiResponse.success("토큰 재발급 성공", newAccessToken));
    }

    @Operation(summary = "로그아웃")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader("Authorization")String bearerToken){
        String accessToken = bearerToken.substring(7);
        authService.logout(accessToken);
    return    ResponseEntity.ok(ApiResponse.success("로그아웃 성공", null));

    }

    @Operation(summary = "내 정보 조회")
    @GetMapping("/me")
    public  ResponseEntity<ApiResponse<MemberResponseDto>> me (@RequestHeader("Authorization")String bearerToken){
        String accessToken = bearerToken.substring(7);
        Member member =   authService.me(accessToken);
        return   ResponseEntity.ok(ApiResponse.success("멤버조회 성공", MemberResponseDto.from(member)));
    }
}
