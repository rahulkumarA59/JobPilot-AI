package com.jobpilotai.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EntityScan(basePackages = "com.jobpilotai.backend")
@EnableScheduling
public class JobPilotBackendApplication {



    public static void main(String[] args) {
        SpringApplication.run(JobPilotBackendApplication.class, args);
    }
}
