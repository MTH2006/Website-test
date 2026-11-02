package com.minicaas.controller;

import com.minicaas.dto.ApiResponse;
import com.minicaas.dto.ClusterStatusDto;
import com.minicaas.service.KubernetesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cluster")
public class ClusterController {

    private final KubernetesService kubernetesService;

    public ClusterController(KubernetesService kubernetesService) {
        this.kubernetesService = kubernetesService;
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<ClusterStatusDto>> getClusterStatus() {
        ClusterStatusDto status = kubernetesService.getClusterStatus();
        return ResponseEntity.ok(ApiResponse.ok(status));
    }
}
