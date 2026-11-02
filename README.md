<<<<<<< HEAD
# MINI CaaS PLATFORM
### Nền tảng Container as a Service Đa Người Dùng với Quota và Cô Lập Tài Nguyên

> **Đồ án môn học:** Điện toán đám mây (Cloud Computing)  
> **Đối tượng:** Sinh viên Năm 2 ngành Công nghệ Thông tin  
> **Kiến trúc:** Microservices & Multi-Tenant Cloud Architecture (Kubernetes + Spring Boot + React + PostgreSQL)  
> **Trạng thái:** Hoàn chỉnh 100% – Kết nối Kubernetes thật – 6/6 Bài kiểm thử ĐẠT (PASSED)

---

## 🌟 TỔNG QUAN ĐỀ TÀI

**Mini CaaS Platform** là một nền tảng **Container as a Service (CaaS)** hoàn chỉnh hoạt động thực tế trên máy tính cá nhân. Hệ thống giải quyết bài toán cốt lõi trong điện toán đám mây: **Làm thế nào để nhiều nhóm phát triển (Teams) cùng chia sẻ một hạ tầng máy chủ Kubernetes duy nhất mà không tranh chấp tài nguyên, không đọc trộm dữ liệu bí mật và không gây mất an ninh mạng cho nhau.**

Hệ thống kết nối trực tiếp với cụm Kubernetes thật (Kind) và cơ sở dữ liệu PostgreSQL thật, **tuyệt đối không sử dụng dữ liệu giả lập (mock data)**.

---

## 🛡️ 4 LỚP BẢO VỆ CỐT LÕI (MULTI-TENANT ISOLATION)

```
+-----------------------------------------------------------------------------------+
|                           NGƯỜI DÙNG & GIAO DIỆN WEB                              |
|          Quản trị viên (Admin)  |  Team A Dev  |  Team B Dev  |  Team C Dev       |
+-----------------------------------------+-----------------------------------------+
                                          | REST API (JWT Bearer / Port 8088)
+-----------------------------------------v-----------------------------------------+
|                    MINI CaaS BACKEND (SPRING BOOT 3.3.5 / JAVA 27)               |
|      - Kubernetes Fabric8 Client        - Quota & Limit Enforcement Service       |
|      - Dynamic RBAC Subject Evaluator   - Automated 6-Test Demo Engine            |
+--------------------+------------------------------------+-------------------------+
                     |                                    |
                     v                                    v
+-----------------------------------+   +-------------------------------------------+
|   POSTGRESQL 16 (PORT 5433)       |   |       KUBERNETES CLUSTER (KIND v1.32.2)   |
|   Container minicaas-postgres     |   |                                           |
|   - 15 bảng lược đồ chuẩn hóa     |   |   +-----------------------------------+   |
|   - Lưu trữ bền vững tài khoản,   |   |   | LỚP 1: TÀI NGUYÊN (ResourceQuota) |   |
|     quota, nhật ký và bằng chứng  |   |   | team-a (Max 4 Pods, 2000m CPU)    |   |
|     kiểm thử                      |   |   | LimitRange (Mặc định 100m / 128Mi)|   |
+-----------------------------------+   |   +-----------------------------------+   |
                                        |   | LỚP 2: QUYỀN HẠN (RBAC & SA)      |   |
                                        |   | team-a-sa, team-b-sa, team-c-sa   |   |
                                        |   | Chặn đọc Secret & xóa Pod chéo    |   |
                                        |   +-----------------------------------+   |
                                        |   | LỚP 3: CÔ LẬP MẠNG (Calico CNI)   |   |
                                        |   | Calico v3.28.0 (Default Deny)     |   |
                                        |   | Whitelist rule: team-a -> team-b  |   |
                                        |   +-----------------------------------+   |
                                        |   | LỚP 4: AN NINH (ValidatingPolicy) |   |
                                        |   | Native CEL Admission Webhook      |   |
                                        |   | Chặn image ngoài Whitelist        |   |
                                        |   +-----------------------------------+   |
                                        +-------------------------------------------+
```

---

## 🔒 AN TOÀN TUYỆT ĐỐI VỚI HỆ THỐNG MÁY CHỦ (ZERO-CONFLICT)

