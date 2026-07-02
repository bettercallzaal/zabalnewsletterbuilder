import Link from "next/link";

export default function NotFound() {
  return (
    <div className="empty" style={{ marginTop: 48 }}>
      <div style={{ fontSize: 22, color: "var(--gold)", fontWeight: 700 }}>
        ZM.
      </div>
      <p style={{ marginTop: 8 }}>
        nothing here. the page you wanted does not exist.
      </p>
      <Link className="mini gold" href="/">
        back to the pipeline
      </Link>
    </div>
  );
}
