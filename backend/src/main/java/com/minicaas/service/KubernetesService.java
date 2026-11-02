package com.minicaas.service;

import com.minicaas.dto.ClusterStatusDto;
import com.minicaas.dto.PodDto;
import com.minicaas.dto.ResourceQuotaDto;
import io.fabric8.kubernetes.api.model.*;
import io.fabric8.kubernetes.api.model.apps.Deployment;
import io.fabric8.kubernetes.api.model.apps.DeploymentBuilder;
import io.fabric8.kubernetes.api.model.authorization.v1.SubjectAccessReview;
import io.fabric8.kubernetes.api.model.authorization.v1.SubjectAccessReviewBuilder;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClientException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class KubernetesService {

    private static final Logger log = LoggerFactory.getLogger(KubernetesService.class);

    private final KubernetesClient client;

    public KubernetesService(KubernetesClient client) {
        this.client = client;
    }

    public ClusterStatusDto getClusterStatus() {
        try {
            var versionInfo = client.getKubernetesVersion();
            var nodes = client.nodes().list().getItems();
            var namespaces = client.namespaces().list().getItems();
            var allPods = client.pods().inAnyNamespace().list().getItems();

            int running = 0;
            int pending = 0;
            int failed = 0;

            for (Pod p : allPods) {
                String phase = p.getStatus() != null ? p.getStatus().getPhase() : "Unknown";
                if ("Running".equalsIgnoreCase(phase)) running++;
                else if ("Pending".equalsIgnoreCase(phase)) pending++;
                else if ("Failed".equalsIgnoreCase(phase)) failed++;
            }

            List<ClusterStatusDto.NodeDto> nodeDtos = nodes.stream().map(node -> {
                String status = "NotReady";
                if (node.getStatus() != null && node.getStatus().getConditions() != null) {
                    for (NodeCondition cond : node.getStatus().getConditions()) {
                        if ("Ready".equals(cond.getType()) && "True".equals(cond.getStatus())) {
                            status = "Ready";
                            break;
                        }
                    }
                }
                String role = "worker";
                if (node.getMetadata().getLabels() != null) {
                    if (node.getMetadata().getLabels().containsKey("node-role.kubernetes.io/control-plane")) {
                        role = "control-plane";
                    }
                }
                String ip = "127.0.0.1";
                if (node.getStatus() != null && node.getStatus().getAddresses() != null) {
                    for (NodeAddress addr : node.getStatus().getAddresses()) {
                        if ("InternalIP".equals(addr.getType())) {
                            ip = addr.getAddress();
                            break;
                        }
                    }
                }
                return ClusterStatusDto.NodeDto.builder()
                    .name(node.getMetadata().getName())
                    .status(status)
                    .role(role)
                    .kubeletVersion(node.getStatus() != null && node.getStatus().getNodeInfo() != null 
                        ? node.getStatus().getNodeInfo().getKubeletVersion() : "v1.32.2")
                    .internalIp(ip)
                    .build();
            }).collect(Collectors.toList());

            return ClusterStatusDto.builder()
                .clusterName("caas-cluster")
                .k8sVersion(versionInfo != null ? versionInfo.getGitVersion() : "v1.32.2")
                .nodesCount(nodes.size())
                .namespacesCount(namespaces.size())
                .totalPods(allPods.size())
                .runningPods(running)
                .pendingPods(pending)
                .failedPods(failed)
                .totalTeams(3)
                .cpuRequested("600m")
                .cpuCapacity("4000m")
                .memoryRequested("1024Mi")
                .memoryCapacity("8192Mi")
                .health("HEALTHY")
                .calicoEnabled(true)
                .admissionPolicyEnabled(true)
                .nodes(nodeDtos)
                .build();
        } catch (Exception e) {
            log.error("Lỗi khi kết nối Kubernetes cluster: {}", e.getMessage());
            return ClusterStatusDto.builder()
                .clusterName("caas-cluster")
                .k8sVersion("Unknown")
                .health("UNAVAILABLE: " + e.getMessage())
                .nodes(Collections.emptyList())
                .build();
        }
    }

    public ResourceQuotaDto getNamespaceQuota(String namespace) {
        try {
            var quotaList = client.resourceQuotas().inNamespace(namespace).list().getItems();
            if (quotaList.isEmpty()) {
                return ResourceQuotaDto.builder()
                    .namespace(namespace)
                    .cpuRequestLimit("1000m").cpuRequestUsed("0m")
                    .cpuLimitTotal("2000m").cpuLimitUsed("0m")
                    .memoryRequestLimit("1Gi").memoryRequestUsed("0Mi")
                    .memoryLimitTotal("2Gi").memoryLimitUsed("0Mi")
                    .maxPods(4).usedPods(0)
                    .build();
            }

            ResourceQuota quota = quotaList.get(0);
            Map<String, Quantity> hard = quota.getStatus() != null && quota.getStatus().getHard() != null 
                ? quota.getStatus().getHard() : Collections.emptyMap();
            Map<String, Quantity> used = quota.getStatus() != null && quota.getStatus().getUsed() != null 
                ? quota.getStatus().getUsed() : Collections.emptyMap();

            int maxPods = hard.containsKey("pods") ? Integer.parseInt(hard.get("pods").getAmount()) : 4;
            int usedPods = used.containsKey("pods") ? Integer.parseInt(used.get("pods").getAmount()) : 0;

            String cpuReqLimit = hard.containsKey("requests.cpu") ? hard.get("requests.cpu").getAmount() : "1000m";
            String cpuReqUsed = used.containsKey("requests.cpu") ? used.get("requests.cpu").getAmount() : "0";

            String memReqLimit = hard.containsKey("requests.memory") ? hard.get("requests.memory").getAmount() : "1Gi";
            String memReqUsed = used.containsKey("requests.memory") ? used.get("requests.memory").getAmount() : "0";

            double podsPercent = maxPods > 0 ? ((double) usedPods / maxPods) * 100 : 0;

            return ResourceQuotaDto.builder()
                .namespace(namespace)
                .cpuRequestLimit(cpuReqLimit)
                .cpuRequestUsed(cpuReqUsed)
                .cpuLimitTotal("2000m")
                .cpuLimitUsed("0")
                .memoryRequestLimit(memReqLimit)
                .memoryRequestUsed(memReqUsed)
                .memoryLimitTotal("2Gi")
                .memoryLimitUsed("0")
                .maxPods(maxPods)
                .usedPods(usedPods)
                .podsPercentUsed(Math.round(podsPercent * 10.0) / 10.0)
                .build();
        } catch (Exception e) {
            log.error("Lỗi khi đọc quota của namespace {}: {}", namespace, e.getMessage());
            return ResourceQuotaDto.builder().namespace(namespace).maxPods(4).usedPods(0).build();
        }
    }

    public List<PodDto> getPods(String namespace) {
        try {
            var podList = client.pods().inNamespace(namespace).list().getItems();
            return podList.stream().map(p -> {
                String age = "0m";
                if (p.getMetadata().getCreationTimestamp() != null) {
                    Instant created = Instant.parse(p.getMetadata().getCreationTimestamp());
                    long mins = Duration.between(created, Instant.now()).toMinutes();
                    age = mins + "m";
                }
                int restarts = 0;
                if (p.getStatus() != null && p.getStatus().getContainerStatuses() != null) {
                    restarts = p.getStatus().getContainerStatuses().stream()
                        .mapToInt(ContainerStatus::getRestartCount).sum();
                }

                String phase = p.getStatus() != null ? p.getStatus().getPhase() : "Pending";

                return PodDto.builder()
                    .name(p.getMetadata().getName())
                    .namespace(namespace)
                    .status(phase)
                    .podIp(p.getStatus() != null ? p.getStatus().getPodIP() : "Pending")
                    .nodeName(p.getSpec() != null ? p.getSpec().getNodeName() : "caas-cluster")
                    .restartCount(restarts)
                    .age(age)
                    .build();
            }).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách Pod trong {}: {}", namespace, e.getMessage());
            return Collections.emptyList();
        }
    }

    public String getPodLogs(String namespace, String podName) {
        try {
            return client.pods().inNamespace(namespace).withName(podName).getLog();
        } catch (Exception e) {
            return "Không thể lấy log: " + e.getMessage();
        }
    }

    public Deployment deployApplication(
        String name,
        String namespace,
        String image,
        int replicas,
        String cpuReq,
        String cpuLimit,
        String memReq,
        String memLimit,
        int port
    ) {
        Map<String, String> labels = new HashMap<>();
        labels.put("app", name);
        labels.put("managed-by", "mini-caas-platform");

        Map<String, Quantity> requests = new HashMap<>();
        requests.put("cpu", new Quantity(cpuReq));
        requests.put("memory", new Quantity(memReq));

        Map<String, Quantity> limits = new HashMap<>();
        limits.put("cpu", new Quantity(cpuLimit));
        limits.put("memory", new Quantity(memLimit));

        Container container = new ContainerBuilder()
            .withName(name)
            .withImage(image)
            .withPorts(new ContainerPortBuilder().withContainerPort(port).build())
            .withResources(new ResourceRequirementsBuilder()
                .withRequests(requests)
                .withLimits(limits)
                .build())
            .build();

        Deployment deployment = new DeploymentBuilder()
            .withNewMetadata()
                .withName(name)
                .withNamespace(namespace)
                .withLabels(labels)
            .endMetadata()
            .withNewSpec()
                .withReplicas(replicas)
                .withNewSelector()
                    .withMatchLabels(labels)
                .endSelector()
                .withNewTemplate()
                    .withNewMetadata()
                        .withLabels(labels)
                    .endMetadata()
                    .withNewSpec()
                        .withContainers(container)
                    .endSpec()
                .endTemplate()
            .endSpec()
            .build();

        return client.apps().deployments().inNamespace(namespace).resource(deployment).createOrReplace();
    }

    public boolean deleteApplication(String name, String namespace) {
        try {
            client.apps().deployments().inNamespace(namespace).withName(name).delete();
            client.services().inNamespace(namespace).withName(name).delete();
            return true;
        } catch (Exception e) {
            log.error("Lỗi khi xóa ứng dụng {}/{}: {}", namespace, name, e.getMessage());
            return false;
        }
    }

    public boolean checkRbacCanI(String serviceAccount, String namespace, String verb, String resource, String group) {
        try {
            SubjectAccessReview sar = new SubjectAccessReviewBuilder()
                .withNewSpec()
                    .withUser("system:serviceaccount:" + namespace + ":" + serviceAccount)
                    .withNewResourceAttributes()
                        .withNamespace(namespace)
                        .withVerb(verb)
                        .withResource(resource)
                        .withGroup(group)
                    .endResourceAttributes()
                .endSpec()
                .build();

            SubjectAccessReview result = client.authorization().v1().subjectAccessReview().create(sar);
            return result.getStatus() != null && Boolean.TRUE.equals(result.getStatus().getAllowed());
        } catch (Exception e) {
            log.error("Lỗi khi kiểm tra SubjectAccessReview: {}", e.getMessage());
            return false;
        }
    }
}
