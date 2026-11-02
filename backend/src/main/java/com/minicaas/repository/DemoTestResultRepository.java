package com.minicaas.repository;

import com.minicaas.entity.DemoTestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface DemoTestResultRepository extends JpaRepository<DemoTestResult, UUID> {
    List<DemoTestResult> findBySession_IdOrderByExecutedAtAsc(UUID sessionId);
}
