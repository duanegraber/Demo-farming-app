import Link from "next/link";

export default function ExportPage() {
  return (
    <main className="app-shell print-page">
      <header className="page-header no-print">
        <Link href="/admin" className="back-link">← Admin</Link>
        <h1>Print / Export</h1>
        <p className="muted">Paper backup and CSV export placeholder for the MVP shell.</p>
      </header>
      <section className="hero-card">
        <h1>Demo Farm Manager Records</h1>
        <p className="muted">Printable report preview</p>
      </section>
      <section className="stack">
        <article className="list-card"><h2>Cow list</h2><p>Print active cows, watch list, and current calf pairings.</p></article>
        <article className="list-card"><h2>Calving records</h2><p>Print birth dates, calf tags, sex, and mother cow tags.</p></article>
        <article className="list-card"><h2>Activity notes</h2><p>Print recent events by date and user.</p></article>
      </section>
      <button className="button full no-print" type="button">Use browser print for now</button>
    </main>
  );
}
