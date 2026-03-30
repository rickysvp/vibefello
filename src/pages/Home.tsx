import React from 'react';
import { motion } from 'motion/react';
import { Zap, ArrowRight, AlertCircle, MessageSquare, TrendingUp, ShieldCheck, Search, ChevronRight, Star } from 'lucide-react';
import { FAQItem } from '../components/common/FAQItem';
import { MOCK_MARKETPLACE } from '../types';
import type { ExpertVerificationStatus } from '../types';

interface HomeProps {
  onStart: () => void;
  onViewPricing: () => void;
  onMarketplaceClick: (req: any) => void;
  onViewMore: () => void;
  onExpertApply: () => void;
  isLoggedIn: boolean;
  userRole: 'user' | 'expert' | null;
  expertVerificationStatus?: ExpertVerificationStatus;
}

const PROBLEM_CARDS = [
  { title: "逻辑死循环", desc: "AI 生成的代码在处理复杂业务逻辑时开始自我矛盾，修改 A 导致 B 崩溃，修改 B 又导致 A 崩溃。" },
  { title: "环境与部署难题", desc: "本地运行完美，但一到生产环境就报错。环境变量、构建配置、数据库连接... AI 无法帮您远程调试。" },
  { title: "水合与性能瓶颈", desc: "非技术用户难以理解 SSR/CSR 区别。页面闪烁、水合错误、内存泄漏让您的应用无法真正商用。" }
];

const PROCESS_STEPS = [
  { step: "01", title: "提交咨询", desc: "描述您的 Vibe Coding 困境并支付小额咨询费。" },
  { step: "02", title: "专家诊断", desc: "多位专家分析问题并提供初步解决方案与报价。" },
  { step: "03", title: "托管资金", desc: "选择专家并托管全额费用，平台提供全程担保。" },
  { step: "04", title: "上线交付", desc: "专家修复问题，确认无误后释放资金，项目上线。" }
];

const FAQS = [
  { q: "什么是 VibeFello？", a: "这是一个专为 Vibe Coder (AI 辅助开发者) 打造的专家支援平台，解决 AI 无法处理的复杂逻辑、环境配置和生产环境部署等难题。" },
  { q: "使用 VibeFello 需要付费吗？", a: "是的，平台会收取小额的基础服务费。发布需求时，您可以根据问题的难度提供预算范围，专家在初步诊断后会给出最终的解决方案评估和报价。最重要的是，最终是否支付由您决定。平台提供资金担保服务，资金将由平台托管，并在您确认专家完成工作后支付给专家，确保您的每一分钱都花在刀刃上。" },
  { q: "如果专家无法解决我的问题怎么办？", a: "如果专家在诊断阶段确认无法解决，专家服务费将全额退还。如果进入正式服务阶段，资金由平台托管，直到您确认交付，确保您的资金安全。" },
  { q: "我如何成为 VibeFello 的专家？", a: "您可以在控制台申请专家身份。我们需要验证您的技术背景和项目经验，通过审核后即可开始在 Vibe Request 大厅接单并赚取收益。" },
  { q: "平台支持哪些技术栈？", a: "我们支持 React, Next.js, Python, Node.js, AWS, Docker 等主流全栈技术，以及 AI Agent 编排、Web3 和移动端开发等前沿领域。" }
];

const TESTIMONIALS = [
  { name: "张先生", role: "某 AI 创业公司 CEO", content: "作为非技术创始人，Vibe Coding 让我快速搭建了原型，但最后的部署真的让我崩溃。VibeFello 的专家在 2 小时内就解决了我的问题，非常专业！", avatar: "https://picsum.photos/seed/user1/100/100" },
  { name: "李女士", role: "独立开发者", content: "VibeFello 的咨询费用非常合理，专家给出的诊断报告让我少走了很多弯路。以前自己摸索要好几天，现在半天就搞定了。强烈推荐给所有独立开发者。", avatar: "https://picsum.photos/seed/user2/100/100" }
];

const TAGS = ['全部', 'Frontend', 'Backend', 'SaaS', 'Game', 'Agent 编排', 'API 调试', '云部署', '环境安装', 'Mobile', 'Web3', 'Smart Contract', 'SDK 集成', 'Infrastructure', 'Skills', 'UI/UX', 'Testing', 'Security', 'DevOps', 'Data Science'];

