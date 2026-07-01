import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import CommandPalette from "./CommandPalette";

export const metadata: Metadata = {
  title: "ZABAL Newsletter Builder",
  description:
    "The ZAO daily-3 newsletter. Pipeline dashboard + issue composer in ZAO voice.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <Link href="/" className="brand">
            <span className="zm">ZM.</span> Newsletter Builder
          </Link>
          <div className="navlinks">
            <Link href="/">Pipeline</Link>
            <Link href="/builder">Compose</Link>
            <Link href="/read">Read</Link>
            <kbd className="kbdhint">Cmd K</kbd>
          </div>
        </nav>
        <CommandPalette />
        <main className="wrap">{children}</main>
      </body>
    </html>
  );
}
