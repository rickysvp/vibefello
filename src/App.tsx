/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Search, 
  Wallet, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Shield,
  ArrowLeft,
  Zap,
  Star,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  AlertCircle,
  Download,
  ChevronDown,
  LogOut,
  Github,
  Mail,
  User,
  Users,
  Settings,
  FileText,
  Sparkles,
  Terminal,
  Code2,
  Cpu,
  Globe,
  Lock,
  FileCode,
  Layers
} from 'lucide-react';
import { Request, Expert, MOCK_EXPERTS, MOCK_REQUESTS, MOCK_MARKETPLACE, OrderStatus, USER_TIER_CONFIG, UserTier, ExpertApplication, ExpertVerificationStatus } from './types';
import { PostRequestFlow } from './PostRequestFlow';
import { ExpertOnboardingFlow } from './components/onboarding';
import { AdminPanel } from './components/admin';
import { VibeLogo } from './components/common';
import { Navbar } from './components/layout';
import { LoginModal } from './components/modals';
import { Home as HomePage } from './pages/Home';
import { Pricing as PricingPage } from './pages/Pricing';
import { Dashboard as DashboardPage } from './pages/Dashboard';
import { OrderDetail as OrderDetailPage } from './pages/OrderDetail';

// --- Components ---
// Note: VibeLogo, Navbar, and LoginModal are now imported from './components/*'

