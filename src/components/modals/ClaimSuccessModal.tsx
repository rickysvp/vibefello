import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

interface ClaimSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToDashboard: () => void;
}

export const ClaimSuccessModal: React.FC<ClaimSuccessModalProps> = ({ isOpen, onClose, onGoToDashboard }) => {
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
