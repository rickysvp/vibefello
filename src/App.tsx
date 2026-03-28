/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  Settings
} from 'lucide-react';
import { Request, Expert, MOCK_EXPERTS, MOCK_REQUESTS, MOCK_MARKETPLACE, OrderStatus } from './types';

// --- Components ---

const VibeLogo = ({ className = "w-9 h-9", iconOnly = false }: { className?: string, iconOnly?: boolean }) => (
  <div className={`flex items-center gap-3 ${!iconOnly ? 'group cursor-pointer' : ''}`}>
    <div className={`${className} bg-vibe-primary rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg shadow-vibe-primary/20 border border-slate-800`}>
      <div className="absolute inset-0 bg-gradient-to-br from-vibe-accent/20 to-transparent opacity-50" />
      <Zap className="text-vibe-accent w-1/2 h-1/2 fill-current relative z-10" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-vibe-accent/20 blur-sm rounded-full" />
    </div>
    {!iconOnly && (
      <span className="font-black text-xl tracking-tighter text-vibe-primary vibe-glow-text">
        VIBE<span className="text-vibe-accent">FELLO</span>
      </span>
    )}
  </div>
);

const LoginModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean, onClose: () => void, onLogin: (role: 'user' | 'expert') => void }) => {
  const [step, setStep] = useState<1 | 2>(1);
  
  if (!isOpen) return null;

  const handleSocialLogin = () => {
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white w-full max-w-md rounded-2xl p-10 vibe-shadow border border-slate-100 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-vibe-primary via-vibe-accent to-vibe-primary" />
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors">
          <X className="w-6 h-6" />
        </button>
        
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="text-center mb-10">
                <div className="flex justify-center mb-6">
                  <VibeLogo className="w-16 h-16" iconOnly />
                </div>
                <h2 className="text-2xl font-black text-vibe-primary mb-2 tracking-tight uppercase">登录 VIBE<span className="text-vibe-accent">FELLO</span></h2>
                <p className="text-slate-500 font-medium">专业技术救援，让 Vibe Coding 落地</p>
              </div>

              <div className="space-y-3 mb-8">
                <button 
                  onClick={handleSocialLogin}
                  className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20"
                >
                  <Github className="w-5 h-5" />
                  使用 GitHub 登录
                </button>
                <button 
                  onClick={handleSocialLogin}
                  className="w-full py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                >
                  <Mail className="w-5 h-5 text-red-500" />
                  使用 Google 账号登录
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-vibe-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <User className="w-8 h-8 text-vibe-accent" />
                </div>
                <h2 className="text-2xl font-black text-vibe-primary mb-2 tracking-tight uppercase">选择您的身份</h2>
                <p className="text-slate-500 font-medium">根据您的需求选择进入方式</p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => onLogin('user')}
                  className="w-full py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold hover:border-vibe-accent hover:bg-white transition-all flex items-center justify-center gap-3 group"
                >
                  我是普通用户 (发布需求)
                </button>
                <button 
                  onClick={() => onLogin('expert')}
                  className="w-full py-4 rounded-xl bg-vibe-accent/10 border border-vibe-accent/20 text-vibe-primary font-bold hover:bg-vibe-accent/20 transition-all flex items-center justify-center gap-3"
                >
                  我是技术专家 (接单赚钱)
                </button>
              </div>
              
              <button 
                onClick={() => setStep(1)}
                className="w-full mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-vibe-primary transition-colors"
              >
                返回登录方式
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-10 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          登录即表示您同意我们的 <span className="text-vibe-accent hover:underline cursor-pointer">服务条款</span>
        </p>
      </motion.div>
    </div>
  );
};

