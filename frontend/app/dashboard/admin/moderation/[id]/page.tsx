import type { Metadata } from "next";

import { ArticleReview } from "@/components/dashboard/admin/article-review";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export const metadata: Metadata = {
    title: "Review Article — Folio",
    description:
        "Review a submitted article and approve, request changes, or reject it.",
    openGraph: {
        title: "Review Article — Folio",
        description:
            "Review a submitted article and approve, request changes, or reject it.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
    },
};

type ArticleReviewPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ArticleReviewPage({
    params,
}: ArticleReviewPageProps) {
    const { id } = await params;

    return (
        <DashboardLayout role="Admin" title="Review article">
            <ArticleReview id={id} />
        </DashboardLayout>
    );
}
