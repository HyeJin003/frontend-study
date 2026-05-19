package com.hjr.myproject.domain.member.service;


import com.hjr.myproject.domain.member.dto.LoginRequestDto;
import com.hjr.myproject.domain.member.dto.SignupRequestDto;
import com.hjr.myproject.domain.member.dto.TokenResponseDto;
import com.hjr.myproject.domain.member.entity.Member;
import com.hjr.myproject.domain.member.entity.RefreshToken;
import com.hjr.myproject.domain.member.repository.MemberRepository;
import com.hjr.myproject.domain.member.repository.RefreshTokenRepository;
import com.hjr.myproject.global.exception.CustomException;
import com.hjr.myproject.global.exception.ErrorCode;
import com.hjr.myproject.global.jwt.JwtProvider;
import io.jsonwebtoken.Jwts;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

    @Service
    @RequiredArgsConstructor
    @Transactional
    public class AuthService {

        private final MemberRepository memberRepository;
        private final JwtProvider jwtProvider;
        private final PasswordEncoder passwordEncoder;
        private final RefreshTokenRepository refreshTokenRepository;


        //메서드들  추가
        public TokenResponseDto signup(SignupRequestDto dto) {
            // 1. 이메일 중복 확인
            if (memberRepository.existsByEmail(dto.getEmail())) {
                throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
            }
            // 2. 비밀번호 암호화
            String encodePassword = passwordEncoder.encode(dto.getPassword());

            // 3. Member 엔티티 만들기
            Member member = Member.builder()
                    .email(dto.getEmail())
                    .password(encodePassword)   // 암호화된 비밀번호
                    .nickname(dto.getNickname())
                    .role(Member.Role.MEMBER)           // 기본값
                    .provider(Member.AuthProvider.NONE) // 일반 가입이니까
                    .build();


            // 4. DB 저장
            memberRepository.save(member);
            // 5. JWT 발급
            String accessToken = jwtProvider.generateAccessToken(
                    member.getEmail(),
                    member.getRole().name()
            );
            String refreshToken = jwtProvider.generateRefreshToken(
                    member.getEmail()
            );
// 5-1. RefreshToken DB 저장
            RefreshToken refreshTokenEntity = RefreshToken.builder()
                    .token(refreshToken)
                    .member(member)
                    .build();
            refreshTokenRepository.save(refreshTokenEntity);
            // 6. TokenResponseDto 반환
            return TokenResponseDto.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build();

        }

        public TokenResponseDto login(LoginRequestDto dto) {
            // 1. 이메일로 멤버 조회 없으면 에러
            Member member = memberRepository.findByEmail(dto.getEmail())
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

            //"값이 없으면 예외 던져" 라는 뜻
            //  () -> 는 람다예요. "나중에 필요할 때 실행할 코드"

            // 2. 비밀번호 확인
            if (!passwordEncoder.matches(dto.getPassword(), member.getPassword())) {
                throw new CustomException(ErrorCode.INVALID_PASSWORD);
            }
            // 3. 토큰 발급( 이사람이 누구고 , 어떤 권한만 있는지만 확인하기 ㅜ이해)
            String accessToken = jwtProvider.generateAccessToken(
                    member.getEmail(),
                    member.getRole().name()
            );
            String refreshToken = jwtProvider.generateRefreshToken(
                    member.getEmail()

            );
            //토큰
            refreshTokenRepository.deleteByMember(member);

            RefreshToken refreshTokenEntity = RefreshToken.builder()
                    .token(refreshToken)
                    .member(member)
                    .build();
            refreshTokenRepository.save(refreshTokenEntity);

            return TokenResponseDto.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build();


        }

        public String refresh(String refreshToken) {
            // 1. 토큰 유효성 검증
            if (!jwtProvider.validateToken(refreshToken)) {
                throw new CustomException(ErrorCode.INVALID_TOKEN);
            }
            RefreshToken tokenEntity = refreshTokenRepository.findByToken(refreshToken)
                    .orElseThrow(() -> new CustomException(ErrorCode.INVALID_TOKEN));


            // 3. 토큰에서 이메일 꺼내기
            String email = jwtProvider.getEmail(refreshToken);

            // 4. 이메일로 Member 조회
            Member member = memberRepository.findByEmail(email)
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

            // 5. 새 AccessToken 발급해서 반환
            return jwtProvider.generateAccessToken(member.getEmail(), member.getRole().name());


        }
        public void logout(String accessToken) {
            // 1. 토큰에서 이메일 꺼내기
            String email = jwtProvider.getEmail(accessToken);
            // 2. 이메일로 Member 조회
            Member member = memberRepository.findByEmail(email)
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
            // 3. RefreshToken DB에서 삭제

            refreshTokenRepository.deleteByMember(member);
        }
        public Member me(String accessToken) {
            // 1. 토큰에서 이메일 꺼내기
            String email = jwtProvider.getEmail(accessToken);

            // 2. 이메일로 Member 조회 후 반환
            Member member = memberRepository.findByEmail(email)
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
            return member;
        }
    }