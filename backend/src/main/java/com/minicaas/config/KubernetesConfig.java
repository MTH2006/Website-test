package com.minicaas.config;

import io.fabric8.kubernetes.client.Config;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Configuration
public class KubernetesConfig {

    private static final Logger log = LoggerFactory.getLogger(KubernetesConfig.class);

    @Bean
    public KubernetesClient kubernetesClient() {
        try {
            Config config = null;

            // 1. Check KUBECONFIG environment variable
            String kubeconfigEnv = System.getenv("KUBECONFIG");
            if (kubeconfigEnv != null && !kubeconfigEnv.isBlank()) {
                File envFile = new File(kubeconfigEnv);
                if (envFile.exists() && envFile.canRead()) {
                    log.info("Nạp KubeConfig từ biến môi trường KUBECONFIG: {}", envFile.getAbsolutePath());
                    config = Config.fromKubeconfig(Files.readString(envFile.toPath()));
                }
            }

            // 2. Check candidate file paths
            if (config == null) {
                List<String> candidates = List.of(
                    "/root/.kube/config",
                    "/app/kubernetes/kubeconfig-internal.yaml",
                    "kubernetes/kubeconfig-internal.yaml",
                    System.getProperty("user.home") + File.separator + ".kube" + File.separator + "config"
                );

                for (String pathStr : candidates) {
                    File file = new File(pathStr);
                    if (file.exists() && file.canRead()) {
                        try {
                            log.info("Nạp KubeConfig từ file: {}", file.getAbsolutePath());
                            config = Config.fromKubeconfig(Files.readString(file.toPath()));
                            break;
                        } catch (Exception ex) {
                            log.warn("Không thể nạp KubeConfig từ {}: {}", pathStr, ex.getMessage());
                        }
                    }
                }
            }

            // 3. Fallback to standard autoConfigure
            if (config == null) {
                config = Config.autoConfigure(null);
            }

            KubernetesClient client = new KubernetesClientBuilder().withConfig(config).build();
            log.info("Kết nối thành công Kubernetes API Server tại: {}", client.getMasterUrl());
            return client;
        } catch (Exception e) {
            log.warn("Không tìm thấy KubeConfig tự động, khởi tạo client mặc định: {}", e.getMessage());
            return new KubernetesClientBuilder().build();
        }
    }
}

