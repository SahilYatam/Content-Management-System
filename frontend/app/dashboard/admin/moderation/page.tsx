import type { Metadata } from "next";

import { ContentModeration } from "@/components/dashboard/admin/content-moderation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export const metadata: Metadata = {
    title: "Content Moderation — Folio",
    description:
        "Review submitted articles and decide what gets published on Folio.",
    openGraph: {
        title: "Content Moderation — Folio",
        description:
            "Review submitted articles and decide what gets published on Folio.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
    },
};

export default function ContentModerationPage() {
    return (
        <DashboardLayout role="Admin" title="Content moderation">
            <ContentModeration />
        </DashboardLayout>
    );
}
