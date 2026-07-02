import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(url && key);

// Null when env vars are not set, so the app runs localStorage-only until wired.
export const supabase: SupabaseClient | null = url && key
  ? createClient(url, key)
  : null;

export const SYNC_TABLE = "newsletter_state";
