"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { issues } from "@/lib/issues";

interface Cmd {
  label: string;
  hint?: string;
  go: string;
}

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const cmds: Cmd[] = useMemo(
    () => [
      { label: "Pipeline", hint: "dashboard", go: "/" },
      { label: "Compose", hint: "new issue", go: "/builder" },
      { label: "Read the series", hint: "print / export", go: "/read" },
      ...issues.map((i) => ({
        label: `Compose issue ${i.n}: ${i.theme}`,
        hint: "compose",
        go: `/builder?issue=${i.n}`,
      })),
    ],
    []
  );

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return cmds;
    return cmds.filter((c) => (c.label + " " + (c.hint ?? "")).toLowerCase().includes(s));
  }, [q, cmds]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  useEffect(() => {
    setSel(0);
  }, [q]);

  if (!open) return null;

  function choose(c: Cmd) {
    setOpen(false);
    router.push(c.go);
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[sel]) {
      choose(results[sel]);
    }
  }

  return (
    <div className="cmdk-overlay" onClick={() => setOpen(false)}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="cmdk-input"
          placeholder="jump to... (issue, compose, read)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onInputKey}
        />
        <div className="cmdk-list">
          {results.length === 0 && <div className="cmdk-empty">no matches</div>}
          {results.map((c, i) => (
            <button
              key={c.go + c.label}
              className={"cmdk-item" + (i === sel ? " on" : "")}
              onMouseEnter={() => setSel(i)}
              onClick={() => choose(c)}
            >
              <span>{c.label}</span>
              {c.hint && <span className="cmdk-hint">{c.hint}</span>}
            </button>
          ))}
        </div>
        <div className="cmdk-foot">enter to go · esc to close · Cmd/Ctrl+K anytime</div>
      </div>
    </div>
  );
}
