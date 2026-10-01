"use client";

import Link from "next/link";
import {
    ArrowRight,
    FileCheck2,
    UserRoundCheck,
    UserRoundPlus,
    Users,
} from "lucide-react";

import {
    DashboardSection,
    Stat,
    Status,
} from "@/components/dashboard/dashboard-elements";
import { formatDate, timeAgo, usePrototype } from "@/lib/types/prototype-store";

function formatCount(value: number) {
    return String(value).padStart(2, "0");
}

function getAuditTone(action: string) {
    if (action.includes("PUBLISHED") || action.includes("APPROVED")) {
        return "green";
    }

    if (action.includes("REJECTED") || action.includes("REVOKED")) {
        return "red";
    }

    if (action.includes("SUBMITTED") || action.includes("REQUESTED")) {
        return "amber";
    }

    return "blue";
}

function formatAuditAction(action: string) {
    return action
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/^\w/, (character) => character.toUpperCase());
}

export function AdminDashboard() {
    const { users, articles, requests, audit } = usePrototype();

    const pendingRequests = requests.filter(
        (request) => request.status === "Pending",
    );

    const pendingReviews = articles.filter(
        (article) => article.status === "Pending Review",
    );

    const publishedCount = articles.filter(
        (article) => article.status === "Published",
    ).length;

    const draftCount = articles.filter(
        (article) =>
            article.status === "Draft" ||
            article.status === "Changes Requested",
    ).length;

    const reviewCount = articles.length - publishedCount - draftCount;

    const getPercentage = (count: number) =>
        `${(count / Math.max(1, articles.length)) * 100}%`;

    const getUser = (id: string) => users.find((user) => user.id === id);

    return (
        <>
            <p className="page-subtitle">
                A clear view of everything happening at Folio.
            </p>

            <div className="stats-grid admin-stats">
                <Stat
                    label="Total users"
                    value={formatCount(users.length)}
                    detail="In this prototype"
                    icon={<Users size={18} />}
                />

                <Stat
                    label="Active editors"
                    value={formatCount(
                        users.filter((user) => user.role === "Editor").length,
                    )}
                    detail="Creating on Folio"
                    icon={<UserRoundCheck size={18} />}
                />

                <Stat
                    label="Role requests"
                    value={formatCount(pendingRequests.length)}
                    detail="Awaiting a decision"
                    icon={<UserRoundPlus size={18} />}
                />

                <Stat
                    label="Content reviews"
                    value={formatCount(pendingReviews.length)}
                    detail="Ready for review"
                    icon={<FileCheck2 size={18} />}
                />
            </div>

            <div className="admin-overview-grid">
                <section className="dashboard-panel recent-activity">
                    <DashboardSection
                        title="Pending reviews"
                        subtitle="Articles waiting for a decision"
                    />

                    {pendingReviews.length === 0 ? (
                        <p className="notice-line">
                            Nothing waiting. All caught up.
                        </p>
                    ) : (
                        <div className="activity-list">
                            {pendingReviews.map((article) => {
                                const author = getUser(article.authorId);

                                if (!author) {
                                    return null;
                                }

                                return (
                                    <Link
                                        key={article.id}
                                        href={`/dashboard/admin/moderation/${article.id}`}
                                        className="activity-row"
                                    >
                                        <span className="activity-avatar activity-amber">
                                            {author.initials}
                                        </span>

                                        <div>
                                            <p>
                                                <strong>{author.name}</strong>{" "}
                                                submitted <b>{article.title}</b>
                                            </p>

                                            <small>
                                                {article.submittedAt
                                                    ? timeAgo(
                                                          article.submittedAt,
                                                      )
                                                    : ""}
                                            </small>
                                        </div>

                                        <span className="activity-indicator activity-amber" />
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </section>

                <section className="dashboard-panel content-overview">
                    <DashboardSection
                        title="Content status"
                        subtitle="Across the publication"
                    />

                    <div className="content-total">
                        <strong>{articles.length}</strong>
                        <span>Total articles</span>
                    </div>

                    <div
                        className="content-bar"
                        aria-label={`${publishedCount} published, ${draftCount} drafts, ${reviewCount} in review`}
                    >
                        <span
                            className="bar-published"
                            style={{
                                width: getPercentage(publishedCount),
                            }}
                        />

                        <span
                            className="bar-draft"
                            style={{
                                width: getPercentage(draftCount),
                            }}
                        />

                        <span
                            className="bar-review"
                            style={{
                                width: getPercentage(reviewCount),
                            }}
                        />
                    </div>

                    <div className="content-legend">
                        <div>
                            <span className="legend-dot published-dot" />
                            Published <strong>{publishedCount}</strong>
                        </div>

                        <div>
                            <span className="legend-dot draft-dot" />
                            Drafts <strong>{draftCount}</strong>
                        </div>

                        <div>
                            <span className="legend-dot review-dot" />
                            In review <strong>{reviewCount}</strong>
                        </div>
                    </div>
                </section>
            </div>

            <div className="admin-lower-grid">
                <section className="dashboard-panel request-panel">
                    <DashboardSection
                        title="Recent role requests"
                        subtitle="People ready to contribute"
                    />

                    <div className="request-list">
                        {requests.slice(0, 4).map((request) => {
                            const user = getUser(request.userId);

                            if (!user) {
                                return null;
                            }

                            return (
                                <div className="request-row" key={request.id}>
                                    <span className="request-avatar">
                                        {user.initials}
                                    </span>

                                    <div className="request-name">
                                        <strong>{user.name}</strong>
                                        <small>{user.email}</small>
                                    </div>

                                    <Status value={request.status} />

                                    <span className="request-date">
                                        {formatDate(request.submittedAt)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <p className="panel-footnote">
                        <Link
                            href="/dashboard/admin/role-requests"
                            className="text-link"
                        >
                            Manage requests
                            <ArrowRight size={14} />
                        </Link>
                    </p>
                </section>

                <section className="dashboard-panel audit-panel">
                    <DashboardSection
                        title="Audit activity"
                        subtitle="A record of recent changes"
                    />

                    <div className="audit-list">
                        {audit.slice(0, 5).map((entry) => (
                            <div className="audit-row" key={entry.id}>
                                <span
                                    className={`audit-track activity-${getAuditTone(
                                        entry.action,
                                    )}`}
                                />

                                <div>
                                    <strong>
                                        {formatAuditAction(entry.action)} ·{" "}
                                        {entry.target}
                                    </strong>

                                    <small>
                                        {entry.actor} · {timeAgo(entry.at)}
                                    </small>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="panel-footnote">
                        <Link
                            href="/dashboard/admin/audit"
                            className="text-link"
                        >
                            Full audit log
                            <ArrowRight size={14} />
                        </Link>
                    </p>
                </section>
            </div>

            <div className="admin-public-link">
                <span>See what your readers see</span>

                <Link href="/">
                    Visit publication
                    <ArrowRight size={15} />
                </Link>
            </div>
        </>
    );
}
