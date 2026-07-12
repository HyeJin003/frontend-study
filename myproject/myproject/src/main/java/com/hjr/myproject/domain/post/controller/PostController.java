package com.hjr.myproject.domain.post.controller;


import com.hjr.myproject.domain.post.dto.PostCreateRequest;
import com.hjr.myproject.domain.post.dto.PostLikeResponse;
import com.hjr.myproject.domain.post.dto.PostResponse;
import com.hjr.myproject.domain.post.dto.PostUpdateRequest;
import com.hjr.myproject.domain.post.entity.PostLike;
import com.hjr.myproject.domain.post.service.PostService;
import com.hjr.myproject.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

        private final PostService postService;

    @Operation(summary = "글쓰기")
    @PostMapping
    public ResponseEntity<ApiResponse<PostResponse>> createPost(
            @RequestHeader("Authorization") String bearerToken ,
            @RequestBody @Valid PostCreateRequest dto){

        String accessToken = bearerToken.substring(7);
            PostResponse post = postService.createPost(accessToken, dto);

            return ResponseEntity.ok(ApiResponse.success("글 작성 성공", post));

    }

    @Operation(summary = "글목록")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<PostResponse>>> getPostList(Pageable pageable){

        Page<PostResponse> posts = postService.getPostList(pageable);

        return ResponseEntity.ok(ApiResponse.success("글목록 성공 ", posts));
    }

    @Operation(summary = "글 상세 조회")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> getPost(@PathVariable Long id){
        PostResponse post = postService.getPost(id);

        return ResponseEntity.ok(ApiResponse.success("해당글 조회", post));
    }

    @Operation(summary = "글 수정")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> updatePost(@RequestHeader("Authorization")String bearerToken,
                                                                @PathVariable Long id ,
                                                                @RequestBody @Valid PostUpdateRequest dto){
        String accessToken = bearerToken.substring(7);

        PostResponse post = postService.updatePost(accessToken,id,dto);

        return ResponseEntity.ok(ApiResponse.success("해당글 수정", post));

    }
    @Operation(summary = "글 삭제")
    @DeleteMapping("/{id}")

    public ResponseEntity<ApiResponse<Void>> deletePost(@RequestHeader("Authorization")String bearerToken,
                                                        @PathVariable Long id){

        String accessToken = bearerToken.substring(7);
         postService.deletePost(accessToken, id);

        return ResponseEntity.ok(ApiResponse.success("해당글 삭제", null));

    }


    @Operation(summary = "추천")
    @PostMapping("/{id}/like")
    public ResponseEntity<ApiResponse<PostLikeResponse>> toggleLike(@RequestHeader("Authorization")String bearerToken
    , @PathVariable Long id){

        String accessToken = bearerToken.substring(7);

        PostLikeResponse response = postService.toggleLike(accessToken,  id , PostLike.LikeType.LIKE);

    return ResponseEntity.ok(ApiResponse.success("추천 완료 ", response));

    }

    @Operation(summary = "비추천")
    @PostMapping("/{id}/dislike")
    public ResponseEntity<ApiResponse<PostLikeResponse>> toggleDislike(@RequestHeader("Authorization")String bearerToken,
                                                                       @PathVariable Long id){

        String accessToken = bearerToken.substring(7);
        PostLikeResponse response = postService.toggleLike(accessToken,  id , PostLike.LikeType.DISLIKE);

        return ResponseEntity.ok(ApiResponse.success("비추천", response));
    }


    @Operation(summary = "유저별 글 목록")
    @GetMapping("/user/{nickname}")
    public  ResponseEntity<ApiResponse<Page<PostResponse>>> getUserPosts(@PathVariable  String nickname ,  Pageable pageable){


        Page<PostResponse> response = postService.getUserPosts(nickname, pageable);
        return ResponseEntity.ok(ApiResponse.success("유저별", response));

    }
    @Operation(summary = "Top5글")
    @GetMapping("/popular")
    public  ResponseEntity<ApiResponse<List<PostResponse>>> getPopularPosts(){


        List<PostResponse> response = postService.getPopularPosts();
        return ResponseEntity.ok(ApiResponse.success("top5 글목록 ", response));

    }
}
