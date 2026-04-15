/* ================================================================
   ANALYSES LINÉAIRES · BAC DE FRANÇAIS
   Design: Refined Editorial — Playfair + DM Sans
   ================================================================ */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ===== CSS VARIABLES – LIGHT ===== */
:root {
  --bg: #f4f3ef;
  --surface: #ffffff;
  --surface2: #f8f7f4;
  --surface3: #f0ede8;
  --text: #1c1917;
  --text-muted: #57534e;
  --text-light: #a8a29e;
  --border: #e7e5e4;
  --border2: #d6d3d1;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  --shadow: 0 4px 24px rgba(0,0,0,0.07);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.12);
  --accent: #c2a35a;
  --accent-light: #f5edd8;
  --sidebar-w: 280px;
  --topbar-h: 60px;
  --radius: 12px;
  --radius-sm: 8px;

  /* Highlight colours – MVT 1 Blues */
  --h1p1:#dbeeff; --h1p2:#b8deff; --h1p3:#8ec8ff; --h1p4:#64b0f0; --h1p5:#a0ccf5; --h1p6:#c8e4ff;
  /* MVT 2 Greens */
  --h2p1:#d4f5df; --h2p2:#a8ebc0; --h2p3:#78dfa0; --h2p4:#50d080; --h2p5:#90e8b0; --h2p6:#beedd0;
  /* MVT 3 Oranges */
  --h3p1:#ffe8cc; --h3p2:#ffd0a0; --h3p3:#ffb870; --h3p4:#ff9940; --h3p5:#ffc080; --h3p6:#ffe0b8;
  /* MVT 4 Purples */
  --h4p1:#f0e0ff; --h4p2:#e0c0ff; --h4p3:#c898ff; --h4p4:#b070f0; --h4p5:#d8a8ff;

  /* MVT gradient bars */
  --mvt1-a:#1a6fa8; --mvt1-b:#3d9de0;
  --mvt2-a:#1a7a40; --mvt2-b:#3db870;
  --mvt3-a:#c05800; --mvt3-b:#f07820;
  --mvt4-a:#6a1090; --mvt4-b:#a040d0;
}

/* ===== CSS VARIABLES – DARK ===== */
body.dark {
  --bg: #111110;
  --surface: #1c1917;
  --surface2: #221f1c;
  --surface3: #292524;
  --text: #e7e5e4;
  --text-muted: #a8a29e;
  --text-light: #57534e;
  --border: #292524;
  --border2: #3c3835;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
  --shadow: 0 4px 24px rgba(0,0,0,0.4);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.5);
  --accent: #d4b46a;
  --accent-light: #2a2410;

  --h1p1:#1a3a5e; --h1p2:#153050; --h1p3:#102844; --h1p4:#0c2038; --h1p5:#183456; --h1p6:#1c3c60;
  --h2p1:#1a3d28; --h2p2:#153320; --h2p3:#102818; --h2p4:#0c2014; --h2p5:#18382a; --h2p6:#1c3c30;
  --h3p1:#3d2a10; --h3p2:#332208; --h3p3:#281a04; --h3p4:#201400; --h3p5:#382408; --h3p6:#3c2c14;
  --h4p1:#2d1a4a; --h4p2:#24143e; --h4p3:#1c0e30; --h4p4:#140824; --h4p5:#281840;
}

/* ================================================================
   BASE
   ================================================================ */
body {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.65;
  color: var(--text);
  background: var(--bg);
  transition: background 0.3s, color 0.3s;
  overflow-x: hidden;
}

h1, h2, h3 { font-family: 'Playfair Display', Georgia, serif; }

/* ================================================================
   LAYOUT
   ================================================================ */
.sidebar {
  position: fixed; top: 0; left: 0; bottom: 0;
  width: var(--sidebar-w);
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  z-index: 200;
  transition: transform 0.3s cubic-bezier(.4,0,.2,1), background 0.3s;
  box-shadow: var(--shadow);
}

.main {
  margin-left: var(--sidebar-w);
  min-height: 100vh;
  transition: margin-left 0.3s cubic-bezier(.4,0,.2,1);
}

@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
  .main { margin-left: 0; }
  .overlay { display: block !important; }
}

.overlay {
  display: none;
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 150;
  backdrop-filter: blur(2px);
}
.overlay.active { display: block; }

