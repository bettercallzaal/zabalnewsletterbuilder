"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { type IssueStatus } from "@/lib/issues";
import { voiceDo, voiceDont } from "@/lib/voice";
import { useStatuses } from "@/lib/useStatuses";
import { useDrafts, draftWords } from "@/lib/drafts";
import { useNotes } from "@/lib/notes";
import { useIssues } from "@/lib/useIssues";
import { downloadBackup, importState } from "@/lib/backup";
import { hasSupabase } from "@/lib/supabase";
import { pushCloud, pullCloud } from "@/lib/cloud";

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
  const { list, ready: issuesReady } = useIssues();
  const { statuses, cycle, reset, streak } = useStatuses();
  const { drafts } = useDrafts();
  const { notes, set: setNote } = useNotes();
  const [filter, setFilter] = useState<Filter>("all");
  const [openNotes, setOpenNotes] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const [workspace, setWorkspace] = useState("zabal");
  const [cloudBusy, setCloudBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const w = localStorage.getItem("znb.workspace");
    if (w) setWorkspace(w);
  }, []);

  function saveWorkspace(v: string) {
    setWorkspace(v);
    localStorage.setItem("znb.workspace", v);
  }

  async function doPush() {
    setCloudBusy(true);
    const res = await pushCloud(workspace);
    setCloudBusy(false);
    setToast(res.msg);
    setTimeout(() => setToast(""), 1800);
  }

  async function doPull() {
    setCloudBusy(true);
    const res = await pullCloud(workspace);
    setCloudBusy(false);
    setToast(res.msg);
    setTimeout(() => setToast(""), 1800);
    if (res.ok) setTimeout(() => window.location.reload(), 700);
  }

  const ready = issuesReady;
  const statusOf = (n: number, fallback: IssueStatus): IssueStatus =>
    statuses[n] ?? fallback;

  const shipped = list.filter((i) => statusOf(i.n, i.status) === "shipped").length;
  const nextIssue = list.find((i) => statusOf(i.n, i.status) !== "shipped") ?? null;
  const drafted = list.filter((i) => draftWords(drafts[i.n]) > 0).length;
  const shown = list.filter(
    (i) => filter === "all" || statusOf(i.n, i.status) === filter
  );
  const pct = list.length ? Math.round((shipped / list.length) * 100) : 0;

  function copyBrief(n: number) {
    const i = list.find((x) => x.n === n)!;
    const brief = `Issue ${i.n} - ${i.theme}\n\n${i.wins
      .map((w) => `- ${w}`)
      .join("\n")}\n\nZOE needs: ${i.need || "n/a"}`;
    navigator.clipboard.writeText(brief)
      .then(() => {
        setToast(`copied brief for issue ${n}`);
        setTimeout(() => setToast(""), 1500);
      })
      .catch((err) => {
        console.error("clipboard failed:", err);
        setToast("copy failed - try again");
        setTimeout(() => setToast(""), 1500);
      });
  }

  function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text()
      .then((text) => {
        const res = importState(text);
        setToast(res.msg);
        setTimeout(() => setToast(""), 1800);
        if (res.ok) setTimeout(() => window.location.reload(), 700);
      })
      .catch((err) => {
        console.error("file read failed:", err);
        setToast("import failed - try again");
        setTimeout(() => setToast(""), 1800);
      });
    e.target.value = "";
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
        <Link className="fbtn" href="/issues">
          manage issues
        </Link>
      </div>

      <div className="grid">
        <div className="stat">
          <div className="n">{list.length}</div>
          <div className="l">issues</div>
        </div>
        <div className="stat">
          <div className="n">{list.length * 3}</div>
          <div className="l">wins queued</div>
        </div>
        <div className="stat">
          <div className="n">{ready ? shipped : "-"}</div>
          <div className="l">shipped</div>
        </div>
        <div className="stat">
          <div className="n">{ready ? drafted : "-"}</div>
          <div className="l">drafts started</div>
        </div>
        <div className="stat">
          <div className="n">{ready ? `${pct}%` : "-"}</div>
          <div className="l">complete</div>
        </div>
      </div>
      <div className="barwrap">
        <div className="bar" style={{ width: `${ready ? pct : 0}%` }} />
      </div>

      {ready && nextIssue && (
        <div className="today">
          <div className="todaymain">
            <div className="todaylabel">Next up</div>
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

      <h2>The Pipeline</h2>
      {ready && list.length === 0 && (
        <div className="empty">
          no issues yet.{" "}
          <Link href="/issues" style={{ color: "var(--gold)" }}>
            add one
          </Link>{" "}
          to start the series.
        </div>
      )}
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
        const st = statusOf(i.n, i.status);
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
                  <span>{w || <em style={{ color: "var(--dim)" }}>empty</em>}</span>
                </li>
              ))}
            </ul>
            <div className="issuefoot">
              <div className="need">
                <b>ZOE needs:</b> {i.need || "n/a"}
              </div>
              <div className="issueactions">
                {draftWords(drafts[i.n]) > 0 && (
                  <span className="draftbadge">
                    draft {draftWords(drafts[i.n])}w
                  </span>
                )}
                {notes[i.n]?.trim() && (
                  <span className="notedot" title="has notes">
                    note
                  </span>
                )}
                <button
                  className="mini"
                  onClick={() =>
                    setOpenNotes(openNotes === i.n ? null : i.n)
                  }
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
        <button className="mini" onClick={reset} title="reset all statuses">
          reset statuses
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={onImport}
        />
      </div>

      <h2>Cloud sync</h2>
      {hasSupabase ? (
        <div className="databar">
          <span className="sub">sync this browser to the cloud under a workspace name.</span>
          <span style={{ flex: 1 }} />
          <input
            className="wsinput"
            value={workspace}
            onChange={(e) => saveWorkspace(e.target.value)}
            placeholder="workspace"
          />
          <button className="mini" onClick={doPush} disabled={cloudBusy}>
            push
          </button>
          <button className="mini gold" onClick={doPull} disabled={cloudBusy}>
            pull
          </button>
        </div>
      ) : (
        <div className="databar">
          <span className="sub">
            cloud sync is wired but not configured. add{" "}
            <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in Vercel, run the SQL in{" "}
            <code>supabase/schema.sql</code>, then redeploy.
          </span>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
