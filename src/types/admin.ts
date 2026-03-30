// 管理后台类型定义

// 管理员用户
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin';
  createdAt: string;
  lastLoginAt?: string;
}

// 平台统计数据
export interface PlatformStats {
  totalUsers: number;
  totalExperts: number;
  totalOrders: number;
  totalRevenue: number;
  todayNewUsers: number;
  todayNewOrders: number;
  todayRevenue: number;
  pendingExpertApplications: number;
  pendingOrders: number;
  inProgressOrders: number;
  completedOrders: number;
}

// 订单状态分布
export interface OrderStatusDistribution {
  pending: number;
  quoted: number;
  inService: number;
  completed: number;
  disputed: number;
}

// 热门标签统计
export interface PopularTag {
  name: string;
  count: number;
}

// 用户列表项
export interface UserListItem {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tier: 'free' | 'pro' | 'max';
  orderCount: number;
  totalSpent: number;
  createdAt: string;
  status: 'active' | 'banned';
}

// 专家列表项
export interface ExpertListItem {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  realName: string;
  skills: string[];
  tier: 'Starter' | 'Pro' | 'Elite';
  verificationStatus: 'pending' | 'submitted' | 'approved' | 'rejected';
  completedOrders: number;
  totalEarnings: number;
  rating: number;
  createdAt: string;
  subscriptionExpiry?: string;
  status: 'active' | 'banned';
}

