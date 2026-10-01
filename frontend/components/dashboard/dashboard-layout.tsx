import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export type DashboardRole = "Member" | "Editor" | "Admin";

interface DashboardLayoutProps {
    role: DashboardRole;
    title: string;
    eyebrow?: string;
    children: ReactNode;
}

export function DashboardLayout({
    role,
    title,
    eyebrow,
    children,
}: DashboardLayoutProps) {
    return (<DashboardShell role={role} title={title} eyebrow={eyebrow}>
        {children} </DashboardShell>
    );
}
