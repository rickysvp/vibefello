import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Smartphone, Brain, Cloud, Hexagon, Database,
  Gamepad2, Monitor, Cpu, Shield, Check, ChevronRight,
  ChevronLeft, Upload, FileText, CreditCard, User,
  Github, AlertCircle, X
} from 'lucide-react';
import {
  ExpertApplication,
  TechDomain,
  ProgrammingLanguage,
  VibeCodingLevel,
  MembershipTier,
  DOMAIN_SKILL_MAP,
  LANGUAGE_OPTIONS,
  VIBE_CODING_LEVELS,
  EXPERT_SUBSCRIPTION_PLANS,
  EXPERT_AGREEMENT_TEXT
} from '../../types';

const DOMAIN_ICONS: Record<TechDomain, React.ElementType> = {
  web: Globe,
  mobile: Smartphone,
  ai_ml: Brain,
  devops: Cloud,
  blockchain: Hexagon,
  data: Database,
  game: Gamepad2,
  desktop: Monitor,
  embedded: Cpu,
  security: Shield
};

interface ExpertOnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (application: Partial<ExpertApplication>) => void;
}

type OnboardingStep = 1 | 2 | 3 | 4;

const STEPS = [
  { id: 1, title: '专业信息', icon: User },
  { id: 2, title: '身份验证', icon: Shield },
  { id: 3, title: '服务协议', icon: FileText },
  { id: 4, title: '订阅计划', icon: CreditCard }
];

