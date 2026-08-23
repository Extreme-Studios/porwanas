"use client";

import { useState } from "react";
import { medals, news, quickNews, registrationUrl } from "@/lib/data";

const Arrow = () => <span aria-hidden="true">→</span>;
const Icon = ({ children }: { children: React.ReactNode }) => <span className="icon">{children}</span>;

export default function Home() {
  const [open, setOpen] = useState(false);
  const nav = ["Beranda", "Pendaftaran", "Struktur Organisasi", "Hasil Verifikasi"];
  return <main>
    <div className="topbar"><div className="shell top-content"><span>Portal Resmi Pekan Olahraga Wartawan Nasional</span><span>12–18 AGUSTUS 2026</span></div></div>
    <header className="shell header">
      <a className="brand" href="#beranda" aria-label="PORWANAS Beranda"><span className="brand-mark">P</span><span><b>PORWANAS</b><small>PEKAN OLAHRAGA WARTAWAN NASIONAL</small></span></a>
      <button className="menu" aria-label="Buka menu" onClick={() => setOpen(!open)}>☰</button>
      <nav className={open ? "nav nav-open" : "nav"}>{nav.map((item) => <a key={item} href={item === "Pendaftaran" ? registrationUrl : `#${item.toLowerCase().replaceAll(" ", "-")}`} target={item === "Pendaftaran" ? "_blank" : undefined} rel="noreferrer">{item}</a>)}</nav>
      <a className="button header-cta" href={registrationUrl} target="_blank" rel="noreferrer">Daftar Sekarang <Arrow /></a>
    </header>

    <section className="hero" id="beranda"><div className="shell hero-grid">
      <article className="hero-story"><div className="hero-image" /><div className="hero-overlay" /><div className="hero-copy"><p className="eyebrow light">BERITA UTAMA <span>•</span> 12 AGUSTUS 2026</p><h1>PORWANAS 2026 Resmi Dibuka, Semangat Persatuan Menggema</h1><p>Pekan Olahraga Wartawan Nasional mempertemukan insan pers dari seluruh Indonesia dalam kompetisi, kolaborasi, dan persaudaraan.</p><a href="#berita-terbaru" className="text-link light">Baca Selengkapnya <Arrow /></a></div></article>
      <aside className="quick-news"><div className="section-kicker">TERKINI</div>{quickNews.map(([category, title, date]) => <article className="quick-item" key={title}><div><p className="eyebrow">{category}</p><h3>{title}</h3><time>{date}</time></div><Arrow /></article>)}<a href="#berita-terbaru" className="all-link">Lihat Semua Berita <Arrow /></a></aside>
    </div></section>

    <section className="shell split-section" id="medali"><div><p className="eyebrow gold">KLASEMEN SEMENTARA</p><h2>Perolehan Medali</h2><p className="lead">Pantau perolehan medali seluruh kontingen PORWANAS 2026 secara berkala.</p><div className="table-wrap"><table><thead><tr><th>#</th><th>Kontingen</th><th>🥇</th><th>🥈</th><th>🥉</th><th>Total</th></tr></thead><tbody>{medals.map(([rank, team, gold, silver, bronze]) => <tr key={team}><td className="rank">{rank}</td><td><b>{team}</b></td><td>{gold}</td><td>{silver}</td><td>{bronze}</td><td><b>{Number(gold)+Number(silver)+Number(bronze)}</b></td></tr>)}</tbody></table></div><a href="#medali" className="text-link navy">Lihat Klasemen Lengkap <Arrow /></a></div>
      <div className="agenda" id="agenda"><p className="eyebrow gold">JADWAL KEGIATAN</p><h2>Agenda PORWANAS</h2><div className="agenda-day"><b>12</b><div><p className="day">RABU, AGUSTUS 2026</p><p><strong>08.00</strong> Registrasi Kontingen</p><p><strong>10.00</strong> Technical Meeting</p><p><strong>19.00</strong> Opening Ceremony</p></div></div><div className="agenda-day"><b>13</b><div><p className="day">KAMIS, AGUSTUS 2026</p><p><strong>08.00</strong> Pertandingan Sepak Bola</p><p><strong>09.00</strong> Pertandingan Bulu Tangkis</p><p><strong>13.00</strong> Pertandingan Tenis Meja</p></div></div><a href="#agenda" className="text-link navy">Lihat Seluruh Agenda <Arrow /></a></div>
    </section>

    <section className="news-section" id="berita-terbaru"><div className="shell"><div className="section-heading"><div><p className="eyebrow gold">INFORMASI TERBARU</p><h2>Berita PORWANAS</h2></div><a href="#berita-terbaru" className="text-link navy">Lihat Semua Berita <Arrow /></a></div><div className="cards">{news.map((item) => <article className="news-card" key={item.title}><img src={item.image} alt="" /><div className="card-body"><p className="eyebrow gold">{item.category} <span>•</span> {item.date}</p><h3>{item.title}</h3><a className="text-link navy" href="#berita-terbaru">Baca Berita <Arrow /></a></div></article>)}</div></div></section>

    <section className="shell cta"><div><p className="eyebrow light">PORWANAS 2026</p><h2>Siap Menjadi Bagian dari PORWANAS?</h2><p>Daftarkan diri dan kontingen Anda untuk merayakan sportivitas wartawan Indonesia.</p></div><a className="button gold-button" href={registrationUrl} target="_blank" rel="noreferrer">Daftar Sekarang <Arrow /></a></section>

    <section className="sponsors shell" id="sponsor"><p className="eyebrow gold">DIDUKUNG OLEH</p><h2>Official Sponsor & Partner</h2><div className="sponsor-list"><span>SPONSOR<br/><b>UTAMA</b></span><span>OFFICIAL<br/><b>PARTNER</b></span><span>MEDIA<br/><b>PARTNER</b></span><span>SUPPORTING<br/><b>PARTNER</b></span></div></section>
    <footer><div className="shell footer-grid"><div className="footer-brand"><a className="brand" href="#beranda"><span className="brand-mark">P</span><span><b>PORWANAS</b><small>PEKAN OLAHRAGA WARTAWAN NASIONAL</small></span></a><p>Ajang olahraga dan silaturahmi insan pers Indonesia.</p></div><div><h4>MENU UTAMA</h4><a href="#beranda">Beranda</a><a href={registrationUrl} target="_blank" rel="noreferrer">Pendaftaran</a><a href="#agenda">Agenda</a></div><div><h4>INFORMASI</h4><a href="#medali">Perolehan Medali</a><a href="#struktur-organisasi">Struktur Organisasi</a><a href="#hasil-verifikasi">Hasil Verifikasi</a></div><div><h4>IKUTI KAMI</h4><a href="#instagram">Instagram</a><a href="#facebook">Facebook</a><a href="#youtube">YouTube</a></div></div><div className="shell copyright">© 2026 PORWANAS. Seluruh hak cipta dilindungi.</div></footer>
    <VerificationSection />
  </main>;
}

