# KỊCH BẢN THUYẾT TRÌNH & HƯỚNG DẪN DEMO ĐỒ ÁN MINI CaaS PLATFORM

> **Đề tài:** Xây dựng nền tảng Container as a Service (CaaS) nhỏ cho nhiều nhóm phát triển với Quota và cô lập tài nguyên.  
> **Môn học:** Điện toán đám mây (Cloud Computing) – Dành cho Sinh viên Năm 2 CNTT.  
> **Thời lượng báo cáo đề xuất:** 12 - 15 phút.

---

## I. MỤC TIÊU BÁO CÁO & DEMO
1. **Chứng minh tính thực tế (Live System):** Toàn bộ giao diện Web, Spring Boot Backend kết nối trực tiếp với cụm Kubernetes Kind và cơ sở dữ liệu PostgreSQL thực tế, không dùng dữ liệu giả lập (mock data).
2. **Chứng minh tính đa người dùng (Multi-Tenancy):** Phân chia tài nguyên độc lập giữa các nhóm `team-a`, `team-b`, `team-c`.
3. **Chứng minh 4 lớp bảo vệ cốt lõi:**
   - **Lớp 1: Giới hạn tài nguyên (ResourceQuota & LimitRange)** – Ngăn cạn kiệt tài nguyên cụm.
   - **Lớp 2: Phân quyền truy cập (RBAC & ServiceAccount)** – Ngăn thao tác trái phép chéo Namespace.
   - **Lớp 3: Cô lập mạng (Calico NetworkPolicy)** – Chặn gói tin mạng giữa các nhóm theo nguyên tắc Default-Deny.
   - **Lớp 4: Kiểm soát an ninh đầu vào (ValidatingAdmissionPolicy)** – Chặn các Container Image độc hại/không được cấp phép.
4. **An toàn môi trường chủ (Host Safety):** Cô lập hoàn toàn cổng dịch vụ (5173, 8088, 5433), tuyệt đối không gây xung đột với các hệ sinh thái khác (như Hotel Booking ở cổng 3000, 8080, 5432).

---

## II. LỘ TRÌNH THUYẾT TRÌNH (12 - 15 PHÚT)

| Thời lượng | Nội dung | Thao tác thực tế trên Web / Terminal |
|---|---|---|
| **00:00 - 02:00** | Giới thiệu bài toán CaaS, kiến trúc Multi-Tenant | Trình chiếu slide / Mở màn hình đăng nhập |
| **02:00 - 04:00** | Đăng nhập Admin & Tổng quan Cluster | Màn hình Dashboard, xem số Node, Pod, Quota |
| **04:00 - 06:00** | Demo Đăng nhập phân quyền theo nhóm | Đăng nhập `teama_dev` -> Chỉ xem được `team-a` |
| **06:00 - 12:00** | **Chạy 6 Kịch bản DEMO LAB** | Nhấn chạy từng bài test, phân tích bằng chứng kỹ thuật (Evidence) |
| **12:00 - 14:00** | Xem Lịch sử DEMO & Báo cáo so sánh | Màn hình Demo History, xem log lưu bền vững trong DB |
| **14:00 - 15:00** | Kết luận, hỏi đáp với Hội đồng chấm thi | Trả lời câu hỏi vấn đáp |

---

## III. CHI TIẾT 6 KỊCH BẢN DEMO LAB (TRỌNG TÂM ĐỒ ÁN)

### KỊCH BẢN 1: ResourceQuota Enforcement (Giới hạn tài nguyên)
- **Vấn đề thực tế:** Nhóm phát triển tạo quá nhiều Pod hoặc xin quá nhiều RAM/CPU làm nghẽn cụm máy chủ.
- **Cách demo trên Web:**
  1. Vào menu **DEMO LAB (Kiểm thử)**.
  2. Tại thẻ **Test 01 – ResourceQuota**, nhấn nút **"Chạy Kiểm Thử"**.
- **Diễn giải cho giảng viên:**
  > *"Thưa thầy cô, hạn mức tối đa của Namespace team-a là 4 Pods. Hệ thống tự động triển khai Pod thứ 5 mang tên `test-quota-probe`. Kubernetes Admission Controller lập tức kích hoạt chính sách ResourceQuota và trả về lỗi HTTP 403 Forbidden với thông điệp: `exceeded quota: compute-resources, requested: pods=1, used: pods=4, limited: pods=4`. Điều này chứng minh Kubernetes đã bảo vệ cụm thành công!"*
