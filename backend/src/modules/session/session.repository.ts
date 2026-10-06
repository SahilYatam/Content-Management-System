import { Types } from "mongoose";
import { ISession, Session, SessionDocument } from "./session.model.js";

export type SessionLean = ISession & {
    _id: Types.ObjectId;
};

export interface CreateSessionInput {
    userId: Types.ObjectId;
    refreshTokenHash: string;
    expiresAt: Date;
}

type UpdateSessionInput = Partial<{
    refreshTokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
}>;

const createSession = async (
    input: CreateSessionInput,
): Promise<SessionDocument> => {
    return Session.create(input);
};

const updateSession = async (
    id: string | Types.ObjectId,
    input: UpdateSessionInput,
): Promise<SessionDocument | null> => {
    return Session.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
    }).exec();
};

const findSessionByRefreshTokenHash = async (
    hashedToken: string,
): Promise<SessionLean | null> => {
    return Session.findOne({
        refreshTokenHash: hashedToken,
    })
        .lean<SessionLean>()
        .exec();
};

const deleteExpiredTokens = async (): Promise<number> => {
    const batchSize = 100;
    let totalDeleted = 0;

    while (true) {
        const expired = await Session.find(
            {
                expiresAt: { $lt: new Date() },
            },
            { _id: 1 },
        )
            .limit(batchSize)
            .lean<Pick<SessionLean, "_id">[]>();

        if (expired.length === 0) break;

        const ids = expired.map((e) => e._id);

        const { deletedCount } = await Session.deleteMany({
            _id: { $in: ids },
        });

        totalDeleted += deletedCount;

        await new Promise((res) => setTimeout(res, 100));
    }

    return totalDeleted;
};

const revokeSessionByHashedToken = async (
    hashedToken: string,
): Promise<SessionDocument | null> => {
    return Session.findOneAndUpdate(
        {
            refreshTokenHash: hashedToken,
            revokedAt: null,
        },
        {
            revokedAt: new Date(),
        },
        {
            new: true,
            runValidators: true,
        },
    ).exec();
};

export const sessionRepo = {
    createSession,
    updateSession,
    findSessionByRefreshTokenHash,
    deleteExpiredTokens,
    revokeSessionByHashedToken,
};
