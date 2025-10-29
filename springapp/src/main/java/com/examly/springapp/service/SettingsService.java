package com.examly.springapp.service;

import com.examly.springapp.model.Settings;
import com.examly.springapp.repository.SettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SettingsService {

    @Autowired
    private SettingsRepository settingsRepository;

    public Settings getSettings() {
        List<Settings> settings = settingsRepository.findAll();
        if (settings.isEmpty()) {
            // Create default settings if none exist
            Settings defaultSettings = new Settings();
            return settingsRepository.save(defaultSettings);
        }
        return settings.get(0); // Return the first (and only) settings record
    }

    public Settings updateSettings(Settings updatedSettings) {
        Settings existingSettings = getSettings();

        existingSettings.setMaxStoragePerUser(updatedSettings.getMaxStoragePerUser());
        existingSettings.setAutoDeleteTrashAfter(updatedSettings.getAutoDeleteTrashAfter());
        existingSettings.setRequireEmailVerification(updatedSettings.getRequireEmailVerification());
        existingSettings.setEnableTwoFactorAuth(updatedSettings.getEnableTwoFactorAuth());

        return settingsRepository.save(existingSettings);
    }
}
