import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SupabaseLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const SupabaseLoginModal: React.FC<SupabaseLoginModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        onClose();
      } else {
        if (!fullName.trim()) {
          throw new Error('请输入姓名');
        }
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        // Show success message for registration
        alert('注册成功！请检查邮箱验证链接。');
        onClose();
      }
    } catch (err: any) {
      setError(err.message || '操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
        className="relative bg-white w-full max-w-md rounded-2xl p-8 vibe-card-shadow"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-vibe-primary uppercase tracking-tight">
            {mode === 'login' ? '欢迎回来' : '创建账户'}
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            {mode === 'login' 
              ? '登录您的 VibeFello 账户' 
              : '注册成为 VibeFello 用户'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                姓名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="您的姓名"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-vibe-accent focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              邮箱
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-vibe-accent focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              密码
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-vibe-accent focus:border-transparent outline-none transition-all"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-vibe-primary text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                处理中...
              </>
            ) : mode === 'login' ? (
              '登录'
            ) : (
              '注册'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
            className="text-slate-500 text-sm hover:text-vibe-accent transition-colors"
          >
            {mode === 'login' 
              ? '还没有账户？立即注册' 
              : '已有账户？立即登录'}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">
            登录即表示您同意我们的服务条款和隐私政策
          </p>
        </div>
      </motion.div>
    </div>
  );
};
