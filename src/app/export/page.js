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
        <article className="list-card"><h2>Livestock list</h2><p>Print active livestock, watch list, and current offspring pairings.</p></article>
        <article className="list-card"><h2>Offspring records</h2><p>Print birth dates, offspring tags, sex, and parent animal tags.</p></article>
        <article className="list-card"><h2>Activity notes</h2><p>Print recent events by date and user.</p></article>
      </section>
      <button className="button full no-print" type="button">Use browser print for now</button>
    </main>
  );
}
