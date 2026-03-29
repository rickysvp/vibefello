/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Search, 
  Wallet, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Shield,
  ArrowLeft,
  Zap,
  Star,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  AlertCircle,
  Download,
  ChevronDown,
  LogOut,
  Github,
  Mail,
  User,
  Users,
  Settings,
  FileText,
  Sparkles,
  Terminal,
  Code2,
  Cpu,
  Globe,
  Lock,
  FileCode,
  Layers
} from 'lucide-react';
import { Request, Expert, MOCK_EXPERTS, MOCK_REQUESTS, MOCK_MARKETPLACE, OrderStatus, USER_TIER_CONFIG, UserTier, ExpertApplication, ExpertVerificationStatus } from './types';
import { PostRequestFlow } from './PostRequestFlow';
import { ExpertOnboardingFlow } from './components/onboarding';
import { AdminPanel } from './components/admin';
import { VibeLogo, MatchingScreen, FAQItem, ClaimingScreen } from './components/common';
import { MembershipCard, EmptyStateGuide } from './components/dashboard';
import { Navbar, Footer } from './components/layout';
import { LoginModal, MarketplaceDetailModal, ClaimSuccessModal } from './components/modals';
import { Home as HomePage } from './pages/Home';
import { Pricing as PricingPage } from './pages/Pricing';
import { Dashboard as DashboardPage } from './pages/Dashboard';
import { OrderDetail as OrderDetailPage } from './pages/OrderDetail';
import { Marketplace as MarketplacePage } from './pages/Marketplace';
import { ExpertDashboard as ExpertDashboardPage } from './pages/ExpertDashboard';
import { Workspace as WorkspacePage } from './pages/Workspace';

// --- Components ---
// Note: Components are now imported from './components/*'








// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'marketplace' | 'pricing' | 'dashboard' | 'post' | 'admin'>('home');
  const [requests, setRequests] = useState<Request[]>([]);
  const [matching, setMatching] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  
  // New States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'expert' | null>(null);
  const [userTier, setUserTier] = useState<UserTier>('free');
  const [remainingAiDiagnosis, setRemainingAiDiagnosis] = useState(1); // 剩余AI诊断次数
  const [remainingConsults, setRemainingConsults] = useState(1); // 剩余专家咨询次数
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [defaultLoginRole, setDefaultLoginRole] = useState<'user' | 'expert'>('user');
  const [showMarketplaceModal, setShowMarketplaceModal] = useState(false);
  const [selectedMarketplaceReq, setSelectedMarketplaceReq] = useState<any>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  const [workspaceRequest, setWorkspaceRequest] = useState<Request | null>(null);

  // Expert Onboarding States
  const [expertApplication, setExpertApplication] = useState<Partial<ExpertApplication> | null>(null);
  const [expertVerificationStatus, setExpertVerificationStatus] = useState<ExpertVerificationStatus>('pending');
  const [showExpertOnboarding, setShowExpertOnboarding] = useState(false);

  const handlePostComplete = (data: Partial<Request>) => {
    setMatching(true);
    const newReq: Request = {
      id: `r${Date.now()}`,
      title: data.title || 'Untitled',
      description: data.description || '',
      expectedOutcome: data.expectedOutcome || '',
      budget: data.budget || '¥100 - ¥300',
      techStack: data.techStack || [],
      deliveryTime: data.deliveryTime || '24 小时内',
      status: 'pending_quote',
      createdAt: new Date().toISOString().split('T')[0],
      // 新订单不设置 expertId，等待用户选择
      consultationFeePaid: true,
      category: data.category || '',
      subCategory: data.subCategory || '',
      urgency: data.urgency || 'normal',
      gitUrl: data.gitUrl || '',
      branch: data.branch || '',
      filePath: data.filePath || '',
      aiDiagnosis: data.aiDiagnosis
    };
    setRequests([newReq, ...requests]);
  };

  const finishMatching = () => {
    setMatching(false);
    setActiveTab('dashboard');
  };

  const handleLogin = (role: 'user' | 'expert') => {
    setIsLoggedIn(true);
    setUserRole(role);
    setShowLoginModal(false);
    
    // Check expert application status
    if (role === 'expert') {
      const savedApplication = localStorage.getItem('expert_application');
      if (savedApplication) {
        const parsed = JSON.parse(savedApplication);
        setExpertApplication(parsed);
        setExpertVerificationStatus(parsed.status || 'pending');
        
        // If approved, go to dashboard
        if (parsed.status === 'approved') {
          setActiveTab('dashboard');
          return;
        }
        // If submitted but not approved, go to dashboard (will show pending status)
        if (parsed.status === 'submitted') {
          setActiveTab('dashboard');
          return;
        }
        // If rejected, show onboarding to resubmit
        if (parsed.status === 'rejected') {
          setShowExpertOnboarding(true);
          return;
        }
      } else {
        // New expert, go to dashboard first, they can apply from there
        setExpertVerificationStatus('pending');
        setActiveTab('dashboard');
        return;
      }
    }
    
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setActiveTab('home');
  };

  const handleMarketplaceClick = (req: any) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setSelectedMarketplaceReq(req);
    setShowMarketplaceModal(true);
  };

  const handleClaimOrder = async (req: any, bidData?: any) => {
    setIsClaiming(true);
    setShowMarketplaceModal(false);

    // 模拟抢单过程
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsClaiming(false);
    setClaimSuccess(true);

    // 模拟将订单添加到我的项目中
    const newProject: Request = {
      ...req,
      id: `claimed-${Date.now()}`,
      status: 'pending_quote', // 抢单后等待用户选择
      createdAt: new Date().toISOString().split('T')[0],
      expertId: 'e1',
      consultationFeePaid: true,
      // 保存专家的抢单方案
      expertBid: bidData
    };
    setRequests([newProject, ...requests]);
  };

  const handleTabChange = (tab: string) => {
    if ((tab === 'post' || tab === 'dashboard') && !isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    // 切换 tab 时重置详情页状态
    setSelectedRequest(null);
    setWorkspaceRequest(null);
    setActiveTab(tab);
  };

  // 检测是否是管理后台路径
  const isAdminPath = window.location.pathname === '/admin';
  
  // 如果是管理后台路径，直接显示管理后台
  if (isAdminPath) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        userTier={userTier}
        onLoginClick={(role) => {
          if (role) setDefaultLoginRole(role);
          setShowLoginModal(true);
        }}
        onLogout={handleLogout}
      />
      
      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HomePage 
              onStart={() => handleTabChange('post')} 
              onViewPricing={() => handleTabChange('pricing')} 
              onMarketplaceClick={handleMarketplaceClick}
              onViewMore={() => {
                if (!isLoggedIn) {
                  setShowLoginModal(true);
                } else {
                  handleTabChange('dashboard');
                }
              }}
              onExpertApply={() => {
                if (!isLoggedIn) {
                  // Not logged in: show expert login modal
                  setDefaultLoginRole('expert');
                  setShowLoginModal(true);
                } else if (userRole === 'expert') {
                  // Expert logged in: go to dashboard
                  handleTabChange('dashboard');
                } else {
                  // User logged in: show pricing for upgrade
                  handleTabChange('pricing');
                }
              }}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              expertVerificationStatus={expertVerificationStatus}
            />
          </motion.div>
        )}

        {activeTab === 'pricing' && (
          <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PricingPage 
              userRole={userRole}
              userTier={userTier}
              onUpgrade={(tier) => {
                setUserTier(tier);
                setRemainingAiDiagnosis(USER_TIER_CONFIG[tier].aiDiagnosisLimit);
              }}
            />
          </motion.div>
        )}
        
        {activeTab === 'post' && (
          <motion.div key="post" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PostRequestFlow 
              onComplete={handlePostComplete} 
              onUpgrade={(tier) => {
                setUserTier(tier);
                setRemainingAiDiagnosis(USER_TIER_CONFIG[tier].aiDiagnosisLimit);
              }}
              remainingAiDiagnosis={remainingAiDiagnosis}
              onUseAiDiagnosis={() => setRemainingAiDiagnosis(prev => Math.max(0, prev - 1))}
            />
          </motion.div>
        )}

        {activeTab === 'marketplace' && (
          <motion.div key="marketplace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MarketplacePage 
              onSelect={handleMarketplaceClick} 
              isExpert={userRole === 'expert'}
              userTier={userTier}
            />
          </motion.div>
        )}

        {activeTab === 'dashboard' && !selectedRequest && !workspaceRequest && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {userRole === 'expert' ? (
              <ExpertDashboardPage 
                requests={requests} 
                onSelect={handleMarketplaceClick} 
                onEnterWorkspace={(r) => setWorkspaceRequest(r)}
                onTabChange={setActiveTab}
                verificationStatus={expertVerificationStatus}
                onStartApplication={() => setShowExpertOnboarding(true)}
              />
            ) : (
              <DashboardPage
                requests={requests}
                onSelect={(r) => setSelectedRequest(r)}
                onPostRequest={() => setActiveTab('post')}
                onUpgrade={() => setActiveTab('pricing')}
                userTier={userTier}
                remainingConsults={remainingConsults}
              />
            )}
          </motion.div>
        )}

        {workspaceRequest && (
          <motion.div key="workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <WorkspacePage 
              request={workspaceRequest} 
              onBack={() => setWorkspaceRequest(null)} 
            />
          </motion.div>
        )}

        {selectedRequest && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <OrderDetailPage
              request={selectedRequest}
              onBack={() => setSelectedRequest(null)}
              onSelectExpert={(expertBid) => {
                // 更新订单状态为 in_service，并设置专家信息
                const updatedRequest = {
                  ...selectedRequest,
                  status: 'in_service' as OrderStatus,
                  expertId: expertBid.expertId,
                  price: expertBid.price,
                  deliveryTime: expertBid.deliveryTimeLabel
                };
                setRequests(prev => prev.map(r => r.id === selectedRequest.id ? updatedRequest : r));
                setSelectedRequest(updatedRequest);
              }}
            />
          </motion.div>
        )}

      </AnimatePresence>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        role={defaultLoginRole}
      />

      <MarketplaceDetailModal 
        isOpen={showMarketplaceModal} 
        onClose={() => setShowMarketplaceModal(false)} 
        request={selectedMarketplaceReq}
        isExpert={userRole === 'expert'}
        onClaim={handleClaimOrder}
        onUpgrade={() => {
          setShowMarketplaceModal(false);
          setActiveTab('pricing');
        }}
      />

      {matching && <MatchingScreen onFinish={finishMatching} />}
      
      {isClaiming && <ClaimingScreen />}
      
      <ClaimSuccessModal 
        isOpen={claimSuccess} 
        onClose={() => setClaimSuccess(false)} 
        onGoToDashboard={() => {
          setClaimSuccess(false);
          setActiveTab('dashboard');
          // 自动选中第一个（刚刚抢到的）订单
          setSelectedRequest(requests[0]);
        }}
      />

      {/* Expert Onboarding Flow */}
      <ExpertOnboardingFlow
        isOpen={showExpertOnboarding}
        onClose={() => setShowExpertOnboarding(false)}
        onComplete={(application) => {
          // Save application with pending status
          const fullApplication: Partial<ExpertApplication> = {
            ...application,
            id: `app-${Date.now()}`,
            userId: 'current-user',
            status: 'submitted',
            submittedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          setExpertApplication(fullApplication);
          setExpertVerificationStatus('submitted');
          localStorage.setItem('expert_application', JSON.stringify(fullApplication));
          
          // Close onboarding and go to dashboard
          setShowExpertOnboarding(false);
          setActiveTab('dashboard');
          
          // Show success message (you can add a toast here)
          alert('入驻申请已提交！我们将在1-2个工作日内完成审核。');
        }}
      />

      <Footer />
    </div>
  );
}
