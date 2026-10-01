"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BookOpen,
    Compass,
    FileCheck2,
    FilePen,
    FileText,
    LayoutDashboard,
    ScrollText,
    UserRoundPlus,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";


import { PublicBrand } from "../public-components/public-brand";

import type { DashboardRole } from "@/components/dashboard/dashboard-layout";

interface WorkspacePerson {
    name: string;
    initials: string;
}

interface DashboardSidebarProps {
    role: DashboardRole;
    person: WorkspacePerson;
    variant?: "desktop" | "tablet" | "mobile";
    onNavigate?: () => void;
    onClose?: () => void;
}

const dashboardRoutes: Record<DashboardRole, string> = {
    Member: "/dashboard/member",
    Editor: "/dashboard/editor",
    Admin: "/dashboard/admin",
};

const roles: DashboardRole[] = ["Member", "Editor", "Admin"];

function isActivePath(pathname: string, href: string, exact = false) {
    if (exact) {
        return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar({
    role,
    person,
    variant = "desktop",
    onNavigate,
    onClose,
}: DashboardSidebarProps) {
    const pathname = usePathname();

    const sidebarClassName =
        variant === "tablet"
            ? "app-sidebar tablet-sidebar"
            : variant === "mobile"
              ? "app-sidebar mobile-sidebar"
              : "app-sidebar";

    const linkClassName = (href: string, exact = false) =>
        `sidebar-link${
            isActivePath(pathname, href, exact) ? " sidebar-link-active" : ""
        }`;

    return (
        <aside className={sidebarClassName}>
            {variant === "mobile" && (
                <div className="mobile-close">
                    {" "}
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Close navigation"
                        onClick={onClose}
                    >
                        {" "}
                        <X />{" "}
                    </Button>{" "}
                </div>
            )}

            <div className="sidebar-top">
                <PublicBrand />
                <span className="sidebar-workspace">WORKSPACE</span>
            </div>

            <nav className="sidebar-nav" aria-label="Dashboard navigation">
                <span className="sidebar-label">YOUR SPACE</span>

                <Link
                    href={dashboardRoutes[role]}
                    className={linkClassName(dashboardRoutes[role], true)}
                    onClick={onNavigate}
                >
                    <LayoutDashboard size={18} />
                    Overview
                </Link>

                {role === "Editor" && (
                    <>
                        <Link
                            href="/dashboard/editor/articles"
                            className={linkClassName(
                                "/dashboard/editor/articles",
                                true,
                            )}
                            onClick={onNavigate}
                        >
                            <FileText size={18} />
                            My articles
                        </Link>

                        <Link
                            href="/dashboard/editor/articles/new"
                            className={linkClassName(
                                "/dashboard/editor/articles/new",
                            )}
                            onClick={onNavigate}
                        >
                            <FilePen size={18} />
                            New article
                        </Link>
                    </>
                )}

                {role === "Member" && (
                    <Link
                        href="/dashboard/member/request-role"
                        className={linkClassName(
                            "/dashboard/member/request-role",
                        )}
                        onClick={onNavigate}
                    >
                        <UserRoundPlus size={18} />
                        Request editor access
                    </Link>
                )}

                {role === "Admin" && (
                    <>
                        <Link
                            href="/dashboard/admin/moderation"
                            className={linkClassName(
                                "/dashboard/admin/moderation",
                            )}
                            onClick={onNavigate}
                        >
                            <FileCheck2 size={18} />
                            Content moderation
                        </Link>

                        <Link
                            href="/dashboard/admin/role-requests"
                            className={linkClassName(
                                "/dashboard/admin/role-requests",
                            )}
                            onClick={onNavigate}
                        >
                            <UserRoundPlus size={18} />
                            Role requests
                        </Link>

                        <Link
                            href="/dashboard/admin/audit"
                            className={linkClassName("/dashboard/admin/audit")}
                            onClick={onNavigate}
                        >
                            <ScrollText size={18} />
                            Audit log
                        </Link>
                    </>
                )}

                <span className="sidebar-label sidebar-label-spaced">
                    EXPLORE
                </span>

                <Link
                    href="/articles"
                    className={linkClassName("/articles")}
                    onClick={onNavigate}
                >
                    <Compass size={18} />
                    Discover articles
                </Link>

                <Link href="/" className="sidebar-link" onClick={onNavigate}>
                    <BookOpen size={18} />
                    Publication
                </Link>

                <span className="sidebar-label sidebar-label-spaced">
                    SWITCH VIEW
                </span>

                {roles.map((item) => (
                    <Link
                        key={item}
                        href={dashboardRoutes[item]}
                        className={`${linkClassName(
                            dashboardRoutes[item],
                        )} role-link`}
                        onClick={onNavigate}
                    >
                        <span className="role-symbol">{item[0]}</span>
                        {item} dashboard
                    </Link>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <div className="sidebar-avatar">{person.initials}</div>

                <div className="sidebar-person">
                    <strong>{person.name}</strong>
                    <span>{role} workspace</span>
                </div>
            </div>
        </aside>
    );
}
