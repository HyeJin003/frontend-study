package com.hjr.myproject.global.oauth2.userinfo;

import lombok.RequiredArgsConstructor;

import java.util.Map;

@RequiredArgsConstructor
public class KakaoOAuth2UserInfo implements OAuth2UserInfo {

    private final Map<String, Object> attributes;

    @Override
    public String getEmail(){
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        if (kakaoAccount != null) {
            String email = (String) kakaoAccount.get("email");
            if (email != null) return email;
        }
        // 비즈 앱이 아닌 경우 email 동의 불가 → kakao ID로 대체
        return attributes.get("id") + "@kakao.com";
    }

    @Override
    public String getNickname(){
        Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
        return (String)properties.get("nickname");
    }
}
