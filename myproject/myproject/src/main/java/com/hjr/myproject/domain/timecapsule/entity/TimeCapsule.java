package com.hjr.myproject.domain.timecapsule.entity;


import com.hjr.myproject.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "time_capsules")
public class TimeCapsule {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="member_id")
    private Member member;

    @CreatedDate
    private LocalDateTime createdAt;

    @Column(name = "open_at")
    private LocalDateTime openAt;

    @Column(name = "is_opened")
    private boolean isOpened; //열리고 닫히는것

    @Column(name = "is_public")
    private boolean isPublic;


}
