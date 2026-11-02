package com.minicaas.dto;

import java.util.UUID;

public class TeamDto {
    private UUID id;
    private String name;
    private String displayName;
    private String description;
    private String status;
    private String namespace;
    private ResourceQuotaDto quota;
    private int runningPodsCount;
    private int totalDeploymentsCount;

    public TeamDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final TeamDto t = new TeamDto();
        public Builder id(UUID id) { t.setId(id); return this; }
        public Builder name(String name) { t.setName(name); return this; }
        public Builder displayName(String displayName) { t.setDisplayName(displayName); return this; }
        public Builder description(String description) { t.setDescription(description); return this; }
        public Builder status(String status) { t.setStatus(status); return this; }
        public Builder namespace(String namespace) { t.setNamespace(namespace); return this; }
        public Builder quota(ResourceQuotaDto quota) { t.setQuota(quota); return this; }
        public Builder runningPodsCount(int c) { t.setRunningPodsCount(c); return this; }
        public Builder totalDeploymentsCount(int c) { t.setTotalDeploymentsCount(c); return this; }
        public TeamDto build() { return t; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNamespace() { return namespace; }
    public void setNamespace(String namespace) { this.namespace = namespace; }
    public ResourceQuotaDto getQuota() { return quota; }
    public void setQuota(ResourceQuotaDto quota) { this.quota = quota; }
    public int getRunningPodsCount() { return runningPodsCount; }
    public void setRunningPodsCount(int runningPodsCount) { this.runningPodsCount = runningPodsCount; }
    public int getTotalDeploymentsCount() { return totalDeploymentsCount; }
    public void setTotalDeploymentsCount(int totalDeploymentsCount) { this.totalDeploymentsCount = totalDeploymentsCount; }
}
