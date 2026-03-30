
export type OrderStatus = 'pending_consultation' | 'pending_quote' | 'quoted' | 'in_service' | 'cooling' | 'completed';

export type MembershipTier = 'Basic' | 'Pro' | 'Elite';

export type UserTier = 'free' | 'pro' | 'max';

// ===== 专家 Onboarding 类型 =====

// 技术领域分类
export type TechDomain = 
  | 'web'           // Web开发
  | 'mobile'        // 移动开发
  | 'ai_ml'         // AI/机器学习
  | 'devops'        // DevOps/云原生
  | 'blockchain'    // 区块链/Web3
  | 'data'          // 数据工程
  | 'game'          // 游戏开发
  | 'desktop'       // 桌面应用
  | 'embedded'      // 嵌入式/IoT
  | 'security';     // 安全

// 开发语言
export type ProgrammingLanguage =
  | 'typescript' | 'javascript' | 'python' | 'go'
  | 'rust' | 'java' | 'kotlin' | 'swift'
  | 'cpp' | 'c' | 'csharp' | 'php'
  | 'ruby' | 'scala' | 'solidity';

// Vibe Coding 经验等级
export type VibeCodingLevel =
  | 'beginner'      // 刚接触，了解基本概念
  | 'intermediate'  // 有项目经验，能独立使用AI工具
  | 'advanced'      // 深度使用，擅长Prompt工程
  | 'expert';       // 专家级，能处理复杂AI生成代码问题

// 专家认证状态
export type ExpertVerificationStatus = 
  | 'pending'      // 待提交资料
  | 'submitted'    // 已提交待审核
  | 'approved'     // 审核通过
  | 'rejected';    // 审核拒绝

// 专家入驻申请
export interface ExpertApplication {
  id: string;
  userId: string;
  
  // Step 1: 专业信息
  realName: string;
  primaryDomains: TechDomain[];      // 技术领域（多选，最多3个）
  techStack: string[];               // 技术栈
  languages: ProgrammingLanguage[];  // 开发语言
  vibeCodingLevel: VibeCodingLevel;  // Vibe Coding 经验
  vibeCodingExperience: string;      // 经验描述
  bio: string;                       // 个人简介
  portfolioUrl?: string;             // GitHub/作品集
  
  // Step 2: 身份验证
  idDocumentType: 'id_card' | 'passport';
  idDocumentFrontUrl: string;
  idDocumentBackUrl?: string;
  
  // Step 3: 协议同意
  agreementAccepted: boolean;
  agreementAcceptedAt: string;
  
  // Step 4: 订阅选择
  selectedTier: MembershipTier;
  
  // 状态
  status: ExpertVerificationStatus;
  submittedAt?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  
  createdAt: string;
  updatedAt: string;
}

// 用户会员配置
export const USER_TIER_CONFIG: Record<UserTier, { aiDiagnosisLimit: number; expertConsultLimit: number; name: string }> = {
  free: { aiDiagnosisLimit: 1, expertConsultLimit: 1, name: '按次付费' },
  pro: { aiDiagnosisLimit: 10, expertConsultLimit: 10, name: 'Pro' },
  max: { aiDiagnosisLimit: 69, expertConsultLimit: Infinity, name: 'Max' },
};

// ===== 专家 Onboarding 常量配置 =====

