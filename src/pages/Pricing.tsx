import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, ShieldCheck, Clock, Wallet, X } from 'lucide-react';

interface PricingProps {
  userRole: 'user' | 'expert' | null;
  userTier: 'free' | 'pro' | 'max';
  onUpgrade?: (tier: 'pro' | 'max') => void;
}

interface Plan {
  tier: string;
  subtitle: string;
  price: string;
  period: string;
  description: string;
  features: { text: string; highlight: boolean }[];
  notIncluded: string[];
  cta: string;
  popular: boolean;
  badge: string | null;
  savings?: string;
}

const USER_PLANS: Plan[] = [
  {
    tier: "按次咨询",
    subtitle: "灵活付费",
    price: "$9.9",
    period: "每次咨询",
    description: "适合偶尔需要帮助的用户",
    features: [
      { text: "1 次 AI 代码诊断", highlight: false },
      { text: "1 次专家咨询机会", highlight: false },
      { text: "标准响应速度（24h）", highlight: false },
      { text: "社区支持", highlight: false },
    ],
    notIncluded: [],
    cta: "按次支付",
    popular: false,
    badge: null,
    savings: null
  },
  {
    tier: "Pro",
    subtitle: "最受欢迎",
    price: "$39",
    period: "每月",
    description: "Vibe Coding 新手的最佳选择",
    features: [
      { text: "每月 10 次 AI 代码诊断", highlight: true },
      { text: "每月 10 次专家咨询", highlight: true },
      { text: "优先专家匹配（2h内）", highlight: true },
      { text: "完整诊断报告下载", highlight: false },
      { text: "技术文档支持", highlight: false },
      { text: "专属咨询通道", highlight: false },
    ],
    notIncluded: [],
    cta: "立即升级",
    popular: true,
    badge: "省 $12/月",
    savings: "比单次省 $4.2/次"
  },
  {
    tier: "Max",
    subtitle: "无限权益",
    price: "$199",
    period: "每月",
    description: "适合重度 Vibe Coding 开发者",
    features: [
      { text: "每月 69 次 AI 代码诊断", highlight: true },
      { text: "无限次专家咨询", highlight: true },
      { text: "即时专家响应（30min）", highlight: true },
      { text: "1对1 专属专家", highlight: true },
      { text: "架构设计建议", highlight: true },
      { text: "代码深度审查", highlight: false },
      { text: "VIP 专属客服", highlight: false },
      { text: "优先处理紧急需求", highlight: false },
    ],
    notIncluded: [],
    cta: "立即升级",
    popular: false,
    badge: "省 $60/月",
    savings: "重度用户首选，无后顾之忧"
  }
];

const EXPERT_PLANS: Plan[] = [
  {
    tier: "Starter",
    subtitle: "入门",
    price: "$19",
    period: "每月",
    description: "开始您的专家变现之旅",
    features: [
      { text: "每月 4 单接单额度", highlight: false },
      { text: "基础专家标识", highlight: false },
      { text: "标准结算周期", highlight: false },
      { text: "社区支持", highlight: false },
    ],
    notIncluded: [],
    cta: "立即订阅",
    popular: false,
    badge: null
  },
  {
    tier: "Pro 专家",
    subtitle: "专业",
    price: "$69",
    period: "每月",
    description: "提升接单能力，增加收入",
    features: [
      { text: "每月 20 单接单额度", highlight: true },
      { text: "Pro 专家勋章", highlight: true },
      { text: "优先推荐展示", highlight: true },
      { text: "快速结算周期", highlight: false },
      { text: "专属客服支持", highlight: false },
    ],
    notIncluded: [],
    cta: "立即订阅",
    popular: true,
    badge: "最受欢迎"
  },
  {
    tier: "Master",
    subtitle: "大师",
    price: "$299",
    period: "每月",
    description: "顶级专家的专属特权",
    features: [
      { text: "无限接单额度", highlight: true },
      { text: "Master 顶级勋章", highlight: true },
      { text: "首页推荐位", highlight: true },
      { text: "即时结算", highlight: true },
      { text: "VIP 专属活动", highlight: false },
    ],
    notIncluded: [],
    cta: "立即订阅",
    popular: false,
    badge: "顶级"
  }
];

const FAQS = [
  { q: "AI 诊断次数有限制吗？", a: "按次付费含 1 次，Pro 会员每月 10 次，Max 会员每月 69 次。未使用次数不累积。" },
  { q: "专家咨询和 AI 诊断有什么区别？", a: "AI 诊断自动分析代码问题，专家咨询由真人专家提供深度解决方案和代码修复。" },
  { q: "可以随时取消订阅吗？", a: "可以，您可以随时取消，次月生效。当月已支付的会员费用不退还。" },
  { q: "未使用的次数会累积吗？", a: "不会，Pro 和 Max 的每月次数当月有效，不累积到下月。" }
];

