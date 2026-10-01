import type { Metadata } from "next";

import { ArticleForm } from "@/components/articles/article-editor-form";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export const metadata: Metadata = {
    title: "New Article — Folio",
    description: "Create and submit a new story for Folio.",
    openGraph: {
        title: "New Article — Folio",
        description: "Create and submit a new story for Folio.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
    },
};

export default function NewArticlePage() {
    return (
        <DashboardLayout role="Editor" title="New article">
            <ArticleForm />
        </DashboardLayout>
    );
}
