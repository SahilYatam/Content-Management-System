"use client";

import Link from "next/link";
import {
    ChevronDown,
    ChevronRight,
    Menu,
    PanelLeftClose,
    Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { DashboardRole } from "@/components/dashboard/dashboard-layout";

interface WorkspacePerson {
    name: string;
    initials: string;
}

interface DashboardTopbarProps {
    role: DashboardRole;
    title: string;
    person: WorkspacePerson;
    onOpenTabletSidebar: () => void;
    onOpenMobileSidebar: () => void;
}

const dashboardRoutes: Record<DashboardRole, string> = {
    Member: "/dashboard/member",
    Editor: "/dashboard/editor",
    Admin: "/dashboard/admin",
};

const roles: DashboardRole[] = ["Member", "Editor", "Admin"];

export function DashboardTopbar({
    role,
    title,
    person,
    onOpenTabletSidebar,
    onOpenMobileSidebar,
}: DashboardTopbarProps) {
    return (
        <header className="app-topbar">
            {" "}
            <div className="app-topbar-left">
                {" "}
                <Button
                    variant="ghost"
                    size="icon"
                    className="tablet-menu-trigger"
                    aria-label="Open sidebar"
                    onClick={onOpenTabletSidebar}
                >
                    {" "}
                    <PanelLeftClose />{" "}
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="mobile-menu-trigger"
                    aria-label="Open navigation"
                    onClick={onOpenMobileSidebar}
                >
                    <Menu />
                </Button>
                <div className="breadcrumb">
                    <span>Workspace</span>
                    <ChevronRight size={14} />
                    <strong>{title}</strong>
                </div>
            </div>
            <div className="app-topbar-actions">
                <Button
                    variant="ghost"
                    size="icon"
                    className="search-shortcut"
                    title="Browse articles"
                >
                    <Link href="/articles" aria-label="Browse articles">
                        <Search />
                    </Link>
                </Button>

                <span className="topbar-divider" />

                <DropdownMenu>
                    <DropdownMenuTrigger >
                        <Button variant="ghost" className="profile-trigger">
                            <span className="topbar-avatar">
                                {person.initials}
                            </span>

                            <span className="profile-name">
                                {person.name.split(" ")[0]}
                            </span>

                            <ChevronDown size={14} />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel>
                            <span className="text-xs text-muted-foreground">
                                Viewing as {role}
                            </span>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        {roles.map((item) => (
                            <DropdownMenuItem key={item}>
                                <Link href={dashboardRoutes[item]}>
                                    {item} dashboard
                                </Link>
                            </DropdownMenuItem>
                        ))}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem >
                            <Link href="/">View publication</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
