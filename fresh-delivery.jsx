import { useState, useEffect } from "react";

// ─── PickMe Flash tiers ───────────────────────────────────────────────────────
const PICKME_TIERS = [
  { label: "Flash Express (< 5 km)",   fee: 299, eta: "30–45 min",  icon: "⚡" },
  { label: "Flash Standard (5–15 km)", fee: 449, eta: "45–75 min",  icon: "🛵" },
  { label: "Flash Bulk (> 15 km)",     fee: 699, eta: "90–120 min", icon: "🚚" },
];

// ─── Product photos ───────────────────────────────────────────────────────────
const PHOTOS = {
  "Carrot":      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80",
  "Broccoli":    "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80",
  "Tomato":      "https://images.unsplash.com/photo-1546094096-0df4bcabd337?w=400&q=80",
  "Spinach":     "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80",
  "Potato":      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80",
  "Onion":       "https://images.unsplash.com/photo-1508747703725-719777637510?w=400&q=80",
  "Capsicum":    "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80",
  "Cucumber":    "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&q=80",
  "Cauliflower": "https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=400&q=80",
  "Leek":        "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=400&q=80",
};

const DEFAULT_PRODUCTS = [
  { id:1,  name:"Carrot",      price:120, unit:"kg",   category:"Root",   stock:50,  photo:PHOTOS["Carrot"] },
  { id:2,  name:"Broccoli",    price:280, unit:"kg",   category:"Green",  stock:30,  photo:PHOTOS["Broccoli"] },
  { id:3,  name:"Tomato",      price:180, unit:"kg",   category:"Fruit",  stock:80,  photo:PHOTOS["Tomato"] },
  { id:4,  name:"Spinach",     price:90,  unit:"kg",   category:"Leafy",  stock:40,  photo:PHOTOS["Spinach"] },
  { id:5,  name:"Potato",      price:95,  unit:"kg",   category:"Root",   stock:100, photo:PHOTOS["Potato"] },
  { id:6,  name:"Onion",       price:110, unit:"kg",   category:"Bulb",   stock:70,  photo:PHOTOS["Onion"] },
  { id:7,  name:"Capsicum",    price:220, unit:"kg",   category:"Fruit",  stock:25,  photo:PHOTOS["Capsicum"] },
  { id:8,  name:"Cucumber",    price:130, unit:"kg",   category:"Fruit",  stock:60,  photo:PHOTOS["Cucumber"] },
  { id:9,  name:"Cauliflower", price:200, unit:"each", category:"Green",  stock:20,  photo:PHOTOS["Cauliflower"] },
  { id:10, name:"Leek",        price:160, unit:"kg",   category:"Bulb",   stock:35,  photo:PHOTOS["Leek"] },
];

