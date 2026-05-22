package com.hjr.myproject.domain.member.service;

import com.hjr.myproject.domain.member.dto.ChangePasswordRequestDto;
import com.hjr.myproject.domain.member.dto.MemberResponseDto;
import com.hjr.myproject.domain.member.dto.UpdateProfileRequestDto;
import com.hjr.myproject.domain.member.entity.Member;
import com.hjr.myproject.domain.member.repository.MemberRepository;
import com.hjr.myproject.domain.member.repository.RefreshTokenRepository;
import com.hjr.myproject.global.exception.CustomException;
import com.hjr.myproject.global.exception.ErrorCode;
import com.hjr.myproject.global.jwt.JwtProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;   // 회원정보를 db 에서 꺼내기
    private final RefreshTokenRepository refreshTokenRepository; //회원 삭제전 해당 토큰 먼저 삭제 해야 함 , 토큰 테이블이 멤버 테이블을 fk 로 참조 하고 있어서
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;


    public MemberResponseDto getMyInfo(String token){
        String email = jwtProvider.getEmail(token);

    Member member = memberRepository.findByEmail(email)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    return MemberResponseDto.from(member);

    }

    public MemberResponseDto updateProfile(String token ,  UpdateProfileRequestDto dto){
        String email = jwtProvider.getEmail(token);
        Member member =  memberRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        member.updateNickname(dto.getNickname());
        memberRepository.save(member);
        return MemberResponseDto.from(member);

    }

    public void changePassword(String token , ChangePasswordRequestDto dto ){
            String email = jwtProvider.getEmail(token);
        Member member =  memberRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));



        if(member.getProvider() != Member.AuthProvider.NONE){

            throw new CustomException(ErrorCode.SOCIAL_LOGIN_MEMBER);
        }

        if(!passwordEncoder.matches(dto.getCurrentPassword(), member.getPassword())){
            throw new CustomException(ErrorCode.WRONG_PASSWORD);

        }


        String newPassword = dto.getNewPassword();
        String confirmPassword = dto.getConfirmPassword();

        if(!newPassword.equals(confirmPassword)){
            throw new CustomException(ErrorCode.PASSWORD_NOT_MATCH);

        }
        member.updatePassword(passwordEncoder.encode(newPassword));
        memberRepository.save(member);


    }


    public void withdraw (String token){
        String email = jwtProvider.getEmail(token);
        Member member =  memberRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        refreshTokenRepository.deleteByMember(member);
        memberRepository.delete(member);
    }
}
