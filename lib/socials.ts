import type { Issue } from "@/lib/issues";
import type { Draft } from "@/lib/drafts";

export interface SocialPost {
  key: string;
  label: string;
  text: string;
  limit?: number; // char limit to show/enforce (Firefly)
}

const lc = (s: string) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const strip = (s: string) => s.trim().replace(/[.\s]+$/, "");

// Generate the day's posts in posting order from an issue + its draft.
// Editable starting drafts - Zaal refines, then copies. Never auto-posts.
export function generatePosts(
  issue: Issue,
  draft: Draft,
  link: string
): SocialPost[] {
  const theme = strip(draft.themeLine) || strip(issue.theme);
  const wins = issue.wins.map((w) => strip(w)).filter(Boolean);
  const w0 = wins[0] ?? "";
  const linkPart = link.trim() ? ` ${link.trim()}` : "";

  // Firefly: punchy, <=280. Drop the middle sentence if over.
  let firefly = `ZM. ${theme}. ${lc(w0)}. a PR that adds one small thing is a submission.${linkPart}`;
  if (firefly.length > 280) firefly = `ZM. ${theme}. ${lc(w0)}.${linkPart}`;
  if (firefly.length > 280) firefly = `ZM. ${theme}.${linkPart}`;

  const xgc = `ZM. ${theme}. ${wins.map(lc).join(", ")}. grab any lab repo and add one small thing, a PR is a submission.${linkPart}`;

  const fcgc = `ZM. ${theme}. ${lc(w0)}. pick any lab repo and open a small PR, that counts as a submission.${linkPart}`;

  const telegram = `ZM. ${theme}. ${lc(w0)}. a PR that adds one small thing is a submission.${linkPart}`;

  const discord = `ZM. ${theme}. ${lc(w0)}. easiest way in: pick any lab repo, add one small thing, open a PR. what would you add first?${linkPart}`;

  const linkedin = `ZM. ${theme}. The ZAO is a decentralized network for independent artists. ${cap(w0)}. the invite is simple: add one small thing to any project and open a pull request. that is a submission.${
    link.trim() ? `\n\n${link.trim()}` : ""
  }`;

  const facebook = `ZM. ${theme}. small contributions count here. ${lc(w0)}. if you can add one little improvement to a project, that is a win.${linkPart}`;

  return [
    { key: "firefly", label: "Firefly (Farcaster + X)", text: firefly, limit: 280 },
    { key: "xgc", label: "X group chat", text: xgc },
    { key: "fcgc", label: "Farcaster /zao group chat", text: fcgc },
    { key: "telegram", label: "Telegram", text: telegram },
    { key: "discord", label: "Discord", text: discord },
    { key: "linkedin", label: "LinkedIn", text: linkedin },
    { key: "facebook", label: "Facebook", text: facebook },
  ];
}
