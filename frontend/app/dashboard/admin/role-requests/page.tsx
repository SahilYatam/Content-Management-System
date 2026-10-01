import type { Metadata } from "next";

import { RoleRequests } from "@/components/dashboard/admin/role-requests";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export const metadata: Metadata = {
    title: "Role Requests — Folio",
    description: "Approve, reject, or revoke editor access requests on Folio.",
    openGraph: {
        title: "Role Requests — Folio",
        description:
            "Approve, reject, or revoke editor access requests on Folio.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
    },
};

export default function RoleRequestsPage() {
    return (
        <DashboardLayout role="Admin" title="Role requests">
            <RoleRequests />
        </DashboardLayout>
    );
}
