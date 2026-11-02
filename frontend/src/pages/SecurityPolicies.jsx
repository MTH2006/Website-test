import React, { useState, useEffect } from 'react';
import { securityApi } from '../services/api';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Network,
  CheckCircle2,
  XCircle,
  Play,
  Server,
  Layers,
  RefreshCw
} from 'lucide-react';

export default function SecurityPolicies() {
  const [policies, setPolicies] = useState(null);
  const [loading, setLoading] = useState(true);

  // RBAC Playground
  const [rbacTest, setRbacTest] = useState({
    serviceAccount: 'team-a-sa',
    namespace: 'team-a',
    verb: 'get',
    resource: 'pods',
  });
  const [rbacResult, setRbacResult] = useState(null);
  const [testingRbac, setTestingRbac] = useState(false);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await securityApi.getPolicies();
      if (res.data?.data) {
        setPolicies(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải chính sách bảo mật:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleTestRbac = async (e) => {
    e.preventDefault();
    setTestingRbac(true);
    setRbacResult(null);
    try {
      const res = await securityApi.testRbac(rbacTest);
      setRbacResult(res.data?.data);
    } catch (err) {
      console.error('Lỗi khi test RBAC:', err);
      setRbacResult(false);
    } finally {
      setTestingRbac(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <span>Chính sách Bảo mật & Cô lập Hệ thống (Security & Policies)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Kiểm soát truy cập RBAC, cô lập mạng Calico NetworkPolicy và kiểm soát đầu vào ValidatingAdmissionPolicy
          </p>
        </div>

        <button
          onClick={fetchPolicies}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-all flex items-center space-x-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* 3 Pillars Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h3 className="font-semibold text-sm">Kubernetes RBAC</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Phân quyền theo Namespace. ServiceAccount của từng nhóm chỉ được thao tác trong không gian tên của mình (Least Privilege).
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400">
            <CheckCircle2 className="w-4 h-4" />
            <h3 className="font-semibold text-sm">Calico NetworkPolicy</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Chính sách Default Deny Ingress chặn toàn bộ gói tin xuyên Namespace. Chỉ cho phép các luồng đã được cấu hình phê duyệt.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-purple-400">
            <CheckCircle2 className="w-4 h-4" />
            <h3 className="font-semibold text-sm">Admission Control (VAP)</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Áp dụng ValidatingAdmissionPolicy native trong K8s v1.32. Từ chối ngay lập tức các Container Image không có trong Whitelist.
          </p>
        </div>
      </div>

      {/* Interactive RBAC Playground */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div>
          <h3 className="font-bold text-sm text-white flex items-center space-x-2">
            <Play className="w-4 h-4 text-cyan-400" />
            <span>Công cụ Kiểm tra Quyền RBAC Trực tiếp (Live kubectl auth can-i Playground)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Gửi yêu cầu <span className="font-mono text-cyan-300">SubjectAccessReview</span> trực tiếp tới K8s API Server để xác minh quyền hạn thực tế.
          </p>
        </div>

        <form onSubmit={handleTestRbac} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">ServiceAccount</label>
            <select
              value={rbacTest.serviceAccount}
              onChange={(e) => setRbacTest({ ...rbacTest, serviceAccount: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="team-a-sa">team-a-sa (Team A)</option>
              <option value="team-b-sa">team-b-sa (Team B)</option>
              <option value="team-c-sa">team-c-sa (Team C)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Namespace Mục tiêu</label>
            <select
              value={rbacTest.namespace}
              onChange={(e) => setRbacTest({ ...rbacTest, namespace: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="team-a">team-a</option>
              <option value="team-b">team-b</option>
              <option value="team-c">team-c</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Hành động (Verb)</label>
            <select
              value={rbacTest.verb}
              onChange={(e) => setRbacTest({ ...rbacTest, verb: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="get">get (Đọc 1 mục)</option>
              <option value="list">list (Đọc danh sách)</option>
              <option value="create">create (Tạo mới)</option>
              <option value="delete">delete (Xóa)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Tài nguyên (Resource)</label>
            <select
              value={rbacTest.resource}
              onChange={(e) => setRbacTest({ ...rbacTest, resource: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="pods">pods</option>
              <option value="deployments">deployments</option>
              <option value="secrets">secrets</option>
              <option value="resourcequotas">resourcequotas</option>
            </select>
          </div>

          <div className="sm:col-span-4 flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={testingRbac}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold shadow-md shadow-cyan-500/20 transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{testingRbac ? 'Đang truy vấn K8s API...' : 'Kiểm tra Quyền (Check Permission)'}</span>
            </button>

            {rbacResult !== null && (
              <div
                className={`px-4 py-2 rounded-xl border flex items-center space-x-2 font-mono font-bold text-xs ${
                  rbacResult
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {rbacResult ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>KẾT QUẢ K8S: ALLOWED (Có quyền)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>KẾT QUẢ K8S: FORBIDDEN (Bị từ chối)</span>
                  </>
                )}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Calico NetworkPolicy List */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="font-bold text-sm text-white flex items-center space-x-2 mb-3">
          <Network className="w-4 h-4 text-cyan-400" />
          <span>Danh sách Chính sách Mạng Calico Đang áp dụng (Active NetworkPolicies)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase">
              <tr>
                <th className="py-2.5 px-4">Tên Chính sách</th>
                <th className="py-2.5 px-4">Namespace</th>
                <th className="py-2.5 px-4">Loại Chính sách</th>
                <th className="py-2.5 px-4">Mô tả Hiệu lực</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {policies?.networkPolicies?.map((np, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-slate-200">{np.name}</td>
                  <td className="py-3 px-4 text-cyan-400">{np.namespace}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px]">
                      {np.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{np.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
