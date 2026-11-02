package com.minicaas.dto;

public class AuthResponse {
    private String token;
    private UserDto user;

    public AuthResponse() {}
    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final AuthResponse r = new AuthResponse();
        public Builder token(String t) { r.setToken(t); return this; }
        public Builder user(UserDto u) { r.setUser(u); return this; }
        public AuthResponse build() { return r; }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
}
