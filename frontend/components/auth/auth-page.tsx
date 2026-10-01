import type { ReactNode } from "react";
import Link from "next/link";

import {
    PublicFooter,
    PublicHeader,
} from "@/components/public-components/public-layout";

type AuthPageProps = {
    eyebrow: string;
    title: string;
    children: ReactNode;
    prompt: string;
    promptLink: "/login" | "/signup";
    promptText: string;
};

export function AuthPage({
    eyebrow,
    title,
    children,
    prompt,
    promptLink,
    promptText,
}: AuthPageProps) {
    return (
        <div className="public-site auth-site">
            {" "}
            <PublicHeader />
            <main className="auth-main public-container">
                <div className="auth-content">
                    <div className="eyebrow accent-eyebrow">{eyebrow}</div>

                    <h1>{title}</h1>

                    {children}

                    <p className="auth-switch">
                        {prompt}{" "}
                        <Link href={promptLink} className="text-link">
                            {promptText}
                        </Link>
                    </p>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}
