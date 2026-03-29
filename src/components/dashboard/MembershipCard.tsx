import React from 'react';
import { Sparkles } from 'lucide-react';
import { UserTier } from '../../types';

interface MembershipCardProps {
  tier: UserTier;
  remainingConsults: number;
  onUpgrade: () => void;
}

const CONFIG = {
  free: {
    title: '本月剩余次数',
    value: (n: number) => `${n} 次`,
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
    value: (n: number) => `${n} 次`,
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
    value: () => '无限',
    subtext: '',
    bg: 'bg-vibe-primary',
    border: 'border-vibe-primary',
    text: 'text-white',
    subtextColor: 'text-slate-300',
    iconBg: 'bg-vibe-accent',
    iconColor: 'text-vibe-primary'
  }
};

export const MembershipCard: React.FC<MembershipCardProps> = ({ tier, remainingConsults, onUpgrade }) => {
  const c = CONFIG[tier];
  const tierBadge = tier === 'pro' ? 'Pro' : tier === 'max' ? 'Max' : null;

  return (
    <div className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl ${c.bg} border ${c.border} shadow-sm`}>
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
          <span className={`text-lg font-black ${c.text}`}>{c.value(remainingConsults)}</span>
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

export default MembershipCard;
