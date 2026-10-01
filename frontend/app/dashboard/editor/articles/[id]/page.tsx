import type { Metadata } from "next";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EditorArticle } from "@/components/dashboard/editor/editor-articles";


export const metadata: Metadata = {
  title: "Edit Article — Folio",
  description:
    "Edit and submit your story on Folio.",
  openGraph: {
    title: "Edit Article — Folio",
    description:
      "Edit and submit your story on Folio.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

type EditArticlePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { id } = await params;

  return (
    <DashboardLayout
      role="Editor"
      title="Edit article"
    >
      <EditorArticle id={id} />
    </DashboardLayout>
  );
}