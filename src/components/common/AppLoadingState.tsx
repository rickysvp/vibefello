type AppLoadingStateProps = {
  message?: string;
};

export function AppLoadingState({ message = 'Loading...' }: AppLoadingStateProps) {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[240px] items-center justify-center px-6 py-12">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-current border-t-transparent" />
        <p className="text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
}
