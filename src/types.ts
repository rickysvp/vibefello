
export type OrderStatus = 'pending_consultation' | 'pending_quote' | 'quoted' | 'in_service' | 'cooling' | 'completed';

export type MembershipTier = 'Basic' | 'Pro' | 'Elite';

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
    description: '我的 AI 生成的代码一直显示水合不匹配。需要帮助修复 SSR 逻辑。',
    budget: '¥300 - ¥600',
    techStack: ['Next.js', 'React'],
    deliveryTime: '24 小时内',
    status: 'in_service',
    createdAt: '2024-03-25',
    expertId: 'e1',
    price: 500,
    consultationFeePaid: true,
  },
  {
    id: 'r2',
    title: '将 Python 脚本部署到 AWS',
    description: '我有一个爬虫脚本，但不知道如何设置 EC2 实例或 Lambda。',
    budget: '¥600 - ¥1200',
    techStack: ['Python', 'AWS'],
    deliveryTime: '3 天内',
    status: 'pending_quote',
    createdAt: '2024-03-27',
    consultationFeePaid: true,
  },
  {
    id: 'r3',
    title: 'React 状态管理混乱',
    description: '应用变得越来越慢，Props 传递到处都是。需要一个干净的 Redux 或 Zustand 设置。',
    budget: '¥1000 - ¥2000',
    techStack: ['React', 'Zustand'],
    deliveryTime: '2 天内',
    status: 'completed',
    createdAt: '2024-03-10',
    expertId: 'e3',
    price: 1500,
    consultationFeePaid: true,
  },
];