/* ================================================================
   SIDEBAR
   ================================================================ */
.sidebar-header {
  padding: 20px 18px 14px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.sidebar-logo { display: flex; align-items: center; gap: 10px; }
.logo-icon { font-size: 20px; color: var(--accent); }
.logo-title { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: var(--text); }
.logo-sub { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-light); }
.sidebar-close { display: none; background: none; border: none; cursor: pointer; font-size: 16px; color: var(--text-muted); }
@media (max-width: 768px) { .sidebar-close { display: block; } }

.sidebar-search {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
  position: relative;
}
.sidebar-search input {
  width: 100%; padding: 8px 32px 8px 12px;
  border: 1px solid var(--border2); border-radius: var(--radius-sm);
  background: var(--surface2); color: var(--text);
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  outline: none; transition: border-color 0.2s;
}
.sidebar-search input:focus { border-color: var(--accent); }
.search-icon { position: absolute; right: 24px; top: 50%; transform: translateY(-50%); color: var(--text-light); font-size: 16px; pointer-events: none; }

.sidebar-nav {
  flex: 1; overflow-y: auto; padding: 10px 0;
  scrollbar-width: thin; scrollbar-color: var(--border2) transparent;
}

.nav-loading { padding: 20px; text-align: center; color: var(--text-light); font-size: 13px; }

/* oeuvre item */
.nav-oeuvre { margin-bottom: 4px; }
.nav-oeuvre-btn {
  width: 100%; display: flex; align-items: center; gap: 10px;
  padding: 10px 16px; border: none; background: none;
  cursor: pointer; text-align: left;
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  color: var(--text-muted); border-radius: 0;
  transition: background 0.15s, color 0.15s;
}
.nav-oeuvre-btn:hover { background: var(--surface2); color: var(--text); }
.nav-oeuvre-btn.active { color: var(--text); font-weight: 600; }
.nav-oeuvre-dot {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
}
.nav-oeuvre-name { flex: 1; }
.nav-oeuvre-chevron { font-size: 10px; transition: transform 0.2s; color: var(--text-light); }
.nav-oeuvre-btn.open .nav-oeuvre-chevron { transform: rotate(90deg); }

.nav-textes { display: none; }
.nav-textes.open { display: block; }
.nav-texte-btn {
  width: 100%; display: flex; align-items: center; gap: 8px;
  padding: 7px 16px 7px 36px; border: none; background: none;
  cursor: pointer; text-align: left;
  font-family: 'DM Sans', sans-serif; font-size: 12px;
  color: var(--text-light); transition: color 0.15s, background 0.15s;
}
.nav-texte-btn:hover { background: var(--surface2); color: var(--text); }
.nav-texte-btn.active {
  color: var(--accent); font-weight: 600;
  background: var(--accent-light);
}
.nav-add-texte {
  width: 100%; display: flex; align-items: center; gap: 8px;
  padding: 6px 16px 6px 36px; border: none; background: none;
  cursor: pointer; text-align: left;
  font-family: 'DM Sans', sans-serif; font-size: 11px;
  color: var(--text-light); letter-spacing: 0.5px;
  transition: color 0.15s;
}
.nav-add-texte:hover { color: var(--accent); }
.nav-add-texte span { font-size: 14px; font-weight: 700; }

.sidebar-footer {
  padding: 12px 14px;
  border-top: 1px solid var(--border);
  display: flex; align-items: center; gap: 8px;
}
.btn-add-oeuvre {
  flex: 1; display: flex; align-items: center; gap: 6px; justify-content: center;
  padding: 9px 14px; border-radius: var(--radius-sm);
  border: 1px dashed var(--border2); background: none;
  cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 12px;
  color: var(--text-muted); font-weight: 500;
  transition: all 0.2s;
}
.btn-add-oeuvre:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-light); }
.btn-add-oeuvre span { font-size: 16px; font-weight: 700; }

.theme-toggle {
  width: 36px; height: 36px; border-radius: var(--radius-sm);
  border: 1px solid var(--border2); background: var(--surface2);
  cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;
  transition: border-color 0.2s;
}
.theme-toggle:hover { border-color: var(--accent); }

/* ================================================================
   TOPBAR
   ================================================================ */
