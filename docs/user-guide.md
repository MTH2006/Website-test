# CẨM NANG HƯỚNG DẪN SỬ DỤNG GIAO DIỆN WEB (USER GUIDE)

Tài liệu hướng dẫn sử dụng 10 màn hình chức năng của nền tảng **Mini CaaS Platform** dành cho Quản trị viên (Admin) và Lập trình viên các nhóm (Developer Team A, B, C).

---

## 1. MÀN HÌNH ĐĂNG NHẬP (LOGIN & QUICK-LOGIN SWITCHER)
- **Đường dẫn:** `/login`
- **Mục đích:** Xác thực người dùng bằng JWT Token và phân quyền giao diện theo Role (`ROLE_ADMIN` hoặc `ROLE_TEAM_LEAD` / `ROLE_DEVELOPER`).
- **Tính năng nổi bật:**
  - Hỗ trợ **4 nút Quick Login 1-click** (Quản trị viên, Team A, Team B, Team C) giúp chuyển đổi nhanh quyền xem khi thuyết trình mà không cần gõ bàn phím.
  - Phân quyền động: Khi đăng nhập bằng tài khoản Team A (`teama_dev`), hệ thống tự động khóa phạm vi chỉ hiển thị tài nguyên trong Namespace `team-a`.

---

## 2. MÀN HÌNH TỔNG QUAN HỆ THỐNG (DASHBOARD)
- **Đường dẫn:** `/`
- **Mục đích:** Cung cấp bức tranh toàn cảnh về cụm Kubernetes theo thời gian thực.
- **Các thành phần chính:**
  - **4 Thẻ số liệu Cluster:** Số Node sẵn sàng, Tổng Namespace, Số Pod đang chạy, Trạng thái sức khỏe kết nối (Healthy 100%).
  - **Biểu đồ phân bổ trạng thái Pod:** Trực quan hóa tỷ lệ Pod Running, Pending, Succeeded, Failed bằng biểu đồ Recharts.
  - **Bảng mức tiêu thụ Quota các nhóm:** Hiển thị thanh đo (Progress Bar) % số Pod, CPU và RAM đã dùng của từng team.
  - **Nhật ký sự kiện gần nhất (Recent Activity):** Ghi nhận các thao tác kiểm thử và triển khai container.

---

## 3. QUẢN LÝ CỤM MÁY CHỦ (CLUSTER MANAGEMENT)
- **Đường dẫn:** `/cluster`
- **Mục đích:** Theo dõi chi tiết các Node vật lý/ảo và các thành phần cốt lõi của Kubernetes.
- **Nội dung hiển thị:**
  - Danh sách Worker/Control-Plane Nodes kèm phiên bản Kubelet (`v1.32.2`), IP nội bộ, kiến trúc OS (`linux/amd64`).
  - Danh sách Pods hạ tầng trong namespace `kube-system` và `calico-system` (etcd, kube-apiserver, calico-node, coredns).

---

## 4. QUẢN LÝ NHÓM PHÁT TRIỂN (TEAM MANAGEMENT)
- **Đường dẫn:** `/teams`
- **Mục đích:** Quản lý không gian làm việc của các nhóm `team-a`, `team-b`, `team-c`.
- **Thao tác có thể thực hiện:**
  - Xem danh sách thành viên thuộc từng nhóm.
  - Theo dõi dung lượng Pods, CPU Request/Limit, Memory Request/Limit thực tế đang sử dụng trên Kubernetes.
  - **Nút "Chỉnh sửa Quota":** Mở hộp thoại (Modal) cho phép Admin điều chỉnh linh hoạt số lượng Pod tối đa và hạn mức CPU/RAM theo nhu cầu của nhóm.

---

## 5. QUẢN LÝ TÀI NGUYÊN (RESOURCE MANAGEMENT)
- **Đường dẫn:** `/resources`
- **Mục đích:** Cấu hình và giám sát 2 cơ chế giới hạn cốt lõi:
  - **ResourceQuota:** Giới hạn trần tổng tài nguyên của Namespace.
  - **LimitRange:** Quy định giá trị mặc định (Default Request/Limit) và cận trên/dưới cho từng Container đơn lẻ nếu lập trình viên không khai báo trong manifest yaml.

---

