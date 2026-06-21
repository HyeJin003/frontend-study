package com.hjr.myproject.domain.post.repository;

import com.hjr.myproject.domain.member.entity.Member;

import com.hjr.myproject.domain.post.entity.Post;
import com.hjr.myproject.domain.post.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike , Long> {

    Optional<PostLike> findByMemberAndPost(Member member, Post post);

    long countByPostAndType(Post post , PostLike.LikeType type);
}
