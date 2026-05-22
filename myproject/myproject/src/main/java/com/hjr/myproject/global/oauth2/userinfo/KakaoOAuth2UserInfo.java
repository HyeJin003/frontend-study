package com.hjr.myproject.global.oauth2.userinfo;

import lombok.RequiredArgsConstructor;

import java.util.Map;

@RequiredArgsConstructor
public class KakaoOAuth2UserInfo implements OAuth2UserInfo {

    private final Map<String, Object> attributes;

    @Override
    public String getEmail(){
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        return (String)kakaoAccount.get("email");
    }

    @Override
    public String getNickname(){
        Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
        return (String)properties.get("nickname");
    }
}
