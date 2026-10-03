import { HydratedDocument, model, Schema, Types } from "mongoose";

export interface IBookmark {
    userId: Types.ObjectId;
    articleId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export type BookmarkDocument = HydratedDocument<IBookmark>;

const bookmarkSchema = new Schema<IBookmark>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        articleId: {
            type: Schema.Types.ObjectId,
            ref: "Article",
            required: true,
        },
    },
    { timestamps: true },
);

bookmarkSchema.index({ userId: 1, articleId: 1 }, { unique: true });

export const Bookmark = model<IBookmark>("Bookmark", bookmarkSchema);
