# MINI CAAS PLATFORM – KIẾN TRÚC HỆ THỐNG

## 1. TỔNG QUAN HỆ THỐNG

**Mini CaaS Platform** (Container as a Service) là nền tảng quản trị và cô lập tài nguyên điện toán đám mây cho nhiều nhóm phát triển (Multi-tenant) hoạt động trên cùng một Kubernetes Cluster.

Nền tảng đảm bảo 4 trụ cột cô lập chính:
1. **Cô lập không gian tên (Namespace Isolation)**: Phân vùng logic giữa các nhóm `team-a`, `team-b`, `team-c`.
2. **Cô lập & Kiểm soát tài nguyên (Resource Governance)**: Sử dụng `ResourceQuota` (tổng CPU/RAM) và `LimitRange` (giới hạn min/max/default cho mỗi Container).
3. **Cô lập phân quyền truy cập (Access Control - RBAC)**: Mỗi nhóm sở hữu `ServiceAccount`, `Role`, `RoleBinding` riêng biệt; tuân thủ nguyên tắc đặc quyền tối thiểu (Least Privilege).
4. **Cô lập giao tiếp mạng (Network Isolation)**: Sử dụng Calico CNI triển khai `NetworkPolicy` mặc định chặn toàn bộ giao tiếp giữa các Namespace (Default Deny Ingress) và chỉ cho phép lưu thông khi có chính sách phê duyệt cụ thể.
5. **Kiểm soát đầu vào (Admission Control)**: Ngăn chặn triển khai Container Image không thuộc whitelist được cấp phép hoặc thiếu cấu hình tài nguyên.

---

## 2. SƠ ĐỒ KIẾN TRÚC TỔNG THỂ

```mermaid
graph TD
    subgraph ClientLayer ["Client Layer (Trình duyệt Người dùng)"]
        Browser["Web Browser (User / Admin / Team Members)"]
    end

    subgraph FrontendApp ["Frontend Application (Port 5173)"]
        ReactApp["ReactJS 18 + Vite + Tailwind CSS"]
        AxiosClient["Axios HTTP Client + Interceptors (JWT)"]
        DashboardUI["Dashboard / Demo Lab / Security UI / Reports"]
    end

    subgraph BackendApp ["Backend Application (Port 8088)"]
        SpringBoot["Java Spring Boot 3.3.x"]
        SecurityModule["Spring Security + JWT Authentication"]
        ControllerLayer["REST Controllers (Auth, Teams, K8s, DemoLab, History)"]
        ServiceLayer["Service Layer (Business Logic & Audit)"]
        K8sAdapter["Fabric8 / K8s Java Client Adapter"]
        DemoRunner["Demo Test Suite Execution Engine"]
        JPA["Spring Data JPA / Hibernate"]
    end

    subgraph DataStorage ["Data Storage Layer (Port 5433)"]
        PostgresDB[("PostgreSQL 16 DB (minicaas)\nDocker Volume: minicaas_pgdata")]
    end

    subgraph KubernetesCluster ["Kubernetes Infrastructure (Kind Cluster: caas-cluster)"]
        K8sAPI["Kubernetes API Server"]
        CNI["Calico CNI (NetworkPolicy Enforcement)"]
        AdmissionWebhook["Validating Admission Policy / Kyverno"]
        
        subgraph TeamANamespace ["Namespace: team-a"]
            QuotaA["ResourceQuota: CPU 1.0, RAM 1Gi, Pods 4"]
            LimitA["LimitRange: Min/Max/Default CPU & RAM"]
            AppA["Team A Workloads (Nginx / Web Apps)"]
            SaA["ServiceAccount: team-a-sa (RBAC)"]
        end

        subgraph TeamBNamespace ["Namespace: team-b"]
            QuotaB["ResourceQuota: CPU 1.0, RAM 1Gi, Pods 4"]
            LimitB["LimitRange: Min/Max/Default CPU & RAM"]
            AppB["Team B Workloads (Nginx / Web Apps)"]
            SaB["ServiceAccount: team-b-sa (RBAC)"]
        end

        subgraph TeamCNamespace ["Namespace: team-c"]
            QuotaC["ResourceQuota: CPU 1.0, RAM 1Gi, Pods 4"]
            LimitC["LimitRange: Min/Max/Default CPU & RAM"]
            AppC["Team C Workloads & Secret Test"]
            SaC["ServiceAccount: team-c-sa (RBAC)"]
        end
    end

    Browser -->|HTTP Requests| ReactApp
    ReactApp --> AxiosClient
    AxiosClient -->|REST API with Bearer Token| SecurityModule
    SecurityModule --> ControllerLayer
    ControllerLayer --> ServiceLayer
    ServiceLayer --> JPA
    JPA --> PostgresDB
    ServiceLayer --> K8sAdapter
    K8sAdapter -->|TLS HTTPS / KubeConfig| K8sAPI
    K8sAPI --> TeamANamespace
    K8sAPI --> TeamBNamespace
    K8sAPI --> TeamCNamespace
    CNI -.->|Enforce Traffic Filtering| TeamANamespace
    CNI -.->|Enforce Traffic Filtering| TeamBNamespace
    CNI -.->|Enforce Traffic Filtering| TeamCNamespace
```

