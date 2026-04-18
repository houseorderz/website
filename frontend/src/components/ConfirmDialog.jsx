export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[199] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[1px]"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="confirm-dialog-title"
          className="text-lg font-bold tracking-tight text-zinc-900"
        >
          {title}
        </h2>
        <p id="confirm-dialog-desc" className="mt-2 text-sm leading-relaxed text-zinc-600">
          {message}
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={[
              'rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2',
              danger
                ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500/40'
                : 'bg-zinc-900 hover:bg-zinc-800 focus-visible:ring-zinc-900/40',
            ].join(' ')}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
