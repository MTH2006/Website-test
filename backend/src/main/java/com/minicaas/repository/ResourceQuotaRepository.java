package com.minicaas.repository;

import com.minicaas.entity.ResourceQuotaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResourceQuotaRepository extends JpaRepository<ResourceQuotaEntity, UUID> {
    Optional<ResourceQuotaEntity> findByNamespace_Name(String namespaceName);
}
