import { Link } from "react-router-dom";
import { BRANDS } from "../../data/vehicles";

/* Brand ticker — pure type between hairlines. Pauses on hover. */
export default function Ticker() {
  const items = [...BRANDS.map((b) => b.name), "Verified Acquisitions", "Concierge Delivery"];
  const row = (key: string) => (
    <ul key={key} aria-hidden="true" className="ticker__row list-none">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-16 whitespace-nowrap">
          <span className="font-display text-[13px] font-semibold uppercase tracking-[0.24em] text-ash">
            {item}
          </span>
          <span className="size-[3px] rounded-full bg-[#3d3d3a]" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="ticker border-y border-line bg-void py-3.5" role="presentation">
      <div className="flex w-max">
        {row("a")}
        {row("b")}
      </div>
      <ul className="sr-only">
        {BRANDS.map((b) => (
          <li key={b.name}>
            <Link to={`/collection?brand=${encodeURIComponent(b.name)}`}>{b.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
