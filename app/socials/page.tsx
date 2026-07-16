"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useIssues } from "@/lib/useIssues";
import { useDrafts } from "@/lib/drafts";
import { generateStarter } from "@/lib/starter";
import { generatePosts, type SocialPost } from "@/lib/socials";

function SocialsInner() {
  const params = useSearchParams();
  const { list } = useIssues();
  const { drafts, ready } = useDrafts();

  const initial = Math.max(
    0,
    list.findIndex((i) => String(i.n) === params.get("issue"))
  );
  const [idx, setIdx] = useState(initial);
  const issue = list[idx] ?? list[0];

  const [link, setLink] = useState("");
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    const l = localStorage.getItem("znb.livelink");
    if (l) setLink(l);
  }, []);
  function saveLink(v: string) {
    setLink(v);
    localStorage.setItem("znb.livelink", v);
  }

  const draft = (ready && drafts[issue?.n]) || (issue && generateStarter(issue));

  const posts: SocialPost[] = useMemo(
    () => (issue && draft ? generatePosts(issue, draft, link) : []),
    [issue, draft, link]
  );

  // reset edits when the issue changes
  useEffect(() => {
    setEdited({});
  }, [idx]);

  function textFor(p: SocialPost) {
    return edited[p.key] ?? p.text;
  }
  function copy(p: SocialPost) {
    navigator.clipboard.writeText(textFor(p))
      .then(() => {
        setToast(`copied ${p.label}`);
        setTimeout(() => setToast(""), 1400);
      })
      .catch((err) => {
        console.error("clipboard failed:", err);
        setToast("copy failed - try again");
        setTimeout(() => setToast(""), 1400);
      });
  }
  function copyAll() {
    const all = posts.map((p) => `${p.label}\n\n${textFor(p)}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(all)
      .then(() => {
        setToast("copied all posts");
        setTimeout(() => setToast(""), 1400);
      })
      .catch((err) => {
        console.error("clipboard failed:", err);
        setToast("copy failed - try again");
        setTimeout(() => setToast(""), 1400);
      });
  }

  if (!issue) return <div className="sub">no issues. add one in Manage.</div>;

  return (
    <>
      <h1>Socials</h1>
      <div className="sub">
        the day&apos;s posts in posting order, built from the issue. edit, then
        copy. Zaal posts them - nothing auto-posts.
      </div>

      <div className="composer" style={{ gridTemplateColumns: "1fr" }}>
        <div className="socialbar">
          <div>
            <label>Issue</label>
            <select value={idx} onChange={(e) => setIdx(Number(e.target.value))}>
              {list.map((it, i) => (
                <option key={it.n} value={i}>
                  {it.n}. {it.theme}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Live link (optional)</label>
            <input
              value={link}
              onChange={(e) => saveLink(e.target.value)}
              placeholder="zabalnewsletterbuilder.vercel.app"
            />
          </div>
          <button className="btn" onClick={copyAll} style={{ alignSelf: "end" }}>
            Copy all
          </button>
        </div>
      </div>

      {posts.map((p) => {
        const text = textFor(p);
        const over = p.limit ? text.length > p.limit : false;
        return (
          <div key={p.key} className="xpost">
            <div className="posthead" style={{ border: "none", padding: 0, marginBottom: 8 }}>
              <span className="theme" style={{ fontSize: 14 }}>
                {p.label}
              </span>
              {p.limit && (
                <span
                  className="wc"
                  style={{ marginLeft: "auto", color: over ? "var(--red)" : "var(--dim)" }}
                >
                  {text.length}/{p.limit}
                  {over ? " (over)" : ""}
                </span>
              )}
            </div>
            <textarea
              value={text}
              onChange={(e) =>
                setEdited((s) => ({ ...s, [p.key]: e.target.value }))
              }
            />
            <div className="xfoot">
              <span className="wc">{text.length} chars</span>
              <button className="mini gold" onClick={() => copy(p)}>
                copy
              </button>
            </div>
          </div>
        );
      })}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

export default function Socials() {
  return (
    <Suspense fallback={<div className="sub">loading socials...</div>}>
      <SocialsInner />
    </Suspense>
  );
}
