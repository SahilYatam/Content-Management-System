import { Schema, model, HydratedDocument, Types } from "mongoose";

export const ARTICLE_STATUS = {
    DRAFT: "draft",
    PENDING_REVIEW: "pending_review",
    CHANGES_REQUESTED: "changes_requested",
    APPROVED: "approved",
    PUBLISHED: "published",
    REJECTED: "rejected",
} as const;
export type ArticleStatus =
    (typeof ARTICLE_STATUS)[keyof typeof ARTICLE_STATUS];

export interface IArticle {
    userId: Types.ObjectId;
    categoryId: Types.ObjectId;
    title: string;
    slug: string;
    description: string;
    content: string;
    coverImage?: string;
    status: ArticleStatus;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export type ArticleDocument = HydratedDocument<IArticle>;

const articleSchema = new Schema<IArticle>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        slug: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        content: {
            type: String,
            required: true,
        },

        coverImage: {
            type: String,
        },

        status: {
            type: String,
            enum: Object.values(ARTICLE_STATUS),
            default: ARTICLE_STATUS.DRAFT,
            required: true,
        },

        publishedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true },
);

articleSchema.index({ slug: 1 }, { unique: true });

articleSchema.index({ userId: 1 });

articleSchema.index({ categoryId: 1 });

articleSchema.index({ status: 1, createdAt: -1 });

export const Article = model<IArticle>("Article", articleSchema);
