/* ============================================================
   City Trips — Express server
   - Statik saytni serve qiladi (index.html, css, js, assets)
   - POST /api/bookings — bron so'rovlarini saqlaydi
   - /admin — parolli admin panel (bronlarni ko'rish/boshqarish)
   Ma'lumotlar JSON faylда: DATA_DIR/db.json
   ============================================================ */
const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* ----- Sozlamalar (Railway'da Environment Variables orqali) ----- */
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "citytrips";
const SESSION_SECRET = process.env.SESSION_SECRET || "change-me-" + Math.random().toString(36).slice(2);
// Railway'da persistent Volume ulab, DATA_DIR=/data qiling (aks holda redeploy'da bronlar o'chadi)
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

/* ----- JSON "baza" ----- */
function ensureDb() {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (_) {}
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({ bookings: [] }, null, 2));
}
function readDb() {
  ensureDb();
  try { return JSON.parse(fs.readFileSync(DB_FILE, "utf8")); }
  catch (_) { return { bookings: [] }; }
}
function writeDb(db) {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

/* ----- Telegram bot (avtomatik xabar) ----- */
const TG_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TG_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";
async function notifyTelegram(b) {
  if (!TG_BOT_TOKEN || !TG_CHAT_ID) return; // sozlanmagan bo'lsa jim o'tadi
  const text =
`🔔 City Trips — Yangi buyurtma
━━━━━━━━━━━━━━
👤 F.I.Sh: ${b.name || "—"}
📞 Telefon: ${b.phone || "—"}
✈️ Yo'nalish: ${b.dest || "—"}
📅 Safar sanasi: ${b.date || "—"}
👥 Odamlar soni: ${b.people || "—"}
🕒 ${new Date(b.createdAt).toLocaleString("uz-UZ", { hour12: false })}`;
  try {
    await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text, disable_web_page_preview: true })
    });
  } catch (e) { console.error("Telegram notify error:", e.message); }
}

/* ----- Middleware ----- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1); // Railway proxy ortida

// CORS — forma boshqa domendan (citytrips.uz, github.io) yuborishi uchun
app.use("/api", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 8 } // 8 soat
}));

// Maxfiy yo'llarni bloklash (baza, server fayllari)
app.use((req, res, next) => {
  if (/^\/(\.data|data|node_modules|\.git|server\.js|package(-lock)?\.json)(\/|$)/.test(req.path)) {
    return res.status(404).send("Not found");
  }
  next();
});

const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const requireAuth = (req, res, next) => req.session.admin ? next() : res.redirect("/admin/login");

/* ============================================================
   PUBLIC API — bron so'rovi
   ============================================================ */
app.post("/api/bookings", (req, res) => {
  const b = req.body || {};
  const booking = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    dest: String(b.dest || "").slice(0, 200),
    name: String(b.name || "").slice(0, 120),
    phone: String(b.phone || "").slice(0, 40),
    date: String(b.date || "").slice(0, 20),
    people: String(b.people || "").slice(0, 10),
    lang: String(b.lang || "").slice(0, 4),
    status: "new",
    createdAt: new Date().toISOString()
  };
  if (!booking.name && !booking.phone) return res.status(400).json({ ok: false });
  const db = readDb();
  db.bookings.unshift(booking);
  if (db.bookings.length > 5000) db.bookings.length = 5000;
  writeDb(db);
  notifyTelegram(booking);            // avtomatik Telegram botga yuboramiz (fire-and-forget)
  res.json({ ok: true, id: booking.id });
});

/* ============================================================
   ADMIN
   ============================================================ */
const page = (title, body) => `<!DOCTYPE html><html lang="uz"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} — City Trips Admin</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,Segoe UI,Arial,sans-serif;background:#0c1322;color:#e7ecf5;min-height:100vh}
a{color:#f5751f;text-decoration:none}
.wrap{max-width:1000px;margin:0 auto;padding:24px}
.top{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;flex-wrap:wrap;gap:12px}
.brand{font-weight:800;font-size:20px;color:#fff}
.brand span{color:#f5751f}
.btn{display:inline-block;background:#f5751f;color:#fff;border:none;padding:10px 16px;border-radius:10px;font-weight:600;cursor:pointer;font-size:14px}
.btn--ghost{background:#1b2740;color:#cdd6e6}
.btn--danger{background:#c0392b}
.card{background:#141d31;border:1px solid #243150;border-radius:14px;padding:22px}
.stats{display:flex;gap:14px;margin-bottom:20px;flex-wrap:wrap}
.stat{background:#141d31;border:1px solid #243150;border-radius:12px;padding:14px 20px;flex:1;min-width:140px}
.stat b{font-size:26px;color:#f5751f;display:block}
.stat span{color:#8ea0bd;font-size:13px}
table{width:100%;border-collapse:collapse}
th,td{text-align:left;padding:11px 10px;border-bottom:1px solid #243150;font-size:14px;vertical-align:top}
th{color:#8ea0bd;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.04em}
.tag{display:inline-block;padding:3px 9px;border-radius:20px;font-size:12px;font-weight:600}
.tag--new{background:#2a1a5e;color:#c9b6ff}
.tag--done{background:#123a2a;color:#7fe0b0}
.muted{color:#8ea0bd}
form.inline{display:inline}
input{width:100%;padding:12px;border-radius:10px;border:1px solid #243150;background:#0c1322;color:#e7ecf5;font-size:15px;margin-top:6px}
label{font-size:13px;color:#8ea0bd}
.login{max-width:360px;margin:8vh auto}
.login .brand{text-align:center;display:block;margin-bottom:20px;font-size:24px}
.err{background:#3a1515;color:#ff9b9b;padding:10px 14px;border-radius:10px;margin-bottom:14px;font-size:14px}
.empty{text-align:center;color:#8ea0bd;padding:40px}
@media(max-width:640px){table,thead,tbody,th,td,tr{display:block}th{display:none}td{border:none;padding:4px 0}tr{border-bottom:1px solid #243150;padding:12px 0}}
</style></head><body>${body}</body></html>`;