const MarketplaceDetailModal = ({ isOpen, onClose, request, isExpert, onClaim, onUpgrade }: { isOpen: boolean, onClose: () => void, request: any, isExpert: boolean, onClaim: (r: any, bidData: any) => void, onUpgrade: () => void }) => {
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    analysis: '',
    solution: '',
    price: '',
    deliveryTime: '24'
  });

  if (!isOpen || !request) return null;

  const handleSubmitBid = () => {
    onClaim(request, bidData);
    setShowBidForm(false);
    setBidData({ analysis: '', solution: '', price: '', deliveryTime: '24' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white w-full max-w-2xl rounded-2xl p-10 vibe-shadow border border-slate-100 overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors">
          <X className="w-6 h-6" />
        </button>

        {!isExpert ? (
          <div className="py-4">
            <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-sky-100">
              <ShieldCheck className="w-8 h-8 text-vibe-accent" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">开启专家接单权限</h2>
            <p className="text-slate-600 mb-8 max-w-md font-medium leading-relaxed">
              Vibe Request 的详细需求和抢单功能仅对 **VibeFello 认证专家** 开放。订阅专家计划后，您可以：
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {[
                { title: '查看完整需求', desc: '解锁所有项目的技术细节和附件' },
                { title: '实时在线抢单', desc: '第一时间获取高价值技术订单' },
                { title: '专家认证勋章', desc: '提升客户信任度，获得更高报酬' },
                { title: '极速结算通道', desc: '项目完成后资金快速进入账户' }
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{item.title}</div>
                    <div className="text-xs text-slate-400 font-medium">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onUpgrade}
                className="flex-1 bg-vibe-primary text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-vibe-primary/20 flex items-center justify-center gap-2"
              >
                查看专家订阅计划 <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="flex-1 border border-slate-200 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                返回列表
              </button>
            </div>
          </div>
        ) : showBidForm ? (
          // 抢单表单
          <div>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setShowBidForm(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </button>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">提交抢单方案</h2>
                <p className="text-sm text-slate-500">提供您的分析和报价，让用户选择您</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* 问题分析 */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  问题分析 <span className="text-slate-400 font-normal">（简要说明您对问题的理解）</span>
                </label>
                <textarea
                  value={bidData.analysis}
                  onChange={(e) => setBidData({ ...bidData, analysis: e.target.value })}
                  placeholder="例如：这是一个典型的 Next.js 水合错误，原因是组件在服务端和客户端渲染结果不一致..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-vibe-accent focus:border-transparent outline-none transition-all min-h-[100px] resize-none"
                />
              </div>

              {/* 解决思路 */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  解决思路 <span className="text-slate-400 font-normal">（描述您的解决方案）</span>
                </label>
                <textarea
                  value={bidData.solution}
                  onChange={(e) => setBidData({ ...bidData, solution: e.target.value })}
                  placeholder="例如：1. 检查 SSR 组件中的浏览器 API 使用 2. 添加 useEffect 钩子包裹客户端逻辑 3. 使用 dynamic import 禁用特定组件的 SSR..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-vibe-accent focus:border-transparent outline-none transition-all min-h-[120px] resize-none"
                />
              </div>

              {/* 报价和交付时间 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">报价 (¥)</label>
                  <input
                    type="number"
                    value={bidData.price}
                    onChange={(e) => setBidData({ ...bidData, price: e.target.value })}
                    placeholder="例如：500"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-vibe-accent focus:border-transparent outline-none transition-all"
                  />
                  <p className="text-xs text-slate-400 mt-1">用户预算：{request.budget}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">预计交付时间</label>
                  <select
                    value={bidData.deliveryTime}
                    onChange={(e) => setBidData({ ...bidData, deliveryTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-vibe-accent focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="6">6 小时内</option>
                    <option value="12">12 小时内</option>
                    <option value="24">24 小时内</option>
                    <option value="48">48 小时内</option>
                    <option value="72">3 天内</option>
                  </select>
                </div>
              </div>

              {/* 提示 */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-bold mb-1">抢单提示</p>
                    <p className="text-amber-700">详细的分析和合理的报价更容易获得用户青睐。最多10位专家可同时抢单，用户会选择最合适的方案。</p>
                  </div>
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="flex gap-4">
                <button
                  onClick={handleSubmitBid}
                  disabled={!bidData.analysis || !bidData.solution || !bidData.price}
                  className="flex-1 bg-vibe-primary text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md disabled:bg-slate-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5 fill-vibe-accent text-vibe-accent" /> 确认抢单
                </button>
                <button
                  onClick={() => setShowBidForm(false)}
                  className="px-6 py-4 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        ) : (
          // 需求详情
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-vibe-accent border border-sky-100">
                {request.status}
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" /> {request.time}
              </span>
              {request.claimCount !== undefined && (
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {request.claimCount}/10 位专家抢单中
                </span>
              )}
            </div>
            <h2 className="text-3xl font-black text-vibe-primary mb-4 tracking-tight">{request.title}</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {request.tags.map((tag: string) => (
                <span key={tag} className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">#{tag}</span>
              ))}
            </div>

            {/* AI诊断摘要 */}
            {request.aiDiagnosis && (
              <div className="bg-emerald-50 p-6 rounded-xl mb-8 border border-emerald-100">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-emerald-900">AI 诊断摘要</h3>
                </div>
                <p className="text-emerald-800 text-sm mb-3">{request.aiDiagnosis.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {request.aiDiagnosis.issues.map((issue: string, idx: number) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-white text-emerald-700 rounded border border-emerald-200">{issue}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-50 p-6 rounded-lg mb-8 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 text-[10px]">详细描述</h3>
              <p className="text-slate-700 leading-relaxed font-medium">{request.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">预算范围</div>
                <div className="text-xl font-black text-vibe-accent">{request.budget}</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">咨询费状态</div>
                <div className="text-xl font-black text-emerald-500">已支付 (¥49.00)</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowBidForm(true)}
                disabled={request.claimCount >= 10}
                className="flex-1 bg-vibe-primary text-white py-4 rounded-lg font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5 fill-vibe-accent text-vibe-accent" />
                {request.claimCount >= 10 ? '已满员' : '立即抢单'}
              </button>
              <button className="flex-1 border border-slate-200 text-slate-600 py-4 rounded-lg font-bold hover:bg-slate-50 transition-all">
                咨询详情
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const ClaimingScreen = () => (
  <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-10">
      <div className="relative w-32 h-32 mb-12">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-slate-100 border-t-vibe-accent rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap className="w-12 h-12 text-vibe-accent fill-current animate-pulse" />
        </div>
      </div>
    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">正在抢单中...</h2>
    <p className="text-slate-500 font-medium text-center max-w-sm">正在验证您的专家资质并锁定订单名额，请稍候。</p>
  </div>
);

const ClaimSuccessModal = ({ isOpen, onClose, onGoToDashboard }: { isOpen: boolean, onClose: () => void, onGoToDashboard: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white w-full max-w-md rounded-2xl p-10 text-center vibe-card-shadow"
      >
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">抢单成功！</h2>
        <p className="text-slate-500 mb-8 font-medium">该订单已成功分配给您。您现在可以开始与客户进行沟通并提供技术支持。</p>
        <div className="space-y-3">
          <button 
            onClick={onGoToDashboard}
            className="w-full bg-vibe-primary text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
          >
            进入沟通界面
          </button>
          <button 
            onClick={onClose}
            className="w-full text-slate-500 font-bold py-2 hover:text-slate-900 transition-all"
          >
            返回大厅
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Components ---

const FAQItem: React.FC<{ faq: { q: string, a: string } }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 vibe-card-shadow overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-black text-vibe-primary uppercase tracking-tight">{faq.q}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-8 pb-6 text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-4">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Home = ({ onStart, onViewPricing, onMarketplaceClick, onViewMore, onExpertApply, isLoggedIn, userRole, expertVerificationStatus }: { onStart: () => void, onViewPricing: () => void, onMarketplaceClick: (req: any) => void, onViewMore: () => void, onExpertApply: () => void, isLoggedIn: boolean, userRole: 'user' | 'expert' | null, expertVerificationStatus?: ExpertVerificationStatus }) => (
  <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vibe-primary text-white mb-8 border border-slate-700 shadow-xl shadow-vibe-primary/10">
          <Zap className="w-3.5 h-3.5 text-vibe-accent fill-current" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">专业 Vibe Coding 上线救援</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-vibe-primary mb-10 leading-[0.9] tracking-tighter uppercase">
          VIBE<br />
          <span className="text-vibe-accent vibe-glow-text">FELLO</span>
        </h1>
        <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-lg font-medium">
          别让 AI 生成的代码成为项目的终点。
          <br />
          <span className="text-vibe-primary font-bold">VibeFello</span> 为非技术创始人提供专家级诊断与修复，确保您的应用从"看起来不错"到"真正上线"。
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-5 mb-16">
          {userRole !== 'expert' && (
            <button 
              onClick={onStart}
              className="w-full sm:w-auto bg-vibe-primary text-white px-12 py-6 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-slate-800 transition-all vibe-shadow flex items-center justify-center gap-3 group"
            >
              提交救援申请 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
          <button 
            onClick={onExpertApply}
            className={`w-full sm:w-auto px-12 py-6 rounded-2xl text-lg font-black uppercase tracking-widest transition-all ${
              userRole === 'expert' 
                ? 'bg-vibe-primary text-white hover:bg-slate-800 vibe-shadow' 
                : 'bg-white text-vibe-primary border-2 border-vibe-primary hover:bg-slate-50'
            }`}
          >
            {!isLoggedIn 
              ? '专家入驻' 
              : (userRole === 'expert' 
                ? (expertVerificationStatus === 'approved' ? '专家控制台' : '查看审核状态')
                : '升级计划'
              )
            }
          </button>
        </div>
        <div className="flex items-center gap-12 pt-10 border-t border-slate-100">
          <div>
            <div className="text-3xl font-black text-vibe-primary tracking-tighter">1,200+</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">成功修复</div>
          </div>
          <div>
            <div className="text-3xl font-black text-vibe-primary tracking-tighter">98%</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">好评率</div>
          </div>
          <div>
            <div className="text-3xl font-black text-vibe-primary tracking-tighter">2h</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">平均响应</div>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="relative"
      >
        <div className="bg-vibe-primary rounded-3xl border border-slate-800 vibe-shadow p-10 relative z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-vibe-accent/10 blur-3xl rounded-full" />
          <div className="flex items-center gap-5 mb-10">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
              <MessageSquare className="text-vibe-accent w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-white uppercase tracking-tight text-xl">专家诊断报告</h3>
              <p className="text-[10px] text-vibe-accent font-black uppercase tracking-[0.2em]">CASE_ID: #VR-2026-X</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-[0.2em]">问题根源</div>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">SSR 环境下 window 对象未定义导致的水合不匹配 (Hydration Mismatch)。</p>
            </div>
            <div className="p-6 bg-vibe-accent/10 rounded-2xl border border-vibe-accent/20">
              <div className="text-[10px] font-black text-vibe-accent uppercase mb-2 tracking-[0.2em]">推荐方案</div>
              <p className="text-sm text-white font-black leading-relaxed">使用 useEffect 钩子包装客户端逻辑，并添加动态导入以禁用服务端渲染。</p>
            </div>
            <div className="flex items-center justify-between pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => <img key={i} src={`https://picsum.photos/seed/${i+10}/80/80`} className="w-10 h-10 rounded-full border-2 border-vibe-primary shadow-lg" />)}
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-vibe-primary flex items-center justify-center text-[10px] font-black text-vibe-accent">+12</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3 专家在线</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-vibe-accent/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-vibe-glow/20 blur-[120px] rounded-full" />
      </motion.div>
    </div>

    <div className="mb-32 flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
      <div className="text-xl font-black tracking-tighter text-slate-400">TECH_CORP</div>
      <div className="text-xl font-black tracking-tighter text-slate-400">VIBE_LABS</div>
      <div className="text-xl font-black tracking-tighter text-slate-400">AI_STARTUP</div>
      <div className="text-xl font-black tracking-tighter text-slate-400">DEV_STUDIO</div>
      <div className="text-xl font-black tracking-tighter text-slate-400">CLOUDY_INC</div>
    </div>

    <div className="mb-32">
      <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">为什么 Vibe Coding 总是卡在最后 10%？</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { title: "逻辑死循环", desc: "AI 生成的代码在处理复杂业务逻辑时开始自我矛盾，修改 A 导致 B 崩溃，修改 B 又导致 A 崩溃。" },
          { title: "环境与部署难题", desc: "本地运行完美，但一到生产环境就报错。环境变量、构建配置、数据库连接... AI 无法帮您远程调试。" },
          { title: "水合与性能瓶颈", desc: "非技术用户难以理解 SSR/CSR 区别。页面闪烁、水合错误、内存泄漏让您的应用无法真正商用。" }
        ].map((p, i) => (
          <div key={i} className="p-8 rounded-2xl bg-white border border-slate-100 vibe-card-shadow relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm">
              <AlertCircle className="w-5 h-5 text-vibe-accent" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">{p.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="mb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Vibe Request</h2>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜索技术栈、问题关键词..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-vibe-accent/20 focus:border-vibe-accent transition-all font-medium"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 pb-8">
        {['全部', 'Frontend', 'Backend', 'SaaS', 'Game', 'Agent 编排', 'API 调试', '云部署', '环境安装', 'Mobile', 'Web3', 'Smart Contract', 'SDK 集成', 'Infrastructure', 'Skills', 'UI/UX', 'Testing', 'Security', 'DevOps', 'Data Science'].map(tag => (
          <button key={tag} className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition-colors whitespace-nowrap border border-slate-200/50">
            {tag}
          </button>
        ))}
      </div>
      
      <div className="space-y-4">
        {MOCK_MARKETPLACE.slice(0, 30).map((req, i) => (
          <motion.div 
            key={req.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 5) * 0.1 }}
            onClick={() => onMarketplaceClick(req)}
            className="group bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-6 hover:border-vibe-accent hover:shadow-xl hover:shadow-vibe-accent/5 transition-all cursor-pointer relative overflow-hidden vibe-card-shadow"
          >
            <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-vibe-accent/5 group-hover:border-vibe-accent/20 transition-colors">
              {req.tags[0] === 'Next.js' && <Zap className="w-7 h-7 text-vibe-accent" />}
              {req.tags[0] === 'Python' && <TrendingUp className="w-7 h-7 text-emerald-600" />}
              {req.tags[0] === 'React' && <Zap className="w-7 h-7 text-blue-500" />}
              {req.tags[0] === 'Firebase' && <ShieldCheck className="w-7 h-7 text-amber-500" />}
              {req.tags[0] === 'Docker' && <Zap className="w-7 h-7 text-cyan-600" />}
              {!['Next.js', 'Python', 'React', 'Firebase', 'Docker'].includes(req.tags[0]) && <MessageSquare className="w-7 h-7 text-slate-400" />}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-vibe-primary group-hover:text-vibe-accent transition-colors">{req.title}</h3>
                {req.status === '进行中' && <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-vibe-accent/10 text-vibe-accent">服务中</span>}
                {req.status === '已完成' && <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-600">已解决</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {req.tags.map((tag: string) => (
                  <span key={tag} className="text-xs font-bold text-slate-400">#{tag}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-8 shrink-0">
              <div className="text-right">
                <div className="text-sm font-black text-slate-900">{req.budget}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.time}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-vibe-primary group-hover:text-vibe-accent transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button 
          onClick={onViewMore}
          className="text-slate-400 font-bold hover:text-vibe-accent transition-all flex items-center gap-2 group py-4"
        >
          查看更多 Vibe Request <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>

    <div className="mb-32">
      <h2 className="text-3xl font-black text-center text-vibe-primary mb-16 uppercase tracking-tight">用户评价</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { 
            name: "张先生", 
            role: "某 AI 创业公司 CEO", 
            content: "作为非技术创始人，Vibe Coding 让我快速搭建了原型，但最后的部署真的让我崩溃。VibeFello 的专家在 2 小时内就解决了我的问题，非常专业！",
            avatar: "https://picsum.photos/seed/user1/100/100"
          },
          { 
            name: "李女士", 
            role: "独立开发者", 
            content: "基础咨询费非常划算，专家给出的诊断报告让我少走了很多弯路。以前自己摸索要好几天，现在半天就搞定了。强烈推荐给所有独立开发者。",
            avatar: "https://picsum.photos/seed/user2/100/100"
          }
        ].map((t, i) => (
          <div key={i} className="p-10 rounded-2xl bg-white vibe-card-shadow border border-slate-100 flex flex-col md:flex-row gap-8 items-start">
            <img src={t.avatar} className="w-16 h-16 rounded-2xl object-cover shrink-0 border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
            <div>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-lg font-medium text-slate-700 mb-6 italic leading-relaxed">“{t.content}”</p>
              <div>
                <div className="font-black text-vibe-primary uppercase tracking-tight">{t.name}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="mb-32">
      <h2 className="text-3xl font-black text-center text-vibe-primary mb-16 uppercase tracking-tight">专业服务流程</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { step: "01", title: "提交咨询", desc: "描述您的 Vibe Coding 困境并支付基础咨询费。" },
          { step: "02", title: "专家诊断", desc: "多位专家分析问题并提供初步解决方案与报价。" },
          { step: "03", title: "托管资金", desc: "选择专家并托管全额费用，平台提供全程担保。" },
          { step: "04", title: "上线交付", desc: "专家修复问题，确认无误后释放资金，项目上线。" }
        ].map((item, i) => (
          <div key={i} className="relative group p-8 rounded-2xl hover:bg-white hover:vibe-card-shadow transition-all border border-transparent hover:border-slate-100">
            <div className="text-7xl font-black text-slate-100 absolute -top-8 -left-4 group-hover:text-vibe-accent/10 transition-colors">{item.step}</div>
            <div className="relative z-10">
              <h3 className="text-xl font-black text-vibe-primary mb-3 uppercase tracking-tight">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>


    <div className="mb-32">
      <h2 className="text-3xl font-black text-center text-vibe-primary mb-16 uppercase tracking-tight">常见问题 FAQ</h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {[
          {
            q: "什么是 VibeFello？",
            a: "这是一个专为 Vibe Coder (AI 辅助开发者) 打造的专家支援平台，解决 AI 无法处理的复杂逻辑、环境配置和生产环境部署等难题。"
          },
          {
            q: "使用 VibeFello 需要付费吗？",
            a: "是的，平台会收取小额的基础服务费。发布需求时，您可以根据问题的难度提供预算范围，专家在初步诊断后会给出最终的解决方案评估和报价。最重要的是，最终是否支付由您决定。平台提供资金担保服务，资金将由平台托管，并在您确认专家完成工作后支付给专家，确保您的每一分钱都花在刀刃上。"
          },
          {
            q: "如果专家无法解决我的问题怎么办？",
            a: "如果专家在诊断阶段确认无法解决，专家服务费将全额退还。如果进入正式服务阶段，资金由平台托管，直到您确认交付，确保您的资金安全。"
          },
          {
            q: "我如何成为 VibeFello 的专家？",
            a: "您可以在控制台申请专家身份。我们需要验证您的技术背景和项目经验，通过审核后即可开始在 Vibe Request 大厅接单并赚取收益。"
          },
          {
            q: "平台支持哪些技术栈？",
            a: "我们支持 React, Next.js, Python, Node.js, AWS, Docker 等主流全栈技术，以及 AI Agent 编排、Web3 和移动端开发等前沿领域。"
          }
        ].map((faq, i) => (
          <FAQItem key={i} faq={faq} />
        ))}
      </div>
    </div>

    <div className="mb-32 bg-vibe-primary rounded-3xl p-16 text-center relative overflow-hidden vibe-shadow border border-slate-800">
      <div className="relative z-10">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight uppercase">准备好让您的项目上线了吗？</h2>
        <p className="text-slate-400 mb-12 max-w-2xl mx-auto text-lg font-medium">
          不要在逻辑死循环中浪费时间。数千名专家随时待命，为您提供最专业的 Vibe Coding 诊断服务。
        </p>
        <button 
          onClick={onStart}
          className="bg-vibe-accent text-vibe-primary px-12 py-5 rounded-xl text-xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl shadow-vibe-accent/20 flex items-center justify-center gap-3 mx-auto group"
        >
          立即提交救援申请 <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-0 left-0 w-80 h-80 bg-vibe-accent blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-vibe-glow blur-[120px] rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>
    </div>
  </div>
);

const Pricing = ({ userRole, userTier, onUpgrade }: { userRole: 'user' | 'expert' | null, userTier: 'free' | 'pro' | 'max', onUpgrade?: (tier: 'pro' | 'max') => void }) => {
  const isExpertView = userRole === 'expert';
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // 用户会员计划 - 重新设计，更有吸引力
  const userPlans = [
    {
      tier: "按次咨询",
      subtitle: "灵活付费",
      price: "$9.9",
      period: "每次咨询",
      description: "适合偶尔需要帮助的用户",
      features: [
        { text: "1 次 AI 代码诊断", highlight: false },
        { text: "1 次专家咨询机会", highlight: false },
        { text: "标准响应速度（24h）", highlight: false },
        { text: "社区支持", highlight: false },
      ],
      notIncluded: [],
      cta: "按次支付",
      popular: false,
      badge: null,
      savings: null
    },
    {
      tier: "Pro",
      subtitle: "最受欢迎",
      price: "$39",
      period: "每月",
      description: "Vibe Coding 新手的最佳选择",
      features: [
        { text: "每月 10 次 AI 代码诊断", highlight: true },
        { text: "每月 10 次专家咨询", highlight: true },
        { text: "优先专家匹配（2h内）", highlight: true },
        { text: "完整诊断报告下载", highlight: false },
        { text: "技术文档支持", highlight: false },
        { text: "专属咨询通道", highlight: false },
      ],
      notIncluded: [],
      cta: "立即升级",
      popular: true,
      badge: "省 $12/月",
      savings: "比单次省 $4.2/次"
    },
    {
      tier: "Max",
      subtitle: "无限权益",
      price: "$199",
      period: "每月",
      description: "适合重度 Vibe Coding 开发者",
      features: [
        { text: "每月 69 次 AI 代码诊断", highlight: true },
        { text: "无限次专家咨询", highlight: true },
        { text: "即时专家响应（30min）", highlight: true },
        { text: "1对1 专属专家", highlight: true },
        { text: "架构设计建议", highlight: true },
        { text: "代码深度审查", highlight: false },
        { text: "VIP 专属客服", highlight: false },
        { text: "优先处理紧急需求", highlight: false },
      ],
      notIncluded: [],
      cta: "立即升级",
      popular: false,
      badge: "省 $60/月",
      savings: "重度用户首选，无后顾之忧"
    }
  ];

  // 专家订阅计划
  const expertPlans = [
    {
      tier: "Starter",
      subtitle: "入门",
      price: "$19",
      period: "每月",
      description: "开始您的专家变现之旅",
      features: [
        { text: "每月 4 单接单额度", highlight: false },
        { text: "基础专家标识", highlight: false },
        { text: "标准结算周期", highlight: false },
        { text: "社区支持", highlight: false },
      ],
      cta: "立即订阅",
      popular: false,
      badge: null
    },
    {
      tier: "Pro 专家",
      subtitle: "专业",
      price: "$69",
      period: "每月",
      description: "提升接单能力，增加收入",
      features: [
        { text: "每月 20 单接单额度", highlight: true },
        { text: "Pro 专家勋章", highlight: true },
        { text: "优先推荐展示", highlight: true },
        { text: "快速结算周期", highlight: false },
        { text: "专属客服支持", highlight: false },
      ],
      cta: "立即订阅",
      popular: true,
      badge: "最受欢迎"
    },
    {
      tier: "Master",
      subtitle: "大师",
      price: "$299",
      period: "每月",
      description: "顶级专家的专属特权",
      features: [
        { text: "无限接单额度", highlight: true },
        { text: "Master 顶级勋章", highlight: true },
        { text: "首页推荐位", highlight: true },
        { text: "即时结算", highlight: true },
        { text: "VIP 专属活动", highlight: false },
      ],
      cta: "立即订阅",
      popular: false,
      badge: "顶级"
    }
  ];

  const plans = isExpertView ? expertPlans : userPlans;

  // 社会证明数据
  const socialProof = isExpertView ? {
    users: "2,400+",
    label: "活跃专家",
    testimonial: "加入 Pro 计划后，我的月收入增长了 3 倍",
    author: "Alex Chen, 全栈工程师",
    metric: "平均月收入",
    metricValue: "$3,200"
  } : {
    users: "15,000+",
    label: "问题已解决",
    testimonial: "Pro 会员帮我节省了数周的调试时间",
    author: "Sarah Li, 独立开发者",
    metric: "平均节省",
    metricValue: "40 小时/月"
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* 核心价值主张 */}
      {!isExpertView && (
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-vibe-accent/10 rounded-full border border-vibe-accent/20 mb-6">
            <Sparkles className="w-4 h-4 text-vibe-accent" />
            <span className="text-sm font-bold text-vibe-primary">
              选择适合您的计划
            </span>
          </div>
          <h3 className="text-3xl font-black mb-4 text-slate-900">解决 Vibe Coding 最后 10% 的上线难题</h3>
          <p className="text-lg text-slate-500 mb-6">
            AI 帮你写代码，我们帮你解决 AI 解决不了的问题。部署失败、性能瓶颈、安全漏洞，专家 2 小时内介入。
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-slate-700">部署问题</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-slate-700">性能优化</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-slate-700">安全漏洞</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-slate-700">架构设计</span>
            </div>
          </div>
        </div>
      )}

      {/* 价格卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {plans.map((plan, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-3xl overflow-hidden ${
              plan.popular 
                ? 'bg-vibe-primary text-white ring-4 ring-vibe-accent/30 scale-105 z-10' 
                : 'bg-white border border-slate-200'
            }`}
          >
            {/* 徽章 */}
            {plan.badge && (
              <div className="absolute top-0 right-0 bg-vibe-accent text-vibe-primary px-4 py-1 text-xs font-black rounded-bl-2xl">
                {plan.badge}
              </div>
            )}

            <div className="p-8 flex flex-col h-full">
              {/* 计划名称 */}
              <div className="mb-6">
                <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${plan.popular ? 'text-vibe-accent' : 'text-slate-400'}`}>
                  {plan.subtitle}
                </div>
                <h3 className={`text-2xl font-black ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                  {plan.tier}
                </h3>
                <p className={`text-sm mt-1 ${plan.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
              </div>

              {/* 价格 */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className={`text-5xl font-black ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm font-bold ${plan.popular ? 'text-slate-400' : 'text-slate-400'}`}>
                    /{plan.period}
                  </span>
                </div>
                {!isExpertView && 'savings' in plan && plan.savings && (
                  <p className={`text-sm mt-2 ${plan.popular ? 'text-vibe-accent' : 'text-emerald-600'}`}>
                    ✓ {plan.savings}
                  </p>
                )}
              </div>

              {/* 功能列表 */}
              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      plan.popular ? 'bg-vibe-accent' : 'bg-emerald-100'
                    }`}>
                      <CheckCircle2 className={`w-3 h-3 ${plan.popular ? 'text-vibe-primary' : 'text-emerald-600'}`} />
                    </div>
                    <span className={`text-sm ${
                      feature.highlight 
                        ? (plan.popular ? 'text-white font-bold' : 'text-slate-900 font-bold')
                        : (plan.popular ? 'text-slate-300' : 'text-slate-600')
                    }`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA 按钮 */}
              <button 
                onClick={() => {
                  setSelectedPlan(plan.tier);
                  setShowPaymentModal(true);
                }}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all mt-auto ${
                  plan.popular 
                    ? 'bg-vibe-accent text-vibe-primary hover:bg-vibe-accent/90 shadow-lg shadow-vibe-accent/20' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 信任保障 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-slate-900 rounded-3xl text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-vibe-accent/20 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-vibe-accent" />
            </div>
            <h3 className="text-xl font-black">7 天无理由退款</h3>
          </div>
          <p className="text-slate-400 leading-relaxed">
            购买后 7 天内，如未使用任何专家咨询服务，可申请全额退款。让您零风险体验。
          </p>
        </div>

        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-vibe-accent/10 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-vibe-accent" />
            </div>
            <h3 className="text-xl font-black text-slate-900">随时取消订阅</h3>
          </div>
          <p className="text-slate-500 leading-relaxed">
            无长期合约，您可以随时取消订阅，次月生效。剩余未使用的咨询次数当月有效。
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <h3 className="text-2xl font-black text-slate-900 text-center mb-8">常见问题</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {[
            { q: "AI 诊断次数有限制吗？", a: "按次付费含 1 次，Pro 会员每月 10 次，Max 会员每月 69 次。未使用次数不累积。" },
            { q: "专家咨询和 AI 诊断有什么区别？", a: "AI 诊断自动分析代码问题，专家咨询由真人专家提供深度解决方案和代码修复。" },
            { q: "可以随时取消订阅吗？", a: "可以，您可以随时取消，次月生效。当月已支付的会员费用不退还。" },
            { q: "未使用的次数会累积吗？", a: "不会，Pro 和 Max 的每月次数当月有效，不累积到下月。" }
          ].map((faq, i) => (
            <div key={i} className="p-5 bg-white rounded-xl border border-slate-200">
              <p className="font-bold text-slate-900 mb-2">{faq.q}</p>
              <p className="text-sm text-slate-500">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 支付弹窗 */}
      <AnimatePresence>
        {showPaymentModal && selectedPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessingPayment && setShowPaymentModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-2xl p-8 vibe-shadow"
            >
              {!isProcessingPayment && (
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              )}

              {isProcessingPayment ? (
                <div className="py-12 text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-vibe-accent/20 rounded-full"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-2 border-4 border-t-vibe-accent border-r-transparent border-b-transparent border-l-transparent rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Wallet className="w-8 h-8 text-vibe-accent" />
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">正在处理支付...</h3>
                  <p className="text-slate-500">请稍候，正在安全处理您的付款</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-vibe-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-vibe-accent" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">确认升级</h3>
                    <p className="text-slate-500">您选择了 <span className="font-bold text-vibe-primary">{selectedPlan}</span> 计划</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-600">计划费用</span>
                      <span className="font-bold text-slate-900">
                        {selectedPlan === '按次咨询' ? '$6.9' : selectedPlan === 'Pro' ? '$39/月' : '$199/月'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">首月优惠</span>
                      <span className="text-emerald-600 font-bold">
                        {selectedPlan === '按次咨询' ? '-$3' : selectedPlan === 'Pro' ? '-$12' : '-$60'}
                      </span>
                    </div>
                    <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between items-center">
                      <span className="font-bold text-slate-900">实付金额</span>
                      <span className="text-2xl font-black text-vibe-primary">
                        {selectedPlan === '按次咨询' ? '$6.9' : selectedPlan === 'Pro' ? '$27' : '$139'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      setIsProcessingPayment(true);
                      await new Promise(resolve => setTimeout(resolve, 2000));
                      setIsProcessingPayment(false);
                      setShowPaymentModal(false);
                      // 升级会员
                      const tier = selectedPlan === 'Pro' ? 'pro' : selectedPlan === 'Max' ? 'max' : 'free';
                      onUpgrade?.(tier as 'pro' | 'max');
                    }}
                    className="w-full py-4 bg-vibe-primary text-white rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all vibe-shadow"
                  >
                    确认支付
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MatchingScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 1000);
          return 100;
        }
        return p + 2;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="relative w-32 h-32 mx-auto mb-10">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-vibe-accent/10 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border-4 border-t-vibe-accent border-r-transparent border-b-transparent border-l-transparent rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-10 h-10 text-vibe-accent fill-current" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-vibe-primary mb-4 tracking-tight uppercase">AI 正在匹配专家...</h2>
        <p className="text-slate-500 mb-10 font-medium">正在分析您的技术栈和问题复杂度，以为您寻找最佳支持。</p>
        
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-6 border border-slate-200">
          <motion.div 
            className="h-full bg-vibe-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <span>{progress < 30 ? '分析代码中' : progress < 70 ? '扫描专家中' : '完成匹配'}</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};

const Marketplace = ({ onSelect, isExpert, userTier }: { onSelect: (r: any) => void, isExpert: boolean, userTier: UserTier }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'budget' | 'urgent'>('latest');

  // 提取所有唯一标签
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    MOCK_MARKETPLACE.forEach(req => req.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  // 模拟抢单数据
  const requestStats = useMemo(() => MOCK_MARKETPLACE.map(req => ({
    ...req,
    claimCount: Math.floor(Math.random() * 8) + 1,
    maxClaims: 10,
    aiDiagnosis: req.id === 'm1' || req.id === 'm3' ? {
      summary: '检测到代码中存在潜在的性能问题和安全漏洞',
      severity: 'medium',
      issues: ['内存泄漏', 'XSS风险', '未优化查询']
    } : null
  })), []);

  // 筛选和排序逻辑
  const filteredRequests = useMemo(() => {
    let filtered = requestStats;

    // 关键词搜索
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req =>
        req.title.toLowerCase().includes(query) ||
        req.description.toLowerCase().includes(query) ||
        req.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // 标签筛选
    if (selectedTags.length > 0) {
      filtered = filtered.filter(req =>
        selectedTags.some(tag => req.tags.includes(tag))
      );
    }

    // 排序
    const sorted = [...filtered];
    switch (sortBy) {
      case 'budget':
        sorted.sort((a, b) => {
          const aBudget = parseInt(a.budget.replace(/[^0-9]/g, ''));
          const bBudget = parseInt(b.budget.replace(/[^0-9]/g, ''));
          return bBudget - aBudget;
        });
        break;
      case 'latest':
      default:
        // 保持原有顺序（假设MOCK_MARKETPLACE已按时间排序）
        break;
    }

    return sorted;
  }, [requestStats, searchQuery, selectedTags, sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSortBy('latest');
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Vibe Request 大厅</h2>
            <p className="text-slate-500 font-medium">
              {isExpert
                ? '浏览最新技术救援需求，最多10位专家可同时抢单，提供分析和报价。'
                : '您的请求发布后，最多10位专家将抢单并为您提供解决方案。'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">共 {filteredRequests.length} 个需求</span>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索需求标题、描述或技术标签..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-vibe-accent focus:ring-2 focus:ring-vibe-accent/20 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>

          {/* Tags Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">技术标签:</span>
            {allTags.slice(0, 12).map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-vibe-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
            {allTags.length > 12 && (
              <span className="text-xs text-slate-400">+{allTags.length - 12} 更多</span>
            )}
          </div>

          {/* Sort and Clear */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">排序:</span>
              {[
                { key: 'latest', label: '最新发布' },
                { key: 'budget', label: '预算最高' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    sortBy === key
                      ? 'bg-vibe-accent/10 text-vibe-primary border border-vibe-accent/20'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {(searchQuery || selectedTags.length > 0 || sortBy !== 'latest') && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
                清除筛选
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 专家提示 */}
      {isExpert && (
        <div className="mb-8 p-4 bg-vibe-accent/10 rounded-xl border border-vibe-accent/20 flex items-center gap-3">
          <div className="w-10 h-10 bg-vibe-accent/20 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-vibe-accent" />
          </div>
          <div>
            <div className="font-bold text-slate-900">专家抢单规则</div>
            <div className="text-sm text-slate-600">每个需求最多10位专家可同时抢单，提供问题分析和报价，由用户选择最合适的专家。</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">未找到匹配的需求</h3>
            <p className="text-slate-500 mb-4">尝试调整搜索关键词或筛选条件</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-vibe-primary text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
            >
              清除筛选条件
            </button>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              onClick={() => onSelect(req)}
              className="bg-white p-6 rounded-2xl border border-slate-200 vibe-card-shadow hover:border-vibe-accent transition-all cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider border border-indigo-100">新需求</span>
                    <span className="text-xs text-slate-400 font-medium">{req.time}</span>
                    {req.aiDiagnosis && (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-100 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> 已AI诊断
                      </span>
                    )}
                  </div>
                  <h4 className="text-xl font-black text-vibe-primary group-hover:text-vibe-accent transition-colors tracking-tight mb-3">{req.title}</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {req.tags.map(s => <span key={s} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{s}</span>)}
                  </div>
                  {/* 抢单进度 */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 max-w-[200px]">
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-vibe-accent rounded-full transition-all"
                          style={{ width: `${(req.claimCount / req.maxClaims) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">
                      <span className="font-bold text-vibe-primary">{req.claimCount}</span> / {req.maxClaims} 位专家抢单
                    </span>
                    {req.claimCount >= 8 && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                        即将满员
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900">{req.budget}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">预估报酬</div>
                  </div>
                  <button className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg ${
                    req.claimCount >= 10 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-vibe-primary text-white hover:bg-slate-800 shadow-vibe-primary/10'
                  }`}>
                    {req.claimCount >= 10 ? '已满员' : '立即抢单'}
                  </button>
                </div>
              </div>

              {/* AI诊断摘要（仅专家可见） */}
              {isExpert && req.aiDiagnosis && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-900 mb-1">AI 诊断摘要</div>
                      <p className="text-sm text-slate-600 mb-2">{req.aiDiagnosis.summary}</p>
                      <div className="flex flex-wrap gap-1">
                        {req.aiDiagnosis.issues.map((issue: string, idx: number) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">{issue}</span>
                        ))}
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      req.aiDiagnosis.severity === 'high' ? 'bg-red-100 text-red-600' :
                      req.aiDiagnosis.severity === 'medium' ? 'bg-amber-100 text-amber-600' :
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {req.aiDiagnosis.severity === 'high' ? '高' : req.aiDiagnosis.severity === 'medium' ? '中' : '低'}风险
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Workspace = ({ request, onBack }: { request: Request, onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'files' | 'details'>('chat');

  return (
    <div className="pt-28 pb-20 min-h-screen bg-slate-50">
      {/* Workspace Header */}
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30 px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-vibe-primary">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider border border-indigo-100">服务中</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {request.id}</span>
              </div>
              <h2 className="text-xl font-black text-vibe-primary tracking-tight">{request.title}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
              <Clock className="w-4 h-4 text-vibe-accent" />
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">剩余时间</div>
              <div className="text-sm font-black text-vibe-primary">18:42:05</div>
            </div>
            <button className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
              提交交付
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 gap-8">
              {[
                { id: 'chat', label: '沟通记录', icon: MessageSquare },
                { id: 'files', label: '交付文件', icon: Download },
                { id: 'details', label: '需求详情', icon: LayoutDashboard }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${
                    activeTab === tab.id ? 'border-vibe-accent text-vibe-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'chat' && (
                <motion.div 
                  key="chat"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl border border-slate-200 vibe-card-shadow flex flex-col h-[600px]"
                >
                  <div className="flex-1 p-8 overflow-y-auto space-y-6">
                    <div className="flex justify-center">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">2026年3月28日</span>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="space-y-1 max-w-[80%]">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">User_9921</div>
                        <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100">
                          <p className="text-sm text-slate-600 font-medium leading-relaxed">
                            你好，我已经拉取了代码，正在复现您提到的 Hydration 错误。
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-400 ml-1">10:45 AM</span>
                      </div>
                    </div>

                    <div className="flex gap-4 flex-row-reverse">
                      <div className="w-10 h-10 rounded-xl bg-vibe-primary flex items-center justify-center shrink-0 border border-slate-800">
                        <Zap className="w-5 h-5 text-vibe-accent fill-current" />
                      </div>
                      <div className="space-y-1 max-w-[80%] text-right">
                        <div className="text-[10px] font-black text-vibe-accent uppercase tracking-widest mr-1">Ricky S. (Expert)</div>
                        <div className="bg-vibe-primary p-4 rounded-2xl rounded-tr-none text-white shadow-lg shadow-vibe-primary/10">
                          <p className="text-sm font-medium leading-relaxed">
                            好的，麻烦了。这个问题在生产环境下非常明显。我已经准备好了几个测试用例。
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-400 mr-1">10:48 AM</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
                    <div className="relative">
                      <textarea 
                        placeholder="输入消息，按 Enter 发送..."
                        className="w-full p-4 pr-32 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-vibe-accent/20 focus:border-vibe-accent transition-all font-medium min-h-[100px] bg-white"
                      />
                      <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-vibe-primary transition-colors">
                          <PlusCircle className="w-5 h-5" />
                        </button>
                        <button className="bg-vibe-primary text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                          发送
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'files' && (
                <motion.div 
                  key="files"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl border border-slate-200 vibe-card-shadow p-8"
                >
                  <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                      <Download className="w-8 h-8 text-slate-300" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-2">暂无交付文件</h4>
                    <p className="text-sm text-slate-500 mb-8">完成工作后，请在此上传您的交付成果（代码压缩包、文档等）。</p>
                    <button className="bg-vibe-primary text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                      上传文件
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'details' && (
                <motion.div 
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl border border-slate-200 vibe-card-shadow p-8 space-y-8"
                >
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">需求描述</h4>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {request.description || "这是一个紧急的技术救援请求。客户需要专家协助解决代码中的关键逻辑错误或环境配置问题。"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">技术栈</h4>
                      <div className="flex flex-wrap gap-2">
                        {request.techStack.map(t => (
                          <span key={t} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">交付要求</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 修复所有水合错误
                        </li>
                        <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 提供优化建议文档
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 vibe-card-shadow">
              <h3 className="text-lg font-black text-slate-900 mb-6">项目概况</h3>
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">项目预算</span>
                  <span className="font-black text-vibe-accent text-xl">{request.budget || `¥${request.price}`}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">已托管资金</span>
                  <span className="font-black text-emerald-500 text-lg">¥500.00</span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">创建时间</span>
                  <span className="text-sm font-bold text-slate-900">{request.createdAt}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">预估交付</span>
                  <span className="text-sm font-bold text-slate-900">2026-03-30</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">资金安全保障</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 leading-relaxed">
                  该项目资金已由平台全额托管。用户确认交付成果后，资金将立即结算至您的账户。
                </p>
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                  申请延期
                </button>
                <button className="w-full bg-white text-red-500 border border-red-100 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all">
                  终止合作
                </button>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-vibe-accent/10 blur-3xl rounded-full" />
              <h4 className="text-lg font-black mb-6 relative z-10">客户信息</h4>
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <User className="w-7 h-7 text-vibe-accent" />
                </div>
                <div>
                  <div className="font-black text-white text-lg">User_9921</div>
                  <div className="text-[10px] font-black text-vibe-accent uppercase tracking-widest">普通会员</div>
                </div>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/40">历史订单</span>
                  <span>4 个</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/40">好评率</span>
                  <span className="text-emerald-400">100%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 vibe-card-shadow">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">项目进度</h4>
              <div className="space-y-8">
                {[
                  { label: '订单已创建', date: '03-25', done: true },
                  { label: '专家已接单', date: '03-25', done: true },
                  { label: '资金已托管', date: '03-25', done: true },
                  { label: '服务进行中', date: '进行中', active: true },
                  { label: '等待交付', date: '-', pending: true },
                  { label: '结算完成', date: '-', pending: true }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 relative">
                    {i < 5 && (
                      <div className={`absolute left-2.5 top-6 w-0.5 h-8 ${step.done ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                    )}
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      step.done ? 'bg-emerald-500 text-white' : 
                      step.active ? 'bg-vibe-accent text-vibe-primary animate-pulse' : 
                      'bg-slate-100 text-slate-300'
                    }`}>
                      {step.done ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <span className={`text-xs font-bold ${step.pending ? 'text-slate-400' : 'text-slate-900'}`}>{step.label}</span>
                      <span className="text-[10px] font-bold text-slate-400">{step.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExpertDashboard = ({ 
  requests, 
  onSelect, 
  onEnterWorkspace, 
  onTabChange,
  verificationStatus,
  onStartApplication
}: { 
  requests: Request[], 
  onSelect: (r: Request) => void, 
  onEnterWorkspace: (r: Request) => void, 
  onTabChange: (tab: string) => void,
  verificationStatus: ExpertVerificationStatus,
  onStartApplication: () => void
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

                <div className="flex gap-4">
                  <button className="bg-vibe-primary text-white px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all vibe-shadow shadow-xl shadow-vibe-primary/20">
                    升级到 MASTER
                  </button>
                  <button className="bg-white text-slate-600 border border-slate-200 px-8 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                    取消订阅
                  </button>
                </div>
              </div>
              <div className="w-full md:w-80 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">计划权益</h4>
                <ul className="space-y-3">
                  {['每月 20 个接单额度', 'PRO 专家认证勋章', '优先推荐给客户', '快速结算通道', '7x24 专家支持'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {f}
                    </li>
                  ))}
                </ul>
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
            className="bg-white p-8 rounded-2xl border border-slate-200 vibe-card-shadow"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">收益历史</h3>
              <button className="text-[10px] font-black text-vibe-accent uppercase tracking-widest flex items-center gap-2">
                <Download className="w-4 h-4" /> 导出报表
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">日期</th>
                    <th className="text-left py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">项目</th>
                    <th className="text-left py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">状态</th>
                    <th className="text-right py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">金额</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { date: '2024-11-20', title: 'Next.js 性能优化', status: '已结算', amount: '+¥3,200.00' },
                    { date: '2024-11-18', title: 'Python 爬虫部署', status: '已结算', amount: '+¥800.00' },
                    { date: '2024-11-15', title: 'React 状态管理重构', status: '处理中', amount: '+¥1,500.00' },
                    { date: '2024-11-12', title: 'Docker 镜像修复', status: '已结算', amount: '+¥450.00' },
                    { date: '2024-11-18', title: 'React 水合错误修复', status: '已结算', amount: '+$120.00' },
                    { date: '2024-11-15', title: 'AWS 部署咨询', status: '处理中', amount: '+$300.00' },
                  ].map((row, i) => (
                    <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 text-sm font-medium text-slate-500">{row.date}</td>
                      <td className="py-4 text-sm font-bold text-slate-900">{row.title}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          row.status === '已结算' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 text-right text-sm font-black text-slate-900">{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 会员状态卡片组件
const MembershipCard = ({ tier, remainingConsults, onUpgrade }: { tier: UserTier, remainingConsults: number, onUpgrade: () => void }) => {
  const config = {
    free: {
      title: '本月剩余次数',
      value: `${remainingConsults} 次`,
      subtext: '按次付费',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-900',
      subtextColor: 'text-slate-500',
      iconBg: 'bg-slate-200',
      iconColor: 'text-slate-600'
    },
    pro: {
      title: '本月剩余次数',
      value: `${remainingConsults} 次`,
      subtext: '/ 10次',
      bg: 'bg-vibe-accent/10',
      border: 'border-vibe-accent/30',
      text: 'text-vibe-primary',
      subtextColor: 'text-vibe-primary/70',
      iconBg: 'bg-vibe-accent',
      iconColor: 'text-vibe-primary'
    },
    max: {
      title: '本月剩余次数',
      value: '无限',
      subtext: '',
      bg: 'bg-vibe-primary',
      border: 'border-vibe-primary',
      text: 'text-white',
      subtextColor: 'text-slate-300',
      iconBg: 'bg-vibe-accent',
      iconColor: 'text-vibe-primary'
    }
  };

  const c = config[tier];

  const tierBadge = tier === 'pro' ? 'Pro' : tier === 'max' ? 'Max' : null;

  return (
    <div className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl ${c.bg} border ${c.border} shadow-sm`}>
      {/* 会员等级角标 */}
      {tierBadge && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-vibe-primary text-white text-[10px] font-black rounded-full shadow-sm">
          {tierBadge}
        </div>
      )}
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.iconBg}`}>
        <Sparkles className={`w-4 h-4 ${c.iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-[10px] ${c.subtextColor}`}>{c.title}</div>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-lg font-black ${c.text}`}>{c.value}</span>
          <span className={`text-xs ${c.subtextColor}`}>{c.subtext}</span>
        </div>
      </div>
      {tier !== 'max' && (
        <button 
          onClick={onUpgrade}
          className="ml-2 px-3 py-1.5 bg-vibe-primary text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
        >
          升级计划
        </button>
      )}
    </div>
  );
};

// 空白状态引导组件
const EmptyStateGuide = ({ onPostRequest }: { onPostRequest: () => void }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-vibe-primary p-12 text-white">
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-vibe-accent/20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-vibe-glow/20 blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3" />
      
      <div className="relative z-10">
        {/* 主标题区域 */}
        <div className="text-center mb-12">
          <h3 className="text-4xl font-black mb-4 tracking-tight">
            让Vibe Coding专家为你解决代码难题
          </h3>
          <p className="text-slate-300 max-w-lg mx-auto text-lg">
            只需3分钟描述你的问题，顶级代码审计AI将自动诊断，专家会在24小时内介入解决。
          </p>
        </div>

        {/* 流程步骤 - 横向排列 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
          {[
            { num: '01', title: '描述问题', desc: '说明技术难题' },
            { num: '02', title: 'AI 诊断', desc: '自动分析代码' },
            { num: '03', title: '专家解决', desc: '资深专家修复' }
          ].map((step, i, arr) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 min-w-[180px]">
                <div className="w-12 h-12 bg-vibe-accent rounded-xl flex items-center justify-center">
                  <span className="text-lg font-black text-vibe-primary">{step.num}</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">{step.title}</h4>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>
              </div>
              {i < arr.length - 1 && (
                <ArrowRight className="w-6 h-6 text-vibe-accent hidden md:block" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* CTA 按钮 */}
        <div className="text-center">
          <button 
            onClick={onPostRequest}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-vibe-accent text-vibe-primary rounded-2xl font-black text-lg hover:bg-vibe-accent/90 transition-all shadow-2xl shadow-vibe-accent/20 hover:shadow-vibe-accent/40 hover:scale-105"
          >
            <Zap className="w-6 h-6 group-hover:animate-pulse" />
            立即发布需求
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ requests, onSelect, onPostRequest, onUpgrade, userTier, remainingConsults }: {
  requests: Request[],
  onSelect: (r: Request) => void,
  onPostRequest: () => void,
  onUpgrade: () => void,
  userTier: UserTier,
  remainingConsults: number
}) => {
  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case 'pending_consultation': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'pending_quote': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'quoted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in_service': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'cooling': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    const labels: Record<OrderStatus, string> = {
      pending_consultation: '等待诊断',
      pending_quote: '待报价',
      quoted: '已报价',
      in_service: '服务中',
      cooling: '冷却中',
      completed: '已完成'
    };
    return labels[status];
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      {/* 头部区域 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">我的需求</h2>
          <p className="text-slate-500">跟踪您的活跃帮助会话和付款状态。</p>
        </div>

        {/* 会员状态和余额 */}
        <div className="flex items-center gap-3">
          <MembershipCard tier={userTier} remainingConsults={remainingConsults} onUpgrade={onUpgrade} />
          <div className="h-10 w-px bg-slate-200" />
          <div className="flex items-center gap-2 px-3">
            <Wallet className="w-4 h-4 text-emerald-600" />
            <div>
              <div className="text-[10px] text-slate-400">余额</div>
              <div className="text-sm font-bold text-slate-900">¥3,250</div>
            </div>
          </div>
        </div>
      </div>

      {/* 需求列表或空白状态 */}
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((req) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onSelect(req)}
              className="bg-white p-6 rounded-2xl border border-slate-200 vibe-card-shadow hover:shadow-md hover:border-vibe-accent transition-all cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(req.status)}`}>
                      {getStatusLabel(req.status)}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {req.createdAt}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-vibe-primary group-hover:text-vibe-accent transition-colors tracking-tight">{req.title}</h3>
                  <div className="flex gap-2 mt-2">
                    {req.techStack.map(s => <span key={s} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{s}</span>)}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900">{req.price ? `¥${req.price}` : req.budget}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">固定价格</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-vibe-accent group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyStateGuide onPostRequest={onPostRequest} />
      )}
    </div>
  );
};

// 模拟专家报价数据
const MOCK_EXPERT_BIDS = [
  {
    id: 'bid1',
    expertId: 'e1',
    expertName: '陈老师 (Alex)',
    expertAvatar: 'https://picsum.photos/seed/alex/100/100',
    expertRating: 4.9,
    expertCompletedJobs: 124,
    expertSkills: ['Next.js', 'TypeScript', 'Vercel'],
    analysis: '这是一个典型的 Next.js 水合错误，主要原因是组件在服务端和客户端渲染结果不一致。具体来说是 Header 组件中直接使用了 window.innerWidth。',
    solution: '1. 使用 useEffect 包裹浏览器 API 调用\n2. 添加 typeof window !== "undefined" 检查\n3. 使用 dynamic import 禁用特定组件的 SSR',
    price: 450,
    deliveryTime: '12',
    deliveryTimeLabel: '12小时内',
    isPro: true
  },
  {
    id: 'bid2',
    expertId: 'e2',
    expertName: '米勒 (Sarah)',
    expertAvatar: 'https://picsum.photos/seed/sarah/100/100',
    expertRating: 4.8,
    expertCompletedJobs: 89,
    expertSkills: ['React', 'SSR', '性能优化'],
    analysis: '检测到 SSR 组件中使用了浏览器 API 导致水合不匹配。问题定位在 Header 组件的响应式逻辑。',
    solution: '1. 重构 Header 组件，分离服务端和客户端渲染逻辑\n2. 使用 CSS Media Query 替代 JS 响应式\n3. 添加水合错误边界处理',
    price: 380,
    deliveryTime: '24',
    deliveryTimeLabel: '24小时内',
    isPro: true
  },
  {
    id: 'bid3',
    expertId: 'e3',
    expertName: '王大卫 (David)',
    expertAvatar: 'https://picsum.photos/seed/david/100/100',
    expertRating: 5.0,
    expertCompletedJobs: 210,
    expertSkills: ['React Native', 'Firebase', 'Node.js'],
    analysis: '水合错误是由于组件在服务端渲染时访问了浏览器专属 API。需要重构组件生命周期。',
    solution: '1. 使用 useIsClient hook 检测客户端环境\n2. 延迟加载浏览器相关代码\n3. 优化组件渲染性能',
    price: 520,
    deliveryTime: '6',
    deliveryTimeLabel: '6小时内',
    isPro: false
  }
];

const OrderDetail = ({ request, onBack, onSelectExpert }: { request: Request, onBack: () => void, onSelectExpert?: (expertBid: any) => void }) => {
  const [isProjectInfoExpanded, setIsProjectInfoExpanded] = useState(false);
  const [expertBids, setExpertBids] = useState<any[]>([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [selectedBid, setSelectedBid] = useState<any>(null);

  // 如果订单状态是 pending_quote，加载专家报价
  useEffect(() => {
    if (!request) return;
    if (request.status === 'pending_quote') {
      setLoadingBids(true);
      // 模拟渐进式加载专家报价
      let index = 0;
      const interval = setInterval(() => {
        if (index < MOCK_EXPERT_BIDS.length) {
          setExpertBids(prev => [...prev, MOCK_EXPERT_BIDS[index]]);
          index++;
        } else {
          clearInterval(interval);
          setLoadingBids(false);
        }
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [request?.status]);

  if (!request) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto text-center">
        <p className="text-slate-500">加载中...</p>
      </div>
    );
  }

  const expert = request.expertId ? MOCK_EXPERTS.find(e => e.id === request.expertId) : null;

  // 处理选择专家
  const handleSelectExpert = () => {
    if (selectedBid && onSelectExpert) {
      onSelectExpert(selectedBid);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm mb-8 transition-colors">
        <ChevronRight className="w-4 h-4 rotate-180" /> 返回控制台
      </button>

      {/* 选择专家后显示专家信息卡片 - 放在最上方 */}
      {request.status !== 'pending_quote' && expert && (
        <div className="mb-8 bg-white p-6 rounded-2xl border border-slate-200 vibe-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={expert.avatar} className="w-16 h-16 rounded-xl" referrerPolicy="no-referrer" />
                {expert.isPro && (
                  <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-950 text-[10px] font-black px-1.5 py-0.5 rounded-md border-2 border-white shadow-sm">
                    PRO
                  </div>
                )}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  {expert.name}
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                  <Star className="w-4 h-4 fill-current" /> {expert.rating}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {expert.skills.slice(0, 3).map(s => <span key={s} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">{s}</span>)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-vibe-primary">¥{request.price}</div>
              <div className="text-xs text-slate-400">服务报价</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* 项目标题和状态 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 vibe-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-slate-900">{request.title}</h2>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                request.status === 'pending_quote' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                request.status === 'in_service' ? 'bg-vibe-accent/10 text-vibe-accent border-vibe-accent/20' :
                request.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {request.status === 'pending_quote' ? '等待选择专家' :
                 request.status === 'in_service' ? '服务中' :
                 request.status === 'completed' ? '已完成' : '处理中'}
              </span>
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {request.category && (
                <span className="px-3 py-1 bg-vibe-primary text-white text-xs font-bold rounded-full">
                  {request.category}
                </span>
              )}
              {request.subCategory && (
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                  {request.subCategory}
                </span>
              )}
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                {request.urgency === 'urgent' ? '加急' : '普通'}
              </span>
            </div>

            {/* 项目信息 - 可展开收起 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setIsProjectInfoExpanded(!isProjectInfoExpanded)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span className="font-bold text-slate-700">项目信息</span>
                <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isProjectInfoExpanded ? 'rotate-90' : ''}`} />
              </button>

              <AnimatePresence>
                {isProjectInfoExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 space-y-6">
                      {/* 问题描述 */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">问题描述</h4>
                        <p className="text-slate-600 leading-relaxed">{request.description}</p>
                      </div>

                      {/* 预期目标 */}
                      {request.expectedOutcome && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">预期目标</h4>
                          <p className="text-slate-600 leading-relaxed">{request.expectedOutcome}</p>
                        </div>
                      )}

                      {/* Git 仓库信息 */}
                      {request.gitUrl && (
                        <div className="p-4 bg-slate-50 rounded-xl">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">代码仓库</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-500">仓库:</span>
                              <a href={request.gitUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-vibe-primary font-bold hover:underline">
                                {request.gitUrl}
                              </a>
                            </div>
                            {request.branch && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500">分支:</span>
                                <span className="text-sm font-bold text-slate-700">{request.branch}</span>
                              </div>
                            )}
                            {request.filePath && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500">相关文件:</span>
                                <span className="text-sm font-bold text-slate-700">{request.filePath}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 项目信息卡片 */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-xl">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">预算</div>
                          <div className="font-bold text-slate-900">{request.budget}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">交付时间</div>
                          <div className="font-bold text-slate-900">{request.deliveryTime}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">紧急程度</div>
                          <div className={`font-bold ${request.urgency === 'urgent' ? 'text-red-500' : 'text-slate-900'}`}>
                            {request.urgency === 'urgent' ? '加急' : '普通'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">提交时间</div>
                          <div className="font-bold text-slate-900">{request.createdAt}</div>
                        </div>
                      </div>

                      {/* 技术栈 */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">技术栈</h4>
                        <div className="flex flex-wrap gap-2">
                          {request.techStack && request.techStack.map(s => (
                            <span key={s} className="px-3 py-1 bg-vibe-accent/10 text-vibe-primary text-xs font-bold rounded-full">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* AI 诊断报告 */}
                      {request.aiDiagnosis && (
                        <div className="bg-gradient-to-br from-vibe-primary to-slate-800 p-6 rounded-xl text-white">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-vibe-accent/20 rounded-lg flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-vibe-accent" />
                            </div>
                            <div>
                              <h3 className="text-lg font-black">AI 诊断报告</h3>
                              <p className="text-xs text-slate-300">基于代码分析生成</p>
                            </div>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div className="p-3 bg-white/10 rounded-lg">
                              <div className="text-xs font-bold text-vibe-accent mb-1">主要问题</div>
                              <p className="text-sm">{request.aiDiagnosis.summary}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 bg-white/10 rounded-lg">
                                <div className="text-xs font-bold text-vibe-accent mb-1">问题类型</div>
                                <div className="flex flex-wrap gap-1">
                                  {request.aiDiagnosis.issues && request.aiDiagnosis.issues.map((issue, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-white/20 rounded text-xs">{issue}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="p-3 bg-white/10 rounded-lg">
                                <div className="text-xs font-bold text-vibe-accent mb-1">严重程度</div>
                                <div className={`text-base font-black ${
                                  request.aiDiagnosis.severity === 'high' ? 'text-red-400' :
                                  request.aiDiagnosis.severity === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                                }`}>
                                  {request.aiDiagnosis.severity === 'high' ? '高' :
                                   request.aiDiagnosis.severity === 'medium' ? '中' : '低'}
                                </div>
                              </div>
                            </div>
                          </div>

                          <button className="w-full py-2.5 bg-vibe-accent text-vibe-primary rounded-lg font-black text-sm hover:bg-vibe-accent/90 transition-all">
                            查看完整报告
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 选择专家页面 - 仅 pending_quote 状态显示 */}
          {request.status === 'pending_quote' && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 vibe-shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-vibe-accent" />
                    选择专家
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {loadingBids ? '专家正在抢单中...' : `已收到 ${expertBids.length} 位专家的解决方案`}
                  </p>
                </div>
                {/* 24小时倒计时 */}
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-lg border border-amber-100">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-bold text-amber-700">23:45:12</span>
                  <span className="text-xs text-amber-600">后截止</span>
                </div>
              </div>

              {/* 加载状态 */}
              {loadingBids && expertBids.length === 0 && (
                <div className="text-center py-12">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-slate-100 border-t-vibe-accent rounded-full"
                    />
                    <Users className="absolute inset-0 m-auto w-6 h-6 text-vibe-accent" />
                  </div>
                  <p className="text-slate-500">等待专家报价中...</p>
                </div>
              )}

              {/* 专家报价列表 */}
              <div className="space-y-4">
                {expertBids.filter(Boolean).map((bid, index) => (
                  <motion.div
                    key={bid?.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => bid && setSelectedBid(bid)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedBid?.id === bid?.id
                        ? 'border-vibe-primary bg-vibe-accent/5'
                        : 'border-slate-200 hover:border-vibe-accent/50 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* 专家头像 */}
                      <div className="relative">
                        <img src={bid?.expertAvatar} alt={bid?.expertName} className="w-14 h-14 rounded-xl object-cover" />
                        {bid?.isPro && (
                          <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-950 text-[10px] font-black px-1.5 py-0.5 rounded-md border-2 border-white">
                            PRO
                          </div>
                        )}
                      </div>

                      {/* 专家信息 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900">{bid?.expertName}</span>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-bold">{bid?.expertRating}</span>
                          </div>
                          <span className="text-xs text-slate-400">({bid?.expertCompletedJobs} 单)</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {bid?.expertSkills?.map((skill: string) => (
                            <span key={skill} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">{skill}</span>
                          ))}
                        </div>

                        {/* 分析和方案 */}
                        <div className="space-y-2 mb-4">
                          <div className="p-3 bg-slate-50 rounded-lg">
                            <div className="text-xs font-bold text-slate-700 mb-1">问题分析</div>
                            <p className="text-sm text-slate-600 line-clamp-2">{bid?.analysis}</p>
                          </div>
                          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                            <div className="text-xs font-bold text-emerald-700 mb-1">解决思路</div>
                            <p className="text-sm text-emerald-600 whitespace-pre-line line-clamp-3">{bid?.solution}</p>
                          </div>
                        </div>

                        {/* 报价和时间 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <span className="text-2xl font-black text-vibe-primary">¥{bid?.price}</span>
                              <span className="text-xs text-slate-400 ml-1">报价</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-600">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-bold">{bid?.deliveryTimeLabel}</span>
                            </div>
                          </div>
                          {selectedBid?.id === bid?.id && (
                            <div className="flex items-center gap-2 text-vibe-primary">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="text-sm font-bold">已选择</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 选择按钮 */}
              {expertBids.length > 0 && (
                <div className="mt-6">
                  <button
                    onClick={handleSelectExpert}
                    disabled={!selectedBid}
                    className="w-full bg-vibe-primary text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:bg-slate-200 disabled:cursor-not-allowed"
                  >
                    {selectedBid ? `确认选择 ${selectedBid.expertName} 并支付 ¥${selectedBid.price}` : '请选择一位专家'}
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-3">
                    24小时内未选择，订单将自动取消，基础咨询费不予退还
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 沟通记录 - 仅在选择专家后显示 */}
          {request.status !== 'pending_quote' && expert && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 vibe-shadow">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-vibe-accent" /> 沟通记录
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <img src={expert.avatar} className="w-10 h-10 rounded-full shrink-0" referrerPolicy="no-referrer" />
                  <div className="bg-slate-100 p-4 rounded-xl rounded-tl-none">
                    <p className="text-sm text-slate-700">您好！我已经分析了您的 Next.js 水合问题。看来您在 SSR 组件中使用了 `window`。我可以为您修复此问题并设置正确的检查逻辑。</p>
                    <span className="text-[10px] font-bold text-slate-400 mt-2 block">上午 10:45</span>
                  </div>
                </div>
                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-10 h-10 bg-vibe-primary rounded-xl flex items-center justify-center text-white font-black shrink-0">我</div>
                  <div className="bg-vibe-primary p-4 rounded-xl rounded-tr-none text-white shadow-lg shadow-vibe-primary/10">
                    <p className="text-sm">听起来完全正确。我当时正试图获取屏幕宽度以实现响应式组件。那我们开始吧！</p>
                    <span className="text-[10px] font-black text-white/30 mt-2 block uppercase tracking-widest">上午 10:52</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <input type="text" placeholder="输入消息..." className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-vibe-accent font-medium" />
                <button className="bg-vibe-primary text-white p-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-vibe-primary/20">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* 等待专家时的提示 */}
          {request.status === 'pending_quote' && !expert && (
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">等待专家报价</h3>
                  <p className="text-sm text-amber-700">最多10位专家可参与抢单，您可以在24小时内选择最合适的方案。</p>
                </div>
              </div>
            </div>
          )}

          {/* 专业担保流程 - 仅在选择专家后显示 */}
          {request.status !== 'pending_quote' && (
            <div className="bg-slate-900 p-8 rounded-2xl text-white overflow-hidden relative vibe-shadow border border-slate-800">
              <h3 className="text-lg font-bold mb-6 relative z-10">专业担保流程</h3>
              <div className="space-y-5 relative z-10">
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/50">步骤 1</div>
                    <div className="font-bold text-sm">基础咨询</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/50">步骤 2</div>
                    <div className="font-bold text-sm">专家分析并报价</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/50">步骤 3</div>
                    <div className="font-bold text-sm">选择专家并支付费用（平台托管）</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${request.status === 'in_service' ? 'bg-vibe-accent animate-pulse' : request.status === 'completed' ? 'bg-emerald-500' : 'bg-white/20'}`}>
                    {request.status === 'in_service' ? <Clock className="w-4 h-4" /> : request.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-white/40" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/50">步骤 4</div>
                    <div className="font-bold text-sm">开始 VibeFello 服务</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${request.status === 'completed' ? 'bg-emerald-500' : 'bg-white/20'}`}>
                    {request.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-white/40" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/50">步骤 5</div>
                    <div className="font-bold text-sm">专家完成服务待确认</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${request.status === 'completed' ? 'bg-emerald-500' : 'bg-white/20'}`}>
                    {request.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-white/40" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/50">步骤 6</div>
                    <div className="font-bold text-sm">用户验收服务并确认</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${request.status === 'completed' ? 'bg-emerald-500' : 'bg-white/20'}`}>
                    {request.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-white/40" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/50">步骤 7</div>
                    <div className="font-bold text-sm">结算资金给专家</div>
                  </div>
                </div>
              </div>
              <div className="mt-8 p-4 bg-white/10 rounded-xl border border-white/10 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">平台全程担保</div>
                    <div className="text-xs text-white/60">资金安全 · 服务质量 · 售后保障</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-vibe-accent/10 blur-3xl rounded-full -mb-20 -mr-20"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'marketplace' | 'pricing' | 'dashboard' | 'post' | 'admin'>('home');
  const [requests, setRequests] = useState<Request[]>([]);
  const [matching, setMatching] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  
  // New States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'expert' | null>(null);
  const [userTier, setUserTier] = useState<UserTier>('free');
  const [remainingAiDiagnosis, setRemainingAiDiagnosis] = useState(1); // 剩余AI诊断次数
  const [remainingConsults, setRemainingConsults] = useState(1); // 剩余专家咨询次数
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [defaultLoginRole, setDefaultLoginRole] = useState<'user' | 'expert'>('user');
  const [showMarketplaceModal, setShowMarketplaceModal] = useState(false);
  const [selectedMarketplaceReq, setSelectedMarketplaceReq] = useState<any>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  const [workspaceRequest, setWorkspaceRequest] = useState<Request | null>(null);

  // Expert Onboarding States
  const [expertApplication, setExpertApplication] = useState<Partial<ExpertApplication> | null>(null);
  const [expertVerificationStatus, setExpertVerificationStatus] = useState<ExpertVerificationStatus>('pending');
  const [showExpertOnboarding, setShowExpertOnboarding] = useState(false);

  const handlePostComplete = (data: Partial<Request>) => {
    setMatching(true);
    const newReq: Request = {
      id: `r${Date.now()}`,
      title: data.title || 'Untitled',
      description: data.description || '',
      expectedOutcome: data.expectedOutcome || '',
      budget: data.budget || '¥100 - ¥300',
      techStack: data.techStack || [],
      deliveryTime: data.deliveryTime || '24 小时内',
      status: 'pending_quote',
      createdAt: new Date().toISOString().split('T')[0],
      // 新订单不设置 expertId，等待用户选择
      consultationFeePaid: true,
      category: data.category || '',
      subCategory: data.subCategory || '',
      urgency: data.urgency || 'normal',
      gitUrl: data.gitUrl || '',
      branch: data.branch || '',
      filePath: data.filePath || '',
      aiDiagnosis: data.aiDiagnosis
    };
    setRequests([newReq, ...requests]);
  };

  const finishMatching = () => {
    setMatching(false);
    setActiveTab('dashboard');
  };

  const handleLogin = (role: 'user' | 'expert') => {
    setIsLoggedIn(true);
    setUserRole(role);
    setShowLoginModal(false);
    
    // Check expert application status
    if (role === 'expert') {
      const savedApplication = localStorage.getItem('expert_application');
      if (savedApplication) {
        const parsed = JSON.parse(savedApplication);
        setExpertApplication(parsed);
        setExpertVerificationStatus(parsed.status || 'pending');
        
        // If approved, go to dashboard
        if (parsed.status === 'approved') {
          setActiveTab('dashboard');
          return;
        }
        // If submitted but not approved, go to dashboard (will show pending status)
        if (parsed.status === 'submitted') {
          setActiveTab('dashboard');
          return;
        }
        // If rejected, show onboarding to resubmit
        if (parsed.status === 'rejected') {
          setShowExpertOnboarding(true);
          return;
        }
      } else {
        // New expert, go to dashboard first, they can apply from there
        setExpertVerificationStatus('pending');
        setActiveTab('dashboard');
        return;
      }
    }
    
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setActiveTab('home');
  };

  const handleMarketplaceClick = (req: any) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setSelectedMarketplaceReq(req);
    setShowMarketplaceModal(true);
  };

  const handleClaimOrder = async (req: any, bidData?: any) => {
    setIsClaiming(true);
    setShowMarketplaceModal(false);

    // 模拟抢单过程
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsClaiming(false);
    setClaimSuccess(true);

    // 模拟将订单添加到我的项目中
    const newProject: Request = {
      ...req,
      id: `claimed-${Date.now()}`,
      status: 'pending_quote', // 抢单后等待用户选择
      createdAt: new Date().toISOString().split('T')[0],
      expertId: 'e1',
      consultationFeePaid: true,
      // 保存专家的抢单方案
      expertBid: bidData
    };
    setRequests([newProject, ...requests]);
  };

  const handleTabChange = (tab: string) => {
    if ((tab === 'post' || tab === 'dashboard') && !isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    // 切换 tab 时重置详情页状态
    setSelectedRequest(null);
    setWorkspaceRequest(null);
    setActiveTab(tab);
  };

  // 检测是否是管理后台路径
  const isAdminPath = window.location.pathname === '/admin';
  
  // 如果是管理后台路径，直接显示管理后台
  if (isAdminPath) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        userTier={userTier}
        onLoginClick={(role) => {
          if (role) setDefaultLoginRole(role);
          setShowLoginModal(true);
        }}
        onLogout={handleLogout}
      />
      
      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HomePage 
              onStart={() => handleTabChange('post')} 
              onViewPricing={() => handleTabChange('pricing')} 
              onMarketplaceClick={handleMarketplaceClick}
              onViewMore={() => {
                if (!isLoggedIn) {
                  setShowLoginModal(true);
                } else {
                  handleTabChange('dashboard');
                }
              }}
              onExpertApply={() => {
                if (!isLoggedIn) {
                  // Not logged in: show expert login modal
                  setDefaultLoginRole('expert');
                  setShowLoginModal(true);
                } else if (userRole === 'expert') {
                  // Expert logged in: go to dashboard
                  handleTabChange('dashboard');
                } else {
                  // User logged in: show pricing for upgrade
                  handleTabChange('pricing');
                }
              }}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              expertVerificationStatus={expertVerificationStatus}
            />
          </motion.div>
        )}

        {activeTab === 'pricing' && (
          <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PricingPage 
              userRole={userRole}
              userTier={userTier}
              onUpgrade={(tier) => {
                setUserTier(tier);
                setRemainingAiDiagnosis(USER_TIER_CONFIG[tier].aiDiagnosisLimit);
              }}
            />
          </motion.div>
        )}
        
        {activeTab === 'post' && (
          <motion.div key="post" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PostRequestFlow 
              onComplete={handlePostComplete} 
              onUpgrade={(tier) => {
                setUserTier(tier);
                setRemainingAiDiagnosis(USER_TIER_CONFIG[tier].aiDiagnosisLimit);
              }}
              remainingAiDiagnosis={remainingAiDiagnosis}
              onUseAiDiagnosis={() => setRemainingAiDiagnosis(prev => Math.max(0, prev - 1))}
            />
          </motion.div>
        )}

        {activeTab === 'marketplace' && (
          <motion.div key="marketplace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Marketplace 
              onSelect={handleMarketplaceClick} 
              isExpert={userRole === 'expert'}
              userTier={userTier}
            />
          </motion.div>
        )}

        {activeTab === 'dashboard' && !selectedRequest && !workspaceRequest && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {userRole === 'expert' ? (
              <ExpertDashboard 
                requests={requests} 
                onSelect={handleMarketplaceClick} 
                onEnterWorkspace={(r) => setWorkspaceRequest(r)}
                onTabChange={setActiveTab}
                verificationStatus={expertVerificationStatus}
                onStartApplication={() => setShowExpertOnboarding(true)}
              />
            ) : (
              <DashboardPage
                requests={requests}
                onSelect={(r) => setSelectedRequest(r)}
                onPostRequest={() => setActiveTab('post')}
                onUpgrade={() => setActiveTab('pricing')}
                userTier={userTier}
                remainingConsults={remainingConsults}
              />
            )}
          </motion.div>
        )}

        {workspaceRequest && (
          <motion.div key="workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Workspace 
              request={workspaceRequest} 
              onBack={() => setWorkspaceRequest(null)} 
            />
          </motion.div>
        )}

        {selectedRequest && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <OrderDetailPage
              request={selectedRequest}
              onBack={() => setSelectedRequest(null)}
              onSelectExpert={(expertBid) => {
                // 更新订单状态为 in_service，并设置专家信息
                const updatedRequest = {
                  ...selectedRequest,
                  status: 'in_service' as OrderStatus,
                  expertId: expertBid.expertId,
                  price: expertBid.price,
                  deliveryTime: expertBid.deliveryTimeLabel
                };
                setRequests(prev => prev.map(r => r.id === selectedRequest.id ? updatedRequest : r));
                setSelectedRequest(updatedRequest);
              }}
            />
          </motion.div>
        )}

      </AnimatePresence>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        role={defaultLoginRole}
      />

      <MarketplaceDetailModal 
        isOpen={showMarketplaceModal} 
        onClose={() => setShowMarketplaceModal(false)} 
        request={selectedMarketplaceReq}
        isExpert={userRole === 'expert'}
        onClaim={handleClaimOrder}
        onUpgrade={() => {
          setShowMarketplaceModal(false);
          setActiveTab('pricing');
        }}
      />

      {matching && <MatchingScreen onFinish={finishMatching} />}
      
      {isClaiming && <ClaimingScreen />}
      
      <ClaimSuccessModal 
        isOpen={claimSuccess} 
        onClose={() => setClaimSuccess(false)} 
        onGoToDashboard={() => {
          setClaimSuccess(false);
          setActiveTab('dashboard');
          // 自动选中第一个（刚刚抢到的）订单
          setSelectedRequest(requests[0]);
        }}
      />

      {/* Expert Onboarding Flow */}
      <ExpertOnboardingFlow
        isOpen={showExpertOnboarding}
        onClose={() => setShowExpertOnboarding(false)}
        onComplete={(application) => {
          // Save application with pending status
          const fullApplication: Partial<ExpertApplication> = {
            ...application,
            id: `app-${Date.now()}`,
            userId: 'current-user',
            status: 'submitted',
            submittedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          setExpertApplication(fullApplication);
          setExpertVerificationStatus('submitted');
          localStorage.setItem('expert_application', JSON.stringify(fullApplication));
          
          // Close onboarding and go to dashboard
          setShowExpertOnboarding(false);
          setActiveTab('dashboard');
          
          // Show success message (you can add a toast here)
          alert('入驻申请已提交！我们将在1-2个工作日内完成审核。');
        }}
      />

      <footer className="py-12 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <VibeLogo className="w-6 h-6" />
          </div>
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">服务条款</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">隐私政策</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">联系我们</a>
          </div>
          <div className="text-sm text-slate-400 font-medium">
            © 2026 VibeFello. 保留所有权利。
          </div>
        </div>
      </footer>
    </div>
  );
}
