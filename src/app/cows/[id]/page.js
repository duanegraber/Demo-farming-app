"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { loadActivity, loadCalves, loadCows } from "../../components/farmStore";

export default function CowProfile() {
  const params = useParams();
  const [cows, setCows] = useState([]);
  const [activity, setActivity] = useState([]);
  const [calves, setCalves] = useState([]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadCows().then(setCows).catch(console.error);
      loadActivity().then(setActivity).catch(console.error);
      loadCalves().then(setCalves).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const cow = cows.find((item) => item.id === params.id);
  const linkedCalf = cow ? calves.find((calf) => calf.cowTag === cow.tag || calf.tag === cow.calfTag) : null;
  const timeline = useMemo(() => {
    if (!cow) return [];
    return activity.filter((item) => item.cowTag === cow.tag || item.title?.includes(`Cow ${cow.tag}`) || item.detail?.includes(`Cow ${cow.tag}`));
  }, [activity, cow]);

  if (!cow) {
    return (
      <main className="app-shell">
        <header className="page-header">
          <Link href="/cows" className="back-link">← Cow list</Link>
          <h1>Loading cow...</h1>
        </header>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/cows" className="back-link">← Cow list</Link>
        <div className="row-between">
          <h1>Cow {cow.tag}</h1>
          <span className={`pill ${cow.status === "Watch" ? "warning" : ""} ${["Sold", "Dead", "Culled"].includes(cow.status) ? "danger" : ""}`}>{cow.status}</span>
        </div>
        <p className="muted">{cow.color} • {cow.location}</p>
      </header>

      <section className="detail-grid">
        <div><span>Last calved</span><strong>{cow.lastCalved}</strong></div>
        <div><span>Calf</span><strong>{linkedCalf ? `#${linkedCalf.tag} ${linkedCalf.sex}` : cow.calfTag ? `#${cow.calfTag}` : "None recorded"}</strong></div>
        <div><span>Purchase</span><strong>{cow.purchaseCost ? `$${Number(cow.purchaseCost).toLocaleString()}` : "Not recorded"}{cow.dateBought ? ` • ${cow.dateBought}` : ""}</strong></div>
        <div><span>Sale</span><strong>{cow.sellingAmount ? `$${Number(cow.sellingAmount).toLocaleString()}` : "Not sold"}{cow.dateSold ? ` • ${cow.dateSold}` : ""}</strong></div>
        <div><span>Notes</span><strong>{cow.notes}</strong></div>
      </section>

      <section>
        <div className="section-heading"><h2>Quick update</h2></div>
        <div className="action-grid two">
          <Link className="action-card" href={`/cows/${cow.id}/edit`}><span>✏️</span><strong>Edit cow</strong></Link>
          <Link className="action-card" href={`/calves/new?cowTag=${cow.tag}`}><span>🐮</span><strong>Add calf</strong></Link>
          <Link className="action-card" href={`/vaccinations/new?type=Cow&tag=${cow.tag}`}><span>💉</span><strong>Add vaccination</strong></Link>
          <Link className="action-card" href={`/notes/new?tag=${cow.tag}`}><span>📝</span><strong>Log note</strong></Link>
        </div>
      </section>

      <section>
        <div className="section-heading"><h2>Cow timeline</h2></div>
        <div className="stack">
          {timeline.map((item) => (
            <article className="list-card" key={item.id}>
              <p className="eyebrow">{item.type} • {item.time}</p>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <small>Added by {item.user}</small>
            </article>
          ))}
          {timeline.length === 0 && <article className="list-card"><h3>No timeline yet</h3><p>Log a note for cow {cow.tag} and it will show here.</p></article>}
        </div>
      </section>
    </main>
  );
}
