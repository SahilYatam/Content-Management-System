"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, FileText, Plus } from "lucide-react";

import {
    DashboardSection,
    Stat,
    Status,
} from "@/components/dashboard/dashboard-elements";
import { Button } from "@/components/ui/button";
import {
    formatDate,
    useActiveEditor,
    usePrototype,
} from "@/lib/types/prototype-store";

function formatCount(value: number) {
    return String(value).padStart(2, "0");
}

export function EditorDashboard() {
    const { articles } = usePrototype();
    const editor = useActiveEditor();

    const myArticles = articles
        .filter((article) => article.authorId === editor.id)
        .sort((first, second) =>
            second.updatedAt.localeCompare(first.updatedAt),
        );

    const draftCount = myArticles.filter(
        (article) =>
            article.status === "Draft" ||
            article.status === "Changes Requested",
    ).length;

    const reviewCount = myArticles.filter(
        (article) =>
            article.status === "Pending Review" ||
            article.status === "Approved",
    ).length;

    const publishedCount = myArticles.filter(
        (article) => article.status === "Published",
    ).length;

    return (
        <>
            <div className="dashboard-intro-row">
                <p className="page-subtitle">
                    Keep your best ideas moving forward,{" "}
                    {editor.name.split(" ")[0]}.
                </p>

                <Button>
                    <Link href="/dashboard/editor/articles/new" className="flex items-center gap-1">
                        <Plus size={17} />
                        Create article
                    </Link>
                </Button>
            </div>

            <div className="stats-grid editor-stats">
                <Stat
                    label="Total articles"
                    value={formatCount(myArticles.length)}
                    detail="Across all statuses"
                    icon={<FileText size={18} />}
                />

                <Stat
                    label="Drafts"
                    value={formatCount(draftCount)}
                    detail="Works in progress"
                    icon={<FileText size={18} />}
                />

                <Stat
                    label="Pending review"
                    value={formatCount(reviewCount)}
                    detail="Awaiting a decision"
                    icon={<Clock3 size={18} />}
                />

                <Stat
                    label="Published"
                    value={formatCount(publishedCount)}
                    detail="Live on Folio"
                    icon={<CheckCircle2 size={18} />}
                />
            </div>

            <div className="dashboard-panel article-table-panel">
                <DashboardSection
                    title="Recent articles"
                    subtitle="Your latest work and its progress"
                />

                {myArticles.length === 0 ? (
                    <p className="notice-line">
                        You haven&apos;t created any articles yet.
                    </p>
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
                                {myArticles.slice(0, 6).map((article) => {
                                    const articleTitle =
                                        article.title || "Untitled";

                                    return (
                                        <tr key={article.id}>
                                            <td>
                                                <Link
                                                    href={`/dashboard/editor/articles/${article.id}`}
                                                    className="table-title"
                                                >
                                                    {articleTitle}
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
                                                        aria-label={`Read ${articleTitle}`}
                                                    >
                                                        <ArrowRight size={16} />
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href={`/dashboard/editor/articles/${article.id}`}
                                                        aria-label={`Open ${articleTitle}`}
                                                    >
                                                        <ArrowRight size={16} />
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

            <div className="editor-bottom-grid">
                <section className="dashboard-panel editorial-summary">
                    <DashboardSection title="Your workflow" />

                    <div className="workflow-steps">
                        <div>
                            <span className="workflow-number">01</span>

                            <div>
                                <strong>Drafts</strong>
                                <p>Ideas taking shape</p>
                            </div>

                            <span>{formatCount(draftCount)}</span>
                        </div>

                        <div>
                            <span className="workflow-number">02</span>

                            <div>
                                <strong>In review</strong>
                                <p>Waiting for the next step</p>
                            </div>

                            <span>{formatCount(reviewCount)}</span>
                        </div>

                        <div>
                            <span className="workflow-number">03</span>

                            <div>
                                <strong>Published</strong>
                                <p>Out in the world</p>
                            </div>

                            <span>{formatCount(publishedCount)}</span>
                        </div>
                    </div>
                </section>

                <div className="editor-note">
                    <span className="eyebrow accent-eyebrow">
                        WRITING STUDIO
                    </span>

                    <h2>Every story starts somewhere.</h2>

                    <p>
                        Draft freely, save as often as you like, and submit when
                        it’s ready for review.
                    </p>

                    <Button variant="outline">
                        <Link href="/dashboard/editor/articles">
                            All my articles
                            <ArrowRight size={16} />
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
