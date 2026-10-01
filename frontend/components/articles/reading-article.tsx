"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bookmark, Check, Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ArticleBody } from "./article-content";
import { ArticleCard } from "./article-card";
import {
    toCard,
    usePrototype,
    usePublishedCards,
} from "@/lib/types/prototype-store";

type ReadingArticleProps = {
    slug: string;
};

export function ReadingArticle({ slug }: ReadingArticleProps) {
    const { articles, users, hydrated } = usePrototype();

    const publishedArticles = usePublishedCards();

    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);

    const storedArticle = articles.find(
        (article) => article.slug === slug && article.status === "Published",
    );

    if (!storedArticle) {
        return hydrated ? (
            <section className="public-container listing-page">
                {" "}
                <div className="eyebrow accent-eyebrow">NOT AVAILABLE </div>
                <div className="listing-heading">
                    <h1>
                        Story not found
                        <span className="heading-period">.</span>
                    </h1>

                    <p>It may not be published yet, or the link has changed.</p>
                </div>
                <Link href="/articles" className="text-link">
                    Browse all articles
                    <ArrowRight size={16} />
                </Link>
            </section>
        ) : null;
    }

    const article = toCard(storedArticle, users);

    const relatedArticles = publishedArticles
        .filter((item) => item.slug !== article.slug)
        .slice(0, 2);

    async function handleCopyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href);

            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 2500);
        } catch {
            setCopied(false);
        }
    }

    return (
        <>
            {" "}
            <article>
                {" "}
                <div className="reading-head">
                    {" "}
                    <Link href="/articles" className="back-link">
                        {" "}
                        <ArrowLeft size={15} />
                        All articles{" "}
                    </Link>
                    <div className="eyebrow accent-eyebrow">
                        {article.category}
                        <span className="reading-separator">/</span>
                        FOLIO JOURNAL
                    </div>
                    <h1>
                        {article.title}
                        <span className="heading-period">.</span>
                    </h1>
                    <p className="reading-description">{article.description}</p>
                    <div className="reading-byline">
                        <span className="author-avatar">
                            {article.author
                                .split(" ")
                                .map((name) => name[0])
                                .join("")}
                        </span>

                        <div>
                            <strong>{article.author}</strong>

                            <span>
                                {article.date}
                                <span className="meta-dot">·</span>
                                {article.readTime}
                            </span>
                        </div>

                        <div className="reading-actions">
                            <Button
                                variant="outline"
                                size="icon"
                                title={
                                    saved
                                        ? "Remove bookmark"
                                        : "Bookmark article"
                                }
                                aria-label={
                                    saved
                                        ? "Remove bookmark"
                                        : "Bookmark article"
                                }
                                aria-pressed={saved}
                                onClick={() => setSaved((current) => !current)}
                            >
                                <Bookmark
                                    fill={saved ? "currentColor" : "none"}
                                />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                title="Copy article link"
                                aria-label="Copy article link"
                                onClick={handleCopyLink}
                            >
                                {copied ? <Check /> : <Link2 />}
                            </Button>
                        </div>
                    </div>
                    {copied && (
                        <div role="status" className="copy-feedback">
                            Link copied to clipboard
                        </div>
                    )}
                </div>
                <div className="reading-cover">
                    <Image
                        src={article.image}
                        alt="Editorial photograph accompanying the article"
                        width={1536}
                        height={1024}
                        priority
                    />
                </div>
                <div className="reading-body">
                    <ArticleBody content={storedArticle.content} />

                    {storedArticle.tags.length > 0 && (
                        <div className="article-tags">
                            <span>Filed under</span>

                            {storedArticle.tags.map((tag) => (
                                <span key={tag} className="tag">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </article>
            {relatedArticles.length > 0 && (
                <section className="reading-related public-container">
                    <div className="section-heading">
                        <h2>Keep reading</h2>

                        <Link href="/articles" className="text-link">
                            All articles
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="article-grid related-grid">
                        {relatedArticles.map((relatedArticle) => (
                            <ArticleCard
                                key={relatedArticle.slug}
                                article={relatedArticle}
                                compact
                            />
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
