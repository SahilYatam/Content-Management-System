import type { Metadata } from "next";

import { AuditLog } from "@/components/dashboard/admin/audit-log";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export const metadata: Metadata = {
    title: "Audit Log — Folio",
    description: "A complete record of article and role changes across Folio.",
    openGraph: {
        title: "Audit Log — Folio",
        description:
            "A complete record of article and role changes across Folio.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
    },
};

export default function AuditLogPage() {
    return (
        <DashboardLayout role="Admin" title="Audit log">
            <AuditLog />
        </DashboardLayout>
    );
}
