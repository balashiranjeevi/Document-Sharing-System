package com.examly.springapp.controller;

import com.examly.springapp.dto.LoginRequestDTO;
import com.examly.springapp.dto.LoginResponseDTO;
import com.examly.springapp.dto.UserRegisterRequestDTO;
import com.examly.springapp.dto.UserResponseDTO;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegisterRequestDTO registerRequest) {
        try {
            System.out.println("Registration attempt for email: " + registerRequest.getEmail());

            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                System.out.println("Email already exists: " + registerRequest.getEmail());
                return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
            }

            User user = new User();
            user.setName(registerRequest.getName());
            user.setEmail(registerRequest.getEmail());
            user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
            user.setRole(User.Role.USER);

            System.out.println("Saving user to database...");
            User savedUser = userRepository.save(user);
            System.out.println("User saved with ID: " + savedUser.getId());

            String token = jwtUtil.generateToken(savedUser.getEmail());
            System.out.println("JWT token generated successfully");

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new LoginResponseDTO(token, savedUser));
        } catch (Exception e) {
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            System.out.println("Login attempt for email: " + loginRequest.getEmail());
            
            if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
                System.out.println("Missing email or password");
                return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
            }

            java.util.Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

            if (userOpt.isEmpty()) {
                System.out.println("User not found: " + loginRequest.getEmail());
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid credentials"));
            }

            User user = userOpt.get();
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
                System.out.println("Password mismatch for user: " + loginRequest.getEmail());
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid credentials"));
            }

            String token = jwtUtil.generateToken(user.getEmail());
            System.out.println("Login successful for user: " + loginRequest.getEmail());

            return ResponseEntity.ok(new LoginResponseDTO(token, user));
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Login failed: " + e.getMessage()));
        }
    }

    @GetMapping("/users/search")
    public ResponseEntity<?> searchUsers(@RequestParam String q) {
        try {
            if (q == null || q.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Search query is required"));
            }

            java.util.List<User> users = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(q, q);

            // Convert to UserResponseDTO list
            java.util.List<UserResponseDTO> userDTOs = users.stream()
                    .map(UserResponseDTO::new)
                    .collect(java.util.stream.Collectors.toList());

            return ResponseEntity.ok(userDTOs);
        } catch (Exception e) {
            System.err.println("User search error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", "User search failed: " + e.getMessage()));
        }
    }
}
