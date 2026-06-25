package com.streeteats.status;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling   // needed for auto-decay of stale "open" pins
public class LiveStatusServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(LiveStatusServiceApplication.class, args);
    }
}
