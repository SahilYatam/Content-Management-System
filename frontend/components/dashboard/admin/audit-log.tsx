"use client";

import { useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { FilterTabs } from "@/components/filter-tabs";
import { formatDateTime, usePrototype } from "@/lib/types/prototype-store";

const FILTERS = ["All", "Articles", "Roles"] as const;

type AuditFilter = (typeof FILTERS)[number];

export function AuditLog() {
    const { audit } = usePrototype();

    const [filter, setFilter] = useState<AuditFilter>("All");

    const visibleEntries = audit.filter((entry) => {
        if (filter === "All") {
            return true;
        }

        if (filter === "Articles") {
            return entry.action.startsWith("ARTICLE");
        }

        return entry.action.startsWith("ROLE");
    });

    return (
        <>
            <p className="page-subtitle">Every important change, in order.</p>

            <FilterTabs
                items={[...FILTERS]}
                value={filter}
                onChange={setFilter}
            />

            <div className="dashboard-panel article-table-panel">
                {visibleEntries.length === 0 ? (
                    <EmptyState title="No activity yet" />
                ) : (
                    <div className="table-scroll">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ACTION</th>
                                    <th>ACTOR</th>
                                    <th>TARGET</th>
                                    <th>DETAILS</th>
                                    <th>TIME</th>
                                </tr>
                            </thead>

                            <tbody>
                                {visibleEntries.map((entry) => (
                                    <tr key={entry.id}>
                                        <td>
                                            <span
                                                className="table-title"
                                                style={{
                                                    fontFamily:
                                                        "var(--font-sans)",
                                                    fontSize: 11,
                                                    letterSpacing: ".04em",
                                                }}
                                            >
                                                {entry.action}
                                            </span>
                                        </td>

                                        <td>{entry.actor}</td>
                                        <td>{entry.target}</td>
                                        <td>{entry.meta ?? "—"}</td>
                                        <td>{formatDateTime(entry.at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
