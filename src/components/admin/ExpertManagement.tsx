import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, CheckCircle, XCircle, Eye, MoreHorizontal,
  UserCheck, Clock, AlertCircle, Star, Briefcase, Code,
  Github, FileText, X, ChevronLeft, ChevronRight, Shield,
  MessageSquare, Ban, AlertTriangle, Lock, Unlock, History
} from 'lucide-react';
import {
  ExpertListItem, ExpertApplicationDetail, ExpertViolation, ChatHistory,
  MOCK_EXPERT_LIST, MOCK_EXPERT_APPLICATIONS, MOCK_VIOLATIONS, MOCK_CHAT_HISTORY
} from '../../types/admin';

type ExpertStatus = 'all' | 'pending' | 'approved' | 'rejected';
type ModalTab = 'info' | 'violations' | 'chats';

// 违规类型映射
const VIOLATION_TYPES: Record<string, string> = {
  late_delivery: '延迟交付',
  poor_quality: '质量不达标',
  rude_behavior: '态度恶劣',
  fraud: '欺诈行为',
  other: '其他违规'
};

// 违规严重程度映射
const SEVERITY_LABELS: Record<string, { label: string; color: string }> = {
  low: { label: '轻微', color: 'bg-blue-100 text-blue-700' },
  medium: { label: '中等', color: 'bg-amber-100 text-amber-700' },
  high: { label: '严重', color: 'bg-red-100 text-red-700' }
};

// 处罚措施映射
const ACTION_LABELS: Record<string, string> = {
  warning: '警告',
  suspend_3d: '暂停3天',
  suspend_7d: '暂停7天',
  suspend_30d: '暂停30天',
  permanent_ban: '永久封禁'
};