// 技术领域与技能映射
export const DOMAIN_SKILL_MAP: Record<TechDomain, {
  name: string;
  icon: string;
  skills: string[];
}> = {
  web: {
    name: 'Web 开发',
    icon: 'Globe',
    skills: [
      'React', 'Vue', 'Next.js', 'Nuxt.js', 'Angular', 'Svelte',
      'Node.js', 'Django', 'FastAPI', 'Laravel', 'Ruby on Rails',
      'Tailwind CSS', 'Styled Components', 'Framer Motion',
      'Webpack', 'Vite', 'Turbopack', 'esbuild'
    ]
  },
  mobile: {
    name: '移动开发',
    icon: 'Smartphone',
    skills: [
      'React Native', 'Flutter', 'Swift', 'Kotlin',
      'iOS Native', 'Android Native', 'Expo',
      'Firebase Mobile', 'Push Notifications', 'Mobile Analytics'
    ]
  },
  ai_ml: {
    name: 'AI / 机器学习',
    icon: 'Brain',
    skills: [
      'OpenAI API', 'LangChain', 'LlamaIndex', 'Hugging Face',
      'PyTorch', 'TensorFlow', 'Scikit-learn',
      'Vector DB', 'RAG', 'Fine-tuning', 'Prompt Engineering',
      'Computer Vision', 'NLP', 'Stable Diffusion'
    ]
  },
  devops: {
    name: 'DevOps / 云原生',
    icon: 'Cloud',
    skills: [
      'Docker', 'Kubernetes', 'Terraform', 'Ansible',
      'AWS', 'GCP', 'Azure', 'Vercel', 'Netlify',
      'CI/CD', 'GitHub Actions', 'GitLab CI', 'Jenkins',
      'Prometheus', 'Grafana', 'ELK Stack', 'Datadog'
    ]
  },
  blockchain: {
    name: '区块链 / Web3',
    icon: 'Hexagon',
    skills: [
      'Solidity', 'Rust (Solana)', 'Move (Aptos/Sui)',
      'Hardhat', 'Foundry', 'Truffle',
      'Web3.js', 'Ethers.js', 'Viem',
      'Smart Contract Audit', 'DeFi Protocols', 'NFT Standards'
    ]
  },
  data: {
    name: '数据工程',
    icon: 'Database',
    skills: [
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'ClickHouse',
      'Apache Kafka', 'Apache Spark', 'Airflow',
      'dbt', 'Snowflake', 'BigQuery', 'Data Warehousing',
      'ETL Pipelines', 'Real-time Analytics'
    ]
  },
  game: {
    name: '游戏开发',
    icon: 'Gamepad',
    skills: [
      'Unity', 'Unreal Engine', 'Godot', 'Cocos2d',
      'Game AI', 'Physics Engine', 'Shader Programming',
      'Multiplayer Networking', 'Game Optimization'
    ]
  },
  desktop: {
    name: '桌面应用',
    icon: 'Monitor',
    skills: [
      'Electron', 'Tauri', 'WPF', 'Qt',
      'Cross-platform Desktop', 'System Integration'
    ]
  },
  embedded: {
    name: '嵌入式 / IoT',
    icon: 'Cpu',
    skills: [
      'Arduino', 'Raspberry Pi', 'ESP32', 'STM32',
      'RTOS', 'Firmware Development', 'IoT Protocols'
    ]
  },
  security: {
    name: '安全审计',
    icon: 'Shield',
    skills: [
      'Penetration Testing', 'Smart Contract Audit',
      'Security Review', 'Vulnerability Assessment',
      'Code Audit', 'Compliance (SOC2, ISO27001)'
    ]
  }
};

// 开发语言选项
export const LANGUAGE_OPTIONS: { value: ProgrammingLanguage; label: string; color: string }[] = [
  { value: 'typescript', label: 'TypeScript', color: '#3178C6' },
  { value: 'javascript', label: 'JavaScript', color: '#F7DF1E' },
  { value: 'python', label: 'Python', color: '#3776AB' },
  { value: 'go', label: 'Go', color: '#00ADD8' },
  { value: 'rust', label: 'Rust', color: '#DEA584' },
  { value: 'java', label: 'Java', color: '#007396' },
  { value: 'kotlin', label: 'Kotlin', color: '#7F52FF' },
  { value: 'swift', label: 'Swift', color: '#F05138' },
  { value: 'cpp', label: 'C++', color: '#00599C' },
  { value: 'c', label: 'C', color: '#A8B9CC' },
  { value: 'csharp', label: 'C#', color: '#239120' },
  { value: 'php', label: 'PHP', color: '#777BB4' },
  { value: 'ruby', label: 'Ruby', color: '#CC342D' },
  { value: 'scala', label: 'Scala', color: '#DC322F' },
  { value: 'solidity', label: 'Solidity', color: '#363636' }
];

