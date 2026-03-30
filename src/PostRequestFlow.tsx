import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Sparkles,
  Terminal,
  Code2,
  Cpu,
  Globe,
  Lock,
  FileCode,
  Layers,
  ShieldCheck,
  Wallet,
  ArrowRight,
  Download,
  X,
  Zap,
  TrendingUp,
  Clock,
  ChevronRight,
  Users,
  Star
} from 'lucide-react';
import { analyzeCode, CodeAnalysisResult } from './services/aiAnalysis';

// 分层结构化标签库
const CATEGORY_TAGS = {
  'Web 开发': {
    subs: ['前端', '后端', '全栈', 'API 开发', 'SDK 集成', '微服务', 'Serverless']
  },
  '移动端': {
    subs: ['iOS', 'Android', 'React Native', 'Flutter', '跨平台', 'App 优化']
  },
  '桌面端': {
    subs: ['Electron', 'Tauri', 'Windows', 'macOS', 'Linux']
  },
  'AI / ML': {
    subs: ['模型部署', 'Prompt 工程', 'RAG', 'Agent 编排', 'Fine-tuning', '模型集成']
  },
  '数据 & 数据库': {
    subs: ['SQL 优化', 'NoSQL', '数据迁移', 'ETL', '数据分析', '向量数据库']
  },
  'DevOps & 云': {
    subs: ['Docker', 'K8s', 'CI/CD', 'AWS', 'GCP', 'Azure', '监控告警']
  },
  'Web3 & 区块链': {
    subs: ['智能合约', 'DApp', 'NFT', 'DeFi', '钱包集成', '链上数据分析']
  },
  '安全': {
    subs: ['代码审计', '漏洞修复', '渗透测试', '安全加固']
  },
  '其他': {
    subs: ['性能优化', '技术咨询', '代码重构', '架构设计']
  }
};

// AI 分析步骤
const ANALYSIS_STEPS = [
  { icon: Globe, label: '连接仓库', desc: '正在建立安全连接' },
  { icon: FileCode, label: '扫描文件', desc: '分析项目结构' },
  { icon: Code2, label: '代码解析', desc: '识别语法和依赖' },
  { icon: Cpu, label: '问题检测', desc: '运行诊断算法' },
  { icon: ShieldCheck, label: '生成报告', desc: '整理分析结果' }
];

interface PostRequestFlowProps {
  onComplete: (req: any) => void;
  onUpgrade?: (tier: 'pro' | 'max') => void;
  remainingAiDiagnosis?: number;
  onUseAiDiagnosis?: () => void;
}