// LOGIN
app.get("/admin/login", (req, res) => {
  if (req.session.admin) return res.redirect("/admin");
  const err = req.query.e ? `<div class="err">Login yoki parol xato</div>` : "";
  res.send(page("Kirish", `<div class="wrap"><div class="login card">
    <span class="brand">City<span>Trips</span> Admin</span>
    ${err}
    <form method="post" action="/admin/login">
      <label>Login</label><input name="user" autocomplete="username" required>
      <label style="display:block;margin-top:12px">Parol</label><input name="password" type="password" autocomplete="current-password" required>
      <button class="btn" style="width:100%;margin-top:18px">Kirish</button>
    </form>
  </div></div>`));
});
app.post("/admin/login", (req, res) => {
  const { user, password } = req.body || {};
  if (user === ADMIN_USER && password === ADMIN_PASSWORD) {
    req.session.admin = true;
    return res.redirect("/admin");
  }
  res.redirect("/admin/login?e=1");
});
app.post("/admin/logout", (req, res) => req.session.destroy(() => res.redirect("/admin/login")));

// DASHBOARD
app.get("/admin", requireAuth, (req, res) => {
  const db = readDb();
  const total = db.bookings.length;
  const nw = db.bookings.filter(b => b.status === "new").length;
  const rows = db.bookings.map(b => {
    const d = new Date(b.createdAt);
    const dt = isNaN(d) ? "" : d.toLocaleString("uz-UZ", { hour12: false });
    const tag = b.status === "done"
      ? `<span class="tag tag--done">Bog'lanildi</span>`
      : `<span class="tag tag--new">Yangi</span>`;
    const toggle = b.status === "done" ? "new" : "done";
    const toggleLabel = b.status === "done" ? "Yangi deb belgilash" : "Bog'lanildi";
    return `<tr>
      <td class="muted">${esc(dt)}</td>
      <td><b>${esc(b.dest) || "—"}</b></td>
      <td>${esc(b.name) || "—"}</td>
      <td><a href="tel:${esc(b.phone)}">${esc(b.phone) || "—"}</a></td>
      <td>${esc(b.date) || "—"}</td>
      <td>${esc(b.people) || "—"}</td>
      <td>${tag}</td>
      <td>
        <form class="inline" method="post" action="/admin/bookings/${esc(b.id)}/status">
          <input type="hidden" name="to" value="${toggle}">
          <button class="btn btn--ghost" style="padding:6px 10px;font-size:12px">${toggleLabel}</button>
        </form>
        <form class="inline" method="post" action="/admin/bookings/${esc(b.id)}/delete" onsubmit="return confirm('O\\'chirilsinmi?')">
          <button class="btn btn--danger" style="padding:6px 10px;font-size:12px">O'chirish</button>
        </form>
      </td></tr>`;
  }).join("");
  const body = `<div class="wrap">
    <div class="top">
      <span class="brand">City<span>Trips</span> Admin</span>
      <div style="display:flex;gap:10px">
        <a class="btn btn--ghost" href="/" target="_blank">Saytni ochish</a>
        <form class="inline" method="post" action="/admin/logout"><button class="btn btn--ghost">Chiqish</button></form>
      </div>
    </div>
    <div class="stats">
      <div class="stat"><b>${total}</b><span>Jami so'rovlar</span></div>
      <div class="stat"><b>${nw}</b><span>Yangi (ko'rilmagan)</span></div>
    </div>
    <div class="card">
      <h3 style="margin-bottom:14px">Bron so'rovlari</h3>
      ${total ? `<div style="overflow-x:auto"><table>
        <thead><tr><th>Qabul vaqti</th><th>Yo'nalish</th><th>F.I.Sh</th><th>Telefon</th><th>Safar sanasi</th><th>Kishi</th><th>Holat</th><th>Amal</th></tr></thead>
        <tbody>${rows}</tbody></table></div>`
        : `<div class="empty">Hozircha so'rovlar yo'q. Saytdagi "Bron qilish" orqali kelgan so'rovlar shu yerda ko'rinadi.</div>`}
    </div>
  </div>`;
  res.send(page("Bronlar", body));
});

app.post("/admin/bookings/:id/status", requireAuth, (req, res) => {
  const db = readDb();
  const b = db.bookings.find(x => x.id === req.params.id);
  if (b) { b.status = req.body.to === "done" ? "done" : "new"; writeDb(db); }
  res.redirect("/admin");
});
app.post("/admin/bookings/:id/delete", requireAuth, (req, res) => {
  const db = readDb();
  db.bookings = db.bookings.filter(x => x.id !== req.params.id);
  writeDb(db);
  res.redirect("/admin");
});

/* ============================================================
   STATIK SAYT (oxirida — API/admin yo'llaridan keyin)
   ============================================================ */
app.use(express.static(__dirname, { extensions: ["html"] }));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.listen(PORT, () => console.log(`City Trips server: http://localhost:${PORT}  (admin: /admin)`));
