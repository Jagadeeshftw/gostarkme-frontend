import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { StarknetProvider } from "@/components/starknetProvider";

const inter = Inter({ subsets: ["latin"] });

const helvetica = localFont({
    src: "../public/fonts/Helvetica-Light.ttf",
});

export const metadata: Metadata = {
    title: "Go Stark Me",
    description: "Fund recollecting in Starknet",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
      <html lang="en">
        <StarknetProvider>
          <body className={helvetica.className}>{children}</body>
        </StarknetProvider>
      </html>
    );
}
