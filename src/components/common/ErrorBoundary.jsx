import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-10 max-w-lg w-full text-center vibe-shadow">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
              出错了
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              应用遇到了意外错误，请尝试刷新页面。如果问题持续存在，请联系支持团队。
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 bg-vibe-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
