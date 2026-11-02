# HƯỚNG DẪN CÀI ĐẶT VÀ TRIỂN KHAI MINI CaaS PLATFORM

Tài liệu hướng dẫn chi tiết quy trình cài đặt, cấu hình và vận hành nền tảng **Mini CaaS Platform** trên máy tính cá nhân (Windows 11 / Linux / macOS).

---

## I. YÊU CẦU TIỀN ĐỀ HỆ THỐNG (PREREQUISITES)

| Thành phần | Phiên bản tối thiểu | Ghi chú kiểm tra |
|---|---|---|
| **Hệ điều hành** | Windows 10/11 64-bit, WSL2 | Khuyến nghị bật ảo hóa phần cứng (VT-x / AMD-V) |
| **Docker Desktop** | >= 24.0.0 | Bật WSL2 backend, tối thiểu 4GB RAM cấp cho Docker |
| **Kind CLI** | >= v0.20.0 (v0.27.0) | Công cụ tạo cụm Kubernetes trên Docker containers |
| **Kubectl CLI** | >= v1.28.0 (v1.32.2) | Giao diện điều khiển dòng lệnh Kubernetes |
| **Java JDK** | >= 17 (Khuyến nghị JDK 21 hoặc JDK 27) | Môi trường chạy Spring Boot 3.3.5 Backend |
| **Apache Maven** | >= 3.8.0 | Công cụ build mã nguồn backend (`mvn`) |
| **Node.js & npm**| >= v18.0.0 (Node 24, npm 11) | Môi trường build frontend React Vite |

---

## II. MA TRẬN PHÂN CHIA CỔNG DỊCH VỤ (PORT ISOLATION)

Hệ thống được thiết kế theo quy chuẩn **Không xung đột (Zero Conflict)** với các dự án đang chạy trên máy chủ:

| Dịch vụ | Cổng trên Host | Công nghệ | Mục đích |
|---|---|---|---|
| **Mini CaaS Frontend** | `5173` | React 18 + Vite | Giao diện quản trị Web CaaS |
| **Mini CaaS Backend** | `8088` | Spring Boot 3.3.5 | REST API điều khiển Kubernetes & Database |
| **Mini CaaS Database** | `5433` | PostgreSQL 16 (Container `minicaas-postgres`) | Lưu trữ bền vững tài khoản, quota, kết quả test |
| *Hotel Booking Frontend* | `3000` | Bên ngoài | Được bảo vệ nguyên vẹn |
| *Hotel Booking Backend* | `8080` | Bên ngoài | Được bảo vệ nguyên vẹn |
| *Hotel Booking Database* | `5432` | Bên ngoài | Được bảo vệ nguyên vẹn |

---

## III. QUY TRÌNH CÀI ĐẶT TỰ ĐỘNG (KHUYẾN NGHỊ)

Nhóm phát triển đã tích hợp toàn bộ các bước cấu hình phức tạp vào kịch bản tự động hóa bằng PowerShell:

### Bước 1: Mở PowerShell với quyền User thông thường
Di chuyển vào thư mục gốc của dự án:
```powershell
cd c:\WEBSITE-ĐTDDM
```

### Bước 2: Chạy kịch bản khởi tạo hệ thống
```powershell
powershell -ExecutionPolicy Bypass -File scripts\setup.ps1
```

**Kịch bản `setup.ps1` sẽ tự động:**
1. Kiểm tra sự hiện diện của Docker, Kind, Kubectl, Java, Node.
2. Xác minh và bảo vệ dải cổng của Hotel Booking (3000, 8080, 5432).
3. Khởi tạo cụm Kubernetes Kind `caas-cluster` với `disableDefaultCNI: true`.
4. Cài đặt Project Calico v3.28.0 CNI.
5. Tạo các Namespace (`team-a`, `team-b`, `team-c`), ResourceQuota, LimitRange, RBAC Roles, Calico NetworkPolicies và ValidatingAdmissionPolicy.
6. Khởi chạy Docker Container `minicaas-postgres` trên cổng `5433` và chạy 2 tệp migration SQL (`01_init_schema.sql`, `02_seed_data.sql`).
7. Biên dịch gói ứng dụng backend (`mvn clean package`) và cài đặt thư viện frontend (`npm install`).

---

## IV. QUY TRÌNH KHỞI ĐỘNG HỆ THỐNG HÀNG NGÀY

Chỉ cần chạy 1 lệnh duy nhất để khởi động toàn bộ hệ thống và tự động mở trình duyệt:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\start.ps1
```

Sau khi hoàn tất, giao diện quản trị tự động xuất hiện tại:
👉 **http://localhost:5173**

### Tài khoản đăng nhập sẵn (Demo Accounts):
- **Quản trị viên:** `admin` / `admin123`
- **Lập trình viên Nhóm A:** `teama_dev` / `team123`
- **Lập trình viên Nhóm B:** `teamb_dev` / `team123`
- **Lập trình viên Nhóm C:** `teamc_dev` / `team123`
*(Hoặc có thể nhấn trực tiếp các nút "Quick Demo Login" trên giao diện đăng nhập)*.

---

## V. CÁC TỆP LỆNH QUẢN TRỊ HỆ THỐNG TRONG THƯ MỤC `scripts/`

| Lệnh | Chức năng |
|---|---|
| `powershell -ExecutionPolicy Bypass -File scripts\start.ps1` | Khởi động toàn bộ Database, Backend, Frontend và mở Web |
| `powershell -ExecutionPolicy Bypass -File scripts\stop.ps1` | Dừng an toàn dịch vụ Mini CaaS mà không chạm đến các app khác |
| `powershell -ExecutionPolicy Bypass -File scripts\demo.ps1` | Chạy tự động 6 bài test CaaS bằng dòng lệnh và in báo cáo |
| `powershell -ExecutionPolicy Bypass -File scripts\reset-demo.ps1` | Dọn dẹp an toàn các Pod thử nghiệm sau khi chạy Demo Lab |
| `powershell -ExecutionPolicy Bypass -File scripts\backup.ps1` | Sao lưu cơ sở dữ liệu PostgreSQL vào `database/backup/` |

---

## VI. XỬ LÝ SỰ CỐ THƯỜNG GẶP (TROUBLESHOOTING)

#### 1. Lỗi: Docker Desktop chưa bật
- **Hiện tượng:** Chạy `setup.ps1` báo lỗi kết nối Docker daemon.
- **Khắc phục:** Mở ứng dụng **Docker Desktop**, chờ biểu tượng cá voi chuyển sang màu xanh (Engine running) rồi chạy lại lệnh.

#### 2. Lỗi: Trùng cổng 8088 hoặc 5173
- **Hiện tượng:** Backend hoặc Frontend không khởi động được do cổng đang bận.
- **Khắc phục:** Chạy lệnh `powershell -ExecutionPolicy Bypass -File scripts\stop.ps1` để giải phóng tiến trình cũ, sau đó chạy lại `start.ps1`.

#### 3. Cụm Kubernetes ở trạng thái NotReady sau khi khởi động lại máy
- **Hiện tượng:** `kubectl get nodes` báo trạng thái `NotReady`.
- **Khắc phục:** Calico CNI cần khoảng 15-30 giây để hoàn tất khởi động các Pod trong namespace `kube-system`. Chờ vài giây và kiểm tra lại bằng:
  ```powershell
  kubectl get pods -n kube-system
  ```
