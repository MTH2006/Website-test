package com.minicaas.controller;

import com.minicaas.dto.ApiResponse;
import com.minicaas.dto.DemoSessionDto;
import com.minicaas.dto.DemoTestResultDto;
import com.minicaas.entity.DemoTest;
import com.minicaas.security.UserPrincipal;
import com.minicaas.service.DemoLabService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/demo-lab")
public class DemoLabController {

    private final DemoLabService demoLabService;

    public DemoLabController(DemoLabService demoLabService) {
        this.demoLabService = demoLabService;
    }

    @GetMapping("/tests")
    public ResponseEntity<ApiResponse<List<DemoTest>>> getAvailableTests() {
        List<DemoTest> tests = demoLabService.getAvailableTests();
        return ResponseEntity.ok(ApiResponse.ok(tests));
    }

    @PostMapping("/run-test/{testCode}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DemoTestResultDto>> runSingleTest(
        @PathVariable String testCode,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        DemoTestResultDto result = demoLabService.runSingleTest(testCode, principal.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Chạy bài test thành công", result));
    }

    @PostMapping("/run-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DemoSessionDto>> runAllTests(
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        DemoSessionDto session = demoLabService.runAllTests(principal.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Hoàn thành toàn bộ kịch bản kiểm thử", session));
    }

    @PostMapping("/reset")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> resetDemoState() {
        demoLabService.resetDemoState();
        return ResponseEntity.ok(ApiResponse.ok("Khôi phục trạng thái DEMO ban đầu an toàn thành công", null));
    }
}
