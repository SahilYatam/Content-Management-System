"use client";

import Link from "next/link";
import { useState } from "react";

import { Status } from "@/components/dashboard/dashboard-elements";
import { EmptyState } from "@/components/empty-state";
import { FilterTabs } from "@/components/filter-tabs";
import { formatDate, usePrototype } from "@/lib/types/prototype-store";

const FILTERS = [
    "Pending Review",
    "Approved",
    "Changes Requested",
    "Rejected",
    "Published",
] as const;

type ModerationFilter = (typeof FILTERS)[number];

export function ContentModeration() {
    const { articles, users } = usePrototype();

    const [filter, setFilter] = useState<ModerationFilter>("Pending Review");

    const counts = FILTERS.reduce(
        (result, status) => {
            result[status] = articles.filter(
                (article) => article.status === status,
            ).length;

            return result;
        },
        {} as Record<ModerationFilter, number>,
    );

    const visibleArticles = articles
        .filter((article) => article.status === filter)
        .sort((first, second) =>
            (second.submittedAt ?? second.updatedAt).localeCompare(
                first.submittedAt ?? first.updatedAt,
            ),
        );

    return (
        <>
            <p className="page-subtitle">
                Every story passes through here before it reaches readers.
            </p>

            <FilterTabs
                items={[...FILTERS]}
                value={filter}
                onChange={setFilter}
                counts={counts}
            />

            <div className="dashboard-panel article-table-panel">
                {visibleArticles.length === 0 ? (
                    <EmptyState title="All clear">
                        No articles with this status.
                    </EmptyState>
                ) : (
                    <div className="table-scroll">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ARTICLE</th>
                                    <th>AUTHOR</th>
                                    <th>SUBMITTED</th>
                                    <th>STATUS</th>
                                    <th />
                                </tr>
                            </thead>

                            <tbody>
                                {visibleArticles.map((article) => {
                                    const author = users.find(
                                        (user) => user.id === article.authorId,
                                    );

                                    const actionLabel =
                                        article.status === "Pending Review"
                                            ? "Review"
                                            : article.status === "Approved"
                                              ? "Publish"
                                              : "View";

                                    return (
                                        <tr key={article.id}>
                                            <td>
                                                <Link
                                                    href={`/dashboard/admin/moderation/${article.id}`}
                                                    className="table-title"
                                                >
                                                    {article.title}
                                                </Link>

                                                <small>
                                                    {article.category}
                                                </small>
                                            </td>

                                            <td>{author?.name ?? "Unknown"}</td>

                                            <td>
                                                {formatDate(
                                                    article.submittedAt,
                                                )}
                                            </td>

                                            <td>
                                                <Status
                                                    value={article.status}
                                                />
                                            </td>

                                            <td>
                                                <Link
                                                    href={`/dashboard/admin/moderation/${article.id}`}
                                                    className="text-link"
                                                >
                                                    {actionLabel}
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
