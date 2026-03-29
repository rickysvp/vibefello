import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

export const ClaimingScreen: React.FC = () => (
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
