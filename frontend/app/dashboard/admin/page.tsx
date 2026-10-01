import type { Metadata } from "next";

import { AdminDashboard } from "@/components/dashboard/admin/admin-dashboard";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export const metadata: Metadata = {
    title: "Admin Dashboard — Folio",
    description:
        "A clear view of people, content, requests, and activity across Folio.",
    openGraph: {
        title: "Admin Dashboard — Folio",
        description:
            "A clear view of people, content, requests, and activity across Folio.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
    },
};

export default function AdminDashboardPage() {
    return (
        <DashboardLayout
            role="Admin"
            title="Overview"
            eyebrow="ADMIN WORKSPACE"
        >
            <AdminDashboard />
        </DashboardLayout>
    );
}