export const ExpertOnboardingFlow: React.FC<ExpertOnboardingFlowProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [formData, setFormData] = useState<Partial<ExpertApplication>>({
    primaryDomains: [],
    techStack: [],
    languages: [],
    idDocumentType: 'id_card',
    agreementAccepted: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load draft from localStorage
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('expert_onboarding_draft');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFormData(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error('Failed to load draft:', e);
        }
      }
    }
  }, [isOpen]);

  // Save draft to localStorage
  useEffect(() => {
    if (isOpen && formData) {
      localStorage.setItem('expert_onboarding_draft', JSON.stringify(formData));
    }
  }, [formData, isOpen]);

  const updateField = useCallback(<K extends keyof ExpertApplication>(
    field: K,
    value: ExpertApplication[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  const validateStep = (step: OnboardingStep): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.realName || formData.realName.length < 2) {
          newErrors.realName = '请输入真实姓名（至少2个字符）';
        }
        if (!formData.primaryDomains || formData.primaryDomains.length === 0) {
          newErrors.primaryDomains = '请至少选择一个技术领域';
        }
        if (!formData.techStack || formData.techStack.length === 0) {
          newErrors.techStack = '请至少选择一个技术栈';
        }
        if (!formData.languages || formData.languages.length === 0) {
          newErrors.languages = '请至少选择一种开发语言';
        }
        if (!formData.vibeCodingLevel) {
          newErrors.vibeCodingLevel = '请选择 Vibe Coding 经验等级';
        }
        if (!formData.bio || formData.bio.length < 50) {
          newErrors.bio = '个人简介至少需要50个字符';
        }
        if (!formData.portfolioUrl || !formData.portfolioUrl.includes('github.com')) {
          newErrors.portfolioUrl = '请提供有效的 GitHub 链接';
        }
        break;

      case 2:
        if (!formData.idDocumentFrontUrl) {
          newErrors.idDocumentFrontUrl = '请上传证件正面照片';
        }
        if (formData.idDocumentType === 'id_card' && !formData.idDocumentBackUrl) {
          newErrors.idDocumentBackUrl = '请上传身份证背面照片';
        }
        break;

      case 3:
        if (!formData.agreementAccepted) {
          newErrors.agreementAccepted = '请阅读并同意服务协议';
        }
        break;

      case 4:
        if (!formData.selectedTier) {
          newErrors.selectedTier = '请选择一个订阅计划';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => (prev + 1) as OnboardingStep);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as OnboardingStep);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(formData);
      localStorage.removeItem('expert_onboarding_draft');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDomain = (domain: TechDomain) => {
    const current = formData.primaryDomains || [];
    if (current.includes(domain)) {
      updateField('primaryDomains', current.filter(d => d !== domain));
    } else if (current.length < 3) {
      updateField('primaryDomains', [...current, domain]);
    }
  };

  const toggleSkill = (skill: string) => {
    const current = formData.techStack || [];
    if (current.includes(skill)) {
      updateField('techStack', current.filter(s => s !== skill));
    } else {
      updateField('techStack', [...current, skill]);
    }
  };

  const toggleLanguage = (lang: ProgrammingLanguage) => {
    const current = formData.languages || [];
    if (current.includes(lang)) {
      updateField('languages', current.filter(l => l !== lang));
    } else {
      updateField('languages', [...current, lang]);
    }
  };

  const handleImageUpload = (side: 'front' | 'back', url: string) => {
    if (side === 'front') {
      updateField('idDocumentFrontUrl', url);
    } else {
      updateField('idDocumentBackUrl', url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black tracking-tight">专家入驻申请</h2>
            <p className="text-slate-400 text-sm mt-1">完成以下步骤，开启您的专家变现之旅</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-slate-50 border-b border-slate-200 p-6 shrink-0">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-vibe-accent text-vibe-primary'
                          : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-bold hidden sm:block ${
                        isActive ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 transition-all ${
                        step.id < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <Step1Profile
                key="step1"
                formData={formData}
                errors={errors}
                updateField={updateField}
                toggleDomain={toggleDomain}
                toggleSkill={toggleSkill}
                toggleLanguage={toggleLanguage}
              />
            )}
            {currentStep === 2 && (
              <Step2Verification
                key="step2"
                formData={formData}
                errors={errors}
                updateField={updateField}
                onImageUpload={handleImageUpload}
              />
            )}
            {currentStep === 3 && (
              <Step3Agreement
                key="step3"
                formData={formData}
                errors={errors}
                updateField={updateField}
              />
            )}
            {currentStep === 4 && (
              <Step4Subscription
                key="step4"
                formData={formData}
                errors={errors}
                updateField={updateField}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 flex items-center justify-between shrink-0 bg-white">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              currentStep === 1
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            上一步
          </button>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-2.5 bg-vibe-primary text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              '处理中...'
            ) : currentStep === 4 ? (
              <>
                去支付
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                下一步
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Step 1: Profile Form
interface Step1Props {
  formData: Partial<ExpertApplication>;
  errors: Record<string, string>;
  updateField: <K extends keyof ExpertApplication>(field: K, value: ExpertApplication[K]) => void;
  toggleDomain: (domain: TechDomain) => void;
  toggleSkill: (skill: string) => void;
  toggleLanguage: (lang: ProgrammingLanguage) => void;
}

const Step1Profile: React.FC<Step1Props> = ({
  formData,
  errors,
  updateField,
  toggleDomain,
  toggleSkill,
  toggleLanguage
}) => {
  const selectedDomains = formData.primaryDomains || [];
  const availableSkills = selectedDomains.flatMap(d => DOMAIN_SKILL_MAP[d].skills);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Real Name */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          真实姓名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.realName || ''}
          onChange={(e) => updateField('realName', e.target.value)}
          placeholder="请输入您的真实姓名"
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.realName ? 'border-red-300 bg-red-50' : 'border-slate-200'
          } focus:border-vibe-accent focus:ring-2 focus:ring-vibe-accent/20 outline-none transition-all`}
        />
        {errors.realName && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.realName}
          </p>
        )}
      </div>

      {/* Tech Domains */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          技术领域 <span className="text-red-500">*</span>
          <span className="text-slate-400 font-normal ml-2">(最多选择3个)</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {(Object.keys(DOMAIN_SKILL_MAP) as TechDomain[]).map((domain) => {
            const Icon = DOMAIN_ICONS[domain];
            const isSelected = selectedDomains.includes(domain);
            const isDisabled = !isSelected && selectedDomains.length >= 3;

            return (
              <button
                key={domain}
                onClick={() => !isDisabled && toggleDomain(domain)}
                disabled={isDisabled}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  isSelected
                    ? 'border-vibe-accent bg-vibe-accent/10 text-vibe-primary'
                    : isDisabled
                    ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                    : 'border-slate-200 hover:border-vibe-accent/50 text-slate-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-bold">{DOMAIN_SKILL_MAP[domain].name}</span>
              </button>
            );
          })}
        </div>
        {errors.primaryDomains && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.primaryDomains}
          </p>
        )}
      </div>

      {/* Tech Stack */}
      {selectedDomains.length > 0 && (
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            技术栈 <span className="text-red-500">*</span>
            <span className="text-slate-400 font-normal ml-2">(基于已选领域)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSkills.map((skill) => {
              const isSelected = formData.techStack?.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-vibe-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
          {errors.techStack && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.techStack}
            </p>
          )}
        </div>
      )}

      {/* Programming Languages */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          开发语言 <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((lang) => {
            const isSelected = formData.languages?.includes(lang.value);
            return (
              <button
                key={lang.value}
                onClick={() => toggleLanguage(lang.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-vibe-primary text-white border-vibe-primary'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-vibe-accent'
                }`}
                style={isSelected ? {} : { borderLeftWidth: '4px', borderLeftColor: lang.color }}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
        {errors.languages && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.languages}
          </p>
        )}
      </div>

      {/* Vibe Coding Level */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Vibe Coding 经验 <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {VIBE_CODING_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => updateField('vibeCodingLevel', level.value)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                formData.vibeCodingLevel === level.value
                  ? 'border-vibe-accent bg-vibe-accent/10'
                  : 'border-slate-200 hover:border-vibe-accent/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.vibeCodingLevel === level.value
                      ? 'border-vibe-accent'
                      : 'border-slate-300'
                  }`}
                >
                  {formData.vibeCodingLevel === level.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-vibe-accent" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{level.label}</div>
                  <div className="text-sm text-slate-500">{level.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        {errors.vibeCodingLevel && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.vibeCodingLevel}
          </p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          个人简介 <span className="text-red-500">*</span>
          <span className="text-slate-400 font-normal ml-2">(至少50字，介绍您的专业背景)</span>
        </label>
        <textarea
          value={formData.bio || ''}
          onChange={(e) => updateField('bio', e.target.value)}
          placeholder="例如：我是全栈开发工程师，拥有5年React和Node.js开发经验，专注于解决AI生成代码的部署和调试问题..."
          rows={4}
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.bio ? 'border-red-300 bg-red-50' : 'border-slate-200'
          } focus:border-vibe-accent focus:ring-2 focus:ring-vibe-accent/20 outline-none transition-all resize-none`}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate-400">
            {formData.bio?.length || 0} / 500 字
          </span>
          {errors.bio && (
            <span className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.bio}
            </span>
          )}
        </div>
      </div>

      {/* Portfolio URL */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          GitHub 链接 <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="url"
            value={formData.portfolioUrl || ''}
            onChange={(e) => updateField('portfolioUrl', e.target.value)}
            placeholder="https://github.com/yourusername"
            className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
              errors.portfolioUrl ? 'border-red-300 bg-red-50' : 'border-slate-200'
            } focus:border-vibe-accent focus:ring-2 focus:ring-vibe-accent/20 outline-none transition-all`}
          />
        </div>
        {errors.portfolioUrl && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.portfolioUrl}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// Step 2: Verification Form
interface Step2Props {
  formData: Partial<ExpertApplication>;
  errors: Record<string, string>;
  updateField: <K extends keyof ExpertApplication>(field: K, value: ExpertApplication[K]) => void;
  onImageUpload: (side: 'front' | 'back', url: string) => void;
}

const Step2Verification: React.FC<Step2Props> = ({
  formData,
  errors,
  updateField,
  onImageUpload
}) => {
  const handleFileChange = (side: 'front' | 'back', file: File) => {
    // In real app, upload to storage and get URL
    // For now, create object URL
    const url = URL.createObjectURL(file);
    onImageUpload(side, url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl mx-auto space-y-6"
    >
      {/* ID Type Selection */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-3">
          证件类型 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => updateField('idDocumentType', 'id_card')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              formData.idDocumentType === 'id_card'
                ? 'border-vibe-accent bg-vibe-accent/10'
                : 'border-slate-200 hover:border-vibe-accent/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  formData.idDocumentType === 'id_card' ? 'border-vibe-accent' : 'border-slate-300'
                }`}
              >
                {formData.idDocumentType === 'id_card' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-vibe-accent" />
                )}
              </div>
              <span className="font-bold">身份证</span>
            </div>
          </button>
          <button
            onClick={() => updateField('idDocumentType', 'passport')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              formData.idDocumentType === 'passport'
                ? 'border-vibe-accent bg-vibe-accent/10'
                : 'border-slate-200 hover:border-vibe-accent/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  formData.idDocumentType === 'passport' ? 'border-vibe-accent' : 'border-slate-300'
                }`}
              >
                {formData.idDocumentType === 'passport' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-vibe-accent" />
                )}
              </div>
              <span className="font-bold">护照</span>
            </div>
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Front */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            证件正面 <span className="text-red-500">*</span>
          </label>
          <div
            className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all ${
              errors.idDocumentFrontUrl ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-vibe-accent'
            } ${formData.idDocumentFrontUrl ? 'aspect-auto' : 'aspect-[4/3]'}`}
          >
            {formData.idDocumentFrontUrl ? (
              <div className="relative">
                <img
                  src={formData.idDocumentFrontUrl}
                  alt="ID Front"
                  className="w-full h-auto"
                />
                <button
                  onClick={() => onImageUpload('front', '')}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-full cursor-pointer p-6">
                <Upload className="w-10 h-10 text-slate-400 mb-2" />
                <span className="text-sm text-slate-500">点击上传</span>
                <span className="text-xs text-slate-400 mt-1">JPG/PNG, 最大5MB</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => e.target.files?.[0] && handleFileChange('front', e.target.files[0])}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {errors.idDocumentFrontUrl && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.idDocumentFrontUrl}
            </p>
          )}
        </div>

        {/* Back (only for ID card) */}
        {formData.idDocumentType === 'id_card' && (
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              证件背面 <span className="text-red-500">*</span>
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all ${
                errors.idDocumentBackUrl ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-vibe-accent'
              } ${formData.idDocumentBackUrl ? 'aspect-auto' : 'aspect-[4/3]'}`}
            >
              {formData.idDocumentBackUrl ? (
                <div className="relative">
                  <img
                    src={formData.idDocumentBackUrl}
                    alt="ID Back"
                    className="w-full h-auto"
                  />
                  <button
                    onClick={() => onImageUpload('back', '')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-full cursor-pointer p-6">
                  <Upload className="w-10 h-10 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500">点击上传</span>
                  <span className="text-xs text-slate-400 mt-1">JPG/PNG, 最大5MB</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={(e) => e.target.files?.[0] && handleFileChange('back', e.target.files[0])}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {errors.idDocumentBackUrl && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.idDocumentBackUrl}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Requirements */}
      <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
        <p className="font-bold mb-2">上传要求：</p>
        <ul className="space-y-1 text-slate-500">
          <li>• 证件四角完整露出，文字清晰可辨</li>
          <li>• 文件格式：JPG / PNG</li>
          <li>• 单张最大 5MB</li>
          <li>• 仅用于身份验证，平台严格保密</li>
        </ul>
      </div>
    </motion.div>
  );
};

// Step 3: Agreement Form
interface Step3Props {
  formData: Partial<ExpertApplication>;
  errors: Record<string, string>;
  updateField: <K extends keyof ExpertApplication>(field: K, value: ExpertApplication[K]) => void;
}

const Step3Agreement: React.FC<Step3Props> = ({ formData, errors, updateField }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Agreement Text */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-slate-700">VibeFello 专家服务协议</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-vibe-accent hover:underline"
          >
            {isExpanded ? '收起' : '展开'}
          </button>
        </div>
        <div
          className={`bg-white p-4 text-sm text-slate-600 whitespace-pre-wrap overflow-y-auto transition-all ${
            isExpanded ? 'max-h-96' : 'max-h-48'
          }`}
        >
          {EXPERT_AGREEMENT_TEXT}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreementAccepted || false}
            onChange={(e) => {
              updateField('agreementAccepted', e.target.checked);
              if (e.target.checked) {
                updateField('agreementAcceptedAt', new Date().toISOString());
              }
            }}
            className="mt-1 w-5 h-5 rounded border-slate-300 text-vibe-accent focus:ring-vibe-accent"
          />
          <span className="text-sm text-slate-700">
            我已阅读并同意《VibeFello 专家服务协议》
            <span className="text-red-500">*</span>
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreementAccepted || false}
            onChange={(e) => {
              updateField('agreementAccepted', e.target.checked);
              if (e.target.checked) {
                updateField('agreementAcceptedAt', new Date().toISOString());
              }
            }}
            className="mt-1 w-5 h-5 rounded border-slate-300 text-vibe-accent focus:ring-vibe-accent"
          />
          <span className="text-sm text-slate-700">
            我确认我是独立承包商，与 VibeFello 平台不存在雇佣、劳动或代理关系
            <span className="text-red-500">*</span>
          </span>
        </label>
      </div>

      {errors.agreementAccepted && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors.agreementAccepted}
        </p>
      )}

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-bold mb-1">重要提示</p>
            <p>
              作为独立承包商，您需要自行承担税务申报义务。
              平台将按约定比例收取服务费，具体费率请参考下一步的订阅计划。
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Step 4: Subscription Form
interface Step4Props {
  formData: Partial<ExpertApplication>;
  errors: Record<string, string>;
  updateField: <K extends keyof ExpertApplication>(field: K, value: ExpertApplication[K]) => void;
}

const Step4Subscription: React.FC<Step4Props> = ({ formData, errors, updateField }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {EXPERT_SUBSCRIPTION_PLANS.map((plan) => {
          const isSelected = formData.selectedTier === plan.tier;

          return (
            <button
              key={plan.tier}
              onClick={() => updateField('selectedTier', plan.tier)}
              className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-vibe-accent bg-vibe-accent/10'
                  : 'border-slate-200 hover:border-vibe-accent/50'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    plan.popular
                      ? 'bg-vibe-accent text-vibe-primary'
                      : 'bg-slate-900 text-white'
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div className="text-center mb-6">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {plan.tier}
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black text-slate-900">${plan.price}</span>
                  <span className="text-slate-400">/{plan.period}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check
                      className={`w-4 h-4 shrink-0 ${
                        feature.highlight ? 'text-vibe-accent' : 'text-slate-400'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        feature.highlight ? 'font-bold text-slate-900' : 'text-slate-600'
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className={`w-full py-2.5 rounded-xl font-bold text-sm text-center transition-all ${
                  isSelected
                    ? 'bg-vibe-primary text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isSelected ? '已选择' : plan.cta}
              </div>
            </button>
          );
        })}
      </div>

      {errors.selectedTier && (
        <p className="mt-4 text-sm text-red-500 flex items-center justify-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors.selectedTier}
        </p>
      )}

      {/* Summary */}
      <div className="mt-8 bg-slate-50 rounded-xl p-6">
        <h4 className="font-bold text-slate-900 mb-4">订阅说明</h4>
        <ul className="space-y-2 text-sm text-slate-600">
          <li>• 订阅费用按月收取，可随时取消</li>
          <li>• 接单额度每月重置，未使用额度不累积</li>
          <li>• 平台服务费将从您的订单收入中自动扣除</li>
          <li>• 升级计划立即生效，降级计划次月生效</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default ExpertOnboardingFlow;
