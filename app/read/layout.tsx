import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Read the series - ZABAL Newsletter Builder",
  description:
    "Every issue as a clean post. Print, copy, or export the whole series as markdown.",
};

export default function ReadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