export const PostRequestFlow: React.FC<PostRequestFlowProps> = ({ onComplete, onUpgrade, remainingAiDiagnosis = 1, onUseAiDiagnosis }) => {
  const [step, setStep] = useState(1);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState<'single' | 'member' | 'max'>('member');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [aiDiagnosis, setAiDiagnosis] = useState<CodeAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    expectedOutcome: '',
    gitUrl: '',
    branch: 'main',
    filePath: '',
    category: '',
    subCategory: '',
    budget: '$100 - $300',
    deliveryTime: '24 小时内',
    urgency: 'normal'
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  // AI 代码分析过程 - 使用真实的大模型服务
  const startAnalysis = async () => {
    if (!formData.gitUrl) {
      nextStep();
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setAnalysisError(null);
    
    try {
      // 调用真实的 AI 分析服务
      const result = await analyzeCode(
        formData.gitUrl,
        formData.branch,
        (step, message) => {
          setAnalysisStep(step);
        }
      );
      
      setAiDiagnosis(result);
      setIsAnalyzing(false);
      // 扣除 AI 诊断次数
      onUseAiDiagnosis?.();
      // 分析完成后停留在 Step 4 显示报告，不自动跳转
    } catch (error) {
      setIsAnalyzing(false);
      setAnalysisError(error instanceof Error ? error.message : '分析失败');
    }
  };

  const canProceed = () => {
    switch(step) {
      case 1: return formData.title && formData.category && formData.subCategory;
      case 2: return formData.description && formData.expectedOutcome;
      case 3: return true;
      case 4: return formData.budget;
      default: return true;
    }
  };

  // 提交请求 - 直接生成订单，进入我的项目页面
  const handleSubmitRequest = () => {
    // 生成订单并传递给父组件，状态为 pending_quote（等待专家报价）
    onComplete({
      ...formData,
      aiDiagnosis,
      status: 'pending_quote', // 等待专家报价状态
      expertBids: [], // 初始为空，专家会逐渐报价
      createdAt: new Date().toISOString()
    });
  };

  const handlePayment = (type: 'single' | 'member' | 'max') => {
    setPaymentType(type);
  };

  const executePayment = async () => {
    setIsProcessingPayment(true);

    // 模拟支付处理
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 先关闭弹窗
    setShowPaymentModal(false);
    setIsProcessingPayment(false);

    // 如果是会员升级，先更新会员等级
    if (paymentType === 'member' || paymentType === 'max') {
      onUpgrade?.(paymentType === 'max' ? 'max' : 'pro');
    }

    // 所有支付方式都进入 AI 分析（第3步）
    setStep(3);
    // 延迟后开始分析（如果有剩余次数）
    if (remainingAiDiagnosis > 0) {
      setTimeout(() => {
        startAnalysis();
      }, 300);
    }
  };

  const downloadReport = () => {
    const reportData = {
      project: formData.title,
      analysisDate: new Date().toISOString(),
      diagnosis: aiDiagnosis,
      summary: `代码质量评分: ${aiDiagnosis?.codeQuality}/100, 安全评分: ${aiDiagnosis?.securityScore}/100`
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibefello-report-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
      {/* 步骤指示器 - 4步流程 */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? 'bg-vibe-primary text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
              </div>
              {s < 4 && <div className={`h-1 flex-1 mx-2 rounded-full ${step > s ? 'bg-vibe-primary' : 'bg-slate-100'}`}></div>}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white p-10 rounded-2xl border border-slate-200 vibe-shadow"
        >
          {/* Step 1: 项目类型 */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                  项目类型 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(CATEGORY_TAGS).map(([category]) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setFormData({...formData, category, subCategory: ''});
                      }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.category === category
                          ? 'bg-vibe-primary border-vibe-primary text-white shadow-lg shadow-vibe-primary/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-vibe-accent/50'
                      }`}
                    >
                      <div className="text-xs font-bold">{category}</div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedCategory && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    具体方向 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_TAGS[selectedCategory as keyof typeof CATEGORY_TAGS].subs.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setFormData({...formData, subCategory: sub})}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                          formData.subCategory === sub
                            ? 'bg-vibe-accent text-vibe-primary'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  项目标题 <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="例如：修复 Next.js 中的水合错误"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-vibe-accent focus:border-transparent outline-none transition-all font-medium"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>
          )}

          {/* Step 2: 问题描述 & Git 链接 */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  遇到的问题 <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows={4}
                  placeholder="详细描述您遇到的问题，包括错误信息、出现场景等..."
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-vibe-accent focus:border-transparent outline-none transition-all resize-none font-medium"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  期望实现的目标 <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows={3}
                  placeholder="描述您希望达到的效果或解决方案..."
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-vibe-accent focus:border-transparent outline-none transition-all resize-none font-medium"
                  value={formData.expectedOutcome}
                  onChange={e => setFormData({...formData, expectedOutcome: e.target.value})}
                />
              </div>

              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  Git 仓库链接
                </label>
                <input 
                  type="text" 
                  placeholder="https://github.com/username/repo"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-vibe-accent focus:border-transparent outline-none transition-all font-medium mb-3"
                  value={formData.gitUrl}
                  onChange={e => setFormData({...formData, gitUrl: e.target.value})}
                />
                
                {formData.gitUrl && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">分支</label>
                      <input 
                        type="text" 
                        placeholder="main"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        value={formData.branch}
                        onChange={e => setFormData({...formData, branch: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">相关文件路径</label>
                      <input 
                        type="text" 
                        placeholder="src/components/"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        value={formData.filePath}
                        onChange={e => setFormData({...formData, filePath: e.target.value})}
                      />
                    </div>
                  </div>
                )}
                
                <div className="mt-4 p-3 bg-vibe-accent/10 rounded-lg border border-vibe-accent/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="w-4 h-4 text-vibe-accent" />
                      <span className="font-bold text-vibe-primary">提供 Git 链接可享受 AI 智能诊断</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${remainingAiDiagnosis > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      剩余 {remainingAiDiagnosis} 次
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">AI 将自动分析代码问题，生成专业诊断报告</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: AI 分析中 或 报告 */}
          {step === 3 && (
            <div className="space-y-6">
              {/* 次数用完提示 */}
              {remainingAiDiagnosis <= 0 && !isAnalyzing && !aiDiagnosis && !analysisError && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">AI 诊断次数已用完</h3>
                  <p className="text-slate-500 mb-6">您本月的 AI 诊断次数已用完，升级会员可获得更多次数</p>
                  <div className="flex gap-3 justify-center">
                    <button 
                      onClick={() => onUpgrade?.('pro')}
                      className="px-6 py-3 bg-vibe-primary text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                    >
                      升级 Pro (10次/月)
                    </button>
                    <button 
                      onClick={() => onUpgrade?.('max')}
                      className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                    >
                      升级 Max (69次/月)
                    </button>
                  </div>
                  <button 
                    onClick={() => setStep(4)}
                    className="mt-4 text-sm text-slate-400 hover:text-slate-600 underline"
                  >
                    跳过 AI 诊断，直接提交请求
                  </button>
                </motion.div>
              )}
              
              {isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="mb-8">
                    <div className="flex justify-center gap-4 mb-6">
                      {ANALYSIS_STEPS.map((step_item, idx) => {
                        const Icon = step_item.icon;
                        const isActive = idx === analysisStep;
                        const isCompleted = idx < analysisStep;
                        
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ 
                              opacity: isCompleted || isActive ? 1 : 0.3,
                              scale: isActive ? 1.1 : 1
                            }}
                            className={`flex flex-col items-center gap-2 ${
                              isCompleted || isActive ? 'text-vibe-accent' : 'text-slate-300'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                              isCompleted ? 'bg-emerald-100 text-emerald-600' :
                              isActive ? 'bg-vibe-accent text-vibe-primary' : 'bg-slate-100'
                            }`}>
                              {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                            </div>
                            <span className="text-xs font-bold">{step_item.label}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                    
                    <div className="max-w-md mx-auto mb-6">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-vibe-accent"
                          initial={{ width: 0 }}
                          animate={{ width: `${((analysisStep + 1) / ANALYSIS_STEPS.length) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <motion.div
                    key={analysisStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <h3 className="text-xl font-black text-slate-900 mb-2">
                      {ANALYSIS_STEPS[analysisStep]?.label}
                    </h3>
                    <p className="text-slate-500">{ANALYSIS_STEPS[analysisStep]?.desc}</p>
                  </motion.div>
                </div>
              ) : aiDiagnosis && aiDiagnosis.detectedIssues ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* 报告摘要卡片 */}
                  <div className="p-6 bg-gradient-to-br from-vibe-primary to-slate-800 rounded-2xl text-white">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-vibe-accent/20 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-vibe-accent" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">AI 诊断报告</h3>
                          <p className="text-xs text-slate-400">生成时间: {new Date().toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-vibe-accent">{aiDiagnosis.confidence}%</div>
                        <div className="text-xs text-slate-400">置信度</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-white/10 rounded-xl">
                        <div className="text-2xl font-black text-emerald-400">{aiDiagnosis.codeQuality}</div>
                        <div className="text-xs text-slate-400">代码质量</div>
                      </div>
                      <div className="p-4 bg-white/10 rounded-xl">
                        <div className="text-2xl font-black text-amber-400">{aiDiagnosis.securityScore}</div>
                        <div className="text-xs text-slate-400">安全评分</div>
                      </div>
                      <div className="p-4 bg-white/10 rounded-xl">
                        <div className="text-2xl font-black text-vibe-accent">{aiDiagnosis.affectedFiles}</div>
                        <div className="text-xs text-slate-400">影响文件</div>
                      </div>
                    </div>
                  </div>

                  {/* 问题列表 */}
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">检测到的问题 ({aiDiagnosis.detectedIssues.length})</h4>
                    <div className="space-y-3">
                      {aiDiagnosis.detectedIssues.map((issue, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              issue.severity === 'high' ? 'bg-red-100 text-red-600' :
                              issue.severity === 'medium' ? 'bg-amber-100 text-amber-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {issue.severity === 'high' ? '严重' : issue.severity === 'medium' ? '中等' : '轻微'}
                            </span>
                            <span className="font-bold text-slate-900">{issue.title}</span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{issue.description}</p>
                          {issue.file && (
                            <div className="text-xs text-slate-400 mb-2">
                              📄 {issue.file}{issue.line ? `:${issue.line}` : ''}
                            </div>
                          )}
                          {issue.code && (
                            <div className="bg-slate-900 rounded-lg p-3 mb-2 overflow-x-auto">
                              <code className="text-xs text-slate-300 font-mono">{issue.code}</code>
                            </div>
                          )}
                          {issue.suggestion && (
                            <div className="flex items-start gap-2 text-sm text-emerald-600">
                              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                              <span>{issue.suggestion}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" /> 查看完整报告
                    </button>
                    <button
                      onClick={downloadReport}
                      className="flex-1 py-3 rounded-xl bg-vibe-primary text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" /> 下载报告
                    </button>
                  </div>
                </motion.div>
              ) : analysisError ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">分析失败</h3>
                  <p className="text-slate-500 mb-4">{analysisError}</p>
                  
                  {/* Git 链接重新输入 */}
                  <div className="max-w-md mx-auto mb-6 text-left">
                    <label className="block text-xs font-bold text-slate-500 mb-2">Git 仓库链接</label>
                    <input 
                      type="text" 
                      placeholder="https://github.com/username/repo"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-vibe-accent focus:border-transparent outline-none transition-all font-medium mb-3"
                      value={formData.gitUrl}
                      onChange={e => setFormData({...formData, gitUrl: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">分支</label>
                        <input 
                          type="text" 
                          placeholder="main"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          value={formData.branch}
                          onChange={e => setFormData({...formData, branch: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">相关文件路径</label>
                        <input 
                          type="text" 
                          placeholder="src/components/"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          value={formData.filePath}
                          onChange={e => setFormData({...formData, filePath: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button 
                      onClick={() => setStep(2)}
                      className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                    >
                      返回修改
                    </button>
                    <button 
                      onClick={startAnalysis}
                      disabled={!formData.gitUrl}
                      className="px-6 py-3 bg-vibe-primary text-white rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      重新分析
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Step 4: 预算与时间 */}
          {step === 4 && (
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                  预算范围 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['$100 - $300', '$301 - $600', '$601 - $2000', '$2000 - $6000', '面议'].map(b => (
                    <button
                      key={b}
                      onClick={() => setFormData({...formData, budget: b})}
                      className={`px-5 py-4 rounded-xl border text-left font-bold transition-all ${
                        formData.budget === b
                          ? 'bg-vibe-accent/10 border-vibe-accent text-vibe-primary'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-vibe-accent/50'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                    期望交付时间 <span className="text-red-500">*</span>
                  </label>
                  <select 
                    className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-vibe-accent font-bold bg-white"
                    value={formData.deliveryTime}
                    onChange={e => setFormData({...formData, deliveryTime: e.target.value})}
                  >
                    <option>24 小时内</option>
                    <option>3 天内</option>
                    <option>1 周内</option>
                    <option>2 周内</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                    紧急程度
                  </label>
                  <select
                    className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-vibe-accent font-bold bg-white"
                    value={formData.urgency}
                    onChange={e => setFormData({...formData, urgency: e.target.value})}
                  >
                    <option value="normal">普通</option>
                    <option value="urgent">加急 (+30%)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 底部按钮 */}
          <div className="mt-12 flex gap-4">
            {step > 1 && step !== 3 && (
              <button 
                onClick={prevStep}
                className="flex-1 px-6 py-4 rounded-xl border border-slate-200 font-black uppercase tracking-widest text-slate-400 hover:text-vibe-primary hover:bg-slate-50 transition-all"
              >
                返回
              </button>
            )}
            
            {step === 3 && isAnalyzing ? (
              // AI 分析中不显示按钮
              <div className="flex-1"></div>
            ) : (
              <button
                onClick={step === 2 ? () => setShowPaymentModal(true) : step === 4 ? handleSubmitRequest : nextStep}
                disabled={!canProceed()}
                className="flex-[2] bg-vibe-primary text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all vibe-shadow shadow-xl shadow-vibe-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 4 ? '提交请求' : '下一步'}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 完整报告弹窗 */}
      <AnimatePresence>
        {showReportModal && aiDiagnosis && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReportModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl p-8 vibe-shadow"
            >
              <button 
                onClick={() => setShowReportModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              <div className="mb-6">
                <h3 className="text-2xl font-black text-slate-900 mb-2">AI 诊断详细报告</h3>
                <p className="text-slate-500">项目: {formData.title}</p>
              </div>

              {/* 评分卡片 */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <div className="text-2xl font-black text-vibe-accent">{aiDiagnosis.confidence}%</div>
                  <div className="text-xs text-slate-500">置信度</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <div className="text-2xl font-black text-emerald-500">{aiDiagnosis.codeQuality}</div>
                  <div className="text-xs text-slate-500">代码质量</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <div className="text-2xl font-black text-amber-500">{aiDiagnosis.securityScore}</div>
                  <div className="text-xs text-slate-500">安全评分</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <div className="text-2xl font-black text-vibe-primary">{aiDiagnosis.affectedFiles}</div>
                  <div className="text-xs text-slate-500">影响文件</div>
                </div>
              </div>

              {/* 技术栈 */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-900 mb-3">识别的技术栈</h4>
                <div className="flex flex-wrap gap-2">
                  {aiDiagnosis.techStack.map(tech => (
                    <span key={tech} className="px-3 py-1 bg-vibe-primary text-white text-xs font-bold rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* 所有问题 */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-900 mb-3">检测到的问题 ({aiDiagnosis.detectedIssues.length})</h4>
                <div className="space-y-3">
                  {aiDiagnosis.detectedIssues.map((issue, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          issue.severity === 'high' ? 'bg-red-100 text-red-600' :
                          issue.severity === 'medium' ? 'bg-amber-100 text-amber-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {issue.severity === 'high' ? '严重' : issue.severity === 'medium' ? '中等' : '轻微'}
                        </span>
                        <span className="font-bold text-slate-900">{issue.title}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{issue.description}</p>
                      {issue.file && <p className="text-xs text-slate-400">{issue.file}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* 性能建议 */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-900 mb-3">性能优化建议</h4>
                <ul className="space-y-2">
                  {aiDiagnosis.performanceIssues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <TrendingUp className="w-4 h-4 text-vibe-accent shrink-0 mt-0.5" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 修复建议 */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-900 mb-3">推荐解决方案</h4>
                <ul className="space-y-2">
                  {aiDiagnosis.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={downloadReport}
                  className="flex-1 py-3 bg-vibe-primary text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> 下载 JSON 报告
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 支付弹窗 */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessingPayment && setShowPaymentModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 vibe-shadow"
            >
              {/* 关闭按钮 */}
              {!isProcessingPayment && (
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              )}

              {/* 支付处理中 */}
              {isProcessingPayment ? (
                <div className="py-12 text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-vibe-accent/20 rounded-full"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-2 border-4 border-t-vibe-accent border-r-transparent border-b-transparent border-l-transparent rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Wallet className="w-8 h-8 text-vibe-accent" />
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">正在处理支付...</h3>
                  <p className="text-slate-500">请稍候，正在安全处理您的付款</p>
                </div>
              ) : (
                <>
                  {/* 限时优惠提示 */}
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-200 mb-4">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-bold text-amber-700">⏰ 限时优惠：首次支付享 7 折</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 text-center">选择服务计划</h3>
                  </div>

                  {/* 三列价格卡片 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* 按次咨询 */}
                    <button
                      onClick={() => handlePayment('single')}
                      className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 relative ${
                        paymentType === 'single'
                          ? 'border-vibe-primary bg-white shadow-xl scale-[1.02] z-10'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      {/* 徽章 */}
                      <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-black rounded-bl-xl ${
                        paymentType === 'single' ? 'bg-vibe-primary text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        省 $3
                      </div>

                      <div className={`text-xs mb-4 ${paymentType === 'single' ? 'text-vibe-primary font-bold' : 'text-slate-400'}`}>灵活付费</div>
                      <h4 className="text-xl font-black text-slate-900 mb-1">按次咨询</h4>
                      <p className="text-xs text-slate-400 mb-4">适合偶尔需要帮助的用户</p>

                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-4xl font-black text-slate-900">$6.9</span>
                        <span className="text-sm text-slate-400 line-through">$9.9</span>
                      </div>
                      <div className="text-xs text-emerald-600 font-bold mb-6">✓ 首单 7 折 · 立省 $3</div>

                      <ul className="space-y-3 mb-6">
                        {[
                          '1 次 AI 代码诊断',
                          '1 次专家咨询机会',
                          '标准响应速度（24h）',
                          '社区支持',
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              paymentType === 'single' ? 'bg-vibe-primary' : 'bg-emerald-100'
                            }`}>
                              <CheckCircle2 className={`w-3 h-3 ${paymentType === 'single' ? 'text-white' : 'text-emerald-600'}`} />
                            </div>
                            <span className={`text-xs ${paymentType === 'single' ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>{item}</span>
                          </li>
                        ))}
                      </ul>

                    </button>

                    {/* Pro - 推荐 */}
                    <button
                      onClick={() => handlePayment('member')}
                      className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 relative overflow-hidden ${
                        paymentType === 'member'
                          ? 'border-vibe-primary bg-vibe-primary text-white shadow-2xl scale-[1.02] z-10'
                          : 'border-slate-200 bg-white hover:border-vibe-primary/50 hover:shadow-lg'
                      }`}
                    >
                      {/* 徽章 */}
                      <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-black rounded-bl-xl ${
                        paymentType === 'member' ? 'bg-vibe-accent text-vibe-primary' : 'bg-vibe-primary text-white'
                      }`}>
                        首月省 $12
                      </div>

                      <div className={`text-xs mb-4 ${paymentType === 'member' ? 'text-vibe-accent font-bold' : 'text-vibe-primary font-bold'}`}>最受欢迎</div>
                      <h4 className={`text-2xl font-black mb-1 ${paymentType === 'member' ? 'text-white' : 'text-slate-900'}`}>Pro</h4>
                      <p className={`text-xs mb-4 ${paymentType === 'member' ? 'text-slate-200' : 'text-slate-500'}`}>Vibe Coding 新手的最佳选择</p>

                      <div className="flex items-baseline gap-1 mb-2">
                        <span className={`text-4xl font-black ${paymentType === 'member' ? 'text-white' : 'text-slate-900'}`}>$27</span>
                        <span className={`text-sm line-through ${paymentType === 'member' ? 'text-slate-300' : 'text-slate-400'}`}>$39</span>
                      </div>
                      <div className={`text-xs font-bold mb-6 ${paymentType === 'member' ? 'text-emerald-300' : 'text-emerald-600'}`}>✓ 首月 7 折 · 比单次省 $4.2/次</div>

                      <ul className="space-y-3 mb-6">
                        {[
                          { text: '每月 10 次 AI 代码诊断', highlight: true },
                          { text: '每月 10 次专家咨询', highlight: true },
                          { text: '优先专家匹配（2h内）', highlight: true },
                          { text: '完整诊断报告下载', highlight: false },
                          { text: '技术文档支持', highlight: false },
                          { text: '专属咨询通道', highlight: false },
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              paymentType === 'member' ? 'bg-vibe-accent' : 'bg-emerald-100'
                            }`}>
                              <CheckCircle2 className={`w-3 h-3 ${paymentType === 'member' ? 'text-vibe-primary' : 'text-emerald-600'}`} />
                            </div>
                            <span className={`text-xs ${item.highlight ? 'font-bold' : ''} ${paymentType === 'member' ? 'text-white' : 'text-slate-600'}`}>
                              {item.text}
                            </span>
                          </li>
                        ))}
                      </ul>

                    </button>

                    {/* Max */}
                    <button
                      onClick={() => handlePayment('max')}
                      className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 relative ${
                        paymentType === 'max'
                          ? 'border-slate-800 bg-slate-900 text-white shadow-2xl scale-[1.02] z-10'
                          : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-lg'
                      }`}
                    >
                      {/* 徽章 */}
                      <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-black rounded-bl-xl ${
                        paymentType === 'max' ? 'bg-vibe-accent text-vibe-primary' : 'bg-slate-700 text-white'
                      }`}>
                        首月省 $60
                      </div>

                      <div className={`text-xs mb-4 ${paymentType === 'max' ? 'text-vibe-accent font-bold' : 'text-slate-500 font-bold'}`}>无限权益</div>
                      <h4 className={`text-xl font-black mb-1 ${paymentType === 'max' ? 'text-white' : 'text-slate-900'}`}>Max</h4>
                      <p className={`text-xs mb-4 ${paymentType === 'max' ? 'text-slate-300' : 'text-slate-500'}`}>适合重度 Vibe Coding 开发者</p>

                      <div className="flex items-baseline gap-1 mb-2">
                        <span className={`text-4xl font-black ${paymentType === 'max' ? 'text-white' : 'text-slate-900'}`}>$139</span>
                        <span className={`text-sm line-through ${paymentType === 'max' ? 'text-slate-400' : 'text-slate-400'}`}>$199</span>
                      </div>
                      <div className={`text-xs font-bold mb-6 ${paymentType === 'max' ? 'text-emerald-400' : 'text-emerald-600'}`}>✓ 首月 7 折 · 立省 $60</div>

                      <ul className="space-y-3 mb-6">
                        {[
                          { text: '每月 69 次 AI 代码诊断', highlight: true },
                          { text: '无限次专家咨询', highlight: true },
                          { text: '即时专家响应（30min）', highlight: true },
                          { text: '1对1 专属专家', highlight: true },
                          { text: '架构设计建议', highlight: true },
                          { text: '代码深度审查', highlight: false },
                          { text: 'VIP 专属客服', highlight: false },
                          { text: '优先处理紧急需求', highlight: false },
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              paymentType === 'max' ? 'bg-emerald-500' : 'bg-emerald-100'
                            }`}>
                              <CheckCircle2 className={`w-3 h-3 ${paymentType === 'max' ? 'text-slate-900' : 'text-emerald-600'}`} />
                            </div>
                            <span className={`text-xs ${item.highlight ? 'font-bold' : ''} ${paymentType === 'max' ? 'text-white' : 'text-slate-600'}`}>
                              {item.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  </div>

                  {/* 底部支付按钮 */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-6 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" />
                        7 天无理由退款
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        随时取消
                      </span>
                    </div>
                    <button
                      onClick={executePayment}
                      className="px-8 py-4 bg-vibe-primary text-white rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all vibe-shadow shadow-xl shadow-vibe-primary/20"
                    >
                      {paymentType === 'single' ? '支付 $6.9 开始 AI 诊断' : paymentType === 'max' ? '立即升级 Max' : '立即升级 Pro'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostRequestFlow;
