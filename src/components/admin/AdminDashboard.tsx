import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, ShoppingCart, DollarSign, TrendingUp,
  Clock, CheckCircle, AlertCircle, XCircle, BarChart3,
  PieChart, Activity, ArrowUpRight, ArrowDownRight,
  Search, Filter, MoreHorizontal, Eye, Ban, Unlock
} from 'lucide-react';
import {
  PlatformStats, OrderStatusDistribution, PopularTag,
  UserListItem, ExpertListItem, OrderListItem, FinanceRecord,
  MOCK_PLATFORM_STATS, MOCK_ORDER_STATUS_DISTRIBUTION,
  MOCK_POPULAR_TAGS, MOCK_USER_LIST, MOCK_EXPERT_LIST,
  MOCK_ORDER_LIST, MOCK_FINANCE_RECORDS
} from '../../types/admin';

// 统计卡片组件
const StatCard = ({ title, value, icon: Icon, trend, trendUp, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900">{value}</h3>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
            {trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

// 订单状态分布图表
const OrderStatusChart = ({ data }: { data: OrderStatusDistribution }) => {
  const total = data.pending + data.quoted + data.inService + data.completed + data.disputed;
  const segments = [
    { label: '待报价', value: data.pending, color: '#f59e0b' },
    { label: '已报价', value: data.quoted, color: '#3b82f6' },
    { label: '服务中', value: data.inService, color: '#8b5cf6' },
    { label: '已完成', value: data.completed, color: '#10b981' },
    { label: '争议中', value: data.disputed, color: '#ef4444' }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6">订单状态分布</h3>
      <div className="space-y-4">
        {segments.map((segment) => (
          <div key={segment.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">{segment.label}</span>
              <span className="text-sm font-bold text-slate-900">{segment.value}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(segment.value / total) * 100}%`,
                  backgroundColor: segment.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 热门标签云
const PopularTagsCloud = ({ tags }: { tags: PopularTag[] }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-lg font-bold text-slate-900 mb-6">热门技术标签</h3>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag.name}
          className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-vibe-accent/10 hover:text-vibe-primary transition-colors cursor-pointer"
        >
          {tag.name}
          <span className="ml-2 text-xs text-slate-400">({tag.count})</span>
        </span>
      ))}
    </div>
  </div>
);

// 最近订单表格
const RecentOrdersTable = ({ orders }: { orders: OrderListItem[] }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="p-6 border-b border-slate-100">
      <h3 className="text-lg font-bold text-slate-900">最近订单</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">订单ID</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">标题</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">用户</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">预算</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.slice(0, 5).map((order) => (
            <tr key={order.id} className="hover:bg-slate-50">
              <td className="px-6 py-4 text-sm font-medium text-slate-900">#{order.id}</td>
              <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{order.title}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{order.userName}</td>
              <td className="px-6 py-4 text-sm font-bold text-slate-900">{order.budget}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                  order.status === 'in_service' ? 'bg-violet-100 text-violet-700' :
                  order.status === 'pending_quote' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {order.status === 'completed' ? '已完成' :
                   order.status === 'in_service' ? '服务中' :
                   order.status === 'pending_quote' ? '待报价' :
                   order.status === 'disputed' ? '争议中' : '已报价'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// 主Dashboard组件
export const AdminDashboard = () => {
  const stats = MOCK_PLATFORM_STATS;
  const orderStatus = MOCK_ORDER_STATUS_DISTRIBUTION;
  const popularTags = MOCK_POPULAR_TAGS;
  const recentOrders = MOCK_ORDER_LIST;

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="总用户数"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          trend="+23 今日"
          trendUp={true}
          color="bg-blue-500"
        />
        <StatCard
          title="总专家数"
          value={stats.totalExperts.toString()}
          icon={UserCheck}
          trend="+3 今日"
          trendUp={true}
          color="bg-violet-500"
        />
        <StatCard
          title="总订单数"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          trend="+12 今日"
          trendUp={true}
          color="bg-emerald-500"
        />
        <StatCard
          title="总收入"
          value={`¥${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+¥3,400 今日"
          trendUp={true}
          color="bg-amber-500"
        />
      </div>

      {/* 第二行统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">待审核专家</p>
              <h3 className="text-2xl font-black text-slate-900">{stats.pendingExpertApplications}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">待处理订单</p>
              <h3 className="text-2xl font-black text-slate-900">{stats.pendingOrders}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-100 rounded-xl">
              <Activity className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">服务中订单</p>
              <h3 className="text-2xl font-black text-slate-900">{stats.inProgressOrders}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* 图表和标签 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusChart data={orderStatus} />
        <PopularTagsCloud tags={popularTags} />
      </div>

      {/* 最近订单 */}
      <RecentOrdersTable orders={recentOrders} />
    </div>
  );
};

export default AdminDashboard;