// Vibe Coding 经验等级
export const VIBE_CODING_LEVELS: { value: VibeCodingLevel; label: string; description: string }[] = [
  { 
    value: 'beginner', 
    label: '入门', 
    description: '刚接触 Vibe Coding，了解 Cursor、Windsurf 等基本工具' 
  },
  { 
    value: 'intermediate', 
    label: '进阶', 
    description: '有实际项目经验，能独立使用 AI 工具完成开发任务' 
  },
  { 
    value: 'advanced', 
    label: '熟练', 
    description: '深度使用 AI 开发工具，擅长 Prompt 工程和代码审查' 
  },
  { 
    value: 'expert', 
    label: '专家', 
    description: 'Vibe Coding 专家，擅长处理复杂 AI 生成代码的调试和优化' 
  }
];

// 专家订阅计划
export const EXPERT_SUBSCRIPTION_PLANS = [
  {
    tier: 'Starter' as MembershipTier,
    price: 39,
    period: '月',
    orderLimit: 4,
    features: [
      { text: '每月 4 单接单额度', highlight: true },
      { text: '基础专家标识', highlight: false },
      { text: '结算周期 15天', highlight: false },
      { text: '社区支持', highlight: false },
      { text: '平台服务费约 20%', highlight: false }
    ],
    cta: '选择 Starter',
    popular: false,
    badge: null
  },
  {
    tier: 'Pro' as MembershipTier,
    price: 99,
    period: '月',
    orderLimit: 20,
    features: [
      { text: '每月 20 单接单额度', highlight: true },
      { text: 'Pro 专家认证勋章', highlight: true },
      { text: '优先推荐展示', highlight: true },
      { text: '结算周期 7天', highlight: false },
      { text: '专属客服支持', highlight: false },
      { text: '平台服务费约 15%', highlight: false }
    ],
    cta: '选择 Pro',
    popular: true,
    badge: '推荐'
  },
  {
    tier: 'Elite' as MembershipTier,
    price: 299,
    period: '月',
    orderLimit: 100,
    features: [
      { text: '每月 100 单接单额度', highlight: true },
      { text: 'Master 顶级勋章', highlight: true },
      { text: '首页推荐位展示', highlight: true },
      { text: '结算周期 7天', highlight: true },
      { text: 'VIP 专属服务', highlight: false },
      { text: '平台服务费约 10%', highlight: false }
    ],
    cta: '选择 Master',
    popular: false,
    badge: '顶级'
  }
];

// 专家服务协议
export const EXPERT_AGREEMENT_TEXT = `
VibeFello 专家服务协议

1. 独立承包商关系
   1.1 您（以下简称"专家"）作为独立承包商（Independent Contractor）与 VibeFello 平台（以下简称"平台"）合作。
   1.2 双方明确确认：本协议不构成任何形式的雇佣关系、劳动关系、代理关系或合伙关系。
   1.3 您不是平台的员工、代理人或代表，不享有任何员工福利、社会保险、医疗保险、退休金计划或其他雇员待遇。
   1.4 您应自行负责所有与工作相关的开支，包括但不限于设备、软件、网络等费用。

2. 服务撮合性质
   2.1 平台仅作为技术专家与客户之间的信息撮合中介，提供订单匹配、支付托管、争议协调等基础服务。
   2.2 您与客户之间的技术服务合同关系由双方自行建立，平台不是该合同的当事方。
   2.3 平台不保证订单数量、质量或客户满意度，不对您的服务交付承担任何责任。
   2.4 您应独立承担服务交付的全部责任，包括但不限于代码质量、交付时效、售后支持等。

3. 收入与税费
   3.1 您通过平台获得的收入为独立承包服务报酬，平台将按约定比例收取服务费。
   3.2 您应自行负责申报和缴纳所有适用的个人所得税、增值税、营业税及其他相关税费。
   3.3 平台将根据适用法律要求，向税务机关报告您的收入信息。
   3.4 您应确保提供的税务信息真实、准确、完整。

4. 责任限制
   4.1 在法律允许的最大范围内，平台不对任何间接、附带、特殊、惩罚性或后果性损害承担责任。
   4.2 平台对您的最大赔偿责任不超过您在该争议事项上实际支付的平台服务费金额。
   4.3 您应自行购买职业责任保险，以覆盖因服务交付可能产生的法律责任。

5. 知识产权
   5.1 您向客户交付的工作成果的知识产权归属由您与客户自行约定。
   5.2 您保证交付的成果不侵犯任何第三方的知识产权或其他合法权益。
   5.3 因知识产权侵权产生的法律责任由您独立承担。

6. 保密义务
   6.1 您应对在服务过程中获取的客户信息、代码、商业机密等保密信息承担保密义务。
   6.2 保密义务在本协议终止后继续有效。

7. 协议期限与终止
   7.1 本协议自您完成入驻流程并支付订阅费用之日起生效。
   7.2 任何一方可提前 30 天书面通知对方终止本协议。
   7.3 如违反本协议，平台有权立即终止您的专家资格。

8. 争议解决
   8.1 因本协议产生的争议，双方应首先友好协商解决。
   8.2 协商不成的，任何一方可将争议提交平台所在地有管辖权的人民法院诉讼解决。
   8.3 本协议适用中华人民共和国法律（不包括冲突法规则）。

9. 其他
   9.1 本协议构成双方就专家服务的完整协议，取代之前的所有口头或书面约定。
   9.2 平台有权不时修订本协议，修订后的协议将在平台公示后生效。
   9.3 如您不同意修订后的协议，应停止使用平台服务。
`;

