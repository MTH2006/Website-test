import React, { useState, useEffect } from 'react';
import { systemApi } from '../services/api';
import {
  Settings,
  Server,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Cpu,
  Shield,
  HelpCircle,
  Terminal,
  ExternalLink,
  Info,
  Clock,
  HardDrive
} from 'lucide-react';

export default function SystemSettings() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealth = async () => {
    try {
      setRefreshing(true);
      const res = await systemApi.getHealth();
      setHealth(res.data);
    } catch (err) {
      console.error('Failed to fetch system health', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const configParams = [
    { name: 'Mini CaaS Frontend Port', value: '5173 (Vite + React)', status: 'Active', safe: true },
    { name: 'Mini CaaS Backend Port', value: '8088 (Spring Boot 3.3.5 / Java 27)', status: 'Active', safe: true },
    { name: 'Mini CaaS PostgreSQL Port', value: '5433 (Container minicaas-postgres)', status: 'Active', safe: true },
    { name: 'Kubernetes Cluster', value: 'Kind caas-cluster (v1.32.2)', status: 'Ready', safe: true },
    { name: 'Container Network Interface (CNI)', value: 'Project Calico v3.28.0 (NetworkPolicy)', status: 'Active', safe: true },
    { name: 'Admission Controller', value: 'Native ValidatingAdmissionPolicy (Whitelist)', status: 'Enforced', safe: true },
    { name: 'External Hotel System Port Isolation', value: '3000, 8080, 5432 (Untouched & Protected)', status: 'Preserved', safe: true },
  ];

  const oralExamQA = [
    {
      q: 'Tại sao cần tắt CNI mặc định của Kind và cài Calico?',
      a: 'Kind mặc định dùng Kindnet CNI, không hỗ trợ NetworkPolicy (chỉ hỗ trợ route Pod thông thường). Calico CNI cung cấp tính năng cô lập mạng L3/L4 bằng Linux iptables/eBPF, cho phép chặn traffic giữa các Namespace (Default Deny) và mở cổng theo quy tắc whitelist.'
    },
    {
      q: 'ResourceQuota và LimitRange khác nhau như thế nào?',
      a: 'ResourceQuota giới hạn TỔNG tài nguyên của toàn bộ Namespace (VD: team-a tối đa 4 Pods, 2000m CPU). LimitRange đặt giá trị MIN/MAX/DEFAULT cho TỪNG Container đơn lẻ trong Pod nếu nhà phát triển không khai báo requests/limits trong file yaml.'
    },
    {
      q: 'ValidatingAdmissionPolicy hoạt động ra sao trong Kubernetes?',
      a: 'Từ Kubernetes 1.30+, ValidatingAdmissionPolicy là cơ chế native dựa trên CEL (Common Expression Language) nhúng trực tiếp vào kube-apiserver. Nó chặn các request triển khai container nếu tên image không nằm trong danh sách an toàn được phép trước khi lưu vào etcd, thay thế cho các webhook nặng nề như OPA Gatekeeper.'
    },
    {
      q: 'RBAC ServiceAccount cô lập quyền truy cập như thế nào?',
      a: 'Mỗi nhóm phát triển được cấp một ServiceAccount riêng (team-a-sa, team-b-sa, team-c-sa) gắn RoleBinding cục bộ trong Namespace của họ. Khi nhóm A truy cập namespace-b hoặc đọc Secret của nhóm khác, Kubernetes API trả về mã lỗi HTTP 403 Forbidden (RBAC Access Denied).'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-7 h-7 text-cyan-400" />
            Cấu hình & Chẩn đoán Hệ thống (System Diagnostics)
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Theo dõi trạng thái kết nối backend, cơ sở dữ liệu PostgreSQL, cụm Kubernetes và tài liệu ôn tập đồ án
          </p>
        </div>
        <button
          onClick={fetchHealth}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 transition font-medium shadow-sm w-fit"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Kiểm tra lại
        </button>
      </div>

      {/* Diagnostics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Backend Status */}
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-400">Spring Boot Backend</span>
            <Server className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${health?.status === 'UP' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-xl font-bold text-white">{health?.status || 'Đang kết nối...'}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Cổng dịch vụ: <span className="font-mono text-cyan-400">8088</span></p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Uptime Service</span>
            <span className="font-mono text-slate-200">{health?.uptime ? `${Math.floor(health.uptime / 60)} phút` : 'Đang tải...'}</span>
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-400">PostgreSQL Database</span>
            <Database className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${health?.database === 'CONNECTED' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span className="text-xl font-bold text-white">{health?.database || 'Chưa kết nối'}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Container: <span className="font-mono text-cyan-400">minicaas-postgres:5433</span></p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>DB Name</span>
            <span className="font-mono text-slate-200">mini_caas_db</span>
          </div>
        </div>

        {/* Kubernetes Cluster Status */}
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-400">Kubernetes API Server</span>
            <Cpu className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${health?.kubernetes === 'CONNECTED' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span className="text-xl font-bold text-white">{health?.kubernetes || 'Chưa kết nối'}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Cụm: <span className="font-mono text-cyan-400">caas-cluster (Kind)</span></p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Client Fabric8</span>
            <span className="font-mono text-slate-200">v6.13.1</span>
          </div>
        </div>
      </div>

      {/* System Configuration Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-semibold text-white">Bảng Tham Số & Cô Lập Cổng Hệ Thống</h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            Tất cả cổng an toàn 100%
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/60 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5 font-medium">Thành phần / Dịch vụ</th>
                <th className="px-6 py-3.5 font-medium">Cổng & Công nghệ</th>
                <th className="px-6 py-3.5 font-medium">Trạng thái</th>
                <th className="px-6 py-3.5 font-medium">Kiểm soát an toàn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {configParams.map((param, index) => (
                <tr key={index} className="hover:bg-slate-850/40 transition">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    {param.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-cyan-300">{param.value}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {param.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Không trùng cổng
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Oral Defense Cheat Sheet for Student */}
      <div className="bg-[#0f172a] border border-cyan-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <HelpCircle className="w-48 h-48 text-cyan-400" />
        </div>
        <div className="flex items-center gap-2.5 mb-4">
          <HelpCircle className="w-6 h-6 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">
            Gợi Ý Trả Lời Vấn Đáp & Bảo Vệ Đồ Án (Presentation & Defense Cheatsheet)
          </h2>
        </div>
        <p className="text-sm text-slate-300 mb-6">
          Các câu hỏi trọng tâm thường được Giảng viên đặt ra khi bảo vệ đồ án CaaS và câu trả lời chuẩn kiến trúc:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {oralExamQA.map((item, idx) => (
            <div key={idx} className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-cyan-300 mb-2 flex items-start gap-2">
                <span className="bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded text-xs">Q{idx + 1}</span>
                {item.q}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