---

## 3. CƠ CHẾ ĐẢM BẢO KHÔNG TRÙNG LẶP & CÔ LẬP CỔNG

Để bảo đảm hoạt động độc lập và không can thiệp vào các dự án khác trên máy tính:

| Thành phần | Cổng Host | Cổng Container/Internal | Giao thức | Mô tả |
|---|---|---|---|---|
| **Mini CaaS Frontend** | `5173` | `5173` | HTTP | Vite Development Server |
| **Mini CaaS Backend** | `8088` | `8088` | HTTP | Spring Boot REST API |
| **Mini CaaS PostgreSQL** | `5433` | `5432` | TCP | Dedicated PostgreSQL container (`minicaas-postgres`) |
| **Kind Control Plane** | Dynamic / Internal | `6443` | HTTPS | K8s API Server quản lý bởi Kind |

*Các dịch vụ của dự án Hotel Booking đang sử dụng cổng `3000`, `8080`, `5432` hoàn toàn độc lập và không bị ảnh hưởng.*

---

## 4. LUỒNG XỬ LÝ DỮ LIỆU VÀ BẢO MẬT

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng (Admin / Team)
    participant FE as React Frontend (5173)
    participant BE as Spring Boot (8088)
    participant DB as PostgreSQL (5433)
    participant K8s as Kubernetes API (caas-cluster)

    User->>FE: Đăng nhập (username, password)
    FE->>BE: POST /api/auth/login
    BE->>DB: Truy vấn User & Role
    DB-->>BE: User Info (Password BCrypt Hashed)
    BE-->>FE: Trả về JWT Token + User Profile & Team Scope
    
    User->>FE: Yêu cầu triển khai Container (App, Replicas, CPU/RAM)
    FE->>BE: POST /api/applications (Header: Bearer JWT)
    BE->>BE: Kiểm tra quyền Namespace & Hạn ngạch (Validation)
    BE->>K8s: Tạo Deployment qua Kubernetes API
    alt Vượt quá ResourceQuota hoặc Vi phạm Admission Policy
        K8s-->>BE: 403 Forbidden / 422 Unprocessable (ExceededQuota Error)
        BE->>DB: Ghi log kiểm toán (Audit Log: REJECTED)
        BE-->>FE: Thông báo chi tiết lỗi thực tế từ K8s
    else Hợp lệ
        K8s-->>BE: 201 Created (Deployment Accepted)
        BE->>DB: Lưu Application & Deployment metadata
        BE-->>FE: Trả về trạng thái triển khai thành công
    end
```