.topbar {
  height: var(--topbar-h); position: sticky; top: 0; z-index: 100;
  background: var(--surface); border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 14px; padding: 0 24px;
  box-shadow: var(--shadow-sm);
  transition: background 0.3s;
}
.menu-btn {
  display: none; background: none; border: none; cursor: pointer;
  font-size: 20px; color: var(--text-muted); padding: 4px;
}
@media (max-width: 768px) { .menu-btn { display: flex; } }
.topbar-breadcrumb { flex: 1; font-size: 13px; color: var(--text-muted); }
.topbar-breadcrumb strong { color: var(--text); font-weight: 600; }
.btn-secondary {
  padding: 7px 14px; border-radius: var(--radius-sm);
  border: 1px solid var(--border2); background: var(--surface2);
  cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 12px;
  color: var(--text-muted); transition: all 0.2s;
}
.btn-secondary:hover { border-color: var(--border2); background: var(--surface3); color: var(--text); }

/* ================================================================
   CONTENT
   ================================================================ */
.content { padding: 32px 28px; max-width: 900px; }

@media (max-width: 600px) { .content { padding: 20px 16px; } }

/* ================================================================
   HOME SCREEN
   ================================================================ */
.home-hero {
  margin-bottom: 40px;
}
.hero-badge {
  display: inline-block; padding: 4px 14px; border-radius: 20px;
  background: var(--accent-light); border: 1px solid var(--accent);
  color: var(--accent); font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
  margin-bottom: 16px; font-weight: 600;
}
.home-hero h1 {
  font-size: 48px; line-height: 1.15; color: var(--text); margin-bottom: 12px;
}
.home-hero h1 em { color: var(--accent); font-style: italic; }
.hero-sub { font-size: 15px; color: var(--text-muted); max-width: 480px; }

.home-oeuvres { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }

.home-card {
  background: var(--surface); border-radius: var(--radius); padding: 22px;
  border: 1px solid var(--border); box-shadow: var(--shadow-sm);
  cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
  position: relative; overflow: hidden;
}
.home-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
}
.home-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
.home-card-author { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-light); margin-bottom: 4px; }
.home-card-title { font-family: 'Playfair Display', serif; font-size: 17px; color: var(--text); margin-bottom: 8px; }
.home-card-count { font-size: 12px; color: var(--text-muted); }

/* ================================================================
   OEUVRE PAGE
   ================================================================ */
.oeuvre-banner {
  border-radius: var(--radius); padding: 30px 32px; margin-bottom: 28px;
  color: white; position: relative; overflow: hidden;
}
.oeuvre-banner::after {
  content: ''; position: absolute; top: -60px; right: -60px;
  width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.07);
}
.oeuvre-num { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.55); margin-bottom: 6px; }
.oeuvre-banner h2 { font-family: 'Playfair Display', serif; font-size: 26px; margin-bottom: 4px; }
.oeuvre-banner-sub { font-size: 13px; color: rgba(255,255,255,0.65); margin-bottom: 20px; }
.oeuvre-meta-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  background: rgba(255,255,255,0.1); border-radius: 10px; padding: 16px;
  position: relative; z-index: 1;
}
.meta-field label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.5); display: block; margin-bottom: 3px; }
.meta-field p { font-size: 12.5px; color: rgba(255,255,255,0.9); }
.meta-field.full { grid-column: 1/-1; }
.oeuvre-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 5px; }
.oeuvre-tag { background: rgba(255,255,255,0.18); border-radius: 20px; padding: 3px 10px; font-size: 11px; color: rgba(255,255,255,0.9); }

.oeuvre-textes-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; margin-bottom: 32px;
}
.texte-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 18px; cursor: pointer; transition: all 0.2s;
}
.texte-card:hover { border-color: var(--accent); box-shadow: var(--shadow); transform: translateY(-1px); }
.texte-card-num { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-light); margin-bottom: 4px; }
.texte-card-title { font-family: 'Playfair Display', serif; font-size: 15px; color: var(--text); }
.texte-card-preview { font-size: 12px; color: var(--text-muted); margin-top: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.texte-card-add {
  background: var(--surface2); border: 1px dashed var(--border2);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  min-height: 100px; color: var(--text-light);
  transition: all 0.2s;
}
.texte-card-add:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-light); }
.texte-card-add .plus { font-size: 28px; font-weight: 300; }
.texte-card-add span { font-size: 12px; }

