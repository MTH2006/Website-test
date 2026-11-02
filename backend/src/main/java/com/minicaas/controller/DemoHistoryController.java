package com.minicaas.controller;

import com.minicaas.dto.ApiResponse;
import com.minicaas.dto.DemoSessionDto;
import com.minicaas.service.DemoHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/demo-history")
public class DemoHistoryController {

    private final DemoHistoryService demoHistoryService;

    public DemoHistoryController(DemoHistoryService demoHistoryService) {
        this.demoHistoryService = demoHistoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DemoSessionDto>>> getAllSessions() {
        List<DemoSessionDto> sessions = demoHistoryService.getAllSessions();
        return ResponseEntity.ok(ApiResponse.ok(sessions));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DemoSessionDto>> getSessionDetails(@PathVariable UUID id) {
        DemoSessionDto session = demoHistoryService.getSessionDetails(id);
        return ResponseEntity.ok(ApiResponse.ok(session));
    }

    @PostMapping("/compare")
    public ResponseEntity<ApiResponse<Map<String, Object>>> compareSessions(
        @RequestParam UUID sessionA,
        @RequestParam UUID sessionB
    ) {
        Map<String, Object> comparison = demoHistoryService.compareSessions(sessionA, sessionB);
        return ResponseEntity.ok(ApiResponse.ok(comparison));
    }
}
