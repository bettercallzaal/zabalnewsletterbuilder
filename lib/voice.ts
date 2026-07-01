// The ZAO voice guardrails. Source: .claude/skills/zao-os/brand-voice.md,
// bot/src/zoe/brand.md, .claude/skills/newsletter/voice-reference.md.

export const voiceDo: string[] = [
  'Open "ZM." + one line naming the day\'s theme',
  "3 wins, each 2-4 short paragraphs. Lead with the build",
  "Real numbers. Credit people by name. One link/embed per win",
  "Lowercase-casual sentences, proper nouns capped",
  'Close on one quiet line. Sign "- BetterCallZaal on behalf of the ZABAL Team"',
  "~300-450 words. Phone-readable",
];

export const voiceDont: string[] = [
  "no emojis, no em dashes",
  'no "excited to announce", leverage, synergy',
  "no bullet-list-as-post (prose paragraphs only)",
  'no CTA labels ("check it out", "link in bio")',
];

export const voicePhrases: string[] = [
  "the quiet work compounds",
  "builders building for builders",
  "keep building",
  "consistency every day is the best you can do",
];

// Words the composer flags as off-voice.
export const bannedWords: string[] = [
  "excited to announce",
  "leverage",
  "synergy",
  "thrilled",
  "game-changer",
  "unlock value",
  "paradigm shift",
  "—",
];

export const signOff = "- BetterCallZaal on behalf of the ZABAL Team";
