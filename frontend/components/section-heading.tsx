import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface SectionHeadingProps {
    title: string;
    href?: string;
    label?: string;
}

export function SectionHeading({
    title,
    href,
    label = "View all articles",
}: SectionHeadingProps) {
    return (
        <div className="section-heading">
            {" "}
            <h2>{title}</h2>
            {href && (
                <Link href={href} className="text-link">
                    {label}
                    <ArrowRight size={16} />
                </Link>
            )}
        </div>
    );
}
