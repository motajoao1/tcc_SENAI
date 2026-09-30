import type { ReactNode } from 'react';

const CONTROL_CLASS =
  'w-full min-h-[48px] rounded-xl border bg-white px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500';

export interface FieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
  maxLength?: number;
  required?: boolean;
  hint?: string;
  min?: string;
  max?: string;
  step?: string;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email';
}

export function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  maxLength,
  required,
  hint,
  min,
  max,
  step,
  inputMode,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
        {required && (
          <span className="text-red-600" aria-hidden>
            {' '}
            *
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        min={min}
        max={max}
        step={step}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`${CONTROL_CLASS} ${error ? 'border-red-400' : 'border-gray-200'}`}
        style={{ WebkitAppearance: 'none' }}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export interface TextAreaFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  rows?: number;
  required?: boolean;
  hint?: string;
}

export function TextAreaField({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  rows = 3,
  required,
  hint,
}: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
        {required && (
          <span className="text-red-600" aria-hidden>
            {' '}
            *
          </span>
        )}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`${CONTROL_CLASS} resize-none ${error ? 'border-red-400' : 'border-gray-200'}`}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  error,
  required,
  placeholder,
  hint,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
        {required && (
          <span className="text-red-600" aria-hidden>
            {' '}
            *
          </span>
        )}
      </label>
      <select
        id={id}
        value={value}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`${CONTROL_CLASS} ${error ? 'border-red-400' : 'border-gray-200'}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}
