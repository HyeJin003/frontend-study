package com.hjr.myproject.domain.member.repository;

import com.hjr.myproject.domain.member.entity.Member;
import com.hjr.myproject.domain.member.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {


    Optional<RefreshToken> findByToken(String token);


    void deleteByMember(Member member);
}

//1. 로그아웃 -> Refresh Token 삭제
//2.  토큰 재발급 -> 로그인시 토큰아이디로 값찾기