// ─── Storage ──────────────────────────────────────────────────────────────────
const store = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ─── Invoice HTML builder ─────────────────────────────────────────────────────
function buildInvoiceHTML(order) {
  const rows = order.items.map(i =>
    `<tr>
      <td style="padding:10px 14px;border-bottom:1px solid #1e2a3a">${i.name}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #1e2a3a;text-align:center">${i.qty} ${i.unit}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #1e2a3a;text-align:right">Rs ${i.price.toLocaleString()}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #1e2a3a;text-align:right;font-weight:700;color:#c9a84c">Rs ${(i.qty*i.price).toLocaleString()}</td>
    </tr>`
  ).join("");
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Sora',sans-serif;background:#0a0f1a;min-height:100vh;padding:40px 20px;}
  .inv{background:#111827;max-width:700px;margin:0 auto;border-radius:20px;overflow:hidden;border:1px solid #1e2a3a;box-shadow:0 20px 60px rgba(0,0,0,.6);}
  .inv-head{background:linear-gradient(135deg,#0d1b2a 0%,#1a2540 50%,#0d1b2a 100%);padding:36px;border-bottom:1px solid #1e2a3a;display:flex;align-items:center;justify-content:space-between;}
  .inv-logo-wrap{display:flex;align-items:center;gap:14px;}
  .inv-diamond{width:44px;height:44px;background:linear-gradient(135deg,#c9a84c,#f0d080);transform:rotate(45deg);border-radius:6px;flex-shrink:0;}
  .inv-brand{font-size:1.5rem;font-weight:800;color:#fff;letter-spacing:-0.5px;}
  .inv-tagline{font-size:.75rem;color:#6b7a99;margin-top:2px;letter-spacing:.5px;text-transform:uppercase;}
  .inv-badge{background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.3);color:#c9a84c;padding:6px 14px;border-radius:8px;font-size:.8rem;font-weight:700;letter-spacing:.5px;}
  .inv-body{padding:32px 36px;}
  .inv-meta{display:flex;justify-content:space-between;flex-wrap:wrap;gap:20px;margin-bottom:32px;padding:20px;background:#0d1b2a;border-radius:12px;border:1px solid #1e2a3a;}
  .inv-label{font-size:.7rem;color:#6b7a99;text-transform:uppercase;letter-spacing:.8px;font-weight:600;margin-bottom:6px;}
  .inv-val{color:#fff;font-weight:700;font-size:.95rem;}
  .inv-val-sm{color:#a0aec0;font-size:.82rem;margin-top:3px;}
  table{width:100%;border-collapse:collapse;margin-bottom:20px;}
  thead th{background:#0d1b2a;padding:10px 14px;text-align:left;font-size:.72rem;text-transform:uppercase;letter-spacing:.8px;color:#6b7a99;font-weight:600;}
  tbody tr:hover{background:rgba(255,255,255,.02);}
  .tfoot-row td{padding:10px 14px;font-size:.88rem;color:#a0aec0;}
  .tfoot-total td{padding:14px;background:linear-gradient(135deg,rgba(201,168,76,.1),rgba(201,168,76,.05));font-weight:800;font-size:1.1rem;color:#c9a84c;border-top:1px solid rgba(201,168,76,.3);}
  .pickme-box{background:linear-gradient(135deg,rgba(255,107,53,.1),rgba(255,107,53,.05));border:1px solid rgba(255,107,53,.3);border-radius:12px;padding:16px;margin:20px 0;display:flex;align-items:center;gap:12px;}
  .pm-badge{background:#FF6B35;color:#fff;padding:5px 12px;border-radius:8px;font-size:.78rem;font-weight:800;white-space:nowrap;}
  .pm-label{color:#fff;font-weight:600;font-size:.9rem;}
  .pm-ref{color:#FF6B35;font-size:.8rem;margin-top:3px;}
  .footer{text-align:center;padding:20px;border-top:1px solid #1e2a3a;color:#4a5568;font-size:.78rem;line-height:1.6;}
  .footer span{color:#c9a84c;}
</style></head><body>
<div class="inv">
  <div class="inv-head">
    <div class="inv-logo-wrap">
      <div class="inv-diamond"></div>
      <div>
        <div class="inv-brand">FRESH DELIVERY</div>
        <div class="inv-tagline">Farm Fresh · Sri Lanka</div>
      </div>
    </div>
    <div class="inv-badge">TAX INVOICE</div>
  </div>
  <div class="inv-body">
    <div class="inv-meta">
      <div>
        <div class="inv-label">Invoice Number</div>
        <div class="inv-val">${order.id}</div>
        <div class="inv-val-sm">${order.date}</div>
      </div>
      <div>
        <div class="inv-label">Bill To</div>
        <div class="inv-val">${order.userName}</div>
        <div class="inv-val-sm">${order.userEmail}</div>
        <div class="inv-val-sm">${order.userPhone}</div>
      </div>
      <div>
        <div class="inv-label">Delivery Address</div>
        <div class="inv-val-sm" style="max-width:160px">${order.deliveryAddress}</div>
      </div>
    </div>
    <table>
      <thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Rate</th><th style="text-align:right">Amount</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr class="tfoot-row"><td colspan="3" style="text-align:right">Subtotal</td><td style="text-align:right;color:#fff;font-weight:600">Rs ${order.subtotal.toLocaleString()}</td></tr>
        <tr class="tfoot-row"><td colspan="3" style="text-align:right">PickMe Flash Delivery</td><td style="text-align:right;color:#FF6B35;font-weight:600">Rs ${order.deliveryFee.toLocaleString()}</td></tr>
        <tr class="tfoot-total"><td colspan="3" style="text-align:right">Total</td><td style="text-align:right">Rs ${order.total.toLocaleString()}</td></tr>
      </tfoot>
    </table>
    <div class="pickme-box">
      <span class="pm-badge">⚡ PickMe Flash</span>
      <div>
        <div class="pm-label">${order.pickme.label} · ETA ${order.pickme.eta}</div>
        <div class="pm-ref">Booking Reference: ${order.pickmeRef}</div>
      </div>
    </div>
    <div class="footer">Thank you for choosing <span>FRESH DELIVERY</span> — Sri Lanka's Premium Delivery Network<br>support@freshdelivery.lk · +94 77 000 0000 · freshdelivery.lk</div>
  </div>
</div>
</body></html>`;
}

// ─── AI email simulation ──────────────────────────────────────────────────────
async function sendEmailViaAI({ to, subject, bodyHTML, type }) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are an email delivery system for FreshDelivery.lk.
Simulate sending this email and confirm it was sent.
Return ONLY valid JSON: {"sent": true, "messageId": "<random-id>", "timestamp": "<ISO date>"}
To: ${to}
Subject: ${subject}
Type: ${type}
Body: ${bodyHTML.replace(/<[^>]+>/g," ").replace(/\s+/g," ").slice(0,300)}`
        }]
      })
    });
    const data = await res.json();
    const text = data.content?.[0]?.text || "{}";
    return JSON.parse(text.replace(/```json|```/g,"").trim());
  } catch {
    return { sent: false };
  }
}

// ─── Toast ────────────────────────────────────────────────────────────────────
let _tid = 0;
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type="info") => {
    const id = ++_tid;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  };
  return { toasts, add };
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

:root {
  --navy:    #0a0f1a;
  --navy2:   #0d1b2a;
  --navy3:   #111827;
  --navy4:   #1a2540;
  --border:  #1e2a3a;
  --gold:    #c9a84c;
  --gold2:   #f0d080;
  --goldFade:rgba(201,168,76,.12);
  --text:    #e8edf5;
  --muted:   #6b7a99;
  --muted2:  #a0aec0;
  --red:     #e63946;
  --orange:  #FF6B35;
  --white:   #ffffff;
  --success: #4ade80;
  --shadow:  0 4px 24px rgba(0,0,0,.4);
  --radius:  12px;
}

html { scroll-behavior: smooth; }
body { font-family: 'Sora', sans-serif; background: var(--navy); color: var(--text); min-height: 100vh; }

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: var(--navy2); } ::-webkit-scrollbar-thumb { background: var(--navy4); border-radius: 99px; }

/* ── NAV ── */
.nav { position: sticky; top: 0; z-index: 100; background: rgba(10,15,26,.92); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 28px; height: 66px; }
.nav-brand { display: flex; align-items: center; gap: 12px; cursor: pointer; text-decoration: none; }
.nav-diamond { width: 34px; height: 34px; background: linear-gradient(135deg,var(--gold),var(--gold2)); transform: rotate(45deg); border-radius: 5px; flex-shrink: 0; box-shadow: 0 0 16px rgba(201,168,76,.35); }
.nav-wordmark { display: flex; flex-direction: column; }
.nav-title { font-size: 1.1rem; font-weight: 800; color: var(--text); letter-spacing: 2px; text-transform: uppercase; line-height: 1; }
.nav-sub { font-size: .6rem; color: var(--muted); letter-spacing: 2.5px; text-transform: uppercase; margin-top: 2px; }
.nav-actions { display: flex; align-items: center; gap: 10px; }
.nav-badge { position: relative; }
.badge-count { position: absolute; top: -5px; right: -5px; background: var(--gold); color: var(--navy); font-size: 9px; font-weight: 800; width: 17px; height: 17px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.nav-user { font-size: .78rem; color: var(--muted2); display: flex; align-items: center; gap: 6px; }
.nav-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); }

/* ── BUTTONS ── */
.btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 20px; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: .82rem; font-weight: 600; cursor: pointer; border: none; transition: all .18s; letter-spacing: .3px; }
.btn-gold { background: linear-gradient(135deg,var(--gold),var(--gold2)); color: var(--navy); }
.btn-gold:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,168,76,.35); }
.btn-outline { background: transparent; border: 1px solid var(--border); color: var(--muted2); }
.btn-outline:hover { border-color: var(--gold); color: var(--gold); }
.btn-ghost { background: transparent; color: var(--muted); padding: 8px 12px; border: none; }
.btn-ghost:hover { color: var(--text); background: rgba(255,255,255,.04); }
.btn-danger { background: rgba(230,57,70,.15); color: var(--red); border: 1px solid rgba(230,57,70,.25); }
.btn-danger:hover { background: rgba(230,57,70,.25); }
.btn-sm { padding: 6px 13px; font-size: .75rem; }
.btn-icon { padding: 8px; background: transparent; border: none; cursor: pointer; color: var(--muted2); font-size: 1rem; border-radius: 8px; display: inline-flex; transition: all .15s; }
.btn-icon:hover { background: rgba(255,255,255,.05); color: var(--text); }

/* ── HERO ── */
.hero { background: var(--navy2); border-bottom: 1px solid var(--border); padding: 72px 32px 60px; text-align: center; position: relative; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,168,76,.08) 0%, transparent 70%); pointer-events: none; }
.hero-grid { position: absolute; inset: 0; background-image: linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px); background-size: 48px 48px; opacity: .3; pointer-events: none; }
.hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: var(--goldFade); border: 1px solid rgba(201,168,76,.2); color: var(--gold); font-size: .72rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 6px 16px; border-radius: 99px; margin-bottom: 22px; }
.hero-title { font-size: clamp(2rem,5vw,3.4rem); font-weight: 800; line-height: 1.1; margin-bottom: 16px; letter-spacing: -1px; }
.hero-title span { background: linear-gradient(135deg,var(--gold),var(--gold2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-sub { color: var(--muted2); font-size: .95rem; max-width: 520px; margin: 0 auto 32px; line-height: 1.7; font-weight: 300; }
.hero-stats { display: flex; justify-content: center; gap: 0; border: 1px solid var(--border); border-radius: 14px; overflow: hidden; max-width: 480px; margin: 0 auto; background: var(--navy3); }
.hero-stat { flex: 1; padding: 18px 20px; text-align: center; border-right: 1px solid var(--border); }
.hero-stat:last-child { border-right: none; }
.hero-stat-num { font-size: 1.5rem; font-weight: 800; color: var(--gold); font-family: 'DM Mono', monospace; }
.hero-stat-label { font-size: .68rem; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 3px; }

/* ── SHOP ── */
.shop-wrap { max-width: 1200px; margin: 0 auto; padding: 40px 24px; }
.section-header { margin-bottom: 28px; }
.section-title { font-size: 1.4rem; font-weight: 700; letter-spacing: -.3px; }
.section-sub { color: var(--muted); font-size: .85rem; margin-top: 5px; }
.filter-bar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; }
.chip { padding: 6px 16px; border-radius: 99px; border: 1px solid var(--border); background: transparent; color: var(--muted2); font-family: 'Sora',sans-serif; font-size: .78rem; font-weight: 500; cursor: pointer; transition: all .15s; letter-spacing: .3px; }
.chip:hover { border-color: var(--gold); color: var(--gold); }
.chip.active { background: var(--goldFade); border-color: var(--gold); color: var(--gold); font-weight: 700; }

/* ── PRODUCT GRID ── */
.prod-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(220px,1fr)); gap: 18px; }
.prod-card { background: var(--navy3); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: all .2s; cursor: default; }
.prod-card:hover { border-color: rgba(201,168,76,.3); transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,.4); }
.prod-img { width: 100%; height: 160px; object-fit: cover; display: block; }
.prod-body { padding: 14px; }
.prod-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.prod-name { font-size: 1rem; font-weight: 700; letter-spacing: -.2px; }
.prod-cat { font-size: .65rem; background: var(--goldFade); color: var(--gold); padding: 2px 8px; border-radius: 99px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; white-space: nowrap; }
.prod-price { font-size: 1.05rem; font-weight: 800; color: var(--gold); margin-top: 8px; font-family: 'DM Mono',monospace; }
.prod-unit { font-size: .72rem; color: var(--muted); font-weight: 400; font-family: 'Sora',sans-serif; }
.prod-add { width: 100%; margin-top: 12px; justify-content: center; }

/* ── QTY ── */
.qty-ctrl { display: flex; align-items: center; gap: 8px; width: 100%; margin-top: 12px; }
.qty-btn { width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--border); background: var(--navy4); color: var(--text); font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; flex-shrink: 0; }
.qty-btn:hover { border-color: var(--gold); color: var(--gold); }
.qty-num { flex: 1; text-align: center; font-weight: 700; font-family: 'DM Mono',monospace; }

