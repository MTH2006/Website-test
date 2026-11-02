package com.minicaas.service;

import com.minicaas.dto.DemoSessionDto;
import com.minicaas.dto.DemoTestResultDto;
import com.minicaas.entity.DemoSession;
import com.minicaas.entity.DemoTestResult;
import com.minicaas.repository.DemoSessionRepository;
import com.minicaas.repository.DemoTestResultRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DemoHistoryService {

    private final DemoSessionRepository demoSessionRepository;
    private final DemoTestResultRepository demoTestResultRepository;

    public DemoHistoryService(
        DemoSessionRepository demoSessionRepository,
        DemoTestResultRepository demoTestResultRepository
    ) {
        this.demoSessionRepository = demoSessionRepository;
        this.demoTestResultRepository = demoTestResultRepository;
    }

    public List<DemoSessionDto> getAllSessions() {
        return demoSessionRepository.findAllByOrderByStartTimeDesc().stream()
            .map(this::mapSummaryDto)
            .collect(Collectors.toList());
    }

    public DemoSessionDto getSessionDetails(UUID sessionId) {
        DemoSession session = demoSessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy phiên DEMO"));

        List<DemoTestResult> results = demoTestResultRepository.findBySession_IdOrderByExecutedAtAsc(sessionId);

        int passed = (int) results.stream().filter(r -> "PASSED".equalsIgnoreCase(r.getStatus())).count();
        int failed = (int) results.stream().filter(r -> "FAILED".equalsIgnoreCase(r.getStatus())).count();

        List<DemoTestResultDto> resultDtos = results.stream().map(r -> DemoTestResultDto.builder()
            .id(r.getId())
            .testCode(r.getTest().getTestCode())
            .testName(r.getTest().getName())
            .description(r.getTest().getDescription())
            .objective(r.getTest().getObjective())
            .status(r.getStatus())
            .expectedResult(r.getExpectedResult())
            .actualResult(r.getActualResult())
            .executionLog(r.getExecutionLog())
            .technicalEvidence(r.getTechnicalEvidence())
            .recordedCpuPercent(r.getRecordedCpuPercent())
            .recordedMemMb(r.getRecordedMemMb())
            .executedAt(r.getExecutedAt())
            .build()
        ).collect(Collectors.toList());

        return DemoSessionDto.builder()
            .id(session.getId())
            .sessionName(session.getSessionName())
            .executedByUsername(session.getExecutedBy() != null ? session.getExecutedBy().getUsername() : "Admin")
            .startTime(session.getStartTime())
            .endTime(session.getEndTime())
            .status(session.getStatus())
            .overallConclusion(session.getOverallConclusion())
            .totalTests(results.size())
            .passedTests(passed)
            .failedTests(failed)
            .testResults(resultDtos)
            .build();
    }

    public Map<String, Object> compareSessions(UUID sessionAId, UUID sessionBId) {
        DemoSessionDto sessionA = getSessionDetails(sessionAId);
        DemoSessionDto sessionB = getSessionDetails(sessionBId);

        Map<String, Object> comparison = new HashMap<>();
        comparison.put("sessionA", sessionA);
        comparison.put("sessionB", sessionB);

        Map<String, String> testComparison = new HashMap<>();
        for (DemoTestResultDto rA : sessionA.getTestResults()) {
            Optional<DemoTestResultDto> matchB = sessionB.getTestResults().stream()
                .filter(rB -> rB.getTestCode().equals(rA.getTestCode())).findFirst();
            if (matchB.isPresent()) {
                testComparison.put(rA.getTestCode(), String.format("A: %s | B: %s", rA.getStatus(), matchB.get().getStatus()));
            }
        }
        comparison.put("testStatusComparison", testComparison);
        return comparison;
    }

    private DemoSessionDto mapSummaryDto(DemoSession session) {
        List<DemoTestResult> results = demoTestResultRepository.findBySession_IdOrderByExecutedAtAsc(session.getId());
        int passed = (int) results.stream().filter(r -> "PASSED".equalsIgnoreCase(r.getStatus())).count();
        int failed = (int) results.stream().filter(r -> "FAILED".equalsIgnoreCase(r.getStatus())).count();

        return DemoSessionDto.builder()
            .id(session.getId())
            .sessionName(session.getSessionName())
            .executedByUsername(session.getExecutedBy() != null ? session.getExecutedBy().getUsername() : "Admin")
            .startTime(session.getStartTime())
            .endTime(session.getEndTime())
            .status(session.getStatus())
            .overallConclusion(session.getOverallConclusion())
            .totalTests(results.size())
            .passedTests(passed)
            .failedTests(failed)
            .build();
    }
}
