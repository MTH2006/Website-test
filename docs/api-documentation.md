# MINI CAAS PLATFORM – TÀI LIỆU ĐẶC TẢ API (RESTFUL API SPECIFICATION)

Tất cả các API yêu cầu xác thực qua Header: `Authorization: Bearer <JWT_TOKEN>` (ngoại trừ các endpoint công khai tại `/api/auth/**`).

---

## 1. MODULE XÁC THỰC (AUTHENTICATION)

### 1.1. Đăng nhập
- **Endpoint**: `POST /api/auth/login`
- **Quyền**: Public
- **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "password123"
  }
  ```
- **Response 200 OK**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "e3b0c442-98fc-1c14-9afb-4c72fe93",
      "username": "admin",
      "fullName": "System Administrator",
      "role": "ROLE_ADMIN",
      "team": null
    }
  }
  ```

### 1.2. Lấy thông tin phiên hiện tại
- **Endpoint**: `GET /api/auth/me`
- **Response 200 OK**: Thông tin User & phạm vi quyền hạn (Namespace Scope).

---

## 2. MODULE CLUSTER & GIÁM SÁT (CLUSTER & MONITORING)

### 2.1. Trạng thái tổng quan cụm
- **Endpoint**: `GET /api/cluster/status`
- **Quyền**: Admin, Team (Team chỉ thấy số liệu trong phạm vi)
- **Response 200 OK**:
  ```json
  {
    "clusterName": "caas-cluster",
    "k8sVersion": "v1.31.2",
    "nodesCount": 1,
    "namespacesCount": 4,
    "totalPods": 6,
    "runningPods": 6,
    "pendingPods": 0,
    "failedPods": 0,
    "cpuUsage": "250m",
    "cpuLimitTotal": "4000m",
    "memoryUsage": "512Mi",
    "memoryLimitTotal": "8192Mi",
    "health": "HEALTHY"
  }
  ```

---

## 3. MODULE QUẢN LÝ NHÓM (TEAMS & NAMESPACES)

### 3.1. Danh sách nhóm phát triển
- **Endpoint**: `GET /api/teams`
- **Quyền**: Admin
- **Response 200 OK**: Mảng thông tin Team A, Team B, Team C kèm thông tin ResourceQuota và Namespace tương ứng.

---

## 4. MODULE ỨNG DỤNG CONTAINER (APPLICATIONS)

### 4.1. Triển khai ứng dụng
- **Endpoint**: `POST /api/applications`
- **Quyền**: Admin, Team (Team chỉ được triển khai trong Namespace của mình)
- **Request Body**:
  ```json
  {
    "name": "web-frontend",
    "namespace": "team-a",
    "image": "nginx:alpine",
    "replicas": 2,
    "cpuRequest": "100m",
    "cpuLimit": "200m",
    "memoryRequest": "128Mi",
    "memoryLimit": "256Mi",
    "containerPort": 80
  }
  ```
- **Response 201 Created**:
  ```json
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "web-frontend",
    "namespace": "team-a",
    "status": "RUNNING",
    "readyReplicas": 2
  }
  ```

### 4.2. Lấy log của Pod
- **Endpoint**: `GET /api/applications/{id}/pods/{podName}/logs`
- **Response 200 OK**: Chuỗi text logs trích xuất trực tiếp từ Kubernetes.

---

## 5. MODULE DEMO LAB (TRUNG TÂM KIỂM THỬ TỰ ĐỘNG)

### 5.1. Danh sách bài test
- **Endpoint**: `GET /api/demo-lab/tests`
- **Response**: 6 bài kiểm thử bắt buộc (Quota, RBAC, Secret, NetworkPolicy, Admission, Resource Contention).

### 5.2. Chạy bài kiểm thử đơn lẻ
- **Endpoint**: `POST /api/demo-lab/run-test/{testCode}`
- **Ví dụ**: `POST /api/demo-lab/run-test/TEST_01_RESOURCEQUOTA`
- **Response 200 OK**:
  ```json
  {
    "testCode": "TEST_01_RESOURCEQUOTA",
    "status": "PASSED",
    "expectedResult": "Kubernetes API từ chối tạo Pod thứ 5 khi vượt quá Pod Quota = 4",
    "actualResult": "403 Forbidden: pods 'overflow-pod' is forbidden: exceeded quota: team-a-quota, requested: pods=1, used: pods=4, limited: pods=4",
    "executionLog": "[INFO] Initial pods: 4/4...\n[ACTION] Attempting deploy pod 5...\n[K8S] Request rejected with 403 Forbidden.",
    "technicalEvidence": "kubectl describe quota team-a-quota -n team-a",
    "durationMs": 1420
  }
  ```

### 5.3. Reset trạng thái DEMO an toàn
- **Endpoint**: `POST /api/demo-lab/reset`
- **Mô tả**: Xóa các Pods/Deployments có nhãn `demo-test=true`, giữ nguyên Cluster, Namespace và Database.

---

## 6. MODULE LỊCH SỬ DEMO & BÁO CÁO (DEMO HISTORY & REPORTS)

- `GET /api/demo-history`: Danh sách tất cả các phiên DEMO đã lưu trong PostgreSQL.
- `GET /api/demo-history/{sessionId}`: Chi tiết kết quả 6 bài test của phiên.
- `GET /api/reports/export/csv/{sessionId}`: Xuất dữ liệu bảng kết quả định dạng CSV.
- `GET /api/reports/export/pdf/{sessionId}`: Xuất tài liệu tóm tắt báo cáo hoàn chỉnh.
