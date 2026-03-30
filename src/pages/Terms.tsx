import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-4xl font-black text-slate-900 mb-8">服务条款</h1>
        <div className="text-sm text-slate-500 mb-8">最后更新日期：2026年3月30日</div>
        
        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. 服务概述</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              VibeFello（以下简称"平台"）是一个连接非技术创始人与技术专家的服务平台。用户可以在平台上发布技术求助请求，
              专家可以提供服务并获得报酬。平台提供交易担保、沟通工具等服务支持。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. 用户注册</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              2.1 用户必须提供真实、准确的个人信息完成注册。
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              2.2 用户需年满18周岁，或在其法定监护人的监督下使用服务。
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              2.3 用户有责任保护账户安全，对账户下的所有活动负责。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. 服务流程</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              3.1 用户发布请求时需支付基础咨询费，具体金额根据问题复杂度确定，该费用用于获取专家的初步诊断。
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              3.2 专家提交方案后，用户可选择接受或拒绝。接受后需支付全额服务费用。
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              3.3 服务完成后，用户确认交付，平台将费用释放给专家。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. 费用与支付</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              4.1 平台收取一定比例的服务费，具体费率在交易前明确告知。
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              4.2 用户需在约定时间内完成支付，否则订单可能被取消。
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              4.3 退款政策：如专家未能在约定时间内交付，用户可申请全额退款。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. 专家服务标准</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              5.1 专家需具备相应的技术能力，提供真实、准确的个人资料。
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              5.2 专家应在约定时间内完成服务，保持与用户的良好沟通。
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              5.3 专家不得泄露用户的商业机密或代码资料。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. 知识产权</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              6.1 用户保留其代码和项目的全部知识产权。
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              6.2 专家在服务过程中产生的代码归用户所有，除非另有书面约定。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. 禁止行为</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              用户和专家均不得：
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>进行平台外交易，规避平台服务费</li>
              <li>发布虚假、误导性的信息</li>
              <li>从事违法、欺诈活动</li>
              <li>骚扰、攻击其他用户</li>
              <li>传播恶意软件或病毒</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. 责任限制</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              8.1 平台仅提供信息撮合服务，不对专家的服务质量做担保。
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              8.2 因用户自身原因（如提供错误信息）导致的损失，平台不承担责任。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. 争议解决</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              9.1 用户与专家之间的争议，首先应通过平台协商解决。
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              9.2 如协商不成，任何一方均可向平台申请仲裁。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. 条款修改</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              平台保留随时修改本条款的权利。修改后的条款将在平台上公布，继续使用服务即视为接受新条款。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">联系我们</h2>
            <p className="text-slate-600 leading-relaxed">
              如有任何问题，请发送邮件至：
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

export default Terms;
