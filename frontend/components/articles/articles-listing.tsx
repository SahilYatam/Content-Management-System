"use client";

import Link from "next/link";

import { ArticleCard } from "./article-card";
import { usePublishedCards } from "@/lib/types/prototype-store";

const FILTER_OPTIONS = [
    "All",
    "Design",
    "Culture",
    "Ideas",
    "Perspective",
] as const;

type ArticleCategory = (typeof FILTER_OPTIONS)[number];

type ArticlesListingProps = {
    category?: string;
};

export function ArticlesListing({ category }: ArticlesListingProps) {
    const articles = usePublishedCards();

    const activeCategory: ArticleCategory =
        category && FILTER_OPTIONS.includes(category as ArticleCategory)
            ? (category as ArticleCategory)
            : "All";

    const visibleArticles =
        activeCategory === "All"
            ? articles
            : articles.filter((article) => article.category === activeCategory);

    return (
        <>
            {" "}
            <div className="eyebrow accent-eyebrow">THE FOLIO ARCHIVE </div>
            <div className="listing-heading">
                <h1>
                    {activeCategory}
                    <span className="heading-period">.</span>
                </h1>

                <p>Thoughtful writing for the endlessly curious.</p>
            </div>
            <nav className="listing-filter" aria-label="Filter articles">
                {FILTER_OPTIONS.map((item) => {
                    const isActive = activeCategory === item;

                    const href =
                        item === "All"
                            ? "/articles"
                            : `/articles?category=${encodeURIComponent(item)}`;

                    return (
                        <Link
                            key={item}
                            href={href}
                            className={isActive ? "filter-active" : undefined}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {item}
                        </Link>
                    );
                })}
            </nav>
            {visibleArticles.length === 0 && (
                <p className="page-subtitle">
                    No stories in this category yet.
                </p>
            )}
            <div className="article-grid listing-grid">
                {visibleArticles.map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                ))}
            </div>
        </>
    );
}
