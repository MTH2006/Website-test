package com.minicaas.dto;

import java.time.Instant;

public class PodDto {
    private String name;
    private String namespace;
    private String status;
    private String podIp;
    private String nodeName;
    private int restartCount;
    private String cpuRequest;
    private String memoryRequest;
    private String age;
    private Instant startTime;

    public PodDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final PodDto p = new PodDto();
        public Builder name(String s) { p.setName(s); return this; }
        public Builder namespace(String s) { p.setNamespace(s); return this; }
        public Builder status(String s) { p.setStatus(s); return this; }
        public Builder podIp(String s) { p.setPodIp(s); return this; }
        public Builder nodeName(String s) { p.setNodeName(s); return this; }
        public Builder restartCount(int i) { p.setRestartCount(i); return this; }
        public Builder cpuRequest(String s) { p.setCpuRequest(s); return this; }
        public Builder memoryRequest(String s) { p.setMemoryRequest(s); return this; }
        public Builder age(String s) { p.setAge(s); return this; }
        public Builder startTime(Instant t) { p.setStartTime(t); return this; }
        public PodDto build() { return p; }
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getNamespace() { return namespace; }
    public void setNamespace(String namespace) { this.namespace = namespace; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPodIp() { return podIp; }
    public void setPodIp(String podIp) { this.podIp = podIp; }
    public String getNodeName() { return nodeName; }
    public void setNodeName(String nodeName) { this.nodeName = nodeName; }
    public int getRestartCount() { return restartCount; }
    public void setRestartCount(int restartCount) { this.restartCount = restartCount; }
    public String getCpuRequest() { return cpuRequest; }
    public void setCpuRequest(String cpuRequest) { this.cpuRequest = cpuRequest; }
    public String getMemoryRequest() { return memoryRequest; }
    public void setMemoryRequest(String memoryRequest) { this.memoryRequest = memoryRequest; }
    public String getAge() { return age; }
    public void setAge(String age) { this.age = age; }
    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }
}
