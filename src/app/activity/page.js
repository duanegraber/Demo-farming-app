"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadActivity } from "../components/farmStore";

export default function ActivityPage() {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadActivity().then(setActivity).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/" className="back-link">← Home</Link>
        <h1>Recent Activity</h1>
        <p className="muted">A shared timeline of what happened and who recorded it.</p>
      </header>
      <section className="stack">
        {activity.map((item) => (
          <article className="list-card" key={item.id}>
            <p className="eyebrow">{item.type} • {item.time}</p>
            <h2>{item.title}</h2>
            <p>{item.detail}</p>
            <small>Added by {item.user}{item.cowTag ? ` • Tag ${item.cowTag}` : ""}</small>
          </article>
        ))}
      </section>
    </main>
  );
}
