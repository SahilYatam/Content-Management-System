"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Send } from "lucide-react";
import { toast } from "sonner";

import {
    DashboardSection,
    Status,
} from "@/components/dashboard/dashboard-elements";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    formatDateTime,
    MEMBER_ID,
    usePrototype,
} from "@/lib/types/prototype-store";

export function EditorAccessRequest() {
    const { users, requests, requestRole } = usePrototype();

    const member = users.find((user) => user.id === MEMBER_ID);

    const requestsByMember = requests
        .filter((request) => request.userId === MEMBER_ID)
        .sort((first, second) =>
            second.submittedAt.localeCompare(first.submittedAt),
        );

    const pendingRequest = requestsByMember.find(
        (request) => request.status === "Pending",
    );

    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    if (!member) {
        return null;
    }

    function submitRequest() {
        const trimmedReason = reason.trim();

        if (trimmedReason.length < 20) {
            setError("Tell us a little more — at least 20 characters.");
            return;
        }

        requestRole(MEMBER_ID, "Editor", trimmedReason);

        setReason("");
        setError("");

        toast.success("Request sent", {
            description: "An admin will review your request shortly.",
        });
    }

    return (
        <>
            <p className="page-subtitle">
                Editors write, submit, and publish stories on Folio.
            </p>

            <div className="proto-narrow">
                <dl className="meta-list">
                    <div>
                        <dt>Current role</dt>
                        <dd>
                            <strong>{member.role}</strong>
                        </dd>
                    </div>

                    <div>
                        <dt>Requested role</dt>
                        <dd>Editor</dd>
                    </div>
                </dl>

                {member.role === "Editor" ? (
                    <div
                        className="feedback-note"
                        style={{
                            borderLeftColor: "var(--brand-green)",
                        }}
                    >
                        <span className="eyebrow">ACCESS GRANTED</span>

                        <p>
                            You’re now an editor. Your writing workspace is
                            ready.
                        </p>

                        <Button className="mt-4">
                            <Link href="/dashboard/editor">
                                Open editor workspace
                                <ArrowRight size={16} />
                            </Link>
                        </Button>
                    </div>
                ) : pendingRequest ? (
                    <p className="notice-line">
                        Your request is awaiting a decision. You’ll see the
                        result here.
                    </p>
                ) : (
                    <div className="proto-form" style={{ marginTop: 28 }}>
                        <div className="field">
                            <label htmlFor="reason">
                                WHY DO YOU WANT TO WRITE FOR FOLIO?
                            </label>

                            <Textarea
                                id="reason"
                                rows={5}
                                value={reason}
                                onChange={(event) => {
                                    setReason(event.target.value);

                                    if (error) {
                                        setError("");
                                    }
                                }}
                                placeholder="Share what you’d like to write about and any previous work."
                            />

                            {error ? (
                                <span className="field-error">{error}</span>
                            ) : (
                                <span className="field-hint">
                                    {reason.trim().length}/20 characters minimum
                                </span>
                            )}
                        </div>

                        <div className="form-actions">
                            <Button onClick={submitRequest}>
                                <Send size={16} />
                                Submit request
                            </Button>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: 44 }}>
                    <DashboardSection title="Request history" />

                    {requestsByMember.length === 0 ? (
                        <p className="notice-line">No requests yet.</p>
                    ) : (
                        requestsByMember.map((request) => (
                            <div
                                className="request-card"
                                key={request.id}
                                style={{
                                    gridTemplateColumns: "minmax(0,1fr) auto",
                                }}
                            >
                                <div>
                                    <small>
                                        {request.currentRole} →{" "}
                                        {request.requestedRole} ·{" "}
                                        {formatDateTime(request.submittedAt)}
                                    </small>

                                    <p>{request.reason}</p>

                                    {request.decisionReason && (
                                        <small>
                                            Admin note: {request.decisionReason}
                                        </small>
                                    )}
                                </div>

                                <Status value={request.status} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
