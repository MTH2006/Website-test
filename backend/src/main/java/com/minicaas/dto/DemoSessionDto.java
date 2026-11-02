package com.minicaas.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class DemoSessionDto {
    private UUID id;
    private String sessionName;
    private String executedByUsername;
    private Instant startTime;
    private Instant endTime;
    private String status;
    private String overallConclusion;
    private int totalTests;
    private int passedTests;
    private int failedTests;
    private List<DemoTestResultDto> testResults;

    public DemoSessionDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final DemoSessionDto s = new DemoSessionDto();
        public Builder id(UUID id) { s.setId(id); return this; }
        public Builder sessionName(String n) { s.setSessionName(n); return this; }
        public Builder executedByUsername(String u) { s.setExecutedByUsername(u); return this; }
        public Builder startTime(Instant t) { s.setStartTime(t); return this; }
        public Builder endTime(Instant t) { s.setEndTime(t); return this; }
        public Builder status(String st) { s.setStatus(st); return this; }
        public Builder overallConclusion(String c) { s.setOverallConclusion(c); return this; }
        public Builder totalTests(int i) { s.setTotalTests(i); return this; }
        public Builder passedTests(int i) { s.setPassedTests(i); return this; }
        public Builder failedTests(int i) { s.setFailedTests(i); return this; }
        public Builder testResults(List<DemoTestResultDto> l) { s.setTestResults(l); return this; }
        public DemoSessionDto build() { return s; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getSessionName() { return sessionName; }
    public void setSessionName(String sessionName) { this.sessionName = sessionName; }
    public String getExecutedByUsername() { return executedByUsername; }
    public void setExecutedByUsername(String executedByUsername) { this.executedByUsername = executedByUsername; }
    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }
    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getOverallConclusion() { return overallConclusion; }
    public void setOverallConclusion(String overallConclusion) { this.overallConclusion = overallConclusion; }
    public int getTotalTests() { return totalTests; }
    public void setTotalTests(int totalTests) { this.totalTests = totalTests; }
    public int getPassedTests() { return passedTests; }
    public void setPassedTests(int passedTests) { this.passedTests = passedTests; }
    public int getFailedTests() { return failedTests; }
    public void setFailedTests(int failedTests) { this.failedTests = failedTests; }
    public List<DemoTestResultDto> getTestResults() { return testResults; }
    public void setTestResults(List<DemoTestResultDto> testResults) { this.testResults = testResults; }
}
