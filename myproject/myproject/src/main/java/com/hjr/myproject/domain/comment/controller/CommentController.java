package com.hjr.myproject.domain.comment.controller;

import com.hjr.myproject.domain.comment.dto.CommentRequest;
import com.hjr.myproject.domain.comment.dto.CommentResponse;
import com.hjr.myproject.domain.comment.service.CommentService;
import com.hjr.myproject.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @RequestHeader("Authorization") String bearerToken,
            @PathVariable Long postId,
            @RequestBody @Valid CommentRequest dto) {

        String accessToken = bearerToken.substring(7);
        CommentResponse comment = commentService.createComment(accessToken, postId, dto);
        return ResponseEntity.ok(ApiResponse.success("댓글 쓰기 성공", comment));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CommentResponse>>> getComments(
            @PathVariable Long postId,
            Pageable pageable) {

        Page<CommentResponse> comments = commentService.getComments(postId, pageable);
        return ResponseEntity.ok(ApiResponse.success("댓글 목록", comments));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @RequestHeader("Authorization") String bearerToken,
            @PathVariable Long postId,
            @PathVariable Long commentId) {

        String accessToken = bearerToken.substring(7);
        commentService.deleteComment(accessToken, postId, commentId);
        return ResponseEntity.ok(ApiResponse.success("댓글 삭제", null));
    }
}
