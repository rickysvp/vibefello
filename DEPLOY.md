# VibeFello 上线部署指南

## 🚀 部署前检查清单

### 1. 环境配置
- [ ] Supabase 项目已创建
- [ ] 数据库 Schema 已执行
- [ ] 环境变量已配置
- [ ] 域名已准备

### 2. 功能测试
- [ ] 用户注册/登录
- [ ] 提交救援请求
- [ ] 专家抢单流程
- [ ] 实时聊天
- [ ] 支付流程

### 3. 安全设置
- [ ] RLS 策略已启用
- [ ] API 密钥已保护
- [ ] HTTPS 已配置

---

## 📋 部署步骤

### 步骤 1: Supabase 配置

1. 登录 https://app.supabase.com
2. 创建新项目
3. 执行数据库脚本:
   ```sql
   -- 在 Supabase SQL Editor 中执行 supabase/schema.sql
   ```

4. 获取项目凭证:
   - Project URL
   - Anon Key

### 步骤 2: 环境变量

创建 `.env.production`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 步骤 3: Vercel 部署

#### 方式 A: 通过 Vercel CLI
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

#### 方式 B: GitHub 集成 (推荐)
1. 推送代码到 GitHub
2. 登录 https://vercel.com
3. 导入项目
4. 配置环境变量
5. 自动部署

### 步骤 4: 配置自定义域名

1. 在 Vercel 项目设置中添加域名
2. 配置 DNS 记录
3. 等待 SSL 证书生成

---

## 🔧 生产环境优化

### 性能优化
- [ ] 启用 CDN
- [ ] 图片压缩
- [ ] 代码分割
- [ ] 懒加载

### SEO 优化
- [ ] 已配置 meta 标签
- [ ] 已添加结构化数据
- [ ] 已创建 sitemap
- [ ] 已配置 robots.txt

### 监控
- [ ] 配置错误监控 (Sentry)
- [ ] 配置性能监控
- [ ] 配置用户分析

---

## 📊 部署后验证

### 功能验证
```bash
# 运行测试
npm test

# 构建检查
npm run build
```

### 线上验证
- [ ] 首页加载正常
- [ ] 所有页面可访问
- [ ] 表单提交正常
- [ ] 支付流程正常
- [ ] 移动端适配

---

## 🆘 回滚方案

如果部署出现问题:
```bash
# Vercel 回滚到上一个版本
vercel rollback

# 或手动部署旧版本
git checkout <commit-hash>
vercel --prod
```

---

## 📞 联系方式

部署问题联系:
- 技术支持: support@vibefello.com
