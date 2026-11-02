package com.minicaas.controller;

import com.minicaas.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/export/csv/{sessionId}")
    public ResponseEntity<byte[]> exportCsv(@PathVariable UUID sessionId) {
        byte[] csvData = reportService.exportSessionCsv(sessionId);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"demo-report-" + sessionId + ".csv\"")
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(csvData);
    }

    @GetMapping("/export/markdown/{sessionId}")
    public ResponseEntity<byte[]> exportMarkdown(@PathVariable UUID sessionId) {
        byte[] mdData = reportService.exportSessionMarkdown(sessionId);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"demo-report-" + sessionId + ".md\"")
            .contentType(MediaType.parseMediaType("text/markdown"))
            .body(mdData);
    }
}
