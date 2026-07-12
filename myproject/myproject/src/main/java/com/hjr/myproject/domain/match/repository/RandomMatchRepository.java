package com.hjr.myproject.domain.match.repository;

import com.hjr.myproject.domain.match.entity.RandomMatch;
import com.hjr.myproject.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RandomMatchRepository extends JpaRepository<RandomMatch , Long> {


    @Query("select r from  RandomMatch r where (r.memberA = :member or r.memberB= :member) and r.isActive=true")
    Optional<RandomMatch> findByMemberAMatches(@Param("member") Member member);


       List<RandomMatch> findByIsActiveTrueAndExpiresAtBefore(LocalDateTime now);
}