// 专家申请详情
export interface ExpertApplicationDetail {
  id: string;
  userId: string;
  realName: string;
  email: string;
  primaryDomains: string[];
  techStack: string[];
  languages: string[];
  vibeCodingLevel: string;
  bio: string;
  portfolioUrl?: string;
  idDocumentType: 'id_card' | 'passport';
  idDocumentFrontUrl: string;
  idDocumentBackUrl?: string;
  agreementAccepted: boolean;
  agreementAcceptedAt: string;
  selectedTier: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

// 订单列表项
export interface OrderListItem {
  id: string;
  title: string;
  userId: string;
  userName: string;
  expertId?: string;
  expertName?: string;
  budget: string;
  status: 'pending_quote' | 'quoted' | 'in_service' | 'cooling' | 'completed' | 'disputed';
  createdAt: string;
  completedAt?: string;
  hasDispute: boolean;
  tags: string[];
}

// 订单详情
export interface OrderDetail extends OrderListItem {
  description: string;
  expectedOutcome?: string;
  gitUrl?: string;
  aiDiagnosis?: {
    summary: string;
    severity: 'high' | 'medium' | 'low';
    issues: string[];
    recommendations: string[];
  };
  price?: number;
  platformFee: number;
  expertIncome: number;
}

// 财务记录
export interface FinanceRecord {
  id: string;
  type: 'order_fee' | 'subscription' | 'expert_payout' | 'refund';
  amount: number;
  description: string;
  userId?: string;
  userName?: string;
  expertId?: string;
  expertName?: string;
  orderId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

// 专家结算
export interface ExpertPayout {
  id: string;
  expertId: string;
  expertName: string;
  amount: number;
  orderIds: string[];
  status: 'pending' | 'processing' | 'completed';
  requestedAt: string;
  processedAt?: string;
}

// 系统设置
export interface SystemSettings {
  platformName: string;
  platformFee: {
    starter: number;
    pro: number;
    elite: number;
  };
  settlementDays: {
    starter: number;
    pro: number;
    elite: number;
  };
  expertSubscriptionPrices: {
    starter: number;
    pro: number;
    elite: number;
  };
}

// Mock 管理员账号
export const MOCK_ADMIN: AdminUser = {
  id: 'admin-1',
  username: 'admin',
  email: 'admin@vibefello.com',
  role: 'super_admin',
  createdAt: '2024-01-01T00:00:00Z',
  lastLoginAt: '2024-03-29T10:00:00Z'
};

// Mock 平台统计数据
export const MOCK_PLATFORM_STATS: PlatformStats = {
  totalUsers: 1234,
  totalExperts: 56,
  totalOrders: 892,
  totalRevenue: 45230,
  todayNewUsers: 23,
  todayNewOrders: 12,
  todayRevenue: 3400,
  pendingExpertApplications: 8,
  pendingOrders: 45,
  inProgressOrders: 23,
  completedOrders: 824
};

// Mock 订单状态分布
export const MOCK_ORDER_STATUS_DISTRIBUTION: OrderStatusDistribution = {
  pending: 45,
  quoted: 12,
  inService: 23,
  completed: 824,
  disputed: 3
};

// Mock 热门标签
export const MOCK_POPULAR_TAGS: PopularTag[] = [
  { name: 'React', count: 156 },
  { name: 'Next.js', count: 134 },
  { name: 'Python', count: 98 },
  { name: 'Node.js', count: 87 },
  { name: 'AI', count: 76 },
  { name: 'Docker', count: 65 },
  { name: 'AWS', count: 54 },
  { name: 'TypeScript', count: 52 }
];

// Mock 用户列表
export const MOCK_USER_LIST: UserListItem[] = [
  {
    id: 'u1',
    name: '张三',
    email: 'zhangsan@example.com',
    tier: 'pro',
    orderCount: 5,
    totalSpent: 3200,
    createdAt: '2024-03-01T10:00:00Z',
    status: 'active'
  },
  {
    id: 'u2',
    name: '李四',
    email: 'lisi@example.com',
    tier: 'free',
    orderCount: 1,
    totalSpent: 500,
    createdAt: '2024-03-05T14:30:00Z',
    status: 'active'
  },
  {
    id: 'u3',
    name: '王五',
    email: 'wangwu@example.com',
    tier: 'max',
    orderCount: 12,
    totalSpent: 15000,
    createdAt: '2024-02-15T09:00:00Z',
    status: 'active'
  }
];

// Mock 专家列表
export const MOCK_EXPERT_LIST: ExpertListItem[] = [
  {
    id: 'e1',
    name: '陈老师 (Alex)',
    email: 'alex@example.com',
    realName: '陈明',
    skills: ['React', 'Next.js', 'TypeScript'],
    tier: 'Pro',
    verificationStatus: 'approved',
    completedOrders: 45,
    totalEarnings: 28000,
    rating: 4.9,
    createdAt: '2024-01-15T00:00:00Z',
    subscriptionExpiry: '2024-12-31T00:00:00Z',
    status: 'active'
  },
  {
    id: 'e2',
    name: '米勒 (Sarah)',
    email: 'sarah@example.com',
    realName: 'Sarah Miller',
    skills: ['Python', 'FastAPI', 'Docker'],
    tier: 'Elite',
    verificationStatus: 'approved',
    completedOrders: 32,
    totalEarnings: 35000,
    rating: 4.8,
    createdAt: '2024-02-01T00:00:00Z',
    subscriptionExpiry: '2024-12-31T00:00:00Z',
    status: 'active'
  },
  {
    id: 'e3',
    name: '待审核专家',
    email: 'pending@example.com',
    realName: '王小红',
    skills: ['Vue', 'Node.js'],
    tier: 'Starter',
    verificationStatus: 'submitted',
    completedOrders: 0,
    totalEarnings: 0,
    rating: 0,
    createdAt: '2024-03-28T00:00:00Z',
    status: 'active'
  }
];

// Mock 专家申请详情
export const MOCK_EXPERT_APPLICATIONS: ExpertApplicationDetail[] = [
  {
    id: 'app-1',
    userId: 'e3',
    realName: '王小红',
    email: 'pending@example.com',
    primaryDomains: ['web', 'mobile'],
    techStack: ['Vue', 'React Native', 'Node.js'],
    languages: ['javascript', 'typescript'],
    vibeCodingLevel: 'intermediate',
    bio: '3年全栈开发经验，擅长前端开发和移动端应用。专注于解决AI生成代码的调试问题。',
    portfolioUrl: 'https://github.com/wangxiaohong',
    idDocumentType: 'id_card',
    idDocumentFrontUrl: 'https://example.com/id-front.jpg',
    idDocumentBackUrl: 'https://example.com/id-back.jpg',
    agreementAccepted: true,
    agreementAcceptedAt: '2024-03-28T10:00:00Z',
    selectedTier: 'Starter',
    status: 'submitted',
    submittedAt: '2024-03-28T10:00:00Z'
  }
];

// Mock 订单列表
export const MOCK_ORDER_LIST: OrderListItem[] = [
  {
    id: 'o1',
    title: '修复 Next.js 水合错误',
    userId: 'u1',
    userName: '张三',
    expertId: 'e1',
    expertName: '陈老师 (Alex)',
    budget: '$300 - $600',
    status: 'in_service',
    createdAt: '2024-03-25T10:00:00Z',
    hasDispute: false,
    tags: ['Next.js', 'React', 'SSR']
  },
  {
    id: 'o2',
    title: 'AWS Lambda 部署优化',
    userId: 'u2',
    userName: '李四',
    budget: '$1000 - $2000',
    status: 'pending_quote',
    createdAt: '2024-03-27T14:00:00Z',
    hasDispute: false,
    tags: ['AWS', 'Lambda', 'Python']
  },
  {
    id: 'o3',
    title: 'Solidity 合约审计',
    userId: 'u3',
    userName: '王五',
    expertId: 'e2',
    expertName: '米勒 (Sarah)',
    budget: '$3000 - $7000',
    status: 'completed',
    createdAt: '2024-03-20T09:00:00Z',
    completedAt: '2024-03-25T18:00:00Z',
    hasDispute: true,
    tags: ['Web3', 'Solidity', 'Security']
  }
];

// Mock 财务记录
export const MOCK_FINANCE_RECORDS: FinanceRecord[] = [
  {
    id: 'f1',
    type: 'order_fee',
    amount: 120,
    description: '订单 #o1 平台服务费',
    userId: 'u1',
    userName: '张三',
    expertId: 'e1',
    expertName: '陈老师 (Alex)',
    orderId: 'o1',
    status: 'completed',
    createdAt: '2024-03-25T10:00:00Z'
  },
  {
    id: 'f2',
    type: 'subscription',
    amount: 99,
    description: '专家 Pro 订阅费用',
    expertId: 'e1',
    expertName: '陈老师 (Alex)',
    status: 'completed',
    createdAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'f3',
    type: 'expert_payout',
    amount: 480,
    description: '专家收入结算',
    expertId: 'e1',
    expertName: '陈老师 (Alex)',
    status: 'pending',
    createdAt: '2024-03-26T00:00:00Z'
  }
];

// Mock 系统设置
export const MOCK_SYSTEM_SETTINGS: SystemSettings = {
  platformName: 'VibeFello',
  platformFee: {
    starter: 20,
    pro: 15,
    elite: 10
  },
  settlementDays: {
    starter: 15,
    pro: 7,
    elite: 7
  },
  expertSubscriptionPrices: {
    starter: 39,
    pro: 99,
    elite: 299
  }
};

// 专家违规记录
export interface ExpertViolation {
  id: string;
  expertId: string;
  type: 'late_delivery' | 'poor_quality' | 'rude_behavior' | 'fraud' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high';
  orderId?: string;
  reportedBy: string;
  status: 'pending' | 'confirmed' | 'dismissed';
  action?: 'warning' | 'suspend_3d' | 'suspend_7d' | 'suspend_30d' | 'permanent_ban';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  notes?: string;
}

// 对话消息
export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderType: 'user' | 'expert';
  senderName: string;
  content: string;
  attachments?: string[];
  createdAt: string;
  isSystem?: boolean;
}

// 对话记录
export interface ChatHistory {
  orderId: string;
  userId: string;
  userName: string;
  expertId: string;
  expertName: string;
  messages: ChatMessage[];
}

// Mock 违规记录
export const MOCK_VIOLATIONS: ExpertViolation[] = [
  {
    id: 'v1',
    expertId: 'e1',
    type: 'late_delivery',
    description: '专家未在约定时间内交付代码，延迟了2天',
    severity: 'medium',
    orderId: 'o1',
    reportedBy: '用户张三',
    status: 'confirmed',
    action: 'warning',
    createdAt: '2024-03-20T10:00:00Z',
    resolvedAt: '2024-03-21T14:00:00Z',
    resolvedBy: 'admin',
    notes: '已联系专家，承诺改进'
  },
  {
    id: 'v2',
    expertId: 'e2',
    type: 'poor_quality',
    description: '交付的代码存在严重bug，无法正常运行',
    severity: 'high',
    orderId: 'o3',
    reportedBy: '用户王五',
    status: 'pending',
    createdAt: '2024-03-28T09:00:00Z'
  }
];

// Mock 对话记录
export const MOCK_CHAT_HISTORY: ChatHistory[] = [
  {
    orderId: 'o1',
    userId: 'u1',
    userName: '张三',
    expertId: 'e1',
    expertName: '陈老师 (Alex)',
    messages: [
      {
        id: 'm1',
        orderId: 'o1',
        senderId: 'u1',
        senderType: 'user',
        senderName: '张三',
        content: '你好，我的Next.js项目遇到了水合错误，能帮忙看看吗？',
        createdAt: '2024-03-25T10:00:00Z'
      },
      {
        id: 'm2',
        orderId: 'o1',
        senderId: 'e1',
        senderType: 'expert',
        senderName: '陈老师 (Alex)',
        content: '你好！可以把GitHub仓库链接发给我吗？我需要查看一下代码。',
        createdAt: '2024-03-25T10:05:00Z'
      },
      {
        id: 'm3',
        orderId: 'o1',
        senderId: 'u1',
        senderType: 'user',
        senderName: '张三',
        content: 'https://github.com/zhangsan/my-nextjs-app',
        createdAt: '2024-03-25T10:06:00Z'
      },
      {
        id: 'm4',
        orderId: 'o1',
        senderId: 'e1',
        senderType: 'expert',
        senderName: '陈老师 (Alex)',
        content: '我看到了问题。你在Header组件中直接使用了window对象，这在SSR时会导致问题。需要在useEffect中访问浏览器API。',
        createdAt: '2024-03-25T10:15:00Z'
      },
      {
        id: 'm5',
        orderId: 'o1',
        senderId: 'e1',
        senderType: 'expert',
        senderName: '陈老师 (Alex)',
        content: '我已经修复了代码，请查收PR。',
        createdAt: '2024-03-25T14:00:00Z'
      }
    ]
  },
  {
    orderId: 'o3',
    userId: 'u3',
    userName: '王五',
    expertId: 'e2',
    expertName: '米勒 (Sarah)',
    messages: [
      {
        id: 'm6',
        orderId: 'o3',
        senderId: 'u3',
        senderType: 'user',
        senderName: '王五',
        content: '这个Solidity合约能帮我审计一下吗？我担心有安全问题。',
        createdAt: '2024-03-20T09:00:00Z'
      },
      {
        id: 'm7',
        orderId: 'o3',
        senderId: 'e2',
        senderType: 'expert',
        senderName: '米勒 (Sarah)',
        content: '可以的，请提供合约代码或仓库链接。',
        createdAt: '2024-03-20T09:30:00Z'
      }
    ]
  }
];
