import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Code2, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  BookOpen, 
  Star, 
  Clock, 
  ExternalLink, 
  Github,
  Send,
  ChevronRight,
  Users,
  User,
  Bell,
  FileText,
  ArrowLeft,
  Search,
  Zap,
  ShieldCheck,
  CreditCard,
  History,
  AlertCircle,
  MoreVertical,
  Crown,
  Trophy,
  Activity,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  userEmail: string;
  onBack?: () => void;
  initialRole?: 'user' | 'expert';
}

export const Dashboard = ({ userEmail, onBack, initialRole = 'user' }: DashboardProps) => {
  const [role, setRole] = useState<'user' | 'expert'>(initialRole);
  const [activeTab, setActiveTab] = useState<'chat' | 'audit' | 'resources' | 'booking'>('chat');
  const [showExpertProfile, setShowExpertProfile] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  
  // 会员等级定义
  type MembershipTier = 'GENESIS' | 'ANNUAL' | 'MONTHLY';
  
  const [membership, setMembership] = useState<{
    tier: MembershipTier;
    number: string;
    expiryDate?: string;
  }>({
    tier: 'GENESIS',
    number: 'VF-GEN-042',
  });

  // 陪跑历史记录状态
  const [history, setHistory] = useState<any[]>([]);

  // 自动化记录逻辑：从 LocalStorage 加载并提供添加函数
  useEffect(() => {
    const savedHistory = localStorage.getItem('vibe_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    } else {
      // 初始模拟数据
      const initialHistory = [
        { date: '03-28', title: 'Stripe 架构审计', type: 'Audit' },
        { date: '03-25', title: '1对1 咨询 (1h)', type: 'Session' },
      ];
      setHistory(initialHistory);
      localStorage.setItem('vibe_history', JSON.stringify(initialHistory));
    }
  }, []);

  const addHistoryEntry = (type: string, title: string) => {
    const newEntry = {
      date: new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }).replace('/', '-'),
      title,
      type
    };
    const updated = [newEntry, ...history];
    setHistory(updated);
    localStorage.setItem('vibe_history', JSON.stringify(updated));
  };

  // AI Audit State
  const [gitUrl, setGitUrl] = useState('');
  const [auditStatus, setAuditStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'completed'>('idle');
  const [auditReport, setAuditReport] = useState<any>(null);

  // Chat State
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'expert', text: '你好！我是你的陪跑专家 Alex。看到你最近在处理 Stripe 支付回调的问题，有什么我可以帮你的吗？', time: '10:30' },
    { role: 'user', text: '是的，我在本地测试没问题，但部署到生产环境后 webhook 总是返回 400 错误。', time: '10:32' },
    { role: 'expert', text: '这通常是由于生产环境的 Webhook Secret 没配置对，或者是签名验证逻辑在生产环境的 Body 解析上出了问题。你可以先把代码库发给我，我跑一下 AI 审计看看。', time: '10:35' },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Mock Data
  const expert = {
    name: "Alex 'Vibe' Chen",
    role: "全栈 AI 架构师",
    bio: "拥有 10 年开发经验，擅长 Vibe Coding 和 AI Agent 架构。曾帮助 50+ 创始人在 2 周内交付 MVP。",
    rating: 4.9,
    totalHours: 128,
    calendlyUrl: "https://calendly.com/vibefello-demo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    skills: ["Next.js", "Python", "AI Prompt Engineering", "Docker"]
  };

  const members = [
    { id: 1, name: "张三", email: "zhangsan@example.com", blocker: "Stripe 支付回调在生产环境不生效", status: "进行中", lastAudit: "2026-03-30" },
    { id: 2, name: "李四", email: "lisi@example.com", blocker: "Docker 镜像构建速度太慢，且无法连接数据库", status: "待处理", lastAudit: "无" },
    { id: 3, name: "王五", email: "wangwu@example.com", blocker: "需要接入 OpenAI o1 模型进行长文本推理", status: "已完成", lastAudit: "2026-03-28" },
  ];

  const resources = [
    { title: "Vibe Coding 入门指南", type: "教程", link: "#" },
    { title: "创始人必看的 50 个 AI Prompt", type: "资源", link: "#" },
    { title: "Genesis 内部 Discord 频道", type: "权限", link: "#" },
  ];

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 优化交互：分阶段执行，防止闪烁
    setAuditStatus('uploading');
    
    setTimeout(() => {
      setAuditStatus('analyzing');
    }, 1500);

    setTimeout(() => {
      setAuditStatus('completed');
      setAuditReport({
        score: 92,
        issues: ["环境变量命名不规范", "缺少生产环境的 SSL 配置", "API 路由缺少速率限制"],
        suggestions: "建议使用 .env.production 管理密钥，并增加 Redis 缓存。"
      });
      // 自动化记录
      addHistoryEntry('Audit', '完成了一次 AI 深度代码审计');
    }, 4500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setChatHistory([...chatHistory, { role: 'user', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMessage('');
    // Simulate expert reply
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'expert', text: '收到，我正在查看你的问题。', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1000);
  };

  // --- 子组件: 专家个人资料 ---
  const ExpertProfile = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-white border-2 border-foreground rounded-[2.5rem] p-8 max-w-lg w-full shadow-pop relative">
        <button onClick={() => setShowExpertProfile(false)} className="absolute top-6 right-6 text-foreground/40 hover:text-foreground">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center text-center mb-8">
          <img src={expert.avatar} alt={expert.name} className="w-24 h-24 rounded-3xl border-4 border-foreground bg-muted mb-4 shadow-pop" />
          <h2 className="text-2xl font-black uppercase tracking-tight">{expert.name}</h2>
          <p className="text-accent font-bold text-sm">{expert.role}</p>
        </div>
        <div className="space-y-6">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-2">关于专家</h4>
            <p className="text-sm font-bold leading-relaxed">{expert.bio}</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-2">擅长领域</h4>
            <div className="flex flex-wrap gap-2">
              {expert.skills.map(s => (
                <span key={s} className="px-3 py-1 bg-muted rounded-full text-[10px] font-black uppercase border border-foreground/5">{s}</span>
              ))}
            </div>
          </div>
          <button 
            onClick={() => { setShowExpertProfile(false); setActiveTab('booking'); }}
            className="candy-button w-full py-4 text-sm"
          >
            立即预约 1对1 咨询
          </button>
        </div>
      </div>
    </motion.div>
  );

  // --- 视图: 用户端 Dashboard ---
  const UserView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 左侧: 专家卡片与统计 (整合) */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white border-2 border-foreground rounded-[2rem] p-6 shadow-pop">
          <div className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-4">你的陪跑专家</div>
          <div className="flex items-center gap-4 mb-6">
            <img src={expert.avatar} alt={expert.name} className="w-14 h-14 rounded-2xl border-2 border-foreground bg-muted shadow-sm" />
            <div>
              <h3 className="font-black text-sm uppercase leading-tight">{expert.name}</h3>
              <button onClick={() => setShowExpertProfile(true)} className="text-[10px] font-black text-accent hover:underline">查看资料</button>
            </div>
          </div>
          
          <div className="pt-6 border-t border-foreground/5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-3 h-3 text-accent" />
              <div className="text-[10px] font-black uppercase tracking-widest text-foreground/40">服务统计</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/30 rounded-xl border border-foreground/5">
                <div className="text-[8px] font-black uppercase text-foreground/30 mb-1">累计咨询</div>
                <div className="text-sm font-black">12 次</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-xl border border-foreground/5">
                <div className="text-[8px] font-black uppercase text-foreground/30 mb-1">陪跑工时</div>
                <div className="text-sm font-black">6.5h</div>
              </div>
            </div>
            <div className="p-3 bg-accent/5 rounded-xl border border-accent/10">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-black uppercase text-accent">专家评分</span>
                <div className="flex items-center gap-1">
                  <Star className="w-2 h-2 text-accent fill-accent" />
                  <span className="text-[10px] font-black text-accent">4.9</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-foreground rounded-[2rem] p-6 shadow-pop">
          <div className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-4">快捷导航</div>
          <div className="space-y-2">
            {[
              { id: 'chat', label: '消息对话', icon: MessageSquare },
              { id: 'audit', label: '代码审计', icon: Code2 },
              { id: 'booking', label: '预约中心', icon: Calendar },
              { id: 'resources', label: '资源库', icon: BookOpen },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                  activeTab === tab.id 
                    ? 'bg-black text-white border-black shadow-lg' 
                    : 'bg-white text-foreground border-transparent hover:border-foreground/10 hover:bg-muted/30'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 中间: 核心功能 (对话消息/主要内容) */}
      <div className="lg:col-span-6 flex flex-col h-[calc(100vh-140px)]">
        <div className="flex-1 bg-white border-2 border-foreground rounded-[2.5rem] shadow-pop-lg overflow-hidden flex flex-col relative">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' && (
              <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col h-full">
                <div className="p-5 border-b-2 border-foreground/5 flex items-center justify-between bg-muted/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-emerald rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">与 Alex 实时对话中</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black uppercase text-foreground/30">响应时间: &lt; 15min</span>
                    <MoreVertical className="w-4 h-4 text-foreground/30 cursor-pointer hover:text-foreground transition-colors" />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-lg border-2 border-foreground flex-shrink-0 flex items-center justify-center font-black text-[10px] ${
                          msg.role === 'user' ? 'bg-accent shadow-pop-sm' : 'bg-white shadow-pop-sm'
                        }`}>
                          {msg.role === 'user' ? 'ME' : 'AX'}
                        </div>
                        <div className={`p-5 rounded-2xl text-[13px] font-bold leading-relaxed shadow-sm ${
                          msg.role === 'user' 
                            ? 'bg-black text-white rounded-tr-none' 
                            : 'bg-muted text-foreground rounded-tl-none border border-foreground/5'
                        }`}>
                          {msg.text}
                          <div className={`text-[9px] mt-3 opacity-40 font-black ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                            {msg.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-6 border-t-2 border-foreground/5 bg-white">
                  <div className="flex gap-3 relative">
                    <input 
                      type="text" 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="描述你的技术卡点，Alex 会立即协助..." 
                      className="flex-1 pl-6 pr-16 py-4 bg-muted/30 border-2 border-foreground rounded-2xl text-[13px] font-bold outline-none focus:border-accent focus:bg-white transition-all shadow-inner"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black text-white rounded-xl hover:bg-accent hover:text-black transition-all active:scale-95">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'audit' && (
              <motion.div key="audit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 h-full overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border-2 border-purple-500/20">
                      <Code2 className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-black text-2xl uppercase tracking-tight">AI 代码审计</h3>
                      <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">深度扫描你的代码库，发现潜在风险</p>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {auditStatus === 'idle' && (
                      <motion.form 
                        key="idle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleAuditSubmit} 
                        className="space-y-6"
                      >
                        <div className="bg-muted/20 p-8 rounded-[2rem] border-2 border-dashed border-foreground/10">
                          <div className="relative mb-6">
                            <Github className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-foreground/30" />
                            <input 
                              type="url" required placeholder="输入 GitHub 仓库公开地址"
                              value={gitUrl} onChange={(e) => setGitUrl(e.target.value)}
                              className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-foreground bg-white focus:border-accent outline-none font-bold text-sm shadow-pop-sm"
                            />
                          </div>
                          <p className="text-[10px] font-bold text-foreground/40 text-center mb-6">
                            * 审计过程大约需要 2-3 分钟。报告将同步给你的陪跑专家。
                          </p>
                          <button type="submit" className="candy-button w-full py-5 text-sm">
                            启动深度审计
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {(auditStatus === 'uploading' || auditStatus === 'analyzing') && (
                      <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-20 text-center"
                      >
                        <div className="relative w-24 h-24 mx-auto mb-10">
                          <div className="absolute inset-0 border-4 border-accent/10 rounded-full" />
                          <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Zap className="w-8 h-8 text-accent animate-pulse" />
                          </div>
                        </div>
                        <h4 className="font-black uppercase tracking-[0.3em] text-lg mb-2">
                          {auditStatus === 'uploading' ? '正在上传源文件...' : '正在分析架构...'}
                        </h4>
                        <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">
                          {auditStatus === 'uploading' ? '准备建立安全隧道' : '正在检查环境变量、安全漏洞与性能瓶颈'}
                        </p>
                        
                        {/* 进度条 */}
                        <div className="mt-8 max-w-xs mx-auto h-2 bg-muted rounded-full overflow-hidden border border-foreground/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: auditStatus === 'uploading' ? '40%' : '100%' }}
                            transition={{ duration: auditStatus === 'uploading' ? 1.5 : 3 }}
                            className="h-full bg-accent"
                          />
                        </div>
                      </motion.div>
                    )}

                    {auditStatus === 'completed' && auditReport && (
                      <motion.div 
                        key="completed"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                      >
                        <div className="p-8 bg-emerald/5 border-2 border-emerald/20 rounded-[2.5rem] shadow-sm">
                          <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-emerald/10 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7 text-emerald" />
                              </div>
                              <h4 className="font-black text-xl uppercase text-emerald tracking-tight">审计报告已就绪</h4>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-4xl font-black text-emerald">{auditReport.score}</div>
                              <div className="text-[10px] font-black uppercase text-emerald/40 tracking-widest">健康评分</div>
                            </div>
                          </div>
                          
                          <div className="space-y-8">
                            <div>
                              <div className="text-[11px] font-black uppercase text-foreground/40 mb-4 tracking-widest flex items-center gap-2">
                                <AlertCircle className="w-3 h-3" /> 关键风险点 ({auditReport.issues.length})
                              </div>
                              <div className="grid gap-3">
                                {auditReport.issues.map((iss: string, i: number) => (
                                  <div key={i} className="p-4 bg-white border border-emerald/10 rounded-xl text-xs font-bold flex items-center gap-3 shadow-sm">
                                    <div className="w-1.5 h-1.5 bg-emerald rounded-full" /> {iss}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="pt-8 border-t border-emerald/10">
                              <div className="text-[11px] font-black uppercase text-foreground/40 mb-4 tracking-widest">专家优化建议</div>
                              <div className="p-5 bg-white border border-emerald/10 rounded-2xl italic text-sm font-bold leading-relaxed text-foreground/70">
                                "{auditReport.suggestions}"
                              </div>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => setAuditStatus('idle')} className="w-full py-4 border-2 border-foreground rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-muted transition-colors">
                          重新发起审计
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {activeTab === 'booking' && (
              <motion.div key="booking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                <div className="p-5 border-b-2 border-foreground/5 flex items-center justify-between bg-accent/5">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-accent" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">1对1 专家预约系统</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white border border-accent/20 rounded-full">
                    <Clock className="w-3 h-3 text-accent" />
                    <span className="text-[9px] font-black uppercase text-accent tracking-widest">时长将自动计入统计</span>
                  </div>
                </div>
                <div className="flex-1 bg-muted/10 relative">
                  {/* Calendly Iframe Embedding */}
                  <iframe 
                    src="https://calendly.com/vibefello-demo?embed_domain=vibefello.com&embed_type=Inline"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title="Select a Date & Time"
                    className="absolute inset-0"
                  ></iframe>
                </div>
              </motion.div>
            )}

            {activeTab === 'resources' && (
              <motion.div key="resources" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
                {resources.map((res, i) => (
                  <a key={i} href={res.link} className="bg-white border-2 border-foreground rounded-[2rem] p-8 shadow-pop hover:-translate-y-1 transition-all group h-fit">
                    <div className="flex items-center justify-between mb-6">
                      <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[9px] font-black uppercase text-accent tracking-widest">
                        {res.type}
                      </div>
                      <BookOpen className="w-4 h-4 text-foreground/20 group-hover:text-accent transition-colors" />
                    </div>
                    <h4 className="font-black text-lg uppercase mb-6 group-hover:text-accent transition-colors leading-tight">{res.title}</h4>
                    <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 group-hover:text-foreground transition-colors">
                      立即获取资源 <ExternalLink className="ml-2 w-3.5 h-3.5" />
                    </div>
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 右侧: 会员身份与记录 (整合) */}
      <div className="lg:col-span-3 space-y-6">
        {(() => {
          // 根据等级获取配置
          const getTierConfig = (tier: MembershipTier) => {
            switch (tier) {
              case 'GENESIS':
                return {
                  bg: 'bg-gradient-to-br from-zinc-900 via-black to-zinc-900',
                  accent: 'text-accent',
                  label: 'Genesis 创始会员',
                  border: 'border-accent/30',
                  glow: 'shadow-[0_0_40px_rgba(242,125,38,0.2)]',
                  expiry: '永久有效',
                  showRenew: false,
                  icon: <Crown className="w-6 h-6 text-black" />,
                  iconBg: 'bg-accent'
                };
              case 'ANNUAL':
                return {
                  bg: 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900',
                  accent: 'text-blue-400',
                  label: '年度尊享会员',
                  border: 'border-blue-400/30',
                  glow: 'shadow-[0_0_40px_rgba(96,165,250,0.15)]',
                  expiry: '2027-04-01',
                  showRenew: true,
                  icon: <Trophy className="w-6 h-6 text-white" />,
                  iconBg: 'bg-blue-500/20'
                };
              default:
                return {
                  bg: 'bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-800',
                  accent: 'text-zinc-400',
                  label: '月度标准会员',
                  border: 'border-zinc-400/30',
                  glow: 'shadow-[0_0_20px_rgba(255,255,255,0.05)]',
                  expiry: '2026-05-01',
                  showRenew: true,
                  icon: <CreditCard className="w-6 h-6 text-white" />,
                  iconBg: 'bg-zinc-700'
                };
            }
          };

          const config = getTierConfig(membership.tier);

          return (
            <div className={`${config.bg} ${config.border} ${config.glow} border-2 text-white rounded-[2.5rem] p-8 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 -mr-20 -mt-20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
              
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className={`w-10 h-10 ${config.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                  {config.icon}
                </div>
                <div>
                  <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${config.accent}`}>{config.label}</span>
                  <div className="text-[9px] font-bold opacity-40 uppercase tracking-widest">会员编号: {membership.number}</div>
                </div>
              </div>
              
              <div className="space-y-5 relative z-10">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-40">有效期至</span>
                  <span className={`text-[11px] font-black uppercase ${membership.tier === 'GENESIS' ? config.accent : ''}`}>{config.expiry}</span>
                </div>
              </div>

              {config.showRenew ? (
                <div className="mt-8 p-5 bg-white/5 rounded-2xl border border-white/10 relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className={`w-3.5 h-3.5 ${config.accent}`} />
                    <span className={`text-[9px] font-black uppercase tracking-widest ${config.accent}`}>续费提示</span>
                  </div>
                  <p className="text-[11px] font-bold opacity-60 leading-relaxed mb-6">
                    您的会员权益即将到期。提前续费可锁定当前优惠价格。
                  </p>
                  <button className={`w-full py-4 ${membership.tier === 'ANNUAL' ? 'bg-blue-500' : 'bg-zinc-700'} text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg active:scale-95`}>
                    立即续费权益
                  </button>
                </div>
              ) : (
                <div className="mt-10 flex items-center gap-2 text-[10px] font-black uppercase text-accent/60 italic tracking-widest">
                  <Sparkles className="w-3 h-3" />
                  创始席位 永久尊享
                </div>
              )}

              {/* 快速切换预览 (仅开发模式) */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {(['GENESIS', 'ANNUAL', 'MONTHLY'] as MembershipTier[]).map(t => (
                  <button 
                    key={t} 
                    onClick={() => setMembership(prev => ({ ...prev, tier: t }))}
                    className="w-2 h-2 rounded-full bg-white/20 hover:bg-white"
                  />
                ))}
              </div>
            </div>
          );
        })()}

        <div className="bg-white border-2 border-foreground rounded-[2.5rem] p-8 shadow-pop flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
              <History className="w-4 h-4 text-foreground/40" />
            </div>
            <div className="text-[11px] font-black uppercase tracking-widest text-foreground/40">陪跑历史记录</div>
          </div>
          <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {history.length > 0 ? history.map((item, i) => (
              <div key={i} className="flex items-start gap-4 group cursor-pointer">
                <div className="text-[9px] font-black text-foreground/20 pt-1 w-8">{item.date}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-foreground/30">
                      {item.type === 'Audit' ? <ShieldCheck className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                    </span>
                    <div className="text-[11px] font-black uppercase group-hover:text-accent transition-colors">{item.title}</div>
                  </div>
                  <div className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">{item.type}</div>
                </div>
                <ChevronRight className="w-3 h-3 text-foreground/10 group-hover:text-accent transition-colors self-center" />
              </div>
            )) : (
              <div className="text-center py-10 opacity-20">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <p className="text-[10px] font-black uppercase">暂无记录</p>
              </div>
            )}
          </div>
          <button className="w-full mt-8 py-3 text-[9px] font-black uppercase tracking-widest text-foreground/30 hover:text-foreground transition-colors border-t border-foreground/5 pt-6">
            查看全部记录
          </button>
        </div>
      </div>
    </div>
  );

  // --- 视图: 专家端 Dashboard ---
  const ExpertView = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">学员管理中心</h2>
          <div className="flex items-center gap-4">
            <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">当前共有 {members.length} 位学员正在陪跑</p>
            <div className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <input type="text" placeholder="搜索学员姓名或邮箱..." className="pl-12 pr-6 py-3 bg-white border-2 border-foreground rounded-2xl text-xs font-bold outline-none focus:border-accent shadow-pop-sm w-64" />
          </div>
          <button className="p-3 bg-black text-white rounded-2xl shadow-pop-sm hover:bg-accent hover:text-black transition-all">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {members.map((m) => (
          <motion.div 
            key={m.id} 
            whileHover={{ x: 8 }}
            onClick={() => setSelectedMember(m)}
            className="bg-white border-2 border-foreground rounded-[2rem] p-8 shadow-pop cursor-pointer group flex items-center justify-between transition-all hover:border-accent"
          >
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center border-2 border-foreground font-black text-2xl shadow-pop-sm group-hover:bg-accent group-hover:rotate-3 transition-all">
                {m.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-black text-lg uppercase group-hover:text-accent transition-colors">{m.name}</h4>
                  <span className="px-2 py-0.5 bg-muted rounded text-[8px] font-black uppercase text-foreground/40">ID: {m.id}</span>
                </div>
                <p className="text-xs font-bold text-foreground/40 mb-3">{m.email}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3 text-accent" />
                    <p className="text-[10px] font-bold text-foreground/60 truncate max-w-[250px]">{m.blocker}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-12">
              <div className="hidden md:block text-right">
                <div className="text-[9px] font-black uppercase text-foreground/20 mb-2 tracking-widest">最近审计</div>
                <div className="flex items-center gap-2 justify-end">
                  <Code2 className="w-3 h-3 text-purple-500" />
                  <span className="text-[11px] font-black uppercase">{m.lastAudit}</span>
                </div>
              </div>
              <div className="text-right min-w-[100px]">
                <div className="text-[9px] font-black uppercase text-foreground/20 mb-2 tracking-widest">当前状态</div>
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border-2 ${
                  m.status === '进行中' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-muted border-foreground/5 text-foreground/40'
                }`}>{m.status}</span>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-foreground/5 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/5 transition-all">
                <ChevronRight className="w-5 h-5 text-foreground/20 group-hover:text-accent transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 学员详情弹窗 (专家端) */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: 40, scale: 0.95 }} animate={{ y: 0, scale: 1 }}
              className="bg-white border-4 border-foreground rounded-[3rem] p-10 max-w-3xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setSelectedMember(null)} className="absolute top-8 right-8 p-2 hover:bg-muted rounded-xl transition-colors">
                <ArrowLeft className="w-7 h-7" />
              </button>
              
              <div className="flex items-center gap-6 mb-12">
                <div className="w-20 h-20 bg-accent border-4 border-foreground rounded-[2rem] flex items-center justify-center font-black text-3xl text-black shadow-pop">
                  {selectedMember.name[0]}
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-1">{selectedMember.name}</h2>
                  <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">{selectedMember.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="p-6 bg-muted/30 rounded-[2rem] border-2 border-foreground/5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-4 h-4 text-accent" />
                    <div className="text-[11px] font-black uppercase text-foreground/40 tracking-widest">核心技术卡点</div>
                  </div>
                  <p className="text-sm font-bold leading-relaxed italic text-foreground/70">"{selectedMember.blocker}"</p>
                </div>
                <div className="p-6 bg-muted/30 rounded-[2rem] border-2 border-foreground/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Code2 className="w-4 h-4 text-purple-500" />
                    <div className="text-[11px] font-black uppercase text-foreground/40 tracking-widest">AI 审计历史</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black uppercase">{selectedMember.lastAudit}</p>
                    <button className="px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-black transition-all">查看报告</button>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/40">更新陪跑进度</h4>
                  <div className="h-px flex-1 bg-foreground/5 mx-6" />
                </div>
                <div className="flex gap-3">
                  {['待处理', '进行中', '已完成'].map(s => (
                    <button 
                      key={s} 
                      className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase border-2 transition-all shadow-sm ${
                        selectedMember.status === s 
                          ? 'bg-black text-white border-black scale-105 shadow-lg' 
                          : 'bg-white border-foreground/10 hover:border-accent text-foreground/40'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="text-[11px] font-black uppercase tracking-widest text-foreground/40">专家留言 / 指导意见</div>
                  <textarea placeholder="输入你对该学员的指导建议，将实时同步到学员端..." className="w-full h-32 p-6 bg-muted/20 border-2 border-foreground rounded-[2rem] text-sm font-bold outline-none focus:border-accent focus:bg-white transition-all resize-none shadow-inner" />
                </div>
                <button className="candy-button w-full py-5 text-sm mt-4 shadow-pop">
                  同步更新至学员控制台
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-foreground font-sans selection:bg-accent/30">
      {showExpertProfile && <ExpertProfile />}
      
      {/* 顶部导航 */}
      <nav className="bg-white border-b-4 border-foreground px-8 py-5 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black text-sm shadow-pop-sm">VF</div>
            <div>
              <span className="font-display font-black text-lg uppercase tracking-tighter block leading-none">VibeFello</span>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">{role === 'user' ? '学员控制台' : '专家控制台'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            {/* 角色切换 (高亮特殊设计 - 尊贵感) */}
            <div className="relative p-1.5 bg-foreground rounded-[1.5rem] flex items-center shadow-2xl border-2 border-foreground">
              <div className="absolute inset-0 bg-vibe-gradient opacity-20 blur-xl animate-pulse" />
              <button 
                onClick={() => setRole('user')}
                className={`relative z-10 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                  role === 'user' 
                    ? 'bg-white text-black shadow-[0_4px_20px_rgba(255,255,255,0.3)] scale-105' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                学员模式
              </button>
              <button 
                onClick={() => setRole('expert')}
                className={`relative z-10 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                  role === 'expert' 
                    ? 'bg-accent text-black shadow-[0_4px_20px_rgba(242,125,38,0.3)] scale-105' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                专家模式
              </button>
            </div>

            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-muted rounded-2xl border-2 border-foreground/5">
              <div className="w-2.5 h-2.5 bg-emerald rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-[11px] font-black uppercase tracking-widest text-foreground/60">{userEmail}</span>
            </div>
            
            <button 
              onClick={onBack} 
              className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-foreground/30 hover:text-destructive transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              退出
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        {role === 'user' ? <UserView /> : <ExpertView />}
      </div>
    </div>
  );
};
