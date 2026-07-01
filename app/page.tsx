"use client";

import Link from "next/link";
import { useState } from "react";
import { issues, type IssueStatus } from "@/lib/issues";
import { voiceDo, voiceDont } from "@/lib/voice";
import { useStatuses } from "@/lib/useStatuses";
import { useDrafts, draftWords } from "@/lib/drafts";
import { useNotes } from "@/lib/notes";
import { downloadBackup, importState } from "@/lib/backup";
import { useRef } from "react";

const pillClass: Record<IssueStatus, string> = {
  next: "p-next",
  queued: "p-queued",
  draft: "p-draft",
  shipped: "p-shipped",
};
const pillText: Record<IssueStatus, string> = {
  next: "next up",
  queued: "queued",
  draft: "draft",
  shipped: "shipped",
};

type Filter = "all" | IssueStatus;
const filters: Filter[] = ["all", "next", "draft", "queued", "shipped"];

export default function Dashboard() {
  const { statuses, cycle, reset, ready, streak, nextIssue } = useStatuses();
  const { drafts } = useDrafts();
  const { notes, set: setNote } = useNotes();
  const [filter, setFilter] = useState<Filter>("all");
  const [openNotes, setOpenNotes] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      const res = importState(text);
      setToast(res.msg);
      setTimeout(() => setToast(""), 1800);
      if (res.ok) setTimeout(() => window.location.reload(), 700);
    });
    e.target.value = "";
  }
  const drafted = issues.filter((i) => draftWords(drafts[i.n]) > 0).length;

  const shipped = issues.filter((i) => statuses[i.n] === "shipped").length;
  const nextUp = issues.filter((i) => statuses[i.n] === "next").length;
  const shown = issues.filter(
    (i) => filter === "all" || statuses[i.n] === filter
  );
  const pct = Math.round((shipped / issues.length) * 100);

  function copyBrief(n: number) {
    const i = issues.find((x) => x.n === n)!;
    const brief = `Issue ${i.n} - ${i.theme}\n\n${i.wins
      .map((w) => `- ${w}`)
      .join("\n")}\n\nZOE needs: ${i.need}`;
    navigator.clipboard.writeText(brief).then(() => {
      setToast(`copied brief for issue ${n}`);
      setTimeout(() => setToast(""), 1500);
    });
  }

  return (
    <>
      <div className="headrow">
        <div>
          <h1>
            <span style={{ color: "var(--gold)" }}>ZM.</span> Newsletter Control
          </h1>
          <div className="sub">
            daily-3 loop. one issue = 3 wins, in ZAO voice. click a status to
            advance it.
          </div>
        </div>
        <button className="fbtn" onClick={reset} title="reset all statuses">
          reset
        </button>
      </div>

      <div className="grid">
        <div className="stat">
          <div className="n">{issues.length}</div>
          <div className="l">issues</div>
        </div>
        <div className="stat">
          <div className="n">{issues.length * 3}</div>
          <div className="l">wins queued</div>
        </div>
        <div className="stat">
          <div className="n">{ready ? nextUp : "-"}</div>
          <div className="l">next up</div>
        </div>
        <div className="stat">
          <div className="n">{ready ? shipped : "-"}</div>
          <div className="l">shipped</div>
        </div>
        <div className="stat">
          <div className="n">{ready ? drafted : "-"}</div>
          <div className="l">drafts started</div>
        </div>
      </div>
      <div className="barwrap">
        <div className="bar" style={{ width: `${ready ? pct : 0}%` }} />
      </div>

      {ready && nextIssue && (
        <div className="today">
          <div className="todaymain">
            <div className="todaylabel">Today</div>
            <div className="todayissue">
              Issue {nextIssue.n}: {nextIssue.theme}
            </div>
            <div className="todaywins">{nextIssue.wins.join(" · ")}</div>
          </div>
          <div className="todayside">
            <div className="streak">
              <span className="streaknum">{streak}</span>
              <span className="streaklbl">day streak</span>
            </div>
            <Link className="mini gold" href={`/builder?issue=${nextIssue.n}`}>
              write it
            </Link>
          </div>
        </div>
      )}
      {ready && !nextIssue && (
        <div className="today">
          <div className="todaymain">
            <div className="todaylabel">Series complete</div>
            <div className="todayissue">all 9 issues shipped. keep building.</div>
          </div>
          <div className="todayside">
            <div className="streak">
              <span className="streaknum">{streak}</span>
              <span className="streaklbl">day streak</span>
            </div>
          </div>
        </div>
      )}

      <h2>The Pipeline</h2>
      <div className="filters">
        {filters.map((f) => (
          <button
            key={f}
            className={"fbtn" + (filter === f ? " on" : "")}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {shown.map((i) => {
        const st = statuses[i.n];
        return (
          <div key={i.n} className={"issue" + (st === "shipped" ? " done" : "")}>
            <div className="ihead">
              <div className="num">{i.n}</div>
              <div className="theme">{i.theme}</div>
              <button
                className={"pill pillbtn " + pillClass[st]}
                onClick={() => cycle(i.n)}
                title="click to advance status"
              >
                {pillText[st]}
              </button>
            </div>
            <ul className="wins">
              {i.wins.map((w, idx) => (
                <li key={idx}>
                  <span className="dot">-</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
            <div className="issuefoot">
              <div className="need">
                <b>ZOE needs:</b> {i.need}
              </div>
              <div className="issueactions">
                {draftWords(drafts[i.n]) > 0 && (
                  <span className="draftbadge">
                    draft {draftWords(drafts[i.n])}w
                  </span>
                )}
                {notes[i.n]?.trim() && <span className="notedot" title="has notes">note</span>}
                <button
                  className="mini"
                  onClick={() => setOpenNotes(openNotes === i.n ? null : i.n)}
                >
                  {openNotes === i.n ? "hide notes" : "notes"}
                </button>
                <button className="mini" onClick={() => copyBrief(i.n)}>
                  copy brief
                </button>
                <Link className="mini gold" href={`/builder?issue=${i.n}`}>
                  {draftWords(drafts[i.n]) > 0 ? "edit" : "compose"}
                </Link>
              </div>
            </div>
            {openNotes === i.n && (
              <textarea
                className="notesarea"
                value={notes[i.n] ?? ""}
                placeholder="what landed, what to change next time, an angle that resonated..."
                onChange={(e) => setNote(i.n, e.target.value)}
              />
            )}
          </div>
        );
      })}

      <h2>Format + Voice</h2>
      <div className="cardrow">
        <div className="card">
          <h3>Every issue</h3>
          <ul>
            {voiceDo.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Never</h3>
          <ul>
            {voiceDont.map((v, i) => (
              <li key={i} className="bad">
                {v}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h2>Data</h2>
      <div className="databar">
        <span className="sub">
          your work lives in this browser. back it up or move it to another
          device.
        </span>
        <span style={{ flex: 1 }} />
        <button className="mini" onClick={downloadBackup}>
          export backup
        </button>
        <button className="mini gold" onClick={() => fileRef.current?.click()}>
          import
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={onImport}
        />
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
