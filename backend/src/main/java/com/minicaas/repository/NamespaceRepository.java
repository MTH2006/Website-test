package com.minicaas.repository;

import com.minicaas.entity.NamespaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NamespaceRepository extends JpaRepository<NamespaceEntity, UUID> {
    Optional<NamespaceEntity> findByName(String name);
}
