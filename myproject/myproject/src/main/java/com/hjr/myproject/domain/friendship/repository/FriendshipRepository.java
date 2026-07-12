package com.hjr.myproject.domain.friendship.repository;

import com.hjr.myproject.domain.friendship.entity.Friendship;
import com.hjr.myproject.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface FriendshipRepository extends JpaRepository<Friendship ,Long> {


    boolean existsByFromMemberAndToMember(Member fromMember, Member toMember);
         @Query("""
select f from Friendship f where (f.fromMember =:member or f.toMember =:member)and f.status='ACCEPTED'""")
         List<Friendship> findFriendshipByFromMemberOrToMemberAccepted(@Param("member")Member member);
}

