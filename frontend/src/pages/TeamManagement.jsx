import React, { useState, useEffect } from 'react';
import { teamApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Users, Server, Cpu, Database, Edit, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTeam, setEditingTeam] = useState(null);
  const [quotaForm, setQuotaForm] = useState({
    maxPods: 4,
    cpuRequestLimit: '1000m',
    cpuLimitTotal: '2000m',
    memoryRequestLimit: '1Gi',
    memoryLimitTotal: '2Gi',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const { isAdmin } = useAuth();

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await teamApi.getAll();
      if (res.data?.data) {
        setTeams(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách nhóm:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const openEditModal = (team) => {
    setEditingTeam(team);
    setQuotaForm({
      maxPods: team.quota?.maxPods || 4,
      cpuRequestLimit: team.quota?.cpuRequestLimit || '1000m',
      cpuLimitTotal: team.quota?.cpuLimitTotal || '2000m',
      memoryRequestLimit: team.quota?.memoryRequestLimit || '1Gi',
      memoryLimitTotal: team.quota?.memoryLimitTotal || '2Gi',
    });
  };

  const handleSaveQuota = async (e) => {
    e.preventDefault();
    if (!editingTeam) return;
    setSaving(true);
    setMessage(null);

    try {
      await teamApi.updateQuota(editingTeam.name, quotaForm);
      setMessage({ type: 'success', text: `Cập nhật hạn mức cho ${editingTeam.displayName} thành công!` });
      setEditingTeam(null);
      fetchTeams();
    } catch (err) {
      setMessage({ type: 'error', text: `Lỗi: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Quản lý Nhóm Phát triển (Multi-Tenant Teams)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mỗi nhóm sở hữu Namespace riêng, ServiceAccount riêng và ResourceQuota độc lập trên Kubernetes
          </p>
        </div>

        <button
          onClick={fetchTeams}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center space-x-3 text-xs ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* 3 Team Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {teams.map((team) => {
          const usedPods = team.quota?.usedPods || 0;
          const maxPods = team.quota?.maxPods || 4;
          const pct = Math.min(Math.round((usedPods / maxPods) * 100), 100);

          return (
            <div
              key={team.id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    ns: {team.namespace}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{team.status}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-3">{team.displayName}</h3>
                <p className="text-xs text-slate-400 mt-1">{team.description}</p>
              </div>

              {/* Resource Quota Metrics */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Số lượng Pods:</span>
                    <span className="font-bold text-white">
                      {usedPods} / {maxPods} pods
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct >= 100 ? 'bg-red-500' : pct > 75 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">CPU Request Limit</span>
                    <span className="text-slate-200 font-bold">{team.quota?.cpuRequestLimit || '1000m'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">CPU Limit</span>
                    <span className="text-slate-200 font-bold">{team.quota?.cpuLimitTotal || '2000m'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Mem Request Limit</span>
                    <span className="text-slate-200 font-bold">{team.quota?.memoryRequestLimit || '1Gi'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Mem Limit</span>
                    <span className="text-slate-200 font-bold">{team.quota?.memoryLimitTotal || '2Gi'}</span>
                  </div>
                </div>
              </div>

              {/* Edit Quota Button (Admin only) */}
              {isAdmin && (
                <button
                  onClick={() => openEditModal(team)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Edit className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Điều chỉnh ResourceQuota</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Quota Modal */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-white">
              Điều chỉnh ResourceQuota: {editingTeam.displayName}
            </h3>
            <p className="text-xs text-slate-400">
              Thay đổi sẽ được áp dụng ngay lập tức vào Kubernetes Cluster qua API Server.
            </p>

            <form onSubmit={handleSaveQuota} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Số lượng Pods tối đa (Max Pods)</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={quotaForm.maxPods}
                  onChange={(e) => setQuotaForm({ ...quotaForm, maxPods: parseInt(e.target.value) || 4 })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">CPU Request Limit</label>
                  <input
                    type="text"
                    value={quotaForm.cpuRequestLimit}
                    onChange={(e) => setQuotaForm({ ...quotaForm, cpuRequestLimit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">CPU Limit Max</label>
                  <input
                    type="text"
                    value={quotaForm.cpuLimitTotal}
                    onChange={(e) => setQuotaForm({ ...quotaForm, cpuLimitTotal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Memory Request Limit</label>
                  <input
                    type="text"
                    value={quotaForm.memoryRequestLimit}
                    onChange={(e) => setQuotaForm({ ...quotaForm, memoryRequestLimit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Memory Limit Max</label>
                  <input
                    type="text"
                    value={quotaForm.memoryLimitTotal}
                    onChange={(e) => setQuotaForm({ ...quotaForm, memoryLimitTotal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingTeam(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : 'Lưu Hạn Mức'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