const MarketplaceDetailModal = ({ isOpen, onClose, request, isExpert, onClaim, onUpgrade }: { isOpen: boolean, onClose: () => void, request: any, isExpert: boolean, onClaim: (r: any) => void, onUpgrade: () => void }) => {
  if (!isOpen || !request) return null;
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
        className="relative bg-white w-full max-w-2xl rounded-2xl p-10 vibe-shadow border border-slate-100 overflow-hidden"
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
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-vibe-accent border border-sky-100">
                {request.status}
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" /> {request.time}
              </span>
            </div>
            <h2 className="text-3xl font-black text-vibe-primary mb-4 tracking-tight">{request.title}</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {request.tags.map((tag: string) => (
                <span key={tag} className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">#{tag}</span>
              ))}
            </div>
            
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
                onClick={() => onClaim(request)}
                className="flex-1 bg-vibe-primary text-white py-4 rounded-lg font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 fill-vibe-accent text-vibe-accent" /> 立即抢单
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

const Navbar = ({ activeTab, onTabChange, isLoggedIn, userRole, onLoginClick, onLogout }: { activeTab: string, onTabChange: (t: string) => void, isLoggedIn: boolean, userRole: 'user' | 'expert' | null, onLoginClick: () => void, onLogout: () => void }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 z-50 flex items-center justify-between px-8">
      <div onClick={() => onTabChange('home')} className="cursor-pointer">
        <VibeLogo />
      </div>
      
      {isLoggedIn && (
        <div className="hidden md:flex items-center gap-10">
          {[
            { id: 'home', label: '首页' },
            { id: 'dashboard', label: userRole === 'expert' ? '专家控制台' : '我的项目' },
            { id: 'marketplace', label: 'Vibe Request', showOnlyForExpert: true },
            { id: 'post', label: '提交咨询', hideForExpert: true },
            { id: 'pricing', label: userRole === 'expert' ? '订阅计划' : '升级计划' }
          ].filter(tab => {
            if (tab.hideForExpert && userRole === 'expert') return false;
            if (tab.showOnlyForExpert && userRole !== 'expert') return false;
            return true;
          }).map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${
                activeTab === tab.id ? 'text-vibe-primary' : 'text-slate-400 hover:text-vibe-primary'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-vibe-accent"
                />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-6">
        {isLoggedIn ? (
          <>
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-200/60 hover:bg-slate-100 transition-all"
              >
                <div className="w-6 h-6 bg-vibe-primary text-vibe-accent rounded-full flex items-center justify-center font-black text-[10px] border border-slate-800 shadow-sm">
                  {userRole === 'expert' ? 'E' : 'U'}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 hidden sm:inline">
                  {userRole === 'expert' ? 'Expert' : 'Member'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-slate-200 vibe-shadow overflow-hidden py-2"
                  >
                    <div className="px-4 py-3 border-b border-slate-50 mb-2">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">当前账户</div>
                      <div className="text-xs font-bold text-vibe-primary truncate">rickysevp@gmail.com</div>
                    </div>
                    
                    <button className="w-full px-4 py-2.5 flex items-center gap-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                      <User className="w-4 h-4" /> 个人资料
                    </button>
                    <button className="w-full px-4 py-2.5 flex items-center gap-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                      <Settings className="w-4 h-4" /> 账号设置
                    </button>
                    <div className="h-px bg-slate-50 my-2 mx-2"></div>
                    <button 
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> 退出登录
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {userRole !== 'expert' && (
              <button 
                onClick={() => onTabChange('post')}
                className="bg-vibe-primary text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-vibe-primary/10"
              >
                获取帮助
              </button>
            )}
          </>
        ) : (
          <button 
            onClick={onLoginClick}
            className="bg-vibe-primary text-white px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-vibe-primary/10"
          >
            登录 / 注册
          </button>
        )}
      </div>
    </nav>
  );
};

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

const Home = ({ onStart, onViewPricing, onMarketplaceClick, onViewMore, isLoggedIn, userRole }: { onStart: () => void, onViewPricing: () => void, onMarketplaceClick: (req: any) => void, onViewMore: () => void, isLoggedIn: boolean, userRole: 'user' | 'expert' | null }) => (
  <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vibe-primary text-white mb-8 border border-slate-700 shadow-xl shadow-vibe-primary/10">
          <Zap className="w-3.5 h-3.5 text-vibe-accent fill-current" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Professional Technical Rescue</span>
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
            onClick={onViewPricing}
            className={`w-full sm:w-auto px-12 py-6 rounded-2xl text-lg font-black uppercase tracking-widest transition-all ${
              userRole === 'expert' 
                ? 'bg-vibe-primary text-white hover:bg-slate-800 vibe-shadow' 
                : 'bg-white text-vibe-primary border-2 border-vibe-primary hover:bg-slate-50'
            }`}
          >
            {!isLoggedIn ? '专家入驻' : (userRole === 'expert' ? '订阅计划' : '升级计划')}
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
            a: "如果专家在诊断阶段确认无法解决，基础服务费将全额退还。如果进入正式服务阶段，资金由平台托管，直到您确认交付，确保您的资金安全。"
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

const Pricing = ({ userRole }: { userRole: 'user' | 'expert' | null }) => {
  const expertPlans = [
    { tier: "NOOB", price: "$19/月", limit: "4 单/月", features: ["基础专家标识", "标准结算周期", "社区支持"] },
    { tier: "PRO", price: "$69/月", limit: "20 单/月", features: ["PRO 专家勋章", "优先推荐", "快速结算周期"], active: true },
    { tier: "MASTER", price: "$299/月", limit: "无限接单", features: ["MASTER 顶级勋章", "专属客服", "即时结算", "首页推荐"] }
  ];

  const userPlans = [
    { tier: "Free", price: "$9.9/次", limit: "按次支付", features: ["基础咨询服务", "标准响应速度", "社区支持"] },
    { tier: "Dev", price: "$39/月", limit: "10 次/月", features: ["优先响应", "技术文档支持", "专属咨询通道"], active: true },
    { tier: "Premium", price: "$199/月", limit: "无限次咨询", features: ["即时响应", "架构设计建议", "代码深度审查", "1对1专属专家"] }
  ];

  const isExpertView = userRole === 'expert';
  const plans = isExpertView ? expertPlans : userPlans;

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">
          {isExpertView ? "专家订阅计划" : "用户咨询计划"}
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto">
          {isExpertView 
            ? "选择适合您的接单等级，开启专业变现之旅。" 
            : "选择最适合您的咨询方案，让技术难题迎刃而解。"}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p, i) => (
          <div key={i} className={`p-10 rounded-2xl border ${p.active ? 'border-vibe-accent ring-4 ring-vibe-accent/10 vibe-shadow' : 'border-slate-200 vibe-card-shadow'} bg-white relative overflow-hidden`}>
            {p.active && <div className="absolute top-0 right-0 bg-vibe-accent text-vibe-primary text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">最受欢迎</div>}
            <div className="text-[10px] font-black text-vibe-accent uppercase tracking-[0.2em] mb-4">{p.tier}</div>
            <div className="text-4xl font-black text-vibe-primary mb-2">{p.price}</div>
            <div className="text-sm font-bold text-slate-400 mb-8">{p.limit}</div>
            <ul className="space-y-4 mb-10">
              {p.features.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all ${p.active ? 'bg-vibe-primary text-white hover:bg-slate-800 shadow-lg shadow-vibe-primary/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {isExpertView ? "立即订阅" : "立即升级"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 p-12 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-vibe-accent/10 blur-3xl rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h3 className="text-3xl font-black mb-6 tracking-tight">平台资金担保服务</h3>
            <p className="text-slate-400 font-medium leading-relaxed mb-8">
              VibeFello 提供全方位的资金担保。用户支付的费用将先由平台托管，只有在您确认满意并点击“确认支付”后，资金才会结算给专家。
              <br /><br />
              <span className="text-vibe-accent">最终由用户决定是否付费，确保每一分钱都花在刀刃上。</span>
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span className="text-sm font-bold">资金托管</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span className="text-sm font-bold">满意后支付</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span className="text-sm font-bold">争议仲裁</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
              <div className="text-[10px] font-black text-vibe-accent uppercase tracking-widest mb-4">服务流程</div>
              <div className="space-y-4">
                {[
                  "发布需求并托管资金",
                  "专家接单并开始工作",
                  "用户验收交付成果",
                  "用户确认并释放资金"
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-vibe-accent text-vibe-primary flex items-center justify-center text-[10px] font-black">{i+1}</div>
                    <span className="text-sm font-bold">{step}</span>
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

const PostRequestFlow = ({ onComplete }: { onComplete: (req: Partial<Request>) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '¥300 - ¥600',
    techStack: [] as string[],
    deliveryTime: '24 小时内'
  });

  const techOptions = ['React', 'Next.js', 'Python', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Firebase'];

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const toggleTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech) 
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }));
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
              </div>
              {s < 5 && <div className={`h-1 flex-1 mx-2 rounded-full ${step > s ? 'bg-indigo-600' : 'bg-slate-100'}`}></div>}
            </div>
          ))}
        </div>
        <h2 className="text-3xl font-bold text-slate-900">
          {step === 1 && "您在构建什么？"}
          {step === 2 && "您的技术栈是什么？"}
          {step === 3 && "预算与时间"}
          {step === 4 && "支付基础咨询费"}
          {step === 5 && "确认并发布"}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white p-10 rounded-2xl border border-slate-200 vibe-shadow"
        >
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">项目标题</label>
                <input 
                  type="text" 
                  placeholder="例如：修复 Next.js 中的水合错误"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-vibe-accent focus:border-transparent outline-none transition-all font-medium"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">问题描述</label>
                <textarea 
                  rows={5}
                  placeholder="描述错误或您想要实现的目标..."
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-vibe-accent focus:border-transparent outline-none transition-all resize-none font-medium"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-3">
              {techOptions.map(tech => (
                <button
                  key={tech}
                  onClick={() => toggleTech(tech)}
                  className={`px-4 py-4 rounded-xl border text-xs font-black uppercase tracking-widest transition-all ${
                    formData.techStack.includes(tech)
                      ? 'bg-vibe-primary border-vibe-primary text-white shadow-lg shadow-vibe-primary/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-vibe-accent/50'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">预算范围</label>
                <div className="grid grid-cols-1 gap-3">
                  {['¥300 - ¥600', '¥600 - ¥2000', '¥2000 - ¥6000', '自定义报价'].map(b => (
                    <button
                      key={b}
                      onClick={() => setFormData({...formData, budget: b})}
                      className={`px-5 py-5 rounded-xl border text-left font-black transition-all ${
                        formData.budget === b
                          ? 'bg-vibe-accent/5 border-vibe-accent text-vibe-primary'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-vibe-accent/50'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">期望交付时间</label>
                <select 
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-vibe-accent font-bold"
                  value={formData.deliveryTime}
                  onChange={e => setFormData({...formData, deliveryTime: e.target.value})}
                >
                  <option>24 小时内</option>
                  <option>3 天内</option>
                  <option>1 周内</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-vibe-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-vibe-accent/20">
                <Wallet className="w-10 h-10 text-vibe-accent" />
              </div>
              <h3 className="text-2xl font-black text-vibe-primary mb-2 tracking-tight">基础咨询费: ¥49.00</h3>
              <p className="text-sm text-slate-500 mb-10 font-medium">支付咨询费后，您的需求将优先推送给专家，并获得初步诊断方案。</p>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">支付方式</span>
                  <span className="text-[10px] font-black text-vibe-accent uppercase tracking-widest">微信/支付宝</span>
                </div>
                <div className="w-full h-40 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-300 font-black uppercase tracking-[0.2em] text-xs">
                  [ 模拟支付二维码 ]
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="bg-vibe-primary p-8 rounded-2xl space-y-6 border border-slate-800 shadow-xl shadow-vibe-primary/20">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">项目标题</div>
                  <div className="text-xl font-black text-white tracking-tight">{formData.title || '未命名项目'}</div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">咨询费状态</div>
                    <div className="text-lg font-black text-emerald-400">已支付 (¥49.00)</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">预算</div>
                    <div className="text-lg font-black text-vibe-accent">{formData.budget}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-vibe-accent/5 rounded-2xl border border-vibe-accent/20">
                <ShieldCheck className="w-6 h-6 text-vibe-accent shrink-0" />
                <p className="text-xs text-vibe-primary font-bold leading-relaxed">
                  VibeFello 将作为第三方担保，确保您的资金安全和专家的交付质量。
                </p>
              </div>
            </div>
          )}

          <div className="mt-12 flex gap-4">
            {step > 1 && (
              <button 
                onClick={prevStep}
                className="flex-1 px-6 py-4 rounded-xl border border-slate-200 font-black uppercase tracking-widest text-slate-400 hover:text-vibe-primary hover:bg-slate-50 transition-all"
              >
                返回
              </button>
            )}
            <button 
              onClick={step === 5 ? () => onComplete(formData) : nextStep}
              className="flex-[2] bg-vibe-primary text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all vibe-shadow shadow-xl shadow-vibe-primary/20"
            >
              {step === 4 ? '确认支付' : step === 5 ? '发布并寻找专家' : '继续'}
            </button>
          </div>
        </motion.div>
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

const Marketplace = ({ onSelect }: { onSelect: (r: any) => void }) => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Vibe Request 大厅</h2>
          <p className="text-slate-500 font-medium">浏览最新的技术救援需求，发挥您的专业技能并获得丰厚报酬。</p>
        </div>
        <div className="flex gap-2">
          {['全部', '高优', '最新', '高额'].map(f => (
            <button key={f} className="px-4 py-2 rounded-xl bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200/60">{f}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {MOCK_MARKETPLACE.map((req) => (
          <div 
            key={req.id}
            onClick={() => onSelect(req)}
            className="bg-white p-8 rounded-2xl border border-slate-200 vibe-card-shadow hover:border-vibe-accent transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider border border-indigo-100">新需求</span>
                <span className="text-xs text-slate-400 font-medium">{req.time}</span>
              </div>
              <h4 className="text-xl font-black text-vibe-primary group-hover:text-vibe-accent transition-colors tracking-tight mb-3">{req.title}</h4>
              <div className="flex flex-wrap gap-2">
                {req.tags.map(s => <span key={s} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{s}</span>)}
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <div className="text-2xl font-black text-slate-900">{req.budget}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">预估报酬</div>
              </div>
              <button className="bg-vibe-primary text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-vibe-primary/10">
                立即抢单
              </button>
            </div>
          </div>
        ))}
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

const ExpertDashboard = ({ requests, onSelect, onEnterWorkspace, onTabChange }: { requests: Request[], onSelect: (r: Request) => void, onEnterWorkspace: (r: Request) => void, onTabChange: (tab: string) => void }) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'ongoing' | 'completed' | 'subscription' | 'earnings'>('overview');

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

const Dashboard = ({ requests, onSelect }: { requests: Request[], onSelect: (r: Request) => void }) => {
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
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">我的需求</h2>
          <p className="text-slate-500">跟踪您的活跃帮助会话和付款状态。</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">托管余额</div>
              <div className="font-bold text-slate-900">¥3250.00</div>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

const OrderDetail = ({ request, onBack }: { request: Request, onBack: () => void }) => {
  const expert = MOCK_EXPERTS.find(e => e.id === request.expertId) || MOCK_EXPERTS[0];

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm mb-8 transition-colors">
        <ChevronRight className="w-4 h-4 rotate-180" /> 返回控制台
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 vibe-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-slate-900">{request.title}</h2>
              <span className="bg-vibe-accent/10 text-vibe-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-vibe-accent/20">
                {request.status === 'in_service' ? '服务中' : request.status === 'completed' ? '已完成' : '处理中'}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-8">{request.description}</p>
            
            <div className="grid grid-cols-3 gap-4 p-6 bg-slate-50 rounded-xl">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">预算</div>
                <div className="font-bold text-slate-900">{request.price ? `¥${request.price}` : request.budget}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">交付时间</div>
                <div className="font-bold text-slate-900">{request.deliveryTime}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">技术栈</div>
                <div className="flex gap-1">
                  {request.techStack.map(s => <span key={s} className="text-[10px] font-black text-vibe-accent uppercase tracking-widest">{s}</span>)}
                </div>
              </div>
            </div>
          </div>

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
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 vibe-shadow">
            <h3 className="text-lg font-bold mb-6">分配的专家</h3>
            <div className="flex items-center gap-4 mb-6">
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
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">{expert.bio}</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {expert.skills.map(s => <span key={s} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{s}</span>)}
            </div>
            <button className="w-full py-3 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-all">
              查看个人资料
            </button>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl text-white overflow-hidden relative vibe-shadow border border-slate-800">
            <h3 className="text-lg font-bold mb-6 relative z-10">专业担保流程</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-white/50">步骤 1</div>
                  <div className="font-bold text-sm">基础咨询费已支付 (¥49.00)</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-white/50">步骤 2</div>
                  <div className="font-bold text-sm">专家已报价并托管全额资金</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${request.status === 'in_service' ? 'bg-vibe-accent animate-pulse' : 'bg-white/20'}`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-white/50">步骤 3</div>
                  <div className="font-bold text-sm">服务进行中</div>
                </div>
              </div>
            </div>
            <div className="mt-10 p-4 bg-white/10 rounded-xl border border-white/10 relative z-10">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-white/60">平台担保费 (10%)</span>
                <span>-¥50.00</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span>专家预计收入</span>
                <span className="text-emerald-400">¥450.00</span>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 text-[10px] text-white/40 leading-tight">
                * 该专家为 {expert.tier} 会员，享受 {expert.feeDiscount * 100}% 手续费减免。
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-vibe-accent/10 blur-3xl rounded-full -mb-20 -mr-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [requests, setRequests] = useState<Request[]>(MOCK_REQUESTS);
  const [matching, setMatching] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  
  // New States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'expert' | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMarketplaceModal, setShowMarketplaceModal] = useState(false);
  const [selectedMarketplaceReq, setSelectedMarketplaceReq] = useState<any>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  const [workspaceRequest, setWorkspaceRequest] = useState<Request | null>(null);

  const handlePostComplete = (data: Partial<Request>) => {
    setMatching(true);
    const newReq: Request = {
      id: `r${Date.now()}`,
      title: data.title || 'Untitled',
      description: data.description || '',
      budget: data.budget || '$50 - $100',
      techStack: data.techStack || [],
      deliveryTime: data.deliveryTime || '24 hours',
      status: 'pending_quote',
      createdAt: new Date().toISOString().split('T')[0],
      expertId: 'e1',
      price: 75,
      consultationFeePaid: true
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

  const handleClaimOrder = async (req: any) => {
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
      status: 'in_service',
      createdAt: new Date().toISOString().split('T')[0],
      expertId: 'e1',
      consultationFeePaid: true
    };
    setRequests([newProject, ...requests]);
  };

  const handleTabChange = (tab: string) => {
    if ((tab === 'post' || tab === 'dashboard') && !isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />
      
      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Home 
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
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          </motion.div>
        )}

        {activeTab === 'pricing' && (
          <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Pricing userRole={userRole} />
          </motion.div>
        )}
        
        {activeTab === 'post' && (
          <motion.div key="post" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PostRequestFlow onComplete={handlePostComplete} />
          </motion.div>
        )}

        {activeTab === 'marketplace' && (
          <motion.div key="marketplace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Marketplace onSelect={handleMarketplaceClick} />
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
              />
            ) : (
              <Dashboard 
                requests={requests} 
                onSelect={(r) => setSelectedRequest(r)} 
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
            <OrderDetail 
              request={selectedRequest} 
              onBack={() => setSelectedRequest(null)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={handleLogin}
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
            © 2024 VibeFello. 保留所有权利。
          </div>
        </div>
      </footer>
    </div>
  );
}
