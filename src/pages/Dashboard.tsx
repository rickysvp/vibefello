import React from 'react';
import { motion } from 'motion/react';
import { Wallet, Clock, ChevronRight } from 'lucide-react';
import { MembershipCard } from '../components/dashboard/MembershipCard';
import { EmptyStateGuide } from '../components/dashboard/EmptyStateGuide';
import { Request, OrderStatus, UserTier } from '../types';

interface DashboardProps {
  requests: Request[];
  onSelect: (r: Request) => void;
  onPostRequest: () => void;
  onUpgrade: () => void;
  userTier: UserTier;
  remainingConsults: number;
}

const STATUS_CONFIG: Record<OrderStatus, { bg: string; text: string; border: string; label: string }> = {
  pending_consultation: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', label: '等待诊断' },
  pending_quote: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', label: '待报价' },
  quoted: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', label: '已报价' },
  in_service: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', label: '服务中' },
  cooling: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', label: '冷却中' },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', label: '已完成' }
};

export const Dashboard: React.FC<DashboardProps> = ({
  requests,
  onSelect,
  onPostRequest,
  onUpgrade,
  userTier,
  remainingConsults
}) => {
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
              <div className="text-sm font-bold text-slate-900">$3,250</div>
            </div>
          </div>
        </div>
      </div>

      {/* 需求列表或空白状态 */}
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((req) => {
            const status = STATUS_CONFIG[req.status];
            return (
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
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status.bg} ${status.text} ${status.border}`}>
                        {status.label}
                      </span>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {req.createdAt}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-vibe-primary group-hover:text-vibe-accent transition-colors tracking-tight">{req.title}</h3>
                    <div className="flex gap-2 mt-2">
                      {req.techStack.map(s => (
                        <span key={s} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">{req.price ? `$${req.price}` : req.budget}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">固定价格</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-vibe-accent group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <EmptyStateGuide onPostRequest={onPostRequest} />
      )}
    </div>
  );
};

export default Dashboard;
