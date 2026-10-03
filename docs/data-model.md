# Data Model

This document gives a quick overview of the application's MongoDB data model, relationships, important constraints, and indexes.

The project uses **MongoDB + Mongoose + TypeScript** and follows **camelCase** field naming.

## Models

- `User`
- `Session`
- `Category`
- `Article`
- `RoleRequest`
- `AuditLog`
- `Bookmark`

---

## 1. User

**Purpose:** Stores user accounts, their current role, and account status.

### Main fields

| Field | Description |
|---|---|
| `username` | User's display name. Not required to be unique. |
| `email` | Unique login identifier. |
| `passwordHash` | Hashed password. Raw passwords are never stored. |
| `role` | Current role: `member`, `editor`, or `admin`. |
| `status` | Account status: `active` or `suspended`. |
| `createdAt` / `updatedAt` | Timestamps. |

**Index:** `email` — unique

**Important:** `User.role` represents the user's **current role**, not a role they are requesting.

---

## 2. Session

**Purpose:** Stores refresh-token sessions for authenticated users.

### Main fields

| Field | Description |
|---|---|
| `userId` | User who owns the session. |
| `refreshTokenHash` | Hash of the refresh token. |
| `expiresAt` | Session expiration time. |
| `revokedAt` | Revocation time; `null` when active. |
| `createdAt` / `updatedAt` | Timestamps. |

**Relationship**

```text
User 1 ──── * Session
```

**Index:** `refreshTokenHash` — unique

**Important:** Raw refresh tokens are not stored in the database.

---

## 3. Category

**Purpose:** Groups articles into categories.

### Main fields

| Field | Description |
|---|---|
| `name` | Category name. |
| `slug` | URL-friendly unique identifier. |
| `description` | Category description. |
| `createdAt` / `updatedAt` | Timestamps. |

**Relationship**

```text
Category 1 ──── * Article
```

**Index:** `slug` — unique

---

## 4. Article

**Purpose:** Stores article content and its editorial workflow state.

### Main fields

| Field | Description |
|---|---|
| `userId` | User who created the article. |
| `categoryId` | Article category. |
| `title` | Article title. |
| `slug` | Unique URL-friendly identifier. |
| `description` | Short summary. |
| `content` | Main article content. |
| `coverImage` | Article cover image. |
| `status` | Current workflow state. |
| `publishedAt` | Publication time; `null` before publishing. |
| `createdAt` / `updatedAt` | Timestamps. |

### Status flow

```text
draft
  ↓
pending_review
  ↓
approved ──→ published
  │
  └──→ changes_requested
          ↓
        pending_review

pending_review ──→ rejected
```

Available statuses:

```text
draft
pending_review
changes_requested
approved
published
rejected
```

**Relationships**

```text
User     1 ──── * Article
Category 1 ──── * Article
```

**Indexes**
- `slug` — unique
- `userId`
- `categoryId`
- `(status, createdAt)` — supports status-based newest-first queries

---

## 5. RoleRequest

**Purpose:** Stores requests from users who want a different role.

### Main fields

| Field | Description |
|---|---|
| `userId` | User who submitted the request. |
| `requestedRole` | Requested `editor` or `admin` role. |
| `reason` | Why the user wants the role. |
| `status` | `pending`, `approved`, or `rejected`. |
| `reviewedBy` | Admin who reviewed the request. |
| `reviewReason` | Optional explanation from the reviewer. |
| `reviewedAt` | When the request was reviewed. |
| `createdAt` / `updatedAt` | Timestamps. |

**Relationships**

```text
User 1 ──── * RoleRequest
User 1 ──── * RoleRequest (as reviewer)
```

**Indexes**
- `userId`
- `(status, createdAt)` — supports the admin review queue

**Important distinction**

```text
User.role
→ user's current role

RoleRequest.requestedRole
→ role the user is asking for
```

---

## 6. AuditLog

**Purpose:** Records important actions performed in the system.

The basic idea is:

```text
WHO → DID WHAT → TO WHICH THING → WHEN
```

### Main fields

| Field | Description |
|---|---|
| `actorUserId` | User who performed the action. |
| `action` | Action that occurred. |
| `entityType` | Type of affected entity (`user`, `role_request`, `article`). |
| `entityId` | ID of the affected entity. |
| `metadata` | Optional extra information about the event. |
| `createdAt` | Time of the event. |

### Example

```text
actorUserId → Admin A
action      → role_approved
entityType  → role_request
entityId    → Request X
```

This means Admin A approved Request X.

**Indexes**
- `actorUserId`
- `(entityType, entityId)`
- `createdAt`

---

## 7. Bookmark

**Purpose:** Connects users with articles they have bookmarked.

### Main fields

| Field | Description |
|---|---|
| `userId` | User who created the bookmark. |
| `articleId` | Bookmarked article. |
| `createdAt` / `updatedAt` | Timestamps. |

**Relationships**

```text
User    1 ──── * Bookmark
Article 1 ──── * Bookmark
```

**Index:** `(userId, articleId)` — unique

This prevents the same user from bookmarking the same article more than once.

---

## Relationship Overview

```text
User
├── * Session
├── * Article
├── * RoleRequest
├── * AuditLog
└── * Bookmark

Category
└── * Article

Article
└── * Bookmark
```

## Key Design Decisions

- **Email is unique** because it is used for login.
- **Username is not unique** because it is not used to identify accounts.
- **Refresh tokens are stored as hashes**, not raw tokens.
- **Multiple admins are supported**, so role requests store `reviewedBy`.
- **Audit logs use `actorUserId + action + entityType + entityId`** to record system activity.
- **Bookmarks use a compound unique index** so one user cannot bookmark the same article twice.

## Important Distinctions

### User role vs role request

```text
User.role
→ user's current role

RoleRequest.requestedRole
→ role the user is asking for
```

### Request reason vs review reason

```text
RoleRequest.reason
→ why the user requested the role

RoleRequest.reviewReason
→ why the administrator made the review decision
```

### Actor vs entity in audit logs

```text
actorUserId
→ who performed the action

entityType + entityId
→ what was affected
```
