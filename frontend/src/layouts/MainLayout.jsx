import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Server,
  Users,
  Cpu,
  Layers,
  ShieldCheck,
  FlaskConical,
  History,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';

export default function MainLayout() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Tổng quan (Overview)', icon: LayoutDashboard },
    { path: '/cluster', label: 'Quản lý Cluster', icon: Server },
    { path: '/teams', label: 'Quản lý Nhóm (Teams)', icon: Users },
    { path: '/resources', label: 'Quản lý Tài nguyên', icon: Cpu },
    { path: '/applications', label: 'Ứng dụng Container', icon: Layers },
    { path: '/security', label: 'Bảo mật & Chính sách', icon: ShieldCheck },
    { path: '/demo-lab', label: 'DEMO LAB (Kiểm thử)', icon: FlaskConical, highlight: true },
    { path: '/history', label: 'Lịch sử DEMO', icon: History },
    { path: '/reports', label: 'Báo cáo & Export', icon: FileText },
    { path: '/settings', label: 'Cấu hình Hệ thống', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#070b19] text-slate-100 overflow-hidden font-sans">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0d1527] border-r border-slate-800/80 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                Mini CaaS
              </h1>
              <p className="text-[11px] text-cyan-400 font-mono tracking-wide">
                MULTI-TENANT K8S
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-cyan-400' : 'text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
                    CORE
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Card */}
        <div className="p-3.5 m-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center font-bold text-xs text-cyan-300 border border-slate-700">
                {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {user?.fullName || 'Administrator'}
                </p>
                <div className="flex items-center space-x-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <p className="text-[10px] font-mono text-slate-400 truncate">
                    {user?.role === 'ROLE_ADMIN' ? 'Admin Scope' : user?.teamName}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#0d1527]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 font-mono">
              <span className="text-slate-500">mini-caas</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-cyan-400 capitalize">
                {location.pathname.replace('/', '') || 'Overview'}
              </span>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Cluster: caas-cluster</span>
            </div>

            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Calico CNI Active</span>
            </div>

            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admission VAP Enforced</span>
            </div>

            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono">
                {user?.namespaceScope === 'all' ? 'Scope: ALL' : `Namespace: ${user?.namespaceScope}`}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#070b19]">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