// 对话记录弹窗
const ChatHistoryModal = ({
  chat,
  isOpen,
  onClose
}: {
  chat: ChatHistory | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen || !chat) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-black">对话记录</h3>
            <p className="text-sm text-slate-400">订单 #{chat.orderId}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          <div className="text-center text-xs text-slate-400 mb-4">
            {chat.userName} ↔ {chat.expertName}
          </div>
          {chat.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderType === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.senderType === 'user'
                    ? 'bg-white border border-slate-200 rounded-tl-none'
                    : 'bg-vibe-primary text-white rounded-tr-none'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold ${msg.senderType === 'user' ? 'text-slate-600' : 'text-white/80'}`}>
                    {msg.senderName}
                  </span>
                  <span className={`text-xs ${msg.senderType === 'user' ? 'text-slate-400' : 'text-white/60'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className={`text-sm ${msg.senderType === 'user' ? 'text-slate-700' : 'text-white'}`}>
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// 添加违规记录弹窗
const AddViolationModal = ({
  expert,
  isOpen,
  onClose,
  onAdd
}: {
  expert: ExpertListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (violation: Partial<ExpertViolation>) => void;
}) => {
  const [type, setType] = useState('late_delivery');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [description, setDescription] = useState('');
  const [action, setAction] = useState('warning');

  if (!isOpen || !expert) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      expertId: expert.id,
      type,
      severity,
      description,
      action,
      reportedBy: '平台管理员',
      status: 'confirmed'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="bg-red-50 p-6 border-b border-red-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-black text-slate-900">添加违规记录</h3>
              <p className="text-sm text-slate-500">专家: {expert.name}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">违规类型</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-vibe-accent outline-none"
            >
              {Object.entries(VIOLATION_TYPES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">严重程度</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                    severity === s
                      ? SEVERITY_LABELS[s].color.replace('bg-', 'bg-opacity-100 ')
                      : 'bg-slate-100 text-slate-600'
                  } ${severity === s ? SEVERITY_LABELS[s].color : ''}`}
                >
                  {SEVERITY_LABELS[s].label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">违规描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请详细描述违规情况..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-vibe-accent outline-none resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">处罚措施</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-vibe-accent outline-none"
            >
              {Object.entries(ACTION_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600"
            >
              确认添加
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// 专家详情弹窗
const ExpertDetailModal = ({
  expert,
  application,
  violations,
  chatHistory,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onAddViolation,
  onToggleBan
}: {
  expert: ExpertListItem | null;
  application?: ExpertApplicationDetail;
  violations: ExpertViolation[];
  chatHistory: ChatHistory[];
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onAddViolation?: () => void;
  onToggleBan?: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('info');
  const [selectedChat, setSelectedChat] = useState<ChatHistory | null>(null);

  if (!isOpen || !expert) return null;

  const isPending = expert.verificationStatus === 'submitted';
  const isBanned = expert.status === 'banned';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-vibe-accent/20 rounded-full flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-vibe-accent" />
            </div>
            <div>
              <h2 className="text-xl font-black">专家详情</h2>
              <p className="text-slate-400 text-sm">ID: {expert.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isPending && (
              <>
                <button
                  onClick={onAddViolation}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-bold hover:bg-red-500/30 transition-all flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  添加违规
                </button>
                <button
                  onClick={onToggleBan}
                  className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
                    isBanned
                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                  }`}
                >
                  {isBanned ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  {isBanned ? '解除封禁' : '封禁账号'}
                </button>
              </>
            )}
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors ml-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 shrink-0">
          <div className="flex">
            {[
              { key: 'info', label: '基本信息', icon: UserCheck },
              { key: 'violations', label: `违规记录 (${violations.length})`, icon: Shield },
              { key: 'chats', label: `对话记录 (${chatHistory.length})`, icon: MessageSquare }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as ModalTab)}
                className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all ${
                  activeTab === key
                    ? 'text-vibe-primary border-b-2 border-vibe-primary bg-vibe-accent/5'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">显示名称</label>
                  <p className="text-lg font-bold text-slate-900">{expert.name}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">真实姓名</label>
                  <p className="text-lg font-bold text-slate-900">{expert.realName}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">邮箱</label>
                  <p className="text-slate-700">{expert.email}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">订阅计划</label>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    expert.tier === 'Elite' ? 'bg-violet-100 text-violet-700' :
                    expert.tier === 'Pro' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {expert.tier}
                  </span>
                </div>
              </div>

              {/* 账号状态 */}
              <div className="bg-slate-50 p-4 rounded-xl">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">账号状态</label>
                <div className="flex items-center gap-2">
                  {isBanned ? (
                    <>
                      <Ban className="w-5 h-5 text-red-500" />
                      <span className="font-bold text-red-600">已封禁</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span className="font-bold text-emerald-600">正常</span>
                    </>
                  )}
                </div>
              </div>

              {/* 技能标签 */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">技能标签</label>
                <div className="flex flex-wrap gap-2">
                  {expert.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* 统计数据 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">完成订单</p>
                  <p className="text-2xl font-black text-slate-900">{expert.completedOrders}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">总收入</p>
                  <p className="text-2xl font-black text-emerald-600">${expert.totalEarnings.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">评分</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-amber-500 fill-current" />
                    <p className="text-2xl font-black text-slate-900">{expert.rating || '-'}</p>
                  </div>
                </div>
              </div>

              {/* 申请详情（仅待审核状态） */}
              {isPending && application && (
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">申请资料</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">技术领域</label>
                      <p className="text-slate-700">{application.primaryDomains.join(', ')}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">开发语言</label>
                      <p className="text-slate-700">{application.languages.join(', ')}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vibe Coding 经验</label>
                      <p className="text-slate-700">{application.vibeCodingLevel}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">个人简介</label>
                      <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">{application.bio}</p>
                    </div>
                    {application.portfolioUrl && (
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">GitHub/作品集</label>
                        <a href={application.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-vibe-accent hover:underline flex items-center gap-1">
                          <Github className="w-4 h-4" />
                          {application.portfolioUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'violations' && (
            <div className="space-y-4">
              {violations.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">暂无违规记录</p>
                </div>
              ) : (
                violations.map((v) => (
                  <div key={v.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${SEVERITY_LABELS[v.severity].color}`}>
                          {SEVERITY_LABELS[v.severity].label}
                        </span>
                        <span className="ml-2 font-bold text-slate-900">{VIOLATION_TYPES[v.type]}</span>
                      </div>
                      <span className="text-xs text-slate-400">{new Date(v.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{v.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">举报人: {v.reportedBy}</span>
                        {v.orderId && (
                          <span className="text-xs text-slate-400">订单: #{v.orderId}</span>
                        )}
                      </div>
                      {v.action && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                          处罚: {ACTION_LABELS[v.action]}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'chats' && (
            <div className="space-y-3">
              {chatHistory.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">暂无对话记录</p>
                </div>
              ) : (
                chatHistory.map((chat) => (
                  <div
                    key={chat.orderId}
                    onClick={() => setSelectedChat(chat)}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-vibe-accent cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">订单 #{chat.orderId}</p>
                        <p className="text-sm text-slate-500">{chat.userName} ↔ {chat.expertName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{chat.messages.length} 条消息</span>
                        <Eye className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-2 truncate">
                      最新: {chat.messages[chat.messages.length - 1]?.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer Actions - 仅待审核状态显示 */}
        {isPending && (
          <div className="border-t border-slate-200 p-6 flex items-center justify-end gap-3 bg-white shrink-0">
            <button
              onClick={onReject}
              className="px-6 py-2.5 border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all"
            >
              拒绝申请
            </button>
            <button
              onClick={onApprove}
              className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all"
            >
              通过审核
            </button>
          </div>
        )}
      </motion.div>

      {/* Chat History Modal */}
      <ChatHistoryModal
        chat={selectedChat}
        isOpen={!!selectedChat}
        onClose={() => setSelectedChat(null)}
      />
    </div>
  );
};

// 主组件
export const ExpertManagement = () => {
  const [experts, setExperts] = useState<ExpertListItem[]>(MOCK_EXPERT_LIST);
  const [violations, setViolations] = useState<ExpertViolation[]>(MOCK_VIOLATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExpertStatus>('all');
  const [selectedExpert, setSelectedExpert] = useState<ExpertListItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || expert.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetail = (expert: ExpertListItem) => {
    setSelectedExpert(expert);
    setIsModalOpen(true);
  };

  const handleApprove = () => {
    if (selectedExpert) {
      setExperts(prev => prev.map(e => 
        e.id === selectedExpert.id ? { ...e, verificationStatus: 'approved' as const } : e
      ));
      setIsModalOpen(false);
      alert('专家审核已通过！');
    }
  };

  const handleReject = () => {
    if (selectedExpert) {
      setExperts(prev => prev.map(e => 
        e.id === selectedExpert.id ? { ...e, verificationStatus: 'rejected' as const } : e
      ));
      setIsModalOpen(false);
      alert('专家申请已拒绝！');
    }
  };

  const handleAddViolation = (violation: Partial<ExpertViolation>) => {
    const newViolation: ExpertViolation = {
      id: `v${Date.now()}`,
      expertId: selectedExpert!.id,
      type: violation.type as ExpertViolation['type'],
      description: violation.description as string,
      severity: violation.severity as ExpertViolation['severity'],
      reportedBy: '平台管理员',
      status: 'confirmed',
      action: violation.action as ExpertViolation['action'],
      createdAt: new Date().toISOString(),
      ...violation
    };
    setViolations(prev => [newViolation, ...prev]);
    alert('违规记录已添加！');
  };

  const handleToggleBan = () => {
    if (selectedExpert) {
      const isBanned = selectedExpert.status === 'banned';
      setExperts(prev => prev.map(e => 
        e.id === selectedExpert.id ? { ...e, status: isBanned ? 'active' : 'banned' } : e
      ));
      setSelectedExpert({ ...selectedExpert, status: isBanned ? 'active' : 'banned' });
      alert(isBanned ? '专家账号已解封！' : '专家账号已封禁！');
    }
  };

  const getApplication = (expertId: string) => {
    return MOCK_EXPERT_APPLICATIONS.find(app => app.userId === expertId);
  };

  const getExpertViolations = (expertId: string) => {
    return violations.filter(v => v.expertId === expertId);
  };

  const getExpertChatHistory = (expertId: string) => {
    return MOCK_CHAT_HISTORY.filter(chat => chat.expertId === expertId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">专家管理</h2>
          <p className="text-slate-500">管理平台专家，审核入驻申请，处理违规行为</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-sm text-amber-700">
              <span className="font-bold">{experts.filter(e => e.verificationStatus === 'submitted').length}</span> 个待审核
            </span>
          </div>
          <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-xl">
            <span className="text-sm text-red-700">
              <span className="font-bold">{violations.filter(v => v.status === 'pending').length}</span> 个待处理违规
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索专家名称、邮箱或技能..."
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-vibe-accent focus:ring-2 focus:ring-vibe-accent/20 outline-none"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: '全部', count: experts.length },
              { key: 'approved', label: '已审核', count: experts.filter(e => e.verificationStatus === 'approved').length },
              { key: 'submitted', label: '待审核', count: experts.filter(e => e.verificationStatus === 'submitted').length },
              { key: 'rejected', label: '已拒绝', count: experts.filter(e => e.verificationStatus === 'rejected').length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key as ExpertStatus)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  statusFilter === key
                    ? 'bg-vibe-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Experts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">专家信息</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">技能</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">计划</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">统计</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExperts.map((expert) => {
                const expertViolations = getExpertViolations(expert.id);
                return (
                  <tr key={expert.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          expert.status === 'banned' ? 'bg-red-100' : 'bg-vibe-accent/10'
                        }`}>
                          {expert.status === 'banned' ? (
                            <Ban className="w-5 h-5 text-red-500" />
                          ) : (
                            <UserCheck className="w-5 h-5 text-vibe-accent" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`font-bold ${expert.status === 'banned' ? 'text-red-600 line-through' : 'text-slate-900'}`}>
                              {expert.name}
                            </p>
                            {expertViolations.length > 0 && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-bold">
                                {expertViolations.length} 违规
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500">{expert.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {expert.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {expert.skills.length > 3 && (
                          <span className="text-xs text-slate-400">+{expert.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        expert.tier === 'Elite' ? 'bg-violet-100 text-violet-700' :
                        expert.tier === 'Pro' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {expert.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-sm font-medium ${
                        expert.verificationStatus === 'approved' ? 'text-emerald-600' :
                        expert.verificationStatus === 'submitted' ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {expert.verificationStatus === 'approved' ? <CheckCircle className="w-4 h-4" /> :
                         expert.verificationStatus === 'submitted' ? <Clock className="w-4 h-4" /> :
                         <XCircle className="w-4 h-4" />}
                        {expert.verificationStatus === 'approved' ? '已审核' :
                         expert.verificationStatus === 'submitted' ? '待审核' : '已拒绝'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p><span className="font-bold">{expert.completedOrders}</span> 订单</p>
                        <p className="text-emerald-600 font-bold">${expert.totalEarnings.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetail(expert)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredExperts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">未找到匹配的专家</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <ExpertDetailModal
        expert={selectedExpert}
        application={selectedExpert ? getApplication(selectedExpert.id) : undefined}
        violations={selectedExpert ? getExpertViolations(selectedExpert.id) : []}
        chatHistory={selectedExpert ? getExpertChatHistory(selectedExpert.id) : []}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        onAddViolation={() => setIsViolationModalOpen(true)}
        onToggleBan={handleToggleBan}
      />

      {/* Add Violation Modal */}
      <AddViolationModal
        expert={selectedExpert}
        isOpen={isViolationModalOpen}
        onClose={() => setIsViolationModalOpen(false)}
        onAdd={handleAddViolation}
      />
    </div>
  );
};

export default ExpertManagement;
