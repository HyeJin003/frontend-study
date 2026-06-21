package com.hjr.myproject.global.jwt;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtProvider {
    @Value("${jwt.secret}")
    private String secretKey;
    @Value("${jwt.access-expiration}")
    private long accessExpiration;
    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;


        // 1. Access Token 생성
        public String generateAccessToken(String email, String role){
            return Jwts.builder()
                .subject(email) //내용설정
                .claim("role", role) //커스텀 클레임
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessExpiration))
                .signWith(getSigningKey()) //키와 알고리즘 설정
                .compact();

    }

    // 2. Refresh Token 생성
        public String generateRefreshToken(String email){
            return Jwts.builder()
                    .subject(email)
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + refreshExpiration))
                    .signWith(getSigningKey())
                    .compact();


    }
    // 3. 토큰 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 4. 이메일 꺼내기
    public String getEmail(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    private SecretKey getSigningKey(){
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}



//  1. 토큰 생성   → 로그인 성공 시 Access + Refresh Token 만들기
//  2. 토큰 검증   → 요청 들어올 때 토큰 유효한지 확인
//  3. 정보 꺼내기 → 토큰에서 이메일 꺼내기
// application.yaml  jwt 를 가져와!!!!!