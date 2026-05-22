"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BottomNav from "../../../components/BottomNav";
import { deleteFieldActivity, loadFieldActivities, parseFarmNumber } from "../../../components/farmStore";

function formatMoney(value) {
  if (!value) return "Not recorded";
  return `$${parseFarmNumber(value).toLocaleString()}`;
}

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const acres = parseFarmNumber(activity?.acres);
  const yieldAmount = parseFarmNumber(activity?.yieldAmount);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadFieldActivities()
        .then((activities) => setActivity(activities.find((item) => item.id === params.id) || null))
        .catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, [params.id]);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this field activity? This cannot be undone.");
    if (!confirmed) return;
    setDeleting(true);
    await deleteFieldActivity(params.id);
    router.push("/farming/activities");
  }

  if (!activity) {
    return <main className="app-shell"><Link href="/farming/activities" className="back-link">← Activities</Link><h1>Loading activity...</h1></main>;
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/farming/activities" className="back-link">← Activities</Link>
        <div className="row-between">
          <h1>{activity.type}</h1>
          <span className="pill">{activity.activityDate}</span>
        </div>
        <p className="muted">{activity.fieldName} • {activity.crop}</p>
      </header>

      <section className="detail-grid">
        <div><span>Field</span><strong>{activity.fieldName}</strong></div>
        <div><span>Crop</span><strong>{activity.crop}</strong></div>
        <div><span>Product</span><strong>{activity.product || "Not recorded"}</strong></div>
        <div><span>Rate</span><strong>{activity.rate || "Not recorded"}</strong></div>
        <div><span>Acres</span><strong>{activity.acres || "Not recorded"}</strong></div>
        <div><span>Cost</span><strong>{formatMoney(activity.cost)}</strong></div>
        {activity.type === "Harvest" && <div><span>Yield</span><strong>{activity.yieldAmount ? `${yieldAmount.toLocaleString()} ${activity.yieldUnit}` : "Not recorded"}</strong></div>}
        {activity.type === "Harvest" && <div><span>Yield/ac</span><strong>{yieldAmount && acres ? `${(yieldAmount / acres).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${activity.yieldUnit}/ac` : "Not recorded"}</strong></div>}
        {activity.type === "Harvest" && <div><span>Moisture</span><strong>{activity.moisture ? `${activity.moisture}%` : "Not recorded"}</strong></div>}
        {activity.type === "Harvest" && <div><span>Grade</span><strong>{activity.grade || "Not recorded"}</strong></div>}
        {activity.type === "Harvest" && <div><span>Destination</span><strong>{activity.destination || "Not recorded"}</strong></div>}
        <div><span>Notes</span><strong>{activity.notes}</strong></div>
        <div><span>Added by</span><strong>{activity.user}</strong></div>
      </section>

      <section>
        <div className="section-heading"><h2>Activity actions</h2></div>
        <div className="action-grid two">
          <Link className="action-card" href={`/farming/activities/${activity.id}/edit`}><span>✏️</span><strong>Edit activity</strong></Link>
          {activity.fieldId ? <Link className="action-card" href={`/farming/fields/${activity.fieldId}`}><span>🗺️</span><strong>View field</strong></Link> : null}
        </div>
      </section>

      <section className="form-card danger-zone">
        <p className="eyebrow">Cleanup</p>
        <h2>Delete activity</h2>
        <p className="muted">Use this for test entries or mistakes.</p>
        <button type="button" className="button danger full" disabled={deleting} onClick={handleDelete}>{deleting ? "Deleting..." : "Delete activity"}</button>
      </section>

      <BottomNav />
    </main>
  );
}