- **Lệnh kiểm tra dòng lệnh (nếu giảng viên yêu cầu):**
  ```powershell
  kubectl get resourcequota -n team-a
  kubectl describe quota team-a-quota -n team-a
  ```

---

### KỊCH BẢN 2: RBAC Cross-Namespace Isolation (Cô lập quyền hạn nhóm)
- **Vấn đề thực tế:** Một lập trình viên nhóm A vô tình hoặc cố ý xóa tài nguyên của nhóm B.
- **Cách demo trên Web:**
  1. Tại thẻ **Test 02 – RBAC Isolation**, nhấn **"Chạy Kiểm Thử"**.
- **Diễn giải cho giảng viên:**
  > *"Hệ thống sử dụng ServiceAccount `team-a-sa` thực hiện kiểm tra phân quyền (SelfSubjectAccessReview). Kết quả trả về: nhóm A có toàn quyền (yes) trong namespace `team-a`, nhưng bị Kubernetes RBAC từ chối hoàn toàn (no) khi cố gắng đọc Pod hoặc xóa Deployment trong namespace `team-b`. Thao tác chéo nhóm bị chặn ở tầng API Server."*
- **Lệnh kiểm tra dòng lệnh:**
  ```powershell
  kubectl auth can-i delete deployments --as=system:serviceaccount:team-a:team-a-sa -n team-b
  # Kết quả in ra: no
  ```

---

### KỊCH BẢN 3: Secret Isolation (Bảo vệ bí mật cấu hình)
- **Vấn đề thực tế:** Thông tin nhạy cảm (API Keys, Database Passwords) của Team C bị các nhóm khác đọc lén.
- **Cách demo trên Web:**
  1. Tại thẻ **Test 03 – Secret Isolation**, nhấn **"Chạy Kiểm Thử"**.
- **Diễn giải cho giảng viên:**
  > *"Namespace `team-c` chứa một Secret bảo mật là `team-c-vault-secret`. Khi ServiceAccount của Team B cố gắng đọc Secret này, Kubernetes từ chối với kết quả `no`. Chỉ ServiceAccount `team-c-sa` mới có quyền đọc (`yes`). Dữ liệu nhạy cảm được bảo vệ tuyệt đối."*
- **Lệnh kiểm tra dòng lệnh:**
  ```powershell
  kubectl auth can-i get secrets/team-c-vault-secret --as=system:serviceaccount:team-b:team-b-sa -n team-c
  # Kết quả in ra: no
  ```

---

### KỊCH BẢN 4: NetworkPolicy Ingress Isolation (Cô lập lưu lượng mạng Pod-to-Pod)
- **Vấn đề thực tế:** Pod của nhóm A bị nhiễm mã độc và cố gắng tấn công mạng nội bộ sang Pod của nhóm B.
- **Cách demo trên Web:**
  1. Tại thẻ **Test 04 – NetworkPolicy Ingress**, nhấn **"Chạy Kiểm Thử"**.
- **Diễn giải cho giảng viên:**
  > *"Kind mặc định không hỗ trợ lọc gói tin, vì vậy nhóm em đã cấu hình CNI Calico v3.28.0 và thiết lập chính sách Default-Deny trên tất cả Ingress traffic. Khi kiểm thử, traffic từ ngoài bị chặn hoàn toàn. Sau đó, quy tắc `allow-team-a-to-b` được áp dụng, chỉ cho phép luồng dữ liệu hợp lệ từ nhãn nhóm A đến cổng chỉ định của nhóm B."*
- **Lệnh kiểm tra dòng lệnh:**
  ```powershell
  kubectl get networkpolicy -A
  kubectl describe networkpolicy default-deny-ingress -n team-b
  ```

---

### KỊCH BẢN 5: Admission Policy Image Whitelist (Chính sách nguồn Container Image)
- **Vấn đề thực tế:** Lập trình viên tải container lạ không rõ nguồn gốc (như image đào coin `malicious/crypto-miner:latest`).
- **Cách demo trên Web:**
  1. Tại thẻ **Test 05 – Admission Policy**, nhấn **"Chạy Kiểm Thử"**.
