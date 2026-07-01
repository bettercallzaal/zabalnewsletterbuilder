import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compose - ZABAL Newsletter Builder",
  description:
    "Draft a daily-3 issue in ZAO voice with a live voice score, plus Farcaster and X variants.",
};

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
