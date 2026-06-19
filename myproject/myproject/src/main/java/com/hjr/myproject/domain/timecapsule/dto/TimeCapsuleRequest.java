package com.hjr.myproject.domain.timecapsule.dto;


import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TimeCapsuleRequest {

    @NotBlank
    private String title;
    @NotBlank
    private String content;
    @Future
    @NotNull
    private LocalDateTime openAt;
    @NotNull
    private Boolean isPublic;


}


