import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, UserCheck, ShoppingCart, DollarSign,
  Settings, LogOut, Menu, X, Bell, Search, Filter,
  ChevronDown, MoreHorizontal, Eye, Ban, CheckCircle,
  TrendingUp, ArrowUpRight, ArrowDownRight, BarChart3,
  PieChart, Activity, Clock, AlertCircle, Star, Briefcase
} from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { ExpertManagement } from './ExpertManagement';

type AdminTab = 'dashboard' | 'users' | 'experts' | 'orders' | 'finance' | 'settings';

const sidebarItems = [
  { id: 'dashboard', label: '数据概览', icon: LayoutDashboard },
  { id: 'users', label: '用户管理', icon: Users },
  { id: 'experts', label: '专家管理', icon: UserCheck },
  { id: 'orders', label: '订单管理', icon: ShoppingCart },
  { id: 'finance', label: '财务管理', icon: DollarSign },
  { id: 'settings', label: '系统设置', icon: Settings },
];

// 用户管理组件
const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned'>('all');

  const mockUsers = [
    { id: 'u1', name: '张三', email: 'zhangsan@example.com', tier: 'pro', orderCount: 5, totalSpent: 3200, status: 'active', createdAt: '2024-03-01' },
    { id: 'u2', name: '李四', email: 'lisi@example.com', tier: 'free', orderCount: 1, totalSpent: 500, status: 'active', createdAt: '2024-03-05' },
    { id: 'u3', name: '王五', email: 'wangwu@example.com', tier: 'max', orderCount: 12, totalSpent: 15000, status: 'active', createdAt: '2024-02-15' },
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">用户管理</h2>
          <p className="text-slate-500">管理平台普通用户</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索用户名称或邮箱..."
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-vibe-accent focus:ring-2 focus:ring-vibe-accent/20 outline-none"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: '全部' },
              { key: 'active', label: '正常' },
              { key: 'banned', label: '已禁用' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key as any)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  statusFilter === key
                    ? 'bg-vibe-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">用户信息</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">会员等级</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">订单数</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">消费金额</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">状态</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">注册时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    user.tier === 'max' ? 'bg-violet-100 text-violet-700' :
                    user.tier === 'pro' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {user.tier.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-700">{user.orderCount}</td>
                <td className="px-6 py-4 font-bold text-slate-900">${user.totalSpent.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.status === 'active' ? '正常' : '已禁用'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{user.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 订单管理组件
const OrderManagement = () => {
  const [statusFilter, setStatusFilter] = useState('all');

  const mockOrders = [
    { id: 'o1', title: '修复 Next.js 水合错误', user: '张三', expert: '陈老师', budget: '$300-600', status: 'in_service', createdAt: '2024-03-25' },
    { id: 'o2', title: 'AWS Lambda 部署优化', user: '李四', expert: '-', budget: '$1000-2000', status: 'pending_quote', createdAt: '2024-03-27' },
    { id: 'o3', title: 'Solidity 合约审计', user: '王五', expert: '米勒', budget: '$3000-7000', status: 'completed', createdAt: '2024-03-20' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">订单管理</h2>
          <p className="text-slate-500">管理平台所有订单</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'pending_quote', 'in_service', 'completed', 'disputed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              statusFilter === status
                ? 'bg-vibe-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {status === 'all' ? '全部' :
             status === 'pending_quote' ? '待报价' :
             status === 'in_service' ? '服务中' :
             status === 'completed' ? '已完成' : '争议中'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">订单ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">标题</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">用户</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">专家</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">预算</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">#{order.id}</td>
                <td className="px-6 py-4 text-slate-700">{order.title}</td>
                <td className="px-6 py-4 text-slate-700">{order.user}</td>
                <td className="px-6 py-4 text-slate-700">{order.expert}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{order.budget}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'in_service' ? 'bg-violet-100 text-violet-700' :
                    order.status === 'pending_quote' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {order.status === 'completed' ? '已完成' :
                     order.status === 'in_service' ? '服务中' :
                     order.status === 'pending_quote' ? '待报价' : '争议中'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 财务管理组件
const FinanceManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">财务管理</h2>
          <p className="text-slate-500">查看平台财务流水和结算记录</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">平台总收入</p>
          <p className="text-3xl font-black text-slate-900">$45,230</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">待结算金额</p>
          <p className="text-3xl font-black text-amber-600">$8,450</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">本月收入</p>
          <p className="text-3xl font-black text-emerald-600">$12,680</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">最近财务记录</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">记录ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">类型</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">描述</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">金额</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 font-medium">#f1</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">订单服务费</span></td>
              <td className="px-6 py-4 text-slate-700">订单 #o1 平台服务费</td>
              <td className="px-6 py-4 font-bold text-emerald-600">+$120</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">已完成</span></td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 font-medium">#f2</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-violet-100 text-violet-700 rounded text-xs font-bold">订阅费用</span></td>
              <td className="px-6 py-4 text-slate-700">专家 Pro 订阅费用</td>
              <td className="px-6 py-4 font-bold text-emerald-600">+$99</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">已完成</span></td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 font-medium">#f3</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold">专家结算</span></td>
              <td className="px-6 py-4 text-slate-700">专家收入结算</td>
              <td className="px-6 py-4 font-bold text-red-600">-$480</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold">处理中</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 系统设置组件
const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">系统设置</h2>
        <p className="text-slate-500">配置平台参数和订阅计划</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">平台服务费 (%)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-slate-500 block mb-2">Starter</label>
              <input type="number" defaultValue={20} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-2">Pro</label>
              <input type="number" defaultValue={15} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-2">Elite</label>
              <input type="number" defaultValue={10} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">结算周期 (天)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-slate-500 block mb-2">Starter</label>
              <input type="number" defaultValue={15} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-2">Pro</label>
              <input type="number" defaultValue={7} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-2">Elite</label>
              <input type="number" defaultValue={7} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">订阅价格 (USD/月)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-slate-500 block mb-2">Starter</label>
              <input type="number" defaultValue={39} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-2">Pro</label>
              <input type="number" defaultValue={99} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-2">Elite</label>
              <input type="number" defaultValue={299} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex justify-end">
          <button className="px-6 py-2.5 bg-vibe-primary text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
};

// 管理员登录组件
const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 测试账号：用户名和密码都是 admin
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('admin_logged_in', 'true');
      onLogin();
    } else {
      setError('用户名或密码错误');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-vibe-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="w-8 h-8 text-vibe-accent" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">VibeFello</h1>
          <p className="text-slate-500">管理后台登录</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-vibe-accent focus:ring-2 focus:ring-vibe-accent/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-vibe-accent focus:ring-2 focus:ring-vibe-accent/20 outline-none"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-vibe-primary text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
          >
            登录
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-slate-400 hover:text-vibe-accent transition-colors">
            ← 返回前台首页
          </a>
        </div>
      </div>
    </div>
  );
};

// 主 Admin Panel 组件
export const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('admin_logged_in') === 'true';
  });
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'experts':
        return <ExpertManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'finance':
        return <FinanceManagement />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    setIsLoggedIn(false);
  };

  // 未登录显示登录页面
  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-slate-900 text-white fixed h-full z-40"
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <div>
              <h1 className="text-xl font-black tracking-tight">VibeFello</h1>
              <p className="text-xs text-slate-400">管理后台</p>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="px-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-vibe-accent text-vibe-primary'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span className="font-bold text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="font-bold text-sm">退出登录</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: isSidebarOpen ? 280 : 80 }}
      >
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-8 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">
              {sidebarItems.find(item => item.id === activeTab)?.label}
            </h2>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-vibe-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                {isSidebarOpen && (
                  <div>
                    <p className="font-bold text-slate-900 text-sm">管理员</p>
                    <p className="text-xs text-slate-500">admin@vibefello.com</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
