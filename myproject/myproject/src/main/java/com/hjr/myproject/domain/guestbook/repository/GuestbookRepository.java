package com.hjr.myproject.domain.guestbook.repository;

import com.hjr.myproject.domain.guestbook.entity.Guestbook;
import com.hjr.myproject.domain.member.entity.Member;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GuestbookRepository extends JpaRepository<Guestbook , Long> {

    @Query("SELECT g FROM Guestbook  g JOIN FETCH g.writer WHERE g.owner = :owner ORDER BY g.id DESC")
    List<Guestbook> findByOwner(@Param("owner") Member owner);

    List<Guestbook> findByWriter(Member writer);

    // 첫 페이지: cursor 없이 최신순
    List<Guestbook> findByOwnerOrderByIdDesc(Member owner, Pageable pageable);

    // 이후 페이지: cursor(id)보다 작은 것만, 최신순
    List<Guestbook> findByOwnerAndIdLessThanOrderByIdDesc(Member owner, Long cursor, Pageable pageable);
}
//방명록 기능이 뭐가 있어요?
//방명록 쓰기 -DB 에 저장
//방명록 읽기 -특정 유저 것만 조회
// 방명록 삭제 -> 삭제