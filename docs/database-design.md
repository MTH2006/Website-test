# MINI CAAS PLATFORM – THIẾT KẾ CƠ SỞ DỮ LIỆU (DATABASE ERD & SCHEMA)

## 1. NGUYÊN TẮC THIẾT KẾ DATABASE

1. **Phân định rõ ràng hai nguồn dữ liệu**:
   - **PostgreSQL Database**: Lưu trữ dữ liệu cấu hình ứng dụng, tài khoản người dùng, phân quyền truy cập, các phiên DEMO, kết quả bài kiểm thử, lịch sử kiểm toán và cấu hình báo cáo. Dữ liệu này **tồn tại vĩnh viễn** qua Docker Volume `minicaas_pgdata`.
   - **Kubernetes Live State**: Trạng thái thực tế tức thời của cụm K8s (Pods đang chạy, CPU/RAM thực tế từ Metrics Server, trạng thái NetworkPolicy). Database không thay thế Kubernetes mà bổ trợ và ghi lại lịch sử hoạt động.
2. **Bảo mật dữ liệu**:
   - Mật khẩu được mã hóa an toàn bằng thuật toán **BCrypt** (Cost factor 10).
   - Tuyệt đối không lưu trữ thông tin nhạy cảm của Kubernetes như Secret values, Private Keys hay Token ServiceAccount trong Database.
3. **Audit Trail**: Mọi bảng quan trọng đều có `created_at`, `updated_at`, `created_by` để phục vụ truy vết.

---

## 2. SƠ ĐỒ THỰC THỂ LIÊN KẾT (MERMAID ERD)

```mermaid
erDiagram
    ROLES ||--o{ USERS : "has"
    TEAMS ||--o{ USERS : "belongs_to"
    TEAMS ||--o{ TEAM_MEMBERS : "contains"
    USERS ||--o{ TEAM_MEMBERS : "joined_as"
    TEAMS ||--|| NAMESPACES : "owns"
    NAMESPACES ||--|| RESOURCE_QUOTAS : "governed_by"
    NAMESPACES ||--|| LIMIT_RANGES : "enforced_by"
    NAMESPACES ||--o{ APPLICATIONS : "deploys_in"
    APPLICATIONS ||--o{ DEPLOYMENTS : "has_versions"
    
    USERS ||--o{ DEMO_SESSIONS : "initiates"
    DEMO_SESSIONS ||--o{ DEMO_TEST_RESULTS : "contains"
    DEMO_TESTS ||--o{ DEMO_TEST_RESULTS : "evaluated_in"
    DEMO_SESSIONS ||--o{ REPORT_FILES : "generates"
    
    USERS ||--o{ AUDIT_LOGS : "performs"

    USERS {
        uuid id PK
        varchar username UK
        varchar password_hash
        varchar full_name
        varchar email
        uuid role_id FK
        uuid team_id FK
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    ROLES {
        uuid id PK
        varchar name UK
        varchar description
    }

    TEAMS {
        uuid id PK
        varchar name UK
        varchar display_name
        varchar description
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    TEAM_MEMBERS {
        uuid id PK
        uuid team_id FK
        uuid user_id FK
        varchar role_in_team
        timestamp joined_at
    }

    NAMESPACES {
        uuid id PK
        varchar name UK
        uuid team_id FK
        varchar status
        timestamp created_at
    }

    RESOURCE_QUOTAS {
        uuid id PK
        uuid namespace_id FK
        varchar cpu_request
        varchar cpu_limit
        varchar memory_request
        varchar memory_limit
        int max_pods
        timestamp updated_at
    }

    LIMIT_RANGES {
        uuid id PK
        uuid namespace_id FK
        varchar default_cpu_request
        varchar default_cpu_limit
        varchar default_mem_request
        varchar default_mem_limit
        varchar max_cpu
        varchar max_mem
        timestamp updated_at
    }

    APPLICATIONS {
        uuid id PK
        varchar name
        uuid namespace_id FK
        varchar container_image
        int replicas
        varchar cpu_request
        varchar cpu_limit
        varchar memory_request
        varchar memory_limit
        int container_port
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    DEPLOYMENTS {
        uuid id PK
        uuid application_id FK
        varchar k8s_deployment_name
        int desired_replicas
        int ready_replicas
        varchar status
        text last_applied_spec
        timestamp created_at
        timestamp updated_at
    }

    DEMO_SESSIONS {
        uuid id PK
        varchar session_name
        uuid executed_by FK
        timestamp start_time
        timestamp end_time
        varchar status
        text overall_conclusion
        timestamp created_at
    }

    DEMO_TESTS {
        uuid id PK
        varchar test_code UK
        varchar name
        text description
        text objective
        int execution_order
    }

    DEMO_TEST_RESULTS {
        uuid id PK
        uuid session_id FK
        uuid test_id FK
        varchar status
        varchar expected_result
        varchar actual_result
        text execution_log
        text technical_evidence
        numeric recorded_cpu_percent
        numeric recorded_mem_mb
        timestamp executed_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        varchar action
        varchar resource_type
        varchar resource_id
        text details
        varchar ip_address
        varchar status
        timestamp created_at
    }

    SYSTEM_SETTINGS {
        uuid id PK
        varchar key UK
        text value
        varchar description
        timestamp updated_at
    }

    REPORT_FILES {
        uuid id PK
        uuid session_id FK
        varchar file_name
        varchar file_type
        varchar file_path
        bigint file_size_bytes
        timestamp generated_at
    }
```

---

## 3. CÁC INDEX VÀ RÀNG BUỘC TỐI ƯU TRUY VẤN

- **Index `idx_users_username`**: Đảm bảo tốc độ tra cứu khi xác thực đăng nhập `O(1)`.
- **Index `idx_demo_results_session`**: Tăng tốc truy vấn toàn bộ bài test của một phiên DEMO.
- **Index `idx_audit_logs_action_date`**: Phục vụ bộ lọc tìm kiếm lịch sử theo mốc thời gian và hành vi.
- **Index `idx_apps_namespace`**: Lọc nhanh các ứng dụng thuộc từng Namespace.
