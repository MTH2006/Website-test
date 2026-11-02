package com.minicaas.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class DemoTestResultDto {
    private UUID id;
    private String testCode;
    private String testName;
    private String description;
    private String objective;
    private String status;
    private String expectedResult;
    private String actualResult;
    private String executionLog;
    private String technicalEvidence;
    private BigDecimal recordedCpuPercent;
    private BigDecimal recordedMemMb;
    private Instant executedAt;
    private long durationMs;

    public DemoTestResultDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final DemoTestResultDto r = new DemoTestResultDto();
        public Builder id(UUID id) { r.setId(id); return this; }
        public Builder testCode(String s) { r.setTestCode(s); return this; }
        public Builder testName(String s) { r.setTestName(s); return this; }
        public Builder description(String s) { r.setDescription(s); return this; }
        public Builder objective(String s) { r.setObjective(s); return this; }
        public Builder status(String s) { r.setStatus(s); return this; }
        public Builder expectedResult(String s) { r.setExpectedResult(s); return this; }
        public Builder actualResult(String s) { r.setActualResult(s); return this; }
        public Builder executionLog(String s) { r.setExecutionLog(s); return this; }
        public Builder technicalEvidence(String s) { r.setTechnicalEvidence(s); return this; }
        public Builder recordedCpuPercent(BigDecimal b) { r.setRecordedCpuPercent(b); return this; }
        public Builder recordedMemMb(BigDecimal b) { r.setRecordedMemMb(b); return this; }
        public Builder executedAt(Instant t) { r.setExecutedAt(t); return this; }
        public Builder durationMs(long l) { r.setDurationMs(l); return this; }
        public DemoTestResultDto build() { return r; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTestCode() { return testCode; }
    public void setTestCode(String testCode) { this.testCode = testCode; }
    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getObjective() { return objective; }
    public void setObjective(String objective) { this.objective = objective; }
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
    public long getDurationMs() { return durationMs; }
    public void setDurationMs(long durationMs) { this.durationMs = durationMs; }
}
