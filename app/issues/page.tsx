"use client";

import Link from "next/link";
import { useState } from "react";
import { useIssues } from "@/lib/useIssues";

export default function ManageIssues() {
  const { list, addIssue, updateIssue, deleteIssue, move, reset } = useIssues();
  const [editing, setEditing] = useState<number | null>(null);
  const [newTheme, setNewTheme] = useState("");
  const [newWins, setNewWins] = useState<string[]>(["", "", ""]);

  function add() {
    if (!newTheme.trim()) return;
    addIssue(
      newTheme.trim(),
      newWins.map((w) => w.trim()).filter(Boolean)
    );
    setNewTheme("");
    setNewWins(["", "", ""]);
  }

  return (
    <>
      <div className="headrow">
        <div>
          <h1>Manage issues</h1>
          <div className="sub">
            reorder, edit, add or remove issues. changes save to this browser.
          </div>
        </div>
        <Link className="fbtn" href="/">
          back to pipeline
        </Link>
      </div>

      <h2>Sequence</h2>
      {list.map((i, idx) => (
        <div key={i.n} className="issue">
          <div className="ihead">
            <div className="num">{i.n}</div>
            {editing === i.n ? (
              <input
                className="editinput"
                defaultValue={i.theme}
                onBlur={(e) => updateIssue(i.n, { theme: e.target.value })}
              />
            ) : (
              <div className="theme">{i.theme}</div>
            )}
            <div className="issueactions" style={{ marginLeft: "auto" }}>
              <button
                className="mini"
                disabled={idx === 0}
                onClick={() => move(i.n, -1)}
              >
                up
              </button>
              <button
                className="mini"
                disabled={idx === list.length - 1}
                onClick={() => move(i.n, 1)}
              >
                down
              </button>
              <button
                className="mini"
                onClick={() => setEditing(editing === i.n ? null : i.n)}
              >
                {editing === i.n ? "done" : "edit"}
              </button>
              <button className="mini danger" onClick={() => deleteIssue(i.n)}>
                delete
              </button>
            </div>
          </div>

          {editing === i.n ? (
            <div style={{ marginTop: 10 }}>
              {[0, 1, 2].map((w) => (
                <input
                  key={w}
                  className="editinput"
                  style={{ marginTop: 6 }}
                  defaultValue={i.wins[w] ?? ""}
                  placeholder={`win ${w + 1}`}
                  onBlur={(e) => {
                    const wins = [...i.wins];
                    wins[w] = e.target.value;
                    updateIssue(i.n, { wins });
                  }}
                />
              ))}
            </div>
          ) : (
            <ul className="wins">
              {i.wins.map((w, k) => (
                <li key={k}>
                  <span className="dot">-</span>
                  <span>
                    {w || <em style={{ color: "var(--dim)" }}>empty</em>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <h2>Add an issue</h2>
      <div className="card">
        <input
          className="editinput"
          placeholder="theme (e.g. The Machine)"
          value={newTheme}
          onChange={(e) => setNewTheme(e.target.value)}
        />
        {[0, 1, 2].map((w) => (
          <input
            key={w}
            className="editinput"
            style={{ marginTop: 8 }}
            placeholder={`win ${w + 1}`}
            value={newWins[w]}
            onChange={(e) =>
              setNewWins((s) => s.map((x, j) => (j === w ? e.target.value : x)))
            }
          />
        ))}
        <div className="btnrow">
          <button className="btn" onClick={add}>
            Add issue
          </button>
        </div>
      </div>

      <div className="databar" style={{ marginTop: 20 }}>
        <span className="sub">restore the original 9-issue sequence</span>
        <span style={{ flex: 1 }} />
        <button className="mini danger" onClick={reset}>
          reset to seed
        </button>
      </div>
    </>
  );
}
