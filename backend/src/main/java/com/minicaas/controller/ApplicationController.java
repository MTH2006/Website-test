package com.minicaas.controller;

import com.minicaas.dto.ApiResponse;
import com.minicaas.dto.ApplicationCreateRequest;
import com.minicaas.dto.ApplicationDto;
import com.minicaas.security.UserPrincipal;
import com.minicaas.service.ApplicationService;
import com.minicaas.service.KubernetesService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final KubernetesService kubernetesService;

    public ApplicationController(ApplicationService applicationService, KubernetesService kubernetesService) {
        this.applicationService = applicationService;
        this.kubernetesService = kubernetesService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getApplications(
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        String scope = principal.isAdmin() ? "all" : principal.getTeamName();
        List<ApplicationDto> apps = applicationService.getApplications(scope);
        return ResponseEntity.ok(ApiResponse.ok(apps));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ApplicationDto>> getApplicationById(@PathVariable UUID id) {
        ApplicationDto app = applicationService.getApplicationById(id);
        return ResponseEntity.ok(ApiResponse.ok(app));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ApplicationDto>> createApplication(
        @Valid @RequestBody ApplicationCreateRequest request,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        String scope = principal.isAdmin() ? "all" : principal.getTeamName();
        ApplicationDto created = applicationService.createApplication(request, scope);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Triển khai ứng dụng thành công", created));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteApplication(
        @PathVariable UUID id,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        String scope = principal.isAdmin() ? "all" : principal.getTeamName();
        applicationService.deleteApplication(id, scope);
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa ứng dụng thành công", null));
    }

    @GetMapping("/{id}/pods/{podName}/logs")
    public ResponseEntity<ApiResponse<String>> getPodLogs(
        @PathVariable UUID id,
        @PathVariable String podName
    ) {
        ApplicationDto app = applicationService.getApplicationById(id);
        String logs = kubernetesService.getPodLogs(app.getNamespace(), podName);
        return ResponseEntity.ok(ApiResponse.ok(logs));
    }
}