/* ================================================================
   TEXTE VIEW
   ================================================================ */
.texte-view { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.texte-header-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 24px 28px; margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
}
.texte-ref { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-light); margin-bottom: 6px; }
.texte-header-card h2 { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--text); margin-bottom: 14px; }

.intro-box {
  background: var(--surface2); border: 1px solid var(--border2);
  border-radius: var(--radius-sm); padding: 13px 16px; margin-bottom: 10px;
  font-size: 13px; line-height: 1.7;
}
.kw-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-bottom: 10px; }
.kw-item {
  background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm);
  padding: 10px 12px; border-left: 3px solid var(--accent);
}
.kw-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-light); margin-bottom: 3px; }
.kw-item p { font-size: 12px; color: var(--text-muted); }

.prob-box {
  background: #fffbeb; border: 1px solid #fde68a;
  border-radius: var(--radius-sm); padding: 11px 15px;
}
body.dark .prob-box { background: #2a2410; border-color: #806020; }
.prob-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #b45309; margin-bottom: 3px; }
body.dark .prob-label { color: #d4a030; }
.prob-box p { font-size: 12.5px; font-style: italic; color: #78350f; }
body.dark .prob-box p { color: #fcd34d; }

/* Texte intégral */
.texte-integral-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 24px 28px; margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
}
.section-label {
  font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
  color: var(--text-light); margin-bottom: 14px;
  display: flex; align-items: center; gap: 10px;
}
.section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

.texte-integral {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 13.5px; line-height: 2.1;
  white-space: pre-wrap;
  background: var(--surface2); border-radius: var(--radius-sm);
  padding: 18px 22px; border: 1px solid var(--border2);
  user-select: text;
}

/* Highlight spans */
.hl { border-radius: 3px; padding: 1px 3px; cursor: help; }
.hl-1-1{background:var(--h1p1)} .hl-1-2{background:var(--h1p2)} .hl-1-3{background:var(--h1p3)}
.hl-1-4{background:var(--h1p4)} .hl-1-5{background:var(--h1p5)} .hl-1-6{background:var(--h1p6)}
.hl-2-1{background:var(--h2p1)} .hl-2-2{background:var(--h2p2)} .hl-2-3{background:var(--h2p3)}
.hl-2-4{background:var(--h2p4)} .hl-2-5{background:var(--h2p5)} .hl-2-6{background:var(--h2p6)}
.hl-3-1{background:var(--h3p1)} .hl-3-2{background:var(--h3p2)} .hl-3-3{background:var(--h3p3)}
.hl-3-4{background:var(--h3p4)} .hl-3-5{background:var(--h3p5)} .hl-3-6{background:var(--h3p6)}
.hl-4-1{background:var(--h4p1)} .hl-4-2{background:var(--h4p2)} .hl-4-3{background:var(--h4p3)}
.hl-4-4{background:var(--h4p4)} .hl-4-5{background:var(--h4p5)}

/* Analyse section */
.analyse-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); margin-bottom: 20px;
  box-shadow: var(--shadow-sm); overflow: hidden;
}
.analyse-card-header { padding: 20px 24px; border-bottom: 1px solid var(--border); }

.mvt-title {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 14px; border-radius: var(--radius-sm);
  color: white; font-weight: 600; font-size: 13px; margin-bottom: 0;
}
.mvt-title.mvt-1 { background: linear-gradient(90deg, var(--mvt1-a), var(--mvt1-b)); }
.mvt-title.mvt-2 { background: linear-gradient(90deg, var(--mvt2-a), var(--mvt2-b)); }
.mvt-title.mvt-3 { background: linear-gradient(90deg, var(--mvt3-a), var(--mvt3-b)); }
.mvt-title.mvt-4 { background: linear-gradient(90deg, var(--mvt4-a), var(--mvt4-b)); }
.mvt-title span { opacity: 0.75; font-weight: 400; font-size: 11px; font-family: 'DM Sans', sans-serif; }

.analyse-card-body { padding: 16px 24px; }

.procede-row {
  display: grid; grid-template-columns: 26px 1fr auto;
  gap: 10px; margin-bottom: 8px; padding: 10px 13px;
  border-radius: var(--radius-sm); background: var(--surface2);
  border: 1px solid var(--border); align-items: start;
  transition: background 0.2s;
}
.procede-row:hover { background: var(--surface3); }
.procede-num {
  width: 22px; height: 22px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; color: white; flex-shrink: 0; margin-top: 2px;
}
.pn-1-1{background:#3d9de0} .pn-1-2{background:#2888cc} .pn-1-3{background:#1a74b8} .pn-1-4{background:#0d60a4} .pn-1-5{background:#1e7ec0} .pn-1-6{background:#3292d0}
.pn-2-1{background:#3db870} .pn-2-2{background:#28a05c} .pn-2-3{background:#1a8848} .pn-2-4{background:#0d7034} .pn-2-5{background:#22962e} .pn-2-6{background:#35aa58}
.pn-3-1{background:#f07820} .pn-3-2{background:#dc6010} .pn-3-3{background:#c84800} .pn-3-4{background:#b43000} .pn-3-5{background:#e06008} .pn-3-6{background:#f07018}
.pn-4-1{background:#a040d0} .pn-4-2{background:#8c28bc} .pn-4-3{background:#7810a8} .pn-4-4{background:#640094} .pn-4-5{background:#9030c0}

.procede-content { flex: 1; }
.procede-citation { font-family: 'Playfair Display', Georgia, serif; font-style: italic; }
.procede-ref { color: var(--text-light); margin: 0 5px; font-size: 11px; font-family: 'DM Mono', monospace; }
.procede-analyse { display: block; margin-top: 4px; font-size: 12.5px; color: var(--text-muted); line-height: 1.6; }
.procede-type { font-weight: 700; color: var(--text); }
.procede-delete {
  opacity: 0; background: none; border: none; cursor: pointer;
  color: #dc2626; font-size: 14px; padding: 2px 5px; border-radius: 4px;
  transition: opacity 0.2s, background 0.2s;
}
.procede-row:hover .procede-delete { opacity: 1; }
.procede-delete:hover { background: #fee2e2; }

.btn-add-procede {
  width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 8px; border: 1px dashed var(--border2); border-radius: var(--radius-sm);
  background: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 12px;
  color: var(--text-light); margin-top: 8px; transition: all 0.2s;
}
.btn-add-procede:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-light); }

/* Conclusion */
.conclusion-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 22px 26px; margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
}
.conclusion-full {
  font-size: 13.5px; line-height: 1.75; color: var(--text);
  background: var(--surface2); border-radius: var(--radius-sm);
  border: 1px solid var(--border2); padding: 14px 18px; margin-bottom: 14px;
}
.conclusion-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
@media (max-width: 500px) { .conclusion-grid { grid-template-columns: 1fr; } }
.conclusion-item {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: var(--radius-sm); padding: 11px 13px;
}
.conc-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-light); margin-bottom: 3px; }
.conclusion-item p { font-size: 12px; color: var(--text-muted); }

/* Add mouvement button */
.btn-add-mouvement {
  display: flex; align-items: center; gap: 8px; justify-content: center;
  padding: 10px 20px; border-radius: var(--radius-sm);
  border: 1px dashed var(--border2); background: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  color: var(--text-muted); transition: all 0.2s; margin-bottom: 20px; width: 100%;
}
.btn-add-mouvement:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-light); }

