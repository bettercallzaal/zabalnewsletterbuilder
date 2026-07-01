"use client";

import { supabase, SYNC_TABLE } from "@/lib/supabase";
import { exportState, importState } from "@/lib/backup";

export interface CloudResult {
  ok: boolean;
  msg: string;
}

// Push all local state to the cloud under a workspace key (last-write-wins).
export async function pushCloud(workspace: string): Promise<CloudResult> {
  if (!supabase) return { ok: false, msg: "cloud not configured" };
  const ws = workspace.trim() || "default";
  const { error } = await supabase.from(SYNC_TABLE).upsert({
    workspace: ws,
    data: exportState(),
    updated_at: new Date().toISOString(),
  });
  return error ? { ok: false, msg: error.message } : { ok: true, msg: "pushed to cloud" };
}

// Pull cloud state for a workspace into localStorage. Caller reloads on ok.
export async function pullCloud(workspace: string): Promise<CloudResult> {
  if (!supabase) return { ok: false, msg: "cloud not configured" };
  const ws = workspace.trim() || "default";
  const { data, error } = await supabase
    .from(SYNC_TABLE)
    .select("data")
    .eq("workspace", ws)
    .maybeSingle();
  if (error) return { ok: false, msg: error.message };
  if (!data) return { ok: false, msg: "no cloud state for this workspace" };
  return importState(JSON.stringify(data.data));
}
