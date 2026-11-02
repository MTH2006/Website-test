package com.minicaas.service;

import com.minicaas.dto.AuthRequest;
import com.minicaas.dto.AuthResponse;
import com.minicaas.dto.UserDto;
import com.minicaas.entity.User;
import com.minicaas.repository.UserRepository;
import com.minicaas.security.JwtTokenProvider;
import com.minicaas.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    public AuthService(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String token = tokenProvider.generateToken(principal);

        User user = userRepository.findByUsername(principal.getUsername())
            .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        String namespaceScope = user.getTeam() != null ? user.getTeam().getName() : "all";

        UserDto userDto = UserDto.builder()
            .id(user.getId())
            .username(user.getUsername())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .role(user.getRole().getName())
            .teamName(user.getTeam() != null ? user.getTeam().getName() : null)
            .namespaceScope(namespaceScope)
            .build();

        log.info("Người dùng '{}' đăng nhập thành công với vai trò: {}", user.getUsername(), user.getRole().getName());
        return AuthResponse.builder()
            .token(token)
            .user(userDto)
            .build();
    }

    public UserDto getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RuntimeException("Chưa đăng nhập");
        }

        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        User user = userRepository.findByUsername(principal.getUsername())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng hiện tại"));

        String namespaceScope = user.getTeam() != null ? user.getTeam().getName() : "all";

        return UserDto.builder()
            .id(user.getId())
            .username(user.getUsername())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .role(user.getRole().getName())
            .teamName(user.getTeam() != null ? user.getTeam().getName() : null)
            .namespaceScope(namespaceScope)
            .build();
    }
}
