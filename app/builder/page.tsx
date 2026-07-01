"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { issues } from "@/lib/issues";
import { bannedWords, voicePhrases } from "@/lib/voice";
import { useDrafts, type Draft } from "@/lib/drafts";
import { generateStarter } from "@/lib/starter";
import { assemblePost } from "@/lib/assemble";

function BuilderInner() {
  const params = useSearchParams();
  const { drafts, save, ready } = useDrafts();
  const initial = Math.max(
    0,
    issues.findIndex((i) => String(i.n) === params.get("issue"))
  );

  const [idx, setIdx] = useState(initial);
  const issue = issues[idx];
  const seed = generateStarter(issues[initial]);

  const [themeLine, setThemeLine] = useState(seed.themeLine);
  const [blocks, setBlocks] = useState<string[]>(seed.blocks);
  const [closer, setCloser] = useState(seed.closer);
  const [toast, setToast] = useState("");
  const [saved, setSaved] = useState(false);

  // load the saved draft for an issue, or open a starter pre-filled from its wins
  function loadDraft(n: number) {
    const d = drafts[n];
    const it = issues.find((x) => x.n === n)!;
    const base = d ?? generateStarter(it);
    setThemeLine(base.themeLine);
    setBlocks(base.blocks.length === 3 ? base.blocks : ["", "", ""]);
    setCloser(base.closer);
  }

  function regenStarter() {
    const gen = generateStarter(issue);
    setThemeLine(gen.themeLine);
    setBlocks(gen.blocks);
    setCloser(gen.closer);
    setToast("starter regenerated");
    setTimeout(() => setToast(""), 1500);
  }

  // once drafts have loaded from storage, hydrate the current issue's draft
  useEffect(() => {
    if (ready) loadDraft(issue.n);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // if the ?issue param changes, follow it and load that draft
  useEffect(() => {
    const q = issues.findIndex((i) => String(i.n) === params.get("issue"));
    if (q >= 0) {
      setIdx(q);
      if (ready) loadDraft(issues[q].n);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  function pickIssue(newIdx: number) {
    setIdx(newIdx);
    loadDraft(issues[newIdx].n);
  }

  function saveDraft() {
    const d: Draft = { themeLine, blocks, closer };
    save(issue.n, d);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    setToast(`saved draft for issue ${issue.n}`);
    setTimeout(() => setToast(""), 1500);
  }

  const post = useMemo(
    () => assemblePost(issue, { themeLine, blocks, closer }, true),
    [issue, themeLine, blocks, closer]
  );

  const words = post.trim().split(/\s+/).filter(Boolean).length;

  const flags = useMemo(() => {
    const lower = post.toLowerCase();
    const out: string[] = [];
    for (const w of bannedWords) {
      if (lower.includes(w.toLowerCase())) out.push(`off-voice: "${w}"`);
    }
    if (/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(post))
      out.push("emoji detected - remove it");
    if (words > 480) out.push(`long: ${words} words (aim ~300-450)`);
    return out;
  }, [post, words]);

  function copy() {
    navigator.clipboard.writeText(post).then(() => {
      setToast("copied");
      setTimeout(() => setToast(""), 1500);
    });
  }

  function setBlock(i: number, val: string) {
    setBlocks((b) => b.map((x, j) => (j === i ? val : x)));
  }

  return (
    <>
      <h1>Compose an issue</h1>
      <div className="sub">
        pick an issue, draft the 3 win blocks, watch it assemble in voice. copy
        when it reads right.
      </div>

      <div className="composer">
        <div>
          <label>Issue</label>
          <select value={idx} onChange={(e) => pickIssue(Number(e.target.value))}>
            {issues.map((it, i) => (
              <option key={it.n} value={i}>
                {it.n}. {it.theme}
              </option>
            ))}
          </select>

          <label>Theme line (after ZM.)</label>
          <input value={themeLine} onChange={(e) => setThemeLine(e.target.value)} />

          {issue.wins.map((w, i) => (
            <div key={i}>
              <label>
                Win {i + 1}: {w}
              </label>
              <textarea
                value={blocks[i]}
                placeholder="lead with the build. real numbers. credit people by name. one link per win."
                onChange={(e) => setBlock(i, e.target.value)}
              />
            </div>
          ))}

          <label>Closing line</label>
          <input value={closer} onChange={(e) => setCloser(e.target.value)} />

          <div className="wc">
            phrases you reach for: {voicePhrases.join(" · ")}
          </div>
        </div>

        <div>
          <label>Preview</label>
          <div className="preview">{post}</div>
          <div className="wc">{words} words</div>
          {flags.length > 0 && (
            <div className="flags">
              {flags.map((f, i) => (
                <div key={i} className="flag">
                  {f}
                </div>
              ))}
            </div>
          )}
          <div className="btnrow">
            <button className="btn" onClick={copy}>
              Copy post
            </button>
            <button className="btn ghost" onClick={saveDraft}>
              {saved ? "Saved" : "Save draft"}
            </button>
            <button className="btn ghost" onClick={regenStarter}>
              Regenerate starter
            </button>
            <span className="wc" style={{ alignSelf: "center" }}>
              ZOE needs: {issue.need}
            </span>
          </div>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

export default function Builder() {
  return (
    <Suspense fallback={<div className="sub">loading composer...</div>}>
      <BuilderInner />
    </Suspense>
  );
}
