import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Layers, ShieldCheck, Lock, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Tên đăng nhập hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (u, p) => {
    setUsername(u);
    setPassword(p);
    setError('');
    setLoading(true);
    try {
      await login(u, p);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b19] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-xl shadow-cyan-500/20 mb-2">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Mini CaaS Platform
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Nền tảng CaaS đa người thuê với ResourceQuota & Cô lập bảo mật Kubernetes
          </p>
        </div>

        {/* Main Login Card */}
        <div className="glass-panel p-8 rounded-2xl shadow-2xl border border-slate-800">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center space-x-2.5 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tài khoản (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin hoặc teama_dev"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mật khẩu (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Đang xác thực...' : 'Đăng nhập Hệ thống'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center space-x-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Tài khoản Demo nhanh (1-Click Switch)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin123')}
                className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-left transition-all"
              >
                <div className="font-semibold text-cyan-400">Admin</div>
                <div className="text-[10px] text-slate-500">Toàn quyền hệ thống</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('teama_dev', 'teama123')}
                className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-left transition-all"
              >
                <div className="font-semibold text-emerald-400">Team A</div>
                <div className="text-[10px] text-slate-500">Namespace: team-a</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('teamb_dev', 'teamb123')}
                className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 text-left transition-all"
              >
                <div className="font-semibold text-blue-400">Team B</div>
                <div className="text-[10px] text-slate-500">Namespace: team-b</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('teamc_dev', 'teamc123')}
                className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-left transition-all"
              >
                <div className="font-semibold text-purple-400">Team C</div>
                <div className="text-[10px] text-slate-500">Namespace: team-c</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 font-mono">
          Port 5173 (Frontend) • Port 8088 (Backend) • Port 5433 (PostgreSQL)
        </div>
      </div>
    </div>
  );
}
