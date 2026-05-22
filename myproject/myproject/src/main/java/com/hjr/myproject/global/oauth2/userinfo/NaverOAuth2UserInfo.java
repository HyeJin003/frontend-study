package com.hjr.myproject.global.oauth2.userinfo;


import lombok.RequiredArgsConstructor;

import java.util.Map;

@RequiredArgsConstructor
public class NaverOAuth2UserInfo implements OAuth2UserInfo {

    private final Map<String, Object> attributes;


    @Override
    public String getEmail(){

        Map<String, Object> naverAccount = (Map<String, Object>)attributes.get("response");
        return (String)naverAccount.get("email");
    }

    @Override
    public String getNickname() {
        Map<String, Object> properties = (Map<String, Object>) attributes.get("response");


        return (String) properties.get("name");
    }
}
