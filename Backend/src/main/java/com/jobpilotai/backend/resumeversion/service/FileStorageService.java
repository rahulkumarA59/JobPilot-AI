package com.jobpilotai.backend.resumeversion.service;

import java.util.UUID;

/**
 * File storage abstraction.
 * This task only defines the interface.
 */
public interface FileStorageService {

    /**
     * Store file contents/metadata and return a storage id.
     */
    UUID store();

    /**
     * Load the stored file content/stream.
     */
    void load();

    boolean exists();

    /**
     * Logical deletion.
     */
    void deleteLogical();

    String getChecksum();
}

