import type { Metadata } from "next";

import { DM_Sans, Newsreader, Geist } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
});

const newsreader = Newsreader({
    variable: "--font-newsreader",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Your App",
    description: "Your app description",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={cn("h-full", "antialiased", dmSans.variable, newsreader.variable, "font-sans", geist.variable)}
        >
            <body className="min-h-full flex flex-col">
                {children}
            </body>
        </html>
    );
}