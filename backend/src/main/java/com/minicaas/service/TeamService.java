package com.minicaas.service;

import com.minicaas.dto.ResourceQuotaDto;
import com.minicaas.dto.TeamDto;
import com.minicaas.entity.NamespaceEntity;
import com.minicaas.entity.ResourceQuotaEntity;
import com.minicaas.entity.Team;
import com.minicaas.repository.ApplicationRepository;
import com.minicaas.repository.NamespaceRepository;
import com.minicaas.repository.ResourceQuotaRepository;
import com.minicaas.repository.TeamRepository;
import io.fabric8.kubernetes.api.model.Quantity;
import io.fabric8.kubernetes.api.model.ResourceQuota;
import io.fabric8.kubernetes.api.model.ResourceQuotaBuilder;
import io.fabric8.kubernetes.client.KubernetesClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TeamService {

    private static final Logger log = LoggerFactory.getLogger(TeamService.class);

    private final TeamRepository teamRepository;
    private final NamespaceRepository namespaceRepository;
    private final ResourceQuotaRepository resourceQuotaRepository;
    private final ApplicationRepository applicationRepository;
    private final KubernetesService kubernetesService;
    private final KubernetesClient client;

    public TeamService(
        TeamRepository teamRepository,
        NamespaceRepository namespaceRepository,
        ResourceQuotaRepository resourceQuotaRepository,
        ApplicationRepository applicationRepository,
        KubernetesService kubernetesService,
        KubernetesClient client
    ) {
        this.teamRepository = teamRepository;
        this.namespaceRepository = namespaceRepository;
        this.resourceQuotaRepository = resourceQuotaRepository;
        this.applicationRepository = applicationRepository;
        this.kubernetesService = kubernetesService;
        this.client = client;
    }

    public List<TeamDto> getAllTeams() {
        return teamRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public TeamDto getTeamByName(String name) {
        Team team = teamRepository.findByName(name)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy team: " + name));
        return mapToDto(team);
    }

    private TeamDto mapToDto(Team team) {
        String ns = team.getName();
        ResourceQuotaDto quotaDto = kubernetesService.getNamespaceQuota(ns);
        int appCount = applicationRepository.findByNamespace_Name(ns).size();
        int runningPods = kubernetesService.getPods(ns).size();

        return TeamDto.builder()
            .id(team.getId())
            .name(team.getName())
            .displayName(team.getDisplayName())
            .description(team.getDescription())
            .status(team.getStatus())
            .namespace(ns)
            .quota(quotaDto)
            .runningPodsCount(runningPods)
            .totalDeploymentsCount(appCount)
            .build();
    }

    @Transactional
    public ResourceQuotaDto updateTeamQuota(String teamName, ResourceQuotaDto updateDto) {
        String ns = teamName;
        ResourceQuotaEntity entity = resourceQuotaRepository.findByNamespace_Name(ns)
            .orElseGet(() -> {
                NamespaceEntity nsEntity = namespaceRepository.findByName(ns)
                    .orElseThrow(() -> new RuntimeException("Namespace không tồn tại"));
                ResourceQuotaEntity newEntity = new ResourceQuotaEntity();
                newEntity.setNamespace(nsEntity);
                return newEntity;
            });

        if (updateDto.getCpuRequestLimit() != null) entity.setCpuRequest(updateDto.getCpuRequestLimit());
        if (updateDto.getCpuLimitTotal() != null) entity.setCpuLimit(updateDto.getCpuLimitTotal());
        if (updateDto.getMemoryRequestLimit() != null) entity.setMemoryRequest(updateDto.getMemoryRequestLimit());
        if (updateDto.getMemoryLimitTotal() != null) entity.setMemoryLimit(updateDto.getMemoryLimitTotal());
        if (updateDto.getMaxPods() > 0) entity.setMaxPods(updateDto.getMaxPods());
        entity.setUpdatedAt(Instant.now());
        resourceQuotaRepository.save(entity);

        Map<String, Quantity> hard = new HashMap<>();
        hard.put("requests.cpu", new Quantity(entity.getCpuRequest()));
        hard.put("limits.cpu", new Quantity(entity.getCpuLimit()));
        hard.put("requests.memory", new Quantity(entity.getMemoryRequest()));
        hard.put("limits.memory", new Quantity(entity.getMemoryLimit()));
        hard.put("pods", new Quantity(String.valueOf(entity.getMaxPods())));

        ResourceQuota quota = new ResourceQuotaBuilder()
            .withNewMetadata()
                .withName(teamName + "-quota")
                .withNamespace(ns)
            .endMetadata()
            .withNewSpec()
                .withHard(hard)
            .endSpec()
            .build();

        client.resourceQuotas().inNamespace(ns).resource(quota).createOrReplace();
        log.info("Đã cập nhật ResourceQuota cho nhóm {} trong Kubernetes & Database", teamName);

        return kubernetesService.getNamespaceQuota(ns);
    }
}
