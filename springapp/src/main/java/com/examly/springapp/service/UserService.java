package com.examly.springapp.service;

import com.examly.springapp.model.User;
import com.examly.springapp.dto.UserRegisterRequestDTO;
import com.examly.springapp.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User registerUser(UserRegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already used");
        }
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setRole(User.Role.USER);
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getAllUsers(int page, int size, String sortBy, String sortDir, String search, String role, String status) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        if (search != null && !search.trim().isEmpty()) {
            return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable).getContent();
        }
        
        if (role != null && !role.trim().isEmpty()) {
            User.Role userRole = User.Role.valueOf(role.toUpperCase());
            return userRepository.findByRole(userRole, pageable).getContent();
        }
        
        return userRepository.findAll(pageable).getContent();
    }
    
    public Page<User> getAllUsersPage(int page, int size, String sortBy, String sortDir, String search, String role, String status) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // Handle combined filters
        boolean hasSearch = search != null && !search.trim().isEmpty();
        boolean hasRole = role != null && !role.trim().isEmpty();
        boolean hasStatus = status != null && !status.trim().isEmpty();
        
        if (hasSearch && hasRole) {
            User.Role userRole = User.Role.valueOf(role.toUpperCase());
            return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseAndRole(search, search, userRole, pageable);
        }
        
        if (hasSearch) {
            return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable);
        }
        
        if (hasRole) {
            User.Role userRole = User.Role.valueOf(role.toUpperCase());
            return userRepository.findByRole(userRole, pageable);
        }
        
        return userRepository.findAll(pageable);
    }

    public User updateUserRole(Long id, User.Role role) {
        User user = getUserById(id);
        user.setRole(role);
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    public User updateUserStatus(Long id, String status) {
        User user = getUserById(id);
        user.setStatus(status);
        return userRepository.save(user);
    }

    public User updateUser(Long id, String name, String email) {
        User user = getUserById(id);
        if (email != null && !email.equals(user.getEmail()) && userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already used");
        }
        if (name != null) {
            user.setName(name);
        }
        if (email != null) {
            user.setEmail(email);
        }
        return userRepository.save(user);
    }

    public User updateUserPassword(Long id, String password) {
        User user = getUserById(id);
        if (password != null && !password.trim().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(password));
        }
        return userRepository.save(user);
    }
}
