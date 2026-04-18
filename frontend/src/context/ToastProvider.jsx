import { useCallback, useMemo, useState } from 'react'
import { ToastContext } from './toast-context.js'

function ToastIcon({ variant }) {
  if (variant === 'error') {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </span>
    )
  }
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  )
}

function ToastItem({ id, message, variant, onDismiss }) {
  const isError = variant === 'error'
  return (
    <div
      role="status"
      className={[
        'pointer-events-auto flex max-w-[min(100%,22rem)] items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg ring-1 transition',
        isError
          ? 'border-red-200/90 bg-white text-red-900 ring-red-500/10'
          : 'border-emerald-200/90 bg-white text-emerald-950 ring-emerald-500/10',
      ].join(' ')}
    >
      <ToastIcon variant={variant} />
      <p className="min-w-0 flex-1 pt-1 text-sm font-medium leading-snug">{message}</p>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        className="shrink-0 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
        aria-label="Dismiss"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const showToast = useCallback(
    ({ message, variant = 'success', duration = 4200 }) => {
      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `t-${Date.now()}-${Math.random()}`
      setToasts((t) => [...t, { id, message, variant }])
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration)
      }
      return id
    },
    [removeToast],
  )

  const value = useMemo(
    () => ({ showToast, removeToast }),
    [showToast, removeToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-0 end-0 z-[200] flex w-full max-w-md flex-col gap-2 p-4 sm:p-5"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-toast-in"
          >
            <ToastItem {...t} onDismiss={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
