"use client";

import { useState } from "react";
import { useIssues } from "@/lib/useIssues";
import { useDrafts, draftWords } from "@/lib/drafts";
import { generateStarter } from "@/lib/starter";
import { assemblePost } from "@/lib/assemble";

export default function Read() {
  const { list: issues } = useIssues();
  const { drafts, ready } = useDrafts();
  const [onlyWritten, setOnlyWritten] = useState(false);
  const [toast, setToast] = useState("");

  const rows = issues
    .map((i) => {
      const saved = drafts[i.n];
      const written = draftWords(saved) > 0;
      const draft = saved ?? generateStarter(i);
      return { issue: i, draft, written };
    })
    .filter((r) => (onlyWritten ? r.written : true));

  const seriesText = rows
    .map((r) => `# Issue ${r.issue.n} - ${r.issue.theme}\n\n${assemblePost(r.issue, r.draft, false)}`)
    .join("\n\n---\n\n");

  function copyAll() {
    navigator.clipboard.writeText(seriesText)
      .then(() => {
        setToast("copied the whole series");
        setTimeout(() => setToast(""), 1600);
      })
      .catch((err) => {
        console.error("clipboard failed:", err);
        setToast("copy failed - try again");
        setTimeout(() => setToast(""), 1600);
      });
  }

  function download() {
    const blob = new Blob([seriesText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zao-newsletter-series.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  const writtenCount = issues.filter((i) => draftWords(drafts[i.n]) > 0).length;

  return (
    <>
      <div className="headrow no-print">
        <div>
          <h1>Read the series</h1>
          <div className="sub">
            every issue as a clean post. print it, copy it, or export markdown.
          </div>
        </div>
      </div>

      <div className="filters no-print">
        <button
          className={"fbtn" + (!onlyWritten ? " on" : "")}
          onClick={() => setOnlyWritten(false)}
        >
          all 9
        </button>
        <button
          className={"fbtn" + (onlyWritten ? " on" : "")}
          onClick={() => setOnlyWritten(true)}
        >
          written only ({ready ? writtenCount : 0})
        </button>
        <span style={{ flex: 1 }} />
        <button className="mini" onClick={copyAll}>
          copy all
        </button>
        <button className="mini" onClick={download}>
          export .md
        </button>
        <button className="mini gold" onClick={() => window.print()}>
          print
        </button>
      </div>

      {rows.length === 0 && (
        <div className="sub no-print">no written issues yet. go compose one.</div>
      )}

      {rows.map((r) => (
        <article key={r.issue.n} className="post">
          <div className="posthead no-print">
            <span className="num">{r.issue.n}</span>
            <span className="theme">{r.issue.theme}</span>
            {!r.written && <span className="draftbadge starter">starter</span>}
          </div>
          <div className="postbody">{assemblePost(r.issue, r.draft, false)}</div>
        </article>
      ))}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
