/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import confetti from 'canvas-confetti';
import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { loadStripe } from '@stripe/stripe-js';
import { Logo } from './components/Logo';

import { 
  Code2, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Github, 
  Twitter, 
  Bug, 
  Cpu, 
  Globe,
  Users,
  MessageSquare,
  ShieldCheck,
  Sun,
  Moon,
  Languages,
  TrendingUp,
  Clock,
  ChevronDown,
  Sparkles,
  Mail
} from 'lucide-react';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
if (!stripePublishableKey) {
  console.warn("VITE_STRIPE_PUBLISHABLE_KEY is missing. Stripe checkout will not work.");
}
const stripePromise = loadStripe(stripePublishableKey);
console.log("Stripe Publishable Key available:", !!stripePublishableKey);

const CHAT_SCENARIOS = [
  {
    user: "Why is my Docker build failing? I've asked Cursor 10 times and it keeps hallucinating the same broken config... 😭",
    fello: "VibeFello: Got you. Let's fix that Docker config in 5 mins and get those webhooks live. 🚀"
  },
  {
    user: "Stripe webhooks are not firing in production. I've spent $200 on tokens and still haven't shipped. Help!!",
    fello: "VibeFello: Classic handshake issue. VibeFello will debug the listener and verify the secret in your env vars right now. 🛠️"
  },
  {
    user: "Database won't connect in production. I'm stuck in an infinite loop of 'I apologize for the confusion...' from the AI.",
    fello: "VibeFello: AI can't see your VPC settings. VibeFello will bridge the network gap and get your data flowing. ⚡"
  },
  {
    user: "My OAuth login keeps throwing a 404. The AI keeps telling me to check files that don't exist. I'm losing my mind.",
    fello: "VibeFello: Take a breath. VibeFello will map the routes correctly and fix the callback URL in your provider dashboard. 🤝"
  }
];

type Language = 'en' | 'cn';
type Theme = 'dark' | 'light';

