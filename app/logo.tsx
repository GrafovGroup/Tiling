// Reuse the original artwork; add a narrow gap between its emblem and wordmark.
export function Logo({ header = false }: { header?: boolean }) {
  return <span className={`logo-lockup${header ? " brand-logo" : ""}`} role="img" aria-label="Tiling.ca">
    <img className="logo-piece logo-emblem" src="/brand/tiling-herringbone-square-dot.png" alt="" aria-hidden="true" width="2170" height="573"/>
    <img className="logo-piece logo-wordmark" src="/brand/tiling-herringbone-square-dot.png" alt="" aria-hidden="true" width="2170" height="573"/>
  </span>;
}
