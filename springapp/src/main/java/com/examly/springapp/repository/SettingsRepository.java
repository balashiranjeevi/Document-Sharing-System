package com.examly.springapp.repository;

import com.examly.springapp.model.Settings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SettingsRepository extends JpaRepository<Settings, Long> {
    // Since we only have one settings record, we can use findAll().get(0) or create
    // a custom method
    // For simplicity, we'll use the default methods
}
