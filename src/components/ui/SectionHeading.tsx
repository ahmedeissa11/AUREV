import type { ReactNode } from "react";
import { Reveal } from "../../lib/motion";

/* ------------------------------------------------------------------ */
/*  SectionHeading — deliberately plain: eyebrow + sentence-case       */
/*  title + optional lead. No numbered chrome on every section.        */
/* ------------------------------------------------------------------ */

export function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <Reveal className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display-2 mt-5">{title}</h2>
        {lead && <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ash">{lead}</p>}
      </Reveal>
      {action && <div className="shrink-0 md:pb-1">{action}</div>}
    </div>
  );
}
