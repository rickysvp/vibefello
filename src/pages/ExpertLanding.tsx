import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { 
  DollarSign, 
  Clock, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  CheckCircle2,
  ArrowRight,
  Star,
  Briefcase,
  Globe,
  Award
} from 'lucide-react';

export const ExpertLanding: React.FC = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: '高额收入',
      description: '平台专家平均时薪 $50-150，优秀专家月收入可达 $5,000-15,000',
      highlight: '$8,500',
      highlightLabel: '平均月收入'
    },
    {
      icon: Clock,
      title: '时间自由',
      description: '自主选择项目，灵活安排工作时间，全职兼职皆可',
      highlight: '100%',
      highlightLabel: '时间自主权'
    },
    {
      icon: Users,
      title: '优质客户',
      description: '平台汇聚全球非技术创始人，项目需求明确，沟通高效',
      highlight: '2,000+',
      highlightLabel: '月活客户'
    },
    {
      icon: TrendingUp,
      title: '持续成长',
      description: '接触各类创新项目，拓展技术视野，建立个人品牌',
      highlight: '95%',
      highlightLabel: '好评率'
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: '专业信息',
      description: '填写真实姓名、技术领域、技术栈、开发语言和 Vibe Coding 经验等信息'
    },
    {
      step: '02',
      title: '身份验证',
      description: '上传身份证或护照等证件进行身份验证，确保平台安全'
    },
    {
      step: '03',
      title: '服务协议',
      description: '阅读并同意 VibeFello 专家服务协议，确认独立承包商关系'
    },
    {
      step: '04',
      title: '订阅计划',
      description: '选择适合您的订阅计划，支付费用后正式成为平台专家'
    },
    {
      step: '05',
      title: '开始服务',
      description: '平台根据技术栈智能匹配救援请求，您可以选择感兴趣的项目进行报价和服务'
    }
  ];

  const requirements = [
    {
      title: '技术能力',
      items: [
        '精通至少一门主流编程语言',
        '有 2 年以上实际开发经验',
        '熟悉现代开发框架和工具链',
        '具备独立解决复杂技术问题的能力'
      ]
    },
    {
      title: '服务态度',
      items: [
        '良好的沟通能力和耐心',
        '能够按时交付高质量成果',
        '尊重客户，保护商业机密',
        '积极主动，乐于分享技术知识'
      ]
    },
    {
      title: '平台规范',
      items: [
        '提供真实、准确的个人资料',
        '遵守平台服务条款和行为准则',
        '不进行平台外交易',
        '维护平台声誉，提供优质服务'
      ]
    }
  ];

  const faqs = [
    {
      question: '入驻需要收费吗？',
      answer: '专家入驻需要选择订阅计划，费用为 $39-299/月。不同计划对应不同的接单额度和平台服务费比例，具体请参考订阅计划详情。'
    },
    {
      question: '我需要投入多少时间？',
      answer: '完全由您决定。您可以根据自己的时间安排选择项目，全职专家每月可处理 10-20 个项目，兼职专家每月处理 2-5 个项目都可以。不同订阅计划有不同的接单额度限制。'
    },
    {
      question: '如何定价我的服务？',
      answer: '您可以自主定价。平台建议时薪范围 $50-150，具体取决于您的经验、技术栈稀缺性和项目复杂度。新手可以从 $50/小时开始，积累经验后逐步提升。'
    },
    {
      question: '平台如何保障专家权益？',
      answer: '平台提供多重保障：1）客户支付的费用由平台托管，服务完成后按结算周期释放；2）完善的争议处理机制；3）客户评价系统，优质专家获得更多曝光；4）平台承担客户违约风险。'
    },
    {
      question: '我需要哪些技术栈？',
      answer: '平台需求涵盖广泛：前端（React/Vue/Next.js）、后端（Node.js/Python/Go）、移动开发（React Native/Flutter）、AI 集成（OpenAI API/LangChain）、Web3（Solidity）等。只要您精通任一领域，都欢迎申请。'
    },
    {
      question: '平台服务费是多少？',
      answer: '平台服务费根据订阅计划不同而不同：Starter 计划约 20%，Pro 计划约 15%，Elite 计划约 10%。服务费将从您的订单收入中自动扣除。'
    },
    {
      question: '结算周期是多久？',
      answer: '不同订阅计划有不同的结算周期：Starter 计划 15 天，Pro 和 Elite 计划 7 天。'
    }
  ];

  const testimonials = [
    {
      quote: '加入 VibeFello 3 个月，我已经帮助 20 多个创业者解决了技术难题。收入稳定的同时，还能接触到各种创新项目，非常有成就感。',
      author: '张伟',
      role: '全栈工程师',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      earnings: '$12,000/月'
    },
    {
      quote: '作为兼职专家，我利用周末时间每月能完成 3-4 个项目，额外收入 $3,000 左右。最重要的是这些项目都很有趣，比做外包有意思多了。',
      author: '王磊',
      role: '移动端开发专家',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      earnings: '$3,500/月'
    },
    {
      quote: '平台客户质量很高，需求明确，沟通顺畅。而且 Vibe Coding 的项目都很有挑战性，让我保持技术敏感度，对职业发展很有帮助。',
      author: '刘洋',
      role: 'AI 系统架构师',
      avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face',
      earnings: '$15,000/月'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        activeTab="home"
        onTabChange={() => {}}
        isLoggedIn={false}
        userRole={null}
        userTier="free"
        onLoginClick={() => {}}
        onLogout={() => {}}
      />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
                <Briefcase className="w-4 h-4" />
                专家招募中
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                技术变现<br />
                <span className="text-indigo-600">让能力产生价值</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                加入 VibeFello，成为 Vibe Coding 救援专家。<br />
                帮助非技术创始人解决技术难题，获得丰厚回报。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/expert-onboarding"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                >
                  立即申请入驻
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:border-indigo-300 transition-colors"
                >
                  了解入驻流程
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">本月专家总收入</div>
                    <div className="text-3xl font-black text-slate-900">$128,450</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="font-medium text-slate-700">平均时薪</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900">$85</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-slate-700">活跃专家</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900">500+</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="font-medium text-slate-700">专家好评率</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900">4.9/5</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-slate-700">订阅计划</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900">$39-299/月</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">为什么选择 VibeFello</h2>
            <p className="text-xl text-slate-600">成为专家，享受这些独特优势</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-indigo-200 transition-colors"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-3xl font-black text-indigo-600 mb-1">{benefit.highlight}</div>
                <div className="text-sm text-slate-500 mb-4">{benefit.highlightLabel}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">入驻流程</h2>
            <p className="text-xl text-slate-600">简单五步，开始您的专家之旅</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-6xl font-black text-indigo-100 mb-4">{step.step}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-indigo-100 -ml-4" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">入驻要求</h2>
            <p className="text-xl text-slate-600">我们期待这样的您加入</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {requirements.map((req, index) => (
              <motion.div
                key={req.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-slate-200"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-6">{req.title}</h3>
                <ul className="space-y-4">
                  {req.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">专家心声</h2>
            <p className="text-xl text-slate-400">听听已经入驻的专家怎么说</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold">{testimonial.author}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-slate-300 mb-4 leading-relaxed">{testimonial.quote}</p>
                <div className="text-indigo-400 font-bold">{testimonial.earnings}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">常见问题</h2>
            <p className="text-xl text-slate-600">关于专家入驻的疑问解答</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-slate-50 rounded-xl p-6 border border-slate-100"
              >
                <h3 className="font-bold text-slate-900 mb-3">{faq.question}</h3>
                <p className="text-slate-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-black mb-6">准备好开始了吗？</h2>
          <p className="text-xl text-white/80 mb-8">
            加入 500+ 专家，一起帮助非技术创始人实现创业梦想。选择适合您的订阅计划，开启专家变现之旅。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/expert-onboarding"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-slate-100 transition-colors"
            >
              立即申请入驻
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="mailto:feedback@vibefello.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors"
            >
              联系我们咨询
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExpertLanding;
