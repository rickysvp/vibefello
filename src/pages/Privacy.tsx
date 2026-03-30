import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-4xl font-black text-slate-900 mb-8">隐私政策</h1>
        <div className="text-sm text-slate-500 mb-8">最后更新日期：2026年3月30日</div>
        
        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. 引言</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              VibeFello（"我们"或"平台"）重视您的隐私。本隐私政策说明我们如何收集、使用、存储和保护您的个人信息。
              使用我们的服务即表示您同意本政策的条款。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. 我们收集的信息</h2>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">2.1 您提供的信息</h3>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4 mb-4">
              <li>注册信息：姓名、邮箱地址、密码</li>
              <li>个人资料：头像、个人简介、技能标签</li>
              <li>支付信息：用于完成交易的必要信息</li>
              <li>沟通记录：您与其他用户的聊天记录</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-slate-800 mb-3">2.2 自动收集的信息</h3>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>设备信息：IP地址、浏览器类型、操作系统</li>
              <li>使用数据：访问时间、浏览页面、点击行为</li>
              <li>Cookies：用于改善用户体验和网站性能</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. 信息使用方式</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              我们使用您的信息用于以下目的：
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>提供、维护和改进平台服务</li>
              <li>处理交易和支付</li>
              <li>匹配用户与专家</li>
              <li>发送服务通知和更新</li>
              <li>防止欺诈和滥用</li>
              <li>遵守法律法规</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. 信息共享</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              我们不会出售您的个人信息。仅在以下情况下共享信息：
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>经您同意的情况下</li>
              <li>与服务提供商（如支付处理商、云服务）合作时</li>
              <li>为遵守法律义务或保护平台权益</li>
              <li>在合并、收购等商业交易中</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. 数据安全</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              我们采取多种安全措施保护您的信息：
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>使用 SSL/TLS 加密传输数据</li>
              <li>实施访问控制和身份验证</li>
              <li>定期进行安全审计</li>
              <li>数据备份和灾难恢复计划</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. 您的权利</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              您对个人信息拥有以下权利：
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>访问：查看我们持有的您的信息</li>
              <li>更正：更新不准确的信息</li>
              <li>删除：要求删除您的账户和数据</li>
              <li>限制：限制某些信息的使用</li>
              <li>导出：获取您的数据副本</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. 数据保留</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              我们仅在必要的时间内保留您的信息：
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>账户信息：保留至账户注销后 30 天</li>
              <li>交易记录：保留 5 年以满足法律要求</li>
              <li>日志数据：保留 90 天</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. 第三方服务</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              我们可能使用第三方服务（如 Supabase、支付网关），这些服务有自己的隐私政策。
              我们建议您阅读这些政策以了解他们如何处理您的数据。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. 儿童隐私</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              我们的服务不面向 13 岁以下儿童。如果我们发现收集了儿童的信息，
              将立即删除这些数据。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. 政策更新</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              我们可能会更新本隐私政策。重大变更将通过邮件或网站通知告知您。
              继续使用服务即表示您接受修订后的政策。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">联系我们</h2>
            <p className="text-slate-600 leading-relaxed">
              如有隐私相关问题，请联系：
              <a href="mailto:feedback@vibefello.com" className="text-indigo-600 hover:underline">
                feedback@vibefello.com
              </a>
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
