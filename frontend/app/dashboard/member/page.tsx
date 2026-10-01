import type { Metadata } from "next";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { MemberDashboard } from "@/components/dashboard/member/member-dashboard";

export const metadata: Metadata = {
    title: "Member Dashboard — Folio",
    description:
        "Your reading space on Folio: stories, saved articles, and reading activity.",
    openGraph: {
        title: "Member Dashboard — Folio",
        description:
            "Your reading space on Folio: stories, saved articles, and reading activity.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
    },
};

export default function MemberDashboardPage() {
    return (
        <DashboardLayout
            role="Member"
            title="Your reading space"
            eyebrow="YOUR READING SPACE"
        >
            <MemberDashboard />
        </DashboardLayout>
    );
}