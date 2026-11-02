package com.minicaas.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "applications", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"name", "namespace_id"})
})
public class ApplicationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "namespace_id", nullable = false)
    private NamespaceEntity namespace;

    @Column(name = "container_image", nullable = false, length = 255)
    private String containerImage;

    private Integer replicas = 1;

    @Column(name = "cpu_request", length = 20)
    private String cpuRequest = "100m";

    @Column(name = "cpu_limit", length = 20)
    private String cpuLimit = "200m";

    @Column(name = "memory_request", length = 20)
    private String memoryRequest = "128Mi";

    @Column(name = "memory_limit", length = 20)
    private String memoryLimit = "256Mi";

    @Column(name = "container_port")
    private Integer containerPort = 80;

    @Column(length = 30)
    private String status = "PENDING";

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public ApplicationEntity() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final ApplicationEntity app = new ApplicationEntity();
        public Builder name(String name) { app.setName(name); return this; }
        public Builder namespace(NamespaceEntity ns) { app.setNamespace(ns); return this; }
        public Builder containerImage(String img) { app.setContainerImage(img); return this; }
        public Builder replicas(Integer rep) { app.setReplicas(rep); return this; }
        public Builder cpuRequest(String r) { app.setCpuRequest(r); return this; }
        public Builder cpuLimit(String l) { app.setCpuLimit(l); return this; }
        public Builder memoryRequest(String r) { app.setMemoryRequest(r); return this; }
        public Builder memoryLimit(String l) { app.setMemoryLimit(l); return this; }
        public Builder containerPort(Integer p) { app.setContainerPort(p); return this; }
        public Builder status(String s) { app.setStatus(s); return this; }
        public ApplicationEntity build() { return app; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public NamespaceEntity getNamespace() { return namespace; }
    public void setNamespace(NamespaceEntity namespace) { this.namespace = namespace; }

    public String getContainerImage() { return containerImage; }
    public void setContainerImage(String containerImage) { this.containerImage = containerImage; }

    public Integer getReplicas() { return replicas; }
    public void setReplicas(Integer replicas) { this.replicas = replicas; }

    public String getCpuRequest() { return cpuRequest; }
    public void setCpuRequest(String cpuRequest) { this.cpuRequest = cpuRequest; }

    public String getCpuLimit() { return cpuLimit; }
    public void setCpuLimit(String cpuLimit) { this.cpuLimit = cpuLimit; }

    public String getMemoryRequest() { return memoryRequest; }
    public void setMemoryRequest(String memoryRequest) { this.memoryRequest = memoryRequest; }

    public String getMemoryLimit() { return memoryLimit; }
    public void setMemoryLimit(String memoryLimit) { this.memoryLimit = memoryLimit; }

    public Integer getContainerPort() { return containerPort; }
    public void setContainerPort(Integer containerPort) { this.containerPort = containerPort; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
