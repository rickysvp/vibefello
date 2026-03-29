import React from 'react';
import { VibeLogo } from '../common';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <VibeLogo className="h-12" />
        </div>
        <div className="flex gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-indigo-600 transition-colors">服务条款</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">隐私政策</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">联系我们</a>
        </div>
        <div className="text-sm text-slate-400 font-medium">
          © 2026 VibeFello. 保留所有权利。
        </div>
      </div>
    </footer>
  );
};

export default Footer;