/* ================================================================
   MODALS
   ================================================================ */
.modal {
  display: none; position: fixed; inset: 0; z-index: 500;
  align-items: center; justify-content: center; padding: 20px;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
}
.modal.open { display: flex; }

.modal-box {
  background: var(--surface); border-radius: 16px;
  width: 100%; max-width: 480px; max-height: 90vh;
  display: flex; flex-direction: column;
  box-shadow: var(--shadow-lg);
  animation: modalIn 0.25s cubic-bezier(.4,0,.2,1);
}
.modal-box--wide { max-width: 620px; }
@keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: none; } }

.modal-header {
  padding: 18px 22px 14px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.modal-header h3 { font-family: 'Playfair Display', serif; font-size: 18px; }
.modal-close {
  background: none; border: none; cursor: pointer; font-size: 16px;
  color: var(--text-muted); padding: 4px; transition: color 0.2s;
}
.modal-close:hover { color: var(--text); }

.modal-body { padding: 20px 22px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
.modal-body label {
  font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
  color: var(--text-muted); margin-bottom: -6px;
}
.modal-body input[type="text"],
.modal-body input[type="number"],
.modal-body select,
.modal-body textarea {
  width: 100%; padding: 9px 12px;
  border: 1px solid var(--border2); border-radius: var(--radius-sm);
  background: var(--surface2); color: var(--text);
  font-family: 'DM Sans', sans-serif; font-size: 13.5px;
  outline: none; transition: border-color 0.2s;
  resize: vertical;
}
.modal-body input:focus,
.modal-body select:focus,
.modal-body textarea:focus { border-color: var(--accent); }

.req { color: #dc2626; }
.hint { color: var(--text-light); font-style: italic; font-weight: 400; font-size: 10px; text-transform: none; letter-spacing: 0; }
.color-picker-row { display: flex; align-items: center; gap: 10px; }
.color-picker-row input[type="color"] { width: 40px; height: 36px; padding: 2px; border-radius: var(--radius-sm); border: 1px solid var(--border2); cursor: pointer; }
.color-hint { font-size: 11px; color: var(--text-light); }

.analyse-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.preview-box {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: var(--radius-sm); padding: 10px 13px;
  font-size: 12.5px; line-height: 1.6; color: var(--text-muted);
  min-height: 44px;
}

.modal-footer {
  padding: 14px 22px; border-top: 1px solid var(--border);
  display: flex; justify-content: flex-end; gap: 10px;
}
.btn-cancel {
  padding: 8px 18px; border-radius: var(--radius-sm);
  border: 1px solid var(--border2); background: var(--surface2);
  cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px;
  color: var(--text-muted); transition: all 0.2s;
}
.btn-cancel:hover { background: var(--surface3); }
.btn-primary {
  padding: 8px 20px; border-radius: var(--radius-sm);
  border: none; background: var(--accent);
  cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
  color: #1c1917; transition: all 0.2s;
}
.btn-primary:hover { filter: brightness(1.1); }

/* ================================================================
   TOAST
   ================================================================ */
.toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 1000;
  background: #18181b; color: #fff;
  padding: 12px 20px; border-radius: 10px;
  font-size: 13px; font-weight: 500;
  box-shadow: var(--shadow-lg);
  transform: translateY(20px); opacity: 0;
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
  pointer-events: none;
}
.toast.show { transform: translateY(0); opacity: 1; }
.toast.success { background: #166534; }
.toast.error { background: #991b1b; }

/* ================================================================
   LOADING
   ================================================================ */
.loading-spinner {
  width: 32px; height: 32px;
  border: 3px solid var(--border2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 40px auto;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ================================================================
   EDIT MODE
   ================================================================ */

/* Floating edit toggle button */
.edit-toggle-fab {
  position: fixed; bottom: 28px; right: 28px; z-index: 300;
  display: flex; align-items: center; gap: 8px;
  padding: 12px 20px; border-radius: 50px;
  border: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
  background: var(--text); color: var(--bg);
  box-shadow: 0 4px 20px rgba(0,0,0,0.25);
  transition: all 0.25s cubic-bezier(.4,0,.2,1);
}
.edit-toggle-fab:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.3); }
.edit-toggle-fab.active {
  background: var(--accent); color: #1c1917;
  box-shadow: 0 4px 20px rgba(194,163,90,0.4);
}

/* Edit mode banner */
.edit-mode-banner {
  background: var(--accent-light); border: 1px solid var(--accent);
  border-radius: var(--radius-sm); padding: 10px 14px; margin-bottom: 16px;
  font-size: 13px; color: #92400e; font-weight: 500;
}
body.dark .edit-mode-banner { color: #fcd34d; }

.edit-section-label {
  font-size: 11px; color: rgba(255,255,255,0.7); margin-bottom: 8px;
  background: rgba(255,255,255,0.1); border-radius: 6px; padding: 4px 10px;
  display: inline-block;
}

/* Editable elements */
body.edit-mode .editable {
  cursor: text !important;
  outline: 2px dashed var(--accent) !important;
  border-radius: 4px !important;
  padding: 2px 4px !important;
  transition: outline-color 0.2s;
}
body.edit-mode .editable:hover { outline-color: #d97706 !important; }

/* Editable procede rows */
.procede-row--editable { cursor: pointer !important; }
.procede-row--editable:hover {
  outline: 2px dashed var(--accent);
  background: var(--accent-light) !important;
}

/* Add conclusion button */
.btn-add-conc {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: var(--radius-sm);
  border: 1px dashed var(--border2); background: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 12px;
  color: var(--text-muted); transition: all 0.2s;
}
.btn-add-conc:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-light); }

/* Save field button */
.btn-save-field {
  padding: 7px 14px; border-radius: var(--radius-sm);
  border: 1px solid var(--accent); background: var(--accent-light);
  cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 12px;
  color: #92400e; font-weight: 500; transition: all 0.2s;
}
.btn-save-field:hover { background: var(--accent); color: white; }
body.dark .btn-save-field { color: #fcd34d; }

/* ================================================================
   CITATION PICKER
   ================================================================ */

/* Bouton principal dans la modal analyse */
.btn-choisir-citation {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 10px 14px;
  background: var(--surface2); border: 1.5px dashed var(--border2);
  border-radius: var(--radius-sm); cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
  color: var(--text-muted); transition: all 0.2s; margin-top: 4px;
}
.btn-choisir-citation:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-light); }

/* Zone affichage citation choisie */
.citation-choisie-affichage {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  padding: 10px 12px; border-radius: var(--radius-sm);
  background: var(--surface2); border: 1px solid var(--border);
  margin-bottom: 6px;
}
.citation-badge {
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 14px; padding: 2px 8px;
  border-radius: 4px; border: 1.5px solid currentColor;
  background: color-mix(in srgb, currentColor 10%, transparent);
}
.citation-ref-badge {
  font-size: 11px; color: var(--text-muted);
  font-family: 'DM Mono', monospace;
  background: var(--surface3); padding: 2px 6px; border-radius: 4px;
}
.citation-vide-hint {
  font-size: 12px; color: var(--text-light); font-style: italic;
  padding: 4px 0 8px 0;
}

/* Modal citation */
.modal--citation .modal-box { max-width: 680px; max-height: 90vh; display: flex; flex-direction: column; }
.modal-box--citation { max-width: 680px !important; }
.modal-body--citation { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }

.citation-instructions {
  font-size: 13px; color: var(--text-muted); line-height: 1.5;
  background: var(--surface2); padding: 10px 14px;
  border-radius: var(--radius-sm); border-left: 3px solid var(--accent);
}
.citation-selection-info {
  display: block; margin-top: 6px; font-size: 13px;
  font-family: 'Playfair Display', serif; min-height: 20px;
}

/* Conteneur du texte */
.citation-texte-container {
  font-family: 'Playfair Display', serif; font-size: 15px;
  line-height: 2; color: var(--text);
  padding: 16px; border: 1px solid var(--border);
  border-radius: var(--radius-sm); background: var(--surface);
  user-select: none; -webkit-user-select: none;
}
.citation-line { display: block; margin: 0; padding: 1px 0; }

/* Personnage (Dorante., Clarice. etc.) */
.citation-personnage {
  font-weight: 700; font-style: normal;
  color: var(--text-muted); font-size: 13px;
  text-transform: uppercase; letter-spacing: 0.05em;
  display: inline-block; margin-right: 8px;
}

/* Numéro de vers */
.citation-vers-num {
  color: var(--text-light); font-size: 11px;
  font-family: 'DM Mono', monospace; margin-left: 12px;
  font-style: normal;
}

/* Mot cliquable */
.citation-word {
  display: inline; cursor: pointer; border-radius: 3px;
  padding: 1px 2px; transition: background 0.15s, color 0.15s;
}
.citation-word:hover {
  background: var(--accent-light); color: #92400e;
}
.citation-word.selected {
  background: color-mix(in srgb, var(--sel-color, #0d5c8a) 20%, transparent);
  color: var(--sel-color, #0d5c8a);
  outline: 1.5px solid color-mix(in srgb, var(--sel-color, #0d5c8a) 50%, transparent);
  outline-offset: -1px;
  border-radius: 3px;
  font-weight: 600;
}

/* Bouton valider dynamique */
#citationValider {
  transition: background 0.2s, opacity 0.2s;
}
#citationValider:disabled { opacity: 0.4; cursor: not-allowed; }

@media print {
  .sidebar, .topbar, .btn-add-procede, .btn-add-mouvement, .procede-delete, .edit-toggle-fab, .edit-mode-banner { display: none !important; }
  .main { margin-left: 0; }
  .texte-view { page-break-inside: avoid; }
}
