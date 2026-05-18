package com.hjr.myproject.global.oauth2;

import com.hjr.myproject.domain.member.entity.Member;
import com.hjr.myproject.domain.member.repository.MemberRepository;
import com.hjr.myproject.global.oauth2.userinfo.GoogleOAuth2UserInfo;
import com.hjr.myproject.global.oauth2.userinfo.KakaoOAuth2UserInfo;
import com.hjr.myproject.global.oauth2.userinfo.NaverOAuth2UserInfo;
import com.hjr.myproject.global.oauth2.userinfo.OAuth2UserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;

import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
@RequiredArgsConstructor
//DefaultOAuth2UserService 이건 소셜 서버에서 사용자 정보 가져오는 기본 구현체
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {

        OAuth2User oAuth2User =  super.loadUser(userRequest);
        String registrationId =  userRequest.getClientRegistration().getRegistrationId();

        OAuth2UserInfo userInfo;

        if (registrationId.equals("google")) {
            userInfo = new GoogleOAuth2UserInfo(oAuth2User.getAttributes());
        } else if (registrationId.equals("kakao")) {
            userInfo = new KakaoOAuth2UserInfo(oAuth2User.getAttributes());
        } else {
            userInfo = new NaverOAuth2UserInfo(oAuth2User.getAttributes());  // 나머지 = 네이버
        }

        String email =  userInfo.getEmail();
        String nickname =  userInfo.getNickname();

        Member member = memberRepository.findByEmail(email).orElse(null);

        if (member == null) {
            member = Member.builder()
                    .email(email)
                    .nickname(nickname)
                    .password(null)
                    .role(Member.Role.MEMBER)
                    .provider(Member.AuthProvider.valueOf(registrationId.toUpperCase()))
                    .build();
            memberRepository.save(member);
        }
        return oAuth2User;
    }
}
//  1. 부모한테서 사용자 정보 받기
//  2. 어떤 소셜인지 확인 (google? kakao? naver?)
//  3. 각 구현체로 이메일/닉네임 꺼내기
//  4. DB에서 회원 조회 → 없으면 자동 가입
//  5. OAuth2User 반환
