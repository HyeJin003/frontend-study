package com.hjr.myproject.config;

import com.hjr.myproject.global.jwt.JwtAuthenticationFilter;
import com.hjr.myproject.global.oauth2.CustomOAuth2UserService;
import com.hjr.myproject.global.oauth2.OAuth2FailureHandler;
import com.hjr.myproject.global.oauth2.OAuth2SuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration // "이 클래스는 Spring 설정 파일이야" 라고 선언
@RequiredArgsConstructor
public class SecurityConfig {


    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final OAuth2FailureHandler oAuth2FailureHandler;

    @Bean
    // SecurityFilterChain  모든 HTTP 요청이 컨트롤러에 도달하기 전에 통과하는 보안 검사 목록
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
    http   // 1. CSRF 비활성화 (JWT 쓰니까 필요 없음) 내가 모르는 사이에 내 계정으로 요청이 날아가는 공격
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // 세션을 어떻게 관리할지 설정하는 메서드
            // // "세션을 어떻게 다룰지 정해줘"
            //STATELESS  → 세션 아예 안 만들어 (JWT 방식)
            .authorizeHttpRequests(auth -> auth
            //HTTP 요청마다 "이 URL은 누가 접근할 수 있어?" 규칙
            .requestMatchers(
                    "/api/auth/signup",
                    "/api/auth/login",
                    "/api/auth/refresh",
                    "/oauth2/**",
                    "/login/oauth2/**"
            ).permitAll()// 누구나 접근 가능
            .anyRequest().authenticated()  // 나머지는 로그인 필요
     )
              .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo ->
                        userInfo.userService(customOAuth2UserService))
                .successHandler(oAuth2SuccessHandler)
                .failureHandler(oAuth2FailureHandler)
        )
                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);
        return http.build();

    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


}
