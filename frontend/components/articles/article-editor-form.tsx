"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Save, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Status } from "../dashboard/dashboard-elements";
import { FeedbackNote } from "./article-content";
import {
categories,
coverImages,
formatDateTime,
readTime,
useActiveEditor,
usePrototype,
type StoreArticle,
} from "@/lib/types/prototype-store";

type ArticleEditorFormProps = {
article?: StoreArticle;
};

type FormField = "title" | "slug" | "excerpt" | "content";

type FormErrors = Partial<Record<FormField, string>>;

type ArticleInput = {
title: string;
slug: string;
excerpt: string;
category: string;
tags: string[];
content: string;
image: string;
};

const EDITABLE_STATUSES: StoreArticle["status"][] = [
"Draft",
"Changes Requested",
"Rejected",
];

function slugify(value: string): string {
return value
.toLowerCase()
.trim()
.replace(/[^a-z0-9\s-]/g, "")
.replace(/\s+/g, "-")
.replace(/-+/g, "-");
}

function getImageSource(source: string | { src: string }): string {
return typeof source === "string" ? source : source.src;
}

export function ArticleEditorForm({
article,
}: ArticleEditorFormProps) {
const router = useRouter();
const { articles, saveArticle, submitArticle } = usePrototype();
const editor = useActiveEditor();

const [title, setTitle] = useState(article?.title ?? "");
const [slug, setSlug] = useState(article?.slug ?? "");
const [slugTouched, setSlugTouched] = useState(
Boolean(article?.slug),
);
const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
const [category, setCategory] = useState(
article?.category ?? categories[0] ?? "",
);
const [tags, setTags] = useState(
article?.tags.join(", ") ?? "",
);
const [content, setContent] = useState(article?.content ?? "");
const [image, setImage] = useState(
article?.image ??
getImageSource(coverImages[0]?.src ?? ""),
);
const [errors, setErrors] = useState<FormErrors>({});

const isLocked =
Boolean(article) &&
!EDITABLE_STATUSES.includes(article?.status ?? "Draft");

const finalSlug = slug || slugify(title);

const buildArticleInput = (): ArticleInput => ({
title: title.trim(),
slug: finalSlug,
excerpt: excerpt.trim(),
category,
tags: tags
.split(",")
.map((tag) => tag.trim())
.filter(Boolean),
content: content.trim(),
image,
});

const validate = (forSubmission: boolean): boolean => {
const nextErrors: FormErrors = {};

if (!title.trim()) {
  nextErrors.title = "Give your article a title.";
}

const duplicateSlug = articles.some(
  (item) =>
    item.slug === finalSlug && item.id !== article?.id,
);

if (finalSlug && duplicateSlug) {
  nextErrors.slug =
    "Another article already uses this URL.";
}

if (forSubmission) {
  if (!excerpt.trim()) {
    nextErrors.excerpt =
      "Add a short description for readers.";
  }

  const wordCount = content.trim()
    ? content.trim().split(/\s+/).length
    : 0;

  if (wordCount < 30) {
    nextErrors.content =
      "Write at least 30 words before submitting.";
  }
}

setErrors(nextErrors);

return Object.keys(nextErrors).length === 0;


};

const handleTitleChange = (
value: string,
): void => {
setTitle(value);


if (!slugTouched) {
  setSlug(slugify(value));
}


};

const handleSlugChange = (
value: string,
): void => {
setSlug(slugify(value));
setSlugTouched(true);
};

const handleSaveDraft = (): void => {
if (!validate(false)) {
return;
}


const id = saveArticle(
  editor.id,
  buildArticleInput(),
  article?.id,
);

toast.success("Draft saved");

if (!article) {
  router.replace(
    `/dashboard/editor/articles/${id}`,
  );
}


};

const handleSubmit = (): void => {
if (!validate(true)) {
toast.error(
"A few things need attention before submitting.",
);
return;
}


const id = saveArticle(
  editor.id,
  buildArticleInput(),
  article?.id,
);

submitArticle(id);

toast.success("Submitted for review", {
  description:
    "An admin will review your article shortly.",
});

router.push("/dashboard/editor/articles");


};

const wordCount = content.trim()
? content.trim().split(/\s+/).length
: 0;

return ( <div className="proto-form-grid"> <div className="dashboard-panel proto-form">
{article?.feedback &&
article.status !== "Published" && ( <FeedbackNote feedback={article.feedback} />
)}


    <div className="field">
      <label htmlFor="title">Title</label>

      <Input
        id="title"
        className="title-input"
        value={title}
        disabled={isLocked}
        placeholder="An idea worth sharing"
        onChange={(event) =>
          handleTitleChange(event.target.value)
        }
      />

      {errors.title && (
        <span className="field-error">
          {errors.title}
        </span>
      )}
    </div>

    <div className="field">
      <label htmlFor="slug">URL</label>

      <Input
        id="slug"
        value={slug}
        disabled={isLocked}
        placeholder="your-article-url"
        onChange={(event) =>
          handleSlugChange(event.target.value)
        }
      />

      <span className="field-hint">
        folio.pub/articles/{finalSlug || "…"}
      </span>

      {errors.slug && (
        <span className="field-error">
          {errors.slug}
        </span>
      )}
    </div>

    <div className="field">
      <label htmlFor="excerpt">
        Short description
      </label>

      <Textarea
        id="excerpt"
        rows={2}
        value={excerpt}
        disabled={isLocked}
        placeholder="One or two sentences shown on the homepage and article list."
        onChange={(event) =>
          setExcerpt(event.target.value)
        }
      />

      {errors.excerpt && (
        <span className="field-error">
          {errors.excerpt}
        </span>
      )}
    </div>

    <div className="field">
      <label htmlFor="content">Story</label>

      <Textarea
        id="content"
        className="content-textarea"
        value={content}
        disabled={isLocked}
        placeholder={
          "Start writing…\n\nUse a blank line between paragraphs. Start a line with ## for a heading or > for a quote."
        }
        onChange={(event) =>
          setContent(event.target.value)
        }
      />

      <span className="field-hint">
        {wordCount} words · {readTime(content)}
      </span>

      {errors.content && (
        <span className="field-error">
          {errors.content}
        </span>
      )}
    </div>
  </div>

  <aside className="side-panel">
    <div className="dashboard-panel proto-form">
      <dl className="meta-list">
        <div>
          <dt>Status</dt>
          <dd>
            <Status
              value={article?.status ?? "Draft"}
            />
          </dd>
        </div>

        <div>
          <dt>Author</dt>
          <dd>{editor.name}</dd>
        </div>

        <div>
          <dt>Last saved</dt>
          <dd>
            {article
              ? formatDateTime(article.updatedAt)
              : "Not yet"}
          </dd>
        </div>
      </dl>

      {isLocked && article ? (
        <p className="notice-line">
          This article is{" "}
          {article.status.toLowerCase()} and can’t be
          edited right now.
        </p>
      ) : (
        <div className="form-actions">
          <Button onClick={handleSubmit}>
            <Send size={16} />
            Submit for review
          </Button>

          <Button
            variant="outline"
            onClick={handleSaveDraft}
          >
            <Save size={16} />
            Save draft
          </Button>
        </div>
      )}
    </div>

    <div className="dashboard-panel proto-form">
      <div className="field">
        <label htmlFor="category">Category</label>

        <select
          id="category"
          className="native-select"
          value={category}
          disabled={isLocked}
          onChange={(event) =>
            setCategory(event.target.value)
          }
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="tags">Tags</label>

        <Input
          id="tags"
          value={tags}
          disabled={isLocked}
          placeholder="Essay, Craft"
          onChange={(event) =>
            setTags(event.target.value)
          }
        />

        <span className="field-hint">
          Separate with commas
        </span>
      </div>

      <div className="field">
        <span className="field-label">
          Cover image
        </span>

        <div className="cover-options">
          {coverImages.map((cover) => {
            const source = getImageSource(cover.src);

            return (
              <button
                key={cover.key}
                type="button"
                disabled={isLocked}
                aria-pressed={image === source}
                aria-label={cover.label}
                onClick={() => setImage(source)}
              >
                <Image
                  src={source}
                  alt=""
                  width={320}
                  height={240}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  </aside>
</div>


);
}

export { ArticleEditorForm as ArticleForm };
