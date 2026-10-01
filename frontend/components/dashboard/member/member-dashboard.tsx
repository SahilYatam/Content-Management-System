"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Bookmark, Clock3, PenLine } from "lucide-react";

import {
    DashboardSection,
    MiniArticle,
    Stat,
} from "@/components/dashboard/dashboard-elements";
import { Button } from "@/components/ui/button";
import {
    MEMBER_ID,
    usePrototype,
    usePublishedCards,
} from "@/lib/types/prototype-store";

export function MemberDashboard() {
    const articles = usePublishedCards();
    const { users, requests } = usePrototype();

    const member = users.find((user) => user.id === MEMBER_ID);

    if (!member) {
        return null;
    }

    const pendingRequest = requests.find(
        (request) =>
            request.userId === MEMBER_ID && request.status === "Pending",
    );

    return (
        <>
            <p className="page-subtitle">
                A little space for everything worth reading.
            </p>

            <div className="stats-grid member-stats">
                <Stat
                    label="Articles read"
                    value="24"
                    detail="This month"
                    icon={<BookOpen size={18} />}
                />

                <Stat
                    label="Saved stories"
                    value="08"
                    detail="In your collection"
                    icon={<Bookmark size={18} />}
                />

                <Stat
                    label="Time well spent"
                    value="3h 42m"
                    detail="Reading this month"
                    icon={<Clock3 size={18} />}
                />
            </div>

            <div className="member-columns">
                <div>
                    <DashboardSection
                        title="Picked for you"
                        subtitle="Stories we think you'll enjoy"
                        action="Explore all"
                        href="/articles"
                    />

                    <div className="mini-list">
                        {articles.slice(0, 3).map((article, index) => (
                            <MiniArticle
                                key={article.slug}
                                article={article}
                                number={String(index + 1).padStart(2, "0")}
                            />
                        ))}
                    </div>
                </div>

                <div className="member-side">
                    <div className="editor-invite">
                        <div className="invite-icon">
                            <PenLine size={21} />
                        </div>

                        <span className="eyebrow">YOUR NEXT CHAPTER</span>

                        {member.role === "Editor" ? (
                            <>
                                <h2>You’re an editor now.</h2>

                                <p>
                                    Your writing workspace is ready whenever you
                                    are.
                                </p>

                                <Button>
                                    <Link href="/dashboard/editor">
                                        Open editor workspace
                                        <ArrowRight size={16} />
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <h2>Have a story to tell?</h2>

                                <p>
                                    Take your ideas further and become a voice
                                    in the Folio community.
                                </p>

                                <Button>
                                    <Link href="/dashboard/member/request-role">
                                        {pendingRequest
                                            ? "View request status"
                                            : "Request editor access"}
                                        <ArrowRight size={16} />
                                    </Link>
                                </Button>

                                {pendingRequest && (
                                    <span className="invite-note">
                                        Your request is awaiting review.
                                    </span>
                                )}
                            </>
                        )}
                    </div>

                    <div className="saved-section">
                        <DashboardSection title="Recently saved" />

                        <div className="saved-list">
                            {articles.slice(3, 5).map((article) => (
                                <Link
                                    key={article.slug}
                                    href={`/articles/${article.slug}`}
                                >
                                    <Bookmark size={16} />

                                    <span>
                                        {article.title}

                                        <small>
                                            {article.category} ·{" "}
                                            {article.readTime}
                                        </small>
                                    </span>

                                    <ArrowRight size={15} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