export interface Expert {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  completedJobs: number;
  skills: string[];
  bio: string;
  hourlyRate: number;
  isPro: boolean;
  tier: MembershipTier;
  monthlyLimit: number;
  feeDiscount: number;
}

export interface CodeAnalysisResult {
  summary: string;
  issues: string[];
  severity: 'high' | 'medium' | 'low';
  recommendations: string[];
  codeSnippets?: string[];
}

export interface Request {
  id: string;
  title: string;
  description: string;
  budget: string;
  techStack: string[];
  deliveryTime: string;
  status: OrderStatus;
  createdAt: string;
  expertId?: string;
  price?: number;
  consultationFeePaid: boolean;
  category?: string;
  subCategory?: string;
  urgency?: 'normal' | 'urgent';
  aiDiagnosis?: CodeAnalysisResult;
  expectedOutcome?: string;
  gitUrl?: string;
  branch?: string;
  filePath?: string;
}

export const MOCK_EXPERTS: Expert[] = [
  {
    id: 'e1',
    name: '陈老师 (Alex)',
    avatar: 'https://picsum.photos/seed/alex/100/100',
    rating: 4.9,
    completedJobs: 124,
    skills: ['Next.js', 'TypeScript', 'Vercel'],
    bio: '全栈专家，擅长 React 生态系统和云端部署。',
    hourlyRate: 80,
    isPro: true,
    tier: 'Pro',
    monthlyLimit: 20,
    feeDiscount: 0.05,
  },
  {
    id: 'e2',
    name: '米勒 (Sarah)',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
    rating: 4.8,
    completedJobs: 89,
    skills: ['Python', 'FastAPI', 'Docker'],
    bio: '后端专家。我可以修复您的 API 问题并进行容器化部署。',
    hourlyRate: 65,
    isPro: true,
    tier: 'Elite',
    monthlyLimit: 50,
    feeDiscount: 0.1,
  },
  {
    id: 'e3',
    name: '王大卫 (David)',
    avatar: 'https://picsum.photos/seed/david/100/100',
    rating: 5.0,
    completedJobs: 210,
    skills: ['React Native', 'Firebase', 'Node.js'],
    bio: '移动端和 Web 专家。拥有 10 年处理复杂状态问题的经验。',
    hourlyRate: 95,
    isPro: false,
    tier: 'Basic',
    monthlyLimit: 5,
    feeDiscount: 0,
  },
];

