/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import type { StaticImageData } from "next/image";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import architecture from "@/assets/editorial-architecture.jpg";
import design from "@/assets/editorial-design.jpg";
import culture from "@/assets/editorial-culture.jpg";
import {
    articles as seedArticles,
    type CardArticle,
} from "@/lib/types/mock-content";

export type UserRole = "Member" | "Editor" | "Admin";

export type ArticleStatus =
    | "Draft"
    | "Pending Review"
    | "Changes Requested"
    | "Approved"
    | "Rejected"
    | "Published";

export type RequestStatus =
    | "Pending"
    | "Approved"
    | "Rejected"
    | "Revoked";

export type AuditAction =
    | "ARTICLE_CREATED"
    | "ARTICLE_UPDATED"
    | "ARTICLE_SUBMITTED"
    | "ARTICLE_APPROVED"
    | "ARTICLE_REJECTED"
    | "ARTICLE_CHANGES_REQUESTED"
    | "ARTICLE_PUBLISHED"
    | "ROLE_REQUESTED"
    | "ROLE_APPROVED"
    | "ROLE_REJECTED"
    | "ROLE_REVOKED";

export type User = {
    id: string;
    name: string;
    initials: string;
    email: string;
    role: UserRole;
};

export type Feedback = {
    kind: "changes" | "rejected";
    message: string;
    by: string;
    at: string;
};

export type StoreArticle = {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    tags: string[];
    content: string;
    image: string;
    authorId: string;
    status: ArticleStatus;
    createdAt: string;
    updatedAt: string;
    submittedAt?: string;
    publishedAt?: string;
    feedback?: Feedback;
};

export type RoleRequest = {
    id: string;
    userId: string;
    currentRole: UserRole;
    requestedRole: UserRole;
    reason: string;
    submittedAt: string;
    status: RequestStatus;
    decidedAt?: string;
    decisionReason?: string;
};

export type AuditEntry = {
    id: string;
    action: AuditAction;
    actor: string;
    target: string;
    at: string;
    meta?: string;
};

type StoreState = {
    users: User[];
    articles: StoreArticle[];
    requests: RoleRequest[];
    audit: AuditEntry[];
};

export type ArticleInput = {
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    tags: string[];
    content: string;
    image: string;
};

export const coverImages = [
    { key: "architecture", src: architecture.src, label: "Architecture" },
    { key: "design", src: design.src, label: "Interior" },
    { key: "culture", src: culture.src, label: "City" },
];

export const categories = ["Design", "Culture", "Ideas", "Perspective"];

export const MEMBER_ID = "u-jordan";
export const ADMIN_ID = "u-alex";
const DEFAULT_EDITOR_ID = "u-elena";

const STORAGE_KEY = "folio-prototype-v1";
const ADMIN_NAME = "Alex Carter";

function getImageSrc(image: string | StaticImageData) {
    return typeof image === "string" ? image : image.src;
}

const seedBody = `There is a certain kind of clarity that arrives when we slow down. Not the kind we find by doing more, but the kind that comes from noticing what has been there all along.

We move through our days collecting impressions: the shape of a shadow across a wall, a conversation overheard in passing, the particular quality of light just before the afternoon gives way to evening. Most of these moments disappear almost as quickly as they arrive. But sometimes, one of them stays.

## Making space to notice

Perhaps the most meaningful things in life rarely announce themselves. They live in the small details, waiting patiently for us to pay attention. A good story can do the same. It invites us to step outside the familiar and consider another way of seeing.

That is not to say we need to change everything about the way we live. Sometimes all it takes is a little room: a walk without a destination, a conversation without an agenda, a few minutes to sit with an idea before moving on to the next.

> “The more closely we look, the more there is to see.”

## A different kind of attention

Attention is more than a habit. It is a way of being present in the world, of meeting it with curiosity rather than certainty. It asks us to stay open to the unexpected, and to find meaning in places we might otherwise overlook.

Maybe that is where the best ideas begin. Not in the rush to find an answer, but in the willingness to keep looking.`;

