import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { 
  Search, 
  ChevronDown, 
  BookOpen, 
  Code, 
  Zap, 
  Shield, 
  Users, 
  FileText,
  Terminal,
  Settings,
  ExternalLink
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
          content: 'VibeFello 是一个连接非技术创始人与技术专家的平台。我们的使命是让每一个有想法的人都能将创意转化为现实。\n\n核心功能包括：\n• 救援请求发布 - 遇到技术难题时快速获得帮助\n• 专家匹配 - 根据技术栈智能匹配最合适的专家\n• 安全交易 - 平台担保支付，保障双方权益\n• 代码托管 - 安全的代码分享和协作环境',
          code: null
        },
        {
          title: '用户注册与登录',
          content: 'VibeFello 提供两种身份：普通用户和专家。\n\n普通用户可以：\n• 发布救援请求\n• 浏览专家列表\n• 查看订单状态\n\n专家可以：\n• 接收救援请求\n• 提供技术服务\n• 管理收入提现',
          code: `// 用户登录示例
const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data.user;
};`
        },
        {
          title: '发布第一个救援请求',
          content: '遇到技术难题？按照以下步骤发布请求：\n\n1. 点击"提交救援申请"按钮\n2. 详细描述您的问题\n3. 选择相关技术栈标签\n4. 设置预算范围\n5. 支付基础咨询费\n6. 等待专家响应',
          code: null
        }
      ]
    },
    {
      id: 'api',
      title: 'API 文档',
      icon: Code,
      description: '开发者集成指南和 API 参考',
      articles: [
        {
          title: 'API 认证',
          content: '所有 API 请求都需要在 Header 中包含认证令牌。您可以在个人设置中生成 API 密钥。\n\n请求头格式：\nAuthorization: Bearer YOUR_API_KEY',
          code: `// 设置请求头
const headers = {
  'Authorization': 'Bearer sk_live_xxxxxxxxxxxxx',
  'Content-Type': 'application/json'
};`
        },
        {
          title: '获取专家列表',
          content: '获取平台上的专家列表，支持按技术栈筛选。',
          code: `// GET /api/v1/experts
const getExperts = async (techStack?: string[]) => {
  const params = new URLSearchParams();
  techStack?.forEach(tech => params.append('tech', tech));
  
  const response = await fetch(
    \`https://api.vibefello.com/v1/experts?\${params}\`,
    { headers }
  );
  
  return response.json();
};

// 响应示例
{
  "experts": [
    {
      "id": "exp_123",
      "name": "张工程师",
      "skills": ["React", "Node.js"],
      "rating": 4.9,
      "hourlyRate": 300
    }
  ]
}`
        },
        {
          title: '创建救援请求',
          content: '通过 API 创建新的救援请求。',
          code: `// POST /api/v1/requests
const createRequest = async (requestData: RequestData) => {
  const response = await fetch(
    'https://api.vibefello.com/v1/requests',
    {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData)
    }
  );
  
  return response.json();
};

// 请求体示例
{
  "title": "React 项目部署问题",
  "description": "构建成功但部署后白屏...",
  "techStack": ["React", "Vercel"],
  "budget": { "min": 200, "max": 500 }
}`
        }
      ]
    },
    {
      id: 'integration',
      title: '集成指南',
      icon: Terminal,
      description: '与常用工具和平台的集成方案',
      articles: [
        {
          title: 'GitHub 集成',
          content: '将 VibeFello 与您的 GitHub 仓库连接，实现代码自动同步和问题追踪。\n\n集成步骤：\n1. 进入个人设置 → 集成\n2. 点击"连接 GitHub"\n3. 授权 VibeFello 访问您的仓库\n4. 选择要同步的仓库',
          code: `// GitHub Webhook 配置
{
  "payload_url": "https://api.vibefello.com/webhooks/github",
  "content_type": "json",
  "events": ["push", "issues"]
}`
        },
        {
          title: 'Slack 通知',
          content: '在 Slack 中接收救援请求状态更新和专家消息。\n\n配置方法：\n1. 在 Slack 中创建 Incoming Webhook\n2. 复制 Webhook URL\n3. 在 VibeFello 设置中粘贴 URL\n4. 选择要接收的通知类型',
          code: `// Slack 消息格式
{
  "text": "新的救援请求",
  "attachments": [{
    "color": "#6366f1",
    "fields": [
      { "title": "问题", "value": "React 部署失败" },
      { "title": "预算", "value": "$50-80" }
    ]
  }]
}`
        },
        {
          title: 'VS Code 扩展',
          content: '安装 VibeFello VS Code 扩展，直接在编辑器中发布救援请求。\n\n功能特性：\n• 一键发布当前文件相关问题\n• 实时接收专家消息\n• 代码片段分享\n• 屏幕录制功能',
          code: `// VS Code 命令面板
Cmd/Ctrl + Shift + P → VibeFello: 发布救援请求

// 快捷键
Cmd/Ctrl + Shift + R - 快速发布请求`
        }
      ]
    },
    {
      id: 'security',
      title: '安全指南',
      icon: Shield,
      description: '保护您的代码和数据安全的最佳实践',
      articles: [
        {
          title: '代码分享安全',
          content: '与专家分享代码时的安全建议：\n\n1. 删除敏感信息\n   • API 密钥和密钥\n   • 数据库连接字符串\n   • 密码和令牌\n\n2. 使用环境变量\n   • 将配置移到 .env 文件\n   • 提供 .env.example 作为参考\n\n3. 数据脱敏\n   • 使用假数据代替真实用户数据\n   • 隐藏个人身份信息',
          code: `# .env.example
DATABASE_URL=postgresql://user:password@localhost/db
API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret`
        },
        {
          title: 'NDA 保密协议',
          content: '对于商业敏感项目，建议与专家签署 NDA（保密协议）。\n\nVibeFello 提供：\n• 标准 NDA 模板\n• 电子签名功能\n• 协议执行追踪\n\n在发布请求时勾选"需要 NDA"选项，系统将自动处理协议流程。',
          code: null
        },
        {
          title: '账户安全',
          content: '保护您的 VibeFello 账户：\n\n• 启用双重认证（2FA）\n• 使用强密码并定期更换\n• 不在公共设备上保持登录\n• 定期检查登录历史\n• 及时更新关联邮箱和手机号',
          code: null
        }
      ]
    },
    {
      id: 'best-practices',
      title: '最佳实践',
      icon: Settings,
      description: '提高协作效率的实用技巧',
      articles: [
        {
          title: '撰写有效的救援请求',
          content: '好的问题描述能让专家更快理解并解决您的问题：\n\n1. 清晰的标题\n   例："React + Vite 项目在生产环境构建后白屏"\n\n2. 详细的问题描述\n   • 预期行为 vs 实际行为\n   • 错误信息和截图\n   • 复现步骤\n\n3. 提供上下文\n   • 技术栈版本\n   • 相关配置文件\n   • 已尝试的解决方案',
          code: null
        },
        {
          title: '与专家高效沟通',
          content: '建立良好的合作关系：\n\n• 及时回复消息\n• 提供清晰的反馈\n• 分阶段确认进展\n• 测试并验证解决方案\n• 给予诚实的评价\n\n良好的沟通能显著提高问题解决效率。',
          code: null
        },
        {
          title: '预算规划建议',
          content: '合理设置预算能吸引更多优质专家：\n\n参考定价：\n• 简单问题（1-2小时）：$30-60\n• 中等复杂度（3-5小时）：$80-150\n• 复杂问题（5小时+）：$150+\n\n考虑因素：\n• 问题的紧急程度\n• 所需技术栈的稀缺性\n• 专家的经验水平',
          code: null
        }
      ]
    },
    {
      id: 'resources',
      title: '资源中心',
      icon: BookOpen,
      description: '模板、工具和参考资料',
      articles: [
        {
          title: '项目模板',
          content: '我们提供常用技术栈的启动模板：\n\n• React + TypeScript + Vite\n• Next.js + Tailwind CSS\n• Node.js + Express + Prisma\n• Python + FastAPI\n• Flutter 移动端模板\n\n每个模板都包含最佳实践配置和示例代码。',
          code: null
        },
        {
          title: '检查清单',
          content: '发布请求前的自查清单：\n\n代码准备：\n☐ 已移除敏感信息\n☐ 代码可运行/可复现\n☐ 包含必要的配置文件\n\n问题描述：\n☐ 标题清晰明确\n☐ 包含错误信息\n☐ 说明已尝试的方案\n\n沟通准备：\n☐ 预留足够的响应时间\n☐ 准备好补充信息\n☐ 确认预算范围',
          code: null
        },
        {
          title: '推荐工具',
          content: '提升开发效率的工具推荐：\n\n代码分享：\n• GitHub Gist - 快速分享代码片段\n• CodeSandbox - 在线代码演示\n• Loom - 屏幕录制说明\n\n沟通协作：\n• Telegram - 实时消息\n• Figma - 设计稿分享\n• Notion - 文档协作',
          code: null
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
            全面的开发指南、API 文档和最佳实践
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
                          <div className="text-slate-600 leading-relaxed whitespace-pre-line mb-4">
                            {article.content}
                          </div>
                          {article.code && (
                            <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                              <pre className="text-sm text-slate-300 font-mono">
                                <code>{article.code}</code>
                              </pre>
                            </div>
                          )}
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
              <p className="text-sm text-slate-600 mb-4">加入我们的开发者社区，与其他用户交流经验</p>
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
              <Terminal className="w-8 h-8 text-indigo-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">API 状态</h3>
              <p className="text-sm text-slate-600 mb-4">查看 API 实时状态和服务可用性</p>
              <a 
                href="#"
                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                查看状态页 <ExternalLink className="w-3 h-3" />
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
            如果您在文档中找不到答案，欢迎联系我们的技术支持团队
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:feedback@vibefello.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              联系技术支持
            </a>
            <a
              href="https://t.me/+H3SnvF92Twc3YTI9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium hover:border-indigo-300 transition-colors"
            >
              加入开发者社区
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Docs;
