import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

/* ------------------------------------------------------------------ */
/*  Form fields — mono labels, hairline borders, crimson focus.       */
/*  Each field manages its own error/aria wiring for a11y.           */
/* ------------------------------------------------------------------ */

interface ShellProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children?: ReactNode;
  id: string;
}

function FieldShell({ label, error, hint, required, children, id }: ShellProps) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
        {required && <span aria-hidden="true" className="text-crimson-bright"> *</span>}
      </label>
      {children}
      {error ? (
        <span className="field__error" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="field__hint">{hint}</span>
      ) : null}
    </div>
  );
}

export function TextField({
  label,
  error,
  hint,
  ...rest
}: { label: string; error?: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const auto = useId();
  const id = rest.id ?? auto;
  return (
    <FieldShell label={label} error={error} hint={hint} required={rest.required} id={id}>
      <input
        id={id}
        className="field__input"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        {...rest}
      />
      {error && <span id={`${id}-err`} className="sr-only">{error}</span>}
    </FieldShell>
  );
}

export function TextArea({
  label,
  error,
  hint,
  ...rest
}: { label: string; error?: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const auto = useId();
  const id = rest.id ?? auto;
  return (
    <FieldShell label={label} error={error} hint={hint} required={rest.required} id={id}>
      <textarea
        id={id}
        rows={5}
        className="field__input resize-y"
        aria-invalid={error ? true : undefined}
        {...rest}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  error,
  options,
  hint,
  ...rest
}: {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  hint?: string;
} & SelectHTMLAttributes<HTMLSelectElement>) {
  const auto = useId();
  const id = rest.id ?? auto;
  return (
    <FieldShell label={label} error={error} hint={hint} required={rest.required} id={id}>
      <select id={id} className="field__input" aria-invalid={error ? true : undefined} {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#101010]">
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function CheckOption({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  count?: number;
}) {
  return (
    <label className="check justify-between text-[13px] font-medium tracking-wide text-ash transition hover:text-mist">
      <span className="flex items-center gap-3">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="check__box" aria-hidden="true" />
        <span className={checked ? "text-mist" : ""}>{label}</span>
      </span>
      {count != null && (
        <span className="font-mono text-[10px] text-dim">{String(count).padStart(2, "0")}</span>
      )}
    </label>
  );
}
