import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';

interface EmptyStateGuideProps {
  onPostRequest: () => void;
}

const STEPS = [
  { num: '01', title: '描述问题', desc: '说明技术难题' },
  { num: '02', title: 'AI 诊断', desc: '自动分析代码' },
  { num: '03', title: '专家解决', desc: '资深专家修复' }
];

export const EmptyStateGuide: React.FC<EmptyStateGuideProps> = ({ onPostRequest }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-vibe-primary p-12 text-white">
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-vibe-accent/20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-vibe-glow/20 blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3" />
      
      <div className="relative z-10">
        {/* 主标题区域 */}
        <div className="text-center mb-12">
          <h3 className="text-4xl font-black mb-4 tracking-tight">
            让Vibe Coding专家为你解决代码难题
          </h3>
          <p className="text-slate-300 max-w-lg mx-auto text-lg">
            只需3分钟描述你的问题，顶级代码审计AI将自动诊断，专家会在24小时内介入解决。
          </p>
        </div>

        {/* 流程步骤 - 横向排列 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
          {STEPS.map((step, i, arr) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 min-w-[180px]">
                <div className="w-12 h-12 bg-vibe-accent rounded-xl flex items-center justify-center">
                  <span className="text-lg font-black text-vibe-primary">{step.num}</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">{step.title}</h4>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>
              </div>
              {i < arr.length - 1 && (
                <ArrowRight className="w-6 h-6 text-vibe-accent hidden md:block" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* CTA 按钮 */}
        <div className="text-center">
          <button 
            onClick={onPostRequest}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-vibe-accent text-vibe-primary rounded-2xl font-black text-lg hover:bg-vibe-accent/90 transition-all shadow-2xl shadow-vibe-accent/20 hover:shadow-vibe-accent/40 hover:scale-105"
          >
            <Zap className="w-6 h-6 group-hover:animate-pulse" />
            立即发布需求
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyStateGuide;
