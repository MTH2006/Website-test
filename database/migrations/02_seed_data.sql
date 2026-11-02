-- ========================================================
-- MINI CAAS PLATFORM - INITIAL SEED DATA (02)
-- ========================================================

-- 1. SEED ROLES
INSERT INTO roles (id, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'ROLE_ADMIN', 'Platform Administrator with full cluster & management access'),
('22222222-2222-2222-2222-222222222222', 'ROLE_TEAM_LEAD', 'Team Lead with namespace administrative permissions'),
('33333333-3333-3333-3333-333333333333', 'ROLE_TEAM_MEMBER', 'Developer with limited deployment permissions inside team namespace')
ON CONFLICT (name) DO NOTHING;

-- 2. SEED TEAMS
INSERT INTO teams (id, name, display_name, description, status) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'team-a', 'Team A (Frontend Services)', 'Specialized in frontend web applications and API gateways', 'ACTIVE'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'team-b', 'Team B (Backend Services)', 'Specialized in core business logic and background workers', 'ACTIVE'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'team-c', 'Team C (Data & Analytics)', 'Specialized in data processing pipelines and secret vaults', 'ACTIVE')
ON CONFLICT (name) DO NOTHING;

-- 3. SEED USERS (BCrypt hashed passwords)
-- admin: admin123 ($2a$10$V0Ue5ZpT8mK6DqQ9W2b8xeiK3xY.zY8gG1j1cQ2p4r7t9s1w3y5a.)
-- teama_dev: teama123 ($2a$10$eO1k5ZpT8mK6DqQ9W2b8xeiK3xY.zY8gG1j1cQ2p4r7t9s1w3y5b.)
-- teamb_dev: teamb123 ($2a$10$aB2k5ZpT8mK6DqQ9W2b8xeiK3xY.zY8gG1j1cQ2p4r7t9s1w3y5c.)
-- teamc_dev: teamc123 ($2a$10$cD3k5ZpT8mK6DqQ9W2b8xeiK3xY.zY8gG1j1cQ2p4r7t9s1w3y5d.)
INSERT INTO users (id, username, password_hash, full_name, email, role_id, team_id, active) VALUES
('00000000-0000-0000-0000-000000000001', 'admin', '$2a$10$e8pA8lU7w/KkL3hL6yU3ue7b9sI5tE4uL9kR2oP7w4xQ1yE8rI6iS', 'System Administrator', 'admin@minicaas.local', '11111111-1111-1111-1111-111111111111', NULL, TRUE),
('00000000-0000-0000-0000-000000000002', 'teama_dev', '$2a$10$e8pA8lU7w/KkL3hL6yU3ue7b9sI5tE4uL9kR2oP7w4xQ1yE8rI6iS', 'Team A Developer', 'dev-a@minicaas.local', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', TRUE),
('00000000-0000-0000-0000-000000000003', 'teamb_dev', '$2a$10$e8pA8lU7w/KkL3hL6yU3ue7b9sI5tE4uL9kR2oP7w4xQ1yE8rI6iS', 'Team B Developer', 'dev-b@minicaas.local', '33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', TRUE),
('00000000-0000-0000-0000-000000000004', 'teamc_dev', '$2a$10$e8pA8lU7w/KkL3hL6yU3ue7b9sI5tE4uL9kR2oP7w4xQ1yE8rI6iS', 'Team C Developer', 'dev-c@minicaas.local', '33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', TRUE)
ON CONFLICT (username) DO NOTHING;

-- 4. SEED NAMESPACES
INSERT INTO namespaces (id, name, team_id, status) VALUES
('10000000-0000-0000-0000-000000000001', 'team-a', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ACTIVE'),
('20000000-0000-0000-0000-000000000002', 'team-b', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ACTIVE'),
('30000000-0000-0000-0000-000000000003', 'team-c', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'ACTIVE')
ON CONFLICT (name) DO NOTHING;

-- 5. SEED RESOURCE QUOTAS (Default limits per team)
INSERT INTO resource_quotas (namespace_id, cpu_request, cpu_limit, memory_request, memory_limit, max_pods) VALUES
('10000000-0000-0000-0000-000000000001', '1000m', '2000m', '1Gi', '2Gi', 4),
('20000000-0000-0000-0000-000000000002', '1000m', '2000m', '1Gi', '2Gi', 4),
('30000000-0000-0000-0000-000000000003', '1000m', '2000m', '1Gi', '2Gi', 4);

-- 6. SEED LIMIT RANGES
INSERT INTO limit_ranges (namespace_id, default_cpu_request, default_cpu_limit, default_mem_request, default_mem_limit, max_cpu, max_mem) VALUES
('10000000-0000-0000-0000-000000000001', '100m', '500m', '128Mi', '512Mi', '1000m', '1Gi'),
('20000000-0000-0000-0000-000000000002', '100m', '500m', '128Mi', '512Mi', '1000m', '1Gi'),
('30000000-0000-0000-0000-000000000003', '100m', '500m', '128Mi', '512Mi', '1000m', '1Gi');

-- 7. SEED 6 DEMO TESTS
INSERT INTO demo_tests (id, test_code, name, description, objective, execution_order) VALUES
('90000000-0000-0000-0000-000000000001', 'TEST_01_RESOURCEQUOTA', 'Test 01 – ResourceQuota Enforcement', 'Triển khai Pod vượt quá hạn mức cho phép trong Namespace team-a để kiểm tra phản hồi từ chối của Kubernetes.', 'Chứng minh Kubernetes chặn yêu cầu vượt quá Pod Quota hoặc CPU/RAM Quota.', 1),
('90000000-0000-0000-0000-000000000002', 'TEST_02_RBAC', 'Test 02 – RBAC Cross-Namespace Isolation', 'Sử dụng ServiceAccount của Team A thử truy cập đọc Pod và xóa Deployment tại Namespace team-b.', 'Chứng minh RBAC ngăn chặn việc truy cập hoặc thao tác chéo ngoài phạm vi quyền được cấp.', 2),
('90000000-0000-0000-0000-000000000003', 'TEST_03_SECRET', 'Test 03 – Secret Isolation', 'Team B cố gắng đọc dữ liệu Secret bảo mật thuộc sở hữu của Team C.', 'Chứng minh Secret của nhóm này được cô lập hoàn toàn trước các nhóm khác.', 3),
('90000000-0000-0000-0000-000000000004', 'TEST_04_NETWORKPOLICY', 'Test 04 – NetworkPolicy Ingress Isolation', 'Thực hiện kết nối mạng (HTTP/Ping) giữa Pod Team A sang Pod Team B trước và sau khi áp dụng chính sách cho phép.', 'Chứng minh Calico NetworkPolicy chặn giao tiếp mặc định giữa các nhóm và chỉ mở khi có quy tắc cho phép.', 4),
('90000000-0000-0000-0000-000000000005', 'TEST_05_ADMISSION', 'Test 05 – Admission Policy Image Whitelist', 'Triển khai Container Image từ nguồn ngoài danh mục phê duyệt để kiểm tra Admission Control.', 'Chứng minh Kubernetes từ chối Image không hợp lệ theo chính sách bảo mật đầu vào.', 5),
('90000000-0000-0000-0000-000000000006', 'TEST_06_RESOURCE_CONTENTION', 'Test 06 – Controlled Resource Contention', 'Sinh tải CPU có kiểm soát trong Namespace kiểm thử để quan sát CPU Throttling và cơ chế lập lịch công bằng.', 'Chứng minh giới hạn Resource Limits bảo vệ cụm khỏi hiện tượng Noisy Neighbor mà không làm sập Node.', 6)
ON CONFLICT (test_code) DO NOTHING;

-- 8. SYSTEM SETTINGS
INSERT INTO system_settings (key, value, description) VALUES
('PLATFORM_VERSION', '1.0.0', 'Phiên bản hiện tại của Mini CaaS Platform'),
('ALLOWED_CONTAINER_REGISTRIES', 'docker.io/library/nginx,docker.io/library/alpine,docker.io/library/busybox,docker.io/library/redis', 'Danh sách Container Image Registry được phép triển khai'),
('DEMO_MODE', 'ENABLED', 'Kích hoạt môi trường thực hiện kiểm thử tự động')
ON CONFLICT (key) DO NOTHING;
