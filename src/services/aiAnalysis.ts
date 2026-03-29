// AI 代码分析服务
// 模拟真实的大模型 API 调用

export interface CodeAnalysisResult {
  detectedIssues: Array<{
    severity: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    file?: string;
    line?: number;
    code?: string;
    suggestion?: string;
  }>;
  affectedFiles: number;
  estimatedTime: string;
  techStack: string[];
  confidence: number;
  codeQuality: number;
  securityScore: number;
  performanceIssues: string[];
  recommendations: string[];
  summary: string;
}

// 模拟从 GitHub 拉取代码
const fetchCodeFromGitHub = async (repoUrl: string, branch: string = 'main'): Promise<string> => {
  // 解析 GitHub URL
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    throw new Error('无效的 GitHub 链接');
  }
  
  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, '');
  
  // 模拟 API 调用延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 返回模拟的代码内容
  return `
// 模拟从 ${owner}/${cleanRepo} 拉取的代码
import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);
  
  // 问题 1: useEffect 缺少依赖项
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []); // 警告: 缺少依赖
  
  // 问题 2: SSR 环境下访问 window
  const width = window.innerWidth; // 错误: SSR 中 window 未定义
  
  // 问题 3: Hydration Mismatch
  return (
    <div>
      {typeof window !== 'undefined' && <ClientComponent />}
    </div>
  );
}

// 问题 4: 未使用的导入
import { unusedHelper } from './utils'; // 未使用

export default App;
`;
};

// 模拟 AI 大模型分析
const analyzeWithAI = async (code: string, fileName: string): Promise<Partial<CodeAnalysisResult>> => {
  // 模拟 AI 处理延迟
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 基于代码内容的真实分析
  const issues: CodeAnalysisResult['detectedIssues'] = [];
  
  // 检测 useEffect 依赖问题
  if (code.includes('useEffect') && code.includes('}, [])')) {
    const match = code.match(/useEffect\([^)]+\),\s*\[\]/);
    if (match && code.includes('setData')) {
      issues.push({
        severity: 'medium',
        title: 'useEffect 缺少依赖项',
        description: 'useEffect 中使用了 setData，但依赖数组为空，可能导致闭包问题',
        file: fileName,
        line: code.split('\n').findIndex(l => l.includes('useEffect')) + 1,
        code: 'useEffect(() => { ... }, [])',
        suggestion: '添加 [setData] 到依赖数组，或使用 useCallback 包装'
      });
    }
  }
  
  // 检测 SSR window 访问
  if (code.includes('window.') && !code.includes('typeof window !== \'undefined\'')) {
    const lines = code.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('window.') && !line.includes('typeof window')) {
        issues.push({
          severity: 'high',
          title: 'SSR 环境下访问 window 对象',
          description: '在服务端渲染期间直接访问 window 会导致 ReferenceError',
          file: fileName,
          line: idx + 1,
          code: line.trim(),
          suggestion: '使用 typeof window !== \'undefined\' 进行环境检查'
        });
      }
    });
  }
  
  // 检测 Hydration Mismatch
  if (code.includes('typeof window !== \'undefined\'') && code.includes('return')) {
    issues.push({
      severity: 'high',
      title: 'Hydration Mismatch 风险',
      description: '条件渲染 based on window 会导致服务端和客户端渲染结果不一致',
      file: fileName,
      line: code.split('\n').findIndex(l => l.includes('typeof window')) + 1,
      code: '{typeof window !== \'undefined\' && <Component />}',
      suggestion: '使用 useEffect + useState 延迟客户端组件渲染，或使用 suppressHydrationWarning'
    });
  }
  
  // 检测未使用的导入
  const importMatches = code.match(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"];?/g);
  if (importMatches) {
    importMatches.forEach(imp => {
      const match = imp.match(/import\s+{([^}]+)}\s+from/);
      if (match) {
        const importedItems = match[1].split(',').map(s => s.trim().split(' ')[0]);
        importedItems.forEach(item => {
          // 简单检查是否在代码中使用（排除导入语句本身）
          const codeWithoutImports = code.replace(/import\s+.*?from\s+['"][^'"]+['"];?\n?/g, '');
          if (!codeWithoutImports.includes(item)) {
            issues.push({
              severity: 'low',
              title: `未使用的导入: ${item}`,
              description: `导入了 ${item} 但在代码中未使用，增加 bundle 大小`,
              file: fileName,
              code: imp.trim(),
              suggestion: `删除未使用的导入: import { ${item} } ...`
            });
          }
        });
      }
    });
  }
  
  // 计算分数
  const highIssues = issues.filter(i => i.severity === 'high').length;
  const mediumIssues = issues.filter(i => i.severity === 'medium').length;
  const lowIssues = issues.filter(i => i.severity === 'low').length;
  
  const codeQuality = Math.max(0, 100 - highIssues * 15 - mediumIssues * 8 - lowIssues * 3);
  const securityScore = Math.max(0, 100 - highIssues * 20 - mediumIssues * 5);
  
  // 生成性能建议
  const performanceIssues: string[] = [];
  if (code.includes('useEffect') && code.includes('fetch')) {
    performanceIssues.push('建议在 useEffect 中使用 AbortController 避免内存泄漏');
  }
  if (!code.includes('React.memo') && code.includes('function')) {
    performanceIssues.push('考虑使用 React.memo 优化组件重渲染');
  }
  if (!code.includes('lazy') && code.includes('import')) {
    performanceIssues.push('对大型组件使用 React.lazy 进行代码分割');
  }
  
  // 生成推荐
  const recommendations: string[] = [];
  if (highIssues > 0) {
    recommendations.push('优先修复高严重级别问题，特别是 SSR 相关问题');
  }
  if (issues.some(i => i.title.includes('useEffect'))) {
    recommendations.push('使用 ESLint plugin react-hooks 自动检测依赖问题');
  }
  recommendations.push('添加 Error Boundary 组件捕获渲染错误');
  recommendations.push('考虑使用 TypeScript strict 模式提高代码质量');
  
  return {
    detectedIssues: issues,
    affectedFiles: 1,
    estimatedTime: `${Math.ceil(issues.length * 0.5)}-${Math.ceil(issues.length)} 小时`,
    techStack: ['React', 'TypeScript', 'Next.js'],
    confidence: Math.floor(85 + Math.random() * 10),
    codeQuality: Math.floor(codeQuality),
    securityScore: Math.floor(securityScore),
    performanceIssues,
    recommendations,
    summary: `发现 ${issues.length} 个问题：${highIssues} 个严重、${mediumIssues} 个中等、${lowIssues} 个轻微。建议优先修复 SSR 相关问题。`
  };
};

