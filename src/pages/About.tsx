import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Target, Users, Zap, Shield } from 'lucide-react';

export const About: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: '使命',
      description: '让每位非技术创始人都能将 AI 生成的代码转化为可上线的产品，打破技术壁垒，加速创新落地。',
    },
    {
      icon: Users,
      title: '社区',
      description: '构建一个互助共赢的开发者社区，让经验丰富的专家与需要帮助的用户建立深度连接。',
    },
    {
      icon: Zap,
      title: '效率',
      description: '通过 AI 辅助诊断与专家精准匹配，将问题解决时间从数天缩短至数小时。',
    },
    {
      icon: Shield,
      title: '信任',
      description: '平台担保交易，确保双方权益，建立透明、公正的服务评价体系。',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
          >
            关于 VibeFello
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 leading-relaxed"
          >
            VibeFello 诞生于一个简单的观察：AI 让每个人都能写代码，但让代码真正上线运行仍然需要专业帮助。
            我们连接非技术创始人与资深开发者，让 Vibe Coding 的成果真正转化为可运行的产品。
          </motion.p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">我们的价值观</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">我们的故事</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed mb-6">
              2026年，随着 AI 编程工具的普及，越来越多的非技术创始人开始使用 ChatGPT、Claude 等工具构建产品原型。
              他们能够快速生成代码，但在部署、调试、优化环节却频频碰壁。
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              VibeFello 应运而生。我们创建了一个平台，让遇到技术瓶颈的创始人可以快速找到经验丰富的开发者，
              通过小额咨询费获得专业诊断，再根据情况选择是否进行深度技术服务。
            </p>
            <p className="text-slate-600 leading-relaxed">
              今天，VibeFello 已经帮助数百位创始人解决了技术难题，让他们的产品从"看起来不错"真正变成"可以上线"。
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">联系我们</h2>
          <p className="text-slate-600 mb-8">
            有任何问题或建议？欢迎通过邮件联系我们。
          </p>
          <a
            href="mailto:feedback@vibefello.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            feedback@vibefello.com
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
