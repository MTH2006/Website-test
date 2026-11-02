package com.minicaas.repository;

import com.minicaas.entity.ApplicationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<ApplicationEntity, UUID> {
    List<ApplicationEntity> findByNamespace_Name(String namespaceName);
    Optional<ApplicationEntity> findByNameAndNamespace_Name(String name, String namespaceName);
}
