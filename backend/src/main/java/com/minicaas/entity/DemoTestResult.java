package com.minicaas.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "demo_test_results")
public class DemoTestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private DemoSession session;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "test_id", nullable = false)
    private DemoTest test;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "expected_result", columnDefinition = "TEXT")
    private String expectedResult;

    @Column(name = "actual_result", columnDefinition = "TEXT")
    private String actualResult;

    @Column(name = "execution_log", columnDefinition = "TEXT")
    private String executionLog;

    @Column(name = "technical_evidence", columnDefinition = "TEXT")
    private String technicalEvidence;

    @Column(name = "recorded_cpu_percent", precision = 5, scale = 2)
    private BigDecimal recordedCpuPercent = BigDecimal.ZERO;

    @Column(name = "recorded_mem_mb", precision = 8, scale = 2)
    private BigDecimal recordedMemMb = BigDecimal.ZERO;

    @Column(name = "executed_at")
    private Instant executedAt = Instant.now();

    public DemoTestResult() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final DemoTestResult r = new DemoTestResult();
        public Builder session(DemoSession s) { r.setSession(s); return this; }
        public Builder test(DemoTest t) { r.setTest(t); return this; }
        public Builder status(String s) { r.setStatus(s); return this; }
        public Builder expectedResult(String e) { r.setExpectedResult(e); return this; }
        public Builder actualResult(String a) { r.setActualResult(a); return this; }
        public Builder executionLog(String l) { r.setExecutionLog(l); return this; }
        public Builder technicalEvidence(String e) { r.setTechnicalEvidence(e); return this; }
        public Builder executedAt(Instant t) { r.setExecutedAt(t); return this; }
        public DemoTestResult build() { return r; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public DemoSession getSession() { return session; }
    public void setSession(DemoSession session) { this.session = session; }

    public DemoTest getTest() { return test; }
    public void setTest(DemoTest test) { this.test = test; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getExpectedResult() { return expectedResult; }
    public void setExpectedResult(String expectedResult) { this.expectedResult = expectedResult; }

    public String getActualResult() { return actualResult; }
    public void setActualResult(String actualResult) { this.actualResult = actualResult; }

    public String getExecutionLog() { return executionLog; }
    public void setExecutionLog(String executionLog) { this.executionLog = executionLog; }

    public String getTechnicalEvidence() { return technicalEvidence; }
    public void setTechnicalEvidence(String technicalEvidence) { this.technicalEvidence = technicalEvidence; }

    public BigDecimal getRecordedCpuPercent() { return recordedCpuPercent; }
    public void setRecordedCpuPercent(BigDecimal recordedCpuPercent) { this.recordedCpuPercent = recordedCpuPercent; }

    public BigDecimal getRecordedMemMb() { return recordedMemMb; }
    public void setRecordedMemMb(BigDecimal recordedMemMb) { this.recordedMemMb = recordedMemMb; }

    public Instant getExecutedAt() { return executedAt; }
    public void setExecutedAt(Instant executedAt) { this.executedAt = executedAt; }
}
