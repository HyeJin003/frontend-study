package com.hjr.myproject.domain.guestbook.service;


import com.hjr.myproject.domain.guestbook.dto.GuestbookRequestDto;
import com.hjr.myproject.domain.guestbook.dto.GuestbookResponseDto;
import com.hjr.myproject.domain.guestbook.entity.Guestbook;
import com.hjr.myproject.domain.guestbook.repository.GuestbookRepository;
import com.hjr.myproject.domain.member.entity.Member;
import com.hjr.myproject.domain.member.repository.MemberRepository;
import com.hjr.myproject.global.exception.CustomException;
import com.hjr.myproject.global.exception.ErrorCode;
import com.hjr.myproject.global.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GuestbookService {

    private final GuestbookRepository guestbookRepository;
    private final MemberRepository memberRepository;
    private final JwtProvider jwtProvider;


    public void write(String nickname, String token, GuestbookRequestDto dto) {

        // 1. nickname으로 방명록 주인 찾기
        Member owner = memberRepository.findByNickname(nickname)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 2. token으로 글 쓴 사람 찾기
        String email = jwtProvider.getEmail(token);
        Member writer = memberRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 3. Guestbook 객체 만들기
        Guestbook guestbook = Guestbook.builder()
                .owner(owner)
                .writer(writer)
                .content(dto.getContent())
                .isAnonymous(dto.isAnonymous())
                .build();

        // 4. DB 저장
        guestbookRepository.save(guestbook);
    }

    public List<GuestbookResponseDto> getGusetbooks(String nickname){

        Member owner = memberRepository.findByNickname(nickname)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        List<Guestbook> gustbooks =  guestbookRepository.findByOwner((owner));
        return gustbooks.stream()
                .map(GuestbookResponseDto::from)
                .collect(Collectors.toList());
    }
    public void delete(Long id, String token) {
        Guestbook guestbook = guestbookRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.GUESTBOOK_NOT_FOUND));
        String email = jwtProvider.getEmail(token);
        Member requester = memberRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        boolean isOwner = guestbook.getOwner().getId().equals(requester.getId());
        boolean isWriter = guestbook.getWriter().getId().equals(requester.getId());
        if (!isOwner && !isWriter) {
            throw new CustomException(ErrorCode.UNAUTHORIZED_ACCESS);
        }

        guestbookRepository.delete(guestbook);

    }


}
