package com.jobpilotai.backend.resumeversion.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.UUID;

/**
 * Local file storage implementation for resume files.
 * - Stores files in /uploads/resumes/ directory
 * - Uses UUID-based filenames for uniqueness
 * - Calculates SHA-256 checksum for each file
 * - Supports logical deletion only (never physically deletes)
 */
@Service
public class LocalFileStorageService {

    private static final Logger log = LoggerFactory.getLogger(LocalFileStorageService.class);
    private static final String CHECKSUM_ALGORITHM = "SHA-256";

    private final Path storageDirectory;
    private String currentChecksum;
    private Path currentFilePath;

    public LocalFileStorageService(@Value("${app.storage.resumes.dir:uploads/resumes}") String storageDir) {
        this.storageDirectory = Paths.get(storageDir);
        this.currentChecksum = null;
        this.currentFilePath = null;
        initializeStorageDirectory();
    }

    /**
     * Create storage directory if it doesn't exist
     */
    private void initializeStorageDirectory() {
        try {
            if (!Files.exists(storageDirectory)) {
                Files.createDirectories(storageDirectory);
                log.info("Storage directory created at: {}", storageDirectory.toAbsolutePath());
            }
        } catch (IOException e) {
            log.error("Failed to create storage directory", e);
            throw new RuntimeException("Failed to initialize storage directory", e);
        }
    }

    /**
     * Store file with unique filename and calculate checksum
     *
     * @param file MultipartFile to store
     * @return UUID-based stored filename
     */
    public String storeFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = extractExtension(originalFilename);
        String storedFilename = UUID.randomUUID() + (extension != null ? "." + extension : "");
        currentFilePath = storageDirectory.resolve(storedFilename);

        try {
            // Calculate checksum while writing file
            byte[] fileBytes = file.getBytes();
            this.currentChecksum = calculateChecksum(fileBytes);

            // Write file to storage
            Files.write(currentFilePath, fileBytes);
            log.info("File stored successfully filename={} checksum={} size={}", 
                    storedFilename, currentChecksum, file.getSize());

            return storedFilename;
        } catch (IOException e) {
            log.error("Failed to store file", e);
            throw new IOException("Failed to store file", e);
        }
    }

    /**
     * Calculate SHA-256 checksum of file bytes
     */
    private String calculateChecksum(byte[] fileBytes) {
        try {
            MessageDigest digest = MessageDigest.getInstance(CHECKSUM_ALGORITHM);
            byte[] hashBytes = digest.digest(fileBytes);
            return HexFormat.of().formatHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            log.error("SHA-256 algorithm not available", e);
            throw new RuntimeException("Checksum calculation failed", e);
        }
    }

    /**
     * Get checksum of the last stored file
     */
    public String getChecksum() {
        if (currentChecksum == null) {
            throw new IllegalStateException("No file has been stored yet");
        }
        return currentChecksum;
    }

    /**
     * Get the path of a stored file
     */
    public Path getFilePath(String storedFilename) {
        return storageDirectory.resolve(storedFilename);
    }

    /**
     * Check if a file exists in storage
     */
    public boolean fileExists(String storedFilename) {
        Path filePath = storageDirectory.resolve(storedFilename);
        return Files.exists(filePath);
    }

    /**
     * Logical deletion: rename file to .deleted suffix instead of physically deleting
     * This preserves audit trail and allows recovery if needed
     */
    public void logicalDelete(String storedFilename) {
        try {
            Path filePath = storageDirectory.resolve(storedFilename);
            if (!Files.exists(filePath)) {
                log.warn("File not found for deletion: {}", storedFilename);
                return;
            }

            Path deletedPath = storageDirectory.resolve(storedFilename + ".deleted");
            Files.move(filePath, deletedPath);
            log.info("File logically deleted filename={}", storedFilename);
        } catch (IOException e) {
            log.error("Failed to logically delete file", e);
            throw new RuntimeException("Failed to delete file", e);
        }
    }

    /**
     * Extract file extension from filename
     */
    private String extractExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return null;
        }
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex > 0 && lastDotIndex < filename.length() - 1) {
            return filename.substring(lastDotIndex + 1).toLowerCase();
        }
        return null;
    }
}
