"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  Globe,
  MessageSquare,
  X,
} from "lucide-react";


import { EmptyState } from "@/components/empty-state";
import {
  DashboardSection,
  Status,
} from "@/components/dashboard/dashboard-elements";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  formatDateTime,
  readTime,
  usePrototype,
} from "@/lib/types/prototype-store";
import { ArticleBody, FeedbackNote } from "@/components/articles/article-content";

type ReviewMode = "changes" | "reject";

type ArticleReviewProps = {
  id: string;
};

export function ArticleReview({
  id,
}: ArticleReviewProps) {
  const {
    articles,
    users,
    moderate,
    hydrated,
  } = usePrototype();

  const article = articles.find(
    (item) => item.id === id,
  );

  const [mode, setMode] =
    useState<ReviewMode | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!article) {
    return hydrated ? (
      <EmptyState title="Article not found">
        <Link
          href="/dashboard/admin/moderation"
          className="text-link"
        >
          Back to moderation
        </Link>
      </EmptyState>
    ) : null;
  }

  const author = users.find(
    (user) => user.id === article.authorId,
  );

  function resetReviewForm() {
    setMode(null);
    setMessage("");
    setError("");
  }

  function approveArticle() {
    if (!article) return;

    moderate(article.id, "approve");

    toast.success("Article approved", {
      description:
        "It’s ready to publish.",
    });
  }

  function confirmDecision() {
    if (!article) return;

    const trimmedMessage =
      message.trim();

    if (
      mode === "changes" &&
      !trimmedMessage
    ) {
      setError(
        "Explain what should change.",
      );
      return;
    }

    moderate(
      article.id,
      mode === "changes"
        ? "changes"
        : "reject",
      trimmedMessage,
    );

    toast.success(
      mode === "changes"
        ? "Changes requested"
        : "Article rejected",
      {
        description: `${
          author?.name ?? "The author"
        } will see your note.`,
      },
    );

    resetReviewForm();
  }

  function publishArticle() {
    if (!article) return;

    moderate(article.id, "publish");

    toast.success("Published", {
      description:
        "It’s now live on Folio.",
    });
  }

  return (
    <>
      <Link
        href="/dashboard/admin/moderation"
        className="text-link"
      >
        <ArrowLeft size={15} />
        Back to moderation
      </Link>

      <div className="review-layout">
        <article className="review-article">
          <span className="eyebrow accent-eyebrow">
            {article.category} ·{" "}
            {readTime(article.content)}
          </span>

          <h2 className="review-title">
            {article.title}
          </h2>

          <p className="page-subtitle">
            {article.excerpt}
          </p>

          <Image
            className="review-cover"
            src={article.image}
            alt=""
            width={1200}
            height={900}
            priority
          />

          <div className="reading-body">
            <ArticleBody
              content={article.content}
            />
          </div>
        </article>

        <aside className="side-panel">
          <div>
            <DashboardSection title="Submission" />

            <dl className="meta-list">
              <div>
                <dt>Status</dt>
                <dd>
                  <Status
                    value={article.status}
                  />
                </dd>
              </div>

              <div>
                <dt>Author</dt>
                <dd>
                  {author?.name ??
                    "Unknown"}
                </dd>
              </div>

              <div>
                <dt>Submitted</dt>
                <dd>
                  {article.submittedAt
                    ? formatDateTime(
                        article.submittedAt,
                      )
                    : "—"}
                </dd>
              </div>

              <div>
                <dt>Tags</dt>
                <dd>
                  {article.tags.join(
                    ", ",
                  ) || "—"}
                </dd>
              </div>
            </dl>
          </div>

          {article.feedback &&
            article.status !==
              "Published" && (
              <FeedbackNote
                feedback={article.feedback}
              />
            )}

          {article.status ===
            "Pending Review" &&
            !mode && (
              <div className="form-actions">
                <Button
                  onClick={approveArticle}
                >
                  <Check size={16} />
                  Approve
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    setMode("changes")
                  }
                >
                  <MessageSquare size={16} />
                  Request changes
                </Button>

                <Button
                  variant="ghost"
                  className="text-destructive"
                  onClick={() =>
                    setMode("reject")
                  }
                >
                  <X size={16} />
                  Reject
                </Button>
              </div>
            )}

          {mode && (
            <div className="inline-reason">
              <label
                className="field-label"
                htmlFor="review-message"
              >
                {mode === "changes"
                  ? "WHAT SHOULD CHANGE?"
                  : "REASON (OPTIONAL)"}
              </label>

              <Textarea
                id="review-message"
                rows={4}
                value={message}
                onChange={(event) => {
                  setMessage(
                    event.target.value,
                  );

                  if (error) {
                    setError("");
                  }
                }}
              />

              {error && (
                <span className="field-error">
                  {error}
                </span>
              )}

              <div className="form-actions">
                <Button
                  variant={
                    mode === "reject"
                      ? "destructive"
                      : "default"
                  }
                  onClick={
                    confirmDecision
                  }
                >
                  {mode === "changes"
                    ? "Send feedback"
                    : "Reject article"}
                </Button>

                <Button
                  variant="ghost"
                  onClick={
                    resetReviewForm
                  }
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {article.status ===
            "Approved" && (
            <Button
              onClick={publishArticle}
            >
              <Globe size={16} />
              Publish article
            </Button>
          )}

          {article.status ===
            "Published" && (
            <Button
              variant="outline"
            >
              <Link
                href={`/articles/${article.slug}`}
              >
                View live article
              </Link>
            </Button>
          )}
        </aside>
      </div>
    </>
  );
}