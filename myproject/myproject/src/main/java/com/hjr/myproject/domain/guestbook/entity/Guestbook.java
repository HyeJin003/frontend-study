package com.hjr.myproject.domain.guestbook.entity;


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
@EntityListeners(AuditingEntityListener.class)

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor

@Table(name = "guestbooks")
public class Guestbook {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "owner_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private Member owner;

    @JoinColumn(name="writer_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private Member writer;

    private String content;


    private boolean isAnonymous;

    @CreatedDate
    private LocalDateTime createdAt;


}