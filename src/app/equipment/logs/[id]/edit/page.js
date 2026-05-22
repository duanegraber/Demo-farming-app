"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadEquipment, loadEquipmentLogs, updateEquipmentLog } from "../../../../components/farmStore";

const logTypes = ["Maintenance", "Repair", "Fuel", "Inspection", "Note"];
const fuelUnits = ["litres", "gallons"];
const years = [2026, 2027, 2028, 2029, 2030];

export default function EditEquipmentLogPage() {
  const params = useParams();
  const router = useRouter();
  const [equipment, setEquipment] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      Promise.all([loadEquipment(), loadEquipmentLogs()])
        .then(([equipmentRows, logRows]) => {
          setEquipment(equipmentRows);
          const log = logRows.find((item) => item.id === params.id);
          if (log) setForm({ ...log, user: "Alex" });
        })
        .catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, [params.id]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function chooseEquipment(equipmentId) {
    const selected = equipment.find((item) => item.id === equipmentId);
    setForm((current) => ({ ...current, equipmentId, equipmentName: selected?.name || "", meterReading: current.meterReading || selected?.currentMeter || "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form?.equipmentName.trim()) return;
    const log = await updateEquipmentLog(params.id, form);
    router.push(log.equipmentId ? `/equipment/${log.equipmentId}` : "/equipment");
  }

  if (!form) {
    return <main className="app-shell"><Link href="/equipment" className="back-link">← Equipment</Link><h1>Loading log...</h1></main>;
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href={form.equipmentId ? `/equipment/${form.equipmentId}` : "/equipment"} className="back-link">← Equipment</Link>
        <h1>Edit Log</h1>
        <p className="muted">Fix equipment cost, date, description, vendor, meter, fuel, or notes.</p>
      </header>

      <form className="form-card" onSubmit={handleSubmit}>
        <label>Equipment<select required value={form.equipmentId || ""} onChange={(event) => chooseEquipment(event.target.value)}><option value="">Choose equipment</option>{equipment.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
        <label>Log type<select value={form.type} onChange={(event) => updateField("type", event.target.value)}>{logTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label>Date<input type="date" value={form.logDate} onChange={(event) => updateField("logDate", event.target.value)} /></label>
        <label>Cost year<select value={form.logYear} onChange={(event) => updateField("logYear", event.target.value)}>{years.map((year) => <option key={year}>{year}</option>)}</select></label>
        <label>Description<input value={form.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Oil change, fuel fill, bearing repair..." /></label>
        <label>Vendor<input value={form.vendor} onChange={(event) => updateField("vendor", event.target.value)} placeholder="Co-op, dealer, parts store..." /></label>
        <label>Meter reading<input type="number" min="0" step="0.1" value={form.meterReading || ""} onChange={(event) => updateField("meterReading", event.target.value)} inputMode="decimal" /></label>
        {form.type === "Fuel" && <label>Fuel amount<input type="number" min="0" step="0.01" value={form.fuelAmount || ""} onChange={(event) => updateField("fuelAmount", event.target.value)} inputMode="decimal" /></label>}
        {form.type === "Fuel" && <label>Fuel unit<select value={form.fuelUnit} onChange={(event) => updateField("fuelUnit", event.target.value)}>{fuelUnits.map((unit) => <option key={unit}>{unit}</option>)}</select></label>}
        <label>Total cost<input type="number" min="0" step="0.01" value={form.cost || ""} onChange={(event) => updateField("cost", event.target.value)} placeholder="Parts, labor, fuel total" inputMode="decimal" /></label>
        <label>Notes<textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="What was done, parts used, things to watch..." /></label>
        <label>Updated by<select value={form.user} onChange={(event) => updateField("user", event.target.value)}><option>Alex</option><option>Riley</option><option>Sam</option><option>Maya</option></select></label>
        <button type="submit" className="button full">Save changes</button>
      </form>
    </main>
  );
}
