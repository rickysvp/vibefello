import React from 'react';
import { motion } from 'motion/react';
import { X, Github, Mail } from 'lucide-react';
import { VibeLogo } from '../common/VibeLogo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: 'user' | 'expert') => void;
  role?: 'user' | 'expert';
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onLogin, 
  role = 'user' 
}) => {
  if (!isOpen) return null;

  const isExpert = role === 'expert';
  const subtitle = isExpert ? '技术专家工作台，接单赚钱' : '发布需求，获取专业技术支持';

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
        
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <VibeLogo className="w-16 h-16" iconOnly />
          </div>
          <h2 className="text-2xl font-black text-vibe-primary mb-2 tracking-tight uppercase">
            {isExpert ? '专家登录' : '用户登录'}
          </h2>
          <p className="text-slate-500 font-medium">{subtitle}</p>
        </div>

        <div className="space-y-3 mb-8">
          <button 
            onClick={() => onLogin(role)}
            className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20"
          >
            <Github className="w-5 h-5" />
            使用 GitHub 登录
          </button>
          <button 
            onClick={() => onLogin(role)}
            className="w-full py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
          >
            <Mail className="w-5 h-5 text-red-500" />
            使用 Google 账号登录
          </button>
        </div>

        <p className="mt-10 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          登录即表示您同意我们的 <span className="text-vibe-accent hover:underline cursor-pointer">服务条款</span>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginModal;
