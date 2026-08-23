/**
 * PORWANAS Admin Backend — Google Apps Script
 * 1. Buka Google Sheet PORWANAS > Extensions > Apps Script.
 * 2. Hapus kode lama, paste seluruh file ini, ubah CONFIG, lalu Save.
 * 3. Jalankan setupPorwanas() SEKALI dari editor dan setujui izin Google.
 * 4. Deploy > New deployment > Web app: Execute as Me, Who has access: Anyone.
 * 5. Salin URL /exec ke environment variable APPS_SCRIPT_URL di Vercel.
 */
const CONFIG = {
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: 'admin', // Ganti setelah login pertama melalui menu Akun & Keamanan.
  SESSION_HOURS: 8,
};

const CONTENT_SHEETS = {
  news: ['Berita', ['id', 'title', 'date', 'status']],
  medals: ['Medali', ['id', 'name', 'gold', 'silver', 'bronze']],
  agenda: ['Agenda', ['id', 'title', 'date', 'status']],
  sponsors: ['Sponsor', ['id', 'title', 'date', 'status']],
  organization: ['Struktur', ['id', 'name', 'title']],
};
const PARTICIPANT_EXTRA = ['registration_id', 'verification_status', 'verification_notes', 'verified_at'];

function setupPorwanas() {
  const ss = SpreadsheetApp.getActive();
  const adminSheet = sheet_(ss, 'Admin', ['username', 'password_hash', 'name', 'active']);
  ensureHeaders_(adminSheet, ['username', 'password_hash', 'name', 'active']);
  sheet_(ss, 'Sessions', ['token', 'email', 'expires_at']);
  Object.keys(CONTENT_SHEETS).forEach(key => sheet_(ss, CONTENT_SHEETS[key][0], CONTENT_SHEETS[key][1]));
  const admin = readRows_('Admin');
  if (!admin.some(row => String(row.username).toLowerCase() === CONFIG.ADMIN_USERNAME.toLowerCase())) {
    appendObject_('Admin', { username: CONFIG.ADMIN_USERNAME.toLowerCase(), password_hash: hash_(CONFIG.ADMIN_PASSWORD), name: 'Administrator PORWANAS', active: 'TRUE' });
  }
  return 'Setup selesai. Hubungkan Google Form ke Sheet ini. Tab respons Google Form akan otomatis terbaca oleh dashboard.';
}

function doPost(e) {
  try {
    const input = JSON.parse((e.postData && e.postData.contents) || '{}');
    let data;
    if (input.action === 'login') data = login_(input);
    else { requireSession_(input.token); data = protectedAction_(input); }
    return json_({ ok: true, ...data });
  } catch (err) { return json_({ ok: false, message: err.message || 'Terjadi kesalahan.' }); }
}

function protectedAction_(input) {
  if (input.action === 'dashboard') {
    const people = participants_();
    const content = {}; Object.keys(CONTENT_SHEETS).forEach(key => content[key] = readRows_(CONTENT_SHEETS[key][0]));
    return { summary: { total: people.length, waiting: people.filter(x => x.status === 'Menunggu').length, verified: people.filter(x => x.status === 'Terverifikasi').length }, content };
  }
  if (input.action === 'participants') return { items: participants_() };
  if (input.action === 'content') return { items: readRows_(CONTENT_SHEETS[input.section][0]) };
  if (input.action === 'updateParticipant') return updateParticipant_(input);
  if (input.action === 'saveContent') return saveContent_(input);
  if (input.action === 'changeCredentials') return changeCredentials_(input);
  throw new Error('Aksi tidak dikenali.');
}

function login_(input) {
  const username = String(input.username || input.email || '').trim().toLowerCase();
  const password = String(input.password || '');
  const admin = readRows_('Admin').find(row => String(row.username || row.email).toLowerCase() === username && String(row.active).toUpperCase() !== 'FALSE');
  if (!admin || admin.password_hash !== hash_(password)) throw new Error('Email atau password salah.');
  const token = Utilities.getUuid() + Utilities.getUuid();
  appendObject_('Sessions', { token, email: username, expires_at: new Date(Date.now() + CONFIG.SESSION_HOURS * 3600 * 1000).toISOString() });
  return { token, admin: { name: admin.name || 'Administrator', username } };
}

function changeCredentials_(input) {
  const current = requireSession_(input.token);
  const oldPassword = String(input.oldPassword || '');
  const newUsername = String(input.newUsername || '').trim().toLowerCase();
  const newPassword = String(input.newPassword || '');
  if (!/^[a-z0-9._-]{3,32}$/.test(newUsername)) throw new Error('Username harus 3–32 karakter: huruf kecil, angka, titik, garis bawah, atau minus.');
  if (newPassword.length < 8) throw new Error('Password baru minimal 8 karakter.');
  const sh = SpreadsheetApp.getActive().getSheetByName('Admin'); ensureHeaders_(sh, ['username', 'password_hash', 'name', 'active']);
  const rows = readRows_('Admin'); const mine = rows.find(row => String(row.username || row.email).toLowerCase() === String(current.email).toLowerCase());
  if (!mine || mine.password_hash !== hash_(oldPassword)) throw new Error('Password lama tidak sesuai.');
  if (rows.some(row => row !== mine && String(row.username || row.email).toLowerCase() === newUsername)) throw new Error('Username itu sudah dipakai.');
  const rowIndex = rows.indexOf(mine) + 2; const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0];
  sh.getRange(rowIndex, headers.indexOf('username') + 1).setValue(newUsername);
  sh.getRange(rowIndex, headers.indexOf('password_hash') + 1).setValue(hash_(newPassword));
  return { changed: true };
}

