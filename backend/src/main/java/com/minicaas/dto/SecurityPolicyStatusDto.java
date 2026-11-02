package com.minicaas.dto;

import java.util.List;

public class SecurityPolicyStatusDto {
    private boolean calicoEnforced;
    private boolean defaultDenyIngressActive;
    private boolean admissionPolicyActive;
    private List<NetworkPolicyItem> networkPolicies;
    private List<RbacItem> rbacBindings;
    private List<AdmissionRuleItem> admissionRules;

    public SecurityPolicyStatusDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final SecurityPolicyStatusDto d = new SecurityPolicyStatusDto();
        public Builder calicoEnforced(boolean b) { d.setCalicoEnforced(b); return this; }
        public Builder defaultDenyIngressActive(boolean b) { d.setDefaultDenyIngressActive(b); return this; }
        public Builder admissionPolicyActive(boolean b) { d.setAdmissionPolicyActive(b); return this; }
        public Builder networkPolicies(List<NetworkPolicyItem> l) { d.setNetworkPolicies(l); return this; }
        public Builder rbacBindings(List<RbacItem> l) { d.setRbacBindings(l); return this; }
        public Builder admissionRules(List<AdmissionRuleItem> l) { d.setAdmissionRules(l); return this; }
        public SecurityPolicyStatusDto build() { return d; }
    }

    public static class NetworkPolicyItem {
        private String name;
        private String namespace;
        private String type;
        private String description;

        public NetworkPolicyItem() {}
        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private final NetworkPolicyItem i = new NetworkPolicyItem();
            public Builder name(String s) { i.setName(s); return this; }
            public Builder namespace(String s) { i.setNamespace(s); return this; }
            public Builder type(String s) { i.setType(s); return this; }
            public Builder description(String s) { i.setDescription(s); return this; }
            public NetworkPolicyItem build() { return i; }
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getNamespace() { return namespace; }
        public void setNamespace(String namespace) { this.namespace = namespace; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class RbacItem {
        private String roleName;
        private String namespace;
        private String serviceAccount;
        private List<String> verbs;
        private List<String> resources;

        public RbacItem() {}
        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private final RbacItem r = new RbacItem();
            public Builder roleName(String s) { r.setRoleName(s); return this; }
            public Builder namespace(String s) { r.setNamespace(s); return this; }
            public Builder serviceAccount(String s) { r.setServiceAccount(s); return this; }
            public Builder verbs(List<String> l) { r.setVerbs(l); return this; }
            public Builder resources(List<String> l) { r.setResources(l); return this; }
            public RbacItem build() { return r; }
        }

        public String getRoleName() { return roleName; }
        public void setRoleName(String roleName) { this.roleName = roleName; }
        public String getNamespace() { return namespace; }
        public void setNamespace(String namespace) { this.namespace = namespace; }
        public String getServiceAccount() { return serviceAccount; }
        public void setServiceAccount(String serviceAccount) { this.serviceAccount = serviceAccount; }
        public List<String> getVerbs() { return verbs; }
        public void setVerbs(List<String> verbs) { this.verbs = verbs; }
        public List<String> getResources() { return resources; }
        public void setResources(List<String> resources) { this.resources = resources; }
    }

    public static class AdmissionRuleItem {
        private String name;
        private String status;
        private String ruleDescription;

        public AdmissionRuleItem() {}
        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private final AdmissionRuleItem a = new AdmissionRuleItem();
            public Builder name(String s) { a.setName(s); return this; }
            public Builder status(String s) { a.setStatus(s); return this; }
            public Builder ruleDescription(String s) { a.setRuleDescription(s); return this; }
            public AdmissionRuleItem build() { return a; }
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getRuleDescription() { return ruleDescription; }
        public void setRuleDescription(String ruleDescription) { this.ruleDescription = ruleDescription; }
    }

    public boolean isCalicoEnforced() { return calicoEnforced; }
    public void setCalicoEnforced(boolean calicoEnforced) { this.calicoEnforced = calicoEnforced; }
    public boolean isDefaultDenyIngressActive() { return defaultDenyIngressActive; }
    public void setDefaultDenyIngressActive(boolean defaultDenyIngressActive) { this.defaultDenyIngressActive = defaultDenyIngressActive; }
    public boolean isAdmissionPolicyActive() { return admissionPolicyActive; }
    public void setAdmissionPolicyActive(boolean admissionPolicyActive) { this.admissionPolicyActive = admissionPolicyActive; }
    public List<NetworkPolicyItem> getNetworkPolicies() { return networkPolicies; }
    public void setNetworkPolicies(List<NetworkPolicyItem> networkPolicies) { this.networkPolicies = networkPolicies; }
    public List<RbacItem> getRbacBindings() { return rbacBindings; }
    public void setRbacBindings(List<RbacItem> rbacBindings) { this.rbacBindings = rbacBindings; }
    public List<AdmissionRuleItem> getAdmissionRules() { return admissionRules; }
    public void setAdmissionRules(List<AdmissionRuleItem> admissionRules) { this.admissionRules = admissionRules; }
}
