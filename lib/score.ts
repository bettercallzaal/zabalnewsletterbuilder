import { bannedWords } from "@/lib/voice";

export interface Check {
  label: string;
  pass: boolean;
}

export interface Scored {
  score: number;
  checks: Check[];
}

// Grade an assembled post against the ZAO voice rules. 0-100.
export function scorePost(post: string): Scored {
  const lower = post.toLowerCase();
  const words = post.trim().split(/\s+/).filter(Boolean).length;
  const hasBanned = bannedWords.some((w) => lower.includes(w.toLowerCase()));
  const hasEmoji = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(post);
  const hasEmDash = post.includes("—");
  const paras = post.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const longParas = paras.filter((p) => p.split(/\s+/).length > 55).length;
  const noTodo = !/\[todo\]|\[write |\[theme line\]|\[lead with/i.test(post);

  const checks: Check[] = [
    { label: 'opens with "ZM."', pass: post.trimStart().startsWith("ZM.") },
    { label: "all win blocks written (no placeholders)", pass: noTodo },
    { label: "length 250-480 words", pass: words >= 250 && words <= 480 },
    { label: "has at least one real number", pass: /\d/.test(post) },
    { label: "includes a link", pass: /https?:\/\/|\.com|\.xyz|\.online|\.fund/i.test(post) },
    { label: "short paragraphs (none over ~55 words)", pass: longParas === 0 },
    { label: "no emojis", pass: !hasEmoji },
    { label: "no em dashes", pass: !hasEmDash },
    { label: "no hype words", pass: !hasBanned },
    { label: "signs off as the ZABAL Team", pass: /ZABAL Team/.test(post) },
  ];

  const passed = checks.filter((c) => c.pass).length;
  const score = Math.round((passed / checks.length) * 100);
  return { score, checks };
}
