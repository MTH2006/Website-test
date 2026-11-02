package com.minicaas.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "resource_quotas")
public class ResourceQuotaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "namespace_id", nullable = false)
    private NamespaceEntity namespace;

    @Column(name = "cpu_request", nullable = false, length = 20)
    private String cpuRequest;

    @Column(name = "cpu_limit", nullable = false, length = 20)
    private String cpuLimit;

    @Column(name = "memory_request", nullable = false, length = 20)
    private String memoryRequest;

    @Column(name = "memory_limit", nullable = false, length = 20)
    private String memoryLimit;

    @Column(name = "max_pods", nullable = false)
    private Integer maxPods;

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public ResourceQuotaEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public NamespaceEntity getNamespace() { return namespace; }
    public void setNamespace(NamespaceEntity namespace) { this.namespace = namespace; }

    public String getCpuRequest() { return cpuRequest; }
    public void setCpuRequest(String cpuRequest) { this.cpuRequest = cpuRequest; }

    public String getCpuLimit() { return cpuLimit; }
    public void setCpuLimit(String cpuLimit) { this.cpuLimit = cpuLimit; }

    public String getMemoryRequest() { return memoryRequest; }
    public void setMemoryRequest(String memoryRequest) { this.memoryRequest = memoryRequest; }

    public String getMemoryLimit() { return memoryLimit; }
    public void setMemoryLimit(String memoryLimit) { this.memoryLimit = memoryLimit; }

    public Integer getMaxPods() { return maxPods; }
    public void setMaxPods(Integer maxPods) { this.maxPods = maxPods; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
