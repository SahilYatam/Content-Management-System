"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";

import { Status } from "@/components/dashboard/dashboard-elements";
import { EmptyState } from "@/components/empty-state";
import { FilterTabs } from "@/components/filter-tabs";
import { Button } from "@/components/ui/button";
import {
    formatDate,
    useActiveEditor,
    usePrototype,
    type ArticleStatus,
} from "@/lib/types/prototype-store";

type ArticleFilter = "All" | ArticleStatus;

const FILTERS: ArticleFilter[] = [
    "All",
    "Draft",
    "Pending Review",
    "Changes Requested",
    "Approved",
    "Published",
    "Rejected",
];

const EDITABLE_STATUSES: ArticleStatus[] = [
    "Draft",
    "Changes Requested",
    "Rejected",
];

export function EditorArticlesList() {
    const { articles } = usePrototype();
    const editor = useActiveEditor();

    const [filter, setFilter] = useState<ArticleFilter>("All");

    const myArticles = articles
        .filter((article) => article.authorId === editor.id)
        .sort((first, second) =>
            second.updatedAt.localeCompare(first.updatedAt),
        );

    const counts = FILTERS.reduce(
        (result, currentFilter) => {
            result[currentFilter] =
                currentFilter === "All"
                    ? myArticles.length
                    : myArticles.filter(
                          (article) => article.status === currentFilter,
                      ).length;

            return result;
        },
        {} as Record<ArticleFilter, number>,
    );

    const visibleArticles =
        filter === "All"
            ? myArticles
            : myArticles.filter((article) => article.status === filter);

    return (
        <>
            <div className="dashboard-intro-row">
                <p className="page-subtitle">
                    Everything you’ve written, and where it stands.
                </p>

                <Button>
                    <Link href="/dashboard/editor/articles/new">
                        <Plus size={17} />
                        Create article
                    </Link>
                </Button>
            </div>

            <FilterTabs
                items={FILTERS}
                value={filter}
                onChange={setFilter}
                counts={counts}
            />

            <div className="dashboard-panel article-table-panel">
                {visibleArticles.length === 0 ? (
                    <EmptyState title="Nothing here yet">
                        No articles with this status.
                    </EmptyState>
                ) : (
                    <div className="table-scroll">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ARTICLE</th>
                                    <th>CATEGORY</th>
                                    <th>UPDATED</th>
                                    <th>STATUS</th>
                                    <th />
                                </tr>
                            </thead>

                            <tbody>
                                {visibleArticles.map((article) => {
                                    const title = article.title || "Untitled";

                                    const canEdit = EDITABLE_STATUSES.includes(
                                        article.status,
                                    );

                                    return (
                                        <tr key={article.id}>
                                            <td>
                                                <Link
                                                    href={`/dashboard/editor/articles/${article.id}`}
                                                    className="table-title"
                                                >
                                                    {title}
                                                </Link>

                                                {article.feedback &&
                                                    article.status !==
                                                        "Published" && (
                                                        <small>
                                                            Feedback:{" "}
                                                            {article.feedback
                                                                .message ||
                                                                "No reason given"}
                                                        </small>
                                                    )}
                                            </td>

                                            <td>{article.category}</td>

                                            <td>
                                                {formatDate(article.updatedAt)}
                                            </td>

                                            <td>
                                                <Status
                                                    value={article.status}
                                                />
                                            </td>

                                            <td>
                                                {article.status ===
                                                "Published" ? (
                                                    <Link
                                                        href={`/articles/${article.slug}`}
                                                        aria-label={`Read ${title}`}
                                                    >
                                                        <ArrowRight size={16} />
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href={`/dashboard/editor/articles/${article.id}`}
                                                        className="text-link"
                                                        aria-label={`${canEdit ? "Edit" : "View"} ${title}`}
                                                    >
                                                        {canEdit
                                                            ? "Edit"
                                                            : "View"}
                                                    </Link>
                                                )}
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