export const MOCK_REQUESTS: Request[] = [
  {
    id: 'r1',
    title: '修复 Next.js 水合错误',
    description: '我的 AI 生成的代码一直显示水合不匹配。页面加载时出现闪烁，控制台报错 "Hydration failed because the initial UI does not match what was rendered on the server"。',
    expectedOutcome: '修复水合错误，确保 SSR 和客户端渲染一致，消除控制台报错和页面闪烁。',
    budget: '$300 - $600',
    techStack: ['Next.js', 'React', 'TypeScript'],
    deliveryTime: '24 小时内',
    status: 'in_service',
    createdAt: '2024-03-25',
    expertId: 'e1',
    consultationFeePaid: true,
    category: 'Web',
    subCategory: '前端开发',
    urgency: 'urgent',
    gitUrl: 'https://github.com/example/my-nextjs-app',
    branch: 'main',
    filePath: 'src/components/Header.tsx',
    aiDiagnosis: {
      summary: '检测到 SSR 组件中使用了 window 对象导致水合不匹配。Header 组件在渲染时直接访问了 window.innerWidth，这在服务端渲染时不存在。',
      issues: ['水合不匹配', 'SSR 错误', '浏览器 API 访问'],
      severity: 'high',
      recommendations: ['使用 useEffect 包裹浏览器 API 调用', '使用 dynamic import 禁用 SSR', '添加 typeof window 检查'],
    },
  },
  {
    id: 'r2',
    title: '将 Python 脚本部署到 AWS',
    description: '我有一个爬虫脚本，可以正常运行，但不知道如何设置 EC2 实例或 Lambda。需要配置定时触发和日志监控。',
    expectedOutcome: '成功部署到 AWS Lambda，配置 CloudWatch 定时触发（每天凌晨2点），设置日志告警。',
    budget: '$600 - $1200',
    techStack: ['Python', 'AWS', 'Lambda'],
    deliveryTime: '3 天内',
    status: 'pending_quote',
    createdAt: '2024-03-27',
    expertId: 'e2',
    consultationFeePaid: true,
    category: 'DevOps',
    subCategory: '云部署',
    urgency: 'normal',
    gitUrl: 'https://github.com/example/python-scraper',
    branch: 'main',
  },
  {
    id: 'r3',
    title: 'React 状态管理混乱',
    description: '应用变得越来越慢，Props 传递到处都是。组件层级超过 10 层，状态更新导致整个应用重新渲染。',
    expectedOutcome: '重构状态管理，使用 Zustand 替代 Props drilling，优化渲染性能，减少不必要的重渲染。',
    budget: '$1000 - $2000',
    techStack: ['React', 'Zustand', 'TypeScript'],
    deliveryTime: '2 天内',
    status: 'completed',
    createdAt: '2024-03-10',
    expertId: 'e3',
    consultationFeePaid: true,
    category: 'Web',
    subCategory: '前端开发',
    urgency: 'normal',
    gitUrl: 'https://github.com/example/react-state-refactor',
    branch: 'develop',
    aiDiagnosis: {
      summary: '检测到组件层级过深，Props drilling 严重。建议引入全局状态管理，优化组件渲染性能。',
      issues: ['Props Drilling', '状态管理混乱', '性能问题'],
      severity: 'medium',
      recommendations: ['引入 Zustand 状态管理', '重构组件层级', '使用 React.memo 优化渲染'],
    },
  },
];

