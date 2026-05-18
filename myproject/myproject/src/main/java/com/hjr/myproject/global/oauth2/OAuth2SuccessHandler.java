package com.hjr.myproject.global.oauth2;

import com.hjr.myproject.domain.member.entity.Member;
import com.hjr.myproject.domain.member.repository.MemberRepository;
import com.hjr.myproject.global.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final MemberRepository memberRepository;
    private final JwtProvider jwtProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {


        String email = authentication.getName();

        // 2. DB에서 회원 조회
        Member member = memberRepository.findByEmail(email)
                .orElseThrow();
        // 3. JWT 발급
        String accessToken = jwtProvider.generateAccessToken(
                member.getEmail(), member.getRole().name());
        String refreshToken =  jwtProvider.generateRefreshToken(member.getEmail());

        // 4. 응답에 토큰 담기
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write( "{\"accessToken\":\"" + accessToken + "\"," +
                "\"refreshToken\":\"" + refreshToken + "\"}");

    }
}
//
//해야 할 것
//
//  1. 로그인한 사람 이메일 꺼내기
//  2. DB에서 회원 조회
//  3. JWT 발급 (Access + Refresh)
//  4. 클라이언트한테 토큰 전달
//