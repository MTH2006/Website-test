-- ========================================================
-- MINI CAAS PLATFORM - DATABASE INITIALIZATION SCHEMA (01)
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TEAMS
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. USERS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TEAM MEMBERS
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_in_team VARCHAR(50) DEFAULT 'DEVELOPER',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_team_user UNIQUE (team_id, user_id)
);

-- 5. NAMESPACES
CREATE TABLE IF NOT EXISTS namespaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(63) UNIQUE NOT NULL,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. RESOURCE QUOTAS
CREATE TABLE IF NOT EXISTS resource_quotas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    namespace_id UUID NOT NULL REFERENCES namespaces(id) ON DELETE CASCADE,
    cpu_request VARCHAR(20) NOT NULL DEFAULT '1000m',
    cpu_limit VARCHAR(20) NOT NULL DEFAULT '2000m',
    memory_request VARCHAR(20) NOT NULL DEFAULT '1Gi',
    memory_limit VARCHAR(20) NOT NULL DEFAULT '2Gi',
    max_pods INT NOT NULL DEFAULT 4,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. LIMIT RANGES
CREATE TABLE IF NOT EXISTS limit_ranges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    namespace_id UUID NOT NULL REFERENCES namespaces(id) ON DELETE CASCADE,
    default_cpu_request VARCHAR(20) DEFAULT '100m',
    default_cpu_limit VARCHAR(20) DEFAULT '500m',
    default_mem_request VARCHAR(20) DEFAULT '128Mi',
    default_mem_limit VARCHAR(20) DEFAULT '512Mi',
    max_cpu VARCHAR(20) DEFAULT '1000m',
    max_mem VARCHAR(20) DEFAULT '1Gi',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. APPLICATIONS
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    namespace_id UUID NOT NULL REFERENCES namespaces(id) ON DELETE CASCADE,
    container_image VARCHAR(255) NOT NULL,
    replicas INT NOT NULL DEFAULT 1,
    cpu_request VARCHAR(20) DEFAULT '100m',
    cpu_limit VARCHAR(20) DEFAULT '200m',
    memory_request VARCHAR(20) DEFAULT '128Mi',
    memory_limit VARCHAR(20) DEFAULT '256Mi',
    container_port INT DEFAULT 80,
    status VARCHAR(30) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_app_namespace UNIQUE (name, namespace_id)
);

-- 9. DEPLOYMENTS
CREATE TABLE IF NOT EXISTS deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    k8s_deployment_name VARCHAR(100) NOT NULL,
    desired_replicas INT NOT NULL DEFAULT 1,
    ready_replicas INT NOT NULL DEFAULT 0,
    status VARCHAR(30) DEFAULT 'PROGRESSING',
    last_applied_spec TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. DEMO SESSIONS
CREATE TABLE IF NOT EXISTS demo_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_name VARCHAR(100) NOT NULL,
    executed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(30) DEFAULT 'IN_PROGRESS',
    overall_conclusion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. DEMO TESTS
CREATE TABLE IF NOT EXISTS demo_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    objective TEXT,
    execution_order INT NOT NULL DEFAULT 1
);

-- 12. DEMO TEST RESULTS
CREATE TABLE IF NOT EXISTS demo_test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES demo_sessions(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES demo_tests(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL, -- PASSED, FAILED, RUNNING, SKIPPED
    expected_result TEXT,
    actual_result TEXT,
    execution_log TEXT,
    technical_evidence TEXT,
    recorded_cpu_percent NUMERIC(5,2) DEFAULT 0.0,
    recorded_mem_mb NUMERIC(8,2) DEFAULT 0.0,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(45),
    status VARCHAR(20) DEFAULT 'SUCCESS',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. REPORT FILES
CREATE TABLE IF NOT EXISTS report_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES demo_sessions(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(20) NOT NULL, -- PDF, CSV
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT DEFAULT 0,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_team_id ON users(team_id);
CREATE INDEX IF NOT EXISTS idx_applications_ns ON applications(namespace_id);
CREATE INDEX IF NOT EXISTS idx_demo_results_session ON demo_test_results(session_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_date ON audit_logs(user_id, created_at);
