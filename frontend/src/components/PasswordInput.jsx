import { useState } from 'react'

const inputClass =
  'w-full rounded-xl border border-zinc-200 bg-white py-3 ps-4 pe-11 text-sm shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-500/10'

function EyeIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  )
}

export default function PasswordInput({
  id,
  label,
  name,
  autoComplete,
  required,
  minLength,
  value,
  onChange,
  placeholder,
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <label
        className="text-xs font-semibold text-zinc-700"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          name={name}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 end-0 flex w-11 items-center justify-center text-zinc-500 transition hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30 rounded-e-xl"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  )
}
