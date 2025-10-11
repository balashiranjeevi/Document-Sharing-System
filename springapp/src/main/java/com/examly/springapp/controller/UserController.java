package com.examly.springapp.controller;

import com.examly.springapp.dto.UserResponseDTO;
import com.examly.springapp.dto.UserRegisterRequestDTO;
import com.examly.springapp.model.User;
import com.examly.springapp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public UserResponseDTO register(@RequestBody @Valid UserRegisterRequestDTO dto) {
        return new UserResponseDTO(userService.registerUser(dto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public UserResponseDTO getUser(@PathVariable Long id) {
        return new UserResponseDTO(userService.getUserById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers()
                .stream()
                .map(UserResponseDTO::new)
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponseDTO updateUserRole(@PathVariable Long id, @RequestParam User.Role role) {
        return new UserResponseDTO(userService.updateUserRole(id, role));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
