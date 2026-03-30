import React from 'react';
import { VibeLogo } from '../common';
import { FileText, BookOpen, Mail, Send } from 'lucide-react';

// X (Twitter) Logo Component
const XLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: '专家入驻', href: '/expert-landing' },
      { label: '成功案例', href: '/cases' },
    ],
    resources: [
      { label: '帮助中心', href: '/help', icon: FileText },
      { label: '技术博客', href: '/blog', icon: BookOpen },
    ],
    company: [
      { label: '关于我们', href: '/about' },
      { label: '联系我们', href: 'mailto:feedback@vibefello.com' },
    ],
    legal: [
      { label: '服务条款', href: '/terms' },
      { label: '隐私政策', href: '/privacy' },
    ],
  };

  const socialLinks = [
    { label: 'X', href: 'https://x.com/vibefello', Icon: XLogo },
    { label: 'Telegram', href: 'https://t.me/+H3SnvF92Twc3YTI9', Icon: Send },
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-3 mb-6">
              <VibeLogo className="h-12" />
            </a>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
              VibeFello 是专业的 Vibe Coding 救援平台，连接非技术创始人与技术专家，让 AI 生成的代码真正上线运行。
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-md transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.Icon className="w-5 h-5" />
                </a>
              ))}
              {/* Email Icon */}
              <a
                href="mailto:feedback@vibefello.com"
                className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-md transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-5 text-sm uppercase tracking-wider">产品</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-indigo-600 transition-colors text-sm md:text-base"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-5 text-sm uppercase tracking-wider">资源</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-indigo-600 transition-colors text-sm md:text-base flex items-center gap-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-5 text-sm uppercase tracking-wider">公司</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-indigo-600 transition-colors text-sm md:text-base"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-5 text-sm uppercase tracking-wider">法律</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-indigo-600 transition-colors text-sm md:text-base"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-500 text-sm md:text-base">
              © {currentYear} VibeFello. 保留所有权利。
            </div>
            <div className="text-sm md:text-base text-slate-500">
              Made with ❤️ for Vibe Coders
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
