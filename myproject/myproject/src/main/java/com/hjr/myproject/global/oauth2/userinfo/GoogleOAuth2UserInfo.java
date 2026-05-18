package com.hjr.myproject.global.oauth2.userinfo;

import lombok.RequiredArgsConstructor;

import java.util.Map;

// 구글 구현체 (규칙 이행)
@RequiredArgsConstructor
public class GoogleOAuth2UserInfo implements OAuth2UserInfo {

    private final Map<String, Object> attributes;

    @Override
    public String getEmail() {
        // 구글 방식으로 이메일 꺼내기
    return  (String) attributes.get("email");
    }

    @Override

    public String getNickname() {
        return (String) attributes.get("name");
    }
}
// json 으로 보내면 java 에서 map 이 됨  그래서 Map<String , Object> 로 변환해서 우리한테 준다고 생각 하면 되