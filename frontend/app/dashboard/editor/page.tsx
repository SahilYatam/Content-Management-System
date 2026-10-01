import type { Metadata } from "next";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EditorDashboard } from "@/components/dashboard/editor/editor-dashboard";

export const metadata: Metadata = {
    title: "Editor Dashboard — Folio",
    description:
        "An editorial overview of drafts, reviews, and published stories on Folio.",
    openGraph: {
        title: "Editor Dashboard — Folio",
        description:
            "An editorial overview of drafts, reviews, and published stories on Folio.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
    },
};

export default function EditorDashboardPage() {
    return (
        <DashboardLayout role="Editor" title="Editorial overview">
            <EditorDashboard />
        </DashboardLayout>
    );
}
