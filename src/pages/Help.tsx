import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { 
  Search, 
  MessageCircle, 
  FileText, 
  Shield, 
  CreditCard, 
  User, 
  Wrench,
  Zap,
  Users,
  Lightbulb,
  BookOpen,
  ChevronRight
} from 'lucide-react';

export const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: '开始使用',
      icon: Zap,
      articles: [
        {
          title: '什么是 VibeFello？',
          content: 'VibeFello 是一个连接非技术创始人与技术专家的平台。当您使用 AI 工具（如 ChatGPT、Claude）生成代码后遇到技术难题时，可以在这里找到专业开发者帮助您解决问题，让代码真正上线运行。\n\n核心功能包括：\n• 救援请求发布 - 遇到技术难题时快速获得帮助\n• 专家匹配 - 根据技术栈智能匹配最合适的专家\n• 安全交易 - 平台担保支付，保障双方权益\n• 代码协作 - 安全的代码分享和沟通环境'
        },
        {
          title: '如何注册账户？',
          content: '点击页面右上角的"登录/注册"按钮，输入您的邮箱和密码即可完成注册。注册后您可以发布救援请求或申请成为专家。\n\nVibeFello 提供两种身份：\n\n普通用户可以：\n• 发布救援请求\n• 浏览专家列表\n• 查看订单状态\n\n专家可以：\n• 接收救援请求\n• 提供技术服务\n• 管理收入提现'
        },
        {
          title: '发布第一个救援请求',
          content: '遇到技术难题？按照以下步骤发布请求：\n\n1. 点击"提交救援申请"按钮\n2. 详细描述您的问题\n3. 选择相关技术栈标签\n4. 设置预算范围\n5. 支付基础咨询费\n6. 等待专家响应'
        }
      ]
    },
    {
      id: 'requests',
      title: '发布请求',
      icon: FileText,
      articles: [
        {
          title: '如何发布救援请求？',
          content: '登录后点击"提交救援申请"，填写问题描述、技术栈标签、预算范围等信息。支付基础咨询费后，您的请求将展示给平台专家。'
        },
        {
          title: '基础咨询费包含什么？',
          content: '基础咨询费包含：1）多位专家的初步问题诊断；2）详细的解决方案建议；3）预估的工作量和报价。如果专家无法提供有效诊断，费用将全额退还。'
        },
        {
          title: '如何选择合适的专家？',
          content: '您可以查看专家的：1）技能标签是否匹配您的技术栈；2）历史评价和评分；3）响应速度和交付时间。建议选择有类似项目经验的专家。'
        },
        {
          title: '撰写有效的请求标题',
          content: '好的标题能让专家快速理解问题：\n\n推荐示例：\n- "Next.js 项目部署到 Vercel 后白屏"\n- "Python 爬虫被目标网站拦截，需要反反爬方案"\n- "React Native 应用 iOS 构建失败"\n\n避免示例：\n- "代码有问题"（太笼统）\n- "紧急求助！！！"（无实质内容）\n- "谁能帮我看看"（不清晰）'
        },
        {
          title: '如何描述问题',
          content: '详细的问题描述应包含：\n\n1. 预期行为 - 您希望代码如何工作\n2. 实际行为 - 目前出现了什么问题\n3. 错误信息 - 完整的报错截图或文本\n4. 复现步骤 - 如何触发这个问题\n5. 已尝试的方案 - 避免专家重复建议\n\n小提示：使用 Loom 录制屏幕演示会更直观！'
        },
        {
          title: '选择合适的预算',
          content: '合理预算能吸引更多优质专家：\n\n平台预算档位：\n- $100 - $300：适合简单的调试、配置问题（1-3小时）\n- $301 - $600：适合中等复杂度的功能修复（半天-1天）\n- $601 - $2000：适合复杂的功能开发或重构（2-5天）\n- $2000 - $6000：适合大型项目或深度优化（1-2周）\n- 面议：特殊情况灵活协商\n\n考虑因素：\n• 问题的紧急程度\n• 所需技术栈的稀缺性\n• 专家的经验水平'
        }
      ]
    },
    {
      id: 'payment',
      title: '支付与退款',
      icon: CreditCard,
      articles: [
        {
          title: '支持哪些支付方式？',
          content: '目前支持支付宝、微信支付和银行卡支付。所有交易由平台担保，确保资金安全。\n\nVibeFello 支持多种支付方式：\n• 信用卡/借记卡 - Visa、Mastercard、American Express\n• PayPal - 快速安全的在线支付\n• 银行转账 - 大额订单支持\n\n所有支付均通过加密通道处理，确保资金安全。'
        },
        {
          title: '什么情况下可以申请退款？',
          content: '以下情况可申请全额退款：1）专家未能在约定时间内交付；2）专家提供的解决方案完全无效；3）专家无故中断服务。退款申请将由平台审核处理。\n\n退款流程：\n1. 在订单详情页点击"申请退款"\n2. 填写退款原因和说明\n3. 平台审核（1-3个工作日）\n4. 退款原路返回'
        },
        {
          title: '平台服务费是多少？',
          content: '平台收取约 10% 的服务费作为平台运营费用。例如，如果您支付 $100 给专家，平台收取约 $10，专家获得约 $90。基础咨询费不额外收取服务费。\n\n平台费用透明清晰：\n• 基础咨询费 - 发布请求时支付，用于获取专家初步诊断\n• 服务费 - 选择专家后支付，平台收取约 10% 作为服务费\n• 托管机制 - 资金由平台托管，确认交付后释放给专家'
        }
      ]
    },
    {
      id: 'experts',
      title: '成为专家',
      icon: Wrench,
      articles: [
        {
          title: '如何申请成为专家？',
          content: '登录后点击"专家入驻"，填写申请表，包括：技术技能、工作经验、项目案例等。我们的团队会在 3-5 个工作日内审核您的申请。'
        },
        {
          title: '专家可以赚多少钱？',
          content: '专家收入取决于您的定价和服务数量。平台专家平均每小时收费 $30-80。优秀专家月收入可达 $1,500-5,000。'
        },
        {
          title: '专家需要遵守什么规范？',
          content: '专家需要：1）提供真实、准确的个人资料；2）在约定时间内完成服务；3）保持良好的沟通态度；4）保护用户的商业机密和代码资料；5）不得进行平台外交易。'
        }
      ]
    },
    {
      id: 'collaboration',
      title: '与专家协作',
      icon: Users,
      articles: [
        {
          title: '首次沟通技巧',
          content: '与专家建立良好合作的开端：\n\n• 主动介绍项目背景\n• 明确期望的交付标准\n• 商定沟通频率和方式\n• 确认时区和可用时间\n• 提供必要的访问权限（如需要）'
        },
        {
          title: '代码分享安全指南',
          content: '与专家分享代码时的安全建议：\n\n1. 删除敏感信息\n   • API 密钥和密钥\n   • 数据库连接字符串\n   • 密码和令牌\n\n2. 使用环境变量\n   • 将配置移到 .env 文件\n   • 提供 .env.example 作为参考\n\n3. 数据脱敏\n   • 使用假数据代替真实用户数据\n   • 隐藏个人身份信息'
        },
        {
          title: '验收与评价',
          content: '确认交付并给予反馈：\n\n验收检查清单：\n☐ 问题是否已解决\n☐ 代码是否可以正常运行\n☐ 是否收到必要的文档说明\n☐ 后续维护事项是否清晰\n\n评价建议：\n• 客观描述合作体验\n• 提及专家的专业能力\n• 分享项目成果（可选）\n• 您的评价会帮助其他用户选择专家'
        }
      ]
    },
    {
      id: 'security',
      title: '安全与隐私',
      icon: Shield,
      articles: [
        {
          title: '我的代码安全吗？',
          content: '我们采取多重安全措施：1）所有数据传输使用 SSL/TLS 加密；2）代码仅在用户和专家之间共享；3）专家需签署保密协议；4）平台不存储您的核心代码。'
        },
        {
          title: '如何保护我的商业机密？',
          content: '建议您在分享敏感信息前：1）与专家签署 NDA（保密协议）；2）仅分享必要的代码片段；3）删除敏感配置信息（如 API 密钥、数据库密码）；4）使用测试数据而非真实数据。\n\n对于商业敏感项目，建议与专家签署 NDA（保密协议）。VibeFello 提供：\n• 标准 NDA 模板\n• 电子签名功能\n• 协议执行追踪\n\n在发布请求时勾选"需要 NDA"选项，系统将自动处理协议流程。'
        },
        {
          title: '账户安全最佳实践',
          content: '保护您的 VibeFello 账户：\n\n• 启用双重认证（2FA）\n• 使用强密码并定期更换\n• 不在公共设备上保持登录\n• 定期检查登录历史\n• 及时更新关联邮箱和手机号\n• 警惕钓鱼邮件和诈骗信息'
        }
      ]
    },
    {
      id: 'best-practices',
      title: '最佳实践',
      icon: Lightbulb,
      articles: [
        {
          title: 'Vibe Coding 常见问题',
          content: 'AI 生成代码的典型问题及预防：\n\n1. 水合错误（Hydration Error）\n   • 原因：服务端和客户端渲染不一致\n   • 预防：避免在 SSR 组件中使用浏览器 API\n\n2. 环境配置问题\n   • 原因：本地和生产环境差异\n   • 预防：使用 Docker 或详细记录环境要求\n\n3. 依赖冲突\n   • 原因：AI 可能推荐不兼容的版本\n   • 预防：锁定版本号，测试后再升级'
        },
        {
          title: '如何节省时间和成本',
          content: '最大化 VibeFello 的价值：\n\n• 发布前先用 AI 尝试解决（记录尝试过程）\n• 准备最小可复现示例（Minimal Reproducible Example）\n• 提供清晰的验收标准\n• 及时响应专家的问题\n• 建立长期合作关系（优先选择熟悉的专家）'
        },
        {
          title: '推荐工具清单',
          content: '提升协作效率的工具：\n\n代码分享：\n• GitHub Gist - 快速分享代码片段\n• CodeSandbox - 在线代码演示\n• Loom - 屏幕录制说明\n\n沟通协作：\n• Telegram - 实时消息\n• Figma - 设计稿分享\n• Notion - 文档协作\n\n项目管理：\n• Trello - 任务追踪\n• Linear - 问题管理'
        }
      ]
    },
    {
      id: 'support',
      title: '联系支持',
      icon: MessageCircle,
      articles: [
        {
          title: '如何联系客服？',
          content: '您可以通过以下方式联系我们：1）发送邮件至 feedback@vibefello.com；2）加入我们的 Telegram 群组：https://t.me/+H3SnvF92Twc3YTI9；3）在 Twitter 上私信 @vibefello。'
        },
        {
          title: '响应时间是多少？',
          content: '我们承诺：1）邮件咨询 24 小时内回复；2）紧急技术问题 2 小时内响应；3）工作日 9:00-21:00 在线支持。'
        }
      ]
    }
  ];

  const filteredSections = sections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.articles.length > 0);

  const currentSection = sections.find(s => s.id === activeSection) || sections[0];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-8 px-6 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              帮助中心
            </h1>
            <p className="text-xl text-slate-600">
              常见问题解答与使用指南
            </p>
          </motion.div>
          
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索问题或关键词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-64 flex-shrink-0"
            >
              <div className="sticky top-24 bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900">文档导航</h3>
                </div>
                <nav className="p-2">
                  {sections.map((section) => {
                    const isActive = activeSection === section.id;
                    const hasResults = searchQuery === '' || filteredSections.some(s => s.id === section.id);
                    
                    if (!hasResults) return null;
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                          isActive 
                            ? 'bg-indigo-50 text-indigo-700' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <section.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span className="font-medium text-sm">{section.title}</span>
                        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>

            {/* Right Content Area */}
            <div className="flex-1 min-w-0">
              {searchQuery && filteredSections.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl">
                  <p className="text-slate-500">没有找到相关内容，请尝试其他关键词</p>
                </div>
              ) : (
                <motion.div
                  key={searchQuery ? 'search' : activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Section Header */}
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <currentSection.icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{currentSection.title}</h2>
                  </div>

                  {/* Articles */}
                  <div className="space-y-6">
                    {(searchQuery ? filteredSections.flatMap(s => s.articles) : currentSection.articles).map((article, index) => (
                      <motion.div
                        key={article.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                      >
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            {article.title}
                          </h3>
                          <div className="text-slate-600 leading-relaxed whitespace-pre-line">
                            {article.content}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
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