Nền tảng được cấu hình hoạt động trên dải cổng độc lập, **tuyệt đối không can thiệp, không dừng và không xung đột với các hệ thống khác (ví dụ: Hotel Booking)**:

| Dịch vụ | Cổng Mini CaaS | Cổng Hotel Booking (Được bảo vệ) | Trạng thái bảo vệ |
|---|---|---|---|
| **Frontend Web** | `5173` | `3000` | Tách biệt hoàn toàn |
| **Backend API** | `8088` | `8080` | Tách biệt hoàn toàn |
| **Database** | `5433` (minicaas-postgres) | `5432` | Tách biệt hoàn toàn |

---

## ⚡ KHỞI ĐỘNG NHANH TRONG 2 PHÚT (QUICK START)

### 1. Khởi tạo lần đầu (Chỉ chạy 1 lần duy nhất)
Mở PowerShell tại thư mục dự án và chạy:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\setup.ps1
```
*Kịch bản sẽ tự động tạo cụm Kind với Calico CNI, triển khai Quotas, RBAC, Policies, bật container PostgreSQL cổng 5433 và chạy migration database.*

### 2. Khởi động hệ thống hàng ngày
```powershell
powershell -ExecutionPolicy Bypass -File scripts\start.ps1
```
*Tự động khởi động Database, Backend, Frontend và mở trình duyệt tại: **http://localhost:5173**.*

### 3. Dừng hệ thống an toàn
```powershell
powershell -ExecutionPolicy Bypass -File scripts\stop.ps1
```
*Dừng các tiến trình Mini CaaS mà không làm ảnh hưởng đến dữ liệu hoặc các ứng dụng khác.*

---

## 🧪 6 KỊCH BẢN KIỂM THỬ DEMO LAB (TRỌNG TÂM ĐỒ ÁN)

Tất cả 6 bài kiểm thử đều có thể chạy tự động bằng nút bấm trên Web hoặc qua dòng lệnh:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\demo.ps1
```

| Mã kịch bản | Tên bài kiểm thử | Cơ chế bảo vệ | Kết quả thực tế trên K8s | Trạng thái |
|---|---|---|---|---|
| `TEST_01` | **ResourceQuota Enforcement** | Chặn triển khai vượt quá 4 Pods hoặc 2000m CPU | Kubernetes trả về **HTTP 403 Forbidden** (`exceeded quota`) | **PASSED** |
| `TEST_02` | **RBAC Namespace Isolation** | Ngăn `team-a-sa` đọc/xóa tài nguyên trong `team-b` | RBAC trả về `can-i: no` đối với namespace khác | **PASSED** |
| `TEST_03` | **Secret Isolation** | Bảo vệ Secret của Team C trước Team B | Team B truy cập: `no`, Team C truy cập: `yes` | **PASSED** |
| `TEST_04` | **NetworkPolicy Ingress** | Calico CNI chặn giao tiếp mạng Pod-to-Pod | Chặn mặc định (Default Deny), chỉ mở rule chỉ định | **PASSED** |
| `TEST_05` | **Admission Policy Whitelist** | Chặn các Container Image độc hại (như crypto-miner) | ValidatingAdmissionPolicy từ chối ở tầng API Server | **PASSED** |
| `TEST_06` | **Controlled Resource Contention**| Chống hiện tượng láng giềng ồn ào (Noisy Neighbor) | Linux cgroups bóp CPU tại 200m Limit, Node an toàn | **PASSED** |

---

## 🔑 TÀI KHOẢN ĐĂNG NHẬP MẪU

Giao diện đăng nhập hỗ trợ **Quick Demo Login 1-click** hoặc nhập thông tin:

| Vai trò | Tên đăng nhập | Mật khẩu | Quyền hạn hiển thị |
|---|---|---|---|
| **Quản trị viên (Admin)** | `admin` | `admin123` | Toàn quyền cụm, xem tất cả namespace, chạy Demo Lab |
| **Lập trình viên Nhóm A** | `teama_dev` | `team123` | Giới hạn chỉ xem và thao tác trong `team-a` |
| **Lập trình viên Nhóm B** | `teamb_dev` | `team123` | Giới hạn chỉ xem và thao tác trong `team-b` |
| **Lập trình viên Nhóm C** | `teamc_dev` | `team123` | Giới hạn chỉ xem và thao tác trong `team-c` |

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN

