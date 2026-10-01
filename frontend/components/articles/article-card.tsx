import Image from "next/image";
import Link from "next/link";

import type { CardArticle } from "@/lib/types/mock-content";

interface ArticleCardProps {
    article: CardArticle;
    compact?: boolean;
}

export function ArticleCard({ article, compact = false }: ArticleCardProps) {
    return (
        <Link
            href={`/articles/${article.slug}`}
            className={`article-card${compact ? " article-card-compact" : ""}`}
        >
            {" "}
            <div className="article-card-image">
                {" "}
                <Image
                    src={article.image}
                    alt=""
                    loading="lazy"
                    width={1200}
                    height={900}
                />{" "}
            </div>
            <div className="article-card-copy">
                <span className="eyebrow accent-eyebrow">
                    {article.category}
                </span>

                <h3>{article.title}</h3>

                <p>{article.description}</p>

                <div className="article-meta">
                    <span>By {article.author}</span>
                    <span className="meta-dot">·</span>
                    <span>{article.readTime}</span>
                </div>
            </div>
        </Link>
    );
}