export const MOCK_MARKETPLACE: any[] = [
  { id: 'm1', title: 'SaaS 仪表盘 AI 生成代码修复', tags: ['SaaS', 'Next.js', 'Auth'], budget: '$800 - $1500', time: '15m前', status: '待报价', description: '详细描述：使用 Cursor 生成的 SaaS 仪表盘在处理多租户逻辑时出现数据泄露风险，需要专家审查并修复权限校验逻辑。' },
  { id: 'm2', title: 'Roguelike 游戏数值系统调试', tags: ['Game', 'Unity', 'AI'], budget: '$1200 - $2500', time: '45m前', status: '进行中', description: '详细描述：AI 编写的随机地图生成算法在特定种子下会产生死路，且数值平衡性较差，需要资深游戏开发协助优化。' },
  { id: 'm3', title: '多 Agent 协作流编排优化', tags: ['Agent 编排', 'LangChain', 'Python'], budget: '$2000 - $4500', time: '1h前', status: '待报价', description: '详细描述：目前有 3 个 Agent 分别负责搜索、总结和代码生成，但它们之间的上下文传递经常丢失，需要优化编排逻辑。' },
  { id: 'm4', title: 'Stripe Webhook 签名验证失败', tags: ['API 调试', 'Node.js', 'Payments'], budget: '$500 - $1000', time: '1.5h前', status: '待报价', description: '详细描述：本地测试正常，但部署到生产环境后，Stripe 的 Webhook 始终返回 400 错误，怀疑是 Raw Body 解析问题。' },
  { id: 'm5', title: 'AWS Lambda 部署与冷启动优化', tags: ['云部署', 'Serverless', 'AWS'], budget: '$1000 - $2000', time: '2h前', status: '进行中', description: '详细描述：Python 依赖包过大导致 Lambda 部署包超过限制，且冷启动时间超过 5 秒，需要协助进行层（Layer）拆分和优化。' },
  { id: 'm6', title: 'CUDA 环境与 PyTorch 版本冲突', tags: ['环境安装', 'AI', 'Python'], budget: '$600 - $1200', time: '3h前', status: '待报价', description: '详细描述：在 Ubuntu 服务器上安装 GPU 版 PyTorch 失败，一直显示找不到 CUDA 驱动，需要专家远程协助配置环境。' },
  { id: 'm7', title: 'React Native 复杂手势动画卡顿', tags: ['Mobile', 'Performance'], budget: '$1500 - $3000', time: '4h前', status: '待报价', description: '详细描述：AI 生成的列表滑动动画在低端安卓机上非常卡顿，需要使用 Reanimated 2 进行底层重构。' },
  { id: 'm8', title: 'Solidity 重入攻击漏洞审计', tags: ['Web3', 'Security'], budget: '$3000 - $7000', time: '6h前', status: '进行中', description: '详细描述：AI 辅助编写的质押合约在审计工具中报出重入风险，需要专家手动修改逻辑并确保资金安全。' },
  { id: 'm9', title: 'Vector DB 检索精度调优', tags: ['Infrastructure', 'RAG'], budget: '$1800 - $4000', time: '8h前', status: '待报价', description: '详细描述：Pinecone 检索回来的文档相关性极低，需要协助优化 Embedding 模型选择和分段（Chunking）策略。' },
  { id: 'm10', title: 'Chrome 插件跨域通信报错', tags: ['API 调试', 'Browser Ext'], budget: '$400 - $800', time: '12h前', status: '已完成', description: '详细描述：Background Script 无法正确接收 Content Script 发送的消息，且存在 CORS 拦截问题。' },
  { id: 'm11', title: 'Docker 镜像体积从 2GB 优化到 200MB', tags: ['云部署', 'Docker'], budget: '$700 - $1500', time: '1d前', status: '待报价', description: '详细描述：目前的 Docker 镜像包含了大量无用构建依赖，导致 CI/CD 极其缓慢，需要多阶段构建优化。' },
  { id: 'm12', title: 'Prompt 注入风险防御加固', tags: ['Skills', 'Security'], budget: '$1200 - $2500', time: '1d前', status: '待报价', description: '详细描述：用户可以通过特定的输入绕过系统提示词，需要设计更健壮的输入过滤和 Prompt 结构。' },
  { id: 'm13', title: 'PostgreSQL 慢查询与死锁排查', tags: ['Infrastructure', 'Database'], budget: '$1500 - $3500', time: '2d前', status: '进行中', description: '详细描述：在高并发场景下，数据库频繁出现死锁，且部分关联查询耗时超过 3 秒，需要索引优化。' },
  { id: 'm14', title: 'Playwright 自动化测试环境搭建', tags: ['Testing', 'DevOps'], budget: '$800 - $1600', time: '2d前', status: '待报价', description: '详细描述：需要在 GitHub Actions 中配置 Playwright 运行环境，并解决由于浏览器依赖缺失导致的构建失败。' },
  { id: 'm15', title: 'Framer Motion 复杂路径动画实现', tags: ['UI/UX', 'Frontend'], budget: '$500 - $1200', time: '3d前', status: '已完成', description: '详细描述：AI 无法理解复杂的 SVG 路径动画逻辑，需要手动编写基于 Scroll 的进度控制动画。' },
  { id: 'm16', title: 'Vue 3 组合式 API 大规模重构', tags: ['Frontend', 'Vue.js'], budget: '$1500 - $4000', time: '1h前', status: '待报价', description: '详细描述：现有的选项式 API 代码库过于臃肿，AI 在自动迁移时逻辑混乱，需要专家手动进行逻辑提取和重构。' },
  { id: 'm17', title: 'gRPC 微服务通信超时排查', tags: ['Backend', 'Microservices'], budget: '$2000 - $5000', time: '2h前', status: '进行中', description: '详细描述：在高并发下，部分微服务节点出现随机的 gRPC 超时，怀疑是连接池配置或负载均衡策略问题。' },
  { id: 'm18', title: 'Twilio 短信验证流 SDK 集成', tags: ['SDK 集成', 'Node.js'], budget: '$600 - $1200', time: '4h前', status: '待报价', description: '详细描述：需要集成 Twilio Verify API，处理全球号码格式兼容性和验证码重发逻辑。' },
  { id: 'm19', title: 'NFT 铸造合约 Gas 费深度优化', tags: ['Smart Contract', 'Solidity'], budget: '$2500 - $6000', time: '6h前', status: '待报价', description: '详细描述：目前的铸造合约在以太坊主网上 Gas 消耗过高，需要使用 ERC721A 或优化循环逻辑来降低成本。' },
  { id: 'm20', title: 'Google Maps 自定义标记与聚合逻辑', tags: ['SDK 集成', 'Frontend'], budget: '$800 - $1800', time: '8h前', status: '进行中', description: '详细描述：AI 无法处理数千个标记点的实时聚合（Clustering）和自定义 InfoWindow 的渲染性能问题。' },
  { id: 'm21', title: 'Redis 缓存击穿与雪崩防御设计', tags: ['Backend', 'Infrastructure'], budget: '$1200 - $3000', time: '12h前', status: '待报价', description: '详细描述：需要为现有的高流量 API 设计健壮的缓存策略，包括逻辑过期、布隆过滤器等。' },
  { id: 'm22', title: 'SvelteKit 复杂路由与状态同步', tags: ['Frontend', 'Svelte'], budget: '$1000 - $2500', time: '1d前', status: '待报价', description: '详细描述：在嵌套路由下，AI 生成的状态管理逻辑在页面刷新后会丢失，需要优化 Store 的持久化方案。' },
  { id: 'm23', title: 'Prometheus & Grafana 监控体系搭建', tags: ['DevOps', 'Infrastructure'], budget: '$1500 - $3500', time: '1d前', status: '待报价', description: '详细描述：需要为 K8s 集群配置完整的监控指标采集和告警看板，处理自定义 Metrics 的暴露。' },
  { id: 'm24', title: 'Llama 3 模型私有化部署与微调', tags: ['Data Science', 'AI'], budget: '$5000 - $12000', time: '2d前', status: '进行中', description: '详细描述：需要在本地服务器上使用 vLLM 部署 Llama 3，并针对特定行业语料进行 LoRA 微调。' },
  { id: 'm25', title: 'SQL 注入漏洞全量扫描与修复', tags: ['Security', 'Backend'], budget: '$2000 - $4500', time: '2d前', status: '待报价', description: '详细描述：老旧项目存在多处拼接 SQL 的风险，需要进行全量审计并重构为参数化查询。' },
  { id: 'm26', title: 'Electron 应用跨进程通信优化', tags: ['Desktop', 'JavaScript'], budget: '$1200 - $2800', time: '2d前', status: '待报价', description: '详细描述：AI 生成的 IPC 通信逻辑导致渲染进程频繁卡死，需要优化消息总线设计。' },
  { id: 'm27', title: 'GraphQL Schema 拼接与性能调优', tags: ['Backend', 'GraphQL'], budget: '$1800 - $3500', time: '3d前', status: '进行中', description: '详细描述：多个子服务的 Schema 拼接后出现命名冲突，且 N+1 查询问题严重，需要专家协助。' },
  { id: 'm28', title: 'WebAssembly 图像处理算法迁移', tags: ['Performance', 'C++', 'WASM'], budget: '$3000 - $6500', time: '3d前', status: '待报价', description: '详细描述：需要将现有的 C++ 滤镜算法迁移到 WASM，以在浏览器端实现毫秒级的实时预览。' },
  { id: 'm29', title: 'Kubernetes 零宕机滚动更新配置', tags: ['DevOps', 'K8s'], budget: '$2000 - $4000', time: '4d前', status: '待报价', description: '详细描述：目前的部署流程在更新时会出现短暂的服务中断，需要优化探针配置和优雅退出逻辑。' },
  { id: 'm30', title: 'Zustand 状态持久化与多端同步', tags: ['Frontend', 'State'], budget: '$800 - $1500', time: '5d前', status: '已完成', description: '详细描述：需要在 Web 和 Electron 端同步 Zustand 状态，并处理复杂的冲突合并逻辑。' },
];
