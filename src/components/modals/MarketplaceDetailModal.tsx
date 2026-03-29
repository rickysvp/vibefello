import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle2, ArrowRight, ArrowLeft, Zap, Clock, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

interface MarketplaceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: any;
  isExpert: boolean;
  onClaim: (r: any, bidData: any) => void;
  onUpgrade: () => void;
}

export const MarketplaceDetailModal: React.FC<MarketplaceDetailModalProps> = ({
  isOpen,
  onClose,
  request,
  isExpert,
  onClaim,
  onUpgrade
}) => {
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