- **Diễn giải cho giảng viên:**
  > *"Nhóm em ứng dụng tính năng hiện đại nhất từ Kubernetes 1.30+ là ValidatingAdmissionPolicy viết bằng CEL (Common Expression Language). Danh mục hình ảnh được phép bao gồm: nginx, alpine, busybox, redis. Khi gửi yêu cầu chạy image `malicious/crypto-miner:latest`, Admission Webhook native lập tức hủy bỏ yêu cầu ngay tại cửa ngõ API Server với mã lỗi 403 Forbidden."*
- **Lệnh kiểm tra dòng lệnh:**
  ```powershell
  kubectl get validatingadmissionpolicy
  kubectl get validatingadmissionpolicybinding
  ```

---

### KỊCH BẢN 6: Controlled Resource Contention & CPU Limits (Chống Noisy Neighbor)
- **Vấn đề thực tế:** Một container bị vòng lặp vô tận (infinite loop) chiếm hết 100% CPU của Node vật lý, làm sập các ứng dụng khác.
- **Cách demo trên Web:**
  1. Tại thẻ **Test 06 – Resource Contention**, nhấn **"Chạy Kiểm Thử"**.
- **Diễn giải cho giảng viên:**
  > *"Hệ thống sinh tải CPU có kiểm soát bên trong namespace thử nghiệm. Nhờ có `LimitRange` và `resources.limits.cpu = 200m`, nhân Linux cgroups tự động bóp nghẽn (CPU Throttling) container sinh tải ở đúng mức trần 200 millicores. Node vật lý và các Pod của Team A, Team B vẫn vận hành mượt mà với 0% độ trễ."*

---

## IV. BỘ CÂU HỎI VẤN ĐÁP THƯỜNG GẶP (ORAL EXAM CHEATSHEET)

#### Câu 1: Tại sao không dùng Docker Compose cho nhanh mà phải dùng Kubernetes?
> **Trả lời:** Docker Compose phù hợp cho môi trường phát triển đơn máy của 1 nhóm nhỏ, không có khái niệm ResourceQuota tự động bóp nghẽn, không có RBAC phân quyền nhiều ServiceAccount, và không có NetworkPolicy cô lập mạng ảo L3/L4. Kubernetes cung cấp đầy đủ các chuẩn công nghiệp của một nền tảng Cloud Native thực thụ.

#### Câu 2: Sự khác nhau bản chất giữa ResourceQuota và LimitRange là gì?
> **Trả lời:**
> - **ResourceQuota:** Hoạt động ở phạm vi **TỔNG THỂ** của Namespace (ví dụ: cả nhóm A chỉ được dùng tối đa 4 Pods, 2000m CPU).
> - **LimitRange:** Hoạt động ở phạm vi **TỪNG POD / CONTAINER** (ví dụ: nếu dev không khai báo cấu hình, hệ thống sẽ tự động gán mặc định 100m CPU / 128Mi RAM, và chặn nếu 1 Pod đòi quá 1000m CPU).

#### Câu 3: Dữ liệu lịch sử chạy test được lưu ở đâu? Nếu tắt máy có mất không?
> **Trả lời:** Dữ liệu lịch sử test được Spring Boot Backend lưu vĩnh viễn vào cơ sở dữ liệu PostgreSQL (`mini_caas_db`) chạy container trên cổng `5433` gắn Docker Volume `minicaas_pgdata`. Ngay cả khi tắt máy hoặc khởi động lại cụm Kubernetes, toàn bộ lịch sử chạy test, nhật ký chi tiết và thời gian thực thi vẫn nguyên vẹn 100%.

#### Câu 4: Vì sao hệ thống không bị xung đột với các ứng dụng khác đang chạy trên máy?
> **Trả lời:** Nền tảng Mini CaaS được thiết kế cô lập cổng tuyệt đối:
> - Frontend: Cổng **5173**
> - Backend: Cổng **8088**
> - PostgreSQL: Cổng **5433**
> Nhóm em đã kiểm tra và bảo toàn nguyên vẹn các dải cổng máy chủ phổ biến (như 3000, 8080, 5432), đảm bảo không ảnh hưởng đến bất kỳ dự án nào khác đang vận hành trên máy chủ.
