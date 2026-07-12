package com.hjr.myproject.domain.friendship.entity;


import com.hjr.myproject.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Builder
@AllArgsConstructor
@Getter
@Table(name="friendships")
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Friendship {

    public enum FriendshipStatus {
        PENDING, ACCEPTED, REJECTED
    }

    // 친구를 만들려면

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_member_id")
    private Member fromMember; // 친구 신청 보낸사람 (나)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_member_id")
    private Member toMember; // 친구 신청 받은 사람(상대방)

    @Enumerated(EnumType.STRING)
    private FriendshipStatus status;

    @CreatedDate
    private LocalDateTime createdAt;


    public void accept (){
        this.status = FriendshipStatus.ACCEPTED;
    }
    public void reject(){
        this.status = FriendshipStatus.REJECTED;

    }
}