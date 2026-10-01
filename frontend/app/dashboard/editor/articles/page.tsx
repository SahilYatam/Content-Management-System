import type { Metadata } from "next";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EditorArticlesList } from "@/components/dashboard/editor/editor-articles-list";

export const metadata: Metadata = {
    title: "My Articles — Folio",
    description:
        "Drafts, reviews, and published stories in your Folio workspace.",
    openGraph: {
        title: "My Articles — Folio",
        description:
            "Drafts, reviews, and published stories in your Folio workspace.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
    },
};

export default function MyArticlesPage() {
    return (
        <DashboardLayout role="Editor" title="My articles">
            <EditorArticlesList />
        </DashboardLayout>
    );
}
