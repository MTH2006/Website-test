package com.minicaas.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class ApplicationDto {
    private UUID id;
    private String name;
    private String namespace;
    private String containerImage;
    private int replicas;
    private int readyReplicas;
    private String cpuRequest;
    private String cpuLimit;
    private String memoryRequest;
    private String memoryLimit;
    private int containerPort;
    private String status;
    private Instant createdAt;
    private List<PodDto> pods;

    public ApplicationDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final ApplicationDto a = new ApplicationDto();
        public Builder id(UUID id) { a.setId(id); return this; }
        public Builder name(String name) { a.setName(name); return this; }
        public Builder namespace(String namespace) { a.setNamespace(namespace); return this; }
        public Builder containerImage(String img) { a.setContainerImage(img); return this; }
        public Builder replicas(int r) { a.setReplicas(r); return this; }
        public Builder readyReplicas(int r) { a.setReadyReplicas(r); return this; }
        public Builder cpuRequest(String r) { a.setCpuRequest(r); return this; }
        public Builder cpuLimit(String l) { a.setCpuLimit(l); return this; }
        public Builder memoryRequest(String r) { a.setMemoryRequest(r); return this; }
        public Builder memoryLimit(String l) { a.setMemoryLimit(l); return this; }
        public Builder containerPort(int p) { a.setContainerPort(p); return this; }
        public Builder status(String s) { a.setStatus(s); return this; }
        public Builder createdAt(Instant t) { a.setCreatedAt(t); return this; }
        public Builder pods(List<PodDto> p) { a.setPods(p); return this; }
        public ApplicationDto build() { return a; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getNamespace() { return namespace; }
    public void setNamespace(String namespace) { this.namespace = namespace; }
    public String getContainerImage() { return containerImage; }
    public void setContainerImage(String containerImage) { this.containerImage = containerImage; }
    public int getReplicas() { return replicas; }
    public void setReplicas(int replicas) { this.replicas = replicas; }
    public int getReadyReplicas() { return readyReplicas; }
    public void setReadyReplicas(int readyReplicas) { this.readyReplicas = readyReplicas; }
    public String getCpuRequest() { return cpuRequest; }
    public void setCpuRequest(String cpuRequest) { this.cpuRequest = cpuRequest; }
    public String getCpuLimit() { return cpuLimit; }
    public void setCpuLimit(String cpuLimit) { this.cpuLimit = cpuLimit; }
    public String getMemoryRequest() { return memoryRequest; }
    public void setMemoryRequest(String memoryRequest) { this.memoryRequest = memoryRequest; }
    public String getMemoryLimit() { return memoryLimit; }
    public void setMemoryLimit(String memoryLimit) { this.memoryLimit = memoryLimit; }
    public int getContainerPort() { return containerPort; }
    public void setContainerPort(int containerPort) { this.containerPort = containerPort; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public List<PodDto> getPods() { return pods; }
    public void setPods(List<PodDto> pods) { this.pods = pods; }
}