// 主分析函数
export const analyzeCode = async (
  gitUrl: string,
  branch: string = 'main',
  onProgress?: (step: number, message: string) => void
): Promise<CodeAnalysisResult> => {
  try {
    // Step 1: 连接仓库
    onProgress?.(0, '正在建立安全连接...');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Step 2: 拉取代码
    onProgress?.(1, '正在拉取代码...');
    const code = await fetchCodeFromGitHub(gitUrl, branch);
    
    // Step 3: 分析代码
    onProgress?.(2, 'AI 正在分析代码结构...');
    const result = await analyzeWithAI(code, 'src/App.tsx');
    
    // Step 4: 生成报告
    onProgress?.(4, '正在生成诊断报告...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return result as CodeAnalysisResult;
  } catch (error) {
    console.error('AI 分析失败:', error);
    throw error;
  }
};

// 模拟多文件分析
export const analyzeMultipleFiles = async (
  gitUrl: string,
  onProgress?: (step: number, message: string) => void
): Promise<CodeAnalysisResult> => {
  const files = ['src/App.tsx', 'src/components/Header.tsx', 'src/hooks/useAuth.ts'];
  const allIssues: CodeAnalysisResult['detectedIssues'] = [];
  
  for (let i = 0; i < files.length; i++) {
    onProgress?.(1 + i, `正在分析 ${files[i]}...`);
    const code = await fetchCodeFromGitHub(gitUrl);
    const result = await analyzeWithAI(code, files[i]);
    allIssues.push(...(result.detectedIssues || []));
  }
  
  return {
    detectedIssues: allIssues,
    affectedFiles: files.length,
    estimatedTime: `${Math.ceil(allIssues.length * 0.5)}-${allIssues.length} 小时`,
    techStack: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    confidence: Math.floor(90 + Math.random() * 8),
    codeQuality: Math.floor(75 + Math.random() * 15),
    securityScore: Math.floor(80 + Math.random() * 15),
    performanceIssues: [
      '图片缺少懒加载优化',
      '建议启用 React.memo 优化重渲染',
      'API 调用缺少缓存策略'
    ],
    recommendations: [
      '使用 dynamic import 延迟加载非关键组件',
      '实现错误边界处理 SSR 错误',
      '添加 SWR 或 React Query 管理服务端状态'
    ],
    summary: `共发现 ${allIssues.length} 个问题，建议优先修复高严重级别问题。`
  };
};