const users: User[] = [
    {
        id: MEMBER_ID,
        name: "Jordan Davis",
        initials: "JD",
        email: "jordan.davis@example.com",
        role: "Member",
    },
    {
        id: DEFAULT_EDITOR_ID,
        name: "Elena Rivers",
        initials: "ER",
        email: "elena.rivers@example.com",
        role: "Editor",
    },
    {
        id: ADMIN_ID,
        name: "Alex Carter",
        initials: "AC",
        email: "alex.carter@example.com",
        role: "Admin",
    },
    {
        id: "u-marcus",
        name: "Marcus Chen",
        initials: "MC",
        email: "marcus.chen@example.com",
        role: "Editor",
    },
    {
        id: "u-amara",
        name: "Amara Okafor",
        initials: "AO",
        email: "amara.okafor@example.com",
        role: "Editor",
    },
    {
        id: "u-sophie",
        name: "Sophie Laurent",
        initials: "SL",
        email: "sophie.laurent@example.com",
        role: "Editor",
    },
    {
        id: "u-daniel",
        name: "Daniel Foster",
        initials: "DF",
        email: "daniel.foster@example.com",
        role: "Editor",
    },
    {
        id: "u-samira",
        name: "Samira Khan",
        initials: "SK",
        email: "samira.khan@example.com",
        role: "Member",
    },
    {
        id: "u-alexlee",
        name: "Alex Lee",
        initials: "AL",
        email: "alex.lee@example.com",
        role: "Member",
    },
];

const authorIds: Record<string, string> = {
    "Elena Rivers": "u-elena",
    "Marcus Chen": "u-marcus",
    "Amara Okafor": "u-amara",
    "Sophie Laurent": "u-sophie",
    "Daniel Foster": "u-daniel",
};

