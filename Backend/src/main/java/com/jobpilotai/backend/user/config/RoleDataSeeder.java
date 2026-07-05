package com.jobpilotai.backend.user.config;

import com.jobpilotai.backend.user.domain.Role;
import com.jobpilotai.backend.user.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class RoleDataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public RoleDataSeeder(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        createRoleIfMissing("ROLE_USER", "Default application user");
        createRoleIfMissing("ROLE_ADMIN", "Application administrator");
    }

    private void createRoleIfMissing(String name, String description) {
        roleRepository.findByName(name).orElseGet(() -> {
            Role role = new Role();
            role.setName(name);
            role.setDescription(description);
            return roleRepository.save(role);
        });
    }
}
