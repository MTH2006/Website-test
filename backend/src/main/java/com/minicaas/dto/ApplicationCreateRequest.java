package com.minicaas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ApplicationCreateRequest {

    @NotBlank(message = "Tên ứng dụng không được để trống")
    @Pattern(regexp = "^[a-z0-9]([-a-z0-9]*[a-z0-9])?$", message = "Tên ứng dụng phải tuân thủ chuẩn RFC 1123 (chữ thường, số, dấu gạch ngang)")
    private String name;

    @NotBlank(message = "Namespace không được để trống")
    private String namespace;

    @NotBlank(message = "Container Image không được để trống")
    private String image;

    private int replicas = 1;
    private String cpuRequest = "100m";
    private String cpuLimit = "200m";
    private String memoryRequest = "128Mi";
    private String memoryLimit = "256Mi";
    private int containerPort = 80;

    public ApplicationCreateRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getNamespace() { return namespace; }
    public void setNamespace(String namespace) { this.namespace = namespace; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public int getReplicas() { return replicas; }
    public void setReplicas(int replicas) { this.replicas = replicas; }
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
}
