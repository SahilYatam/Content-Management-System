import type { Metadata } from "next";

import { ArticlesListing } from "@/components/articles/articles-listing";
import {
    PublicFooter,
    PublicHeader,
} from "@/components/public-components/public-layout";

export const metadata: Metadata = {
    title: "All Articles — Folio",
    description:
        "Explore thoughtful writing on design, culture, ideas, and perspective at Folio.",
    openGraph: {
        title: "All Articles — Folio",
        description:
            "Explore thoughtful writing on design, culture, ideas, and perspective at Folio.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
    },
};

type ArticlesPageProps = {
    searchParams: Promise<{
        category?: string | string[];
    }>;
};

export default async function ArticlesPage({
    searchParams,
}: ArticlesPageProps) {
    const params = await searchParams;

    const category = Array.isArray(params.category)
        ? params.category[0]
        : params.category;

    return (
        <div className="public-site">
            {" "}
            <PublicHeader />
            <main className="public-container listing-page">
                <ArticlesListing category={category} />
            </main>
            <PublicFooter />
        </div>
    );
}
