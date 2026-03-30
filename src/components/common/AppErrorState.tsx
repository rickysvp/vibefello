type AppErrorStateProps = {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function AppErrorState({
  title = 'Something went wrong',
  message,
  actionLabel,
  onAction,
}: AppErrorStateProps) {
  return (
    <div role="alert" className="flex min-h-[240px] items-center justify-center px-6 py-12">
      <div className="max-w-sm rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-red-950">{title}</h2>
        <p className="mt-2 text-sm text-red-800">{message}</p>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
