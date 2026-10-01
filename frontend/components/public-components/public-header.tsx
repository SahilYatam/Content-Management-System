"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PublicBrand } from "./public-brand";

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="public-header">
      <div className="public-header-inner">
        <PublicBrand />

        <nav className="public-links" aria-label="Primary navigation">
          <Link
            href="/articles"
            className={pathname === "/articles" ? "nav-active" : undefined}
          >
            Articles
          </Link>
          <Link href="/dashboard/member">My space</Link>
        </nav>

        <div className="public-actions">
          <Button
            
            variant="outline"
            size="sm"
            className="public-dashboard-button"
          >
            <Link href="/dashboard/member">
              Go to dashboard
              <ArrowUpRight />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="public-mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="public-mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <Menu />
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          id="public-mobile-navigation"
          className="public-mobile-links"
          aria-label="Mobile navigation"
        >
          <Link href="/articles" onClick={closeMobileMenu}>
            Articles
          </Link>
          <Link href="/dashboard/member" onClick={closeMobileMenu}>
            My space
          </Link>
        </nav>
      )}
    </header>
  );
}
