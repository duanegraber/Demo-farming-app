"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { users } from "../data";
import { clearAllFarmRecords, resetDemoFarmData } from "../components/farmStore";
import SignOutButton from "../components/SignOutButton";

export default function AdminPage() {
  const router = useRouter();
  const [clearMessage, setClearMessage] = useState("");
  const [clearing, setClearing] = useState(false);

  async function handleClearRecords() {
    const confirmed = window.confirm("Clear all demo cow, crop, equipment, and activity records?");
    if (!confirmed) return;

    setClearing(true);
    setClearMessage("");
    try {
      await clearAllFarmRecords();
      setClearMessage("Records cleared. Use Reset demo data if you want the sample records back.");
      router.refresh();
    } catch (error) {
      setClearMessage(error.message || "Could not clear records. Try again or ask Alex/Jarvis to check Supabase permissions.");
    } finally {
      setClearing(false);
    }
  }

  function handleResetDemoData() {
    resetDemoFarmData();
    setClearMessage("Demo records reset.");
    router.refresh();
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/" className="back-link">← Home</Link>
        <h1>Admin</h1>
        <p className="muted">Demo users and record controls for presentation mode.</p>
      </header>
      <SignOutButton />
      <section className="stack">
        {users.map((user) => (
          <article className="list-card" key={user.name}>
            <div className="row-between">
              <h2>{user.name}</h2>
              <span className="pill">{user.role}</span>
            </div>
          </article>
        ))}
      </section>
      <Link href="/export" className="button full">Print / Export records</Link>
      <button type="button" onClick={handleResetDemoData} className="button full">
        Reset demo data
      </button>
      <button type="button" onClick={handleClearRecords} disabled={clearing} className="button full secondary">
        {clearing ? "Clearing records..." : "Clear all records and start fresh"}
      </button>
      {clearMessage && <p className="helper success">{clearMessage}</p>}
    </main>
  );
}
