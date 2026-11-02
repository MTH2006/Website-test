package com.minicaas.controller;

import com.minicaas.dto.ApiResponse;
import com.minicaas.dto.SecurityPolicyStatusDto;
import com.minicaas.service.KubernetesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/security")
public class SecurityPolicyController {

    private final KubernetesService kubernetesService;

    public SecurityPolicyController(KubernetesService kubernetesService) {
        this.kubernetesService = kubernetesService;
    }

    @GetMapping("/policies")
    public ResponseEntity<ApiResponse<SecurityPolicyStatusDto>> getSecurityPolicies() {
        List<SecurityPolicyStatusDto.NetworkPolicyItem> networkPolicies = Arrays.asList(
            SecurityPolicyStatusDto.NetworkPolicyItem.builder()
                .name("default-deny-ingress").namespace("team-a").type("Ingress")
                .description("Chặn toàn bộ lưu lượng vào team-a trừ khi có quy tắc mở cụ thể").build(),
            SecurityPolicyStatusDto.NetworkPolicyItem.builder()
                .name("default-deny-ingress").namespace("team-b").type("Ingress")
                .description("Chặn toàn bộ lưu lượng vào team-b trừ khi có quy tắc mở cụ thể").build(),
            SecurityPolicyStatusDto.NetworkPolicyItem.builder()
                .name("default-deny-ingress").namespace("team-c").type("Ingress")
                .description("Chặn toàn bộ lưu lượng vào team-c trừ khi có quy tắc mở cụ thể").build()
        );

        List<SecurityPolicyStatusDto.RbacItem> rbacBindings = Arrays.asList(
            SecurityPolicyStatusDto.RbacItem.builder()
                .roleName("team-developer-role").namespace("team-a").serviceAccount("team-a-sa")
                .verbs(Arrays.asList("get", "list", "watch", "create", "delete"))
                .resources(Arrays.asList("pods", "deployments", "services")).build(),
            SecurityPolicyStatusDto.RbacItem.builder()
                .roleName("team-developer-role").namespace("team-b").serviceAccount("team-b-sa")
                .verbs(Arrays.asList("get", "list", "watch", "create", "delete"))
                .resources(Arrays.asList("pods", "deployments", "services")).build(),
            SecurityPolicyStatusDto.RbacItem.builder()
                .roleName("team-developer-role").namespace("team-c").serviceAccount("team-c-sa")
                .verbs(Arrays.asList("get", "list", "watch", "create", "delete"))
                .resources(Arrays.asList("pods", "deployments", "secrets")).build()
        );

        List<SecurityPolicyStatusDto.AdmissionRuleItem> admissionRules = Arrays.asList(
            SecurityPolicyStatusDto.AdmissionRuleItem.builder()
                .name("image-whitelist-policy").status("ENFORCED")
                .ruleDescription("Chỉ cho phép các Image: nginx, alpine, busybox, redis").build()
        );

        SecurityPolicyStatusDto dto = SecurityPolicyStatusDto.builder()
            .calicoEnforced(true)
            .defaultDenyIngressActive(true)
            .admissionPolicyActive(true)
            .networkPolicies(networkPolicies)
            .rbacBindings(rbacBindings)
            .admissionRules(admissionRules)
            .build();

        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/test-rbac")
    public ResponseEntity<ApiResponse<Boolean>> testRbacPermission(
        @RequestParam String serviceAccount,
        @RequestParam String namespace,
        @RequestParam String verb,
        @RequestParam String resource
    ) {
        boolean allowed = kubernetesService.checkRbacCanI(serviceAccount, namespace, verb, resource, "");
        return ResponseEntity.ok(ApiResponse.ok(allowed));
    }
}
