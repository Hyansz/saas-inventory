import type { Metadata } from "next";

import { Poppins, Geist_Mono } from "next/font/google";
import QueryProvider from "@/providers/query-provider";
import { Toaster } from "sonner";

import "./globals.css";

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Inventory System",
    description: "Inventory Management System",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`
                ${poppins.variable}
                ${geistMono.variable}
                h-full
                antialiased
            `}
        >
            <body className="min-h-full flex flex-col">
                <QueryProvider>{children}</QueryProvider>

                <Toaster position="top-center" richColors />
            </body>
        </html>
    );
}
