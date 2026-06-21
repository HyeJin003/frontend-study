package com.hjr.myproject.domain.comment.service;


import com.hjr.myproject.domain.comment.dto.CommentRequest;
import com.hjr.myproject.domain.comment.dto.CommentResponse;
import com.hjr.myproject.domain.comment.entity.Comment;
import com.hjr.myproject.domain.comment.repository.CommentRepository;
import com.hjr.myproject.domain.member.entity.Member;
import com.hjr.myproject.domain.member.repository.MemberRepository;
import com.hjr.myproject.domain.post.entity.Post;
import com.hjr.myproject.domain.post.repository.PostRepository;
import com.hjr.myproject.global.exception.CustomException;
import com.hjr.myproject.global.exception.ErrorCode;
import com.hjr.myproject.global.jwt.JwtProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;
    private final JwtProvider jwtProvider;
    private final PostRepository postRepository;


    //댓글 작성
    public CommentResponse createComment(String token , Long postId , CommentRequest dto){

        String email = jwtProvider.getEmail(token);
    Member member =  memberRepository.findByEmail(email)
            .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));


        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));

    Comment comment = Comment.builder()
                .member(member)
                .content(dto.getContent())
            .post(post)
                .build();

    commentRepository.save(comment);
    return CommentResponse.from(comment);

    }

    //댓글 목록
    public Page<CommentResponse> getComments(Long postId, Pageable pageable){

        Post post = postRepository.findById(postId)
                .orElseThrow(()-> new CustomException(ErrorCode.POST_NOT_FOUND));

        Page<Comment> comments =  commentRepository.findByPost(post, pageable);

        return comments.map(comment -> CommentResponse.from(comment));


    }

    //댓글 삭제
    public void deleteComment(String token, Long postId, Long commentId){

        String email = jwtProvider.getEmail(token);
        Member member =  memberRepository.findByEmail(email)
                .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));

        Post post = postRepository.findById(postId)
                .orElseThrow(()-> new CustomException(ErrorCode.POST_NOT_FOUND));


        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));


        if (!comment.getMember().getId().equals(member.getId())) {
            throw new CustomException(ErrorCode.COMMENT_FORBIDDEN);
        }


        commentRepository.delete(comment);

    }


}