export const MOCK_MARKETPLACE: any[] = [
  { id: 'm1', title: 'SaaS 仪表盘 AI 生成代码修复', tags: ['SaaS', 'Next.js', 'Auth'], budget: '¥800 - ¥1500', time: '15m前', status: '待报价', description: '详细描述：使用 Cursor 生成的 SaaS 仪表盘在处理多租户逻辑时出现数据泄露风险，需要专家审查并修复权限校验逻辑。' },
  { id: 'm2', title: 'Roguelike 游戏数值系统调试', tags: ['Game', 'Unity', 'AI'], budget: '¥1200 - ¥2500', time: '45m前', status: '进行中', description: '详细描述：AI 编写的随机地图生成算法在特定种子下会产生死路，且数值平衡性较差，需要资深游戏开发协助优化。' },
  { id: 'm3', title: '多 Agent 协作流编排优化', tags: ['Agent 编排', 'LangChain', 'Python'], budget: '¥2000 - ¥4500', time: '1h前', status: '待报价', description: '详细描述：目前有 3 个 Agent 分别负责搜索、总结和代码生成，但它们之间的上下文传递经常丢失，需要优化编排逻辑。' },
  { id: 'm4', title: 'Stripe Webhook 签名验证失败', tags: ['API 调试', 'Node.js', 'Payments'], budget: '¥500 - ¥1000', time: '1.5h前', status: '待报价', description: '详细描述：本地测试正常，但部署到生产环境后，Stripe 的 Webhook 始终返回 400 错误，怀疑是 Raw Body 解析问题。' },
  { id: 'm5', title: 'AWS Lambda 部署与冷启动优化', tags: ['云部署', 'Serverless', 'AWS'], budget: '¥1000 - ¥2000', time: '2h前', status: '进行中', description: '详细描述：Python 依赖包过大导致 Lambda 部署包超过限制，且冷启动时间超过 5 秒，需要协助进行层（Layer）拆分和优化。' },
  { id: 'm6', title: 'CUDA 环境与 PyTorch 版本冲突', tags: ['环境安装', 'AI', 'Python'], budget: '¥600 - ¥1200', time: '3h前', status: '待报价', description: '详细描述：在 Ubuntu 服务器上安装 GPU 版 PyTorch 失败，一直显示找不到 CUDA 驱动，需要专家远程协助配置环境。' },
  { id: 'm7', title: 'React Native 复杂手势动画卡顿', tags: ['Mobile', 'Performance'], budget: '¥1500 - ¥3000', time: '4h前', status: '待报价', description: '详细描述：AI 生成的列表滑动动画在低端安卓机上非常卡顿，需要使用 Reanimated 2 进行底层重构。' },
  { id: 'm8', title: 'Solidity 重入攻击漏洞审计', tags: ['Web3', 'Security'], budget: '¥3000 - ¥7000', time: '6h前', status: '进行中', description: '详细描述：AI 辅助编写的质押合约在审计工具中报出重入风险，需要专家手动修改逻辑并确保资金安全。' },
  { id: 'm9', title: 'Vector DB 检索精度调优', tags: ['Infrastructure', 'RAG'], budget: '¥1800 - ¥4000', time: '8h前', status: '待报价', description: '详细描述：Pinecone 检索回来的文档相关性极低，需要协助优化 Embedding 模型选择和分段（Chunking）策略。' },
  { id: 'm10', title: 'Chrome 插件跨域通信报错', tags: ['API 调试', 'Browser Ext'], budget: '¥400 - ¥800', time: '12h前', status: '已完成', description: '详细描述：Background Script 无法正确接收 Content Script 发送的消息，且存在 CORS 拦截问题。' },
  { id: 'm11', title: 'Docker 镜像体积从 2GB 优化到 200MB', tags: ['云部署', 'Docker'], budget: '¥700 - ¥1500', time: '1d前', status: '待报价', description: '详细描述：目前的 Docker 镜像包含了大量无用构建依赖，导致 CI/CD 极其缓慢，需要多阶段构建优化。' },
  { id: 'm12', title: 'Prompt 注入风险防御加固', tags: ['Skills', 'Security'], budget: '¥1200 - ¥2500', time: '1d前', status: '待报价', description: '详细描述：用户可以通过特定的输入绕过系统提示词，需要设计更健壮的输入过滤和 Prompt 结构。' },
  { id: 'm13', title: 'PostgreSQL 慢查询与死锁排查', tags: ['Infrastructure', 'Database'], budget: '¥1500 - ¥3500', time: '2d前', status: '进行中', description: '详细描述：在高并发场景下，数据库频繁出现死锁，且部分关联查询耗时超过 3 秒，需要索引优化。' },
  { id: 'm14', title: 'Playwright 自动化测试环境搭建', tags: ['Testing', 'DevOps'], budget: '¥800 - ¥1600', time: '2d前', status: '待报价', description: '详细描述：需要在 GitHub Actions 中配置 Playwright 运行环境，并解决由于浏览器依赖缺失导致的构建失败。' },
  { id: 'm15', title: 'Framer Motion 复杂路径动画实现', tags: ['UI/UX', 'Frontend'], budget: '¥500 - ¥1200', time: '3d前', status: '已完成', description: '详细描述：AI 无法理解复杂的 SVG 路径动画逻辑，需要手动编写基于 Scroll 的进度控制动画。' },
  { id: 'm16', title: 'Vue 3 组合式 API 大规模重构', tags: ['Frontend', 'Vue.js'], budget: '¥1500 - ¥4000', time: '1h前', status: '待报价', description: '详细描述：现有的选项式 API 代码库过于臃肿，AI 在自动迁移时逻辑混乱，需要专家手动进行逻辑提取和重构。' },
  { id: 'm17', title: 'gRPC 微服务通信超时排查', tags: ['Backend', 'Microservices'], budget: '¥2000 - ¥5000', time: '2h前', status: '进行中', description: '详细描述：在高并发下，部分微服务节点出现随机的 gRPC 超时，怀疑是连接池配置或负载均衡策略问题。' },
  { id: 'm18', title: 'Twilio 短信验证流 SDK 集成', tags: ['SDK 集成', 'Node.js'], budget: '¥600 - ¥1200', time: '4h前', status: '待报价', description: '详细描述：需要集成 Twilio Verify API，处理全球号码格式兼容性和验证码重发逻辑。' },
  { id: 'm19', title: 'NFT 铸造合约 Gas 费深度优化', tags: ['Smart Contract', 'Solidity'], budget: '¥2500 - ¥6000', time: '6h前', status: '待报价', description: '详细描述：目前的铸造合约在以太坊主网上 Gas 消耗过高，需要使用 ERC721A 或优化循环逻辑来降低成本。' },
  { id: 'm20', title: 'Google Maps 自定义标记与聚合逻辑', tags: ['SDK 集成', 'Frontend'], budget: '¥800 - ¥1800', time: '8h前', status: '进行中', description: '详细描述：AI 无法处理数千个标记点的实时聚合（Clustering）和自定义 InfoWindow 的渲染性能问题。' },
  { id: 'm21', title: 'Redis 缓存击穿与雪崩防御设计', tags: ['Backend', 'Infrastructure'], budget: '¥1200 - ¥3000', time: '12h前', status: '待报价', description: '详细描述：需要为现有的高流量 API 设计健壮的缓存策略，包括逻辑过期、布隆过滤器等。' },
  { id: 'm22', title: 'SvelteKit 复杂路由与状态同步', tags: ['Frontend', 'Svelte'], budget: '¥1000 - ¥2500', time: '1d前', status: '待报价', description: '详细描述：在嵌套路由下，AI 生成的状态管理逻辑在页面刷新后会丢失，需要优化 Store 的持久化方案。' },
  { id: 'm23', title: 'Prometheus & Grafana 监控体系搭建', tags: ['DevOps', 'Infrastructure'], budget: '¥1500 - ¥3500', time: '1d前', status: '待报价', description: '详细描述：需要为 K8s 集群配置完整的监控指标采集和告警看板，处理自定义 Metrics 的暴露。' },
  { id: 'm24', title: 'Llama 3 模型私有化部署与微调', tags: ['Data Science', 'AI'], budget: '¥5000 - ¥12000', time: '2d前', status: '进行中', description: '详细描述：需要在本地服务器上使用 vLLM 部署 Llama 3，并针对特定行业语料进行 LoRA 微调。' },
  { id: 'm25', title: 'SQL 注入漏洞全量扫描与修复', tags: ['Security', 'Backend'], budget: '¥2000 - ¥4500', time: '2d前', status: '待报价', description: '详细描述：老旧项目存在多处拼接 SQL 的风险，需要进行全量审计并重构为参数化查询。' },
  { id: 'm26', title: 'Electron 应用跨进程通信优化', tags: ['Desktop', 'JavaScript'], budget: '¥1200 - ¥2800', time: '2d前', status: '待报价', description: '详细描述：AI 生成的 IPC 通信逻辑导致渲染进程频繁卡死，需要优化消息总线设计。' },
  { id: 'm27', title: 'GraphQL Schema 拼接与性能调优', tags: ['Backend', 'GraphQL'], budget: '¥1800 - ¥3500', time: '3d前', status: '进行中', description: '详细描述：多个子服务的 Schema 拼接后出现命名冲突，且 N+1 查询问题严重，需要专家协助。' },
  { id: 'm28', title: 'WebAssembly 图像处理算法迁移', tags: ['Performance', 'C++', 'WASM'], budget: '¥3000 - ¥6500', time: '3d前', status: '待报价', description: '详细描述：需要将现有的 C++ 滤镜算法迁移到 WASM，以在浏览器端实现毫秒级的实时预览。' },
  { id: 'm29', title: 'Kubernetes 零宕机滚动更新配置', tags: ['DevOps', 'K8s'], budget: '¥2000 - ¥4000', time: '4d前', status: '待报价', description: '详细描述：目前的部署流程在更新时会出现短暂的服务中断，需要优化探针配置和优雅退出逻辑。' },
  { id: 'm30', title: 'Zustand 状态持久化与多端同步', tags: ['Frontend', 'State'], budget: '¥800 - ¥1500', time: '5d前', status: '已完成', description: '详细描述：需要在 Web 和 Electron 端同步 Zustand 状态，并处理复杂的冲突合并逻辑。' },
];
