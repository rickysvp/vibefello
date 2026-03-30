import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Search, ChevronDown, MessageCircle, FileText, Shield, CreditCard, User, Wrench } from 'lucide-react';

export const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategory, setOpenCategory] = useState<string | null>('getting-started');

  const categories = [
    {
      id: 'getting-started',
      title: '开始使用',
      icon: User,
      faqs: [
        {
          question: '什么是 VibeFello？',
          answer: 'VibeFello 是一个连接非技术创始人与技术专家的平台。当您使用 AI 工具（如 ChatGPT、Claude）生成代码后遇到技术难题时，可以在这里找到专业开发者帮助您解决问题，让代码真正上线运行。'
        },
        {
          question: '如何注册账户？',
          answer: '点击页面右上角的"登录/注册"按钮，输入您的邮箱和密码即可完成注册。注册后您可以发布救援请求或申请成为专家。'
        },
        {
          question: 'VibeFello 适合谁使用？',
          answer: 'VibeFello 主要面向：1）使用 AI 编程工具但遇到技术瓶颈的非技术创始人；2）有技术能力、希望帮助他人的开发者；3）需要快速解决特定技术问题的创业团队。'
        }
      ]
    },
    {
      id: 'requests',
      title: '发布请求',
      icon: FileText,
      faqs: [
        {
          question: '如何发布救援请求？',
          answer: '登录后点击"提交救援申请"，填写问题描述、技术栈标签、预算范围等信息。支付基础咨询费后，您的请求将展示给平台专家。'
        },
        {
          question: '基础咨询费包含什么？',
          answer: '基础咨询费包含：1）多位专家的初步问题诊断；2）详细的解决方案建议；3）预估的工作量和报价。如果专家无法提供有效诊断，费用将全额退还。'
        },
        {
          question: '如何选择合适的专家？',
          answer: '您可以查看专家的：1）技能标签是否匹配您的技术栈；2）历史评价和评分；3）响应速度和交付时间。建议选择有类似项目经验的专家。'
        }
      ]
    },
    {
      id: 'payment',
      title: '支付与退款',
      icon: CreditCard,
      faqs: [
        {
          question: '支持哪些支付方式？',
          answer: '目前支持支付宝、微信支付和银行卡支付。所有交易由平台担保，确保资金安全。'
        },
        {
          question: '什么情况下可以申请退款？',
          answer: '以下情况可申请全额退款：1）专家未能在约定时间内交付；2）专家提供的解决方案完全无效；3）专家无故中断服务。退款申请将由平台审核处理。'
        },
        {
          question: '平台服务费是多少？',
          answer: '平台收取服务费用的 10% 作为平台服务费。例如，如果您支付 ¥500 给专家，平台收取 ¥50，专家获得 ¥450。基础咨询费不额外收取服务费。'
        }
      ]
    },
    {
      id: 'experts',
      title: '成为专家',
      icon: Wrench,
      faqs: [
        {
          question: '如何申请成为专家？',
          answer: '登录后点击"专家入驻"，填写申请表，包括：技术技能、工作经验、项目案例等。我们的团队会在 3-5 个工作日内审核您的申请。'
        },
        {
          question: '专家可以赚多少钱？',
          answer: '专家收入取决于您的定价和服务数量。平台专家平均每小时收费 ¥200-500。优秀专家月收入可达 ¥10,000-30,000。'
        },
        {
          question: '专家需要遵守什么规范？',
          answer: '专家需要：1）提供真实、准确的个人资料；2）在约定时间内完成服务；3）保持良好的沟通态度；4）保护用户的商业机密和代码资料；5）不得进行平台外交易。'
        }
      ]
    },
    {
      id: 'security',
      title: '安全与隐私',
      icon: Shield,
      faqs: [
        {
          question: '我的代码安全吗？',
          answer: '我们采取多重安全措施：1）所有数据传输使用 SSL/TLS 加密；2）代码仅在用户和专家之间共享；3）专家需签署保密协议；4）平台不存储您的核心代码。'
        },
        {
          question: '如何保护我的商业机密？',
          answer: '建议您在分享敏感信息前：1）与专家签署 NDA（保密协议）；2）仅分享必要的代码片段；3）删除敏感配置信息（如 API 密钥、数据库密码）；4）使用测试数据而非真实数据。'
        }
      ]
    },
    {
      id: 'support',
      title: '联系支持',
      icon: MessageCircle,
      faqs: [
        {
          question: '如何联系客服？',
          answer: '您可以通过以下方式联系我们：1）发送邮件至 feedback@vibefello.com；2）加入我们的 Telegram 群组：https://t.me/+H3SnvF92Twc3YTI9；3）在 Twitter 上私信 @vibefello。'
        },
        {
          question: '响应时间是多少？',
          answer: '我们承诺：1）邮件咨询 24 小时内回复；2）紧急技术问题 2 小时内响应；3）工作日 9:00-21:00 在线支持。'
        }
      ]
    }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
          >
            帮助中心
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 mb-8"
          >
            常见问题解答，帮您快速上手 VibeFello
          </motion.p>
          
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索问题..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {filteredCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="mb-8"
            >
              <button
                onClick={() => setOpenCategory(openCategory === category.id ? null : category.id)}
                className="w-full flex items-center justify-between p-6 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{category.title}</h2>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    openCategory === category.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openCategory === category.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-4">
                      {category.faqs.map((faq, faqIndex) => (
                        <div
                          key={faqIndex}
                          className="p-6 bg-slate-50 rounded-xl border border-slate-100"
                        >
                          <h3 className="font-bold text-slate-900 mb-3">{faq.question}</h3>
                          <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">没有找到相关问题，请尝试其他关键词</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">还有其他问题？</h2>
          <p className="text-slate-600 mb-8">
            如果您没有找到答案，欢迎直接联系我们
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:feedback@vibefello.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              发送邮件
            </a>
            <a
              href="https://t.me/+H3SnvF92Twc3YTI9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium hover:border-indigo-300 transition-colors"
            >
              加入 Telegram
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Help;
