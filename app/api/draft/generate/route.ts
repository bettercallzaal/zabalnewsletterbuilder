import { NextRequest, NextResponse } from "next/server";
import { issues } from "@/lib/issues";
import { generateStarter } from "@/lib/starter";
import { assemblePost, wordCount } from "@/lib/assemble";
import { scorePost } from "@/lib/score";
import { zabalTitle } from "@/lib/title";
import type { Draft } from "@/lib/drafts";

/**
 * POST /api/draft/generate
 *
 * Auto-generates a draft for a daily-3 newsletter issue.
 * Used by scheduled Vercel cron jobs or manual triggers.
 *
 * Query params:
 *   issueNumber (optional): which issue (1-9) to draft. If omitted, picks the first "next" status issue.
 *
 * Returns:
 *   {
 *     success: boolean
 *     draft: Draft (themeLine, blocks, closer)
 *     issue: Issue (n, theme, status, wins, need)
 *     post: string (the assembled full post)
 *     words: number (word count of the post)
 *     score: number (0-100 voice score)
 *     title: string (the Paragraph title for today)
 *     generated_at: ISO timestamp
 *   }
 *
 * IMPORTANT: This endpoint only GENERATES the draft. It does NOT:
 *   - Save to localStorage (client-side only)
 *   - Auto-publish (always draft status)
 *   - Send to Paragraph or any social
 *
 * The generated draft is returned for Zaal to review and manually save/publish.
 */
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const issueNumberParam = url.searchParams.get("issueNumber");

    // Determine which issue to draft
    let targetIssue = null;
    if (issueNumberParam) {
      const num = Number.parseInt(issueNumberParam);
      targetIssue = issues.find((i) => i.n === num);
      if (!targetIssue) {
        return NextResponse.json(
          {
            success: false,
            error: `Issue ${num} not found. Valid issues: ${issues.map((i) => i.n).join(", ")}`,
          },
          { status: 400 }
        );
      }
    } else {
      // Pick the first issue with "next" status, or the first one if none are "next"
      targetIssue =
        issues.find((i) => i.status === "next") ||
        issues.find((i) => i.status === "draft") ||
        issues[0];
    }

    if (!targetIssue) {
      return NextResponse.json(
        {
          success: false,
          error: "No issues available to draft",
        },
        { status: 400 }
      );
    }

    // Generate the starter draft
    const draft: Draft = generateStarter(targetIssue);

    // Assemble the full post (no placeholders in generated drafts)
    const post = assemblePost(targetIssue, draft, false);

    // Score the post
    const scored = scorePost(post);

    // Generate the title (using today's date)
    const title = zabalTitle(new Date());

    return NextResponse.json({
      success: true,
      draft,
      issue: targetIssue,
      post,
      words: wordCount(post),
      score: scored.score,
      title,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to generate draft:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/draft/generate
 *
 * Same as POST for convenience when called by Vercel cron or external triggers.
 */
export async function GET(request: NextRequest) {
  return POST(request);
}
