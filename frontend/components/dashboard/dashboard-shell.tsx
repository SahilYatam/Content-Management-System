"use client";

import { useState, type ReactNode } from "react";

import {
    MEMBER_ID,
    useActiveEditor,
    usePrototype,
} from "@/lib/types/prototype-store";

import { DashboardRole } from "@/components/dashboard/dashboard-layout";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";

interface DashboardShellProps {
    role: DashboardRole;
    title: string;
    eyebrow?: string;
    children: ReactNode;
}

interface WorkspacePerson {
    name: string;
    initials: string;
}

const getWorkspacePerson = (
    role: DashboardRole,
    users: ReturnType<typeof usePrototype>["users"],
    editor: ReturnType<typeof useActiveEditor>,
): WorkspacePerson => {
    const user =
        role === "Member"
            ? users.find((user) => user.id === MEMBER_ID)
            : role === "Editor"
              ? editor
              : users.find((user) => user.role === "Admin");

    if (!user) {
        throw new Error(`Unable to find workspace user for role: ${role}`);
    }

    return {
        name: user.name,
        initials: user.initials,
    };
};

export function DashboardShell({
    role,
    title,
    eyebrow,
    children,
}: DashboardShellProps) {
    const { users } = usePrototype();
    const editor = useActiveEditor();

    const person = getWorkspacePerson(role, users, editor);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [tabletOpen, setTabletOpen] = useState(false);

    const closeMobileSidebar = () => setMobileOpen(false);
    const closeTabletSidebar = () => setTabletOpen(false);

    return (
        <div className="app-layout">
            {" "}
            <DashboardSidebar role={role} person={person} />
            {tabletOpen && (
                <>
                    <div
                        className="sidebar-scrim tablet-scrim"
                        onClick={closeTabletSidebar}
                    />

                    <DashboardSidebar
                        role={role}
                        person={person}
                        variant="tablet"
                        onNavigate={closeTabletSidebar}
                    />
                </>
            )}
            {mobileOpen && (
                <>
                    <div
                        className="sidebar-scrim"
                        onClick={closeMobileSidebar}
                    />

                    <DashboardSidebar
                        role={role}
                        person={person}
                        variant="mobile"
                        onNavigate={closeMobileSidebar}
                        onClose={closeMobileSidebar}
                    />
                </>
            )}
            <div className="app-main">
                <DashboardTopbar
                    role={role}
                    title={title}
                    person={person}
                    onOpenTabletSidebar={() => setTabletOpen(true)}
                    onOpenMobileSidebar={() => setMobileOpen(true)}
                />

                <main className="app-content">
                    <div className="dashboard-container">
                        <div className="page-heading">
                            <div>
                                <div className="eyebrow">
                                    {eyebrow ??
                                        `${role.toUpperCase()} WORKSPACE`}
                                </div>

                                <h1>{title}</h1>
                            </div>

                            <span className="page-date">
                                Interactive prototype
                            </span>
                        </div>

                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
