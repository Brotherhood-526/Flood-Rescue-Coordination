package com.rescue.backend.repository;

import com.rescue.backend.model.RequestImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RequestImageRepository extends JpaRepository<RequestImage, UUID> {
}
