"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { ArticleCard } from "@/components/articles/article-card";

import { usePublishedCards } from "@/lib/types/prototype-store";
import { SectionHeading } from "../section-heading";

const categories = ["Design", "Culture", "Ideas", "Perspective"];

export function HomepageContent() {
    const articles = usePublishedCards();
    const featuredArticle = articles[0];

    if (!featuredArticle) {
        return null;
    }

    return (
        <>
            {" "}
            <section className="home-intro public-container">
                {" "}
                <div className="eyebrow accent-eyebrow">
                    AN INDEPENDENT PUBLICATION <span className="intro-line" />
                    ISSUE NO. 01{" "}
                </div>
                <h1>
                    Ideas worth
                    <br />
                    <em>your time.</em>
                </h1>
                <p>
                    A considered space for stories that make you pause, think,
                    and see things differently.
                </p>
            </section>
            <section className="public-container home-feature">
                <Link
                    href={`/articles/${featuredArticle.slug}`}
                    className="feature-link"
                >
                    <div className="feature-image">
                        <Image
                            src={featuredArticle.image}
                            alt="Architectural concrete staircase in afternoon light"
                            width={1536}
                            height={1024}
                            priority
                        />
                    </div>

                    <div className="feature-caption">
                        <div>
                            <span className="eyebrow accent-eyebrow">
                                FEATURED STORY
                                <span className="caption-rule" />
                                {featuredArticle.category}
                            </span>

                            <h2>{featuredArticle.title}</h2>

                            <p>{featuredArticle.description}</p>

                            <div className="article-meta">
                                <span>By {featuredArticle.author}</span>

                                <span className="meta-dot">·</span>

                                <span>{featuredArticle.readTime}</span>
                            </div>
                        </div>

                        <span className="feature-arrow">
                            <ArrowUpRight size={22} />
                        </span>
                    </div>
                </Link>
            </section>
            <section className="public-container home-latest">
                <SectionHeading title="The latest" href="/articles" />

                <div className="article-grid">
                    {articles.slice(1, 4).map((article) => (
                        <ArticleCard key={article.slug} article={article} />
                    ))}
                </div>
            </section>
            <section className="category-band">
                <div className="public-container category-content">
                    <div>
                        <span className="eyebrow accent-eyebrow">
                            FIND YOUR INTEREST
                        </span>

                        <h2>Follow your curiosity.</h2>
                    </div>

                    <div className="category-list">
                        {categories.map((category, index) => (
                            <Link
                                key={category}
                                href={`/articles?category=${encodeURIComponent(category)}`}
                            >
                                <span>
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                {category}

                                <ArrowRight size={20} />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
