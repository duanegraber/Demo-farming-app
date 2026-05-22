"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BottomNav from "../../../components/BottomNav";
import { deleteCropSale, loadCropSales } from "../../../components/farmStore";

function formatMoney(value) {
  return `$${(Number(value) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function CropSaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [sale, setSale] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadCropSales().then((sales) => setSale(sales.find((item) => item.id === params.id) || null)).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, [params.id]);

  async function handleDelete() {
    if (!window.confirm("Delete this crop sale? This cannot be undone.")) return;
    setDeleting(true);
    await deleteCropSale(params.id);
    router.push("/farming/sales");
  }

  if (!sale) return <main className="app-shell"><Link href="/farming/sales" className="back-link">← Crop sales</Link><h1>Loading sale...</h1></main>;

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/farming/sales" className="back-link">← Crop sales</Link>
        <div className="row-between"><h1>{sale.crop}</h1><span className="pill">{sale.saleDate}</span></div>
        <p className="muted">{sale.fieldName} • {sale.buyer || "Buyer not recorded"}</p>
      </header>
      <section className="detail-grid">
        <div><span>Amount</span><strong>{Number(sale.amount || 0).toLocaleString()} {sale.unit}</strong></div>
        <div><span>Price</span><strong>{sale.pricePerUnit ? `${formatMoney(sale.pricePerUnit)}/${sale.unit}` : "Not recorded"}</strong></div>
        <div><span>Gross revenue</span><strong>{formatMoney(sale.grossRevenue)}</strong></div>
        <div><span>Deductions</span><strong>{formatMoney(sale.deductions)}</strong></div>
        <div><span>Net revenue</span><strong>{formatMoney(sale.netRevenue)}</strong></div>
        <div><span>Buyer</span><strong>{sale.buyer || "Not recorded"}</strong></div>
        <div><span>Notes</span><strong>{sale.notes}</strong></div>
        <div><span>Added by</span><strong>{sale.user}</strong></div>
      </section>
      <section>
        <div className="section-heading"><h2>Sale actions</h2></div>
        <div className="action-grid two">
          <Link className="action-card" href={`/farming/sales/${sale.id}/edit`}><span>✏️</span><strong>Edit sale</strong></Link>
          {sale.fieldId ? <Link className="action-card" href={`/farming/fields/${sale.fieldId}`}><span>🗺️</span><strong>View field</strong></Link> : null}
        </div>
      </section>
      <section className="form-card danger-zone">
        <p className="eyebrow">Cleanup</p>
        <h2>Delete sale</h2>
        <p className="muted">Use this for test entries or mistakes.</p>
        <button type="button" className="button danger full" disabled={deleting} onClick={handleDelete}>{deleting ? "Deleting..." : "Delete sale"}</button>
      </section>
      <BottomNav />
    </main>
  );
}
