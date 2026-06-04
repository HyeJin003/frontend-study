package com.hjr.myproject.domain.guestbook.repository;

import com.hjr.myproject.domain.guestbook.entity.Guestbook;
import com.hjr.myproject.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface GuestbookRepository extends JpaRepository<Guestbook , Long> {

    List<Guestbook> findByOwner(Member owner);


    Guestbook findByWriter(Member writer);
}