## 6. QUẢN LÝ ỨNG DỤNG CONTAINER (APPLICATION MANAGEMENT)
- **Đường dẫn:** `/applications`
- **Mục đích:** Triển khai và quản trị vòng đời ứng dụng Container của các nhóm phát triển.
- **Tính năng nổi bật:**
  - **Nút "Triển khai ứng dụng mới" (Deploy Container):** Cho phép chọn Namespace, tên ứng dụng, image an toàn (Nginx, Redis, Alpine, Busybox), số bản sao (Replicas), cấu hình CPU/RAM.
  - **Bộ mẫu ứng dụng có sẵn (Templates):** Triển khai nhanh Nginx Web Server hoặc Redis Cache chỉ với 1 cú click.
  - **Xem nhật ký trực tiếp (View Pod Logs):** Nhấn biểu tượng Terminal để đọc trực tiếp stdout/stderr của container từ Kubernetes.
  - **Xóa ứng dụng an toàn:** Xóa Pod/Deployment khi hoàn thành công việc.

---

## 7. BẢO MẬT & CHÍNH SÁCH (SECURITY & POLICIES)
- **Đường dẫn:** `/security`
- **Mục đích:** Giám sát 3 lớp bảo vệ an ninh của CaaS:
  - **RBAC Playground:** Kiểm tra phân quyền tương tác thực tế giữa các ServiceAccount (`team-a-sa`, `team-b-sa`, `team-c-sa`) trên từng hành động `get`, `create`, `delete` đối với Pods, Deployments và Secrets.
  - **Calico NetworkPolicies:** Danh sách các quy tắc mạng `default-deny-ingress`, `allow-dns`, `allow-team-a-to-b`.
  - **ValidatingAdmissionPolicy:** Quy tắc kiểm duyệt đầu vào (CEL rule) chặn đứng các hình ảnh container ngoài danh mục phê duyệt.

---

## 8. PHÒNG THÍ NGHIỆM KIỂM THỬ (DEMO LAB)
- **Đường dẫn:** `/demo-lab`
- **Mục đích:** Màn hình quan trọng nhất phục vụ báo cáo đồ án trước Hội đồng chấm thi.
- **Giao diện gồm:**
  - **6 Thẻ bài kiểm thử chuyên sâu:** Test 01 (ResourceQuota), Test 02 (RBAC), Test 03 (Secret), Test 04 (NetworkPolicy), Test 05 (Admission Policy), Test 06 (Resource Contention).
  - **Nút "Chạy Tất Cả 6 Kịch Bản":** Tự động thực thi tuần tự cả 6 bài test.
  - **Màn hình Console Nhật Ký Trực Tiếp (Live Execution Log):** Hiển thị từng dòng lệnh, mã phản hồi HTTP 403 Forbidden, thông điệp Kubernetes và thời gian thực thi (Latency).
  - **Nút "Khôi phục trạng thái ban đầu" (Safe Reset):** Dọn dẹp sạch sẽ các Pod thử nghiệm phát sinh sau khi chạy test mà không ảnh hưởng đến cụm hay cơ sở dữ liệu.

---

## 9. LỊCH SỬ KIỂM THỬ BỀN VỮNG (DEMO HISTORY)
- **Đường dẫn:** `/history`
- **Mục đích:** Chứng minh tính bền vững của dữ liệu kiểm thử (được lưu vào PostgreSQL).
- **Tính năng:**
  - Danh sách toàn bộ các phiên kiểm thử kèm ngày giờ, người thực hiện, tỷ lệ đạt (100% Passed).
  - **Xem chi tiết phiên kiểm thử:** Đọc lại bằng chứng kỹ thuật (Technical Evidence) của từng bài test.
  - **So sánh 2 phiên kiểm thử (Compare Modal):** Đặt song song 2 phiên để đối chiếu độ trễ và tính ổn định của cụm Kubernetes.
  - **Xuất dữ liệu:** Hỗ trợ xuất kết quả ra file JSON / CSV để lưu trữ vào báo cáo đồ án.

---

## 10. BÁO CÁO & CẤU HÌNH HỆ THỐNG (REPORTS & SETTINGS)
- **Đường dẫn:** `/reports` và `/settings`
- **Mục đích:**
  - **Trang Báo cáo (`/reports`):** Thống kê tổng hợp số liệu kiểm thử, tỷ lệ thành công của các cơ chế cách ly, cho phép in ấn hoặc xuất báo cáo hoàn chỉnh.
  - **Trang Cấu hình (`/settings`):** Chẩn đoán kết nối backend, cơ sở dữ liệu và cụm Kubernetes theo thời gian thực; tích hợp bảng tra cứu và gợi ý câu trả lời vấn đáp dành cho sinh viên.
