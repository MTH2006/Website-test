import React, { useState, useEffect } from 'react';
import { demoLabApi } from '../services/api';
import {
  FlaskConical,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Terminal,
  FileCheck,
  Shield,
  Cpu,
  Layers,
  Lock,
  Network,
  Zap,
  Info
} from 'lucide-react';

export default function DemoLab() {
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState({});
  const [runningTest, setRunningTest] = useState(null);
  const [runningAll, setRunningAll] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchTests = async () => {
    try {
      const res = await demoLabApi.getTests();
      if (res.data?.data) {
        setTests(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách test:', err);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const getIconForTest = (code) => {
    switch (code) {
      case 'TEST_01_RESOURCEQUOTA': return Layers;
      case 'TEST_02_RBAC': return Shield;
      case 'TEST_03_SECRET': return Lock;
      case 'TEST_04_NETWORKPOLICY': return Network;
      case 'TEST_05_ADMISSION': return Shield;
      case 'TEST_06_RESOURCE_CONTENTION': return Cpu;
      default: return FlaskConical;
    }
  };

  const handleRunSingle = async (testCode) => {
    setRunningTest(testCode);
    setActionMessage(null);
    try {
      const res = await demoLabApi.runSingleTest(testCode);
      if (res.data?.data) {
        setResults(prev => ({ ...prev, [testCode]: res.data.data }));
        setSelectedResult(res.data.data);
        setActionMessage({
          type: 'success',
          text: `Bài test ${testCode} hoàn thành: ${res.data.data.status}`,
        });
      }
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: `Lỗi khi thực thi ${testCode}: ${err.message}`,
      });
    } finally {
      setRunningTest(null);
    }
  };

  const handleRunAll = async () => {
    setRunningAll(true);
    setActionMessage(null);
    try {
      const res = await demoLabApi.runAllTests();
      if (res.data?.data) {
        const session = res.data.data;
        const newResults = {};
        session.testResults.forEach(r => {
          newResults[r.testCode] = r;
        });
        setResults(newResults);
        if (session.testResults.length > 0) {
          setSelectedResult(session.testResults[0]);
        }
        setActionMessage({
          type: 'success',
          text: `Hoàn tất toàn bộ 6 bài kiểm thử! Đạt: ${session.passedTests}/${session.totalTests}`,
        });
      }
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: `Lỗi khi chạy bộ kịch bản test: ${err.message}`,
      });
    } finally {
      setRunningAll(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Bạn có chắc muốn Reset trạng thái DEMO? Thao tác này sẽ xóa an toàn các Pods/Policies kiểm thử tạm thời mà KHÔNG xóa Cluster hay Database.')) {
      return;
    }

    setResetting(true);
    try {
      await demoLabApi.resetDemo();
      setResults({});
      setSelectedResult(null);
      setActionMessage({
        type: 'success',
        text: 'Đã khôi phục trạng thái DEMO ban đầu an toàn thành công!',
      });
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: `Lỗi khi reset demo: ${err.message}`,
      });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Control Buttons */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              DEMO LAB – Trung tâm Kiểm thử Cô lập & Hạn mức CaaS
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Thực hiện trực tiếp các bài kiểm thử trên Kubernetes Cluster thật. Kết quả, bằng chứng kỹ thuật và nhật ký được lưu trữ vĩnh viễn vào PostgreSQL.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleReset}
            disabled={resetting || runningAll || !!runningTest}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-amber-400 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset DEMO an toàn</span>
          </button>

          <button
            onClick={handleRunAll}
            disabled={runningAll || !!runningTest || resetting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/25 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${runningAll ? 'animate-bounce' : ''}`} />
            <span>{runningAll ? 'Đang chạy 6 bài test...' : 'Chạy toàn bộ 6 bài test'}</span>
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center space-x-3 text-xs ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* 6 Test Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tests.map((test) => {
          const Icon = getIconForTest(test.testCode);
          const isRunning = runningTest === test.testCode || runningAll;
          const result = results[test.testCode];
          const isSelected = selectedResult?.testCode === test.testCode;

          return (
            <div
              key={test.id}
              className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-500/80 ring-1 ring-cyan-500/40 bg-slate-900/90'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
              }`}
            >
              <div className="space-y-3">
                {/* Header with Test Order & Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                      ORDER: 0{test.executionOrder}
                    </span>
                  </div>

                  {result ? (
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                        result.status === 'PASSED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {result.status === 'PASSED' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span>{result.status}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      READY
                    </span>
                  )}
                </div>

                {/* Title & Objective */}
                <div>
                  <h3 className="font-semibold text-sm text-slate-100">{test.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{test.objective}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleRunSingle(test.testCode)}
                  disabled={isRunning || resetting}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center space-x-1.5 transition-all disabled:opacity-50"
                >
                  <Play className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
                  <span>{isRunning ? 'Đang chạy...' : 'Chạy Test'}</span>
                </button>

                {result && (
                  <button
                    type="button"
                    onClick={() => setSelectedResult(result)}
                    className="text-xs text-slate-400 hover:text-cyan-400 flex items-center space-x-1 transition-colors font-mono"
                  >
                    <span>Xem bằng chứng</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Technical Evidence & Terminal Console */}
      {selectedResult && (
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-bold text-sm text-white">
                  Nhật ký Thực thi Kỹ thuật (Live Terminal & Evidence)
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Mã bài test: <span className="text-cyan-300">{selectedResult.testCode}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1.5 ${
                  selectedResult.status === 'PASSED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                {selectedResult.status === 'PASSED' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                <span>KẾT QUẢ: {selectedResult.status}</span>
              </span>
            </div>
          </div>

          {/* Expected vs Actual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                Kỳ vọng (Expected Result)
              </p>
              <p className="text-slate-300 leading-relaxed">{selectedResult.expectedResult}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                Thực tế Kubernetes (Actual Result)
              </p>
              <p className="text-cyan-300 font-mono leading-relaxed">{selectedResult.actualResult}</p>
            </div>
          </div>

          {/* Terminal Execution Logs */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>Trình tự Thao tác & Log Hệ thống</span>
              </p>
            </div>
            <pre className="terminal-box p-4 rounded-xl text-xs text-emerald-400 whitespace-pre-wrap overflow-x-auto leading-relaxed border border-slate-800 max-h-72">
              {selectedResult.executionLog}
            </pre>
          </div>

          {/* Technical Evidence */}
          {selectedResult.technicalEvidence && (
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <p className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5 mb-2">
                <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Lệnh kubectl xác minh thực tế</span>
              </p>
              <pre className="text-xs font-mono text-cyan-300 whitespace-pre-wrap bg-black/40 p-3 rounded-lg border border-slate-800/80">
                {selectedResult.technicalEvidence}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
