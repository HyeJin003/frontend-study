package com.hjr.myproject.domain.match.scheduler;

import com.hjr.myproject.domain.match.entity.RandomMatch;
import com.hjr.myproject.domain.match.repository.RandomMatchRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Transactional
public class RandomMatchScheduler {

    private final RandomMatchRepository randomMatchRepository;

    @Scheduled(fixedRate= 3600000)
    public void scheduler(){
        List<RandomMatch> expiredMatches = randomMatchRepository.findByIsActiveTrueAndExpiresAtBefore(LocalDateTime.now());

        for(RandomMatch match: expiredMatches){
            match.deactivate();
        }
    }
}
