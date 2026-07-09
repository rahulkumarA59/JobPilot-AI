package com.jobpilotai.backend.ai.mapper;

import org.mapstruct.Mapper;

/**
 * Mapper for AI DTOs.
 * Since most AI outputs are generated deterministically rather than mapped
 * from entities, this mapper serves as a foundation for any complex mapping
 * needed between internal AI processing models and external DTOs.
 */
@Mapper(componentModel = "spring")
public interface AIDtoMapper {
    // Add mapping methods as needed
}
