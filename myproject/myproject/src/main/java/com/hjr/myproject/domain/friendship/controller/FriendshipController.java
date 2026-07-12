package com.hjr.myproject.domain.friendship.controller;

import com.hjr.myproject.domain.friendship.dto.FriendshipResponse;
import com.hjr.myproject.domain.friendship.service.FriendshipService;
import com.hjr.myproject.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipService friendshipService;

    @Operation(summary="친구 목록")
    @PostMapping("{nickname}")
    public ResponseEntity<ApiResponse<FriendshipResponse>> sendFriend(
            @RequestHeader("Authorization") String bearToken,  @PathVariable String nickname
    ){
        String accessToken =  bearToken.substring(7);
        FriendshipResponse result =  friendshipService.sendFriend(accessToken,nickname);

        return ResponseEntity.ok(ApiResponse.success("친구 성공", result));
    }


    @Operation(summary="친구 요청 ")
    @PutMapping("{id}")
    public ResponseEntity<ApiResponse<Void>> responseFriend(
            @RequestHeader("Authorization") String bearToken
            ,@PathVariable Long id , boolean accept
    ){
        String accessToken =  bearToken.substring(7);

        friendshipService.responseFriend(accessToken, id, accept);

        return ResponseEntity.ok(ApiResponse.success("친구 요청 처리 완료", null));

    }

    @Operation(summary="친구 삭제 ")
    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<Void>> cancelFriend(
            @RequestHeader("Authorization") String bearToken ,  @PathVariable Long id
    ){
        String accessToken =  bearToken.substring(7);

        friendshipService.cancelFriend(accessToken, id);
        return ResponseEntity.ok(ApiResponse.success("친구삭제완료", null));

    }

    @Operation(summary="친구 목록")
    @GetMapping()
    public ResponseEntity<ApiResponse<List<FriendshipResponse>>> getFriends(
            @RequestHeader("Authorization") String bearToken
    ){
        String accessToken =  bearToken.substring(7);

      List<FriendshipResponse> result =   friendshipService.getFriends(accessToken);
        return ResponseEntity.ok(ApiResponse.success("친구 목록", result));

    }
}
