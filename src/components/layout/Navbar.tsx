import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { VibeLogo } from '../common/VibeLogo';
import { UserTier } from '../../types';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isLoggedIn: boolean;
  userRole: 'user' | 'expert' | null;
  userTier: UserTier;
  onLoginClick: (role?: 'user' | 'expert') => void;
  onLogout: () => void;
}

const navItems = [
  { id: 'home', label: '首页' },
  { id: 'dashboard', label: '控制台' },
  { id: 'marketplace', label: 'Vibe Request', showOnlyForExpert: true },
  { id: 'post', label: '提交咨询', hideForExpert: true },
  { id: 'pricing', label: '订阅计划' }
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  isLoggedIn,
  userRole,
  userTier,
  onLoginClick,
  onLogout
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      // 如果在首页，使用 onTabChange
      onTabChange('home');
    } else {
      // 如果在其他页面，直接跳转到首页
      navigate('/');
    }
  };

  const filteredNavItems = navItems.filter(tab => {
    if (tab.hideForExpert && userRole === 'expert') return false;
    if (tab.showOnlyForExpert && userRole !== 'expert') return false;
    return true;
  });

  const getTierLabel = () => {
    if (userRole === 'expert') return 'Expert';
    if (userTier === 'max') return 'Max';
    if (userTier === 'pro') return 'Pro';
    return 'Member';
  };

  const getTierBadge = () => {
    if (userTier === 'max') return { bg: 'bg-slate-900', text: 'text-white' };
    if (userTier === 'pro') return { bg: 'bg-vibe-accent/10', text: 'text-vibe-primary border border-vibe-accent/20' };
    return null;
  };

  const tierBadge = getTierBadge();

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 z-50 flex items-center justify-between px-8">
      <div onClick={handleLogoClick} className="cursor-pointer">
        <VibeLogo />
      </div>
      
      {isLoggedIn && (
        <div className="hidden md:flex items-center gap-10">
          {filteredNavItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${
                activeTab === tab.id ? 'text-vibe-primary' : 'text-slate-400 hover:text-vibe-primary'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-vibe-accent"
                />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-6">
        {isLoggedIn ? (
          <>
            {/* 会员标识 - 仅普通用户显示 */}
            {userRole === 'user' && tierBadge && (
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${tierBadge.bg} ${tierBadge.text}`}>
                {userTier === 'max' ? 'Max' : 'Pro'}
              </div>
            )}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-200/60 hover:bg-slate-100 transition-all"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] border shadow-sm ${
                  userRole === 'expert' 
                    ? 'bg-vibe-primary text-vibe-accent border-slate-800' 
                    : userTier === 'max'
                      ? 'bg-slate-900 text-white border-slate-700'
                      : userTier === 'pro'
                        ? 'bg-vibe-accent text-vibe-primary border-vibe-primary'
                        : 'bg-slate-200 text-slate-600 border-slate-300'
                }`}>
                  {userRole === 'expert' ? 'E' : userTier === 'max' ? 'M' : userTier === 'pro' ? 'P' : 'U'}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 hidden sm:inline">
                  {getTierLabel()}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-slate-200 vibe-shadow overflow-hidden py-2"
                  >
                    <div className="px-4 py-3 border-b border-slate-50 mb-2">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">当前账户</div>
                      <div className="text-xs font-bold text-vibe-primary truncate">rickysevp@gmail.com</div>
                    </div>
                    
                    <button className="w-full px-4 py-2.5 flex items-center gap-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                      <User className="w-4 h-4" /> 个人资料
                    </button>
                    <button className="w-full px-4 py-2.5 flex items-center gap-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                      <Settings className="w-4 h-4" /> 账号设置
                    </button>
                    <div className="h-px bg-slate-50 my-2 mx-2"></div>
                    <button 
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> 退出登录
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {userRole !== 'expert' && (
              <button 
                onClick={() => onTabChange('post')}
                className="bg-vibe-primary text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-vibe-primary/10"
              >
                获取帮助
              </button>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onLoginClick('expert')}
              className="text-slate-600 hover:text-vibe-primary px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
            >
              专家登录
            </button>
            <button 
              onClick={() => onLoginClick('user')}
              className="bg-vibe-primary text-white px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-vibe-primary/10"
            >
              登录 / 注册
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
