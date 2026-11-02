package com.minicaas.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "demo_sessions")
public class DemoSession {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "session_name", nullable = false, length = 100)
    private String sessionName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "executed_by")
    private User executedBy;

    @Column(name = "start_time")
    private Instant startTime = Instant.now();

    @Column(name = "end_time")
    private Instant endTime;

    @Column(length = 30)
    private String status = "IN_PROGRESS";

    @Column(name = "overall_conclusion", columnDefinition = "TEXT")
    private String overallConclusion;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public DemoSession() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final DemoSession s = new DemoSession();
        public Builder sessionName(String n) { s.setSessionName(n); return this; }
        public Builder executedBy(User u) { s.setExecutedBy(u); return this; }
        public Builder startTime(Instant t) { s.setStartTime(t); return this; }
        public Builder status(String st) { s.setStatus(st); return this; }
        public DemoSession build() { return s; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getSessionName() { return sessionName; }
    public void setSessionName(String sessionName) { this.sessionName = sessionName; }

    public User getExecutedBy() { return executedBy; }
    public void setExecutedBy(User executedBy) { this.executedBy = executedBy; }

    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }

    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOverallConclusion() { return overallConclusion; }
    public void setOverallConclusion(String overallConclusion) { this.overallConclusion = overallConclusion; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