const translations = {
  en: {
    nav: {
      problem: "The Gap",
      solution: "Companionship",
      howItWorks: "Process",
      joinWaitlist: "Get Early Access"
    },
    hero: {
      badge: "YOUR VIBEFELLO IS HERE",
      title: "Stop Vibing, Start Shipping",
      subtitle: "Stop debugging alone. [VibeFello] fixes the final 10% of your AI-built app, saving you massive time and money.",
      cta: "Join Waitlist",
      socialProof: "[2,482] founders joined the waitlist. Shipping soon."
    },
    problem: {
      title: "The Infinite Loop of Token Burn",
      p1: "You've spent weeks prompting AI, burning through $500+ in tokens. The UI looks great, but the backend is a hallucinating nightmare. You're stuck, and every 'I apologize' from the AI is costing you money.",
      quote: "\"I've been at this for a month. The AI keeps hallucinating on the Docker config. Stripe webhooks are silent. The database won't connect in production. I'm stuck in an infinite loop of 'I apologize for the confusion...'\"",
      p2: "AI is a tool, not a senior engineer. VibeFello bridges the gap where LLMs fail—environment variables, production deployment, and complex handshakes. Stop debugging alone; start shipping with experts.",
      cards: [
        { title: "Token Burn, Zero Ship", desc: "Stop wasting hundreds of dollars on AI that can't see your infrastructure. VibeFello fixes the logic LLMs miss." },
        { title: "Deployment Hell", desc: "Docker, Cloud Run, CI/CD, SSL—the technical debt that VibeFello knows how to navigate." },
        { title: "API & Integration", desc: "Stripe, OAuth, Webhooks, and complex backend logic. VibeFello handles the handshakes that break your app." },
        { title: "The Hallucination Loop", desc: "When the AI starts repeating the same broken fix, VibeFello provides the senior technical context to break free." }
      ]
    },
    solution: {
      title: "THE VIBE SOLUTION",
      highlight: "From AI Prototype to Launch-Ready Product",
      description: "VibeFello helps founders and builders solve the technical work that AI often leaves unfinished right before launch. From deployment and integrations to production reliability, the focus is simple: get the product live and make it work where it matters.",
      cards: [
        { title: "Production Setup", desc: "Deployment, infrastructure, environment variables, SSL, CI/CD, and the production issues that only show up when it is time to ship." },
        { title: "Business-Critical Flows", desc: "Payments, OAuth, webhooks, and backend workflows that determine whether the product can actually function and generate revenue." },
        { title: "Launch Readiness", desc: "Performance, stability, and architectural fixes that help the product hold up in production, not just in a demo." }
      ],
      conclusion: "Not more prompting. Not more guesswork. Just focused senior engineering help for the final mile."
    },
    howItWorks: {
      title: "The Path to Production",
      steps: [
        { step: "01", title: "Submit Your Vibe", desc: "Share your repo and describe the blockers holding you back." },
        { step: "02", title: "Get Your Companion", desc: "A senior dev who specializes in your stack joins your workflow within hours." },
        { step: "03", title: "Ship to the World", desc: "VibeFello fixes, refines, and deploys. Your app is live, and you're officially a founder." }
      ]
    },
    audience: {
      title: "Is VibeFello for You?",
      subtitle: "Built for founders and builders who have already made real progress, but are blocked by the technical last mile before launch.",
      cards: [
        { 
          title: "Non-Technical Founders", 
          desc: "Founders with a clear product vision and working prototype, but limited experience in Webhook integration, backend development, API implementation, payment gateway setup, databases, deployment, and production infrastructure.",
          icon: "Users"
        },
        { 
          title: "AI Builders", 
          desc: "Builders who moved fast with tools like Cursor, Lovable or Claude Code and now need expert help with the final technical blockers before shipping.",
          icon: "Zap"
        },
        { 
          title: "Solo Developers", 
          desc: "Independent developers with an app that is nearly ready, but held back by Docker, SSL, infrastructure problems, or fragile third-party integrations.",
          icon: "Code2"
        },
        { 
          title: "MVP Teams", 
          desc: "Small teams looking to build and launch an MVP quickly to validate product-market fit without the overhead of hiring a full-time technical team.",
          icon: "TrendingUp"
        }
      ]
    },
    waitlist: {
      title: "Join the Genesis Circle",
      desc: "Get early access , limited to 999 seats FCFS . <br>Full companionship , fast shipping.",
      emailLabel: "Email Address",
      blockerLabel: "What's the biggest hurdle between you and launch?",
      placeholderEmail: "you@vibecoding.com",
      placeholderBlocker: "e.g. Stripe webhooks are failing, or I can't get my database to sync...",
      submit: "Request Early Access",
      submitting: "Processing...",
      successTitle: "You're on the list.",
      successDesc: "VibeFello will reach out soon to help you bridge the gap. Keep an eye on your inbox.",
      submitAnother: "Submit another project",
      error: "Something went wrong. Please try again."
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        { q: "What exactly is 'Vibe Coding'?", a: "It's the new era of development where you use AI (like Cursor or v0) to build apps through natural language and 'vibes' rather than manual syntax." },
        { q: "How does companionship work?", a: "VibeFello pairs you with a senior developer who joins your workflow (via Slack/Discord/GitHub) to solve the technical hurdles AI can't handle." },
        { q: "Is this for non-technical founders?", a: "Absolutely. VibeFello specializes in helping non-technical or semi-technical founders bridge the gap to a production-ready product." },
        { q: "Which tech stacks do you support?", a: "We support all major full-stack environments including Next.js, React, Node.js, Python, Docker, and all major cloud providers (AWS, GCP, Vercel)." },
        { q: "How fast can I get help?", a: "Our goal is to have a senior companion in your workflow within 2-4 hours of your request submission." },
        { q: "What if VibeFello can't fix my issue?", a: "We are so confident in our experts that we offer a 100% money-back guarantee if we cannot solve your technical blocker." }
      ]
    },
    testimonials: {
      title: "What Our Friends Say",
      subtitle: "Hear from friends who have successfully launched with VibeFello",
      items: [
        {
          name: "Mike Johnson",
          role: "Founder, SaaS Startup",
          quote: "VibeFello was a game-changer for our launch. They helped us navigate the technical hurdles that were slowing us down. Their team's expertise and responsiveness were exceptional.",
          avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=natural%20casual%20white%20man%20portrait%20friendly%20smile%20outdoor%20setting&image_size=square"
        },
        {
          name: "Emily Davis",
          role: "Solo Developer",
          quote: "As someone new to deployment and infrastructure, VibeFello made the process seamless. They handled all the technical details, letting me focus on creating great features for my users.",
          avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=natural%20casual%20white%20woman%20portrait%20relaxed%20expression%20coffee%20shop%20setting&image_size=square"
        },
        {
          name: "Chris Wilson",
          role: "CTO, Early-Stage Company",
          quote: "The VibeFello team delivered exactly what we needed to get our product ready for production. Their problem-solving skills and attention to detail were impressive and made a huge difference.",
          avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=natural%20casual%20white%20man%20portrait%20smiling%20with%20glasses%20casual%20clothing&image_size=square"
        }
      ]
    },
    caseStudies: {
      title: "Trusted by Founders",
      subtitle: "Join the growing community of builders who have launched with VibeFello",
      logos: [
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20company%20logo%20text%20only%20letters%20simple%20unique%201&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%202&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20logo%20text%20only%20letters%20simple%20unique%203&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%204&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20company%20logo%20text%20only%20letters%20simple%20unique%205&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%206&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20logo%20text%20only%20letters%20simple%20unique%207&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%208&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20logo%20text%20only%20letters%20simple%20unique%209&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2010&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20company%20logo%20text%20only%20letters%20simple%20unique%2011&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2012&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20logo%20text%20only%20letters%20simple%20unique%2013&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2014&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20logo%20text%20only%20letters%20simple%20unique%2015&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2016&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20company%20logo%20text%20only%20letters%20simple%20unique%2017&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2018&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20logo%20text%20only%20letters%20simple%20unique%2019&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2020&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20company%20logo%20text%20only%20letters%20simple%20unique%2021&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2022&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20logo%20text%20only%20letters%20simple%20unique%2023&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2024&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20company%20logo%20text%20only%20letters%20simple%20unique%2025&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2026&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20logo%20text%20only%20letters%20simple%20unique%2027&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2028&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20company%20logo%20text%20only%20letters%20simple%20unique%2029&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2030&image_size=square"
      ]
    },
    footer: {
      copy: "© 2026 VIBEFELLO. BUILT FOR THE VIBE CODING ERA.",
      privacy: "Privacy",
      terms: "Terms"
    },
    conversion: {
      title: "Waitlist Confirmed!",
      subtitle: "You're on the list. But if you're serious about shipping, VibeFello has an exclusive shortcut.",
      offerTitle: "Become a VibeFello Genesis Member",
      offerBadge: "Genesis Member Invitation",
      offerDesc: "Don't let your vision die on a local server. Get the elite technical companionship you need to cross the finish line and stay there.",
      benefitsTitle: "Membership Benefits:",
      plans: {
        lifetime: {
          name: "Genesis Lifetime",
          title: "Become a VibeFello Genesis Member",
          description: "Don't let your vision die on a local server. Get the elite technical companionship you need to cross the finish line and stay there.",
          price: "$99.9",
          originalPrice: "$199.8",
          period: "One-Time Payment • Lifetime Access",
          badge: "Genesis Member • Limited 99 Seats",
          scarcityMessage: "Price doubles every 99 seats filled. Act fast before the next price increase!",
          benefits: [
            "Unlimited technical companionship until your product ships.",
            "Full-stack support: from Docker configs to global scaling.",
            "1-on-1 architecture audits to fix deep AI hallucinations.",
            "Lifetime free access to all future premium features."
          ]
        }
      },
      cta: "Secure Access Now",
      back: "Return to Home",
      price: "$99.9",
      pricePeriod: "One-Time Payment • Lifetime Access",
      comparison: "Price doubles every 99 seats",
      scarcity: "Limited Slots Available",
      scarcityMessage: "Price doubles every 99 seats filled. Act fast before the next price increase!",
      valueProp: "One successful launch pays for this membership 10x over.",
      opportunityBadge: "Exclusive Genesis Offer",
      paymentSuccess: "Priority access confirmed. Check your email and follow X for updates.",
      paymentCancel: "Payment paused. Your priority access request is not complete yet.",
      alreadyMember: "Priority access is already reserved for this email.",
      checkEmailReminder: "Please check your email and follow x.com/vibefello for updates.",
      successTitle: "Priority Access Confirmed",
      successSubtitle: "Your email is now marked for priority follow-up by VibeFello.",
      successNextSteps: "What's Next?",
      successStep1: "Check your email for confirmation.",
      successStep2: "Follow x.com/vibefello for updates.",
      successStep3: "Watch for direct follow-up from our team.",
      successCta: "Back to Home",
      successBack: "Back to Home",
      membership: {
        title: "Manage Membership",
        subtitle: "Your current status and renewal options.",
        currentStatus: "Current Status",
        genesisStatus: "Genesis (Lifetime)",
        renewalTitle: "Renewal & Upgrades",
        renewalDesc: "Genesis membership is a one-time opportunity. For future project support or extended services, choose a plan below.",
        monthly: "Monthly Pro ($199/mo)",
        yearly: "Yearly Enterprise ($1999/yr)",
        renewCta: "Switch to Plan"
      },
      dashboard: {
        title: "Genesis Member Dashboard",
        welcome: "Welcome back, Founder",
        status: "Membership Status: Genesis (Lifetime)",
        resources: "Your Exclusive Resources",
        resource1: "Private Discord Community",
        resource2: "1-on-1 Strategy Booking",
        resource3: "Genesis Resource Library",
        resource4: "Beta Feature Access",
        support: "Priority Support",
        supportDesc: "Direct line to senior companions."
      },
      successPage: {
        paymentConfirmed: "Payment Confirmed",
        alreadyActive: "Already Active",
        welcomeTitle: "WELCOME TO GENESIS",
        activeTitle: "MEMBERSHIP ACTIVE",
        successDesc: "You've secured your spot in the Genesis Circle. Our team will reach out to you shortly.",
        activeDesc: "Your founding member account is already active and ready.",
        confirmationSent: "Confirmation sent to",
        celebrate: "Celebrate",
        followUpdates: "Follow Updates",
        memberId: "Member ID",
        status: "Status",
        access: "Access",
        active: "ACTIVE",
        lifetime: "LIFETIME",
        prioritySupport: "Priority Support",
        earlyAccess: "Early Access",
        exclusiveUpdates: "Exclusive Updates",
        checkEmail: "Check Email",
        waitForContact: "Wait for Contact",
        getStarted: "Get Started",
        confirmationSentDesc: "Confirmation sent",
        teamReachOutDesc: "Team will reach out",
        beginJourneyDesc: "Begin your journey"
      }
    },
    validation: {
      emailInvalid: "Please enter a valid email address.",
      blockerRequired: "Please tell us what's holding you back.",
      blockerTooShort: "Please provide a bit more detail (min 10 characters)."
    }
  },
  cn: {
    nav: {
      problem: "痛点",
      solution: "陪跑服务",
      howItWorks: "流程",
      joinWaitlist: "获取早期访问"
    },
    hero: {
      badge: "YOUR VIBEFELLO IS HERE",
      title: "Stop Vibing, Start Shipping",
      subtitle: "别再一个人死磕。[VibeFello] 帮你搞定 AI 无法处理的最后 10%，省时省钱，助你快速发货。",
      cta: "立即加入候补",
      socialProof: "已有 [2,482] 位创始人加入候补名单，即将发货。"
    },
    problem: {
      title: "别在“死循环”里浪费生命",
      p1: "你是否正陷入与 AI 的无休止对话中？看着数百美元的 Token 灰飞烟灭，却依然卡在部署或 API 对接上。UI 很美，但它根本跑不起来。",
      quote: "“我已经折腾一个月了。AI 在 Docker 配置上不断产生幻觉。Stripe Webhook 毫无反应。数据库在生产环境下死活连不上。我陷入了‘抱歉，我理解错了...’的无限循环。”",
      p2: "LLM 会产生幻觉，而你会产生焦虑。VibeFello 介入 AI 无法触达的“最后一公里”，用专家的经验代替昂贵的试错，帮你把创意从本地服务器搬到生产环境。",
      cards: [
        { title: "Token 烧光，依然没上线", desc: "别再把钱浪费在看不见你基建的 AI 上了。VibeFello 修复 LLM 无法理解的底层逻辑。" },
        { title: "部署地狱", desc: "Docker, Cloud Run, CI/CD, SSL——这些 AI 无法帮你跑通的技术债，VibeFello 来搞定。" },
        { title: "API 与 复杂对接", desc: "Stripe, OAuth, Webhooks 以及复杂的后端逻辑。VibeFello 处理那些让你的应用崩溃的对接环节。" },
        { title: "幻觉死循环", desc: "当 AI 开始重复同样的错误修复时，VibeFello 提供资深专家的技术背景，带你跳出泥潭。" }
      ]
    },
    solution: {
      title: "THE VIBE SOLUTION",
      highlight: "从 AI 原型到可上线产品",
      description: "VibeFello 帮助创始人和构建者解决 AI 在上线前往往未完成的技术工作。从部署和集成到生产可靠性，重点很简单：让产品上线并在关键时刻正常运行。",
      cards: [
        { title: "生产环境设置", desc: "部署、基础设施、环境变量、SSL、CI/CD，以及只有在准备上线时才会出现的生产问题。" },
        { title: "业务关键流程", desc: "支付、OAuth、Webhook 和后端工作流，这些决定了产品是否能真正运行并产生收入。" },
        { title: "上线准备", desc: "性能、稳定性和架构修复，帮助产品在生产环境中保持稳定，而不仅仅是在演示中。" }
      ],
      conclusion: "不再需要更多提示。不再需要更多猜测。只为最后一公里提供专注的资深工程帮助。"
    },
    howItWorks: {
      title: "通往生产环境之路",
      steps: [
        { step: "01", title: "提交你的 Vibe", desc: "分享你的代码库并描述阻碍你上线的难题。" },
        { step: "02", title: "匹配陪跑专家", desc: "擅长你所用技术栈的资深开发者在几小时内加入你的流程。" },
        { step: "03", title: "向世界发布", desc: "VibeFello 修复、优化并部署。你的应用上线了，你正式成为了创始人。" }
      ]
    },
    audience: {
      title: "VibeFello 适合你吗？",
      subtitle: "专为已经取得实质性进展，但在上线前被技术最后一公里阻挡的创始人和构建者打造。",
      cards: [
        { 
          title: "非技术创始人", 
          desc: "拥有清晰产品愿景和可工作原型，但在 Webhook 集成、后端开发、API 实现、支付网关设置、数据库、部署和生产基础设施方面经验有限的创始人。",
          icon: "Users"
        },
        { 
          title: "AI 构建者", 
          desc: "使用 Cursor、Lovable 或 Claude Code 等工具快速开发，现在需要专家帮助解决上线前的最终技术障碍的构建者。",
          icon: "Zap"
        },
        { 
          title: "独立开发者", 
          desc: "应用几乎准备就绪，但被 Docker、SSL、基础设施问题或脆弱的第三方集成所阻碍的独立开发者。",
          icon: "Code2"
        },
        { 
          title: "MVP 团队", 
          desc: "希望快速构建并发布 MVP 以验证产品市场契合度，而无需承担雇佣全职技术团队开销的小型团队。",
          icon: "TrendingUp"
        }
      ]
    },
    waitlist: {
      title: "加入创始圈",
      desc: "获取早期访问权限，限量999个席位，先到先得。<br>全程陪跑，快速发货。",
      emailLabel: "电子邮箱",
      blockerLabel: "阻碍你上线的最大难题是什么？",
      placeholderEmail: "you@awesome-startup.com",
      placeholderBlocker: "例如：Stripe Webhook 失败，或者数据库无法同步...",
      submit: "申请早期访问",
      submitting: "处理中...",
      successTitle: "已加入名单。",
      successDesc: "VibeFello 会尽快联系你，帮你填补鸿沟。请留意你的收件箱。",
      submitAnother: "提交另一个项目",
      error: "出错了，请稍后重试。"
    },
    faq: {
      title: "常见问题",
      items: [
        { q: "什么是 'Vibe Coding'？", a: "这是一种全新的开发方式，你通过自然语言和 '感觉'（Vibe）使用 AI（如 Cursor 或 v0）来构建应用，而不是手动编写语法。" },
        { q: "陪跑服务是如何运作的？", a: "VibeFello 会为你匹配一位资深开发者，他会加入你的工作流（通过 Slack/Discord/GitHub），解决 AI 无法处理的技术难题。" },
        { q: "这适合非技术背景的创始人吗？", a: "当然。VibeFello 专注于帮助非技术或半技术背景的创始人将创意转化为可上线的生产级产品。" },
        { q: "你们支持哪些技术栈？", a: "我们支持所有主流全栈环境，包括 Next.js, React, Node.js, Python, Docker 以及主流云平台（AWS, GCP, Vercel）。" },
        { q: "我多久能得到帮助？", a: "我们的目标是在你提交申请后的 2-4 小时内，让资深陪跑专家进入你的工作流。" },
        { q: "如果 VibeFello 无法解决我的问题怎么办？", a: "我们对专家非常有信心，如果我们无法解决你的技术障碍，我们提供 100% 全额退款保证。" }
      ]
    },
    testimonials: {
      title: "朋友评价",
      subtitle: "听听成功通过 VibeFello 上线产品的朋友们怎么说",
      items: [
        {
          name: "Mike Johnson",
          role: "SaaS 创业公司创始人",
          quote: "VibeFello 对我们的上线来说是一个游戏规则改变者。他们帮助我们克服了阻碍我们前进的技术障碍。他们团队的专业知识和响应能力非常出色。",
          avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=natural%20casual%20white%20man%20portrait%20friendly%20smile%20outdoor%20setting&image_size=square"
        },
        {
          name: "Emily Davis",
          role: "独立开发者",
          quote: "作为对部署和基础设施不熟悉的人，VibeFello 让这个过程变得无缝。他们处理了所有技术细节，让我能够专注于为用户创建出色的功能。",
          avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=natural%20casual%20white%20woman%20portrait%20relaxed%20expression%20coffee%20shop%20setting&image_size=square"
        },
        {
          name: "Chris Wilson",
          role: "早期公司 CTO",
          quote: "VibeFello 团队提供了我们所需的确切专业知识，使我们的产品达到生产就绪状态。他们的问题解决能力和对细节的关注令人印象深刻，产生了巨大的影响。",
          avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=natural%20casual%20white%20man%20portrait%20smiling%20with%20glasses%20casual%20clothing&image_size=square"
        }
      ]
    },
    caseStudies: {
      title: "受到创始人信任",
      subtitle: "加入已经通过 VibeFello 成功上线的建设者社区",
      logos: [
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20company%20logo%20text%20only%20letters%20simple%20unique%201&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%202&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20logo%20text%20only%20letters%20simple%20unique%203&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%204&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20company%20logo%20text%20only%20letters%20simple%20unique%205&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%206&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20logo%20text%20only%20letters%20simple%20unique%207&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%208&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20logo%20text%20only%20letters%20simple%20unique%209&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2010&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20company%20logo%20text%20only%20letters%20simple%20unique%2011&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2012&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20logo%20text%20only%20letters%20simple%20unique%2013&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2014&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20logo%20text%20only%20letters%20simple%20unique%2015&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2016&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20company%20logo%20text%20only%20letters%20simple%20unique%2017&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2018&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20logo%20text%20only%20letters%20simple%20unique%2019&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2020&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20company%20logo%20text%20only%20letters%20simple%20unique%2021&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2022&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20logo%20text%20only%20letters%20simple%20unique%2023&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2024&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20company%20logo%20text%20only%20letters%20simple%20unique%2025&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2026&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20logo%20text%20only%20letters%20simple%20unique%2027&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2028&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20tech%20company%20logo%20text%20only%20letters%20simple%20unique%2029&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20modern%20startup%20logo%20text%20only%20typography%20clean%20unique%2030&image_size=square"
      ]
    },
    footer: {
      copy: "© 2026 VIBEFELLO. 为 VIBE CODING 时代而生。",
      privacy: "隐私政策",
      terms: "服务条款"
    },
    conversion: {
      title: "候补申请已确认！",
      subtitle: "你已加入名单。但如果你渴望立即上线，VibeFello 为你准备了专属捷径。",
      offerTitle: "成为 VibeFello Genesis 创始会员",
      offerBadge: "Genesis 会员专属邀请",
      offerDesc: "别让你的创意死在本地服务器上。获取顶级技术陪跑，确保你的每一个 Vibe 都能成功冲过终点线。",
      benefitsTitle: "会员专属权益：",
      plans: {
        lifetime: {
          name: "Genesis 终身会员",
          title: "成为 VibeFello Genesis 创始会员",
          description: "别让你的创意死在本地服务器上。获取顶级技术陪跑，确保你的每一个 Vibe 都能成功冲过终点线。",
          price: "$99.9",
          originalPrice: "$199.8",
          period: "一次性付费 • 终身有效",
          badge: "Genesis 会员 • 限量 99 位",
          scarcityMessage: "价格将每满 99 个席位价格翻倍。请在下次价格上涨前尽快行动！",
          benefits: [
            "无限次技术陪跑，直到你的产品成功上线。",
            "全栈支持：从 Docker 配置到全球化生产环境扩容。",
            "资深架构师 1对1 诊断，解决 AI 无法处理的深层逻辑。",
            "终身免费使用 VibeFello 未来推出的所有高级功能。"
          ]
        }
      },
      cta: "立即锁定席位",
      back: "返回首页",
      price: "$99.9",
      pricePeriod: "一次性付费 • 终身有效",
      comparison: "价格将每满 99 个席位价格翻倍",
      scarcity: "名额有限，先到先得",
      scarcityMessage: "价格将每满 99 个席位价格翻倍。请在下次价格上涨前尽快行动！",
      valueProp: "一次成功的项目上线，即可为你带来 10 倍以上的投资回报。",
      opportunityBadge: "限时 Genesis 优惠",
      paymentSuccess: "优先权限已确认。请查收邮件并关注 X 获取最新动态。",
      paymentCancel: "支付已暂停，你的优先权限申请尚未完成。",
      alreadyMember: "该邮箱已经拥有优先权限标记。",
      checkEmailReminder: "请查看邮箱，并关注 x.com/vibefello 获取最新动态。",
      successTitle: "优先权限已确认",
      successSubtitle: "你的邮箱已经被 VibeFello 标记为优先跟进。",
      successNextSteps: "接下来做什么？",
      successStep1: "查收确认邮件。",
      successStep2: "关注 x.com/vibefello 获取最新动态。",
      successStep3: "等待团队后续联系。",
      successCta: "返回首页",
      successBack: "返回首页",
      membership: {
        title: "管理会员身份",
        subtitle: "您的当前状态和续费选项。",
        currentStatus: "当前状态",
        genesisStatus: "创始成员 (终身)",
        renewalTitle: "续费与升级",
        renewalDesc: "创始成员身份是唯一一次加入机会。对于未来的项目支持或扩展服务，请选择以下计划。",
        monthly: "按月专业版 ($199/月)",
        yearly: "按年企业版 ($1999/年)",
        renewCta: "切换至该计划"
      },
      dashboard: {
        title: "Genesis 会员控制台",
        welcome: "欢迎回来，创始人",
        status: "会员身份：Genesis 创始会员 (终身)",
        resources: "你的专属资源",
        resource1: "私密 Discord 社区",
        resource2: "1对1 策略咨询预约",
        resource3: "Genesis 资源库",
        resource4: "测试功能优先体验",
        support: "优先技术支持",
        supportDesc: "直连资深陪跑专家。"
      },
      successPage: {
        paymentConfirmed: "支付确认",
        alreadyActive: "已激活",
        welcomeTitle: "欢迎加入创始圈",
        activeTitle: "会员身份已激活",
        successDesc: "你已成功锁定 Genesis 创始圈席位。我们的团队将很快与你联系。",
        activeDesc: "你的创始会员账户已经激活并准备就绪。",
        confirmationSent: "确认邮件已发送至",
        celebrate: "庆祝",
        followUpdates: "关注动态",
        memberId: "会员 ID",
        status: "状态",
        access: "访问权限",
        active: "已激活",
        lifetime: "终身",
        prioritySupport: "优先支持",
        earlyAccess: "早期访问",
        exclusiveUpdates: "独家更新",
        checkEmail: "查收邮件",
        waitForContact: "等待联系",
        getStarted: "开始使用",
        confirmationSentDesc: "已发送确认邮件",
        teamReachOutDesc: "团队将联系你",
        beginJourneyDesc: "开始你的旅程"
      }
    },
    validation: {
      emailInvalid: "请输入有效的电子邮箱地址。",
      blockerRequired: "请告诉我们阻碍你上线的难题。",
      blockerTooShort: "请提供更多细节（至少 10 个字符）。"
    }
  }
};

