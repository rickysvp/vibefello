# VibeFello 上线检查清单

## ✅ 上线前必须完成

### 1. Supabase 配置
- [ ] 创建 Supabase 项目 (https://app.supabase.com)
- [ ] 执行数据库 Schema (`supabase/schema.sql`)
- [ ] 配置 RLS 安全策略
- [ ] 获取 Project URL 和 Anon Key
- [ ] 配置邮件服务 (如需邮箱验证)

### 2. 环境变量
- [ ] 创建 `.env.production` 文件
- [ ] 配置 `VITE_SUPABASE_URL`
- [ ] 配置 `VITE_SUPABASE_ANON_KEY`
- [ ] 配置 Google Analytics (可选)
- [ ] 配置 Sentry (可选)

### 3. 域名 & SSL
- [ ] 购买域名 (推荐: vibefello.com)
- [ ] 配置 DNS 指向 Vercel
- [ ] 等待 SSL 证书自动颁发

### 4. 功能测试
- [ ] 用户注册流程
- [ ] 用户登录流程
- [ ] 提交救援请求
- [ ] 专家抢单流程
- [ ] 实时聊天功能
- [ ] 支付流程 (如已集成)

### 5. 性能优化
- [ ] 图片压缩
- [ ] 启用 CDN
- [ ] 代码分割检查
- [ ] Lighthouse 评分 > 90

### 6. SEO & 营销
- [ ] 提交 sitemap 到 Google
- [ ] 配置 Google Search Console
- [ ] 配置社交媒体分享
- [ ] 准备上线公告

---

## 🚀 部署步骤

### Step 1: 准备
```bash
# 确保代码已提交
git status
git add -A
git commit -m "v2.0.0: 准备上线"
git push
```

### Step 2: 部署到 Vercel
```bash
# 方式 1: 使用脚本
./scripts/deploy.sh production

# 方式 2: 手动部署
vercel --prod
```

### Step 3: 验证
- [ ] 访问生产环境 URL
- [ ] 检查所有页面
- [ ] 测试关键功能
- [ ] 检查移动端

---

## 📊 上线后监控

### 关键指标
- [ ] 页面加载时间 < 3s
- [ ] API 响应时间 < 500ms
- [ ] 错误率 < 1%
- [ ] 用户注册成功率 > 95%

### 监控工具
- [ ] Vercel Analytics
- [ ] Supabase Dashboard
- [ ] Google Analytics
- [ ] Sentry (错误追踪)

---

## 🆘 应急预案

### 如果出现问题:
1. **立即回滚**: `vercel rollback`
2. **检查日志**: Vercel Dashboard
3. **联系支持**: support@vercel.com

### 联系方式
- 技术负责人: [你的名字]
- 紧急联系: [电话]
- 备用邮箱: [邮箱]

---

## 🎉 上线成功标准

- [ ] 网站可正常访问
- [ ] 所有核心功能正常
- [ ] 无重大 Bug
- [ ] 用户可正常注册/登录
- [ ] 支付流程正常 (如适用)

**预计上线时间**: [填写日期]
**实际上线时间**: [填写日期]
**上线负责人**: [填写名字]
