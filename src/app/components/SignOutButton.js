"use client";

import { useEffect, useState } from "react";
import { hasSupabaseConfig, supabase } from "./supabaseClient";

export default function SignOutButton() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email || ""));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (!hasSupabaseConfig) return null;

  return (
    <section className="list-card">
      <p className="eyebrow">Signed in</p>
      <div className="row-between">
        <h2>{email || "Farm user"}</h2>
        <button type="button" className="button compact secondary" onClick={signOut}>Sign out</button>
      </div>
    </section>
  );
}