const toIso = (value: string) => new Date(value).toISOString();
const getNow = () => new Date().toISOString();
const createId = (prefix: string) =>
    `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const createInitialState = (): StoreState => ({
    users,
    articles: [
        ...seedArticles.map((article) => ({
            id: `a-${article.slug}`,
            slug: article.slug,
            title: article.title,
            excerpt: article.description,
            category: article.category,
            tags: [article.category, "Life & thought", "Editorial"],
            content: seedBody,
            image: getImageSrc(article.image),
            authorId: authorIds[article.author] ?? DEFAULT_EDITOR_ID,
            status: "Published" as const,
            createdAt: toIso(article.date),
            updatedAt: toIso(article.date),
            submittedAt: toIso(article.date),
            publishedAt: toIso(article.date),
        })),
        {
            id: "a-quieter",
            slug: "a-quieter-way-to-create",
            title: "A quieter way to create",
            excerpt:
                "Why the most original work often begins in silence rather than noise.",
            category: "Ideas",
            tags: ["Creativity", "Process"],
            content: seedBody,
            image: design.src,
            authorId: DEFAULT_EDITOR_ID,
            status: "Pending Review",
            createdAt: toIso("2026-09-16T09:00:00Z"),
            updatedAt: toIso("2026-09-17T10:00:00Z"),
            submittedAt: toIso("2026-09-17T10:00:00Z"),
        },
        {
            id: "a-in-between",
            slug: "notes-from-the-in-between",
            title: "Notes from the in-between",
            excerpt:
                "On transitions, thresholds, and the quiet hours between chapters.",
            category: "Culture",
            tags: ["Essay"],
            content: seedBody.split("\n\n").slice(0, 3).join("\n\n"),
            image: culture.src,
            authorId: DEFAULT_EDITOR_ID,
            status: "Draft",
            createdAt: toIso("2026-09-15T09:00:00Z"),
            updatedAt: toIso("2026-09-15T09:00:00Z"),
        },
        {
            id: "a-pause",
            slug: "the-case-for-a-creative-pause",
            title: "The case for a creative pause",
            excerpt: "",
            category: "Perspective",
            tags: [],
            content: "",
            image: architecture.src,
            authorId: DEFAULT_EDITOR_ID,
            status: "Draft",
            createdAt: toIso("2026-09-12T09:00:00Z"),
            updatedAt: toIso("2026-09-12T09:00:00Z"),
        },
        {
            id: "a-light",
            slug: "a-study-in-light",
            title: "A study in light",
            excerpt:
                "How architects use daylight to shape mood, rhythm, and memory.",
            category: "Design",
            tags: ["Architecture", "Light"],
            content: seedBody,
            image: architecture.src,
            authorId: "u-marcus",
            status: "Pending Review",
            createdAt: toIso("2026-09-24T09:00:00Z"),
            updatedAt: toIso("2026-09-26T04:00:00Z"),
            submittedAt: toIso("2026-09-26T04:00:00Z"),
        },
    ],
    requests: [
        {
            id: "r-samira",
            userId: "u-samira",
            currentRole: "Member",
            requestedRole: "Editor",
            reason:
                "I write a monthly column on urban culture and would love to publish it on Folio.",
            submittedAt: toIso("2026-09-19T15:18:00Z"),
            status: "Pending",
        },
        {
            id: "r-alexlee",
            userId: "u-alexlee",
            currentRole: "Member",
            requestedRole: "Editor",
            reason:
                "Product designer with a backlog of essays on craft and tools.",
            submittedAt: toIso("2026-09-18T11:00:00Z"),
            status: "Pending",
        },
    ],
    audit: [
        {
            id: "l-3",
            action: "ARTICLE_SUBMITTED",
            actor: "Marcus Chen",
            target: "A study in light",
            at: toIso("2026-09-26T04:00:00Z"),
            meta: "Draft → Pending Review",
        },
        {
            id: "l-2",
            action: "ROLE_REQUESTED",
            actor: "Samira Khan",
            target: "Editor role",
            at: toIso("2026-09-19T15:18:00Z"),
            meta: "Member → Editor",
        },
        {
            id: "l-1",
            action: "ARTICLE_PUBLISHED",
            actor: "Alex Carter",
            target: "The art of paying attention",
            at: toIso("2026-09-18T10:42:00Z"),
            meta: "Author: Elena Rivers",
        },
    ],
});

function getUserName(state: StoreState, userId: string) {
    return state.users.find((user) => user.id === userId)?.name ?? "Unknown";
}

function updateArticle(
    state: StoreState,
    articleId: string,
    changes: Partial<StoreArticle>,
): StoreState {
    return {
        ...state,
        articles: state.articles.map((article) =>
            article.id === articleId
                ? { ...article, ...changes, updatedAt: getNow() }
                : article,
        ),
    };
}

function addAuditEntry(
    state: StoreState,
    action: AuditAction,
    actor: string,
    target: string,
    meta?: string,
): StoreState {
    return {
        ...state,
        audit: [
            {
                id: createId("l"),
                action,
                actor,
                target,
                at: getNow(),
                ...(meta ? { meta } : {}),
            },
            ...state.audit,
        ],
    };
}

function usePrototypeStore() {
    const [state, setState] = useState<StoreState>(createInitialState);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const storedState = localStorage.getItem(STORAGE_KEY);

            if (storedState) {
                setState(JSON.parse(storedState) as StoreState);
            }
        } catch {
            setState(createInitialState());
        } finally {
            setHydrated(true);
        }
    }, []);

    useEffect(() => {
        if (!hydrated) return;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state, hydrated]);

    const saveArticle = useCallback(
        (authorId: string, input: ArticleInput, articleId?: string) => {
            const newArticleId = articleId ?? createId("a");

            setState((currentState) => {
                const authorName = getUserName(currentState, authorId);

                if (articleId) {
                    const nextState = updateArticle(currentState, articleId, input);

                    return addAuditEntry(
                        nextState,
                        "ARTICLE_UPDATED",
                        authorName,
                        input.title || "Untitled",
                    );
                }

                const article: StoreArticle = {
                    ...input,
                    id: newArticleId,
                    authorId,
                    status: "Draft",
                    createdAt: getNow(),
                    updatedAt: getNow(),
                };

                return addAuditEntry(
                    {
                        ...currentState,
                        articles: [article, ...currentState.articles],
                    },
                    "ARTICLE_CREATED",
                    authorName,
                    input.title || "Untitled",
                    "Status: Draft",
                );
            });

            return newArticleId;
        },
        [],
    );

    const submitArticle = useCallback((articleId: string) => {
        setState((currentState) => {
            const article = currentState.articles.find(
                (item) => item.id === articleId,
            );

            if (!article) return currentState;

            return addAuditEntry(
                updateArticle(currentState, articleId, {
                    status: "Pending Review",
                    submittedAt: getNow(),
                }),
                "ARTICLE_SUBMITTED",
                getUserName(currentState, article.authorId),
                article.title,
                `${article.status} → Pending Review`,
            );
        });
    }, []);

    const moderate = useCallback(
        (
            articleId: string,
            decision: "approve" | "publish" | "changes" | "reject",
            message = "",
        ) => {
            setState((currentState) => {
                const article = currentState.articles.find(
                    (item) => item.id === articleId,
                );

                if (!article) return currentState;

                const authorName = getUserName(currentState, article.authorId);

                if (decision === "approve") {
                    return addAuditEntry(
                        updateArticle(currentState, articleId, {
                            status: "Approved",
                            feedback: undefined,
                        }),
                        "ARTICLE_APPROVED",
                        ADMIN_NAME,
                        article.title,
                        `Author: ${authorName}`,
                    );
                }

                if (decision === "publish") {
                    return addAuditEntry(
                        updateArticle(currentState, articleId, {
                            status: "Published",
                            publishedAt: getNow(),
                            feedback: undefined,
                        }),
                        "ARTICLE_PUBLISHED",
                        ADMIN_NAME,
                        article.title,
                        `Author: ${authorName}`,
                    );
                }

                if (decision === "changes") {
                    return addAuditEntry(
                        updateArticle(currentState, articleId, {
                            status: "Changes Requested",
                            feedback: {
                                kind: "changes",
                                message,
                                by: ADMIN_NAME,
                                at: getNow(),
                            },
                        }),
                        "ARTICLE_CHANGES_REQUESTED",
                        ADMIN_NAME,
                        article.title,
                        `“${message}”`,
                    );
                }

                return addAuditEntry(
                    updateArticle(currentState, articleId, {
                        status: "Rejected",
                        feedback: {
                            kind: "rejected",
                            message,
                            by: ADMIN_NAME,
                            at: getNow(),
                        },
                    }),
                    "ARTICLE_REJECTED",
                    ADMIN_NAME,
                    article.title,
                    message ? `Reason: ${message}` : "No reason given",
                );
            });
        },
        [],
    );

    const requestRole = useCallback(
        (userId: string, requestedRole: UserRole, reason: string) => {
            setState((currentState) => {
                const user = currentState.users.find((item) => item.id === userId);

                if (!user) return currentState;

                const request: RoleRequest = {
                    id: createId("r"),
                    userId,
                    currentRole: user.role,
                    requestedRole,
                    reason,
                    submittedAt: getNow(),
                    status: "Pending",
                };

                return addAuditEntry(
                    {
                        ...currentState,
                        requests: [request, ...currentState.requests],
                    },
                    "ROLE_REQUESTED",
                    user.name,
                    `${requestedRole} role`,
                    `${user.role} → ${requestedRole}`,
                );
            });
        },
        [],
    );

    const decideRole = useCallback(
        (
            requestId: string,
            decision: "approve" | "reject" | "revoke",
            reason = "",
        ) => {
            setState((currentState) => {
                const request = currentState.requests.find(
                    (item) => item.id === requestId,
                );

                if (!request) return currentState;

                const userName = getUserName(currentState, request.userId);

                const status: RequestStatus =
                    decision === "approve"
                        ? "Approved"
                        : decision === "reject"
                            ? "Rejected"
                            : "Revoked";

                const nextRole: UserRole | undefined =
                    decision === "approve"
                        ? request.requestedRole
                        : decision === "revoke"
                            ? "Member"
                            : undefined;

                const nextState: StoreState = {
                    ...currentState,
                    requests: currentState.requests.map((item) =>
                        item.id === requestId
                            ? {
                                ...item,
                                status,
                                decidedAt: getNow(),
                                ...(reason ? { decisionReason: reason } : {}),
                            }
                            : item,
                    ),
                    users: nextRole
                        ? currentState.users.map((user) =>
                            user.id === request.userId
                                ? { ...user, role: nextRole }
                                : user,
                        )
                        : currentState.users,
                };

                const action: AuditAction =
                    decision === "approve"
                        ? "ROLE_APPROVED"
                        : decision === "reject"
                            ? "ROLE_REJECTED"
                            : "ROLE_REVOKED";

                const meta =
                    decision === "approve"
                        ? `${request.currentRole} → ${request.requestedRole}`
                        : decision === "revoke"
                            ? `${request.requestedRole} → Member`
                            : reason
                                ? `Reason: ${reason}`
                                : "No reason given";

                return addAuditEntry(
                    nextState,
                    action,
                    ADMIN_NAME,
                    userName,
                    meta,
                );
            });
        },
        [],
    );

    const reset = useCallback(() => {
        setState(createInitialState());
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        ...state,
        hydrated,
        saveArticle,
        submitArticle,
        moderate,
        requestRole,
        decideRole,
        reset,
    };
}

type PrototypeStore = ReturnType<typeof usePrototypeStore>;

const PrototypeContext = createContext<PrototypeStore | null>(null);

export function PrototypeProvider({
    children,
}: {
    children: ReactNode;
}) {
    const store = usePrototypeStore();

    return (
        <PrototypeContext.Provider value={store}>
            {children}
        </PrototypeContext.Provider>
    );
}

export function usePrototype() {
    const context = useContext(PrototypeContext);

    if (!context) {
        throw new Error(
            "usePrototype must be used inside a PrototypeProvider",
        );
    }

    return context;
}

export function useActiveEditor() {
    const { users } = usePrototype();

    return useMemo(
        () =>
            users.find(
                (user) => user.id === MEMBER_ID && user.role === "Editor",
            ) ??
            users.find((user) => user.id === DEFAULT_EDITOR_ID)!,
        [users],
    );
}

export function readTime(content: string) {
    const words = content.split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.round(words / 200))} min read`;
}

export function formatDate(value?: string) {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function formatDateTime(value: string) {
    return new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export function timeAgo(value: string) {
    const minutes = Math.round(
        (Date.now() - new Date(value).getTime()) / 60000,
    );

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.round(minutes / 60);
    if (hours < 24) {
        return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    const days = Math.round(hours / 24);
    return days === 1 ? "Yesterday" : formatDate(value);
}

export function usePublishedCards(): CardArticle[] {
    const { articles, users } = usePrototype();

    return useMemo(() => {
        return articles
            .filter((article) => article.status === "Published")
            .sort((a, b) =>
                (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
            )
            .map((article) => toCard(article, users));
    }, [articles, users]);
}

export function toCard(
    article: StoreArticle,
    users: User[],
): CardArticle {
    return {
        slug: article.slug,
        category: article.category,
        title: article.title,
        description: article.excerpt,
        author:
            users.find((user) => user.id === article.authorId)?.name ?? "Folio",
        date: formatDate(article.publishedAt ?? article.updatedAt),
        readTime: readTime(article.content),
        image: getImageSrc(article.image),
        status: article.status,
    };
}