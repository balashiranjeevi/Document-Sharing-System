package com.examly.springapp.repository;

import com.examly.springapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    java.util.Optional<User> findByEmail(String email);
    java.util.List<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email);
}