export const Pricing: React.FC<PricingProps> = ({ userRole, userTier, onUpgrade }) => {
  const isExpertView = userRole === 'expert';
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const plans = isExpertView ? EXPERT_PLANS : USER_PLANS;

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessingPayment(false);
    setShowPaymentModal(false);
    const tier = selectedPlan === 'Pro' ? 'pro' : selectedPlan === 'Max' ? 'max' : 'free';
    onUpgrade?.(tier as 'pro' | 'max');
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* 核心价值主张 */}
      {!isExpertView && (
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-vibe-accent/10 rounded-full border border-vibe-accent/20 mb-6">
            <Sparkles className="w-4 h-4 text-vibe-accent" />
            <span className="text-sm font-bold text-vibe-primary">选择适合您的计划</span>
          </div>
          <h3 className="text-3xl font-black mb-4 text-slate-900">解决 Vibe Coding 最后 10% 的上线难题</h3>
          <p className="text-lg text-slate-500 mb-6">
            AI 帮你写代码，我们帮你解决 AI 解决不了的问题。部署失败、性能瓶颈、安全漏洞，专家 2 小时内介入。
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {['部署问题', '性能优化', '安全漏洞', '架构设计'].map(item => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 价格卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {plans.map((plan, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-3xl overflow-hidden ${
              plan.popular 
                ? 'bg-vibe-primary text-white ring-4 ring-vibe-accent/30 scale-105 z-10' 
                : 'bg-white border border-slate-200'
            }`}
          >
            {plan.badge && (
              <div className="absolute top-0 right-0 bg-vibe-accent text-vibe-primary px-4 py-1 text-xs font-black rounded-bl-2xl">
                {plan.badge}
              </div>
            )}

            <div className="p-8 flex flex-col h-full">
              <div className="mb-6">
                <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${plan.popular ? 'text-vibe-accent' : 'text-slate-400'}`}>
                  {plan.subtitle}
                </div>
                <h3 className={`text-2xl font-black ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{plan.tier}</h3>
                <p className={`text-sm mt-1 ${plan.popular ? 'text-slate-300' : 'text-slate-500'}`}>{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className={`text-5xl font-black ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                  <span className={`text-sm font-bold ${plan.popular ? 'text-slate-400' : 'text-slate-400'}`}>/{plan.period}</span>
                </div>
                {!isExpertView && plan.savings && (
                  <p className={`text-sm mt-2 ${plan.popular ? 'text-vibe-accent' : 'text-emerald-600'}`}>✓ {plan.savings}</p>
                )}
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.popular ? 'bg-vibe-accent' : 'bg-emerald-100'}`}>
                      <CheckCircle2 className={`w-3 h-3 ${plan.popular ? 'text-vibe-primary' : 'text-emerald-600'}`} />
                    </div>
                    <span className={`text-sm ${feature.highlight ? (plan.popular ? 'text-white font-bold' : 'text-slate-900 font-bold') : (plan.popular ? 'text-slate-300' : 'text-slate-600')}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => {
                  setSelectedPlan(plan.tier);
                  setShowPaymentModal(true);
                }}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all mt-auto ${
                  plan.popular 
                    ? 'bg-vibe-accent text-vibe-primary hover:bg-vibe-accent/90 shadow-lg shadow-vibe-accent/20' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 信任保障 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-slate-900 rounded-3xl text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-vibe-accent/20 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-vibe-accent" />
            </div>
            <h3 className="text-xl font-black">7 天无理由退款</h3>
          </div>
          <p className="text-slate-400 leading-relaxed">
            购买后 7 天内，如未使用任何专家咨询服务，可申请全额退款。让您零风险体验。
          </p>
        </div>

        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-vibe-accent/10 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-vibe-accent" />
            </div>
            <h3 className="text-xl font-black text-slate-900">随时取消订阅</h3>
          </div>
          <p className="text-slate-500 leading-relaxed">
            无长期合约，您可以随时取消订阅，次月生效。剩余未使用的咨询次数当月有效。
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <h3 className="text-2xl font-black text-slate-900 text-center mb-8">常见问题</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {FAQS.map((faq, i) => (
            <div key={i} className="p-5 bg-white rounded-xl border border-slate-200">
              <p className="font-bold text-slate-900 mb-2">{faq.q}</p>
              <p className="text-sm text-slate-500">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 支付弹窗 */}
      <AnimatePresence>
        {showPaymentModal && selectedPlan && (
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
              className="relative bg-white w-full max-w-md rounded-2xl p-8 vibe-shadow"
            >
              {!isProcessingPayment && (
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              )}

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
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-vibe-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-vibe-accent" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">确认升级</h3>
                    <p className="text-slate-500">您选择了 <span className="font-bold text-vibe-primary">{selectedPlan}</span> 计划</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-600">计划费用</span>
                      <span className="font-bold text-slate-900">
                        {selectedPlan === '按次咨询' ? '$6.9' : selectedPlan === 'Pro' ? '$39/月' : '$199/月'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">首月优惠</span>
                      <span className="text-emerald-600 font-bold">
                        {selectedPlan === '按次咨询' ? '-$3' : selectedPlan === 'Pro' ? '-$12' : '-$60'}
                      </span>
                    </div>
                    <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between items-center">
                      <span className="font-bold text-slate-900">实付金额</span>
                      <span className="text-2xl font-black text-vibe-primary">
                        {selectedPlan === '按次咨询' ? '$6.9' : selectedPlan === 'Pro' ? '$27' : '$139'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    className="w-full py-4 bg-vibe-primary text-white rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all vibe-shadow"
                  >
                    确认支付
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pricing;
