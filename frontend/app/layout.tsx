import type { Metadata } from "next";
import { DM_Sans, Newsreader } from "next/font/google";

import { PrototypeProvider } from "@/lib/types/prototype-store";
import { Toaster } from "sonner";

import "./globals.css";

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
});

const newsreader = Newsreader({
    variable: "--font-newsreader",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Folio",
    description:
        "Thoughtful stories on design, culture, and the way we live.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${dmSans.variable} ${newsreader.variable} antialiased`}
        >
            <body className="min-h-full">
                <PrototypeProvider>
                    {children}
                </PrototypeProvider>

                <Toaster />
            </body>
        </html>
    );
}