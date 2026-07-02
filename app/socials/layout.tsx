import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Socials - ZABAL Newsletter Builder",
  description:
    "The day's posts in posting order (Firefly, X, Farcaster, Telegram, Discord, LinkedIn, Facebook), built from the issue.",
};

export default function SocialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
