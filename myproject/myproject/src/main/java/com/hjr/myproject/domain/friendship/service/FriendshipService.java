package com.hjr.myproject.domain.friendship.service;


import com.hjr.myproject.domain.friendship.dto.FriendshipResponse;
import com.hjr.myproject.domain.friendship.entity.Friendship;
import com.hjr.myproject.domain.friendship.repository.FriendshipRepository;
import com.hjr.myproject.domain.member.entity.Member;
import com.hjr.myproject.domain.member.repository.MemberRepository;
import com.hjr.myproject.domain.member.service.MemberService;
import com.hjr.myproject.global.exception.CustomException;
import com.hjr.myproject.global.exception.ErrorCode;
import com.hjr.myproject.global.jwt.JwtProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final JwtProvider jwtProvider;
    private final MemberRepository memberRepository;
    private final MemberService memberService;


    // 친구 신청
    public FriendshipResponse sendFriend(String token, String nickname){


        String email =  jwtProvider.getEmail(token);

        //나
        Member member =  memberRepository.findByEmail(email)
                .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 닉네임
        Member toMember = memberRepository.findByNickname(nickname)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (member.getId().equals(toMember.getId())) {
            throw new CustomException(ErrorCode.CANNOT_FRIEND_YOURSELF);
        }

            // 이미 친구 신청 했는지 확인
        if(friendshipRepository.existsByFromMemberAndToMember(member, toMember)){
            throw new CustomException(ErrorCode.ALREADY_FRIEND_REQUEST);
        }

        Friendship friendship = Friendship.builder()
                .fromMember(member)
                .toMember(toMember)
                .status(Friendship.FriendshipStatus.PENDING)
                .build();

        friendshipRepository.save(friendship);
        return FriendshipResponse.from(friendship , toMember);
    }

    // 친구 수락/거절
    public void responseFriend(String token, Long id, boolean accept){
        String email =  jwtProvider.getEmail(token);
        Member member =  memberRepository.findByEmail(email)
                .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));

        Friendship friendship = friendshipRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.MATCH_NOT_FOUND));


        if (!friendship.getToMember().equals(member)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED_ACCESS);
        }
        if(accept){
            friendship.accept();
        }else {

            friendship.reject();
        }




    }

    // 친구 신청 취소
    public void cancelFriend(String token ,  Long id){

        String email =  jwtProvider.getEmail(token);
        Member member =  memberRepository.findByEmail(email)
                .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));

        Friendship friendship = friendshipRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.MATCH_NOT_FOUND));


        if (!friendship.getFromMember().equals(member)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED_ACCESS);
        }


        friendshipRepository.delete(friendship);



    }

// 친구 목록
public List<FriendshipResponse> getFriends(String token) {

    String email = jwtProvider.getEmail(token);
    Member member = memberRepository.findByEmail(email)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

    List<Friendship> friendships = friendshipRepository.findFriendshipByFromMemberOrToMemberAccepted(member);

    return friendships.stream().map(friendship-> {
        Member friend = friendship.getFromMember().equals(member)
                ? friendship.getToMember()
                : friendship.getFromMember();
        return FriendshipResponse.from(friendship, friend);

    }).toList();
}

}
