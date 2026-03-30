import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  ExternalLink,
  Quote,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  industry: string;
  timeline: string;
  budget: string;
  heroImage: string;
  founder: {
    name: string;
    role: string;
    avatar: string;
    background: string;
  };
  expert: {
    name: string;
    role: string;
    avatar: string;
  };
  painPoints: {
    title: string;
    description: string;
    impact: string;
  }[];
  solution: {
    title: string;
    steps: string[];
    technologies: string[];
  };
  results: {
    metric: string;
    value: string;
    description: string;
  }[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
  liveUrl?: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 'saaS-dashboard',
    title: 'SaaS 数据分析仪表盘',
    subtitle: '从"白屏噩梦"到成功上线，非技术创始人如何跨越最后的技术鸿沟',
    industry: 'SaaS / 数据分析',
    timeline: '3 天',
    budget: '$450',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
    founder: {
      name: '李明',
      role: '创始人 & CEO',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      background: '前咨询顾问，有 8 年企业服务经验，不懂编程'
    },
    expert: {
      name: '张伟',
      role: '全栈工程师',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    painPoints: [
      {
        title: 'AI 生成的代码无法部署',
        description: '使用 Cursor 生成了完整的数据可视化仪表盘，本地运行完美，但部署到 Vercel 后只显示白屏。尝试了 3 种不同的部署方式都失败。',
        impact: '产品发布延迟 2 周，预付的 Google Ads 费用每天浪费 $50'
      },
      {
        title: '环境配置地狱',
        description: 'AI 没有正确处理服务端渲染和客户端渲染的区别，导致 window 对象在服务端报错。不清楚如何配置 next.config.js 和环境变量。',
        impact: '连续 5 个晚上熬夜调试，影响了白天的工作状态'
      },
      {
        title: '缺乏技术判断力',
        description: '不知道哪些错误是关键问题，哪些是警告可以忽略。Stack Overflow 上的解决方案都尝试过，但要么过时要么不适用。',
        impact: '信心受挫，开始怀疑自己是否适合创业'
      }
    ],
    solution: {
      title: '专家介入后的系统化解决方案',
      steps: [
        '30 分钟诊断：专家通过屏幕共享快速定位到 SSR 水合错误',
        '架构调整：将浏览器相关的图表库改为动态导入，禁用 SSR',
        '环境配置：正确设置 Vercel 环境变量和构建配置',
        '性能优化：添加图片优化和代码分割，首屏加载时间从 8s 降至 1.2s',
        '交付文档：提供部署检查清单，确保后续更新不会出问题'
      ],
      technologies: ['Next.js 14', 'Recharts', 'Tailwind CSS', 'Vercel', 'Supabase']
    },
    results: [
      {
        metric: '上线时间',
        value: '3 天',
        description: '从求助到成功上线，比预期提前 2 周'
      },
      {
        metric: '首屏加载',
        value: '1.2s',
        description: '从原来的 8s 优化到 1.2s，用户体验大幅提升'
      },
      {
        metric: '用户增长',
        value: '150+',
        description: '上线首周获得 150+ 注册用户，付费转化 12%'
      },
      {
        metric: '成本节省',
        value: '$1,200+',
        description: '相比雇佣全职开发，节省了 3 周时间和额外成本'
      }
    ],
    testimonial: {
      quote: '如果没有 VibeFello，我可能已经放弃这个项目了。专家不仅解决了技术问题，还教会了我很多部署和优化的知识。现在我更有信心继续使用 AI 工具开发产品。',
      author: '李明',
      role: 'DataView 创始人'
    },
    liveUrl: 'https://dataview-demo.vercel.app'
  },
  {
    id: 'ecommerce-mobile',
    title: '跨境电商移动端应用',
    subtitle: 'AI 生成 App 后卡在支付集成，专家 2 天打通最后一公里',
    industry: '跨境电商 / 移动应用',
    timeline: '2 天',
    budget: '$600',
    heroImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=600&fit=crop',
    founder: {
      name: 'Sarah Chen',
      role: '联合创始人',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      background: '跨境电商运营 5 年，首次尝试开发 App'
    },
    expert: {
      name: '王磊',
      role: '移动端开发专家',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    },
    painPoints: [
      {
        title: '支付集成完全失败',
        description: '使用 React Native + Expo 开发的购物 App，AI 生成的 Stripe 支付代码在测试环境工作，但生产环境总是报错。',
        impact: 'App 已经提交 App Store 审核，但支付功能无法使用等于白做'
      },
      {
        title: '第三方 SDK 冲突',
        description: '集成了 Firebase、Stripe、OneSignal 等多个 SDK，构建时经常出现版本冲突，AI 无法解决这些依赖问题。',
        impact: '构建失败率 80%，每次尝试构建需要等待 15 分钟'
      },
      {
        title: '安全合规焦虑',
        description: '担心支付相关的代码有安全漏洞，不懂如何进行安全审计，害怕用户信用卡信息泄露。',
        impact: '迟迟不敢上线，错过黑五促销的最佳时机'
      }
    ],
    solution: {
      title: '从代码审计到生产部署的全流程支持',
      steps: [
        '安全审计：检查所有支付相关代码，发现 2 个潜在的安全隐患',
        'SDK 整合：统一 Firebase 和 Stripe 的版本，解决依赖冲突',
        '支付流程重构：实现完整的支付状态机，处理各种边缘情况',
        '合规配置：正确设置 Stripe webhook 和 PCI 合规配置',
        '测试覆盖：编写自动化测试，确保支付流程 100% 可靠'
      ],
      technologies: ['React Native', 'Expo', 'Stripe', 'Firebase', 'Node.js']
    },
    results: [
      {
        metric: '开发周期',
        value: '2 天',
        description: '解决支付问题并完成上线准备'
      },
      {
        metric: '支付成功率',
        value: '99.2%',
        description: '经过优化的支付流程，失败率极低'
      },
      {
        metric: '首月 GMV',
        value: '$12,000',
        description: '上线首月交易额，超出预期 40%'
      },
      {
        metric: '用户评分',
        value: '4.8',
        description: 'App Store 评分，用户反馈支付体验流畅'
      }
    ],
    testimonial: {
      quote: '王磊不仅帮我们解决了技术问题，还帮我们建立了完整的支付监控体系。现在我可以放心地推广 App，不用担心支付出问题。这笔钱花得太值了！',
      author: 'Sarah Chen',
      role: 'ShopGlobal 联合创始人'
    },
    liveUrl: 'https://apps.apple.com/us/app/shopglobal/id1234567890'
  },
  {
    id: 'ai-content-platform',
    title: 'AI 内容生成平台',
    subtitle: '从原型到生产环境，解决 AI 应用的性能瓶颈',
    industry: 'AI / 内容科技',
    timeline: '5 天',
    budget: '$1,800',
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
    founder: {
      name: '陈浩',
      role: '独立开发者',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
      background: '前端开发背景，首次构建完整的 AI 产品'
    },
    expert: {
      name: '刘洋',
      role: 'AI 系统架构师',
      avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face'
    },
    painPoints: [
      {
        title: 'API 调用成本失控',
        description: '使用 GPT-4 生成内容，用户一多 API 费用就飙升，单次请求成本 $0.12，无法盈利。',
        impact: '每获取一个用户亏损 $5，商业模式不成立'
      },
      {
        title: '响应速度太慢',
        description: '内容生成需要 15-30 秒，用户等待时间过长，跳出率高达 70%。',
        impact: '用户体验差，留存率低于 10%'
      },
      {
        title: '并发处理能力不足',
        description: '5 个用户同时使用时系统就崩溃，数据库连接池耗尽，不知道如何设计队列系统。',
        impact: '无法做任何推广，担心系统崩溃'
      }
    ],
    solution: {
      title: '全栈性能优化与架构重构',
      steps: [
        '成本优化：实现智能模型路由，简单任务用 GPT-3.5，复杂任务用 GPT-4，成本降低 85%',
        '流式响应：实现 SSE 流式输出，用户 2 秒内看到首字，体验接近 ChatGPT',
        '队列系统：设计 Redis 任务队列，支持 1000+ 并发，自动重试失败任务',
        '缓存策略：实现多级缓存，常用模板响应时间降至 200ms',
        '监控告警：配置性能监控，实时追踪 API 成本和系统健康度'
      ],
      technologies: ['OpenAI API', 'Redis', 'Bull Queue', 'PostgreSQL', 'Next.js', 'AWS']
    },
    results: [
      {
        metric: 'API 成本',
        value: '-85%',
        description: '通过智能路由和缓存，单次请求成本从 $0.12 降至 $0.018'
      },
      {
        metric: '响应时间',
        value: '2s',
        description: '流式输出让用户 2 秒内看到内容，完整生成时间降至 8s'
      },
      {
        metric: '并发能力',
        value: '1000+',
        description: '支持 1000+ 并发用户，系统稳定运行'
      },
      {
        metric: '月收入',
        value: '$8,500',
        description: '上线 3 个月后实现盈利，MRR 持续增长'
      }
    ],
    testimonial: {
      quote: '刘洋帮我们把一个"玩具项目"变成了真正的商业产品。现在我们的平台每天处理上万次生成请求，系统依然稳定。这是我今年最明智的一笔投资。',
      author: '陈浩',
      role: 'ContentAI 创始人'
    },
    liveUrl: 'https://contentai.tools'
  },
  {
    id: 'casual-game',
    title: '休闲益智小游戏',
    subtitle: 'AI 生成的游戏代码性能糟糕，专家优化后日活破万',
    industry: '游戏 / 娱乐',
    timeline: '4 天',
    budget: '$800',
    heroImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=600&fit=crop',
    founder: {
      name: '王小明',
      role: '独立游戏开发者',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      background: '游戏策划出身，用 AI 尝试开发首款独立游戏'
    },
    expert: {
      name: '赵强',
      role: '游戏开发工程师',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face'
    },
    painPoints: [
      {
        title: '游戏卡顿严重',
        description: 'AI 生成的消除类游戏在手机上运行卡顿，帧率只有 15-20fps，用户体验极差。',
        impact: '测试用户反馈"玩不下去"，担心上线后差评如潮'
      },
      {
        title: '内存泄漏问题',
        description: '游戏运行 5 分钟后内存占用从 50MB 飙升到 300MB，导致 App 闪退。',
        impact: '无法通过微信小游戏的审核，上线计划受阻'
      },
      {
        title: '广告集成失败',
        description: '想接入广告变现，但 AI 生成的广告代码与游戏循环冲突，要么不显示要么崩溃。',
        impact: '商业模式无法跑通，项目面临夭折'
      }
    ],
    solution: {
      title: '游戏性能优化与架构重构',
      steps: [
        '性能分析：使用 Chrome DevTools 定位渲染瓶颈，发现大量不必要的重绘',
        '渲染优化：实现对象池复用，优化碰撞检测算法，帧率提升至 60fps',
        '内存管理：修复事件监听器泄漏，优化纹理加载策略，内存占用稳定在 80MB',
        '广告集成：重构游戏循环与广告回调的时序关系，实现无缝广告体验',
        '发布支持：协助通过微信小游戏审核，完成 iOS/Android 双端打包'
      ],
      technologies: ['Cocos Creator', 'TypeScript', 'WeChat Mini Game', 'AdMob', 'Unity Ads']
    },
    results: [
      {
        metric: '游戏帧率',
        value: '60fps',
        description: '从 15fps 优化到稳定 60fps，体验流畅'
      },
      {
        metric: '内存占用',
        value: '80MB',
        description: '从 300MB 降至 80MB，不再闪退'
      },
      {
        metric: '日活用户',
        value: '12,000+',
        description: '上线 2 周日活突破 1.2 万'
      },
      {
        metric: '广告收入',
        value: '$450/月',
        description: '广告变现跑通，持续产生收入'
      }
    ],
    testimonial: {
      quote: '赵强不仅解决了技术问题，还教了我很多游戏优化的技巧。现在我的第二款游戏已经自己完成了性能优化，感谢 VibeFello 让我真正成长为一个独立开发者。',
      author: '王小明',
      role: 'PuzzleMaster 开发者'
    },
    liveUrl: 'https://puzzlemaster-game.vercel.app'
  },
  {
    id: 'chrome-extension',
    title: 'Chrome 效率插件',
    subtitle: 'AI 写的扩展插件无法上架 Chrome 商店，专家 1 天解决合规问题',
    industry: '浏览器扩展 / 生产力工具',
    timeline: '1 天',
    budget: '$300',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
    founder: {
      name: '张琳',
      role: '产品经理',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      background: '互联网产品经理，想开发一款自己的效率工具'
    },
    expert: {
      name: '李华',
      role: '浏览器扩展专家',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face'
    },
    painPoints: [
      {
        title: 'Chrome 商店审核被拒',
        description: 'AI 生成的代码使用了过时的 Manifest V2 格式，且包含远程代码加载，被 Chrome Web Store 直接拒绝。',
        impact: '开发 2 周的作品无法发布，所有努力可能白费'
      },
      {
        title: '权限申请过度',
        description: 'AI 为了保险申请了所有可能的权限，包括"读取所有网站数据"，用户安装时会被吓退。',
        impact: '测试用户 90% 在权限页面放弃安装'
      },
      {
        title: '内容安全策略错误',
        description: '内联脚本和 eval() 的使用违反了 CSP 规范，导致扩展在某些页面无法正常工作。',
        impact: '核心功能在 Gmail、Notion 等网站失效'
      }
    ],
    solution: {
      title: 'Chrome 扩展合规化改造',
      steps: [
        'Manifest 升级：将 V2 迁移到 V3，移除所有远程代码加载',
        '权限最小化：根据实际功能重新申请权限，从 12 个减少到 3 个',
        'CSP 合规：重构代码移除内联脚本，使用外部 JS 文件',
        '审核准备：编写详细的隐私政策和使用说明，准备审核材料',
        '快速过审：协助提交审核，24 小时内通过 Chrome Web Store 审核'
      ],
      technologies: ['Chrome Extension V3', 'JavaScript', 'Manifest V3', 'Content Script', 'Background Service Worker']
    },
    results: [
      {
        metric: '审核时间',
        value: '24h',
        description: '从被拒到通过审核仅用 24 小时'
      },
      {
        metric: '安装转化率',
        value: '65%',
        description: '权限优化后，安装转化率从 10% 提升到 65%'
      },
      {
        metric: '用户数',
        value: '5,000+',
        description: '上线首月获得 5000+ 用户'
      },
      {
        metric: '用户评分',
        value: '4.9',
        description: 'Chrome Web Store 评分 4.9 星'
      }
    ],
    testimonial: {
      quote: '李华对 Chrome 扩展的规范了如指掌，1 天就解决了困扰我 2 周的问题。现在我的插件已经帮助了 5000 多人提高效率，这种成就感无法形容。',
      author: '张琳',
      role: 'TabMaster 开发者'
    },
    liveUrl: 'https://chrome.google.com/webstore/detail/tabmaster/abc123'
  },
  {
    id: 'web3-nft',
    title: 'Web3 NFT 铸造平台',
    subtitle: '智能合约安全漏洞险些酿成大祸，专家审计挽回数十万损失',
    industry: 'Web3 / NFT',
    timeline: '6 天',
    budget: '$2,500',
    heroImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=600&fit=crop',
    founder: {
      name: 'Alex Wong',
      role: 'Web3 创业者',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face',
      background: '加密领域投资人，首次尝试开发 NFT 项目'
    },
    expert: {
      name: '孙博士',
      role: '智能合约安全专家',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    painPoints: [
      {
        title: '重入攻击漏洞',
        description: 'AI 生成的 Solidity 合约没有防范重入攻击，黑客可以通过递归调用盗走合约中的 ETH。',
        impact: '如果上线，预计损失可能超过 $200,000'
      },
      {
        title: 'Gas 费用过高',
        description: '合约代码没有优化，用户铸造一个 NFT 需要支付 $80+ 的 Gas 费，毫无竞争力。',
        impact: '与竞品相比成本高出 5 倍，项目没有生存空间'
      },
      {
        title: '前端与合约交互失败',
        description: 'AI 生成的 Web3 连接代码与 MetaMask 兼容性差，用户经常无法完成交易。',
        impact: '测试阶段 70% 的交易失败，用户体验极差'
      }
    ],
    solution: {
      title: '智能合约安全审计与全栈优化',
      steps: [
        '安全审计：使用 Slither 和 Mythril 进行静态分析，发现 3 个高危漏洞',
        '合约重构：实现 Checks-Effects-Interactions 模式，添加重入锁保护',
        'Gas 优化：使用 Merkle Tree 实现白名单，优化存储布局，Gas 费降低 70%',
        '前端修复：升级 wagmi/viem 到最新版，完善错误处理和用户引导',
        '测试覆盖：编写 50+ 单元测试，进行主网分叉测试，确保万无一失'
      ],
      technologies: ['Solidity', 'Hardhat', 'OpenZeppelin', 'Ethers.js', 'React', 'wagmi', 'IPFS']
    },
    results: [
      {
        metric: '安全漏洞',
        value: '0',
        description: '修复所有高危漏洞，通过专业安全审计'
      },
      {
        metric: 'Gas 费用',
        value: '-70%',
        description: '从 $80 降至 $24，具备市场竞争力'
      },
      {
        metric: '铸造收入',
        value: '$85,000',
        description: '首发 3000 个 NFT 全部售罄'
      },
      {
        metric: '交易成功率',
        value: '98.5%',
        description: '从前端的 30% 提升至 98.5%'
      }
    ],
    testimonial: {
      quote: '孙博士救了我的项目，也救了我的投资。如果没有这次审计，我可能已经损失了全部积蓄。Web3 开发不能心存侥幸，专业审计是必须的。',
      author: 'Alex Wong',
      role: 'CryptoArt 平台创始人'
    },
    liveUrl: 'https://cryptoart-nft.io'
  }
];

export const Cases: React.FC = () => {
  const [activeCase, setActiveCase] = useState<CaseStudy>(caseStudies[0]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              真实用户故事
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
              从困境到成功
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              看看其他非技术创始人如何通过 VibeFello 跨越技术鸿沟，将 AI 生成的代码变成真实的商业产品
            </p>
          </motion.div>

          {/* Case Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mt-12"
          >
            {caseStudies.map((caseStudy) => (
              <button
                key={caseStudy.id}
                onClick={() => setActiveCase(caseStudy)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeCase.id === caseStudy.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                }`}
              >
                {caseStudy.title}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Case Study Content */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            key={activeCase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden mb-12 aspect-[2/1]">
              <img
                src={activeCase.heroImage}
                alt={activeCase.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-4">
                  {activeCase.industry}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{activeCase.title}</h2>
                <p className="text-lg text-white/90">{activeCase.subtitle}</p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <Clock className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{activeCase.timeline}</div>
                <div className="text-sm text-slate-500">解决周期</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <DollarSign className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{activeCase.budget}</div>
                <div className="text-sm text-slate-500">项目预算</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <Target className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">100%</div>
                <div className="text-sm text-slate-500">问题解决</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <TrendingUp className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">上线</div>
                <div className="text-sm text-slate-500">产品状态</div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Left Column - People */}
              <div className="space-y-8">
                {/* Founder */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">创始人</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={activeCase.founder.avatar}
                      alt={activeCase.founder.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{activeCase.founder.name}</div>
                      <div className="text-sm text-slate-600">{activeCase.founder.role}</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{activeCase.founder.background}</p>
                </div>

                {/* Expert */}
                <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-6">
                  <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4">协助专家</h3>
                  <div className="flex items-center gap-4">
                    <img
                      src={activeCase.expert.avatar}
                      alt={activeCase.expert.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{activeCase.expert.name}</div>
                      <div className="text-sm text-slate-600">{activeCase.expert.role}</div>
                    </div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="bg-slate-900 rounded-xl p-6 text-white">
                  <Quote className="w-8 h-8 text-indigo-400 mb-4" />
                  <p className="text-sm leading-relaxed mb-4">{activeCase.testimonial.quote}</p>
                  <div className="text-sm">
                    <div className="font-bold">{activeCase.testimonial.author}</div>
                    <div className="text-slate-400">{activeCase.testimonial.role}</div>
                  </div>
                </div>

                {/* Live Link */}
                {activeCase.liveUrl && (
                  <a
                    href={activeCase.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    查看上线产品
                  </a>
                )}
              </div>

              {/* Right Column - Details */}
              <div className="lg:col-span-2 space-y-12">
                {/* Pain Points */}
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                    遇到的困境
                  </h3>
                  <div className="space-y-4">
                    {activeCase.painPoints.map((point, index) => (
                      <div key={index} className="bg-red-50 rounded-xl p-6 border border-red-100">
                        <h4 className="font-bold text-red-900 mb-2">{point.title}</h4>
                        <p className="text-red-800 text-sm mb-3">{point.description}</p>
                        <div className="flex items-start gap-2 text-sm text-red-700">
                          <span className="font-bold">影响：</span>
                          <span>{point.impact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Solution */}
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    {activeCase.solution.title}
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-6 mb-6">
                    <ol className="space-y-4">
                      {activeCase.solution.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <span className="text-slate-700 pt-1">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeCase.solution.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                    取得的成果
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {activeCase.results.map((result, index) => (
                      <div key={index} className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                        <div className="text-sm text-emerald-600 mb-1">{result.metric}</div>
                        <div className="text-3xl font-bold text-emerald-700 mb-2">{result.value}</div>
                        <div className="text-sm text-emerald-800">{result.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">准备好开始你的成功故事了吗？</h2>
          <p className="text-slate-400 mb-8">
            不要让技术问题阻碍你的创业梦想，让专家帮你跨越最后一公里
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#post-request"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              发布救援请求
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/help"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
            >
              了解更多
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cases;
