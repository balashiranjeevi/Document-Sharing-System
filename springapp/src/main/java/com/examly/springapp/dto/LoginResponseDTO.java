package com.examly.springapp.dto;

import com.examly.springapp.model.User;

public class LoginResponseDTO {
    private String token;
    private UserResponseDTO user;

    public LoginResponseDTO(String token, User user) {
        this.token = token;
        this.user = new UserResponseDTO(user);
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserResponseDTO getUser() {
        return user;
    }

    public void setUser(UserResponseDTO user) {
        this.user = user;
    }
}