"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { formatFarmNumber, loadCropSales, loadFieldActivities, loadFields, parseFarmNumber } from "../../../components/farmStore";

export default function FieldProfile() {
  const params = useParams();
  const [fields, setFields] = useState([]);
  const [activity, setActivity] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadFields().then(setFields).catch(console.error);
      loadFieldActivities().then(setActivity).catch(console.error);
      loadCropSales().then(setSales).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const field = fields.find((item) => item.id === params.id);
  const timeline = useMemo(() => {
    if (!field) return [];
    return activity.filter((item) => item.fieldId === field.id || item.fieldName?.toLowerCase() === field.name.toLowerCase());
  }, [activity, field]);

  const fieldSales = useMemo(() => {
    if (!field) return [];
    return sales.filter((sale) => sale.fieldId === field.id || sale.fieldName === field.name);
  }, [field, sales]);

  if (!field) {
    return <main className="app-shell"><Link href="/farming/fields" className="back-link">← Field list</Link><h1>Loading field...</h1></main>;
  }

  const rentCostPerAcre = parseFarmNumber(field.rentCostPerAcre);
  const annualRentCost = field.ownership === "Rented" ? parseFarmNumber(field.acres) * rentCostPerAcre : 0;

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/farming/fields" className="back-link">← Field list</Link>
        <div className="row-between">
          <h1>{field.name}</h1>
          <span className="pill">{field.ownership}</span>
        </div>
        <p className="muted">{field.currentCrop} • {field.acres || "Unknown"} acres</p>
      </header>

      <section className="detail-grid">
        <div><span>Acres</span><strong>{field.acres || "Not recorded"}</strong></div>
        <div><span>Current crop</span><strong>{field.currentCrop}</strong></div>
        <div><span>Ownership</span><strong>{field.ownership}</strong></div>
        {field.ownership === "Rented" && <div><span>Rent cost/ac</span><strong>{rentCostPerAcre ? `$${formatFarmNumber(rentCostPerAcre)}` : "Not recorded"}</strong></div>}
        {field.ownership === "Rented" && <div><span>Annual rent cost</span><strong>{annualRentCost ? `$${formatFarmNumber(annualRentCost)}` : "Not recorded"}</strong></div>}
        <div><span>Legal location</span><strong>{field.legalLocation}</strong></div>
        <div><span>Notes</span><strong>{field.notes}</strong></div>
      </section>

      <section>
        <div className="section-heading"><h2>Quick update</h2></div>
        <div className="action-grid two">
          <Link className="action-card" href={`/farming/fields/${field.id}/edit`}><span>✏️</span><strong>Edit field</strong></Link>
          <Link className="action-card" href={`/farming/activities/new?fieldId=${field.id}`}><span>🚜</span><strong>Add activity</strong></Link>
          <Link className="action-card" href="/farming/sales/new"><span>💵</span><strong>Add sale</strong></Link>
          <Link className="action-card" href="/farming/crop-year"><span>📅</span><strong>Crop year</strong></Link>
        </div>
      </section>

      <section>
        <div className="section-heading"><h2>Crop sales</h2><Link href="/farming/sales">View all</Link></div>
        <div className="stack">
          {fieldSales.slice(0, 3).map((sale) => (
            <Link className="list-card link-card" href={`/farming/sales/${sale.id}`} key={sale.id}>
              <p className="eyebrow">{sale.saleDate} • {sale.crop}</p>
              <h3>${Number(sale.netRevenue || 0).toLocaleString()} net revenue</h3>
              <p>{Number(sale.amount || 0).toLocaleString()} {sale.unit} • {sale.buyer || "Buyer not recorded"}</p>
            </Link>
          ))}
          {fieldSales.length === 0 && <article className="list-card"><h3>No crop sales yet</h3><p>Sales for {field.name} will show here once they are added.</p></article>}
        </div>
      </section>

      <section>
        <div className="section-heading"><h2>Field timeline</h2></div>
        <div className="stack">
          {timeline.map((item) => (
            <Link className="list-card link-card" href={`/farming/activities/${item.id}`} key={item.id}>
              <p className="eyebrow">{item.type} • {item.activityDate}</p>
              <h3>{item.crop}</h3>
              <p>{item.product ? `${item.product}${item.rate ? ` • ${item.rate}` : ""}` : item.notes}</p>
              <small>Added by {item.user}</small>
            </Link>
          ))}
          {timeline.length === 0 && <article className="list-card"><h3>No field activity yet</h3><p>Add a seeding, spraying, fertilizer, harvest, or note for {field.name}.</p></article>}
        </div>
      </section>
    </main>
  );
}
