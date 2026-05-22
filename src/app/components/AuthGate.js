"use client";

import { useEffect, useMemo, useState } from "react";
import { hasSupabaseConfig, supabase, supabaseAnonKey, supabaseUrl } from "./supabaseClient";
import { seedDemoFarmData } from "./farmStore";

const BUILD_TAG = "auth-direct-2026-05-06-d";

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
}

function shortFingerprint(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(index) | 0;
  }
  return Math.abs(hash).toString(16).slice(0, 8);
}

export default function AuthGate({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const authDebug = useMemo(() => {
    if (typeof window === "undefined") return BUILD_TAG;
    if (!hasSupabaseConfig) return `${BUILD_TAG} · local demo mode`;
    const payload = decodeJwtPayload(supabaseAnonKey);
    return `${BUILD_TAG} · ref ${payload?.ref || "none"} · role ${payload?.role || "none"} · key ${supabaseAnonKey.length}/${shortFingerprint(supabaseAnonKey)} · url ${new URL(supabaseUrl).hostname}`;
  }, []);

  if (!hasSupabaseConfig && typeof window !== "undefined") {
    seedDemoFarmData();
  }

  useEffect(() => {
    if (!hasSupabaseConfig) {
      const id = window.requestAnimationFrame(() => setLoading(false));
      return () => window.cancelAnimationFrame(id);
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);

    if (error) {
      setMessage(`${error.message} · ${authDebug}`);
      return;
    }

    setMessage("Signed in.");
  }

  if (loading) {
    return <main className="app-shell"><section className="hero-card"><h1>Demo Farm Manager</h1><p className="muted">Loading...</p></section></main>;
  }

  if (!hasSupabaseConfig || session) {
    return children;
  }

  return (
    <main className="app-shell auth-page">
      <section className="hero-card">
        <p className="eyebrow">Private farm records</p>
        <h1>Demo Farm Manager</h1>
        <p className="muted">Sign in before viewing or changing cattle records.</p>
      </section>

      <form className="form-card" onSubmit={handleSubmit}>
        <label>Email<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" /></label>
        <label>Password<input type="password" autoComplete="current-password" required minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" /></label>
        <button type="submit" className="button full" disabled={busy}>{busy ? "Working..." : "Sign in"}</button>
        {message && <p className="helper warning-text">{message}</p>}
        <p className="helper muted">{authDebug}</p>
      </form>
    </main>
  );
}
