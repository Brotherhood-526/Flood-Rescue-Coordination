package com.rescue.backend.model.dao;

import com.rescue.backend.model.bean.RequestImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RequestImageDAO extends JpaRepository<RequestImage, UUID> {
}
