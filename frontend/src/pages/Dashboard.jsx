import React, { useState, useEffect } from 'react';
import { clusterApi, teamApi, demoHistoryApi } from '../services/api';
import {
  Server,
  Layers,
  Cpu,
  Database,
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Dashboard() {
  const [cluster, setCluster] = useState(null);
  const [teams, setTeams] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clusterRes, teamsRes, historyRes] = await Promise.all([
        clusterApi.getStatus(),
        teamApi.getAll(),
        demoHistoryApi.getAllSessions(),
      ]);

      if (clusterRes.data?.data) setCluster(clusterRes.data.data);
      if (teamsRes.data?.data) setTeams(teamsRes.data.data);
      if (historyRes.data?.data) setRecentSessions(historyRes.data.data.slice(0, 5));
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10s auto refresh
    return () => clearInterval(interval);
  }, []);

  const pieData = [
    { name: 'Running', value: cluster?.runningPods || 0, color: '#10b981' },
    { name: 'Pending', value: cluster?.pendingPods || 0, color: '#f59e0b' },
    { name: 'Failed', value: cluster?.failedPods || 0, color: '#ef4444' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Dashboard Tổng quan Cụm (Cluster Overview)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi trạng thái thời gian thực từ Kubernetes Cluster <span className="text-cyan-400 font-mono">caas-cluster</span>
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Làm mới dữ liệu</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Tổng số Pods</p>
            <h3 className="text-2xl font-bold text-white mt-1 font-mono">
              {cluster?.totalPods ?? '--'}
            </h3>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>{cluster?.runningPods ?? 0} Running</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Số Nhóm (Teams)</p>
            <h3 className="text-2xl font-bold text-white mt-1 font-mono">3 Teams</h3>
            <p className="text-[11px] text-cyan-400 mt-1">team-a, team-b, team-c</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Server className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">CPU Phân bổ</p>
            <h3 className="text-2xl font-bold text-white mt-1 font-mono">
              {cluster?.cpuRequested ?? '600m'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              Capacity: {cluster?.cpuCapacity ?? '4000m'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Bộ nhớ RAM</p>
            <h3 className="text-2xl font-bold text-white mt-1 font-mono">
              {cluster?.memoryRequested ?? '1024Mi'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              Capacity: {cluster?.memoryCapacity ?? '8192Mi'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Database className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Cluster Details & Security Policy Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node & K8s Information */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-white flex items-center space-x-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Kubernetes Cluster Node</span>
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {cluster?.health || 'HEALTHY'}
            </span>
          </div>

          <div className="space-y-3 pt-2 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Cluster Name:</span>
              <span className="text-slate-200">{cluster?.clusterName || 'caas-cluster'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">K8s Engine:</span>
              <span className="text-slate-200">Kind v0.27.0 (Linux in Docker)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">K8s API Version:</span>
              <span className="text-cyan-400">{cluster?.k8sVersion || 'v1.32.2'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Control-Plane Node:</span>
              <span className="text-slate-200">caas-cluster-control-plane</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Node Internal IP:</span>
              <span className="text-slate-200">
                {cluster?.nodes?.[0]?.internalIp || '172.20.0.2'}
              </span>
            </div>
          </div>
        </div>

        {/* Pod Status Distribution Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <h3 className="font-semibold text-sm text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Phân bố trạng thái Pods</span>
          </h3>

          <div className="h-44 flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c2541',
                      border: '1px solid #3a506b',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-500">Đang cập nhật số liệu...</p>
            )}
          </div>

          <div className="flex justify-around text-xs font-mono pt-2 border-t border-slate-800/80">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300">Running: {cluster?.runningPods || 0}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-slate-300">Pending: {cluster?.pendingPods || 0}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
              <span className="text-slate-300">Failed: {cluster?.failedPods || 0}</span>
            </div>
          </div>
        </div>

        {/* Security Isolation Status */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-sm text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Chính sách Bảo mật & Cô lập</span>
          </h3>

          <div className="space-y-3 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-200">Namespace Multi-Tenancy</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Phân vùng logic riêng biệt: team-a, team-b, team-c.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-200">Calico NetworkPolicy</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Chặn Default Deny Ingress. Ngăn chặn giao tiếp trái phép giữa các nhóm.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-200">Admission Control (VAP)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Kiểm soát whitelist Image (nginx, alpine, busybox, redis).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teams Resource Quotas Summary Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-sm text-white">
              Hạn mức Tài nguyên theo từng Nhóm (Resource Quotas by Team)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Dữ liệu đọc trực tiếp từ đối tượng ResourceQuota trong từng Namespace
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase">
              <tr>
                <th className="py-3 px-4">Nhóm (Team)</th>
                <th className="py-3 px-4">Namespace</th>
                <th className="py-3 px-4">Pods Đang chạy</th>
                <th className="py-3 px-4">Pod Quota</th>
                <th className="py-3 px-4">CPU Limit</th>
                <th className="py-3 px-4">Memory Limit</th>
                <th className="py-3 px-4">Mức sử dụng Pods</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {teams.map((t) => {
                const used = t.quota?.usedPods || 0;
                const max = t.quota?.maxPods || 4;
                const pct = Math.min(Math.round((used / max) * 100), 100);

                return (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {t.displayName}
                    </td>
                    <td className="py-3.5 px-4 text-cyan-400">
                      {t.namespace}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {t.runningPodsCount} pods
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {used} / {max}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {t.quota?.cpuLimitTotal || '2000m'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {t.quota?.memoryLimitTotal || '2Gi'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              pct >= 100 ? 'bg-red-500' : pct > 75 ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-400">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
