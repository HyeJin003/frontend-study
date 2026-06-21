package com.hjr.myproject.domain.post.entity;


import com.hjr.myproject.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name="posts")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="member_id")
    private Member member;

    private String title;
    @Column(columnDefinition = "TEXT")
    private String content;
    @Column(name = "is_public")
    private boolean isPublic;

    @Column(name="view_count")
    @Builder.Default
private int viewCount= 0;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;


    public void updateTitle(String title){
        this.title =  title;
    }

    public void updateContent(String content){
        this.content =  content;

    }
    public void updateIsPublic(boolean isPublic){
        this.isPublic = isPublic;
    }
    public void incrementViewCount(){
    this.viewCount++;
    }
}
