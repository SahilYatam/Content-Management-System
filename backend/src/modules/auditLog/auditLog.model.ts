import { HydratedDocument, model, Schema, Types } from "mongoose";

export const AUDIT_ACTION = {
    USER_CREATED: "user_created",
    USER_SUSPENDED: "user_suspended",

    ROLE_REQUESTED: "role_requested",
    ROLE_APPROVED: "role_approved",
    ROLE_REJECTED: "role_rejected",
    ROLE_REVOKED: "role_revoked",

    ARTICLE_CREATED: "article_created",
    ARTICLE_UPDATED: "article_updated",
    ARTICLE_SUBMITTED: "article_submitted",
    ARTICLE_CHANGES_REQUESTED: "article_changes_requested",
    ARTICLE_APPROVED: "article_approved",
    ARTICLE_REJECTED: "article_rejected",
    ARTICLE_PUBLISHED: "article_published",
    ARTICLE_DELETED: "article_deleted",
} as const;

export type AuditAction =
    (typeof AUDIT_ACTION)[keyof typeof AUDIT_ACTION];

export const AUDIT_ENTITY_TYPE = {
    USER: "user",
    ROLE_REQUEST: "role_request",
    ARTICLE: "article",
} as const;

export type AuditEntityType =
    (typeof AUDIT_ENTITY_TYPE)[keyof typeof AUDIT_ENTITY_TYPE];

export interface IAuditLog {
    actorUserId: Types.ObjectId;
    action: AuditAction;
    entityType: AuditEntityType;
    entityId: Types.ObjectId;
    metadata: Record<string, unknown> | null;
    createdAt: Date;
}

export type AuditLogDocument = HydratedDocument<IAuditLog>;

const auditLogSchema = new Schema<IAuditLog>(
    {
        actorUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        action: {
            type: String,
            enum: Object.values(AUDIT_ACTION),
            required: true,
        },

        entityType: {
            type: String,
            enum: Object.values(AUDIT_ENTITY_TYPE),
            required: true,
        },

        entityId: {
            type: Schema.Types.ObjectId,
            required: true,
        },

        metadata: {
            type: Schema.Types.Mixed,
            default: null,
        },

        createdAt: {
            type: Date,
            default: Date.now,
            required: true,
        },
    },
);

auditLogSchema.index({ actorUserId: 1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ createdAt: -1 });

export const AuditLog = model<IAuditLog>(
    "AuditLog",
    auditLogSchema,
);