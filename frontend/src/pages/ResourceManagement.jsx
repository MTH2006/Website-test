import React, { useState, useEffect } from 'react';
import { teamApi } from '../services/api';
import { Cpu, Database, Layers, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ResourceManagement() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await teamApi.getAll();
        if (res.data?.data) setTeams(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>Quản lý Tài nguyên & Hạn mức (Resource Governance)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Hiểu rõ cơ chế Requests vs Limits, ResourceQuota cấp Namespace và LimitRange cấp Container
        </p>
      </div>

      {/* Theory & Concepts Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">1. Resource Requests</span>
          <h4 className="text-sm font-semibold text-white">Cam kết Lập lịch</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Lượng CPU/RAM tối thiểu mà K8s Scheduler bảo đảm cấp cho Pod khi tìm Node phù hợp.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">2. Resource Limits</span>
          <h4 className="text-sm font-semibold text-white">Giới hạn Tối đa</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Trần tài nguyên. Vượt CPU sẽ bị Throttling (bóp tải), vượt RAM sẽ bị OOMKilled để bảo vệ Node.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">3. ResourceQuota</span>
          <h4 className="text-sm font-semibold text-white">Hạn mức Cấp Nhóm</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Kiểm soát tổng số Pods, tổng CPU Requests và RAM Limits trong toàn bộ Namespace.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">4. LimitRange</span>
          <h4 className="text-sm font-semibold text-white">Mặc định Cấp Container</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tự động gán default requests/limits nếu lập trình viên quên khai báo tài nguyên khi deploy.
          </p>
        </div>
      </div>

      {/* Resource Quota vs LimitRange Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white">
          Bảng Chi tiết Hạn ngạch (Quota & LimitRange) theo từng Namespace
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase">
              <tr>
                <th className="py-2.5 px-4">Namespace</th>
                <th className="py-2.5 px-4">Pod Quota Max</th>
                <th className="py-2.5 px-4">CPU Request / Limit</th>
                <th className="py-2.5 px-4">RAM Request / Limit</th>
                <th className="py-2.5 px-4">Default Container CPU</th>
                <th className="py-2.5 px-4">Default Container RAM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {teams.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-cyan-400">{t.namespace}</td>
                  <td className="py-3 px-4 text-slate-200">{t.quota?.maxPods || 4} pods</td>
                  <td className="py-3 px-4 text-slate-300">
                    {t.quota?.cpuRequestLimit || '1000m'} / {t.quota?.cpuLimitTotal || '2000m'}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {t.quota?.memoryRequestLimit || '1Gi'} / {t.quota?.memoryLimitTotal || '2Gi'}
                  </td>
                  <td className="py-3 px-4 text-slate-400">100m req / 500m lim</td>
                  <td className="py-3 px-4 text-slate-400">128Mi req / 512Mi lim</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
