import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { 
  Search, 
  ChevronDown, 
  BookOpen, 
  Zap, 
  Shield, 
  Users, 
  FileText,
  Settings,
  ExternalLink,
  CreditCard,
  MessageCircle,
  Lightbulb
} from 'lucide-react';

export const Docs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openSection, setOpenSection] = useState<string | null>('quickstart');

  const docSections = [
    {
      id: 'quickstart',
      title: '快速开始',
      icon: Zap,
      description: '5分钟了解 VibeFello 的核心功能',
      articles: [
        {
          title: '平台概述',
          content: 'VibeFello 是一个连接非技术创始人与技术专家的平台。我们的使命是让每一个有想法的人都能将创意转化为现实。\n\n核心功能包括：\n• 救援请求发布 - 遇到技术难题时快速获得帮助\n• 专家匹配 - 根据技术栈智能匹配最合适的专家\n• 安全交易 - 平台担保支付，保障双方权益\n• 代码协作 - 安全的代码分享和沟通环境',
        },
        {
          title: '用户注册与登录',
          content: 'VibeFello 提供两种身份：普通用户和专家。\n\n普通用户可以：\n• 发布救援请求\n• 浏览专家列表\n• 查看订单状态\n\n专家可以：\n• 接收救援请求\n• 提供技术服务\n• 管理收入提现',
        },
        {
          title: '发布第一个救援请求',
          content: '遇到技术难题？按照以下步骤发布请求：\n\n1. 点击"提交救援申请"按钮\n2. 详细描述您的问题\n3. 选择相关技术栈标签\n4. 设置预算范围\n5. 支付基础咨询费\n6. 等待专家响应',
        }
      ]
    },
    {
      id: 'account',
      title: '账户管理',
      icon: Users,
      description: '管理您的个人信息和账户设置',
      articles: [
        {
          title: '完善个人资料',
          content: '完整的个人资料有助于专家更好地了解您的需求：\n\n• 上传真实头像 - 增加信任度\n• 填写公司/项目名称 - 帮助专家理解业务背景\n• 添加技术栈偏好 - 便于匹配相关专家\n• 设置时区和语言 - 确保沟通顺畅',
        },
        {
          title: '修改密码和安全设置',
          content: '保护账户安全的重要措施：\n\n• 定期更换密码（建议每3个月）\n• 启用双重认证（2FA）\n• 绑定手机和邮箱\n• 查看登录历史，发现异常及时处理',
        },
        {
          title: '通知设置',
          content: '自定义您接收通知的方式：\n\n• 邮件通知 - 订单状态更新、专家消息\n• 站内消息 - 实时推送\n• Telegram 通知 - 绑定后接收即时消息\n• 通知频率 - 实时、每日摘要或关闭',
        }
      ]
    },
    {
      id: 'payment',
      title: '支付与账单',
      icon: CreditCard,
      description: '了解支付流程和费用说明',
      articles: [
        {
          title: '支持的支付方式',
          content: 'VibeFello 支持多种支付方式：\n\n• 信用卡/借记卡 - Visa、Mastercard、American Express\n• PayPal - 快速安全的在线支付\n• 银行转账 - 大额订单支持\n\n所有支付均通过加密通道处理，确保资金安全。',
        },
        {
          title: '费用说明',
          content: '平台费用透明清晰：\n\n• 基础咨询费 - 发布请求时支付，用于获取专家初步诊断\n• 服务费 - 选择专家后支付，平台收取约 10% 作为服务费\n• 托管机制 - 资金由平台托管，确认交付后释放给专家\n\n具体费率会在交易前明确告知。',
        },
        {
          title: '申请退款',
          content: '以下情况可申请退款：\n\n• 专家未能在约定时间内交付\n• 专家提供的解决方案完全无效\n• 专家无故中断服务\n\n退款流程：\n1. 在订单详情页点击"申请退款"\n2. 填写退款原因和说明\n3. 平台审核（1-3个工作日）\n4. 退款原路返回',
        }
      ]
    },
    {
      id: 'requests',
      title: '发布与管理请求',
      icon: FileText,
      description: '学习如何高效发布和管理救援请求',
      articles: [
        {
          title: '撰写有效的请求标题',
          content: '好的标题能让专家快速理解问题：\n\n推荐示例：\n- "Next.js 项目部署到 Vercel 后白屏"\n- "Python 爬虫被目标网站拦截，需要反反爬方案"\n- "React Native 应用 iOS 构建失败"\n\n避免示例：\n- "代码有问题"（太笼统）\n- "紧急求助！！！"（无实质内容）\n- "谁能帮我看看"（不清晰）',
        },
        {
          title: '如何描述问题',
          content: '详细的问题描述应包含：\n\n1. 预期行为 - 您希望代码如何工作\n2. 实际行为 - 目前出现了什么问题\n3. 错误信息 - 完整的报错截图或文本\n4. 复现步骤 - 如何触发这个问题\n5. 已尝试的方案 - 避免专家重复建议\n\n小提示：使用 Loom 录制屏幕演示会更直观！',
        },
        {
          title: '选择合适的预算',
          content: '合理预算能吸引更多优质专家：\n\n参考定价：\n• 简单问题（1-2小时）：$30-60\n• 中等复杂度（3-5小时）：$80-150\n• 复杂问题（5小时+）：$150+\n\n考虑因素：\n• 问题的紧急程度\n• 所需技术栈的稀缺性\n• 专家的经验水平',
        }
      ]
    },
    {
      id: 'collaboration',
      title: '与专家协作',
      icon: MessageCircle,
      description: '建立高效的合作关系',
      articles: [
        {
          title: '首次沟通技巧',
          content: '与专家建立良好合作的开端：\n\n• 主动介绍项目背景\n• 明确期望的交付标准\n• 商定沟通频率和方式\n• 确认时区和可用时间\n• 提供必要的访问权限（如需要）',
        },
        {
          title: '代码分享安全指南',
          content: '与专家分享代码时的安全建议：\n\n1. 删除敏感信息\n   • API 密钥和密钥\n   • 数据库连接字符串\n   • 密码和令牌\n\n2. 使用环境变量\n   • 将配置移到 .env 文件\n   • 提供 .env.example 作为参考\n\n3. 数据脱敏\n   • 使用假数据代替真实用户数据\n   • 隐藏个人身份信息',
        },
        {
          title: '验收与评价',
          content: '确认交付并给予反馈：\n\n验收检查清单：\n☐ 问题是否已解决\n☐ 代码是否可以正常运行\n☐ 是否收到必要的文档说明\n☐ 后续维护事项是否清晰\n\n评价建议：\n• 客观描述合作体验\n• 提及专家的专业能力\n• 分享项目成果（可选）\n• 您的评价会帮助其他用户选择专家',
        }
      ]
    },
    {
      id: 'security',
      title: '安全与隐私',
      icon: Shield,
      description: '保护您的代码和数据安全',
      articles: [
        {
          title: 'NDA 保密协议',
          content: '对于商业敏感项目，建议与专家签署 NDA（保密协议）。\n\nVibeFello 提供：\n• 标准 NDA 模板\n• 电子签名功能\n• 协议执行追踪\n\n在发布请求时勾选"需要 NDA"选项，系统将自动处理协议流程。',
        },
        {
          title: '账户安全最佳实践',
          content: '保护您的 VibeFello 账户：\n\n• 启用双重认证（2FA）\n• 使用强密码并定期更换\n• 不在公共设备上保持登录\n• 定期检查登录历史\n• 及时更新关联邮箱和手机号\n• 警惕钓鱼邮件和诈骗信息',
        },
        {
          title: '数据保护措施',
          content: '我们采取的多重安全措施：\n\n• 所有数据传输使用 SSL/TLS 加密\n• 代码仅在用户和专家之间共享\n• 专家需签署保密协议\n• 平台不存储您的核心代码\n• 定期安全审计和漏洞扫描',
        }
      ]
    },
    {
      id: 'best-practices',
      title: '最佳实践',
      icon: Lightbulb,
      description: '提高成功率的实用技巧',
      articles: [
        {
          title: 'Vibe Coding 常见问题',
          content: 'AI 生成代码的典型问题及预防：\n\n1. 水合错误（Hydration Error）\n   • 原因：服务端和客户端渲染不一致\n   • 预防：避免在 SSR 组件中使用浏览器 API\n\n2. 环境配置问题\n   • 原因：本地和生产环境差异\n   • 预防：使用 Docker 或详细记录环境要求\n\n3. 依赖冲突\n   • 原因：AI 可能推荐不兼容的版本\n   • 预防：锁定版本号，测试后再升级',
        },
        {
          title: '如何节省时间和成本',
          content: '最大化 VibeFello 的价值：\n\n• 发布前先用 AI 尝试解决（记录尝试过程）\n• 准备最小可复现示例（Minimal Reproducible Example）\n• 提供清晰的验收标准\n• 及时响应专家的问题\n• 建立长期合作关系（优先选择熟悉的专家）',
        },
        {
          title: '推荐工具清单',
          content: '提升协作效率的工具：\n\n代码分享：\n• GitHub Gist - 快速分享代码片段\n• CodeSandbox - 在线代码演示\n• Loom - 屏幕录制说明\n\n沟通协作：\n• Telegram - 实时消息\n• Figma - 设计稿分享\n• Notion - 文档协作\n\n项目管理：\n• Trello - 任务追踪\n• Linear - 问题管理',
        }
      ]
    },
    {
      id: 'resources',
      title: '资源中心',
      icon: BookOpen,
      description: '模板、检查清单和参考资料',
      articles: [
        {
          title: '发布请求检查清单',
          content: '发布前确认以下事项：\n\n代码准备：\n☐ 已移除敏感信息（API 密钥、密码）\n☐ 代码可运行/可复现\n☐ 包含必要的配置文件\n☐ 提供 .env.example 文件\n\n问题描述：\n☐ 标题清晰明确\n☐ 包含错误信息和截图\n☐ 说明已尝试的方案\n☐ 提供复现步骤\n\n沟通准备：\n☐ 预留足够的响应时间\n☐ 准备好补充信息\n☐ 确认预算范围\n☐ 确定期望的交付时间',
        },
        {
          title: '技术栈标签指南',
          content: '正确选择标签有助于精准匹配专家：\n\n前端框架：\nReact, Vue.js, Next.js, Nuxt.js, Angular, Svelte\n\n后端技术：\nNode.js, Python, Go, Java, Ruby, PHP\n\n数据库：\nPostgreSQL, MySQL, MongoDB, Redis, Supabase\n\n云服务：\nAWS, Vercel, Google Cloud, Azure, DigitalOcean\n\n其他：\nDocker, Kubernetes, Web3, AI/ML, Mobile',
        },
        {
          title: '学习资源推荐',
          content: '提升技术理解能力的资源：\n\nVibe Coding 教程：\n• Cursor 官方文档\n• Vercel AI SDK 指南\n• LangChain 入门教程\n\n基础知识：\n• MDN Web Docs - Web 技术权威参考\n• freeCodeCamp - 免费编程课程\n• Roadmap.sh - 学习路线图\n\n社区：\n• VibeFello Telegram 群组\n• Twitter/X 上的 #VibeCoding 话题',
        }
      ]
    }
  ];

  const filteredSections = docSections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.articles.length > 0);

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
            文档中心
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 mb-8"
          >
            全面的使用指南、最佳实践和操作手册
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
              placeholder="搜索文档..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 px-6 border-b border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center">
            {docSections.slice(0, 4).map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setOpenSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <section.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Doc Sections */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {filteredSections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="mb-8"
            >
              <button
                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                className="w-full flex items-center justify-between p-6 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
                    <p className="text-sm text-slate-500 mt-1">{section.description}</p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    openSection === section.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-4">
                      {section.articles.map((article, articleIndex) => (
                        <div
                          key={articleIndex}
                          className="p-6 bg-slate-50 rounded-xl border border-slate-100"
                        >
                          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-indigo-500" />
                            {article.title}
                          </h3>
                          <div className="text-slate-600 leading-relaxed whitespace-pre-line">
                            {article.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          
          {filteredSections.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">没有找到相关文档，请尝试其他关键词</p>
            </div>
          )}
        </div>
      </section>

      {/* Resources CTA */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <Users className="w-8 h-8 text-indigo-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">社区支持</h3>
              <p className="text-sm text-slate-600 mb-4">加入我们的用户社区，与其他创始人交流经验</p>
              <a 
                href="https://t.me/+H3SnvF92Twc3YTI9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                加入 Telegram <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <MessageCircle className="w-8 h-8 text-indigo-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">专家咨询</h3>
              <p className="text-sm text-slate-600 mb-4">需要一对一指导？预约专家进行深度咨询</p>
              <a 
                href="mailto:feedback@vibefello.com"
                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                联系我们 <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <BookOpen className="w-8 h-8 text-indigo-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">更新日志</h3>
              <p className="text-sm text-slate-600 mb-4">了解最新的功能更新和改进</p>
              <a 
                href="#"
                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                查看更新 <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">需要更多帮助？</h2>
          <p className="text-slate-600 mb-8">
            如果您在文档中找不到答案，欢迎联系我们的客服团队
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:feedback@vibefello.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              联系客服
            </a>
            <a
              href="https://t.me/+H3SnvF92Twc3YTI9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium hover:border-indigo-300 transition-colors"
            >
              加入社区
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Docs;
