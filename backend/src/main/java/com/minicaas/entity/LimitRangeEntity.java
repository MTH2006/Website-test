package com.minicaas.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "limit_ranges")
public class LimitRangeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "namespace_id", nullable = false)
    private NamespaceEntity namespace;

    @Column(name = "default_cpu_request", length = 20)
    private String defaultCpuRequest;

    @Column(name = "default_cpu_limit", length = 20)
    private String defaultCpuLimit;

    @Column(name = "default_mem_request", length = 20)
    private String defaultMemRequest;

    @Column(name = "default_mem_limit", length = 20)
    private String defaultMemLimit;

    @Column(name = "max_cpu", length = 20)
    private String maxCpu;

    @Column(name = "max_mem", length = 20)
    private String maxMem;

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public LimitRangeEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public NamespaceEntity getNamespace() { return namespace; }
    public void setNamespace(NamespaceEntity namespace) { this.namespace = namespace; }

    public String getDefaultCpuRequest() { return defaultCpuRequest; }
    public void setDefaultCpuRequest(String defaultCpuRequest) { this.defaultCpuRequest = defaultCpuRequest; }

    public String getDefaultCpuLimit() { return defaultCpuLimit; }
    public void setDefaultCpuLimit(String defaultCpuLimit) { this.defaultCpuLimit = defaultCpuLimit; }

    public String getDefaultMemRequest() { return defaultMemRequest; }
    public void setDefaultMemRequest(String defaultMemRequest) { this.defaultMemRequest = defaultMemRequest; }

    public String getDefaultMemLimit() { return defaultMemLimit; }
    public void setDefaultMemLimit(String defaultMemLimit) { this.defaultMemLimit = defaultMemLimit; }

    public String getMaxCpu() { return maxCpu; }
    public void setMaxCpu(String maxCpu) { this.maxCpu = maxCpu; }

    public String getMaxMem() { return maxMem; }
    public void setMaxMem(String maxMem) { this.maxMem = maxMem; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
