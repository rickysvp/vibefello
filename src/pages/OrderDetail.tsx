import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight, Star, Sparkles, Users, Clock,
  CheckCircle2, MessageSquare, ArrowRight
} from 'lucide-react';
import { Request, MOCK_EXPERTS } from '../types';

interface OrderDetailProps {
  request: Request | null;
  onBack: () => void;
  onSelectExpert?: (expertBid: any) => void;
}

const MOCK_EXPERT_BIDS = [
  {
    id: 'bid1',
    expertId: 'e1',
    expertName: '陈老师 (Alex)',
    expertAvatar: 'https://picsum.photos/seed/expert1/100/100',
    expertRating: 4.9,
    expertCompletedJobs: 45,
    expertSkills: ['React', 'Next.js', 'TypeScript'],
    isPro: true,
    price: 2800,
    deliveryTime: 2,
    deliveryTimeLabel: '2天',
    analysis: '这是一个典型的 Next.js SSR 水合问题。您在客户端组件中直接使用了 window 对象，导致服务端渲染时出错。',
    solution: '1. 使用 useEffect 确保只在客户端执行\n2. 添加 typeof window !== "undefined" 检查\n3. 使用动态导入禁用 SSR\n4. 重构响应式逻辑到自定义 Hook'
  },
  {
    id: 'bid2',
    expertName: '米勒 (Sarah)',
    expertAvatar: 'https://picsum.photos/seed/expert2/100/100',
    expertRating: 4.8,
    expertCompletedJobs: 32,
    expertSkills: ['Python', 'FastAPI', 'Docker'],
    isPro: true,
    price: 3200,
    deliveryTime: 1,
    deliveryTimeLabel: '1天',
    analysis: '问题根源在于组件生命周期管理不当。建议在 useEffect 中初始化客户端状态。',
    solution: '我会帮您重构代码，使用 React 最佳实践处理客户端/服务端差异，并提供完整的测试方案。'
  },
  {
    id: 'bid3',
    expertName: '王工程师',
    expertAvatar: 'https://picsum.photos/seed/expert3/100/100',
    expertRating: 4.7,
    expertCompletedJobs: 28,
    expertSkills: ['Vue', 'Node.js', 'AWS'],
    isPro: false,
    price: 2400,
    deliveryTime: 3,
    deliveryTimeLabel: '3天',
    analysis: '水合不匹配是常见问题，主要是服务端和客户端渲染结果不一致导致的。',
    solution: '我将诊断具体的不匹配原因，修复代码并提供预防措施文档。'
  }
];

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; label: string }> = {
  pending_quote: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', label: '等待选择专家' },
  in_service: { bg: 'bg-vibe-accent/10', text: 'text-vibe-accent', border: 'border-vibe-accent/20', label: '服务中' },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', label: '已完成' },
  pending_consultation: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', label: '处理中' }
};

export const OrderDetail: React.FC<OrderDetailProps> = ({ request, onBack, onSelectExpert }) => {
  const [isProjectInfoExpanded, setIsProjectInfoExpanded] = useState(false);
  const [expertBids, setExpertBids] = useState<any[]>([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [selectedBid, setSelectedBid] = useState<any>(null);

  useEffect(() => {
    if (!request) return;
    if (request.status === 'pending_quote') {
      setLoadingBids(true);
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
  const status = STATUS_CONFIG[request.status] || STATUS_CONFIG.pending_consultation;

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

      {/* 专家信息卡片 */}
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
                <div className="font-bold text-slate-900 text-lg">{expert.name}</div>
                <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                  <Star className="w-4 h-4 fill-current" /> {expert.rating}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {expert.skills.slice(0, 3).map(s => (
                    <span key={s} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-vibe-primary">${request.price}</div>
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
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.bg} ${status.text} ${status.border}`}>
                {status.label}
              </span>
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {request.category && (
                <span className="px-3 py-1 bg-vibe-primary text-white text-xs font-bold rounded-full">{request.category}</span>
              )}
              {request.subCategory && (
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">{request.subCategory}</span>
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
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">问题描述</h4>
                        <p className="text-slate-600 leading-relaxed">{request.description}</p>
                      </div>

                      {request.expectedOutcome && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">预期目标</h4>
                          <p className="text-slate-600 leading-relaxed">{request.expectedOutcome}</p>
                        </div>
                      )}

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
                          </div>
                        </div>
                      )}

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

                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">技术栈</h4>
                        <div className="flex flex-wrap gap-2">
                          {request.techStack?.map((s: string) => (
                            <span key={s} className="px-3 py-1 bg-vibe-accent/10 text-vibe-primary text-xs font-bold rounded-full">{s}</span>
                          ))}
                        </div>
                      </div>

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

          {/* 选择专家页面 */}
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
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-lg border border-amber-100">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-bold text-amber-700">23:45:12</span>
                  <span className="text-xs text-amber-600">后截止</span>
                </div>
              </div>

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
                      <div className="relative">
                        <img src={bid?.expertAvatar} alt={bid?.expertName} className="w-14 h-14 rounded-xl object-cover" />
                        {bid?.isPro && (
                          <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-950 text-[10px] font-black px-1.5 py-0.5 rounded-md border-2 border-white">
                            PRO
                          </div>
                        )}
                      </div>
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <span className="text-2xl font-black text-vibe-primary">${bid?.price}</span>
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

              {expertBids.length > 0 && (
                <div className="mt-6">
                  <button
                    onClick={handleSelectExpert}
                    disabled={!selectedBid}
                    className="w-full bg-vibe-primary text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:bg-slate-200 disabled:cursor-not-allowed"
                  >
                    {selectedBid ? `确认选择 ${selectedBid.expertName} 并支付 $${selectedBid.price}` : '请选择一位专家'}
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-3">
                    24小时内未选择，订单将自动取消，已支付的咨询费不予退还
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 沟通记录 */}
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

          {request.status !== 'pending_quote' && (
            <div className="bg-slate-900 p-8 rounded-2xl text-white overflow-hidden relative vibe-shadow border border-slate-800">
              <h3 className="text-lg font-bold mb-6 relative z-10">专业担保流程</h3>
              <div className="space-y-5 relative z-10">
                {[
                  { step: 1, title: '基础咨询', done: true },
                  { step: 2, title: '专家分析并报价', done: true },
                  { step: 3, title: '选择专家并支付费用', done: true },
                  { step: 4, title: '开始 VibeFello 服务', done: request.status === 'in_service' || request.status === 'completed' },
                  { step: 5, title: '专家完成服务待确认', done: request.status === 'completed' }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-emerald-500' : 'bg-white/20'}`}>
                      {item.done ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-white/40" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-white/50">步骤 {item.step}</div>
                      <div className="font-bold text-sm">{item.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
