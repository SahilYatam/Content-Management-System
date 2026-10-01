import type { Metadata } from "next";

import { ReadingArticle } from "@/components/articles/reading-article";

import { articles as seedArticles } from "@/lib/types/mock-content";
import { PublicHeader } from "@/components/public-components/public-header";
import { PublicFooter } from "@/components/public-components/public-footer";

type ArticlePageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({
    params,
}: ArticlePageProps): Promise<Metadata> {
    const { slug } = await params;

    const article = seedArticles.find((item) => item.slug === slug);

    const title = article ? `${article.title} — Folio` : "A story on Folio";

    const description =
        article?.description ||
        "Read thoughtful writing on design, culture, and ideas at Folio.";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
        },
    };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { slug } = await params;

    return (
        <div className="public-site">
            {" "}
            <PublicHeader />
            <main>
                <ReadingArticle slug={slug} />
            </main>
            <PublicFooter />
        </div>
    );
}
