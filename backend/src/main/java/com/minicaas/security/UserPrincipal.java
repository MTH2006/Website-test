package com.minicaas.security;

import com.minicaas.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

public class UserPrincipal implements UserDetails {

    private final UUID id;
    private final String username;
    private final String password;
    private final String fullName;
    private final String roleName;
    private final String teamName;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(
        UUID id,
        String username,
        String password,
        String fullName,
        String roleName,
        String teamName,
        Collection<? extends GrantedAuthority> authorities
    ) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.roleName = roleName;
        this.teamName = teamName;
        this.authorities = authorities;
    }

    public static UserPrincipal create(User user) {
        String roleName = user.getRole().getName();
        GrantedAuthority authority = new SimpleGrantedAuthority(roleName);
        String team = user.getTeam() != null ? user.getTeam().getName() : null;

        return new UserPrincipal(
            user.getId(),
            user.getUsername(),
            user.getPasswordHash(),
            user.getFullName(),
            roleName,
            team,
            Collections.singletonList(authority)
        );
    }

    public UUID getId() { return id; }
    public String getFullName() { return fullName; }
    public String getRoleName() { return roleName; }
    public String getTeamName() { return teamName; }

    public boolean isAdmin() {
        return "ROLE_ADMIN".equals(roleName);
    }

    @Override
    public String getUsername() { return username; }

    @Override
    public String getPassword() { return password; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
