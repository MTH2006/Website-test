import React, { useState, useEffect } from 'react';
import { demoHistoryApi, reportApi } from '../services/api';
import { FileText, Download, CheckCircle2, Calendar, User, ArrowRight } from 'lucide-react';

export default function Reports() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await demoHistoryApi.getAllSessions();
        if (res.data?.data) setSessions(res.data.data);
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
          <FileText className="w-5 h-5 text-cyan-400" />
          <span>Báo cáo Kết quả & Xuất Dữ liệu (Reports & Export)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Xuất tài liệu báo cáo nghiệm thu và kịch bản minh chứng kỹ thuật phục vụ báo cáo đồ án
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV Export Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3 text-emerald-400">
            <Download className="w-6 h-6" />
            <h3 className="font-bold text-base text-white">Xuất Báo Cáo Dữ Liệu CSV</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dữ liệu dạng bảng chứa toàn bộ kết quả 6 bài test, trạng thái Pass/Fail, thời gian thực thi và thông số kỹ thuật phục vụ phân tích Excel / Google Sheets.
          </p>

          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Chọn phiên gần nhất:</span>
            {sessions.slice(0, 3).map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <span className="text-slate-200 truncate">{s.sessionName}</span>
                <a
                  href={reportApi.exportCsvUrl(s.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 flex items-center space-x-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Tải CSV</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Markdown Export Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3 text-indigo-400">
            <FileText className="w-6 h-6" />
            <h3 className="font-bold text-base text-white">Xuất Báo Cáo Kỹ Thuật (Markdown)</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Văn bản Markdown hoàn chỉnh gồm mục tiêu, kỳ vọng, kết quả thực tế, log chạy và lệnh kubectl xác minh sẵn sàng nộp cho giảng viên.
          </p>

          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Chọn phiên gần nhất:</span>
            {sessions.slice(0, 3).map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <span className="text-slate-200 truncate">{s.sessionName}</span>
                <a
                  href={reportApi.exportMarkdownUrl(s.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 flex items-center space-x-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Tải .md</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
