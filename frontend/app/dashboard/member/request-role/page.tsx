import type { Metadata } from "next";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EditorAccessRequest } from "@/components/dashboard/member/editor-access-request";

export const metadata: Metadata = {
    title: "Request Editor Access — Folio",
    description:
        "Apply to become an editor and publish your own stories on Folio.",
    openGraph: {
        title: "Request Editor Access — Folio",
        description:
            "Apply to become an editor and publish your own stories on Folio.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
    },
};

export default function RequestEditorAccessPage() {
    return (
        <DashboardLayout
            role="Member"
            title="Request editor access"
            eyebrow="YOUR NEXT CHAPTER"
        >
            <EditorAccessRequest />
        </DashboardLayout>
    );
}