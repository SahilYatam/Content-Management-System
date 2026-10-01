import Link from "next/link";

import { PublicBrand } from "./public-brand";

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-footer-inner">
        <div>
          <PublicBrand />
          <p>Good stories make room for better thinking.</p>
        </div>

        <div className="footer-links">
          <Link href="/articles">All articles</Link>
          <Link href="/dashboard/member">Your space</Link>
          <span>© 2026 Folio</span>
        </div>
      </div>
    </footer>
  );
}
