package com.hjr.myproject.domain.post.repository;


import com.hjr.myproject.domain.member.entity.Member;
import com.hjr.myproject.domain.post.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


//     and 는 조건을 하나 더 추가한다 의미
    public interface PostRepository extends JpaRepository<Post,Long> {

           Page<Post> findByIsPublicTrueOrderByCreatedAtDesc(Pageable pageable);

        Page<Post> findByMemberAndIsPublicTrue(Member member, Pageable pageable);

        List<Post> findTop5ByIsPublicTrueOrderByViewCountDesc();
}
