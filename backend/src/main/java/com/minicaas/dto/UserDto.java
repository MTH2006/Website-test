package com.minicaas.dto;

import java.util.UUID;

public class UserDto {
    private UUID id;
    private String username;
    private String fullName;
    private String email;
    private String role;
    private String teamName;
    private String namespaceScope;

    public UserDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final UserDto u = new UserDto();
        public Builder id(UUID id) { u.setId(id); return this; }
        public Builder username(String username) { u.setUsername(username); return this; }
        public Builder fullName(String fullName) { u.setFullName(fullName); return this; }
        public Builder email(String email) { u.setEmail(email); return this; }
        public Builder role(String role) { u.setRole(role); return this; }
        public Builder teamName(String teamName) { u.setTeamName(teamName); return this; }
        public Builder namespaceScope(String scope) { u.setNamespaceScope(scope); return this; }
        public UserDto build() { return u; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public String getNamespaceScope() { return namespaceScope; }
    public void setNamespaceScope(String namespaceScope) { this.namespaceScope = namespaceScope; }
}
