import Link from "next/link";

interface PublicBrandProps {
  inverse?: boolean;
}

export function PublicBrand({ inverse = false }: PublicBrandProps) {
  return (
    <Link
      href="/"
      className={`brand-mark${inverse ? " brand-mark-inverse" : ""}`}
      aria-label="Folio home"
    >
      folio<span className="brand-dot">.</span>
    </Link>
  );
}
