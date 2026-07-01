"use client";

import { useState } from "react";
import { issues, type IssueStatus } from "@/lib/issues";
import { voiceDo, voiceDont } from "@/lib/voice";

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
const filters: Filter[] = ["all", "next", "draft", "shipped"];

export default function Dashboard() {
  const [filter, setFilter] = useState<Filter>("all");
  const shipped = issues.filter((i) => i.status === "shipped").length;
  const shown = issues.filter((i) => filter === "all" || i.status === filter);
  const pct = Math.round((shipped / issues.length) * 100);

  return (
    <>
      <h1>
        <span style={{ color: "var(--gold)" }}>ZM.</span> Newsletter Control
      </h1>
      <div className="sub">
        daily-3 loop, reframed from the Q2 recap. one issue = 3 wins, in ZAO
        voice.
      </div>

      <div className="grid">
        <div className="stat">
          <div className="n">{issues.length}</div>
          <div className="l">issues to cover Q2</div>
        </div>
        <div className="stat">
          <div className="n">{issues.length * 3}</div>
          <div className="l">wins queued</div>
        </div>
        <div className="stat">
          <div className="n">{issues.filter((i) => i.status === "next").length}</div>
          <div className="l">next up</div>
        </div>
        <div className="stat">
          <div className="n">{shipped}</div>
          <div className="l">shipped</div>
        </div>
        <div className="stat">
          <div className="n">~350</div>
          <div className="l">words per issue</div>
        </div>
      </div>
      <div className="barwrap">
        <div className="bar" style={{ width: `${pct}%` }} />
      </div>
      <div className="sub" style={{ marginTop: 6 }}>
        {shipped} of {issues.length} shipped. sequence ordered biggest-first.
      </div>

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

      {shown.map((i) => (
        <div
          key={i.n}
          className={"issue" + (i.status === "shipped" ? " done" : "")}
        >
          <div className="ihead">
            <div className="num">{i.n}</div>
            <div className="theme">{i.theme}</div>
            <span className={"pill " + pillClass[i.status]}>
              {pillText[i.status]}
            </span>
          </div>
          <ul className="wins">
            {i.wins.map((w, idx) => (
              <li key={idx}>
                <span className="dot">-</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
          <div className="need">
            <b>ZOE needs:</b> {i.need}
          </div>
        </div>
      ))}

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
    </>
  );
}
