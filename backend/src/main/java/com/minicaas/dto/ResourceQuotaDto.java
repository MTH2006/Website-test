package com.minicaas.dto;

public class ResourceQuotaDto {
    private String namespace;
    private String cpuRequestLimit;
    private String cpuRequestUsed;
    private String cpuLimitTotal;
    private String cpuLimitUsed;
    private String memoryRequestLimit;
    private String memoryRequestUsed;
    private String memoryLimitTotal;
    private String memoryLimitUsed;
    private int maxPods;
    private int usedPods;
    private double cpuPercentUsed;
    private double memoryPercentUsed;
    private double podsPercentUsed;

    public ResourceQuotaDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final ResourceQuotaDto q = new ResourceQuotaDto();
        public Builder namespace(String s) { q.setNamespace(s); return this; }
        public Builder cpuRequestLimit(String s) { q.setCpuRequestLimit(s); return this; }
        public Builder cpuRequestUsed(String s) { q.setCpuRequestUsed(s); return this; }
        public Builder cpuLimitTotal(String s) { q.setCpuLimitTotal(s); return this; }
        public Builder cpuLimitUsed(String s) { q.setCpuLimitUsed(s); return this; }
        public Builder memoryRequestLimit(String s) { q.setMemoryRequestLimit(s); return this; }
        public Builder memoryRequestUsed(String s) { q.setMemoryRequestUsed(s); return this; }
        public Builder memoryLimitTotal(String s) { q.setMemoryLimitTotal(s); return this; }
        public Builder memoryLimitUsed(String s) { q.setMemoryLimitUsed(s); return this; }
        public Builder maxPods(int i) { q.setMaxPods(i); return this; }
        public Builder usedPods(int i) { q.setUsedPods(i); return this; }
        public Builder cpuPercentUsed(double d) { q.setCpuPercentUsed(d); return this; }
        public Builder memoryPercentUsed(double d) { q.setMemoryPercentUsed(d); return this; }
        public Builder podsPercentUsed(double d) { q.setPodsPercentUsed(d); return this; }
        public ResourceQuotaDto build() { return q; }
    }

    public String getNamespace() { return namespace; }
    public void setNamespace(String namespace) { this.namespace = namespace; }
    public String getCpuRequestLimit() { return cpuRequestLimit; }
    public void setCpuRequestLimit(String cpuRequestLimit) { this.cpuRequestLimit = cpuRequestLimit; }
    public String getCpuRequestUsed() { return cpuRequestUsed; }
    public void setCpuRequestUsed(String cpuRequestUsed) { this.cpuRequestUsed = cpuRequestUsed; }
    public String getCpuLimitTotal() { return cpuLimitTotal; }
    public void setCpuLimitTotal(String cpuLimitTotal) { this.cpuLimitTotal = cpuLimitTotal; }
    public String getCpuLimitUsed() { return cpuLimitUsed; }
    public void setCpuLimitUsed(String cpuLimitUsed) { this.cpuLimitUsed = cpuLimitUsed; }
    public String getMemoryRequestLimit() { return memoryRequestLimit; }
    public void setMemoryRequestLimit(String memoryRequestLimit) { this.memoryRequestLimit = memoryRequestLimit; }
    public String getMemoryRequestUsed() { return memoryRequestUsed; }
    public void setMemoryRequestUsed(String memoryRequestUsed) { this.memoryRequestUsed = memoryRequestUsed; }
    public String getMemoryLimitTotal() { return memoryLimitTotal; }
    public void setMemoryLimitTotal(String memoryLimitTotal) { this.memoryLimitTotal = memoryLimitTotal; }
    public String getMemoryLimitUsed() { return memoryLimitUsed; }
    public void setMemoryLimitUsed(String memoryLimitUsed) { this.memoryLimitUsed = memoryLimitUsed; }
    public int getMaxPods() { return maxPods; }
    public void setMaxPods(int maxPods) { this.maxPods = maxPods; }
    public int getUsedPods() { return usedPods; }
    public void setUsedPods(int usedPods) { this.usedPods = usedPods; }
    public double getCpuPercentUsed() { return cpuPercentUsed; }
    public void setCpuPercentUsed(double cpuPercentUsed) { this.cpuPercentUsed = cpuPercentUsed; }
    public double getMemoryPercentUsed() { return memoryPercentUsed; }
    public void setMemoryPercentUsed(double memoryPercentUsed) { this.memoryPercentUsed = memoryPercentUsed; }
    public double getPodsPercentUsed() { return podsPercentUsed; }
    public void setPodsPercentUsed(double podsPercentUsed) { this.podsPercentUsed = podsPercentUsed; }
}