function requireSession_(token) {
  if (!token) throw new Error('Sesi tidak ditemukan.');
  const session = readRows_('Sessions').find(row => row.token === token);
  if (!session || new Date(session.expires_at).getTime() < Date.now()) throw new Error('Sesi admin berakhir. Silakan login kembali.');
  return session;
}

function participants_() {
  const formSheet = formSheet_();
  if (!formSheet) return [];
  ensureParticipantColumns_(formSheet);
  const values = formSheet.getDataRange().getDisplayValues();
  const headers = values.shift();
  return values.filter(row => row.some(cell => cell !== '')).map((row, index) => {
    const map = {}; headers.forEach((head, col) => map[normalize_(head)] = row[col]);
    const id = map.registration_id || ('PRW-' + new Date().getFullYear() + '-' + String(index + 1).padStart(6, '0'));
    if (!map.registration_id) formSheet.getRange(index + 2, headers.indexOf('registration_id') + 1).setValue(id);
    return {
      id, name: pick_(map, ['nama_lengkap', 'nama_lengkap_peserta', 'nama', 'name']) || 'Tanpa nama',
      email: pick_(map, ['email', 'alamat_email']), contingent: pick_(map, ['provinsi_kontingen', 'kontingen', 'provinsi']),
      sport: pick_(map, ['cabang_olahraga', 'cabor', 'olahraga']), submittedAt: pick_(map, ['timestamp', 'stempel_waktu']),
      status: map.verification_status || 'Menunggu', notes: map.verification_notes || '', _row: index + 2,
    };
  }).reverse();
}

function updateParticipant_(input) {
  const formSheet = formSheet_(); if (!formSheet) throw new Error('Tab respons Google Form belum ditemukan.');
  ensureParticipantColumns_(formSheet);
  const headers = formSheet.getRange(1, 1, 1, formSheet.getLastColumn()).getDisplayValues()[0];
  const idColumn = headers.indexOf('registration_id') + 1;
  const values = formSheet.getRange(2, idColumn, Math.max(formSheet.getLastRow() - 1, 1), 1).getDisplayValues();
  const index = values.findIndex(row => row[0] === input.id); if (index < 0) throw new Error('Peserta tidak ditemukan.');
  const row = index + 2;
  formSheet.getRange(row, headers.indexOf('verification_status') + 1).setValue(input.status);
  formSheet.getRange(row, headers.indexOf('verification_notes') + 1).setValue(input.notes || '');
  formSheet.getRange(row, headers.indexOf('verified_at') + 1).setValue(new Date());
  return { updated: true };
}

function saveContent_(input) {
  const setting = CONTENT_SHEETS[input.section]; if (!setting) throw new Error('Jenis konten tidak valid.');
  const item = input.item || {}; if (!item.id) item.id = Utilities.getUuid();
  const sh = sheet_(SpreadsheetApp.getActive(), setting[0], setting[1]);
  const rows = readRows_(setting[0]); const found = rows.find(row => row.id === item.id);
  if (found) { const rowIndex = rows.indexOf(found) + 2; setting[1].forEach((head, col) => sh.getRange(rowIndex, col + 1).setValue(item[head] || '')); }
  else appendObject_(setting[0], item);
  return { item };
}

function formSheet_() { const ss = SpreadsheetApp.getActive(); return ss.getSheets().find(sh => /^Form Responses|^Respons Form/i.test(sh.getName())) || ss.getSheetByName('Pendaftar'); }
function ensureParticipantColumns_(sh) { const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0]; PARTICIPANT_EXTRA.forEach(head => { if (headers.indexOf(head) < 0) { sh.getRange(1, sh.getLastColumn() + 1).setValue(head); headers.push(head); } }); }
function sheet_(ss, name, headers) { const sh = ss.getSheetByName(name) || ss.insertSheet(name); if (sh.getLastRow() === 0) sh.getRange(1, 1, 1, headers.length).setValues([headers]); return sh; }
function ensureHeaders_(sh, wanted) { const headers = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getDisplayValues()[0]; wanted.forEach(head => { if (headers.indexOf(head) < 0) { sh.getRange(1, sh.getLastColumn() + 1).setValue(head); headers.push(head); } }); }
function readRows_(name) { const sh = SpreadsheetApp.getActive().getSheetByName(name); if (!sh || sh.getLastRow() < 2) return []; const values = sh.getDataRange().getDisplayValues(); const headers = values.shift(); return values.filter(row => row.some(v => v !== '')).map(row => { const obj = {}; headers.forEach((head, i) => obj[head] = row[i]); return obj; }); }
function appendObject_(name, item) { const sh = SpreadsheetApp.getActive().getSheetByName(name); const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0]; sh.appendRow(headers.map(head => item[head] || '')); }
function pick_(map, names) { for (let i = 0; i < names.length; i++) if (map[names[i]]) return map[names[i]]; return ''; }
function normalize_(value) { return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); }
function hash_(text) { const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8); return bytes.map(byte => ((byte + 256) % 256).toString(16).padStart(2, '0')).join(''); }
function json_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
