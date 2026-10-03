import { HydratedDocument, model, Schema } from "mongoose";

export interface ICategory {
    name: string;
    slug: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CategoryDocument = HydratedDocument<ICategory>;

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true },
);

categorySchema.index({ slug: 1 }, { unique: true });

export const Category = model<ICategory>("Category", categorySchema);