export const Home: React.FC<HomeProps> = ({
  onStart,
  onExpertApply,
  isLoggedIn,
  userRole,
  expertVerificationStatus,
  onMarketplaceClick,
  onViewMore
}) => {
  const getExpertButtonText = () => {
    if (!isLoggedIn) return '专家入驻';
    if (userRole === 'expert') {
      return expertVerificationStatus === 'approved' ? '专家控制台' : '查看审核状态';
    }
    return '升级计划';
  };

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vibe-primary text-white mb-8 border border-slate-700 shadow-xl shadow-vibe-primary/10">
            <Zap className="w-3.5 h-3.5 text-vibe-accent fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">专业 Vibe Coding 上线救援</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-vibe-primary mb-10 leading-[0.9] tracking-tighter uppercase">
            VIBE<br />
            <span className="text-vibe-accent vibe-glow-text">FELLO</span>
          </h1>
          <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-lg font-medium">
            别让 AI 生成的代码成为项目的终点。
            <br />
            <span className="text-vibe-primary font-bold">VibeFello</span> 为非技术创始人提供专家级诊断与修复，确保您的应用从"看起来不错"到"真正上线"。
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-5 mb-16">
            {userRole !== 'expert' && (
              <button 
                onClick={onStart}
                className="w-full sm:w-auto bg-vibe-primary text-white px-12 py-6 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-slate-800 transition-all vibe-shadow flex items-center justify-center gap-3 group"
              >
                提交救援申请 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            <button 
              onClick={onExpertApply}
              className={`w-full sm:w-auto px-12 py-6 rounded-2xl text-lg font-black uppercase tracking-widest transition-all ${
                userRole === 'expert' 
                  ? 'bg-vibe-primary text-white hover:bg-slate-800 vibe-shadow' 
                  : 'bg-white text-vibe-primary border-2 border-vibe-primary hover:bg-slate-50'
              }`}
            >
              {getExpertButtonText()}
            </button>
          </div>
          <div className="flex items-center gap-12 pt-10 border-t border-slate-100">
            <div>
              <div className="text-3xl font-black text-vibe-primary tracking-tighter">1,200+</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">成功修复</div>
            </div>
            <div>
              <div className="text-3xl font-black text-vibe-primary tracking-tighter">98%</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">好评率</div>
            </div>
            <div>
              <div className="text-3xl font-black text-vibe-primary tracking-tighter">2h</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">平均响应</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative"
        >
          <div className="bg-vibe-primary rounded-3xl border border-slate-800 vibe-shadow p-10 relative z-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-vibe-accent/10 blur-3xl rounded-full" />
            <div className="flex items-center gap-5 mb-10">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                <MessageSquare className="text-vibe-accent w-7 h-7" />
              </div>
              <div>
                <h3 className="font-black text-white uppercase tracking-tight text-xl">专家诊断报告</h3>
                <p className="text-[10px] text-vibe-accent font-black uppercase tracking-[0.2em]">CASE_ID: #VR-2026-X</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-[0.2em]">问题根源</div>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">SSR 环境下 window 对象未定义导致的水合不匹配 (Hydration Mismatch)。</p>
              </div>
              <div className="p-6 bg-vibe-accent/10 rounded-2xl border border-vibe-accent/20">
                <div className="text-[10px] font-black text-vibe-accent uppercase mb-2 tracking-[0.2em]">推荐方案</div>
                <p className="text-sm text-white font-black leading-relaxed">使用 useEffect 钩子包装客户端逻辑，并添加动态导入以禁用服务端渲染。</p>
              </div>
              <div className="flex items-center justify-between pt-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/${i+10}/80/80`} className="w-10 h-10 rounded-full border-2 border-vibe-primary shadow-lg" />
                  ))}
                  <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-vibe-primary flex items-center justify-center text-[10px] font-black text-vibe-accent">+12</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3 专家在线</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-vibe-accent/20 blur-[120px] rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-vibe-glow/20 blur-[120px] rounded-full" />
        </motion.div>
      </div>

      {/* Trust Badges */}
      <div className="mb-32 flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
        {['TECH_CORP', 'VIBE_LABS', 'AI_STARTUP', 'DEV_STUDIO', 'CLOUDY_INC'].map(name => (
          <div key={name} className="text-xl font-black tracking-tighter text-slate-400">{name}</div>
        ))}
      </div>

      {/* Problem Cards */}
      <div className="mb-32">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">为什么 Vibe Coding 总是卡在最后 10%？</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {PROBLEM_CARDS.map((p, i) => (
            <div key={i} className="p-8 rounded-2xl bg-white border border-slate-100 vibe-card-shadow relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm">
                <AlertCircle className="w-5 h-5 text-vibe-accent" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{p.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Marketplace Preview */}
      <div className="mb-32">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Vibe Request</h2>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索技术栈、问题关键词..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-vibe-accent/20 focus:border-vibe-accent transition-all font-medium"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 pb-8">
          {TAGS.slice(0, 10).map(tag => (
            <button key={tag} className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition-colors whitespace-nowrap border border-slate-200/50">
              {tag}
            </button>
          ))}
        </div>
        
        <div className="space-y-4">
          {MOCK_MARKETPLACE.slice(0, 5).map((req, i) => (
            <motion.div 
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onMarketplaceClick(req)}
              className="group bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-6 hover:border-vibe-accent hover:shadow-xl hover:shadow-vibe-accent/5 transition-all cursor-pointer relative overflow-hidden vibe-card-shadow"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-vibe-accent/5 group-hover:border-vibe-accent/20 transition-colors">
                {req.tags[0] === 'Next.js' && <Zap className="w-7 h-7 text-vibe-accent" />}
                {req.tags[0] === 'Python' && <TrendingUp className="w-7 h-7 text-emerald-600" />}
                {req.tags[0] === 'React' && <Zap className="w-7 h-7 text-blue-500" />}
                {req.tags[0] === 'Firebase' && <ShieldCheck className="w-7 h-7 text-amber-500" />}
                {req.tags[0] === 'Docker' && <Zap className="w-7 h-7 text-cyan-600" />}
                {!['Next.js', 'Python', 'React', 'Firebase', 'Docker'].includes(req.tags[0]) && <MessageSquare className="w-7 h-7 text-slate-400" />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-vibe-primary group-hover:text-vibe-accent transition-colors">{req.title}</h3>
                  {req.status === '进行中' && <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-vibe-accent/10 text-vibe-accent">服务中</span>}
                  {req.status === '已完成' && <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-600">已解决</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {req.tags.map((tag: string) => (
                    <span key={tag} className="text-xs font-bold text-slate-400">#{tag}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-8 shrink-0">
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900">{req.budget}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.time}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-vibe-primary group-hover:text-vibe-accent transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button 
            onClick={onViewMore}
            className="text-slate-400 font-bold hover:text-vibe-accent transition-all flex items-center gap-2 group py-4"
          >
            查看更多 Vibe Request <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-32">
        <h2 className="text-3xl font-black text-center text-vibe-primary mb-16 uppercase tracking-tight">用户评价</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="p-10 rounded-2xl bg-white vibe-card-shadow border border-slate-100 flex flex-col md:flex-row gap-8 items-start">
              <img src={t.avatar} className="w-16 h-16 rounded-2xl object-cover shrink-0 border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
              <div>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-lg font-medium text-slate-700 mb-6 italic leading-relaxed">"{t.content}"</p>
                <div>
                  <div className="font-black text-vibe-primary uppercase tracking-tight">{t.name}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process Steps */}
      <div className="mb-32">
        <h2 className="text-3xl font-black text-center text-vibe-primary mb-16 uppercase tracking-tight">专业服务流程</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((item, i) => (
            <div key={i} className="relative group p-8 rounded-2xl hover:bg-white hover:vibe-card-shadow transition-all border border-transparent hover:border-slate-100">
              <div className="text-7xl font-black text-slate-100 absolute -top-8 -left-4 group-hover:text-vibe-accent/10 transition-colors">{item.step}</div>
              <div className="relative z-10">
                <h3 className="text-xl font-black text-vibe-primary mb-3 uppercase tracking-tight">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-32">
        <h2 className="text-3xl font-black text-center text-vibe-primary mb-16 uppercase tracking-tight">常见问题 FAQ</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQS.map((faq, i) => (
            <FAQItem key={i} faq={faq} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mb-32 bg-vibe-primary rounded-3xl p-16 text-center relative overflow-hidden vibe-shadow border border-slate-800">
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight uppercase">准备好让您的项目上线了吗？</h2>
          <p className="text-slate-400 mb-12 max-w-2xl mx-auto text-lg font-medium">
            不要在逻辑死循环中浪费时间。数千名专家随时待命，为您提供最专业的 Vibe Coding 诊断服务。
          </p>
          <button 
            onClick={onStart}
            className="bg-vibe-accent text-vibe-primary px-12 py-5 rounded-xl text-xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl shadow-vibe-accent/20 flex items-center justify-center gap-3 mx-auto group"
          >
            立即提交救援申请 <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-0 left-0 w-80 h-80 bg-vibe-accent blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-vibe-glow blur-[120px] rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
