import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

interface MatchingScreenProps {
  onFinish: () => void;
}

export const MatchingScreen: React.FC<MatchingScreenProps> = ({ onFinish }) => {
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

export default MatchingScreen;
