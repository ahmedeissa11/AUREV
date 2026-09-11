import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link, type To } from "react-router-dom";
import { IconArrowRight } from "../ui/icons";

/* ------------------------------------------------------------------ */
/*  Button — one component, four renderings. `to` turns it into a     */
/*  router link; `href` into a plain anchor.                          */
/* ------------------------------------------------------------------ */

type Variant = "primary" | "ghost" | "line";

interface CommonProps {
  variant?: Variant;
  size?: "md" | "sm";
  arrow?: boolean;
  children: ReactNode;
  className?: string;
}

const buttonCls = (p: CommonProps) =>
  [
    p.variant === "line" ? "btn-line" : `btn btn-${p.variant ?? "primary"}`,
    p.size === "sm" ? "btn-sm" : "",
    p.className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

const Inner = ({ children, arrow }: { children: ReactNode; arrow?: boolean }) => (
  <>
    <span>{children}</span>
    {arrow && <IconArrowRight size={15} className="btn-arrow" />}
  </>
);

export const Button = forwardRef<
  HTMLButtonElement,
  CommonProps & ButtonHTMLAttributes<HTMLButtonElement>
>(function Button({ children, className, variant, size, arrow, ...rest }, ref) {
  return (
    <button
      ref={ref}
      className={buttonCls({ children, className, variant, size, arrow })}
      {...rest}
    >
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
});

export function ButtonLink({
  to,
  children,
  className,
  variant,
  size,
  arrow,
  state,
  ...rest
}: CommonProps & { to: To; state?: unknown } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "state">) {
  return (
    <Link to={to} state={state} className={buttonCls({ children, className, variant, size, arrow })} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  );
}
