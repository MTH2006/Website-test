import React, { useState, useEffect } from 'react';
import { applicationApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
  Layers,
  Plus,
  Trash2,
  Terminal,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Server,
  Play,
  X
} from 'lucide-react';

export default function ApplicationManagement() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState(null);
  const [logsContent, setLogsContent] = useState('');
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [message, setMessage] = useState(null);

  const { user, isAdmin, namespaceScope } = useAuth();

  const [form, setForm] = useState({
    name: 'web-nginx',
    namespace: namespaceScope === 'all' ? 'team-a' : namespaceScope,
    image: 'nginx:alpine',
    replicas: 1,
    cpuRequest: '100m',
    cpuLimit: '200m',
    memoryRequest: '128Mi',
    memoryLimit: '256Mi',
    containerPort: 80,
  });

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await applicationApi.getAll();
      if (res.data?.data) {
        setApps(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải ứng dụng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleDeploy = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await applicationApi.create(form);
      setShowDeployModal(false);
      setMessage({ type: 'success', text: `Ứng dụng ${form.name} đã được triển khai lên Kubernetes thành công!` });
      fetchApps();
    } catch (err) {
      const errText = err.response?.data?.message || err.message;
      setMessage({ type: 'error', text: `Lỗi triển khai: ${errText}` });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa ứng dụng '${name}' khỏi Kubernetes?`)) return;

    try {
      await applicationApi.delete(id);
      setMessage({ type: 'success', text: `Đã xóa ứng dụng ${name} thành công!` });
      fetchApps();
    } catch (err) {
      const errText = err.response?.data?.message || err.message;
      setMessage({ type: 'error', text: `Lỗi khi xóa: ${errText}` });
    }
  };

  const handleViewLogs = async (appId, podName) => {
    setSelectedLogs({ appId, podName });
    setLogsContent('Đang tải logs từ Kubernetes...');
    setLoadingLogs(true);
    try {
      const res = await applicationApi.getLogs(appId, podName);
      setLogsContent(res.data?.data || 'Chưa có log từ Container.');
    } catch (err) {
      setLogsContent('Không thể đọc logs: ' + err.message);
    } finally {
      setLoadingLogs(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Quản lý Ứng dụng Container (Workload Deployments)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Triển khai và theo dõi trạng thái các Deployment & Pods trên từng Namespace của các nhóm
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchApps}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-all flex items-center space-x-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>

          <button
            onClick={() => setShowDeployModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Triển khai Ứng dụng Mới</span>
          </button>
        </div>
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

      {/* Applications List Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase">
              <tr>
                <th className="py-3 px-4">Tên Ứng dụng</th>
                <th className="py-3 px-4">Namespace</th>
                <th className="py-3 px-4">Container Image</th>
                <th className="py-3 px-4">Replicas</th>
                <th className="py-3 px-4">CPU / RAM Request</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {apps.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500 text-xs">
                    Chưa có ứng dụng nào được triển khai trong phạm vi của bạn. Nhấn "Triển khai Ứng dụng Mới" để bắt đầu!
                  </td>
                </tr>
              ) : (
                apps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-100 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>{app.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-cyan-400">{app.namespace}</td>
                    <td className="py-3.5 px-4 text-slate-300">{app.containerImage}</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {app.readyReplicas} / {app.replicas}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {app.cpuRequest} / {app.memoryRequest}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'RUNNING'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {app.pods && app.pods.length > 0 && (
                        <button
                          onClick={() => handleViewLogs(app.id, app.pods[0].name)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
                          title="Xem Pod Log"
                        >
                          <Terminal className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(app.id, app.name)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                        title="Xóa ứng dụng"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deploy Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center space-x-2">
                <Play className="w-4 h-4 text-cyan-400" />
                <span>Triển khai Container Ứng dụng</span>
              </h3>
              <button
                onClick={() => setShowDeployModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeploy} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tên ứng dụng</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="web-nginx"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Namespace</label>
                  <select
                    value={form.namespace}
                    disabled={!isAdmin}
                    onChange={(e) => setForm({ ...form, namespace: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                  >
                    <option value="team-a">team-a</option>
                    <option value="team-b">team-b</option>
                    <option value="team-c">team-c</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Container Image</label>
                <input
                  type="text"
                  required
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="nginx:alpine"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
                <div className="flex items-center space-x-1.5 mt-1.5 text-[10px] text-slate-400">
                  <span>Whitelist cho phép:</span>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: 'nginx:alpine' })}
                    className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 hover:bg-slate-700"
                  >
                    nginx:alpine
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: 'alpine:latest' })}
                    className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 hover:bg-slate-700"
                  >
                    alpine:latest
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: 'redis:alpine' })}
                    className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 hover:bg-slate-700"
                  >
                    redis:alpine
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Số lượng Replicas</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={form.replicas}
                    onChange={(e) => setForm({ ...form, replicas: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Container Port</label>
                  <input
                    type="number"
                    value={form.containerPort}
                    onChange={(e) => setForm({ ...form, containerPort: parseInt(e.target.value) || 80 })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">CPU Request / Limit</label>
                  <div className="flex space-x-1">
                    <input
                      type="text"
                      value={form.cpuRequest}
                      onChange={(e) => setForm({ ...form, cpuRequest: e.target.value })}
                      className="w-1/2 px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono text-[11px]"
                      placeholder="100m"
                    />
                    <input
                      type="text"
                      value={form.cpuLimit}
                      onChange={(e) => setForm({ ...form, cpuLimit: e.target.value })}
                      className="w-1/2 px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono text-[11px]"
                      placeholder="200m"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Memory Request / Limit</label>
                  <div className="flex space-x-1">
                    <input
                      type="text"
                      value={form.memoryRequest}
                      onChange={(e) => setForm({ ...form, memoryRequest: e.target.value })}
                      className="w-1/2 px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono text-[11px]"
                      placeholder="128Mi"
                    />
                    <input
                      type="text"
                      value={form.memoryLimit}
                      onChange={(e) => setForm({ ...form, memoryLimit: e.target.value })}
                      className="w-1/2 px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono text-[11px]"
                      placeholder="256Mi"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDeployModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold shadow-lg shadow-cyan-500/20"
                >
                  Triển khai ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pod Logs Modal */}
      {selectedLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">
                  Logs Pod: <span className="font-mono text-cyan-300">{selectedLogs.podName}</span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedLogs(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="terminal-box p-4 rounded-xl text-xs text-emerald-400 whitespace-pre-wrap overflow-x-auto max-h-96 font-mono leading-relaxed border border-slate-800">
              {logsContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
