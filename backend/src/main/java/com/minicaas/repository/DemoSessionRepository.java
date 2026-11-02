package com.minicaas.repository;

import com.minicaas.entity.DemoSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface DemoSessionRepository extends JpaRepository<DemoSession, UUID> {
    List<DemoSession> findAllByOrderByStartTimeDesc();
}
