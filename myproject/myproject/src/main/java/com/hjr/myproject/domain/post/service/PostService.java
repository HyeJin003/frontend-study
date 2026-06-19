package com.hjr.myproject.domain.post.service;


import com.hjr.myproject.domain.member.entity.Member;
import com.hjr.myproject.domain.member.repository.MemberRepository;
import com.hjr.myproject.domain.post.dto.PostCreateRequest;
import com.hjr.myproject.domain.post.dto.PostLikeResponse;
import com.hjr.myproject.domain.post.dto.PostResponse;
import com.hjr.myproject.domain.post.dto.PostUpdateRequest;
import com.hjr.myproject.domain.post.entity.Post;
import com.hjr.myproject.domain.post.entity.PostLike;
import com.hjr.myproject.domain.post.repository.PostLikeRepository;
import com.hjr.myproject.domain.post.repository.PostRepository;
import com.hjr.myproject.global.exception.CustomException;
import com.hjr.myproject.global.exception.ErrorCode;
import com.hjr.myproject.global.jwt.JwtProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final MemberRepository memberRepository;
    private final JwtProvider jwtProvider;
    private final PostLikeRepository postLikeRepository;


    public PostResponse createPost(String token ,PostCreateRequest dto) {
        String email = jwtProvider.getEmail(token);

    Member member = memberRepository.findByEmail(email)
            .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND) );

        Post post = Post.builder()
                .member(member)
                .title(dto.getTitle())
                .content(dto.getContent())
                .isPublic(dto.isPublic())
                .build();
        postRepository.save(post);
    return PostResponse.from(post);
    }


 public Page<PostResponse> getPostList(Pageable pageable){

        Page<Post> posts = postRepository.findByIsPublicTrueOrderByCreatedAtDesc(pageable);

            return posts.map(post -> PostResponse.from(post));
 }



    public PostResponse getPost(Long id){


        Post post = postRepository.findById(id)
                .orElseThrow(()-> new CustomException(ErrorCode.POST_NOT_FOUND));

        if(!post.isPublic()){
        throw  new CustomException(ErrorCode.POST_ACCESS_DENIED);
        }

        post.incrementViewCount();

     return PostResponse.from(post);
    }
 public  PostResponse updatePost(String token ,  Long id , PostUpdateRequest dto){

        String email = jwtProvider.getEmail(token);


     Member member = memberRepository.findByEmail(email)
             .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));


     Post post = postRepository.findById(id)
                .orElseThrow(() -> new  CustomException(ErrorCode.POST_NOT_FOUND));

     if(!post.getMember().getId().equals(member.getId())){
         throw new CustomException(ErrorCode.POST_FORBIDDEN);
     }
     if (dto.getTitle() != null) {
         post.updateTitle(dto.getTitle());
     }
     if (dto.getContent() != null) {
         post.updateContent(dto.getContent());
     }
     if (dto.getIsPublic() != null) {
         post.updateIsPublic(dto.getIsPublic());
     }


 return PostResponse.from(post);

 }

 public void deletePost(String token , Long id){
     String email = jwtProvider.getEmail(token);

     Member member = memberRepository.findByEmail(email)
             .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));


     Post post = postRepository.findById(id)
             .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND) );

     if(!post.getMember().getId().equals(member.getId())){
         throw new CustomException(ErrorCode.POST_FORBIDDEN)  ;
     }

     postRepository.delete(post);

 }

    public PostLikeResponse toggleLike(String token , Long postId, PostLike.LikeType type) {

        String email = jwtProvider.getEmail(token);
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));


        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));


        Optional<PostLike> existing = postLikeRepository.findByMemberAndPost(member, post);

        PostLike postLike;
        if (existing.isPresent()) {
            postLike = existing.get();
            if (postLike.getType() == type){
                postLikeRepository.delete(postLike);

            }else {
                postLike.changeType(type);
            }

    }else{
                PostLike newLike =  PostLike.builder()

                        .post(post)
                        .member(member)
                        .type(type)
                        .build();
                postLikeRepository.save(newLike);
        }

            long likeCount = postLikeRepository.countByPostAndType(post, PostLike.LikeType.LIKE);
            long dislikeCount = postLikeRepository.countByPostAndType(post,PostLike.LikeType.DISLIKE);

            return new PostLikeResponse(likeCount , dislikeCount);

    }


    public Page<PostResponse> getUserPosts(String nickname , Pageable pageable){


        Member member = memberRepository.findByNickname(nickname)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Page<Post> posts = postRepository.findByMemberAndIsPublicTrue(member, pageable);
        return posts.map(post -> PostResponse.from(post));

    }


}