const SparkleDots = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0, 1, 0], 
          scale: [0, 1, 0],
          x: [0, (i % 2 === 0 ? 1 : -1) * (15 + i * 5)],
          y: [0, (i < 3 ? -1 : 1) * (15 + i * 5)]
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity, 
          delay: i * 0.4,
          ease: "easeInOut"
        }}
        className="absolute left-1/2 top-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
      />
    ))}
  </div>
);

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('dark');
  const [email, setEmail] = useState('');
  const [heroEmail, setHeroEmail] = useState('');
  const [blocker, setBlocker] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showConversion, setShowConversion] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'lifetime'>('lifetime');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'cancel' | null>(null);
  const [activeScenario, setActiveScenario] = useState(0);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{type: 'success' | 'error' | 'loading', message: string} | null>(null);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [waitlistCount, setWaitlistCount] = useState(1);

  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [blockerError, setBlockerError] = useState<string | null>(null);
  const [heroEmailError, setHeroEmailError] = useState<string | null>(null);

  const t = translations[lang];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScenario((prev) => (prev + 1) % CHAT_SCENARIOS.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Update waitlist count every 20 minutes
  useEffect(() => {
    const updateWaitlistCount = () => {
      const randomIncrease = Math.floor(Math.random() * 3) + 1; // 1-3
      setWaitlistCount(prev => prev + randomIncrease);
    };

    // Initial update
    updateWaitlistCount();

    // Set interval for 20 minutes (1200000 ms)
    const interval = setInterval(updateWaitlistCount, 1200000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (paymentStatus === 'success') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#000000', '#FFFFFF', '#FF6321']
      });
      
      // Fetch accurate member count
      fetch('/api/member-count')
        .then(res => res.json())
        .then(data => setMemberCount(data.count))
        .catch(err => console.error("Error fetching count:", err));
    }
  }, [paymentStatus]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const savedMember = localStorage.getItem('vibefello_member') === 'true';
    const savedEmail = localStorage.getItem('vibefello_email') || '';
    
    if (savedMember) {
      setIsMember(true);
      setSubmittedEmail(savedEmail);
    }

    if (params.get('payment') === 'success') {
      setPaymentStatus('success');
      setShowConversion(true);
      setIsMember(true);
      localStorage.setItem('vibefello_member', 'true');
      const emailToSave = submittedEmail || savedEmail;
      if (emailToSave) {
        setSubmittedEmail(emailToSave);
        localStorage.setItem('vibefello_email', emailToSave);
      }
    } else if (params.get('payment') === 'cancel') {
      setPaymentStatus('cancel');
      setShowConversion(true);
    }
  }, [submittedEmail]);

  const handleStripeCheckout = async () => {
    console.log("Initiating checkout for email:", submittedEmail, "Plan:", selectedPlan);
    
    // Save email to localStorage before redirect
    if (submittedEmail) {
      localStorage.setItem('vibefello_email', submittedEmail);
    }
    
    setIsSubmitting(true);
    try {
      // First try our own checkout session endpoint
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: submittedEmail }),
      });
      
      if (response.ok) {
        const { url } = await response.json();
        console.log("Checkout session URL created:", url);
        
        if (url) {
          window.location.href = url;
          return;
        }
      }
      
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || 'Failed to create checkout session');
    } catch (err) {
      console.error('Stripe error:', err);
      setError(err instanceof Error ? err.message : t.waitlist.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: FormEvent, source: 'hero' | 'waitlist' = 'waitlist') => {
    e.preventDefault();
    setError(null);
    setEmailError(null);
    setBlockerError(null);
    setHeroEmailError(null);

    const currentEmail = source === 'hero' ? heroEmail : email;
    const currentBlocker = source === 'hero' ? 'Hero quick signup' : blocker;

    let hasError = false;

    if (!validateEmail(currentEmail)) {
      if (source === 'hero') setHeroEmailError(t.validation.emailInvalid);
      else setEmailError(t.validation.emailInvalid);
      hasError = true;
    }



    if (hasError) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentEmail, blocker: currentBlocker }),
      });

      if (!response.ok) throw new Error('Failed to join waitlist');
      
      const data = await response.json();
      const hasPriorityAccess = Boolean(data.paid || data.priorityAccess);
      localStorage.setItem('vibefello_email', currentEmail);
      if (hasPriorityAccess) {
        setIsMember(true);
        localStorage.setItem('vibefello_member', 'true');
      }

      setSubmittedEmail(currentEmail);
      setShowConversion(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Waitlist error:', err);
      setError(t.waitlist.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLang = () => setLang(l => l === 'en' ? 'cn' : 'en');
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const hasConfirmedMembership = paymentStatus === 'success' || isMember;
  const isReturningPaidMember = paymentStatus !== 'success' && isMember;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent/30 font-sans transition-colors duration-300 overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid" />
      </div>

      {/* Header with Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <a 
            href="/" 
            className="group cursor-pointer"
          >
            <motion.img 
              src="/img/logo.png" 
              alt="VibeFello" 
              className="h-10 w-auto object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.3 }}
            />
          </a>
          
          {!showConversion && (
            <div className="hidden md:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.25em] text-foreground/50">
              <a href="#problem" className="hover:text-foreground transition-colors">{t.nav.problem}</a>
              <a href="#solution" className="hover:text-foreground transition-colors">{t.nav.solution}</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">{t.nav.howItWorks}</a>
            </div>
          )}

          <div className="flex items-center gap-8">
            <button 
              onClick={toggleLang}
              className="text-[11px] font-black uppercase tracking-widest text-foreground/30 hover:text-foreground transition-colors"
            >
              {lang === 'en' ? 'CN' : 'EN'}
            </button>
            {!showConversion && (
              <a 
                href="#waitlist" 
                className="bg-foreground text-white px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-accent transition-all hover:scale-105 active:scale-95 shadow-lg shadow-foreground/10"
              >
                {t.nav.joinWaitlist}
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {showConversion ? (
          <div className="min-h-screen flex items-center justify-center p-4 md:p-8 pt-20 md:pt-24 overflow-x-hidden">
            <div className="max-w-5xl mx-auto w-full relative pb-20">
              {/* Background Accents */}
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -z-10" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-tertiary/10 rounded-full blur-[100px] -z-10" />

              {hasConfirmedMembership ? (
                <div className="w-full max-w-5xl mx-auto">
                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                  >
                    {/* Background Effects - Matching Hero Style */}
                    <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-accent/30 rounded-full blur-[150px] -z-10" />
                    <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-secondary/30 rounded-full blur-[120px] -z-10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-tertiary/20 rounded-full blur-[100px] -z-10" />
                    
                    {/* Main Success Card - Dark Theme Matching Hero */}
                    <div className="bg-foreground rounded-[2.5rem] p-8 md:p-12 shadow-pop-lg relative overflow-hidden">
                      {/* Top Gradient Line */}
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent via-emerald to-tertiary" />
                      
                      {/* Animated Particles */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(15)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity: [0, 0.6, 0],
                              scale: [0, 1, 0],
                              x: [0, (Math.random() - 0.5) * 200],
                              y: [0, (Math.random() - 0.5) * 200]
                            }}
                            transition={{
                              duration: 4 + Math.random() * 2,
                              repeat: Infinity,
                              delay: i * 0.3
                            }}
                            className="absolute left-1/2 top-1/2 w-1.5 h-1.5 bg-accent rounded-full"
                          />
                        ))}
                      </div>
                      
                      {/* Success Badge */}
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12 }}
                        className="flex justify-center mb-8"
                      >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/30 rounded-full">
                          <CheckCircle2 className="w-5 h-5 text-accent" />
                          <span className="text-sm font-black text-accent uppercase tracking-wider">
                            {paymentStatus === 'success' ? t.conversion.successPage.paymentConfirmed : t.conversion.successPage.alreadyActive}
                          </span>
                        </div>
                      </motion.div>
                      
                      {/* Main Content Grid */}
                      <div className="grid lg:grid-cols-2 gap-10 items-center">
                        {/* Left: Text Content */}
                        <div className="text-center lg:text-left">
                          <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 leading-[0.95] text-white"
                          >
                            {paymentStatus === 'success'
                              ? t.conversion.successPage.welcomeTitle
                              : t.conversion.successPage.activeTitle}
                          </motion.h1>
                          
                          <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-white/60 font-medium mb-8 max-w-md mx-auto lg:mx-0"
                          >
                            {paymentStatus === 'success'
                              ? t.conversion.successPage.successDesc
                              : t.conversion.successPage.activeDesc}
                          </motion.p>
                          
                          {/* Email Info Card */}
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8"
                          >
                            <div className="flex items-center gap-3 text-white/80">
                              <Mail className="w-5 h-5 text-accent shrink-0" />
                              <div className="text-left">
                                <div className="text-xs font-black uppercase tracking-wider text-white/40 mb-1">{t.conversion.successPage.confirmationSent}</div>
                                <div className="font-mono text-sm">{submittedEmail}</div>
                              </div>
                            </div>
                          </motion.div>
                          
                          {/* Action Buttons */}
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                          >
                            <button 
                              onClick={() => {
                                confetti({
                                  particleCount: 150,
                                  spread: 70,
                                  origin: { y: 0.6 },
                                  colors: ['#FFD700', '#000000', '#FFFFFF', '#FF6321']
                                });
                              }}
                              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-black font-black text-sm uppercase tracking-wider rounded-full hover:bg-accent/90 transition-all shadow-pop"
                            >
                              <Sparkles className="w-4 h-4" />
                              {t.conversion.successPage.celebrate}
                            </button>
                            <a 
                              href="https://x.com/vibefello"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-black text-sm uppercase tracking-wider rounded-full hover:bg-white/20 transition-all border border-white/20"
                            >
                              <Twitter className="w-4 h-4" />
                              {t.conversion.successPage.followUpdates}
                            </a>
                          </motion.div>
                        </div>

                        {/* Right: Membership Card */}
                        <motion.div 
                          initial={{ x: 30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4, type: 'spring', damping: 15 }}
                          className="relative"
                        >
                          {/* Card Glow */}
                          <div className="absolute -inset-4 bg-accent/20 rounded-[2.5rem] blur-2xl" />
                          
                          {/* Membership Card */}
                          <div className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-[2rem] p-8 shadow-pop-lg border-2 border-white">
                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-8">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center">
                                  <Zap className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                  <div className="text-xs font-black text-foreground/40 uppercase tracking-wider">VIBEFELLO</div>
                                  <div className="text-lg font-black text-foreground">GENESIS</div>
                                </div>
                              </div>
                              <div className="px-3 py-1 bg-accent text-black text-[10px] font-black uppercase tracking-wider rounded-full">
                                 GENESIS
                               </div>
                            </div>
                            
                            {/* Member ID */}
                            <div className="bg-foreground rounded-xl p-5 mb-6">
                              <div className="text-[10px] font-black text-white/40 uppercase tracking-wider mb-2">{t.conversion.successPage.memberId}</div>
                              <div className="font-mono text-2xl font-black text-accent tracking-wider">
                                {memberCount !== null 
                                  ? `VF-2026-${String(memberCount).padStart(3, '0')}` 
                                  : `VF-2026-${String((submittedEmail?.length || 0) * 7).padStart(3, '0')}`}
                              </div>
                            </div>
                            
                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="bg-gray-100 rounded-xl p-4">
                                <div className="text-[10px] font-black text-foreground/40 uppercase tracking-wider mb-1">{t.conversion.successPage.status}</div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
                                  <span className="font-black text-foreground text-sm">{t.conversion.successPage.active}</span>
                                </div>
                              </div>
                              <div className="bg-gray-100 rounded-xl p-4">
                                <div className="text-[10px] font-black text-foreground/40 uppercase tracking-wider mb-1">{t.conversion.successPage.access}</div>
                                <span className="font-black text-foreground text-sm">{t.conversion.successPage.lifetime}</span>
                              </div>
                            </div>
                            
                            {/* Benefits List */}
                            <div className="space-y-3">
                              {[
                                t.conversion.successPage.prioritySupport,
                                t.conversion.successPage.earlyAccess,
                                t.conversion.successPage.exclusiveUpdates
                              ].map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3">
                                  <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-3 h-3 text-accent" />
                                  </div>
                                  <span className="text-sm font-bold text-foreground/80">{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                      
                      {/* Bottom Steps */}
                      <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-12 pt-10 border-t border-white/10"
                      >
                        <div className="grid md:grid-cols-3 gap-6">
                          {[
                            { icon: Mail, title: t.conversion.successPage.checkEmail, desc: t.conversion.successPage.confirmationSentDesc },
                            { icon: Clock, title: t.conversion.successPage.waitForContact, desc: t.conversion.successPage.teamReachOutDesc },
                            { icon: Sparkles, title: t.conversion.successPage.getStarted, desc: t.conversion.successPage.beginJourneyDesc }
                          ].map((step, i) => (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7 + i * 0.1 }}
                              className="flex items-start gap-4"
                            >
                              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0">
                                <step.icon className="w-5 h-5 text-accent" />
                              </div>
                              <div>
                                <div className="font-black text-sm text-white mb-1">{step.title}</div>
                                <div className="text-xs text-white/40 font-medium">{step.desc}</div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <>
                  {/* Success Header: Top Centered */}
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 flex flex-col items-center mt-12 md:mt-16 mb-6 md:mb-10 space-y-3 md:space-y-4 w-full px-4"
                  >
                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-center md:text-left max-w-4xl">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-accent border-2 border-foreground rounded-xl flex items-center justify-center shadow-pop rotate-3 shrink-0">
                        <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-black" strokeWidth={3} />
                      </div>
                      <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter leading-[0.9] text-foreground">
                        {t.conversion.title}
                      </h1>
                    </div>
                    <p className="text-[10px] md:text-sm text-foreground/60 font-bold uppercase tracking-widest max-w-2xl text-center">
                      {t.conversion.subtitle}
                    </p>
                  </motion.div>

                  {/* Main Conversion Card */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                  >
                    {/* Card Glow Effect */}
                    <div className="absolute -inset-1 bg-accent/20 rounded-[3rem] blur-xl opacity-20 animate-pulse" />
                    
                    <div className="relative bg-foreground rounded-[2.5rem] shadow-2xl border-2 border-foreground overflow-hidden flex flex-col lg:flex-row min-h-[550px] lg:min-h-[600px]">
                      {/* Card Left: Context & Benefits (Black Section) */}
                      <div className="lg:w-1/2 bg-foreground p-8 md:p-10 flex flex-col space-y-6 border-b lg:border-b-0 lg:border-r border-white/10">
                        <div className="space-y-4">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full font-black text-[10px] uppercase tracking-[0.2em] border border-white/10 relative overflow-hidden">
                            <SparkleDots />
                            <Sparkles className="w-3 h-3 text-accent" />
                            <span className="text-emerald">{t.conversion.opportunityBadge}</span>
                          </div>
                          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tighter leading-[0.9] text-white">
                            {t.conversion.plans[selectedPlan].title}
                          </h2>
                          <p className="text-sm md:text-base text-white/60 leading-relaxed font-medium">
                            {t.conversion.plans[selectedPlan].description}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald">
                            {t.conversion.benefitsTitle}
                          </p>
                          <div className="grid gap-2">
                            {t.conversion.plans[selectedPlan].benefits.map((benefit, idx) => (
                              <motion.div 
                                key={`${selectedPlan}-${idx}`} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + idx * 0.05 }}
                                className="flex items-start gap-3 group"
                              >
                                <div className="w-5 h-5 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-all">
                                  <CheckCircle2 className="w-3 h-3 text-accent" strokeWidth={3} />
                                </div>
                                <span className="text-sm text-white/80 font-bold leading-tight">{benefit}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 mt-auto space-y-3">
                          <div className="text-white/30 text-[9px] font-medium leading-relaxed uppercase tracking-widest">
                            {t.conversion.valueProp}
                          </div>
                        </div>
                      </div>

                      {/* Card Right: Pricing & CTA (White Section) */}
                      <div className="lg:w-1/2 bg-white p-8 md:p-10 flex flex-col justify-center">
                        {/* Plan Indicator */}


                        <div className="flex items-center justify-between mb-8">
                          <div className="px-3 py-1 bg-accent border border-foreground text-black text-[9px] font-black uppercase tracking-widest rounded-full shadow-pop relative overflow-hidden">
                            <SparkleDots />
                            {t.conversion.plans[selectedPlan].badge}
                          </div>
                          <div className="flex items-center gap-2 text-[9px] font-black text-foreground/40 uppercase tracking-widest">
                            <Clock className="w-3.5 h-3.5 text-accent" strokeWidth={3} />
                            {t.conversion.scarcity}
                          </div>
                        </div>

                        <div className="mb-10">
                          <div className="text-foreground/30 font-black uppercase tracking-[0.2em] text-[10px] mb-2">
                            {t.conversion.plans[selectedPlan].period}
                          </div>
                          <div className="flex items-baseline gap-4">
                            <span className="text-7xl md:text-8xl font-display font-black tracking-tighter text-foreground leading-none">
                              {t.conversion.plans[selectedPlan].price}
                            </span>
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-foreground/30 line-through decoration-accent/50 decoration-2">
                                {t.conversion.plans[selectedPlan].originalPrice}
                              </span>

                            </div>
                          </div>
                        </div>

                        {/* Scarcity Message */}
                        <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl mb-8">
                          <p className="text-[10px] font-black text-emerald uppercase tracking-wider leading-tight">
                            {t.conversion.plans[selectedPlan].scarcityMessage}
                          </p>
                        </div>

                        {paymentStatus === 'cancel' && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-2xl text-red-600 text-xs font-black text-center flex items-center justify-center gap-3 shadow-pop"
                          >
                            <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shrink-0">
                              <ArrowRight className="w-3 h-3 rotate-180" strokeWidth={3} />
                            </div>
                            <span className="uppercase tracking-widest">{t.conversion.paymentCancel}</span>
                          </motion.div>
                        )}

                        {error && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-2xl text-red-600 text-xs font-black text-center shadow-pop"
                          >
                            <span className="uppercase tracking-widest">{error}</span>
                          </motion.div>
                        )}

                        <button 
                          onClick={handleStripeCheckout}
                          disabled={isSubmitting}
                          className="candy-button w-full py-6 text-xl group relative overflow-hidden"
                        >
                          <SparkleDots />
                          {isSubmitting ? (
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              {t.conversion.cta}
                              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                            </>
                          )}
                        </button>


                      </div>
                    </div>
                  </motion.div>


                </>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="min-h-screen flex items-center pt-20 pb-12 px-6 relative overflow-hidden">
              {/* Background Decorations */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                {/* Enhanced Green Glow */}
                <motion.div 
                  className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/30 rounded-full blur-[150px]"
                  animate={{ 
                    scale: [1, 1.3, 1], 
                    opacity: [0.4, 0.7, 0.4] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 8, 
                    ease: "easeInOut" 
                  }}
                />
                <motion.div 
                  className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/30 rounded-full blur-[120px]"
                  animate={{ 
                    scale: [1, 1.2, 1], 
                    opacity: [0.3, 0.6, 0.3] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 6, 
                    ease: "easeInOut",
                    delay: 1 
                  }}
                />
                <motion.div 
                  className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[100px]"
                  animate={{ 
                    scale: [1, 1.1, 1], 
                    opacity: [0.2, 0.5, 0.2] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 10, 
                    ease: "easeInOut",
                    delay: 2 
                  }}
                />
                
                {/* Enhanced Geometric Shapes */}
                <motion.div 
                  className="absolute top-1/4 left-1/5 w-20 h-20 border-2 border-accent/50 rounded-full"
                  animate={{ 
                    rotate: 360, 
                    opacity: [0.3, 0.6, 0.3] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 15, 
                    ease: "linear" 
                  }}
                />
                <motion.div 
                  className="absolute top-2/3 right-1/4 w-16 h-16 border-2 border-secondary/50 transform rotate-45"
                  animate={{ 
                    rotate: [45, 135, 45], 
                    opacity: [0.2, 0.5, 0.2] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 12, 
                    ease: "easeInOut" 
                  }}
                />
                <motion.div 
                  className="absolute top-1/2 right-1/3 w-32 h-32 border-2 border-accent/40 rounded-full"
                  animate={{ 
                    scale: [1, 1.3, 1], 
                    opacity: [0.2, 0.4, 0.2] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 8, 
                    ease: "easeInOut",
                    delay: 1.5 
                  }}
                />
                <motion.div 
                  className="absolute top-1/3 right-1/5 w-12 h-12 bg-accent/30 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1], 
                    opacity: [0.3, 0.6, 0.3] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 6, 
                    ease: "easeInOut" 
                  }}
                />
                <motion.div 
                  className="absolute bottom-1/4 left-1/3 w-16 h-16 border-2 border-secondary/40 transform rotate-12"
                  animate={{ 
                    rotate: [12, 72, 12], 
                    opacity: [0.2, 0.4, 0.2] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 10, 
                    ease: "easeInOut",
                    delay: 0.5 
                  }}
                />
                <motion.div 
                  className="absolute bottom-1/3 right-1/6 w-14 h-14 border-2 border-accent/40 transform rotate-30"
                  animate={{ 
                    rotate: [30, 90, 30], 
                    opacity: [0.2, 0.4, 0.2] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 14, 
                    ease: "easeInOut",
                    delay: 1 
                  }}
                />
                <motion.div 
                  className="absolute top-1/6 left-1/3 w-10 h-10 bg-secondary/30 rounded-full"
                  animate={{ 
                    scale: [1, 1.4, 1], 
                    opacity: [0.3, 0.5, 0.3] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 7, 
                    ease: "easeInOut",
                    delay: 0.8 
                  }}
                />
                <motion.div 
                  className="absolute top-1/2 left-1/4 w-18 h-18 border-2 border-accent/40 transform rotate-15"
                  animate={{ 
                    rotate: [15, 75, 15], 
                    opacity: [0.2, 0.4, 0.2] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 11, 
                    ease: "easeInOut",
                    delay: 0.6 
                  }}
                />
                <motion.div 
                  className="absolute bottom-1/5 right-1/3 w-12 h-12 bg-secondary/30 rounded-full"
                  animate={{ 
                    scale: [1, 1.3, 1], 
                    opacity: [0.2, 0.5, 0.2] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 9, 
                    ease: "easeInOut",
                    delay: 1.2 
                  }}
                />
                <motion.div 
                  className="absolute top-1/4 right-1/3 w-16 h-16 border-2 border-accent/40 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1], 
                    opacity: [0.2, 0.4, 0.2] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 8, 
                    ease: "easeInOut",
                    delay: 0.9 
                  }}
                />
                <motion.div 
                  className="absolute bottom-1/4 left-1/5 w-14 h-14 border-2 border-secondary/40 transform rotate-45"
                  animate={{ 
                    rotate: [45, 135, 45], 
                    opacity: [0.2, 0.4, 0.2] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 13, 
                    ease: "easeInOut",
                    delay: 0.7 
                  }}
                />
                <motion.div 
                  className="absolute top-2/3 left-1/4 w-10 h-10 bg-accent/30 rounded-full"
                  animate={{ 
                    scale: [1, 1.4, 1], 
                    opacity: [0.2, 0.4, 0.2] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 7, 
                    ease: "easeInOut",
                    delay: 1.1 
                  }}
                />
              </div>
              
              <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <div className="relative z-10 text-left">
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vibe-gradient text-black text-xs font-black tracking-widest uppercase mb-8 border-2 border-foreground shadow-pop"
                  >
                    <Zap className="w-4 h-4 fill-current" strokeWidth={2.5} />
                    {t.hero.badge}
                  </motion.div>

                  <motion.h1 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="font-display text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[0.9]"
                  >
                    {t.hero.title.split(',').map((part, i) => (
                      <motion.span 
                        key={i} 
                        className="block whitespace-nowrap"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i, duration: 0.5 }}
                      >
                        {part.trim()}{i === 0 ? ',' : ''}
                      </motion.span>
                    ))}
                  </motion.h1>

                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl md:text-2xl text-foreground/80 max-w-2xl mb-12 leading-relaxed font-medium relative"
                  >
                    {t.hero.subtitle.split(/\[|\]/).map((part, i) => 
                      i % 2 === 1 ? (
                        <span key={i} className="text-foreground font-black underline decoration-accent decoration-8 underline-offset-4">
                          {part}
                        </span>
                      ) : part
                    )}
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center gap-6"
                  >
                    <form 
                      onSubmit={(e) => handleSubmit(e, 'hero')}
                      className="w-full max-w-xl flex flex-col sm:flex-row gap-4 sm:gap-3"
                    >
                      <div className="flex-1 relative">
                        <input 
                          required
                          type="email"
                          value={heroEmail}
                          onChange={(e) => {
                            setHeroEmail(e.target.value);
                            if (heroEmailError) setHeroEmailError(null);
                          }}
                          onBlur={() => {
                            if (heroEmail && !validateEmail(heroEmail)) {
                              setHeroEmailError(t.validation.emailInvalid);
                            }
                          }}
                          placeholder={t.waitlist.placeholderEmail}
                          className={`w-full px-5 py-4 rounded-xl bg-white border-2 ${heroEmailError ? 'border-red-500' : 'border-foreground'} focus:border-accent outline-none transition-all duration-300 font-bold placeholder:text-muted-foreground/50 text-sm shadow-pop hover:shadow-pop-lg group relative z-10`}
                        />
                        {heroEmailError && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -bottom-5 left-2 text-[10px] font-black text-red-500 uppercase tracking-wider whitespace-nowrap relative z-10"
                          >
                            {heroEmailError}
                          </motion.p>
                        )}
                      </div>
                      <button 
                        disabled={isSubmitting}
                        type="submit"
                        className="candy-button py-4 px-10 text-sm whitespace-nowrap relative overflow-hidden group z-10"
                      >
                        <SparkleDots />
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <motion.div 
                            className="flex items-center"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            {t.hero.cta}
                            <motion.div 
                              className="ml-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                              whileHover={{ scale: 1.1, rotate: 90 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ArrowRight className="w-3 h-3 text-black" strokeWidth={4} />
                            </motion.div>
                          </motion.div>
                        )}
                      </button>
                    </form>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-10 flex items-center gap-6"
                  >
                    <div className="flex items-center gap-3 group">
                      <motion.div 
                        className="w-2 h-2 bg-accent rounded-full shadow-[0_0_10px_rgba(52,239,141,0.5)]"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                      <span className="text-xs font-black text-foreground/60 uppercase tracking-widest group-hover:text-foreground/80 transition-colors">
                        {(() => {
                          return t.hero.socialProof.replace(/\[.*?\]/, `[${waitlistCount}]`).split(/\[|\]/).map((part, i) => 
                            i % 2 === 1 ? (
                              <motion.span 
                                key={i} 
                                className="text-accent text-sm font-black"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                              >
                                {part}
                              </motion.span>
                            ) : part
                          );
                        })()}
                      </span>
                    </div>
                  </motion.div>
                </div>

                <div className="relative lg:block">
                  {/* Decorative Dotted Pattern behind image */}
                  <div className="absolute -inset-10 bg-dot-grid -z-10 rotate-12 scale-110" />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotate: 5 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    className="relative flex justify-center lg:justify-end"
                  >
                    <motion.div 
                      className="w-full max-w-[440px] aspect-[4/5] bg-white border-2 border-foreground rounded-[3rem] p-8 shadow-pop relative overflow-hidden flex flex-col gap-6"
                      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <motion.div 
                          className="w-3 h-3 rounded-full bg-red-400" 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                        <motion.div 
                          className="w-3 h-3 rounded-full bg-yellow-400" 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                        />
                        <motion.div 
                          className="w-3 h-3 rounded-full bg-green-400" 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
                        />
                        <div className="ml-auto text-[10px] font-black text-foreground/30 uppercase tracking-widest">Vibe-Chat-v1.0</div>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={activeScenario}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col gap-6"
                        >
                          {/* User Message */}
                          <motion.div 
                            initial={{ x: 40, opacity: 0, scale: 0.9 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                            className="self-end max-w-[90%] bg-foreground text-background p-6 rounded-3xl rounded-tr-none shadow-pop text-sm md:text-base font-medium leading-relaxed"
                          >
                            {CHAT_SCENARIOS[activeScenario].user}
                          </motion.div>

                          {/* VibeFello Response */}
                          <motion.div 
                            initial={{ x: -40, opacity: 0, scale: 0.9 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            transition={{ delay: 3.5, duration: 0.8, ease: "easeOut" }}
                            className="self-start max-w-[90%] bg-accent text-black p-6 rounded-3xl rounded-tl-none shadow-pop text-sm md:text-base font-black border-2 border-foreground leading-relaxed relative"
                          >
                            {CHAT_SCENARIOS[activeScenario].fello}
                            
                            {/* Feedback Badge */}
                            <motion.div
                              initial={{ scale: 0, opacity: 0, y: 10 }}
                              animate={{ scale: 1, opacity: 1, y: 0 }}
                              transition={{ delay: 6.0, type: "spring", stiffness: 200 }}
                              className="absolute -bottom-4 -right-4 bg-white border-2 border-foreground px-4 py-2 rounded-full shadow-pop flex items-center gap-3"
                            >
                              <div className="w-6 h-6 bg-vibe-gradient rounded-full flex items-center justify-center shadow-pop border border-foreground">
                                <CheckCircle2 className="w-4 h-4 text-black" strokeWidth={4} />
                              </div>
                              <span className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Issue Resolved</span>
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      </AnimatePresence>

                      {/* Bottom Input Mockup */}
                      <div className="mt-auto pt-4 border-t border-foreground/10 flex gap-3">
                        <motion.div 
                          className="flex-1 h-12 bg-muted rounded-full border border-foreground/20 relative group"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        />

                        <motion.div 
                          className="w-12 h-12 bg-accent rounded-full border border-foreground shadow-pop flex items-center justify-center"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight className="w-5 h-5 text-black" strokeWidth={3} />
                        </motion.div>
                      </div>

                      {/* SHIP IT Sticker repositioned to bottom-left of chat dialog */}
                      <motion.div 
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: -5 }}
                        transition={{ delay: 1.5, type: "spring" }}
                        className="absolute bottom-6 left-6 bg-vibe-gradient border-2 border-foreground px-5 py-2 rounded-full shadow-pop font-display font-black text-lg z-20"
                      >
                        SHIP IT! 🚀
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Audience Section */}
            <section className="py-24 px-6 relative overflow-hidden bg-white">
              <div className="absolute inset-0 bg-dot-grid opacity-5" />
              <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">

                  <h2 className="font-display text-4xl md:text-6xl font-extrabold mb-4 tracking-tighter">
                    {t.audience.title}
                  </h2>
                  <p className="text-lg text-foreground/60 font-bold max-w-2xl mx-auto">
                    {t.audience.subtitle}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {t.audience.cards.map((card, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -8, rotate: idx % 2 === 0 ? 1 : -1 }}
                      className="bg-white border-2 border-foreground rounded-[2rem] p-8 shadow-pop hover:shadow-pop-lg transition-all"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-accent border-2 border-foreground flex items-center justify-center mb-6 shadow-pop">
                        {card.icon === 'Users' && <Users className="w-7 h-7 text-black" strokeWidth={2.5} />}
                        {card.icon === 'Zap' && <Zap className="w-7 h-7 text-black" strokeWidth={2.5} />}
                        {card.icon === 'Code2' && <Code2 className="w-7 h-7 text-black" strokeWidth={2.5} />}
                        {card.icon === 'TrendingUp' && <TrendingUp className="w-7 h-7 text-black" strokeWidth={2.5} />}
                      </div>
                      <h3 className="text-xl font-black mb-3 tracking-tight leading-none">{card.title}</h3>
                      <p className="text-sm text-foreground/60 font-bold leading-relaxed">{card.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Problem Section */}
            <section id="problem" className="py-32 px-6 relative overflow-hidden bg-foreground text-background">
              <div className="absolute inset-0 bg-diagonal-stripes opacity-5" />
              <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                  <div>
                    <div className="inline-block px-3 py-1 bg-accent border border-foreground rounded-full font-black text-[10px] uppercase tracking-widest mb-4 shadow-pop text-black">
                      The Reality Check
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-6 tracking-tighter leading-tight text-white">
                      {t.problem.title}
                    </h2>
                    <div className="space-y-6 text-base text-background/60 font-medium">
                      <p>{t.problem.p1}</p>
                      <blockquote className="relative p-8 bg-secondary border border-background/10 rounded-2xl shadow-pop italic text-background font-bold leading-relaxed">
                        <div className="absolute -top-4 -left-4 w-10 h-10 bg-accent rounded-full border border-foreground flex items-center justify-center shadow-pop">
                          <MessageSquare className="w-5 h-5 text-black" strokeWidth={2.5} />
                        </div>
                        {t.problem.quote}
                      </blockquote>
                      <p>{t.problem.p2}</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-8">
                    {t.problem.cards.map((card, idx) => (
                      <motion.div 
                        key={idx}
                        whileHover={{ y: -5 }}
                        className="sticker-card bg-white text-foreground"
                      >
                        <div className="w-10 h-10 rounded-full border border-foreground flex items-center justify-center mb-4 shadow-pop bg-accent">
                          {idx === 0 ? <TrendingUp className="w-5 h-5 text-black" /> : idx === 1 ? <Globe className="w-5 h-5 text-black" /> : idx === 2 ? <Cpu className="w-5 h-5 text-black" /> : <Bug className="w-5 h-5 text-black" />}
                        </div>
                        <h3 className="text-xl font-extrabold mb-2 tracking-tight leading-none">{card.title}</h3>
                        <p className="text-foreground/60 font-medium leading-relaxed text-xs">{card.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            {/* Solution Section */}
            <section id="solution" className="py-16 px-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-dot-grid opacity-10" />
              <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">

                  <h2 className="font-display text-4xl md:text-6xl font-extrabold mb-4 tracking-tighter">
                    {t.solution.title}
                  </h2>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-lg md:text-xl font-bold text-foreground bg-vibe-gradient px-8 py-6 rounded-2xl inline-block mt-8 shadow-pop border-2 border-foreground max-w-3xl text-center"
                  >
                    <div className="font-bold mb-4">{t.solution.highlight}</div>
                    <div className="text-base md:text-lg text-foreground/70 font-medium leading-relaxed">{t.solution.description}</div>
                  </motion.div>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {t.solution.cards.map((card, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ y: -10 }}
                      className="relative bg-white border-2 border-foreground rounded-[2rem] p-8 shadow-pop transition-all hover:shadow-pop-lg group"
                    >
                      <div className="absolute -top-4 -right-4 px-4 py-1 bg-secondary text-white text-[10px] font-black rounded-full border-2 border-foreground shadow-pop rotate-12 group-hover:rotate-0 transition-transform">
                        {idx === 0 ? "100% SUCCESS" : idx === 1 ? "REVENUE READY" : "SECURE & SCALABLE"}
                      </div>
                      
                      <div className="w-16 h-16 rounded-2xl border-2 border-foreground flex items-center justify-center mb-8 shadow-pop bg-accent group-hover:rotate-6 transition-transform">
                        {idx === 0 ? <Zap className="w-8 h-8 text-black" strokeWidth={2.5} /> : idx === 1 ? <Code2 className="w-8 h-8 text-black" strokeWidth={2.5} /> : <ShieldCheck className="w-8 h-8 text-black" strokeWidth={2.5} />}
                      </div>
                      
                      <h3 className="text-2xl font-extrabold mb-4 tracking-tight leading-none">{card.title}</h3>
                      <p className="text-foreground/70 font-medium leading-relaxed text-sm">{card.desc}</p>
                      
                      <div className="mt-8 pt-6 border-t-2 border-foreground/5 flex items-center gap-2 text-xs font-black text-foreground/40 uppercase tracking-widest">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Expert Verified
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-16 text-center"
                >
                  <p className="text-lg md:text-xl font-bold text-foreground max-w-3xl mx-auto leading-relaxed">
                    {t.solution.conclusion}
                  </p>
                </motion.div>
              </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-16 px-6 relative overflow-hidden bg-foreground text-background">
              <div className="absolute inset-0 bg-diagonal-stripes opacity-5" />
              <div className="max-w-7xl mx-auto relative z-10">
                <h2 className="font-display text-4xl md:text-6xl font-extrabold mb-16 tracking-tighter text-center text-white">
                  {t.howItWorks.title}
                </h2>
                <div className="grid md:grid-cols-3 gap-12">
                  {t.howItWorks.steps.map((step, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.2 }}
                      className="relative group"
                    >
                      <div className="font-display text-[8rem] font-black text-background/5 absolute -top-16 -left-6 select-none group-hover:text-emerald/10 transition-colors leading-none">
                        {step.step}
                      </div>
                      <div className="relative pt-8">
                        <div className="w-10 h-10 bg-white border border-foreground rounded-full flex items-center justify-center font-black text-lg mb-4 shadow-pop group-hover:bg-accent group-hover:text-black transition-bounce text-black">
                          {idx + 1}
                        </div>
                        <h3 className="text-2xl font-extrabold mb-3 tracking-tight leading-none text-white">{step.title}</h3>
                        <p className="text-background/60 font-medium leading-relaxed text-base">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-6 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-dot-grid opacity-10 -z-10" />
              <div className="max-w-3xl mx-auto">
                <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-12 tracking-tighter text-center">
                  {t.faq.title}
                </h2>
                <div className="space-y-4">
                  {t.faq.items.map((item, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`bg-white overflow-hidden border-2 rounded-2xl transition-all duration-500 ${activeFaq === idx ? 'border-accent shadow-lg shadow-accent/20 bg-accent/5' : 'border-foreground shadow-pop'}`}
                    >
                      <button 
                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                        className="w-full text-left p-6 flex items-center justify-between group"
                      >
                        <h3 className="text-lg md:text-xl font-extrabold tracking-tight leading-tight flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full border-2 border-foreground flex items-center justify-center shrink-0 shadow-pop transition-all duration-500 ${activeFaq === idx ? 'bg-accent scale-110 rotate-12' : 'bg-white group-hover:scale-105 group-hover:-rotate-6'}`}>
                            <span className="text-black text-sm font-black">?</span>
                          </div>
                          <span className={`transition-colors duration-300 ${activeFaq === idx ? 'text-foreground' : 'text-foreground/70 group-hover:text-foreground'}`}>{item.q}</span>
                        </h3>
                        <motion.div
                          animate={{ rotate: activeFaq === idx ? 180 : 0, scale: activeFaq === idx ? 1.2 : 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="shrink-0 ml-4"
                        >
                          <ChevronDown className={`w-6 h-6 transition-colors duration-300 ${activeFaq === idx ? 'text-accent' : 'text-foreground/30'}`} />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {activeFaq === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                          >
                            <div className="px-6 pb-6 pt-0">
                              <div className="pl-10 border-l-4 border-accent relative">
                                <div className="absolute -left-[12px] top-0 w-6 h-6 bg-accent rounded-full border-2 border-foreground shadow-pop" />
                                <p className="text-foreground/80 font-medium leading-relaxed text-base md:text-lg pt-2">
                                  {item.a}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 px-6 relative overflow-hidden bg-foreground/5">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-dot-grid opacity-10 -z-10" />
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-4 tracking-tighter">
                    {t.testimonials.title}
                  </h2>
                  <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
                    {t.testimonials.subtitle}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {t.testimonials.items.map((item, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white p-8 rounded-2xl border-2 border-foreground shadow-pop hover:shadow-pop-lg transition-all duration-300"
                    >
                      <div className="mb-6">
                        <p className="text-foreground/80 font-medium leading-relaxed text-base">
                          "{item.quote}"
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.avatar} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-foreground"
                        />
                        <div>
                          <h4 className="font-bold text-foreground">{item.name}</h4>
                          <p className="text-foreground/60 text-sm">{item.role}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Case Studies Section */}
            <section className="py-16 px-6 relative overflow-hidden bg-foreground/5">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-dot-grid opacity-10 -z-10" />
              <div className="max-w-6xl mx-auto">

                <div className="flex flex-wrap gap-4 justify-center items-center py-8">
                  {t.caseStudies.logos.map((logo, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05, duration: 0.5 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex items-center justify-center h-24 min-w-[180px]"
                    >
                      <img 
                        src={logo} 
                        alt={`Client logo ${idx + 1}`} 
                        className="h-16 w-auto object-contain grayscale"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Waitlist Section */}
            <section id="waitlist" className="py-16 px-6 relative overflow-hidden bg-foreground text-background">
              {/* Starry background */}
              <div className="absolute inset-0 -z-10">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 3,
                      repeat: Infinity,
                      delay: Math.random() * 5,
                    }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 bg-accent/5 -z-10" />
              <div className="max-w-2xl mx-auto text-center relative z-10 px-4">
                <div className="flex items-center justify-center mx-auto mb-6">
                  <img src="/img/logo_light.png" alt="VibeFello Logo" className="h-14 w-auto object-contain" />
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-4 tracking-tighter text-white">
                  {t.waitlist.title}
                </h2>
                <p className="text-base md:text-lg text-background/60 mb-6 max-w-xl mx-auto font-medium" dangerouslySetInnerHTML={{ __html: t.waitlist.desc }} />

                <form 
                  onSubmit={(e) => handleSubmit(e, 'waitlist')} 
                  className="bg-white p-6 md:p-8 rounded-[2rem] text-left border border-foreground shadow-pop-lg relative text-foreground max-w-md mx-auto"
                >
                  {/* Decorative sticker on form */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent rounded-full border border-foreground flex items-center justify-center shadow-pop rotate-12 font-display font-black text-black text-center leading-none text-xs p-2 z-10">
                    LIMITED SLOTS!
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 ml-2">
                        {t.waitlist.emailLabel}
                      </label>
                      <div className="relative">
                        <input 
                          required
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError(null);
                          }}
                          onBlur={() => {
                            if (email && !validateEmail(email)) {
                              setEmailError(t.validation.emailInvalid);
                            }
                          }}
                          placeholder={t.waitlist.placeholderEmail}
                          className={`w-full px-4 py-3 rounded-xl bg-muted border ${emailError ? 'border-red-500' : 'border-foreground/10'} focus:border-accent outline-none transition-bounce font-bold placeholder:text-foreground/30 shadow-sm`}
                        />
                        {emailError && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -bottom-5 left-2 text-[10px] font-black text-red-500 uppercase tracking-wider"
                          >
                            {emailError}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="candy-button w-full py-4 text-lg"
                  >
                    {isSubmitting ? (
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {t.waitlist.submit}
                        <div className="ml-3 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <ArrowRight className="w-5 h-5 text-accent" strokeWidth={3} />
                        </div>
                      </>
                    )}
                  </button>
                  {error && <p className="mt-4 text-red-500 text-center font-black uppercase tracking-widest text-sm">{error}</p>}
                </form>
              </div>
            </section>
            {/* Footer */}
            <footer className="py-12 px-6 border-t border-foreground/5 bg-white relative overflow-hidden">
              <div className="absolute inset-0 bg-dot-grid opacity-5 pointer-events-none" />
              <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center transition-all">
                  <img 
                    src="/img/logo.png" 
                    alt="VibeFello" 
                    className="h-6 w-auto object-contain" 
                  />
                </div>
                
                <div className="text-[10px] font-black text-foreground/30 tracking-[0.3em] uppercase text-center md:text-right">
                  {t.footer.copy}
                </div>

                <div className="flex items-center gap-4">
                  <a 
                    href="/privacy.html"
                    className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors"
                  >
                    {t.footer.privacy}
                  </a>
                  <a 
                    href="/terms.html"
                    className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors"
                  >
                    {t.footer.terms}
                  </a>
                  {[
                    { icon: Twitter, href: "https://x.com/vibefello" },
                    { icon: Github, href: "https://github.com/rickysvp/vibefello" }
                  ].map((social, i) => ( social.icon && (
                    <a 
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 bg-white border border-foreground/10 rounded-full flex items-center justify-center shadow-sm hover:bg-accent hover:border-foreground transition-all"
                    >
                      <social.icon className="w-4 h-4 text-foreground" strokeWidth={2.5} />
                    </a>
                  )))}
                </div>
              </div>
            </footer>
          </>
        )}
      </main>
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 z-[9999]">
          <motion.div 
            initial={false}
            animate={{ width: emailStatus ? 'auto' : 'auto' }}
            className="bg-white border-2 border-foreground rounded-2xl shadow-pop p-4 flex flex-col gap-3 min-w-[200px]"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Developer Panel</div>
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => {
                  setPaymentStatus('success');
                  setShowConversion(true);
                  setSubmittedEmail(heroEmail || 'rickysvp@gmail.com');
                  fetch('/api/member-count')
                    .then(res => res.json())
                    .then(data => setMemberCount(data.count))
                    .catch(() => setMemberCount(42));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-2 bg-muted border border-foreground/10 rounded-lg text-[10px] font-black uppercase tracking-tighter text-foreground/60 hover:text-accent hover:border-accent transition-all text-left flex items-center justify-between"
              >
                Test Success Page
                <ArrowRight className="w-3 h-3" />
              </button>

              <button 
                onClick={() => {
                  const webhookUrl = `${window.location.origin}/api/webhook`;
                  navigator.clipboard.writeText(webhookUrl);
                  setEmailStatus({ type: 'success', message: 'URL Copied!' });
                  setTimeout(() => setEmailStatus(null), 3000);
                }}
                className="px-3 py-2 bg-muted border border-foreground/10 rounded-lg text-[10px] font-black uppercase tracking-tighter text-foreground/60 hover:text-accent hover:border-accent transition-all text-left"
              >
                Copy Webhook URL
              </button>
            </div>

            {emailStatus && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`text-[10px] font-bold uppercase tracking-widest pt-2 border-t border-foreground/5 ${
                  emailStatus.type === 'success' ? 'text-emerald' : 
                  emailStatus.type === 'error' ? 'text-destructive' : 'text-foreground/40'
                }`}
              >
                {emailStatus.message}
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
