import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import type { CardArticle } from "@/lib/types/mock-content";

type StatProps = {
    label: string;
    value: string;
    detail?: string;
    icon?: ReactNode;
};

export function Stat({ label, value, detail, icon }: StatProps) {
    return (
        <div className="stat-item">
            {" "}
            <div className="stat-top">
                {" "}
                <span>{label}</span>
                {icon && <span className="stat-icon">{icon}</span>}
            </div>
            <strong>{value}</strong>
            {detail && <small>{detail}</small>}
        </div>
    );
}

type DashboardSectionProps = {
    title: string;
    subtitle?: string;
    action?: string;
    href?: "/articles" | "/";
};

export function DashboardSection({
    title,
    subtitle,
    action,
    href,
}: DashboardSectionProps) {
    return (
        <div className="dash-section-heading">
            {" "}
            <div>
                {" "}
                <h2>{title}</h2>
                {subtitle && <p>{subtitle}</p>}
            </div>
            {action && href && (
                <Link href={href} className="text-link">
                    {action}
                    <ArrowRight size={15} />
                </Link>
            )}
        </div>
    );
}

type StatusProps = {
    value: string;
};

export function Status({ value }: StatusProps) {
    const statusClass = value.toLowerCase().replaceAll(" ", "-");

    return (
        <span className={`status status-${statusClass}`}>
            {" "}
            <span />
            {value}{" "}
        </span>
    );
}

type MiniArticleProps = {
    article: CardArticle;
    number?: string;
};

export function MiniArticle({ article, number }: MiniArticleProps) {
    return (
        <Link href={`/articles/${article.slug}`} className="mini-article">
            {number && <span className="mini-number">{number} </span>}

            <Image
                src={article.image}
                alt=""
                loading="lazy"
                width={1200}
                height={900}
            />

            <div>
                <span className="eyebrow accent-eyebrow">
                    {article.category}

                    <span className="muted-dot">·</span>

                    {article.readTime}
                </span>

                <h3>{article.title}</h3>

                <p>{article.description}</p>
            </div>

            <ArrowUpRight size={18} className="mini-arrow" />
        </Link>
    );
}

export { DashboardSection as DashSection };
