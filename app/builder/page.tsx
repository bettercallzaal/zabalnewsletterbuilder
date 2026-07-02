"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useIssues } from "@/lib/useIssues";
import { voicePhrases } from "@/lib/voice";
import { useDrafts, type Draft } from "@/lib/drafts";
import { generateStarter } from "@/lib/starter";
import { assemblePost } from "@/lib/assemble";
import { scorePost } from "@/lib/score";
import { toFarcaster, toXThread } from "@/lib/variants";
import { zabalTitle } from "@/lib/title";

function BuilderInner() {
  const params = useSearchParams();
  const { list: issues } = useIssues();
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
  const [title, setTitle] = useState("");

  // computed client-side to avoid a build-time date (and hydration mismatch)
  useEffect(() => {
    setTitle(zabalTitle(new Date()));
  }, []);

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
  const scored = useMemo(() => scorePost(post), [post]);
  const [tab, setTab] = useState<"news" | "fc" | "x">("news");
  const fc = useMemo(
    () => toFarcaster(issue, { themeLine, blocks, closer }),
    [issue, themeLine, blocks, closer]
  );
  const xThread = useMemo(() => toXThread(post), [post]);

  function copyText(text: string, label = "copied") {
    navigator.clipboard.writeText(text).then(() => {
      setToast(label);
      setTimeout(() => setToast(""), 1500);
    });
  }
  function copy() {
    copyText(post);
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

      {title && (
        <div className="databar" style={{ marginTop: 12 }}>
          <span className="sub">Paragraph title</span>
          <strong style={{ color: "var(--gold)" }}>{title}</strong>
          <span style={{ flex: 1 }} />
          <button
            className="mini gold"
            onClick={() => copyText(title, "copied title")}
          >
            copy title
          </button>
        </div>
      )}

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
          <div className="vtabs">
            <button
              className={"vtab" + (tab === "news" ? " on" : "")}
              onClick={() => setTab("news")}
            >
              Newsletter
            </button>
            <button
              className={"vtab" + (tab === "fc" ? " on" : "")}
              onClick={() => setTab("fc")}
            >
              Farcaster
            </button>
            <button
              className={"vtab" + (tab === "x" ? " on" : "")}
              onClick={() => setTab("x")}
            >
              X thread
            </button>
          </div>

          {tab === "fc" && (
            <div>
              <div className="preview">{fc}</div>
              <div className="wc">
                {fc.length}/1024 chars
                {fc.length > 1024 ? " (over)" : ""}
              </div>
              <div className="btnrow">
                <button
                  className="btn"
                  onClick={() => copyText(fc, "copied cast")}
                >
                  Copy cast
                </button>
              </div>
            </div>
          )}

          {tab === "x" && (
            <div>
              {xThread.map((t, i) => (
                <div key={i} className="xpost">
                  <div className="xbody">{t}</div>
                  <div className="xfoot">
                    <span className="wc">{t.length}/280</span>
                    <button
                      className="mini"
                      onClick={() => copyText(t, `copied ${i + 1}/${xThread.length}`)}
                    >
                      copy
                    </button>
                  </div>
                </div>
              ))}
              <div className="btnrow">
                <button
                  className="btn"
                  onClick={() =>
                    copyText(xThread.join("\n\n"), "copied full thread")
                  }
                >
                  Copy full thread
                </button>
              </div>
            </div>
          )}

          {tab === "news" && (
          <>
          <div className="preview">{post}</div>
          <div className="wc">{words} words</div>

          <div className="scorepanel">
            <div className="scorehead">
              <span
                className={
                  "scoreval " +
                  (scored.score >= 80
                    ? "s-good"
                    : scored.score >= 50
                    ? "s-mid"
                    : "s-low")
                }
              >
                {scored.score}
              </span>
              <span className="scorelbl">voice score</span>
            </div>
            <ul className="checks">
              {scored.checks.map((c, i) => (
                <li key={i} className={c.pass ? "ok" : "no"}>
                  <span className="ck">{c.pass ? "+" : "-"}</span>
                  {c.label}
                </li>
              ))}
            </ul>
          </div>
          </>
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
