import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Clock, MessageSquare, Download, LayoutDashboard,
  PlusCircle, CheckCircle2, ShieldCheck, User, Zap
} from 'lucide-react';
import { Request } from '../types';

interface WorkspaceProps {
  request: Request;
  onBack: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({ request, onBack }) => {
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

export default Workspace;
