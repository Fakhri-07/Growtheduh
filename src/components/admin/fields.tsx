import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Base = {
  name: string;
  label: string;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
};

function Label({ htmlFor, label, required }: { htmlFor: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="label">
      {label} {required && <span className="text-danger">*</span>}
    </label>
  );
}

export function TextField({
  name,
  label,
  hint,
  required,
  className,
  defaultValue,
  type = "text",
  placeholder,
  maxLength,
}: Base & { defaultValue?: string | number | null; type?: string; placeholder?: string; maxLength?: number }) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} required={required} />
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        maxLength={maxLength}
        className="input"
      />
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export function TextArea({
  name,
  label,
  hint,
  required,
  className,
  defaultValue,
  rows = 4,
  placeholder,
  maxLength,
}: Base & { defaultValue?: string | null; rows?: number; placeholder?: string; maxLength?: number }) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} required={required} />
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        maxLength={maxLength}
        className="input resize-y leading-relaxed"
      />
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export function Checkbox({
  name,
  label,
  hint,
  defaultChecked,
  className,
}: Omit<Base, "required"> & { defaultChecked?: boolean }) {
  return (
    <label className={cn("flex items-start gap-3 rounded-xl border border-line bg-white p-4", className)}>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 h-4 w-4 accent-brand" />
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}

export function Select({
  name,
  label,
  hint,
  required,
  className,
  defaultValue,
  options,
}: Base & { defaultValue?: string | null; options: { value: string; label: string }[] }) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} required={required} />
      <select id={id} name={name} defaultValue={defaultValue ?? ""} required={required} className="input">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <legend className="sr-only">{title}</legend>
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export const LINES_HINT = "Satu item per baris.";
