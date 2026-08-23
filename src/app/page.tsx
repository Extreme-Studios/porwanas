"use client";

import { useEffect, useState } from "react";
import { contentDefaults, registrationUrl } from "@/lib/data";

const Arrow = () => <span aria-hidden="true">→</span>;

export default function Home() {
  const [open, setOpen] = useState(false); const [content, setContent] = useState<any>(contentDefaults);
  useEffect(() => { fetch("/api/content", { cache: "no-store" }).then(r => r.json()).then(data => { if (data.ok) setContent((prev: any) => ({ ...prev, ...data.content })); }).catch(() => {}); }, []);
  const nav = ["Beranda", "Struktur Organisasi", "Hasil Verifikasi", "Pendaftaran"];
  return <main>
    <div className="topbar"><div className="shell top-content"><span>Portal Resmi Pekan Olahraga Wartawan Nasional</span><span>12–18 AGUSTUS 2026</span></div></div>
    <header className="shell header"><a className="brand" href="#beranda"><span className="brand-mark">P</span><span><b>PORWANAS</b><small>PEKAN OLAHRAGA WARTAWAN NASIONAL</small></span></a><button className="menu" aria-label="Buka menu" onClick={() => setOpen(!open)}>☰</button><nav className={open ? "nav nav-open" : "nav"}>{nav.map(item => <a className={item === "Pendaftaran" ? "nav-register" : ""} key={item} href={item === "Pendaftaran" ? registrationUrl : `#${item.toLowerCase().replaceAll(" ", "-")}`} target={item === "Pendaftaran" ? "_blank" : undefined} rel="noreferrer">{item === "Pendaftaran" ? <>Pendaftaran <Arrow /></> : item}</a>)}</nav></header>
    <section className="hero" id="beranda"><div className="shell"><article className="hero-story"><div className="hero-image"/><div className="hero-overlay"/><div className="hero-copy"><p className="eyebrow light">BERITA UTAMA <span>•</span> 12 AGUSTUS 2026</p><h1>PORWANAS 2026 Resmi Dibuka, Semangat Persatuan Menggema</h1><p>Pekan Olahraga Wartawan Nasional mempertemukan insan pers dari seluruh Indonesia dalam kompetisi, kolaborasi, dan persaudaraan.</p></div></article></div></section>
    <section className="agenda-section" id="agenda"><div className="shell agenda-layout"><div><p className="eyebrow gold">JADWAL KEGIATAN</p><h2>Agenda PORWANAS</h2><p className="lead">Informasi agenda dan kegiatan resmi PORWANAS 2026.</p></div><div className="agenda-list">{(content.agenda || []).map((item: any) => <article className="agenda-day" key={item.id}><b>•</b><div><p className="day">{item.date}</p><p>{item.title}</p></div></article>)}</div></div></section>
    <section className="organization-section" id="struktur-organisasi"><div className="shell"><p className="eyebrow gold">PANITIA PORWANAS</p><h2>Struktur Organisasi</h2><div className="org-grid">{(content.organization || []).map((item: any) => <article className="org-card" key={item.id}><span className="org-avatar">{(item.name || "P").charAt(0)}</span><div><p>{item.title}</p><h3>{item.name}</h3></div></article>)}</div></div></section>
    <VerificationSection />
    <section className="sponsors shell" id="sponsor"><p className="eyebrow gold">DIDUKUNG OLEH</p><h2>Official Sponsor & Partner</h2><div className="sponsor-list">{(content.sponsors || contentDefaults.sponsors).map((item: any) => <span key={item.id}>{item.title || item.name}</span>)}</div></section>
    <footer><div className="shell footer-grid"><div className="footer-brand"><a className="brand" href="#beranda"><span className="brand-mark">P</span><span><b>PORWANAS</b><small>PEKAN OLAHRAGA WARTAWAN NASIONAL</small></span></a><p>Ajang olahraga dan silaturahmi insan pers Indonesia.</p></div><div><h4>MENU UTAMA</h4><a href="#beranda">Beranda</a><a href={registrationUrl} target="_blank" rel="noreferrer">Pendaftaran</a><a href="#agenda">Agenda</a></div><div><h4>INFORMASI</h4><a href="#struktur-organisasi">Struktur Organisasi</a><a href="#hasil-verifikasi">Hasil Verifikasi</a></div></div><div className="shell copyright">© 2026 PORWANAS. Seluruh hak cipta dilindungi.</div></footer>
  </main>;
}

function VerificationSection() {
  const [query, setQuery] = useState(""); const [items, setItems] = useState<any[]>([]); const [state, setState] = useState("loading");
  const load = (term = "") => fetch(`/api/verification?query=${encodeURIComponent(term)}`, { cache: "no-store" }).then(r => r.json()).then(data => { if (!data.ok) throw new Error(); setItems(data.items); setState("done"); }).catch(() => setState("error"));
  useEffect(() => { load(); }, []);
  return <section className="verification" id="hasil-verifikasi"><div className="shell verification-inner"><p className="eyebrow gold">INFORMASI PESERTA</p><h2>Hasil Verifikasi</h2><p className="lead">Daftar peserta yang telah dinyatakan terverifikasi oleh panitia PORWANAS.</p><form className="verification-search" onSubmit={e => { e.preventDefault(); load(query); }}><label htmlFor="verification-query">Cari nama atau nomor registrasi</label><div><input id="verification-query" value={query} onChange={e => setQuery(e.target.value)} placeholder="Contoh: PRW-2026-000001"/><button className="button">Cari <Arrow /></button></div></form>{state === "loading" && <p className="verification-note">Memuat data...</p>}{state === "error" && <p className="verification-note error">Data belum dapat dimuat.</p>}{state === "done" && <div className="verification-results">{items.length ? items.map(person => <article className="verified-card" key={person.id}><span className="verified-check">✓</span><div><p className="eyebrow gold">{person.id}</p><h3>{person.name}</h3><p>{person.contingent} <span>•</span> {person.sport}</p></div><b>Terverifikasi</b></article>) : <p className="verification-note">Belum ada peserta terverifikasi.</p>}</div>}</div></section>;
}
