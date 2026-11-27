import { Link } from "@tanstack/react-router";
import { Logo, NAV } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-navy text-navy-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-navy-muted">From Skills to Opportunities. From Potential to Progress.</p>
          <p className="mt-4 max-w-sm text-sm text-navy-muted">
            Supporting the initiative “Unlocking Displaced Talent: Pathways for Skilled Refugees”.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-teal">Explore</h2>
          <ul className="mt-4 grid gap-2 text-sm">
            {NAV.slice(1).map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-navy-muted hover:text-navy-foreground">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-teal">About this demo</h2>
          <p className="mt-4 text-sm text-navy-muted">
            This is a demonstration. Listings, mentors and figures are samples, and anything you enter is stored only in this browser. TalentBridge does not verify
            certificates, authorise employment or give legal advice.
          </p>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10">
        <div className="container-page py-5 text-sm text-navy-muted">© 2026 TalentBridge – Unlocking Displaced Talent</div>
      </div>
    </footer>
  );
}
