package com.minicaas.config;

import com.minicaas.entity.Role;
import com.minicaas.entity.Team;
import com.minicaas.entity.User;
import com.minicaas.repository.RoleRepository;
import com.minicaas.repository.TeamRepository;
import com.minicaas.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TeamRepository teamRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
        UserRepository userRepository,
        RoleRepository roleRepository,
        TeamRepository teamRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.teamRepository = teamRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info("Khởi tạo và đồng bộ hóa tài khoản người dùng...");

        ensureUser("admin", "admin123", "System Administrator", "admin@minicaas.local", "ROLE_ADMIN", null);
        ensureUser("teama_dev", "teama123", "Team A Developer", "dev-a@minicaas.local", "ROLE_TEAM_MEMBER", "team-a");
        ensureUser("teamb_dev", "teamb123", "Team B Developer", "dev-b@minicaas.local", "ROLE_TEAM_MEMBER", "team-b");
        ensureUser("teamc_dev", "teamc123", "Team C Developer", "dev-c@minicaas.local", "ROLE_TEAM_MEMBER", "team-c");

        log.info("Đã đồng bộ hóa 4 tài khoản (admin, teama_dev, teamb_dev, teamc_dev) với BCrypt!");
    }

    private void ensureUser(String username, String rawPassword, String fullName, String email, String roleName, String teamName) {
        Optional<User> existing = userRepository.findByUsername(username);
        User user = existing.orElseGet(User::new);
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setFullName(fullName);
        user.setEmail(email);
        user.setActive(true);

        roleRepository.findByName(roleName).ifPresent(user::setRole);
        if (teamName != null) {
            teamRepository.findByName(teamName).ifPresent(user::setTeam);
        } else {
            user.setTeam(null);
        }

        userRepository.save(user);
    }
}
