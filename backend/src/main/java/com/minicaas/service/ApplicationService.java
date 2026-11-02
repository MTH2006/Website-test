package com.minicaas.service;

import com.minicaas.dto.ApplicationCreateRequest;
import com.minicaas.dto.ApplicationDto;
import com.minicaas.dto.PodDto;
import com.minicaas.entity.ApplicationEntity;
import com.minicaas.entity.NamespaceEntity;
import com.minicaas.repository.ApplicationRepository;
import com.minicaas.repository.NamespaceRepository;
import io.fabric8.kubernetes.client.KubernetesClientException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private static final Logger log = LoggerFactory.getLogger(ApplicationService.class);

    private final ApplicationRepository applicationRepository;
    private final NamespaceRepository namespaceRepository;
    private final KubernetesService kubernetesService;

    public ApplicationService(
        ApplicationRepository applicationRepository,
        NamespaceRepository namespaceRepository,
        KubernetesService kubernetesService
    ) {
        this.applicationRepository = applicationRepository;
        this.namespaceRepository = namespaceRepository;
        this.kubernetesService = kubernetesService;
    }

    public List<ApplicationDto> getApplications(String namespaceScope) {
        List<ApplicationEntity> apps;
        if ("all".equalsIgnoreCase(namespaceScope) || namespaceScope == null) {
            apps = applicationRepository.findAll();
        } else {
            apps = applicationRepository.findByNamespace_Name(namespaceScope);
        }

        return apps.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ApplicationDto getApplicationById(UUID id) {
        ApplicationEntity app = applicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ứng dụng không tồn tại"));
        return mapToDto(app);
    }

    @Transactional
    public ApplicationDto createApplication(ApplicationCreateRequest request, String userNamespaceScope) {
        if (!"all".equalsIgnoreCase(userNamespaceScope) && !request.getNamespace().equals(userNamespaceScope)) {
            throw new RuntimeException("Truy cập bị từ chối: Bạn chỉ được phép triển khai ứng dụng trong namespace: " + userNamespaceScope);
        }

        NamespaceEntity nsEntity = namespaceRepository.findByName(request.getNamespace())
            .orElseThrow(() -> new RuntimeException("Namespace không tồn tại: " + request.getNamespace()));

        try {
            kubernetesService.deployApplication(
                request.getName(),
                request.getNamespace(),
                request.getImage(),
                request.getReplicas(),
                request.getCpuRequest(),
                request.getCpuLimit(),
                request.getMemoryRequest(),
                request.getMemoryLimit(),
                request.getContainerPort()
            );
        } catch (KubernetesClientException kce) {
            log.error("Kubernetes từ chối triển khai: {} (Code: {})", kce.getMessage(), kce.getCode());
            throw new RuntimeException("Kubernetes từ chối triển khai: " + kce.getMessage());
        }

        ApplicationEntity entity = applicationRepository.findByNameAndNamespace_Name(request.getName(), request.getNamespace())
            .orElseGet(() -> ApplicationEntity.builder()
                .name(request.getName())
                .namespace(nsEntity)
                .build());

        entity.setContainerImage(request.getImage());
        entity.setReplicas(request.getReplicas());
        entity.setCpuRequest(request.getCpuRequest());
        entity.setCpuLimit(request.getCpuLimit());
        entity.setMemoryRequest(request.getMemoryRequest());
        entity.setMemoryLimit(request.getMemoryLimit());
        entity.setContainerPort(request.getContainerPort());
        entity.setStatus("RUNNING");

        ApplicationEntity saved = applicationRepository.save(entity);
        log.info("Đã lưu metadata ứng dụng {} vào Database và triển khai lên K8s", request.getName());
        return mapToDto(saved);
    }

    @Transactional
    public void deleteApplication(UUID id, String userNamespaceScope) {
        ApplicationEntity app = applicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ứng dụng không tồn tại"));

        if (!"all".equalsIgnoreCase(userNamespaceScope) && !app.getNamespace().getName().equals(userNamespaceScope)) {
            throw new RuntimeException("Truy cập bị từ chối: Bạn không có quyền xóa ứng dụng của nhóm khác");
        }

        kubernetesService.deleteApplication(app.getName(), app.getNamespace().getName());
        applicationRepository.delete(app);
        log.info("Đã xóa ứng dụng {} khỏi Kubernetes và Database", app.getName());
    }

    private ApplicationDto mapToDto(ApplicationEntity entity) {
        List<PodDto> livePods = kubernetesService.getPods(entity.getNamespace().getName()).stream()
            .filter(p -> p.getName().startsWith(entity.getName()))
            .collect(Collectors.toList());

        int ready = (int) livePods.stream().filter(p -> "Running".equalsIgnoreCase(p.getStatus())).count();

        return ApplicationDto.builder()
            .id(entity.getId())
            .name(entity.getName())
            .namespace(entity.getNamespace().getName())
            .containerImage(entity.getContainerImage())
            .replicas(entity.getReplicas())
            .readyReplicas(ready)
            .cpuRequest(entity.getCpuRequest())
            .cpuLimit(entity.getCpuLimit())
            .memoryRequest(entity.getMemoryRequest())
            .memoryLimit(entity.getMemoryLimit())
            .containerPort(entity.getContainerPort())
            .status(ready > 0 ? "RUNNING" : entity.getStatus())
            .createdAt(entity.getCreatedAt())
            .pods(livePods)
            .build();
    }
}
