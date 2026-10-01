"use client";

import Link from "next/link";

import { ArticleForm } from "@/components/articles/article-editor-form";
import { EmptyState } from "@/components/empty-state";
import { usePrototype } from "@/lib/types/prototype-store";

type EditorArticleProps = {
  id: string;
};

export function EditorArticle({
  id,
}: EditorArticleProps) {
  const { articles, hydrated } = usePrototype();

  const article = articles.find(
    (item) => item.id === id,
  );

  if (!article) {
    return hydrated ? (
      <EmptyState title="Article not found">
        <Link
          href="/dashboard/editor/articles"
          className="text-link"
        >
          Back to my articles
        </Link>
      </EmptyState>
    ) : null;
  }

  return (
    <ArticleForm
      key={`${article.id}-${article.status}`}
      article={article}
    />
  );
}