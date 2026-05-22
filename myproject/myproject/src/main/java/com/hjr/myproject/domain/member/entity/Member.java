package com.hjr.myproject.domain.member.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "members")
@Getter

@Builder //골라서 넣는 방식으로 객체 만들 수 있게 해줘
@NoArgsConstructor   // 기본 생성자 자동 생성
@AllArgsConstructor //모든 필드를 파라미터로 받는 생성자 자동 생성
@EntityListeners(AuditingEntityListener.class)
public class Member {

    public enum AuthProvider {
        NONE, GOOGLE, NAVER, KAKAO
    }

    public enum Role {
        ADMIN, MEMBER
    }

    public void updateNickname(String nickname){
        this.nickname = nickname;
    }

    public void updatePassword(String password){
        this.password = password;
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
    @CreatedDate
    private LocalDateTime createdAt;
}