function VerificationSection() {
  const [query, setQuery] = useState(""); const [items, setItems] = useState<{id:string;name:string;contingent:string;sport:string}[]>([]); const [state, setState] = useState("idle");
  async function search(event: React.FormEvent) { event.preventDefault(); setState("loading"); try { const response = await fetch(`/api/verification?query=${encodeURIComponent(query)}`); const data = await response.json(); if (!data.ok) throw new Error(); setItems(data.items); setState("done"); } catch { setState("error"); } }
  return <section className="verification" id="hasil-verifikasi"><div className="shell verification-inner"><p className="eyebrow gold">INFORMASI PESERTA</p><h2>Hasil Verifikasi</h2><p className="lead">Cek peserta yang telah dinyatakan terverifikasi oleh panitia PORWANAS.</p><form className="verification-search" onSubmit={search}><label htmlFor="verification-query">Nama atau nomor registrasi</label><div><input id="verification-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Contoh: PRW-2026-000001"/><button className="button">Cari <Arrow/></button></div></form>{state === "loading" && <p className="verification-note">Memuat data...</p>}{state === "error" && <p className="verification-note error">Data belum dapat dimuat.</p>}{state === "done" && <div className="verification-results">{items.length ? items.map((person) => <article className="verified-card" key={person.id}><span className="verified-check">✓</span><div><p className="eyebrow gold">{person.id}</p><h3>{person.name}</h3><p>{person.contingent} <span>•</span> {person.sport}</p></div><b>Terverifikasi</b></article>) : <p className="verification-note">Belum ada peserta terverifikasi yang sesuai.</p>}</div>}</div></section>;
}
