package com.jobpilotai.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.jobpilotai.backend")
public class JobPilotBackendApplication {



    public static void main(String[] args) {
        SpringApplication.run(JobPilotBackendApplication.class, args);
    }
}
