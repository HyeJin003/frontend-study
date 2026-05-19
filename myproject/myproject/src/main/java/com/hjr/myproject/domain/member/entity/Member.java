package com.hjr.myproject.domain.member.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "members")
@Getter
@Builder //골라서 넣는 방식으로 객체 만들 수 있게 해줘
@NoArgsConstructor   // 기본 생성자 자동 생성
@AllArgsConstructor //모든 필드를 파라미터로 받는 생성자 자동 생성
public class Member {

    public enum AuthProvider {
        NONE, GOOGLE, NAVER, KAKAO
    }

    public enum Role {
        ADMIN, MEMBER
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
    private String nickname;
    private String providerId;
    private Role role;
    private AuthProvider provider;
    private LocalDateTime createdAt;
}