```
c:\WEBSITE-ĐTDDM\
├── backend/                       # Mã nguồn Spring Boot 3.3.5 (Java 27, REST API, Fabric8)
│   ├── src/main/java/com/minicaas/
│   │   ├── config/                # Cấu hình Spring Security, CORS, K8s Client
│   │   ├── controller/            # REST Controllers (Auth, Cluster, Teams, DemoLab, ...)
│   │   ├── entity/                # 15 Thực thể JPA chuẩn hóa (Hibernate)
│   │   ├── repository/            # Spring Data JPA Repositories
│   │   └── service/               # Nghiệp vụ CaaS & Thực thi kiểm thử Kubernetes
│   └── pom.xml                    # Cấu hình phụ thuộc Maven
├── frontend/                      # Mã nguồn Giao diện Web (React 18, Vite, Tailwind CSS)
│   ├── src/
│   │   ├── contexts/              # Quản lý phiên đăng nhập JWT (AuthContext)
│   │   ├── layouts/               # Bố cục giao diện chuẩn Dark/DevOps (MainLayout)
│   │   ├── pages/                 # 10 Màn hình chức năng hoàn chỉnh
│   │   └── services/              # Kết nối REST API Axios
│   └── package.json
├── kubernetes/                    # Toàn bộ tệp Manifest Kubernetes thực tế
│   ├── cluster/kind-config.yaml   # Cấu hình cụm Kind với disableDefaultCNI
│   ├── namespaces/namespaces.yaml # Khởi tạo team-a, team-b, team-c
│   ├── quotas/quotas.yaml         # ResourceQuotas (4 pods, 2000m CPU, 2Gi RAM)
│   ├── limitranges/limitranges.yaml # LimitRanges (Default 100m CPU, 128Mi RAM)
│   ├── rbac/rbac.yaml             # ServiceAccounts, Roles, RoleBindings
│   ├── network-policies/          # Calico Ingress Deny, Allow DNS, Allow A-to-B
│   └── admission/                 # Native ValidatingAdmissionPolicy Image Whitelist
├── database/                      # Cơ sở dữ liệu PostgreSQL
│   ├── migrations/                # 01_init_schema.sql (15 bảng) & 02_seed_data.sql
│   └── backup/                    # Nơi lưu các bản sao lưu tự động .sql
├── scripts/                       # Các kịch bản tự động hóa PowerShell
│   ├── setup.ps1                  # Khởi tạo và kiểm tra tiền đề
│   ├── start.ps1                  # Bật DB, Backend, Frontend với 1 lệnh
│   ├── stop.ps1                   # Dừng an toàn hệ thống
│   ├── demo.ps1                   # Chạy tự động 6 kịch bản Demo Lab
│   ├── reset-demo.ps1             # Dọn dẹp sạch sẽ tài nguyên thử nghiệm
│   └── backup.ps1                 # Sao lưu cơ sở dữ liệu
└── docs/                          # Tài liệu kỹ thuật chi tiết
    ├── demo-guide.md              # Kịch bản thuyết trình bảo vệ đồ án (10-15 phút)
    ├── installation-guide.md      # Cẩm nang cài đặt chi tiết
    ├── user-guide.md              # Hướng dẫn sử dụng 10 màn hình Web
    ├── architecture.md            # Thiết kế kiến trúc hệ thống
    ├── database-design.md         # Thiết kế cơ sở dữ liệu & Sơ đồ ERD
    └── api-documentation.md       # Đặc tả các điểm cuối REST API
```

---

## 📚 TÀI LIỆU HỖ TRỢ BẢO VỆ ĐỒ ÁN
- Đọc kịch bản thuyết trình và bộ câu hỏi vấn đáp: [docs/demo-guide.md](file:///c:/WEBSITE-%C4%90TDDM/docs/demo-guide.md)
- Hướng dẫn cài đặt và khắc phục sự cố: [docs/installation-guide.md](file:///c:/WEBSITE-%C4%90TDDM/docs/installation-guide.md)
- Hướng dẫn thao tác giao diện: [docs/user-guide.md](file:///c:/WEBSITE-%C4%90TDDM/docs/user-guide.md)
=======
# Website-test
>>>>>>> origin/main