/* ── CART DRAWER ── */
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 200; opacity: 0; pointer-events: none; transition: opacity .25s; }
.overlay.open { opacity: 1; pointer-events: all; }
.cart-drawer { position: fixed; top: 0; right: 0; height: 100vh; width: min(400px,100vw); background: var(--navy3); border-left: 1px solid var(--border); z-index: 201; transform: translateX(100%); transition: transform .28s cubic-bezier(.4,0,.2,1); display: flex; flex-direction: column; }
.cart-drawer.open { transform: translateX(0); }
.cart-head { padding: 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.cart-hed-title { font-size: 1.1rem; font-weight: 700; letter-spacing: -.2px; }
.cart-body { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.cart-item { display: flex; gap: 10px; align-items: center; padding: 10px; border-radius: 10px; background: var(--navy4); border: 1px solid var(--border); }
.ci-img { width: 50px; height: 50px; border-radius: 7px; object-fit: cover; flex-shrink: 0; }
.ci-info { flex: 1; }
.ci-name { font-weight: 600; font-size: .85rem; }
.ci-price { font-size: .78rem; color: var(--muted); margin-top: 2px; }
.cart-foot { padding: 16px; border-top: 1px solid var(--border); }
.cart-row { display: flex; justify-content: space-between; font-size: .85rem; margin-bottom: 8px; color: var(--muted2); }
.cart-total-val { color: var(--gold); font-weight: 800; font-size: 1.15rem; font-family: 'DM Mono',monospace; }
.empty-cart { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: var(--muted); }
.empty-icon { font-size: 3rem; opacity: .2; }

/* ── PICKME ── */
.pm-section-label { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin: 4px 0 8px; }
.pm-options { display: flex; flex-direction: column; gap: 8px; }
.pm-opt { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 9px; border: 1px solid var(--border); background: var(--navy2); cursor: pointer; transition: all .15s; }
.pm-opt:hover { border-color: var(--orange); }
.pm-opt.sel { border-color: var(--orange); background: rgba(255,107,53,.07); }
.pm-icon { font-size: 1.2rem; }
.pm-label { font-size: .82rem; font-weight: 600; }
.pm-eta { font-size: .72rem; color: var(--muted); }
.pm-fee { margin-left: auto; font-weight: 800; color: var(--orange); font-size: .85rem; font-family: 'DM Mono',monospace; }
.pm-badge { display: inline-flex; align-items: center; gap: 5px; background: var(--orange); color: #fff; padding: 2px 9px; border-radius: 99px; font-size: .7rem; font-weight: 800; }

/* ── AUTH MODAL ── */
.backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.7); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 16px; backdrop-filter: blur(4px); }
.modal { background: var(--navy3); border: 1px solid var(--border); border-radius: 18px; width: 100%; max-width: 420px; padding: 36px; box-shadow: 0 24px 80px rgba(0,0,0,.6); animation: mIn .22s ease; }
@keyframes mIn { from { transform: scale(.94) translateY(14px); opacity:0; } to { transform:none; opacity:1; } }
.modal-gem { width: 52px; height: 52px; background: linear-gradient(135deg,var(--gold),var(--gold2)); transform: rotate(45deg); border-radius: 8px; margin: 0 auto 22px; box-shadow: 0 0 30px rgba(201,168,76,.3); }
.modal-title { font-size: 1.6rem; font-weight: 800; text-align: center; margin-bottom: 5px; letter-spacing: -.5px; }
.modal-sub { text-align: center; color: var(--muted); font-size: .84rem; margin-bottom: 26px; font-weight: 300; }
.fg { margin-bottom: 14px; }
.fl { display: block; font-size: .7rem; font-weight: 700; margin-bottom: 6px; color: var(--muted); text-transform: uppercase; letter-spacing: .8px; }
.fi { width: 100%; padding: 11px 13px; border: 1px solid var(--border); border-radius: 8px; font-family: 'Sora',sans-serif; font-size: .88rem; outline: none; transition: border-color .15s; background: var(--navy2); color: var(--text); }
.fi:focus { border-color: var(--gold); }
.fr { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.fe { font-size: .75rem; color: var(--red); margin-top: 4px; }
.fs { text-align: center; margin-top: 16px; font-size: .82rem; color: var(--muted); }
.fs a { color: var(--gold); cursor: pointer; font-weight: 600; }
.type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 18px; }
.type-btn { padding: 10px; border-radius: 8px; border: 1px solid var(--border); background: transparent; cursor: pointer; font-family: 'Sora',sans-serif; font-size: .82rem; font-weight: 600; color: var(--muted2); transition: all .15s; }
.type-btn.on { border-color: var(--gold); background: var(--goldFade); color: var(--gold); }

/* ── ADMIN ── */
.admin-wrap { display: grid; grid-template-columns: 210px 1fr; min-height: calc(100vh - 66px); }
.sidebar { background: var(--navy2); border-right: 1px solid var(--border); padding: 24px 0; }
.sidebar-label { font-size: .62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: var(--muted); padding: 0 18px 10px; }
.sb-item { display: flex; align-items: center; gap: 9px; padding: 11px 18px; font-size: .83rem; font-weight: 500; color: var(--muted2); cursor: pointer; transition: all .15s; border-left: 2px solid transparent; }
.sb-item:hover { color: var(--text); background: rgba(255,255,255,.03); }
.sb-item.on { color: var(--gold); background: var(--goldFade); border-left-color: var(--gold); font-weight: 700; }
.admin-main { background: var(--navy); padding: 32px; overflow-y: auto; }
.page-title { font-size: 1.6rem; font-weight: 800; letter-spacing: -.5px; margin-bottom: 4px; }
.page-sub { color: var(--muted); font-size: .83rem; margin-bottom: 28px; }

/* ── STAT CARDS ── */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(190px,1fr)); gap: 16px; margin-bottom: 28px; }
.sc { background: var(--navy3); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
.sc-icon { font-size: 1.6rem; margin-bottom: 10px; }
.sc-num { font-size: 1.8rem; font-weight: 800; font-family: 'DM Mono',monospace; color: var(--gold); }
.sc-label { font-size: .75rem; color: var(--muted); margin-top: 4px; text-transform: uppercase; letter-spacing: .5px; }

/* ── TABLE ── */
.tw { background: var(--navy3); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.dt { width: 100%; border-collapse: collapse; font-size: .82rem; }
.dt thead tr { border-bottom: 1px solid var(--border); }
.dt th { padding: 11px 14px; text-align: left; font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: var(--muted); }
.dt td { padding: 12px 14px; border-bottom: 1px solid rgba(30,42,58,.6); vertical-align: middle; }
.dt tr:last-child td { border-bottom: none; }
.dt tr:hover td { background: rgba(255,255,255,.015); }
.t-img { width: 42px; height: 42px; border-radius: 7px; object-fit: cover; }
.pi { width: 86px; padding: 6px 10px; border: 1px solid var(--border); border-radius: 7px; font-size: .82rem; font-family: 'DM Mono',monospace; text-align: center; outline: none; background: var(--navy2); color: var(--gold); }
.pi:focus { border-color: var(--gold); }
.stock-ok  { background: rgba(74,222,128,.1);  color: #4ade80; padding:2px 9px; border-radius:99px; font-size:.72rem; font-weight:700; }
.stock-low { background: rgba(250,204,21,.1);  color: #facc15; padding:2px 9px; border-radius:99px; font-size:.72rem; font-weight:700; }

/* ── ADD FORM ── */
.add-form { background: var(--navy3); border: 1px solid var(--border); border-radius: var(--radius); padding: 26px; max-width: 620px; margin-bottom: 28px; }

/* ── ORDER CARD ── */
.oc { background: var(--navy3); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; margin-bottom: 14px; }
.oc-head { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
.oc-id { font-weight: 800; font-size: .88rem; font-family: 'DM Mono',monospace; color: var(--gold); }
.oc-meta { font-size: .75rem; color: var(--muted); margin-top: 3px; }

/* ── STATUS BADGES ── */
.sb { padding: 3px 10px; border-radius: 99px; font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; }
.sb-confirmed  { background:rgba(96,165,250,.12); color:#60a5fa; }
.sb-dispatched { background:rgba(192,132,252,.12); color:#c084fc; }
.sb-delivered  { background:rgba(74,222,128,.12);  color:#4ade80; }
.sb-cancelled  { background:rgba(230,57,70,.12);   color:#e63946; }
.sb-pending    { background:rgba(250,204,21,.12);  color:#facc15; }

/* ── INVOICE MODAL ── */
.inv-modal { background: var(--navy3); border: 1px solid var(--border); border-radius: 18px; width: 100%; max-width: 740px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 24px 80px rgba(0,0,0,.7); animation: mIn .22s ease; }
.inv-bar { padding: 14px 18px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--navy2); }

/* ── EMAIL LOG ── */
.email-log { background: var(--navy2); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
.el-label { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 14px; }
.el-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border); }
.el-item:last-child { border-bottom: none; }
.el-dot { width: 7px; height: 7px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }

/* ── AVATAR ── */
.avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--goldFade); border: 1px solid rgba(201,168,76,.3); color: var(--gold); font-weight: 700; font-size: .8rem; display: inline-flex; align-items: center; justify-content: center; }

/* ── TOAST ── */
.toast-wrap { position: fixed; bottom: 22px; right: 22px; z-index: 999; display: flex; flex-direction: column; gap: 9px; }
.toast { background: var(--navy3); border: 1px solid var(--border); color: var(--text); padding: 11px 18px; border-radius: 10px; font-size: .82rem; font-weight: 500; box-shadow: var(--shadow); animation: tIn .25s ease; display: flex; align-items: center; gap: 8px; min-width: 210px; }
.toast.success { border-color: rgba(74,222,128,.3); }
.toast.error   { border-color: rgba(230,57,70,.3); }
@keyframes tIn { from { transform: translateX(24px); opacity:0; } to { transform:none; opacity:1; } }


/* ── PAYMENT MODAL ── */
.pay-modal { background: var(--navy3); border: 1px solid var(--border); border-radius: 20px; width: 100%; max-width: 460px; padding: 0; overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,.7); animation: mIn .22s ease; }
.pay-head { background: var(--navy2); border-bottom: 1px solid var(--border); padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; }
.pay-body { padding: 24px; }
.pay-amount { text-align: center; padding: 20px; background: var(--goldFade); border: 1px solid rgba(201,168,76,.2); border-radius: 12px; margin-bottom: 24px; }
.pay-amount-label { font-size: .72rem; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 6px; }
.pay-amount-val { font-size: 2.2rem; font-weight: 800; color: var(--gold); font-family: 'DM Mono',monospace; }
.pay-methods { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.pay-method { border: 1.5px solid var(--border); border-radius: 12px; padding: 14px 16px; cursor: pointer; transition: all .15s; display: flex; align-items: center; gap: 14px; background: var(--navy2); }
.pay-method:hover { border-color: var(--gold); }
.pay-method.sel { border-color: var(--gold); background: var(--goldFade); }
.pay-method-icon { font-size: 1.6rem; flex-shrink: 0; }
.pay-method-title { font-weight: 700; font-size: .9rem; }
.pay-method-sub { font-size: .75rem; color: var(--muted); margin-top: 2px; }
.pay-method-tag { margin-left: auto; font-size: .68rem; padding: 2px 8px; border-radius: 99px; font-weight: 700; white-space: nowrap; }
.tag-rec { background: rgba(74,222,128,.12); color: #4ade80; }
.tag-free { background: rgba(201,168,76,.12); color: var(--gold); }
.pay-card-fields { background: var(--navy2); border: 1px solid var(--border); border-radius: 10px; padding: 16px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 12px; }
.pay-status { text-align: center; padding: 28px 20px; }
.pay-status-icon { font-size: 3rem; margin-bottom: 12px; }
.pay-status-title { font-weight: 800; font-size: 1.2rem; margin-bottom: 6px; }
.pay-status-sub { font-size: .85rem; color: var(--muted); }
.pay-link { display: block; text-align: center; padding: 10px; background: var(--goldFade); border: 1px solid rgba(201,168,76,.2); border-radius: 8px; color: var(--gold); font-size: .8rem; font-weight: 600; margin-top: 14px; text-decoration: none; cursor: pointer; }
.pay-ref { font-family: 'DM Mono',monospace; font-size: .78rem; color: var(--muted); margin-top: 6px; }
.cod-steps { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.cod-step { display: flex; align-items: flex-start; gap: 12px; padding: 12px; background: var(--navy2); border: 1px solid var(--border); border-radius: 10px; }
.cod-step-num { width: 24px; height: 24px; border-radius: 50%; background: var(--goldFade); border: 1px solid rgba(201,168,76,.3); color: var(--gold); font-size: .75rem; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.cod-step-text { font-size: .82rem; color: var(--muted2); line-height: 1.5; }

/* ── SPINNER ── */
.spin-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.65); z-index: 500; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
.spin-box { background: var(--navy3); border: 1px solid var(--border); border-radius: 16px; padding: 36px 48px; text-align: center; }
.spinner { width: 40px; height: 40px; border: 2px solid var(--border); border-top-color: var(--gold); border-radius: 50%; animation: spin .7s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── RESPONSIVE ── */
@media(max-width:700px){
  .admin-wrap { grid-template-columns: 1fr; }
  .sidebar { display: flex; overflow-x: auto; padding: 0; }
  .sb-item { padding: 14px 14px; white-space: nowrap; border-left: none; border-bottom: 2px solid transparent; }
  .sb-item.on { border-bottom-color: var(--gold); border-left-color: transparent; }
  .prod-grid { grid-template-columns: repeat(auto-fill,minmax(160px,1fr)); }
  .hero-stats { max-width: 100%; }
  .fr { grid-template-columns: 1fr; }
}
`;

function InjectCSS() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);
  return null;
}

function ToastContainer({ toasts }) {
  const icons = { success:"✓", error:"✕", info:"◆" };
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span style={{ color: t.type==="success"?"#4ade80":t.type==="error"?"#e63946":"var(--gold)" }}>{icons[t.type]||"◆"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── Logo mark ────────────────────────────────────────────────────────────────
function Diamond({ size=34 }) {
  return (
    <div style={{ width:size, height:size, background:"linear-gradient(135deg,#c9a84c,#f0d080)", transform:"rotate(45deg)", borderRadius:size*0.14, flexShrink:0, boxShadow:"0 0 16px rgba(201,168,76,.3)" }} />
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user,      setUser]      = useState(() => store.get("ix_user", null));
  const [products,  setProducts]  = useState(() => store.get("ix_products", DEFAULT_PRODUCTS));
  const [users,     setUsers]     = useState(() => store.get("ix_users", []));
  const [orders,    setOrders]    = useState(() => store.get("ix_orders", []));
  const [emailLog,  setEmailLog]  = useState(() => store.get("ix_emails", []));
  const [cart,      setCart]      = useState([]);
  const [cartOpen,  setCartOpen]  = useState(false);
  const [auth,      setAuth]      = useState(null);
  const [page,      setPage]      = useState("shop");
  const [sending,   setSending]   = useState(false);
  const [pickme,    setPickme]    = useState(PICKME_TIERS[0]);
  const [invoice,   setInvoice]   = useState(null);
  const [payOrder,  setPayOrder]  = useState(null); // order waiting for payment
  const { toasts, add: toast }    = useToast();

  useEffect(() => store.set("ix_products", products), [products]);
  useEffect(() => store.set("ix_users",    users),    [users]);
  useEffect(() => store.set("ix_orders",   orders),   [orders]);
  useEffect(() => store.set("ix_emails",   emailLog), [emailLog]);
  useEffect(() => { if(user) store.set("ix_user",user); else localStorage.removeItem("ix_user"); }, [user]);

  const cartCount    = cart.reduce((s,i)=>s+i.qty,0);
  const cartSubtotal = cart.reduce((s,i)=>s+i.qty*i.price,0);
  const cartTotal    = cartSubtotal + pickme.fee;

  const addToCart = (p) => {
    if(!user){ setAuth("login"); return; }
    setCart(c => {
      const ex = c.find(x=>x.id===p.id);
      if(ex) return c.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x);
      return [...c,{...p,qty:1}];
    });
    toast(`${p.name} added`, "success");
  };

  const changeQty = (id, d) => setCart(c => c.map(x=>x.id===id?{...x,qty:Math.max(0,x.qty+d)}:x).filter(x=>x.qty>0));

  const logEmail = (e) => setEmailLog(l=>[{...e,time:new Date().toLocaleTimeString()},...l.slice(0,49)]);

  const placeOrder = async () => {
    if(!user||cart.length===0) return;
    setSending(true); setCartOpen(false);
    const ref = `PM-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
    const order = {
      id: `INV-${Date.now()}`,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      userPhone: user.phone||"—",
      userType: user.type,
      deliveryAddress: user.address||"—",
      items: cart,
      subtotal: cartSubtotal,
      deliveryFee: pickme.fee,
      total: cartTotal,
      pickme, pickmeRef: ref,
      status: "confirmed",
      date: new Date().toLocaleString(),
      invoiceHTML: "",
    };
    order.invoiceHTML = buildInvoiceHTML(order);
    const r = await sendEmailViaAI({ to:user.email, subject:`Delivery Invoice ${order.id}`, bodyHTML:order.invoiceHTML, type:"invoice" });
    logEmail({ to:user.email, subject:`Invoice ${order.id}`, sent:r.sent, type:"invoice" });
    setOrders(o=>[order,...o]);
    setCart([]);
    setSending(false);
    toast(`Order confirmed — invoice sent to ${user.email}`, "success");
    setInvoice(order);
    setPayOrder(order); // open payment modal
  };

  const handleSignup = (d) => {
    if(users.find(u=>u.email===d.email)){ toast("Email already registered","error"); return; }
    const nu = {...d, id:Date.now(), createdAt:new Date().toLocaleDateString()};
    setUsers(u=>[...u,nu]); setUser(nu); setAuth(null);
    toast(`Welcome aboard, ${d.firstName}!`,"success");
  };

  const handleLogin = (d) => {
    if(d.email==="admin@freshdelivery.lk"&&d.password==="admin123"){
      const a={id:0,firstName:"Admin",lastName:"",email:"admin@freshdelivery.lk",type:"admin",isAdmin:true,createdAt:"—"};
      setUser(a); setAuth(null); toast("Welcome back, Admin","success"); return;
    }
    const f = users.find(u=>u.email===d.email&&u.password===d.password);
    if(!f){ toast("Invalid credentials","error"); return; }
    setUser(f); setAuth(null); toast(`Welcome back, ${f.firstName}`,"success");
  };

  const handleLogout = () => { setUser(null); setCart([]); setPage("shop"); toast("Signed out"); };

  const onDelivered = async (order) => {
    const r = await sendEmailViaAI({ to:"admin@freshdelivery.lk", subject:`✅ Delivered: ${order.id}`, bodyHTML:`Order ${order.id} delivered to ${order.userName}.`, type:"admin_alert" });
    logEmail({ to:"admin@freshdelivery.lk", subject:`Delivered: ${order.id}`, sent:r.sent, type:"admin_alert" });
    toast(`Admin notified — ${order.id} delivered`,"success");
  };

  return (
    <>
      <InjectCSS />

      {/* ── Navbar ── */}
      <nav className="nav">
        <div className="nav-brand" onClick={()=>setPage("shop")}>
          <Diamond size={34} />
          <div className="nav-wordmark">
            <span className="nav-title">Fresh<span style={{color:"var(--gold)"}}>.</span>lk</span>
            <span className="nav-sub">Fresh Delivery</span>
          </div>
        </div>
        <div className="nav-actions">
          {user?.isAdmin && <>
            <button className="btn btn-ghost btn-sm" onClick={()=>setPage("shop")} style={{color:page==="shop"?"var(--text)":"var(--muted)"}}>Shop</button>
            <button className={`btn btn-sm ${page==="admin"?"btn-gold":"btn-outline"}`} onClick={()=>setPage("admin")}>⚙ Admin</button>
          </>}
          {user ? <>
            <div className="nav-badge">
              <button className="btn-icon" onClick={()=>setCartOpen(true)} style={{fontSize:"1.2rem"}}>🛒</button>
              {cartCount>0 && <span className="badge-count">{cartCount}</span>}
            </div>
            <div className="nav-user">
              <span className="nav-dot"/>
              <span>{user.firstName}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Sign out</button>
            </div>
          </> : (
            <button className="btn btn-gold btn-sm" onClick={()=>setAuth("login")}>Sign In</button>
          )}
        </div>
      </nav>

      {/* ── Pages ── */}
      {page==="shop" ? (
        <ShopPage products={products} cart={cart} addToCart={addToCart} changeQty={changeQty} user={user} onAuthRequired={()=>setAuth("login")} />
      ) : user?.isAdmin ? (
        <AdminPage products={products} setProducts={setProducts} users={users} orders={orders} setOrders={setOrders} emailLog={emailLog} onDelivered={onDelivered} toast={toast} />
      ) : (
        <div style={{textAlign:"center",padding:"80px 24px",color:"var(--muted)"}}>
          <div style={{fontSize:"2.5rem",marginBottom:12}}>🔒</div>
          <div style={{fontWeight:700}}>Admin access only</div>
        </div>
      )}

      {/* ── Cart drawer ── */}
      <div className={`overlay ${cartOpen?"open":""}`} onClick={()=>setCartOpen(false)} />
      <div className={`cart-drawer ${cartOpen?"open":""}`}>
        <div className="cart-head">
          <span className="cart-hed-title">Order Summary</span>
          <button className="btn-icon" onClick={()=>setCartOpen(false)}>✕</button>
        </div>
        <div className="cart-body">
          {cart.length===0 ? (
            <div className="empty-cart"><div className="empty-icon">◈</div><span>Your cart is empty</span></div>
          ) : <>
            {cart.map(item=>(
              <div key={item.id} className="cart-item">
                <img src={item.photo} alt={item.name} className="ci-img" />
                <div className="ci-info">
                  <div className="ci-name">{item.name}</div>
                  <div className="ci-price">Rs {item.price}/{item.unit}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <button className="qty-btn" onClick={()=>changeQty(item.id,-1)}>−</button>
                  <span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,minWidth:18,textAlign:"center"}}>{item.qty}</span>
                  <button className="qty-btn" onClick={()=>changeQty(item.id,+1)}>+</button>
                </div>
              </div>
            ))}
            <div style={{marginTop:6}}>
              <div className="pm-section-label">⚡ PickMe Flash Delivery</div>
              <div className="pm-options">
                {PICKME_TIERS.map(t=>(
                  <div key={t.label} className={`pm-opt ${pickme.label===t.label?"sel":""}`} onClick={()=>setPickme(t)}>
                    <span className="pm-icon">{t.icon}</span>
                    <div><div className="pm-label">{t.label}</div><div className="pm-eta">ETA {t.eta}</div></div>
                    <span className="pm-fee">Rs {t.fee}</span>
                  </div>
                ))}
              </div>
            </div>
          </>}
        </div>
        {cart.length>0 && (
          <div className="cart-foot">
            <div className="cart-row"><span>Subtotal ({cartCount} items)</span><span>Rs {cartSubtotal.toLocaleString()}</span></div>
            <div className="cart-row"><span>PickMe Flash</span><span style={{color:"var(--orange)",fontWeight:700}}>Rs {pickme.fee}</span></div>
            <div className="cart-row" style={{borderTop:"1px solid var(--border)",paddingTop:10,marginTop:4,marginBottom:12}}>
              <span style={{fontWeight:700,color:"var(--text)"}}>Total</span>
              <span className="cart-total-val">Rs {cartTotal.toLocaleString()}</span>
            </div>
            <button className="btn btn-gold" style={{width:"100%",justifyContent:"center",padding:"12px"}} onClick={placeOrder}>
              Confirm Order & Invoice →
            </button>
            <div style={{fontSize:".72rem",color:"var(--muted)",textAlign:"center",marginTop:8}}>Invoice sent to {user?.email}</div>
          </div>
        )}
      </div>

      {/* ── Sending overlay ── */}
      {sending && (
        <div className="spin-overlay">
          <div className="spin-box">
            <div className="spinner" />
            <div style={{fontWeight:700,marginBottom:4}}>Booking PickMe Flash…</div>
            <div style={{color:"var(--muted)",fontSize:".82rem"}}>Generating & dispatching invoice</div>
          </div>
        </div>
      )}

      {/* ── Invoice viewer ── */}
      {invoice && (
        <div className="backdrop" onClick={e=>e.target===e.currentTarget&&setInvoice(null)}>
          <div className="inv-modal">
            <div className="inv-bar">
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Diamond size={22}/>
                <span style={{fontWeight:700,fontSize:".9rem"}}>{invoice.id}</span>
                <span className="pm-badge">⚡ {invoice.pickme.icon} PickMe</span>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn btn-gold btn-sm" onClick={()=>setPayOrder(invoice)}>💳 Pay Now</button>
                <button className="btn btn-outline btn-sm" onClick={()=>{const w=window.open("","_blank");w.document.write(invoice.invoiceHTML);w.document.close();w.print();}}>🖨 Print</button>
                <button className="btn-icon" onClick={()=>setInvoice(null)}>✕</button>
              </div>
            </div>
            <iframe style={{flex:1,border:"none",width:"100%",height:"calc(90vh - 58px)"}} srcDoc={invoice.invoiceHTML} title="Invoice" sandbox="allow-same-origin" />
          </div>
        </div>
      )}

      {/* ── Payment Modal ── */}
      {payOrder && (
        <PaymentModal
          order={payOrder}
          onClose={()=>setPayOrder(null)}
          onPaid={(orderId, method, ref)=>{
            setOrders(os=>os.map(o=>o.id===orderId?{...o,paymentMethod:method,paymentRef:ref,paymentStatus:method==="cod"?"pending":"paid"}:o));
            setTimeout(()=>setPayOrder(null), method==="cod"||method==="bank"?0:2200);
          }}
          toast={toast}
        />
      )}

      {/* ── Auth modal ── */}
      {auth && <AuthModal mode={auth} onClose={()=>setAuth(null)} onLogin={handleLogin} onSignup={handleSignup} onSwitch={setAuth} />}

      <ToastContainer toasts={toasts} />
    </>
  );
}

// ─── Shop Page ────────────────────────────────────────────────────────────────
function ShopPage({ products, cart, addToCart, changeQty, user }) {
  const [filter, setFilter] = useState("All");
  const cats = ["All",...new Set(products.map(p=>p.category))];
  const list = filter==="All" ? products : products.filter(p=>p.category===filter);

  return (
    <>
      <section className="hero">
        <div className="hero-bg"/><div className="hero-grid"/>
        <div style={{position:"relative"}}>
          <div className="hero-eyebrow"><Diamond size={10}/>Fresh · Delivered Daily — Sri Lanka</div>
          <h1 className="hero-title">Premium Produce,<br/><span>Delivered Fresh</span></h1>
          <p className="hero-sub">Farm-fresh vegetables for restaurants and households. Order by 10 AM for same-day PickMe Flash delivery across Sri Lanka.</p>
          <div className="hero-stats">
            <div className="hero-stat"><div className="hero-stat-num">{products.length}+</div><div className="hero-stat-label">Products</div></div>
            <div className="hero-stat"><div className="hero-stat-num">2h</div><div className="hero-stat-label">Avg ETA</div></div>
            <div className="hero-stat"><div className="hero-stat-num">100%</div><div className="hero-stat-label">Fresh</div></div>
          </div>
        </div>
      </section>

      <div className="shop-wrap">
        <div className="section-header">
          <h2 className="section-title">Today's Market</h2>
          <p className="section-sub">Prices updated daily — live market rates</p>
        </div>
        <div className="filter-bar">
          {cats.map(c=><button key={c} className={`chip ${filter===c?"active":""}`} onClick={()=>setFilter(c)}>{c}</button>)}
        </div>
        <div className="prod-grid">
          {list.map(p=>{
            const inCart = cart.find(x=>x.id===p.id);
            return (
              <div key={p.id} className="prod-card">
                <img src={p.photo} alt={p.name} className="prod-img" />
                <div className="prod-body">
                  <div className="prod-top">
                    <span className="prod-name">{p.name}</span>
                    <span className="prod-cat">{p.category}</span>
                  </div>
                  <div className="prod-price">Rs {p.price} <span className="prod-unit">/ {p.unit}</span></div>
                  {inCart ? (
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={()=>changeQty(p.id,-1)}>−</button>
                      <span className="qty-num">{inCart.qty}</span>
                      <button className="qty-btn" onClick={()=>changeQty(p.id,+1)}>+</button>
                    </div>
                  ) : (
                    <button className="btn btn-gold prod-add" onClick={()=>addToCart(p)}>
                      {user?"+ Add to Order":"🔒 Sign in to order"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {!user && (
          <div style={{textAlign:"center",padding:"48px 0",color:"var(--muted)"}}>
            <div style={{fontSize:"2rem",marginBottom:8,opacity:.3}}>◈</div>
            <div style={{fontWeight:600}}>Sign up to start ordering</div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Auth Modal ───────────────────────────────────────────────────────────────
function AuthModal({ mode, onClose, onLogin, onSignup, onSwitch }) {
  const [f, setF] = useState({ firstName:"",lastName:"",email:"",password:"",phone:"",address:"",type:"household" });
  const [err, setErr] = useState({});
  const set = (k,v) => setF(x=>({...x,[k]:v}));

  const validate = () => {
    const e={};
    if(mode==="signup"){
      if(!f.firstName.trim()) e.firstName="Required";
      if(!f.lastName.trim())  e.lastName="Required";
      if(!f.phone.trim())     e.phone="Required";
      if(!f.address.trim())   e.address="Required";
    }
    if(!f.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email="Invalid email";
    if(f.password.length<6) e.password="Min 6 characters";
    setErr(e); return Object.keys(e).length===0;
  };

  const submit = () => { if(!validate()) return; mode==="login" ? onLogin({email:f.email,password:f.password}) : onSignup(f); };

  return (
    <div className="backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-gem"/>
        <h2 className="modal-title">{mode==="login"?"Welcome Back":"Create Account"}</h2>
        <p className="modal-sub">{mode==="login"?"Sign in to your account":"Create your delivery account"}</p>

        {mode==="signup" && <>
          <div className="type-grid">
            <button className={`type-btn ${f.type==="household"?"on":""}`} onClick={()=>set("type","household")}>🏠 Household</button>
            <button className={`type-btn ${f.type==="restaurant"?"on":""}`} onClick={()=>set("type","restaurant")}>🍽 Restaurant</button>
          </div>
          <div className="fr">
            <div className="fg"><label className="fl">First Name</label><input className="fi" value={f.firstName} onChange={e=>set("firstName",e.target.value)} placeholder="Kamal"/>{err.firstName&&<div className="fe">{err.firstName}</div>}</div>
            <div className="fg"><label className="fl">Last Name</label><input className="fi" value={f.lastName} onChange={e=>set("lastName",e.target.value)} placeholder="Perera"/>{err.lastName&&<div className="fe">{err.lastName}</div>}</div>
          </div>
          <div className="fg"><label className="fl">Phone</label><input className="fi" value={f.phone} onChange={e=>set("phone",e.target.value)} placeholder="07X XXX XXXX"/>{err.phone&&<div className="fe">{err.phone}</div>}</div>
          <div className="fg"><label className="fl">Delivery Address</label><input className="fi" value={f.address} onChange={e=>set("address",e.target.value)} placeholder="No. 12, Main St, Colombo"/>{err.address&&<div className="fe">{err.address}</div>}</div>
        </>}

        <div className="fg"><label className="fl">Email</label><input className="fi" type="email" value={f.email} onChange={e=>set("email",e.target.value)} placeholder="you@example.com"/>{err.email&&<div className="fe">{err.email}</div>}</div>
        <div className="fg"><label className="fl">Password</label><input className="fi" type="password" value={f.password} onChange={e=>set("password",e.target.value)} placeholder="••••••••"/>{err.password&&<div className="fe">{err.password}</div>}</div>

        <button className="btn btn-gold" style={{width:"100%",justifyContent:"center",padding:"12px"}} onClick={submit}>
          {mode==="login"?"Sign In →":"Create Account →"}
        </button>
        {mode==="login"&&<div style={{fontSize:".72rem",color:"var(--muted)",textAlign:"center",marginTop:10}}>Admin login: admin@freshdelivery.lk · admin123</div>}
        <div className="fs">
          {mode==="login"?<>No account? <a onClick={()=>onSwitch("signup")}>Sign up</a></>:<>Have an account? <a onClick={()=>onSwitch("login")}>Sign in</a></>}
        </div>
      </div>
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────
function AdminPage({ products, setProducts, users, orders, setOrders, emailLog, onDelivered, toast }) {
  const [tab, setTab] = useState("dashboard");
  const nav = [
    {id:"dashboard",label:"Dashboard",icon:"◈"},
    {id:"products", label:"Products",  icon:"▦"},
    {id:"prices",   label:"Prices",    icon:"◇"},
    {id:"orders",   label:"Orders",    icon:"▣"},
    {id:"users",    label:"Users",     icon:"◉"},
    {id:"emails",   label:"Email Log", icon:"◎"},
  ];
  return (
    <div className="admin-wrap">
      <aside className="sidebar">
        <div className="sidebar-label">Delivery Admin</div>
        {nav.map(n=>(
          <div key={n.id} className={`sb-item ${tab===n.id?"on":""}`} onClick={()=>setTab(n.id)}>
            <span style={{fontSize:".9rem",opacity:.7}}>{n.icon}</span>{n.label}
          </div>
        ))}
      </aside>
      <main className="admin-main">
        {tab==="dashboard" && <AdminDash   products={products} users={users} orders={orders}/>}
        {tab==="products"  && <AdminProds  products={products} setProducts={setProducts} toast={toast}/>}
        {tab==="prices"    && <AdminPrices products={products} setProducts={setProducts} toast={toast}/>}
        {tab==="orders"    && <AdminOrders orders={orders} setOrders={setOrders} onDelivered={onDelivered} toast={toast}/>}
        {tab==="users"     && <AdminUsers  users={users}/>}
        {tab==="emails"    && <AdminEmails emailLog={emailLog}/>}
      </main>
    </div>
  );
}

function AdminDash({ products, users, orders }) {
  const revenue = orders.filter(o=>o.status!=="cancelled").reduce((s,o)=>s+o.total,0);
  const pending  = orders.filter(o=>o.status==="confirmed").length;
  const rests    = users.filter(u=>u.type==="restaurant").length;
  return (
    <>
      <div className="page-title">Dashboard</div>
      <div className="page-sub">Live overview — {new Date().toLocaleDateString("en-LK",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
      <div className="stats-grid">
        {[
          {icon:"◇",num:`Rs ${revenue.toLocaleString()}`,label:"Total Revenue"},
          {icon:"▣",num:orders.length,label:"Total Orders"},
          {icon:"◈",num:pending,label:"Awaiting Dispatch"},
          {icon:"◉",num:users.length,label:"Registered Users"},
          {icon:"▦",num:rests,label:"Restaurant Clients"},
          {icon:"▤",num:products.length,label:"Products Listed"},
        ].map(s=>(
          <div key={s.label} className="sc">
            <div className="sc-icon" style={{color:"var(--gold)"}}>{s.icon}</div>
            <div className="sc-num">{s.num}</div>
            <div className="sc-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{fontWeight:700,marginBottom:14}}>Recent Orders</div>
      <div className="tw">
        <table className="dt">
          <thead><tr><th>ID</th><th>Customer</th><th>Type</th><th>Total</th><th>PickMe</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {orders.slice(0,8).map(o=>(
              <tr key={o.id}>
                <td style={{fontFamily:"'DM Mono',monospace",color:"var(--gold)",fontSize:".76rem"}}>{o.id}</td>
                <td style={{fontWeight:600}}>{o.userName}</td>
                <td><span className="prod-cat" style={{textTransform:"capitalize"}}>{o.userType}</span></td>
                <td style={{fontFamily:"'DM Mono',monospace",fontWeight:700}}>Rs {o.total?.toLocaleString()}</td>
                <td><span className="pm-badge">{o.pickme?.icon} {o.pickmeRef}</span></td>
                <td><span className={`sb sb-${o.status}`}>{o.status}</span></td>
                <td style={{color:"var(--muted)",fontSize:".75rem"}}>{o.date}</td>
              </tr>
            ))}
            {orders.length===0&&<tr><td colSpan={7} style={{textAlign:"center",color:"var(--muted)",padding:32}}>No orders yet</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AdminProds({ products, setProducts, toast }) {
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({name:"",price:"",unit:"kg",category:"Green",stock:"",photo:""});
  const [prev,setPrev]=useState("");
  const cats=["Root","Green","Leafy","Fruit","Bulb","Other"];
  const s=(k,v)=>setForm(f=>({...f,[k]:v}));

  const add=()=>{
    if(!form.name||!form.price||!form.stock){toast("Fill all required fields","error");return;}
    const p={...form,id:Date.now(),price:Number(form.price),stock:Number(form.stock),photo:form.photo||"https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80"};
    setProducts(ps=>[...ps,p]);
    setForm({name:"",price:"",unit:"kg",category:"Green",stock:"",photo:""});
    setPrev(""); setShow(false);
    toast(`${p.name} added`,"success");
  };

  const remove=(id)=>{const p=products.find(x=>x.id===id);setProducts(ps=>ps.filter(x=>x.id!==id));toast(`${p.name} removed`);};

  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:28}}>
        <div><div className="page-title">Products</div><div className="page-sub">Manage vegetable listings</div></div>
        <button className="btn btn-gold" onClick={()=>setShow(!show)}>{show?"✕ Cancel":"+ Add Product"}</button>
      </div>
      {show&&(
        <div className="add-form">
          <div style={{fontWeight:700,marginBottom:18}}>New Product</div>
          <div className="fr">
            <div className="fg"><label className="fl">Name *</label><input className="fi" value={form.name} onChange={e=>s("name",e.target.value)} placeholder="e.g. Pumpkin"/></div>
            <div className="fg"><label className="fl">Category</label><select className="fi" value={form.category} onChange={e=>s("category",e.target.value)}>{cats.map(c=><option key={c}>{c}</option>)}</select></div>
          </div>
          <div className="fr">
            <div className="fg"><label className="fl">Price (Rs) *</label><input className="fi" type="number" value={form.price} onChange={e=>s("price",e.target.value)} placeholder="150"/></div>
            <div className="fg"><label className="fl">Unit</label><select className="fi" value={form.unit} onChange={e=>s("unit",e.target.value)}>{["kg","each","bundle","g"].map(u=><option key={u}>{u}</option>)}</select></div>
          </div>
          <div className="fg"><label className="fl">Stock *</label><input className="fi" type="number" value={form.stock} onChange={e=>s("stock",e.target.value)} placeholder="50"/></div>
          <div className="fg"><label className="fl">Photo URL</label><input className="fi" value={form.photo} onChange={e=>{s("photo",e.target.value);setPrev(e.target.value)}} placeholder="https://images.unsplash.com/..."/></div>
          {prev&&<img src={prev} alt="" style={{width:110,height:80,objectFit:"cover",borderRadius:8,marginBottom:16,border:"1px solid var(--border)"}}/>}
          <button className="btn btn-gold" onClick={add}>Add Product →</button>
        </div>
      )}
      <div className="tw">
        <table className="dt">
          <thead><tr><th>Photo</th><th>Name</th><th>Category</th><th>Price</th><th>Unit</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {products.map(p=>(
              <tr key={p.id}>
                <td><img src={p.photo} alt={p.name} className="t-img"/></td>
                <td style={{fontWeight:600}}>{p.name}</td>
                <td><span className="prod-cat">{p.category}</span></td>
                <td style={{fontFamily:"'DM Mono',monospace",color:"var(--gold)"}}>Rs {p.price}</td>
                <td style={{color:"var(--muted)"}}>{p.unit}</td>
                <td><span className={p.stock>20?"stock-ok":"stock-low"}>{p.stock} {p.unit}</span></td>
                <td><button className="btn btn-danger btn-sm" onClick={()=>remove(p.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AdminPrices({ products, setProducts, toast }) {
  const [prices,setPrices]=useState(()=>Object.fromEntries(products.map(p=>[p.id,p.price])));
  const [changed,setChanged]=useState(new Set());
  const upd=(id,v)=>{setPrices(p=>({...p,[id]:v}));setChanged(c=>new Set([...c,id]));};
  const saveOne=(id)=>{setProducts(ps=>ps.map(p=>p.id===id?{...p,price:Number(prices[id])||p.price}:p));setChanged(c=>{const s=new Set(c);s.delete(id);return s;});toast("Price updated","success");};
  const saveAll=()=>{setProducts(ps=>ps.map(p=>({...p,price:Number(prices[p.id])||p.price})));setChanged(new Set());toast("All prices updated","success");};
  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:28}}>
        <div><div className="page-title">Daily Prices</div><div className="page-sub">Update today's market rates</div></div>
        {changed.size>0&&<button className="btn btn-gold" onClick={saveAll}>Save All ({changed.size})</button>}
      </div>
      <div className="tw">
        <table className="dt">
          <thead><tr><th>Photo</th><th>Product</th><th>Category</th><th>Current</th><th>New Price</th><th></th></tr></thead>
          <tbody>
            {products.map(p=>(
              <tr key={p.id}>
                <td><img src={p.photo} alt={p.name} className="t-img"/></td>
                <td style={{fontWeight:600}}>{p.name}</td>
                <td><span className="prod-cat">{p.category}</span></td>
                <td style={{fontFamily:"'DM Mono',monospace",color:"var(--gold)"}}>Rs {p.price}/{p.unit}</td>
                <td><input type="number" className="pi" value={prices[p.id]??p.price} onChange={e=>upd(p.id,e.target.value)} style={{borderColor:changed.has(p.id)?"var(--gold)":undefined}}/></td>
                <td>{changed.has(p.id)&&<button className="btn btn-gold btn-sm" onClick={()=>saveOne(p.id)}>Save</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AdminOrders({ orders, setOrders, onDelivered, toast }) {
  const [viewInv,setViewInv]=useState(null);
  const statuses=["confirmed","dispatched","delivered","cancelled"];
  const changeStatus=async(id,status)=>{
    const o=orders.find(x=>x.id===id);
    setOrders(os=>os.map(x=>x.id===id?{...x,status}:x));
    toast(`${id} → ${status}`,"success");
    if(status==="delivered"&&o) await onDelivered({...o,status:"delivered"});
  };
  return (
    <>
      <div className="page-title">Orders</div>
      <div className="page-sub">{orders.length} total — set status to "delivered" to trigger admin alert</div>
      {orders.length===0?(
        <div style={{textAlign:"center",padding:"60px 0",color:"var(--muted)"}}>
          <div style={{fontSize:"2rem",opacity:.2}}>▣</div><div style={{marginTop:10}}>No orders yet</div>
        </div>
      ):orders.map(o=>(
        <div key={o.id} className="oc">
          <div className="oc-head">
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span className="oc-id">{o.id}</span>
                {o.pickmeRef&&<span className="pm-badge">⚡ {o.pickme?.icon} {o.pickmeRef}</span>}
              </div>
              <div className="oc-meta">{o.date} · {o.userName} · {o.userEmail}</div>
              {o.pickme&&<div style={{fontSize:".75rem",color:"var(--orange)",marginTop:2}}>PickMe: {o.pickme.label} · ETA {o.pickme.eta}</div>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <span className={`sb sb-${o.status}`}>{o.status}</span>
              <select className="fi" style={{width:"auto",padding:"6px 10px",fontSize:".78rem"}} value={o.status} onChange={e=>changeStatus(o.id,e.target.value)}>
                {statuses.map(s=><option key={s}>{s}</option>)}
              </select>
              {o.invoiceHTML&&<button className="btn btn-outline btn-sm" onClick={()=>setViewInv(o)}>🧾 Invoice</button>}
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
            {o.items.map(i=>(
              <div key={i.id} style={{display:"flex",alignItems:"center",gap:6,background:"var(--navy2)",border:"1px solid var(--border)",borderRadius:7,padding:"4px 10px",fontSize:".78rem"}}>
                <img src={i.photo} alt={i.name} style={{width:24,height:24,borderRadius:5,objectFit:"cover"}}/>{i.name} ×{i.qty}
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",fontSize:".8rem",color:"var(--muted)"}}>
            <span>Subtotal Rs {o.subtotal?.toLocaleString()}</span>
            <span style={{color:"var(--orange)"}}>+ PickMe Rs {o.deliveryFee}</span>
            <span style={{fontWeight:800,color:"var(--gold)",fontFamily:"'DM Mono',monospace"}}>Total Rs {o.total?.toLocaleString()}</span>
            {o.paymentMethod && <span style={{fontSize:".72rem",padding:"2px 9px",borderRadius:99,background:o.paymentStatus==="paid"?"rgba(74,222,128,.12)":"rgba(250,204,21,.12)",color:o.paymentStatus==="paid"?"#4ade80":"#facc15",fontWeight:700}}>{o.paymentStatus==="paid"?"✓ Paid":"⏳ " + (o.paymentMethod==="cod"?"COD":o.paymentMethod==="bank"?"Bank Transfer Pending":"Pending")}</span>}
          </div>
        </div>
      ))}
      {viewInv&&(
        <div className="backdrop" onClick={e=>e.target===e.currentTarget&&setViewInv(null)}>
          <div className="inv-modal">
            <div className="inv-bar">
              <div style={{display:"flex",alignItems:"center",gap:10}}><Diamond size={20}/><span style={{fontWeight:700,fontSize:".88rem"}}>{viewInv.id}</span><span className="pm-badge">⚡ {viewInv.pickme?.icon}</span></div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn btn-outline btn-sm" onClick={()=>{const w=window.open("","_blank");w.document.write(viewInv.invoiceHTML);w.document.close();w.print();}}>🖨 Print</button>
                <button className="btn-icon" onClick={()=>setViewInv(null)}>✕</button>
              </div>
            </div>
            <iframe style={{flex:1,border:"none",width:"100%",height:"calc(90vh - 58px)"}} srcDoc={viewInv.invoiceHTML} title="Invoice" sandbox="allow-same-origin"/>
          </div>
        </div>
      )}
    </>
  );
}


// ─── Payment Modal ────────────────────────────────────────────────────────────
// Supports: PayHere (Sri Lanka), frimi, Cash on Delivery, Bank Transfer
function PaymentModal({ order, onClose, onPaid, toast }) {
  const [method, setMethod] = useState(null);
  const [step,   setStep]   = useState("choose"); // choose | details | done
  const [card,   setCard]   = useState({ num:"", exp:"", cvv:"", name:"" });
  const [processing, setProcessing] = useState(false);

  const METHODS = [
    {
      id: "payhere",
      icon: "💳",
      title: "PayHere",
      sub: "Visa, Mastercard, Amex — secure online payment",
      tag: "Recommended", tagClass: "tag-rec",
    },
    {
      id: "frimi",
      icon: "📱",
      title: "frimi by Nations Trust Bank",
      sub: "Pay via frimi app — instant QR payment",
      tag: "Instant", tagClass: "tag-rec",
    },
    {
      id: "bank",
      icon: "🏦",
      title: "Bank Transfer",
      sub: "Transfer to our account before delivery",
      tag: "", tagClass: "",
    },
    {
      id: "cod",
      icon: "💵",
      title: "Cash on Delivery",
      sub: "Pay in cash when your order arrives",
      tag: "Free", tagClass: "tag-free",
    },
  ];

  const payRef = `PAY-${order.id.replace("INV-","")}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;

  const handlePay = async () => {
    if (!method) { toast("Select a payment method","error"); return; }
    if (method === "payhere") {
      if (!card.num || !card.exp || !card.cvv || !card.name) { toast("Fill all card fields","error"); return; }
    }
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1800)); // simulate gateway
    setProcessing(false);
    setStep("done");
    onPaid(order.id, method, payRef);
    toast(`Payment confirmed via ${METHODS.find(m=>m.id===method)?.title} ✓`, "success");
  };

  return (
    <div className="backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="pay-modal">
        <div className="pay-head">
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Diamond size={20}/>
            <span style={{fontWeight:700,fontSize:".9rem"}}>Complete Payment</span>
          </div>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="pay-body">
          {step === "choose" && <>
            <div className="pay-amount">
              <div className="pay-amount-label">Amount Due · {order.id}</div>
              <div className="pay-amount-val">Rs {order.total.toLocaleString()}</div>
              <div style={{fontSize:".75rem",color:"var(--muted)",marginTop:6}}>incl. PickMe Flash Rs {order.deliveryFee}</div>
            </div>

            <div style={{fontSize:".72rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"1.5px",color:"var(--muted)",marginBottom:10}}>Choose Payment Method</div>
            <div className="pay-methods">
              {METHODS.map(m => (
                <div key={m.id} className={`pay-method ${method===m.id?"sel":""}`} onClick={()=>setMethod(m.id)}>
                  <span className="pay-method-icon">{m.icon}</span>
                  <div style={{flex:1}}>
                    <div className="pay-method-title">{m.title}</div>
                    <div className="pay-method-sub">{m.sub}</div>
                  </div>
                  {m.tag && <span className={`pay-method-tag ${m.tagClass}`}>{m.tag}</span>}
                  <span style={{fontSize:"1rem",color:method===m.id?"var(--gold)":"var(--border)"}}>
                    {method===m.id ? "◉" : "○"}
                  </span>
                </div>
              ))}
            </div>

            {method === "payhere" && (
              <div className="pay-card-fields">
                <div style={{fontSize:".72rem",fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>Card Details</div>
                <input className="fi" placeholder="Cardholder Name" value={card.name} onChange={e=>setCard(c=>({...c,name:e.target.value}))} />
                <input className="fi" placeholder="Card Number (16 digits)" maxLength={19} value={card.num}
                  onChange={e=>setCard(c=>({...c,num:e.target.value.replace(/\D/g,"").replace(/(\d{4})/g,"$1 ").trim()}))} />
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <input className="fi" placeholder="MM/YY" maxLength={5} value={card.exp}
                    onChange={e=>setCard(c=>({...c,exp:e.target.value.replace(/[^\d/]/g,"")}))} />
                  <input className="fi" placeholder="CVV" maxLength={4} type="password" value={card.cvv}
                    onChange={e=>setCard(c=>({...c,cvv:e.target.value.replace(/\D/g,"")}))} />
                </div>
                <div style={{fontSize:".7rem",color:"var(--muted)",display:"flex",alignItems:"center",gap:5}}>
                  🔒 Secured by PayHere · PCI-DSS Compliant
                </div>
              </div>
            )}

            {method === "frimi" && (
              <div style={{background:"var(--navy2)",border:"1px solid var(--border)",borderRadius:10,padding:16,marginBottom:16,textAlign:"center"}}>
                <div style={{fontSize:".82rem",color:"var(--muted2)",marginBottom:10}}>Scan QR or pay to frimi number</div>
                <div style={{background:"var(--navy3)",border:"1px dashed rgba(201,168,76,.3)",borderRadius:10,padding:20,marginBottom:10}}>
                  <div style={{fontSize:"2.5rem",marginBottom:8}}>📱</div>
                  <div style={{fontFamily:"'DM Mono',monospace",color:"var(--gold)",fontSize:".9rem",fontWeight:700}}>077 000 0000</div>
                  <div style={{fontSize:".75rem",color:"var(--muted)",marginTop:4}}>frimi ID: freshdelivery.lk</div>
                </div>
                <div style={{fontSize:".75rem",color:"var(--muted)"}}>Amount: <span style={{color:"var(--gold)",fontWeight:700}}>Rs {order.total.toLocaleString()}</span> · Ref: <span style={{fontFamily:"'DM Mono',monospace"}}>{payRef}</span></div>
              </div>
            )}

            {method === "bank" && (
              <div style={{background:"var(--navy2)",border:"1px solid var(--border)",borderRadius:10,padding:16,marginBottom:16}}>
                <div style={{fontSize:".72rem",fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:12}}>Bank Account Details</div>
                {[
                  ["Bank","Commercial Bank of Ceylon"],
                  ["Account Name","Fresh Delivery (Personal)"],
                  ["Account No","8001234567"],
                  ["Branch","Colombo 07"],
                  ["Reference",payRef],
                ].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid var(--border)",fontSize:".82rem"}}>
                    <span style={{color:"var(--muted)"}}>{k}</span>
                    <span style={{fontWeight:600,fontFamily:k==="Account No"||k==="Reference"?"'DM Mono',monospace":"inherit",color:k==="Reference"?"var(--gold)":"var(--text)"}}>{v}</span>
                  </div>
                ))}
                <div style={{fontSize:".72rem",color:"var(--muted)",marginTop:10}}>⚠ Please include the reference number. Order confirmed after transfer verified.</div>
              </div>
            )}

            {method === "cod" && (
              <div style={{marginBottom:16}}>
                <div className="cod-steps">
                  {[
                    "Your order is confirmed and being prepared.",
                    `PickMe Flash will deliver within ${order.pickme?.eta || "45–75 min"}.`,
                    "Pay the driver in cash when your order arrives.",
                    "Driver will provide a printed receipt.",
                  ].map((t,i)=>(
                    <div key={i} className="cod-step">
                      <div className="cod-step-num">{i+1}</div>
                      <div className="cod-step-text">{t}</div>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:".75rem",color:"var(--muted)",textAlign:"center"}}>
                  Please have exact change ready: <span style={{color:"var(--gold)",fontWeight:700}}>Rs {order.total.toLocaleString()}</span>
                </div>
              </div>
            )}

            <button
              className="btn btn-gold"
              style={{width:"100%",justifyContent:"center",padding:"13px",opacity:method?1:.5}}
              onClick={handlePay}
              disabled={!method || processing}
            >
              {processing ? "Processing…" : method==="cod" ? "Confirm COD Order →" : method==="bank" ? "I've Made the Transfer →" : `Pay Rs ${order.total.toLocaleString()} →`}
            </button>
          </>}

          {step === "done" && (
            <div className="pay-status">
              <div className="pay-status-icon">
                {method==="cod" ? "🚚" : method==="bank" ? "🏦" : "✅"}
              </div>
              <div className="pay-status-title">
                {method==="cod" ? "Order Confirmed!" : method==="bank" ? "Transfer Noted!" : "Payment Successful!"}
              </div>
              <div className="pay-status-sub">
                {method==="cod"
                  ? `Your driver is on the way. Pay Rs ${order.total.toLocaleString()} on delivery.`
                  : method==="bank"
                  ? "We'll confirm your order once the transfer is verified."
                  : `Rs ${order.total.toLocaleString()} charged successfully.`}
              </div>
              <div className="pay-ref">Payment Ref: {payRef}</div>
              <div className="pay-link" onClick={onClose}>Close & View Invoice →</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminUsers({ users }) {
  return (
    <>
      <div className="page-title">Users</div>
      <div className="page-sub">{users.length} registered accounts</div>
      <div className="tw">
        <table className="dt">
          <thead><tr><th></th><th>Name</th><th>Email</th><th>Phone</th><th>Type</th><th>Address</th><th>Joined</th></tr></thead>
          <tbody>
            {users.length===0
              ?<tr><td colSpan={7} style={{textAlign:"center",color:"var(--muted)",padding:36}}>No users yet</td></tr>
              :users.map(u=>(
                <tr key={u.id}>
                  <td><div className="avatar">{u.firstName?.[0]?.toUpperCase()}{u.lastName?.[0]?.toUpperCase()}</div></td>
                  <td style={{fontWeight:600}}>{u.firstName} {u.lastName}</td>
                  <td style={{color:"var(--muted)",fontSize:".8rem"}}>{u.email}</td>
                  <td>{u.phone}</td>
                  <td><span className="prod-cat" style={{textTransform:"capitalize"}}>{u.type}</span></td>
                  <td style={{fontSize:".78rem",color:"var(--muted)",maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.address}</td>
                  <td style={{color:"var(--muted)",fontSize:".78rem"}}>{u.createdAt}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AdminEmails({ emailLog }) {
  const labels={ invoice:"📄 Invoice → Customer", admin_alert:"🚨 Delivery Alert → Admin" };
  return (
    <>
      <div className="page-title">Email Log</div>
      <div className="page-sub">{emailLog.length} emails · AI-simulated (connect Resend/SendGrid for live delivery)</div>
      {emailLog.length===0?(
        <div style={{textAlign:"center",padding:"60px 0",color:"var(--muted)"}}>
          <div style={{fontSize:"2rem",opacity:.2}}>◎</div><div style={{marginTop:10}}>No emails sent yet</div>
        </div>
      ):(
        <div className="email-log">
          <div className="el-label">Sent Emails</div>
          {emailLog.map((e,i)=>(
            <div key={i} className="el-item">
              <div className="el-dot" style={{background:e.sent?"#4ade80":"#e63946"}}/>
              <div style={{flex:1}}>
                <div style={{color:"var(--text)",fontSize:".84rem",fontWeight:600}}>{e.to}</div>
                <div style={{color:"var(--muted)",fontSize:".76rem",marginTop:2}}>{e.subject}</div>
                <div style={{color:"var(--muted2)",fontSize:".7rem",marginTop:2,opacity:.7}}>{labels[e.type]||e.type}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                <span style={{fontSize:".68rem",padding:"2px 8px",borderRadius:99,background:e.sent?"rgba(74,222,128,.12)":"rgba(230,57,70,.12)",color:e.sent?"#4ade80":"#e63946",fontWeight:700}}>{e.sent?"Sent":"Failed"}</span>
                <span style={{fontSize:".68rem",color:"var(--muted)"}}>{e.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
