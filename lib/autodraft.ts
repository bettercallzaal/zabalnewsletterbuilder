import { supabase, SYNC_TABLE } from "@/lib/supabase";
import type { Draft } from "@/lib/drafts";
import type { Issue } from "@/lib/issues";

// The overnight cron's output lands in the same newsletter_state table the
// cloud sync already uses, under its own workspace keys - never the user's
// workspace row, so a nightly write can't clobber Zaal's edits.
export const AUTO_DRAFT_LATEST = "auto-draft:latest";

export interface AutoDraftRow {
  date: string; // YYYY-MM-DD
  issueNumber: number;
  draft: Draft;
  post: string;
  words: number;
  score: number;
  title: string;
  generated_at: string;
}

export function autoDraftWorkspace(date: Date): string {
  return `auto-draft:${date.toISOString().slice(0, 10)}`;
}

export function buildAutoDraftRow(args: {
  issue: Issue;
  draft: Draft;
  post: string;
  words: number;
  score: number;
  title: string;
  now: Date;
}): AutoDraftRow {
  return {
    date: args.now.toISOString().slice(0, 10),
    issueNumber: args.issue.n,
    draft: args.draft,
    post: args.post,
    words: args.words,
    score: args.score,
    title: args.title,
    generated_at: args.now.toISOString(),
  };
}

export interface AutoDraftResult {
  ok: boolean;
  msg: string;
}

// Persist under both the dated key (history) and the latest key (what the
// builder loads). A missing Supabase config is reported loudly, not swallowed.
export async function saveAutoDraft(row: AutoDraftRow): Promise<AutoDraftResult> {
  if (!supabase) return { ok: false, msg: "cloud not configured" };
  const stamp = new Date(row.generated_at).toISOString();
  const { error } = await supabase.from(SYNC_TABLE).upsert([
    { workspace: autoDraftWorkspace(new Date(row.generated_at)), data: row, updated_at: stamp },
    { workspace: AUTO_DRAFT_LATEST, data: row, updated_at: stamp },
  ]);
  return error ? { ok: false, msg: error.message } : { ok: true, msg: "auto-draft persisted" };
}

export async function loadLatestAutoDraft(): Promise<AutoDraftRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from(SYNC_TABLE)
    .select("data")
    .eq("workspace", AUTO_DRAFT_LATEST)
    .maybeSingle();
  if (error || !data) return null;
  return data.data as AutoDraftRow;
}
