package com.minicaas.dto;

import java.util.List;

public class ClusterStatusDto {
    private String clusterName;
    private String k8sVersion;
    private int nodesCount;
    private int namespacesCount;
    private int totalPods;
    private int runningPods;
    private int pendingPods;
    private int failedPods;
    private int totalTeams;
    private String cpuRequested;
    private String cpuCapacity;
    private String memoryRequested;
    private String memoryCapacity;
    private String health;
    private boolean calicoEnabled;
    private boolean admissionPolicyEnabled;
    private List<NodeDto> nodes;

    public ClusterStatusDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final ClusterStatusDto d = new ClusterStatusDto();
        public Builder clusterName(String s) { d.setClusterName(s); return this; }
        public Builder k8sVersion(String s) { d.setK8sVersion(s); return this; }
        public Builder nodesCount(int i) { d.setNodesCount(i); return this; }
        public Builder namespacesCount(int i) { d.setNamespacesCount(i); return this; }
        public Builder totalPods(int i) { d.setTotalPods(i); return this; }
        public Builder runningPods(int i) { d.setRunningPods(i); return this; }
        public Builder pendingPods(int i) { d.setPendingPods(i); return this; }
        public Builder failedPods(int i) { d.setFailedPods(i); return this; }
        public Builder totalTeams(int i) { d.setTotalTeams(i); return this; }
        public Builder cpuRequested(String s) { d.setCpuRequested(s); return this; }
        public Builder cpuCapacity(String s) { d.setCpuCapacity(s); return this; }
        public Builder memoryRequested(String s) { d.setMemoryRequested(s); return this; }
        public Builder memoryCapacity(String s) { d.setMemoryCapacity(s); return this; }
        public Builder health(String s) { d.setHealth(s); return this; }
        public Builder calicoEnabled(boolean b) { d.setCalicoEnabled(b); return this; }
        public Builder admissionPolicyEnabled(boolean b) { d.setAdmissionPolicyEnabled(b); return this; }
        public Builder nodes(List<NodeDto> n) { d.setNodes(n); return this; }
        public ClusterStatusDto build() { return d; }
    }

    public static class NodeDto {
        private String name;
        private String status;
        private String role;
        private String kubeletVersion;
        private String internalIp;

        public NodeDto() {}

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private final NodeDto n = new NodeDto();
            public Builder name(String s) { n.setName(s); return this; }
            public Builder status(String s) { n.setStatus(s); return this; }
            public Builder role(String s) { n.setRole(s); return this; }
            public Builder kubeletVersion(String s) { n.setKubeletVersion(s); return this; }
            public Builder internalIp(String s) { n.setInternalIp(s); return this; }
            public NodeDto build() { return n; }
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getKubeletVersion() { return kubeletVersion; }
        public void setKubeletVersion(String kubeletVersion) { this.kubeletVersion = kubeletVersion; }
        public String getInternalIp() { return internalIp; }
        public void setInternalIp(String internalIp) { this.internalIp = internalIp; }
    }

    // Getters and Setters for ClusterStatusDto
    public String getClusterName() { return clusterName; }
    public void setClusterName(String clusterName) { this.clusterName = clusterName; }
    public String getK8sVersion() { return k8sVersion; }
    public void setK8sVersion(String k8sVersion) { this.k8sVersion = k8sVersion; }
    public int getNodesCount() { return nodesCount; }
    public void setNodesCount(int nodesCount) { this.nodesCount = nodesCount; }
    public int getNamespacesCount() { return namespacesCount; }
    public void setNamespacesCount(int namespacesCount) { this.namespacesCount = namespacesCount; }
    public int getTotalPods() { return totalPods; }
    public void setTotalPods(int totalPods) { this.totalPods = totalPods; }
    public int getRunningPods() { return runningPods; }
    public void setRunningPods(int runningPods) { this.runningPods = runningPods; }
    public int getPendingPods() { return pendingPods; }
    public void setPendingPods(int pendingPods) { this.pendingPods = pendingPods; }
    public int getFailedPods() { return failedPods; }
    public void setFailedPods(int failedPods) { this.failedPods = failedPods; }
    public int getTotalTeams() { return totalTeams; }
    public void setTotalTeams(int totalTeams) { this.totalTeams = totalTeams; }
    public String getCpuRequested() { return cpuRequested; }
    public void setCpuRequested(String cpuRequested) { this.cpuRequested = cpuRequested; }
    public String getCpuCapacity() { return cpuCapacity; }
    public void setCpuCapacity(String cpuCapacity) { this.cpuCapacity = cpuCapacity; }
    public String getMemoryRequested() { return memoryRequested; }
    public void setMemoryRequested(String memoryRequested) { this.memoryRequested = memoryRequested; }
    public String getMemoryCapacity() { return memoryCapacity; }
    public void setMemoryCapacity(String memoryCapacity) { this.memoryCapacity = memoryCapacity; }
    public String getHealth() { return health; }
    public void setHealth(String health) { this.health = health; }
    public boolean isCalicoEnabled() { return calicoEnabled; }
    public void setCalicoEnabled(boolean calicoEnabled) { this.calicoEnabled = calicoEnabled; }
    public boolean isAdmissionPolicyEnabled() { return admissionPolicyEnabled; }
    public void setAdmissionPolicyEnabled(boolean admissionPolicyEnabled) { this.admissionPolicyEnabled = admissionPolicyEnabled; }
    public List<NodeDto> getNodes() { return nodes; }
    public void setNodes(List<NodeDto> nodes) { this.nodes = nodes; }
}
