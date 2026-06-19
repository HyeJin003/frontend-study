package com.hjr.myproject.domain.member.repository;

import com.hjr.myproject.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public  interface MemberRepository  extends JpaRepository<Member,  Long> {
    // JpaRepository<Member, Long>  Member 테이블   // Member의 id가 Long이었잖아요
    // id 타입이 Long  그 엔티티의 PK 타입

    Optional<Member> findByEmail(String email);

    boolean existsByEmail(String email); // 이 이메일 존재해?

    Optional<Member>findByNickname(String nickname);

    List<Member> findByNicknameContaining(String nickname);
}


//로그인할 때 뭐가 필요할까요?
// 회원가입시 -> 이메일 중복 확인 로그인시 -> 이메일로 회원 찾기
//  save()        → 저장/수정
//  findById()    → id로 조회
//  findAll()     → 전체 조회
//  delete()      → 삭제
//  existsById()  → 존재 여부 확인
//  count()       → 개수 조회
// find 찾아서 데이터 줘
// exists 있어? 없어?
//delete 삭제해
//count 몇개야?