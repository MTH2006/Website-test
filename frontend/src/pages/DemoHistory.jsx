import React, { useState, useEffect } from 'react';
import { demoHistoryApi, reportApi } from '../services/api';
import {
  History,
  FileText,
  Download,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  Eye,
  GitCompare,
  RefreshCw,
  X
} from 'lucide-react';

export default function DemoHistory() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Compare mode
  const [compareMode, setCompareMode] = useState(false);
  const [sessionAId, setSessionAId] = useState('');
  const [sessionBId, setSessionBId] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await demoHistoryApi.getAllSessions();
      if (res.data?.data) {
        setSessions(res.data.data);
        if (res.data.data.length >= 2) {
          setSessionAId(res.data.data[0].id);
          setSessionBId(res.data.data[1].id);
        }
      }
    } catch (err) {
      console.error('Lỗi khi tải lịch sử DEMO:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleViewDetails = async (id) => {
    setLoadingDetails(true);
    try {
      const res = await demoHistoryApi.getSessionDetails(id);
      if (res.data?.data) {
        setSelectedSession(res.data.data);
      }
    } catch (err) {
      alert('Không thể tải chi tiết phiên: ' + err.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCompare = async () => {
    if (!sessionAId || !sessionBId || sessionAId === sessionBId) {
      alert('Vui lòng chọn 2 phiên kiểm thử khác nhau để so sánh!');
      return;
    }

    try {
      const res = await demoHistoryApi.compareSessions(sessionAId, sessionBId);
      if (res.data?.data) {
        setComparisonResult(res.data.data);
      }
    } catch (err) {
      alert('Lỗi so sánh: ' + err.message);
    }
  };

  const handleExportCsv = (id) => {
    window.open(reportApi.exportCsvUrl(id), '_blank');
  };

  const handleExportMarkdown = (id) => {
    window.open(reportApi.exportMarkdownUrl(id), '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <History className="w-5 h-5 text-cyan-400" />
            <span>Lịch sử DEMO & Lưu trữ Vĩnh viễn (Demo History / Storage)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dữ liệu các lần chạy kiểm thử được lưu trữ bền vững trong PostgreSQL Volume và không bị mất khi khởi động lại máy tính.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-cyan-400 border border-slate-700 flex items-center space-x-1.5 transition-all"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{compareMode ? 'Đóng So sánh' : 'So sánh 2 lần DEMO'}</span>
          </button>

          <button
            onClick={fetchSessions}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center space-x-2 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Compare Sessions View */}
      {compareMode && (
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/40 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center space-x-2">
            <GitCompare className="w-4 h-4 text-cyan-400" />
            <span>So sánh Kết quả giữa Hai Phiên DEMO</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Phiên DEMO A (Gốc):</label>
              <select
                value={sessionAId}
                onChange={(e) => setSessionAId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.sessionName} ({new Date(s.startTime).toLocaleString('vi-VN')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Phiên DEMO B (So sánh):</label>
              <select
                value={sessionBId}
                onChange={(e) => setSessionBId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.sessionName} ({new Date(s.startTime).toLocaleString('vi-VN')})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCompare}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs shadow-md shadow-cyan-500/20"
            >
              Thực hiện So sánh
            </button>
          </div>

          {comparisonResult && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                Bảng Đối chiếu Kết quả Từng Bài Test
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Mã Test</th>
                      <th className="py-2 px-3">Kết quả Phiên A</th>
                      <th className="py-2 px-3">Kết quả Phiên B</th>
                      <th className="py-2 px-3">Đánh giá Thay đổi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {Object.entries(comparisonResult.testStatusComparison || {}).map(([code, val]) => (
                      <tr key={code} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-semibold text-cyan-300">{code}</td>
                        <td className="py-2.5 px-3 text-slate-300">{val.split('|')[0]}</td>
                        <td className="py-2.5 px-3 text-slate-300">{val.split('|')[1]}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                            Đồng nhất (Consistent)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sessions List */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase">
              <tr>
                <th className="py-3 px-4">Tên Phiên Kiểm thử</th>
                <th className="py-3 px-4">Người thực hiện</th>
                <th className="py-3 px-4">Thời gian bắt đầu</th>
                <th className="py-3 px-4">Bài Test Đạt</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 text-xs">
                    Chưa có phiên DEMO nào được lưu. Hãy vào "DEMO LAB" và chạy kiểm thử để tạo phiên lưu trữ!
                  </td>
                </tr>
              ) : (
                sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-100 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <span>{s.sessionName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{s.executedByUsername}</td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(s.startTime).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">
                      {s.passedTests} / {s.totalTests} passed
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === 'COMPLETED' || s.status === 'PASSED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleViewDetails(s.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
                        title="Xem chi tiết phiên"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleExportCsv(s.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors"
                        title="Tải CSV"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleExportMarkdown(s.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-indigo-400 transition-colors"
                        title="Tải Markdown"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-3xl p-6 rounded-2xl border border-slate-700 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-shrink-0">
              <div>
                <h3 className="font-bold text-base text-white">
                  Chi tiết Phiên DEMO: {selectedSession.sessionName}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Thực hiện bởi: <span className="text-cyan-300">{selectedSession.executedByUsername}</span> lúc{' '}
                  {new Date(selectedSession.startTime).toLocaleString('vi-VN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="font-semibold text-slate-400 uppercase text-[10px] block mb-1">
                  Kết luận Tổng thể
                </span>
                <p className="text-slate-200 leading-relaxed font-mono">
                  {selectedSession.overallConclusion || 'Đã hoàn thành toàn bộ kịch bản kiểm thử.'}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Chi tiết Kết quả Từng Bài Kiểm Thử ({selectedSession.testResults?.length || 0} bài)
                </h4>

                {selectedSession.testResults?.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-100">{r.testCode}</span>
                        <span className="text-slate-400">• {r.testName}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'PASSED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/40 text-slate-300 text-[11px] leading-relaxed">
                      <span className="text-slate-500 block text-[10px] uppercase">Kết quả thực tế:</span>
                      {r.actualResult}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center flex-shrink-0">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleExportCsv(selectedSession.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-emerald-400 flex items-center space-x-1 font-mono"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất CSV</span>
                </button>
                <button
                  onClick={() => handleExportMarkdown(selectedSession.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-indigo-400 flex items-center space-x-1 font-mono"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Xuất Markdown</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedSession(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
