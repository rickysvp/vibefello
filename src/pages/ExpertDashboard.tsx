import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock, CheckCircle2, Shield, Wallet, Star,
  ArrowRight
} from 'lucide-react';
import { Request, MOCK_MARKETPLACE, ExpertVerificationStatus } from '../types';

interface ExpertDashboardProps {
  requests: Request[];
  onSelect: (r: Request) => void;
  onEnterWorkspace: (r: Request) => void;
  onTabChange: (tab: string) => void;
  verificationStatus: ExpertVerificationStatus;
  onStartApplication: () => void;
}

const expertStats = [
  { label: '本月收入', value: '¥8,240.00', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: '完成订单', value: '12', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: '当前评分', value: '4.9', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
];

const expertProfile = {
  name: 'Ricky S.',
  title: 'Senior Full-stack Engineer',
  skills: ['React', 'Next.js', 'Python', 'Node.js', 'AWS'],
  avatar: 'https://picsum.photos/seed/expert1/200/200',
  bio: '专注于解决 Web 开发中的疑难杂症，擅长性能优化与架构重构。'
};

export const ExpertDashboard: React.FC<ExpertDashboardProps> = ({
  requests,
  onSelect,
  onEnterWorkspace,
  onTabChange,
  verificationStatus,
  onStartApplication
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'ongoing' | 'completed' | 'subscription' | 'earnings'>('overview');

  // Show pending approval page
  if (verificationStatus === 'submitted') {
    return (
      <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">入驻申请审核中</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            您的专家入驻申请已提交成功，我们正在审核您的资料。<br/>
            审核通常需要 1-2 个工作日，请耐心等待。
          </p>
          <div className="bg-slate-50 rounded-xl p-6 text-left mb-8">
            <h3 className="font-bold text-slate-900 mb-3">审核进度</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-slate-600">提交申请资料</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <span className="text-sm text-slate-900 font-medium">平台审核中</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                <span className="text-sm text-slate-400">开始接单赚钱</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-400">
            审核结果将通过邮件通知您，如有疑问请联系客服
          </p>
        </div>
      </div>
    );
  }

  // Show application required page
  if (verificationStatus === 'pending') {
    return (
      <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-vibe-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-vibe-accent" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">成为 VibeFello 专家</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            加入我们的专家网络，帮助全球开发者解决 AI 生成代码的部署难题，<br/>
            同时获得丰厚的报酬和职业成长机会。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-2xl font-black text-vibe-accent mb-1">$50+</div>
              <div className="text-xs text-slate-500">平均时薪</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-2xl font-black text-vibe-accent mb-1">1000+</div>
              <div className="text-xs text-slate-500">月活订单</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-2xl font-black text-vibe-accent mb-1">4.9</div>
              <div className="text-xs text-slate-500">专家评分</div>
            </div>
          </div>
          <button
            onClick={onStartApplication}
            className="w-full sm:w-auto px-8 py-3 bg-vibe-primary text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
          >
            立即申请入驻
          </button>
          <p className="mt-4 text-sm text-slate-400">
            申请审核通过后，即可开始接单
          </p>
        </div>
      </div>
    );
  }

  const claimedOrders = requests.filter(r => r.expertId === 'e1' && r.status !== 'completed');
  const completedOrders = requests.filter(r => r.expertId === 'e1' && r.status === 'completed');

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">专家控制台</h2>
          <p className="text-slate-500 font-medium">管理您的接单进度、查看收益并维护您的订阅计划。</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto">
          {[
            { id: 'overview', label: '概览' },
            { id: 'ongoing', label: `进行中 (${claimedOrders.length})` },
            { id: 'completed', label: `已完成 (${completedOrders.length})` },
            { id: 'subscription', label: '订阅管理' },
            { id: 'earnings', label: '我的收益' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeSubTab === tab.id 
                  ? 'bg-white text-vibe-accent shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {expertStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 vibe-card-shadow flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center justify-between">
                  进行中的订单 ({claimedOrders.length})
                  <button onClick={() => setActiveSubTab('ongoing')} className="text-xs font-black text-vibe-accent uppercase tracking-widest hover:underline">查看全部</button>
                </h3>
                {claimedOrders.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {claimedOrders.slice(0, 3).map((req) => (
                      <div 
                        key={req.id}
                        className="bg-white p-6 rounded-2xl border border-slate-200 vibe-card-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                              req.status === 'in_service' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>
                              {req.status === 'in_service' ? '服务中' : '待处理'}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">{req.createdAt}</span>
                          </div>
                          <h4 className="text-lg font-black text-vibe-primary tracking-tight">{req.title}</h4>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right mr-4">
                            <div className="text-lg font-black text-slate-900">{req.budget || `¥${req.price}`}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">项目预算</div>
                          </div>
                          <button 
                            onClick={() => onEnterWorkspace(req)}
                            className="bg-vibe-primary text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                          >
                            进入工作台
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-slate-300" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">暂无进行中的订单</h4>
                    <p className="text-sm text-slate-500 mb-8">您目前没有正在处理的项目。快去 Vibe Request 大厅看看吧！</p>
                    
                    <div className="max-w-2xl mx-auto">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">为您推荐</span>
                        <button onClick={() => onTabChange('marketplace')} className="text-xs font-black text-vibe-accent uppercase tracking-widest hover:underline">去大厅</button>
                      </div>
                      <div className="space-y-3">
                        {MOCK_MARKETPLACE.slice(0, 2).map(req => (
                          <div key={req.id} onClick={() => onSelect(req)} className="bg-white p-4 rounded-xl border border-slate-200 text-left hover:border-vibe-accent transition-all cursor-pointer flex justify-between items-center">
                            <div>
                              <div className="text-sm font-bold text-vibe-primary">{req.title}</div>
                              <div className="text-[10px] text-slate-400 font-medium">{req.tags.join(' · ')}</div>
                            </div>
                            <div className="text-sm font-black text-vibe-accent">{req.budget}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 vibe-card-shadow">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-24 h-24 rounded-full border-4 border-slate-50 overflow-hidden mb-4 shadow-lg">
                    <img src={expertProfile.avatar} alt={expertProfile.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-1">{expertProfile.name}</h4>
                  <p className="text-xs font-bold text-vibe-accent uppercase tracking-widest mb-4">{expertProfile.title}</p>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{expertProfile.bio}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {expertProfile.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-slate-100 text-[10px] font-black text-slate-500 rounded-full uppercase tracking-widest">{skill}</span>
                    ))}
                  </div>
                </div>
                <button className="w-full py-3 rounded-xl border border-slate-200 text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all">
                  编辑个人资料
                </button>
              </div>

              <div className="bg-slate-900 p-8 rounded-2xl text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-vibe-accent/10 blur-3xl rounded-full" />
                <h4 className="text-lg font-black mb-2 relative z-10">需要更多订单？</h4>
                <p className="text-xs text-slate-400 font-medium mb-6 relative z-10">升级您的订阅计划，解锁更多高价值订单和优先推荐权益。</p>
                <button 
                  onClick={() => setActiveSubTab('subscription')}
                  className="bg-vibe-accent text-vibe-primary px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all relative z-10"
                >
                  立即升级
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'ongoing' && (
          <motion.div 
            key="ongoing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6">进行中的订单 ({claimedOrders.length})</h3>
            {claimedOrders.map((req) => (
              <div 
                key={req.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 vibe-card-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                      req.status === 'in_service' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {req.status === 'in_service' ? '服务中' : '待处理'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{req.createdAt}</span>
                  </div>
                  <h4 className="text-lg font-black text-vibe-primary tracking-tight">{req.title}</h4>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right mr-4">
                    <div className="text-lg font-black text-slate-900">{req.budget || `¥${req.price}`}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">项目预算</div>
                  </div>
                  <button 
                    onClick={() => onEnterWorkspace(req)}
                    className="bg-vibe-primary text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                  >
                    进入工作台
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeSubTab === 'completed' && (
          <motion.div 
            key="completed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900">已完成订单 ({completedOrders.length})</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50">本月</button>
                <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50">全部</button>
              </div>
            </div>

            {completedOrders.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {completedOrders.map((req) => (
                  <div 
                    key={req.id}
                    className="bg-white p-8 rounded-2xl border border-slate-200 vibe-card-shadow flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-vibe-accent/30 transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-100">已完成</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {req.id}</span>
                          </div>
                          <h4 className="text-lg font-black text-vibe-primary tracking-tight group-hover:text-vibe-accent transition-colors">{req.title}</h4>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-13">
                        {req.techStack.map(s => <span key={s} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{s}</span>)}
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-xl font-black text-slate-900">{req.budget || `¥${req.price}`}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">完成时间: {req.createdAt}</div>
                      </div>
                      <button className="bg-slate-50 text-slate-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-vibe-primary hover:text-white transition-all border border-slate-200">
                        查看详情
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-20 text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <CheckCircle2 className="w-10 h-10 text-slate-200" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">暂无已完成的订单</h4>
                <p className="text-sm text-slate-500">完成您的第一个订单，开启专业变现之旅！</p>
              </div>
            )}
          </motion.div>
        )}

        {activeSubTab === 'subscription' && (
          <motion.div 
            key="subscription"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-10 rounded-2xl border border-slate-200 vibe-card-shadow"
          >
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-1">
                <div className="text-[10px] font-black text-vibe-accent uppercase tracking-widest mb-4">当前计划</div>
                <h3 className="text-4xl font-black text-slate-900 mb-2">PRO 会员</h3>
                <p className="text-slate-500 mb-8 font-medium">您的订阅将于 2024年12月15日 续费。当前额度：12/20 单。</p>
                
                <div className="space-y-6 mb-10">
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-slate-600">本月接单额度</span>
                    <span className="text-slate-900">12 / 20</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-vibe-accent h-full w-[60%]" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 mb-4">当前权益</h4>
                  {[
                    '每月 20 单接单额度',
                    '优先订单推荐',
                    '快速结算通道',
                    '专属客服支持'
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm text-slate-600 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-80">
                <div className="bg-slate-900 p-8 rounded-2xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-vibe-accent/10 blur-3xl rounded-full" />
                  <div className="relative z-10">
                    <div className="text-[10px] font-black text-vibe-accent uppercase tracking-widest mb-2">升级到</div>
                    <h4 className="text-2xl font-black mb-1">Master 计划</h4>
                    <div className="text-3xl font-black text-vibe-accent mb-6">$299<span className="text-sm text-slate-400">/月</span></div>
                    
                    <div className="space-y-3 mb-8">
                      {[
                        '无限接单额度',
                        '首页推荐位',
                        '即时结算',
                        'VIP 专属活动'
                      ].map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-vibe-accent" />
                          <span className="text-sm text-slate-300">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button className="w-full bg-vibe-accent text-vibe-primary py-3 rounded-xl font-black text-sm hover:bg-white transition-all">
                      立即升级
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'earnings' && (
          <motion.div 
            key="earnings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 vibe-card-shadow">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">本月收入</div>
                <div className="text-4xl font-black text-slate-900">¥8,240</div>
                <div className="text-sm text-emerald-600 font-bold mt-2">+23% 较上月</div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 vibe-card-shadow">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">待结算</div>
                <div className="text-4xl font-black text-slate-900">¥3,600</div>
                <div className="text-sm text-slate-400 font-medium mt-2">3 个订单待确认</div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 vibe-card-shadow">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">累计收入</div>
                <div className="text-4xl font-black text-slate-900">¥45,280</div>
                <div className="text-sm text-slate-400 font-medium mt-2">自加入以来</div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 vibe-card-shadow">
              <h3 className="text-xl font-black text-slate-900 mb-6">收入明细</h3>
              <div className="space-y-4">
                {[
                  { date: '2024-11-28', project: 'Next.js SSR 修复', amount: 2800, status: '已结算' },
                  { date: '2024-11-25', project: 'Python API 优化', amount: 1500, status: '已结算' },
                  { date: '2024-11-20', project: 'React 性能调优', amount: 1200, status: '已结算' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <div className="font-bold text-slate-900">{item.project}</div>
                      <div className="text-xs text-slate-400">{item.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-slate-900">+¥{item.amount}</div>
                      <div className="text-xs text-emerald-600 font-bold">{item.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpertDashboard;
