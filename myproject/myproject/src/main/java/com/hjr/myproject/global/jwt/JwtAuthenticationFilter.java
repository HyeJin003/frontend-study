package com.hjr.myproject.global.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;


@RequiredArgsConstructor
@Component // @Component = "Spring아, 이 클래스 객체로 만들어서 관리해줘"

public class JwtAuthenticationFilter extends OncePerRequestFilter {


    private  final JwtProvider jwtProvider;
//    private final Filter filter;
// 비어있는 메서드 -> 자식이 채워줘

    @Override
    protected void doFilterInternal(HttpServletRequest request , HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException{
        // 1번: Authorization 헤더 꺼내기
        String authHeader =  request.getHeader("Authorization");

        // 2번: 헤더 없거나 Bearer로 시작 안 하면 통과
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return ;
        }

        // 3번: "Bearer " 제거 → 순수 토큰 추출
        String token = authHeader.substring(7);


        // 4번: 토큰 유효한지 검사
        if(!jwtProvider.validateToken(token)){
            filterChain.doFilter(request,response);
            return;

        }
        // 5번: 이메일 꺼내기
        String email = jwtProvider.getEmail(token);
        // 인증 정보 객체 만들기
        UsernamePasswordAuthenticationToken authentication =  new UsernamePasswordAuthenticationToken(email , null , List.of());
        // SecurityContext에 등록
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 6번: 다음 필터로 넘기기
         filterChain.doFilter(request, response);
        }

}
