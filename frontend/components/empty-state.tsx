import type { ReactNode } from "react";

type EmptyStateProps = {
    title: string;
    children?: ReactNode;
};

export function EmptyState({ title, children }: EmptyStateProps) {
    return (
        <div className="empty-state">
            {" "}
            <h3>{title}</h3>
            {children && <p>{children}</p>}{" "}
        </div>
    );
}
