package com.examly.springapp.controller;

import com.examly.springapp.dto.UserResponseDTO;
import com.examly.springapp.dto.UserRegisterRequestDTO;
import com.examly.springapp.model.User;
import com.examly.springapp.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public UserResponseDTO register(@RequestBody @Valid UserRegisterRequestDTO dto) {
        return new UserResponseDTO(userService.registerUser(dto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public UserResponseDTO getUser(@PathVariable @Min(1) Long id) {
        return new UserResponseDTO(userService.getUserById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = "id") @Pattern(regexp = "^(id|name|email|role|createdAt)$") String sortBy,
            @RequestParam(defaultValue = "asc") @Pattern(regexp = "^(asc|desc)$") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @Pattern(regexp = "^(USER|ADMIN)$") String role,
            @RequestParam(required = false) @Pattern(regexp = "^(ACTIVE|INACTIVE)$") String status) {
        Page<User> userPage = userService.getAllUsersPage(page, size, sortBy, sortDir, search, role, status);
        
        List<UserResponseDTO> users = userPage.getContent()
                .stream()
                .map(UserResponseDTO::new)
                .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("users", users);
        response.put("currentPage", userPage.getNumber());
        response.put("totalItems", userPage.getTotalElements());
        response.put("totalPages", userPage.getTotalPages());
        response.put("pageSize", userPage.getSize());
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponseDTO updateUserRole(@PathVariable @Min(1) Long id, @RequestParam User.Role role) {
        return new UserResponseDTO(userService.updateUserRole(id, role));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable @Min(1) Long id) {
        userService.deleteUser(id);
    }
}
