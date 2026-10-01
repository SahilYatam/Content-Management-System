import type { Metadata } from "next";

import { HomepageContent } from "@/components/home/homepage-content";
import {
    PublicFooter,
    PublicHeader,
} from "@/components/public-components/public-layout";

export const metadata: Metadata = {
    title: "Folio — Ideas worth your time",
    description:
        "Folio is a home for thoughtful stories on design, culture, and the way we live.",
    openGraph: {
        title: "Folio — Ideas worth your time",
        description:
            "Thoughtful stories on design, culture, and the way we live.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
    },
};

export default function HomePage() {
    return (
        <div className="public-site">
            {" "}
            <PublicHeader />
            <main>
                <HomepageContent />
            </main>
            <PublicFooter />
        </div>
    );
}
