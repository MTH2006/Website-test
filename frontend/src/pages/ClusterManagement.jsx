import React, { useState, useEffect } from 'react';
import { clusterApi } from '../services/api';
import { Server, Cpu, Database, CheckCircle2, ShieldCheck, Activity, Layers, RefreshCw } from 'lucide-react';

export default function ClusterManagement() {
  const [cluster, setCluster] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await clusterApi.getStatus();
      if (res.data?.data) {
        setCluster(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải thông tin cluster:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <span>Quản lý Hạ tầng Cụm Kubernetes (Cluster Management)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Thông tin nút điều khiển (Control-plane Node), phiên bản API Server và các addon bảo mật
          </p>
        </div>

        <button
          onClick={fetchStatus}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center space-x-2 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Nodes Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center space-x-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <span>Danh sách Nút (Kubernetes Nodes)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase">
              <tr>
                <th className="py-2.5 px-4">Tên Node</th>
                <th className="py-2.5 px-4">Vai trò (Role)</th>
                <th className="py-2.5 px-4">Trạng thái (Status)</th>
                <th className="py-2.5 px-4">Kubelet Version</th>
                <th className="py-2.5 px-4">Internal IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {cluster?.nodes?.map((n, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-slate-100 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{n.name}</span>
                  </td>
                  <td className="py-3 px-4 text-cyan-400">{n.role}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
                      {n.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{n.kubeletVersion}</td>
                  <td className="py-3 px-4 text-slate-400">{n.internalIp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Addons & Infrastructure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Calico CNI & NetworkPolicy Engine</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hạ tầng mạng sử dụng Calico v3.28.0 với eBPF/Felix packet filtering, đảm bảo thực thi cô lập Ingress/Egress trên từng Namespace.
          </p>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
            calico-kube-controllers • calico-node daemonset • Felix
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Kubernetes Admission Control (VAP)</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sử dụng tính năng ValidatingAdmissionPolicy chính thức của Kubernetes v1.32.2 để lọc Container Image trước khi ghi vào etcd.
          </p>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-purple-300">
            image-whitelist-policy • ValidatingAdmissionPolicyBinding
          </div>
        </div>
      </div>
    </div>
  );
}
