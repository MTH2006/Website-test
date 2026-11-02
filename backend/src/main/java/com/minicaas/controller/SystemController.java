package com.minicaas.controller;

import com.minicaas.dto.ApiResponse;
import com.minicaas.entity.SystemSetting;
import com.minicaas.repository.SystemSettingRepository;
import com.minicaas.service.KubernetesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/system")
public class SystemController {

    private final KubernetesService kubernetesService;
    private final SystemSettingRepository systemSettingRepository;

    public SystemController(KubernetesService kubernetesService, SystemSettingRepository systemSettingRepository) {
        this.kubernetesService = kubernetesService;
        this.systemSettingRepository = systemSettingRepository;
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("backendPort", 8088);
        health.put("databasePort", 5433);
        health.put("databaseStatus", "CONNECTED");
        health.put("kubernetesStatus", "CONNECTED");
        health.put("clusterName", "caas-cluster");
        return ResponseEntity.ok(ApiResponse.ok(health));
    }

    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<List<SystemSetting>>> getSettings() {
        List<SystemSetting> settings = systemSettingRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok(settings));
    }
}
