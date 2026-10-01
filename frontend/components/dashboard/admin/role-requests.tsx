"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Status } from "@/components/dashboard/dashboard-elements";
import { EmptyState } from "@/components/empty-state";
import { FilterTabs } from "@/components/filter-tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    formatDateTime,
    usePrototype,
    type RequestStatus,
} from "@/lib/types/prototype-store";

const FILTERS: RequestStatus[] = ["Pending", "Approved", "Rejected", "Revoked"];

export function RoleRequests() {
    const { requests, users, decideRole } = usePrototype();

    const [filter, setFilter] = useState<RequestStatus>("Pending");

    const [rejectingId, setRejectingId] = useState<string | null>(null);

    const [reason, setReason] = useState("");

    const counts = FILTERS.reduce(
        (result, status) => {
            result[status] = requests.filter(
                (request) => request.status === status,
            ).length;

            return result;
        },
        {} as Record<RequestStatus, number>,
    );

    const visibleRequests = requests.filter(
        (request) => request.status === filter,
    );

    function startRejection(requestId: string) {
        setRejectingId(requestId);
        setReason("");
    }

    function cancelRejection() {
        setRejectingId(null);
        setReason("");
    }

    function confirmRejection(requestId: string) {
        decideRole(requestId, "reject", reason.trim());

        toast.success("Request rejected");
        cancelRejection();
    }

    function approveRequest(requestId: string, userName: string) {
        decideRole(requestId, "approve");

        toast.success(`${userName} is now an editor`);
    }

    function revokeAccess(requestId: string) {
        decideRole(requestId, "revoke");

        toast.success("Editor access revoked");
    }

    return (
        <>
            <p className="page-subtitle">People asking to write for Folio.</p>

            <FilterTabs
                items={FILTERS}
                value={filter}
                onChange={setFilter}
                counts={counts}
            />

            <div className="dashboard-panel">
                {visibleRequests.length === 0 ? (
                    <EmptyState title="Nothing to show">
                        No {filter.toLowerCase()} requests.
                    </EmptyState>
                ) : (
                    visibleRequests.map((request) => {
                        const user = users.find(
                            (item) => item.id === request.userId,
                        );

                        if (!user) {
                            return null;
                        }

                        const isRejecting = rejectingId === request.id;

                        return (
                            <div className="request-card" key={request.id}>
                                <span className="request-avatar">
                                    {user.initials}
                                </span>

                                <div>
                                    <strong>{user.name}</strong>{" "}
                                    <small>{user.email}</small>
                                    <br />
                                    <small>
                                        {request.currentRole} →{" "}
                                        {request.requestedRole} ·{" "}
                                        {formatDateTime(request.submittedAt)}
                                    </small>
                                    <p>{request.reason}</p>
                                    {request.decisionReason && (
                                        <small>
                                            Note: {request.decisionReason}
                                        </small>
                                    )}
                                    {isRejecting && (
                                        <div className="inline-reason">
                                            <Textarea
                                                rows={3}
                                                placeholder="Reason (optional)"
                                                value={reason}
                                                onChange={(event) =>
                                                    setReason(
                                                        event.target.value,
                                                    )
                                                }
                                            />

                                            <div className="form-actions">
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        confirmRejection(
                                                            request.id,
                                                        )
                                                    }
                                                >
                                                    Confirm rejection
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={cancelRejection}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="row-actions">
                                    <Status value={request.status} />

                                    {request.status === "Pending" &&
                                        !isRejecting && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        approveRequest(
                                                            request.id,
                                                            user.name,
                                                        )
                                                    }
                                                >
                                                    Approve
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        startRejection(
                                                            request.id,
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}

                                    {request.status === "Approved" && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                revokeAccess(request.id)
                                            }
                                        >
                                            Revoke
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}
