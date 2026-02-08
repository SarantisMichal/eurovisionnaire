"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Row = {
  id: string;
  year: number;
  country: string;
  country_iso: string;
};

export default function Home() {
  const [rows, setRows] = useState<Row[]>([]);
  const [year, setYear] = useState<string>("");
  const [q, setQ] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");

      let query = supabase
        .from("analytics.stg_contestants")
        .select("id,year,country,country_iso")
        .order("year", { ascending: false })
        .limit(2000);

      if (year.trim()) query = query.eq("year", Number(year));
      if (q.trim()) query = query.ilike("country", `%${q.trim()}%`);

      const { data, error } = await query;

      if (error) setError(error.message);
      setRows((data ?? []) as Row[]);
      setLoading(false);
    })();
  }, [year, q]);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Eurovisionnaire</h1>

      <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        <input
          placeholder="Search country…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: 10, minWidth: 220 }}
        />
        <input
          placeholder="Year (e.g. 2024)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ padding: 10, width: 160 }}
        />
        <div style={{ padding: 10, color: "#666" }}>
          {loading ? "Loading…" : `${rows.length} rows`}
        </div>
      </div>

      {error && <p style={{ marginTop: 16, color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ marginTop: 16, overflowX: "auto" }}>
          <table cellPadding={10} style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                <th>ID</th>
                <th>Year</th>
                <th>Country</th>
                <th>ISO</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td>{r.id}</td>
                  <td>{r.year}</td>
                  <td>{r.country}</td>
                  <td>{r.country_iso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
