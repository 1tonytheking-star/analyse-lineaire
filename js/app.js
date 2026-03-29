// ================================================================
// APP.JS — Main application logic
// ================================================================

import {
  seedIfEmpty, getOeuvres, addOeuvre,
  getTextesForOeuvre, getTexte, addTexte,
  getMouvementsForTexte, addMouvement,
  getProcedesForMouvement, addProcede, deleteProcede
} from './data.js';

// ----------------------------------------------------------------
// STATE
// ----------------------------------------------------------------
let state = {
  oeuvres: [],
  currentOeuvreId: null,
  currentTexteId: null,
  pendingTexteOeuvreId: null,   // for "add text" modal
  pendingAnalyseMvtId: null,    // for "add procede" modal
  pendingAnalyseTexteId: null,
  pendingMouvementTexteId: null
};

// ----------------------------------------------------------------
// ELEMENTS
// ----------------------------------------------------------------
const sidebar       = document.getElementById('sidebar');
const overlay       = document.getElementById('overlay');
const sidebarNav    = document.getElementById('sidebarNav');
const homeOeuvres   = document.getElementById('homeOeuvres');
const content       = document.getElementById('content');
const breadcrumb    = document.getElementById('breadcrumb');
const searchInput   = document.getElementById('searchInput');

// ----------------------------------------------------------------
// INIT
// ----------------------------------------------------------------
async function init() {
  // Theme
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.body.classList.add('dark');

  // Seed + load
  await seedIfEmpty();
  state.oeuvres = await getOeuvres();

  renderSidebar();
  renderHome();
  bindGlobalEvents();

  // Route from hash
  handleHash();
  window.addEventListener('hashchange', handleHash);
}

// ----------------------------------------------------------------
// ROUTING
// ----------------------------------------------------------------
function handleHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) { renderHome(); return; }
  const [type, id] = hash.split('/');
  if (type === 'oeuvre') showOeuvre(id);
  else if (type === 'texte') showTexte(id);
}

function navigate(hash) {
  window.location.hash = hash;
}

// ----------------------------------------------------------------
// SIDEBAR
// ----------------------------------------------------------------
function renderSidebar() {
  sidebarNav.innerHTML = '';

  if (!state.oeuvres.length) {
    sidebarNav.innerHTML = '<div class="nav-loading">Aucune œuvre. Ajoute-en une !</div>';
    return;
  }

  state.oeuvres.forEach(oeuvre => {
    const div = document.createElement('div');
    div.className = 'nav-oeuvre';
    div.innerHTML = `
      <button class="nav-oeuvre-btn" data-id="${oeuvre.id}">
        <span class="nav-oeuvre-dot" style="background:${oeuvre.couleur2}"></span>
        <span class="nav-oeuvre-name">${oeuvre.auteur}</span>
        <span class="nav-oeuvre-chevron">›</span>
      </button>
      <div class="nav-textes" id="nav-textes-${oeuvre.id}">
        <div class="nav-loading" style="font-size:11px;padding:8px 36px">Chargement…</div>
      </div>
    `;
    sidebarNav.appendChild(div);

    div.querySelector('.nav-oeuvre-btn').addEventListener('click', () => {
      toggleOeuvreNav(oeuvre.id, div);
    });
  });
}

async function toggleOeuvreNav(oeuvreId, div) {
  const btn = div.querySelector('.nav-oeuvre-btn');
  const textesList = div.querySelector('.nav-textes');
  const isOpen = btn.classList.contains('open');

  // Close all
  document.querySelectorAll('.nav-oeuvre-btn').forEach(b => b.classList.remove('open', 'active'));
  document.querySelectorAll('.nav-textes').forEach(t => t.classList.remove('open'));

  if (isOpen) return;

  btn.classList.add('open', 'active');
  textesList.classList.add('open');

  // Load textes
  const textes = await getTextesForOeuvre(oeuvreId);
  textesList.innerHTML = '';

  textes.forEach(texte => {
    const b = document.createElement('button');
    b.className = 'nav-texte-btn';
    b.textContent = texte.titre;
    b.dataset.id = texte.id;
    if (texte.id === state.currentTexteId) b.classList.add('active');
    b.addEventListener('click', () => {
      navigate(`texte/${texte.id}`);
      closeSidebar();
    });
    textesList.appendChild(b);
  });

  // Add texte button
  const addBtn = document.createElement('button');
  addBtn.className = 'nav-add-texte';
  addBtn.innerHTML = '<span>+</span> Ajouter un texte';
  addBtn.addEventListener('click', () => openModalTexte(oeuvreId));
  textesList.appendChild(addBtn);
}

// ----------------------------------------------------------------
// HOME
// ----------------------------------------------------------------
function renderHome() {
  state.currentOeuvreId = null;
  state.currentTexteId = null;
  setBreadcrumb('Accueil');

  const inner = document.querySelector('.home-screen');
  if (!inner) {
    content.innerHTML = `<div class="home-screen">
      <div class="home-hero">
        <div class="hero-badge">Baccalauréat · Français</div>
        <h1>Livret d'<em>Études</em><br>Linéaires</h1>
        <p class="hero-sub">Retrouve tes analyses, surligne les textes, ajoute tes propres observations.</p>
      </div>
      <div class="home-oeuvres" id="homeOeuvres"></div>
    </div>`;
  }

  const grid = document.getElementById('homeOeuvres') || document.querySelector('.home-oeuvres');
  grid.innerHTML = '';

  state.oeuvres.forEach(oeuvre => {
    const card = document.createElement('div');
    card.className = 'home-card';
    card.style.setProperty('--card-color', oeuvre.couleur2);
    card.innerHTML = `
      <div class="home-card-author">${oeuvre.auteur}</div>
      <div class="home-card-title">${oeuvre.titre}</div>
      <div class="home-card-count">${oeuvre.soustitre || ''}</div>
    `;
    // colored top bar
    card.style.borderTop = `3px solid ${oeuvre.couleur2}`;
    card.addEventListener('click', () => navigate(`oeuvre/${oeuvre.id}`));
    grid.appendChild(card);
  });
}

// ----------------------------------------------------------------
// OEUVRE PAGE
// ----------------------------------------------------------------
async function showOeuvre(oeuvreId) {
  state.currentOeuvreId = oeuvreId;
  state.currentTexteId = null;

  const oeuvre = state.oeuvres.find(o => o.id === oeuvreId);
  if (!oeuvre) { navigate(''); return; }

  setBreadcrumb(`<strong>${oeuvre.auteur}</strong> — ${oeuvre.titre}`);

  const textes = await getTextesForOeuvre(oeuvreId);

  content.innerHTML = `
    <div class="texte-view">
      <div class="oeuvre-banner" style="background:linear-gradient(135deg, ${oeuvre.couleur1} 0%, ${oeuvre.couleur2} 100%)">
        <div class="oeuvre-num">Œuvre</div>
        <h2>${oeuvre.auteur} — ${oeuvre.titre}</h2>
        <div class="oeuvre-banner-sub">${oeuvre.soustitre || ''}</div>
        <div class="oeuvre-meta-grid">
          <div class="meta-field">
            <label>Mouvement</label>
            <p>${oeuvre.mouvement || '—'}</p>
          </div>
          <div class="meta-field full">
            <label>Mots-clés</label>
            <div class="oeuvre-tags">${(oeuvre.motsCles || []).map(m => `<span class="oeuvre-tag">${m}</span>`).join('')}</div>
          </div>
          <div class="meta-field full">
            <label>Enjeu</label>
            <p>${oeuvre.enjeu || '—'}</p>
          </div>
        </div>
      </div>

      <h3 style="font-family:'Playfair Display',serif;font-size:18px;margin-bottom:14px;color:var(--text)">Textes de l'œuvre</h3>
      <div class="oeuvre-textes-grid" id="textesGrid"></div>
    </div>
  `;

  const grid = document.getElementById('textesGrid');

  textes.forEach((texte, i) => {
    const card = document.createElement('div');
    card.className = 'texte-card';
    card.innerHTML = `
      <div class="texte-card-num">Texte ${i + 1}</div>
      <div class="texte-card-title">${texte.titre}</div>
      <div class="texte-card-preview">${texte.intro || ''}</div>
    `;
    card.addEventListener('click', () => navigate(`texte/${texte.id}`));
    grid.appendChild(card);
  });

  // Add texte card
  const addCard = document.createElement('div');
  addCard.className = 'texte-card texte-card-add';
  addCard.innerHTML = `<div class="plus">+</div><span>Ajouter un texte</span>`;
  addCard.addEventListener('click', () => openModalTexte(oeuvreId));
  grid.appendChild(addCard);
}

// ----------------------------------------------------------------
// TEXTE VIEW
// ----------------------------------------------------------------
async function showTexte(texteId) {
  state.currentTexteId = texteId;

  const texte = await getTexte(texteId);
  if (!texte) { navigate(''); return; }

  const oeuvre = state.oeuvres.find(o => o.id === texte.oeuvreId);
  setBreadcrumb(`<a href="#oeuvre/${texte.oeuvreId}" style="color:inherit;text-decoration:none">${oeuvre?.auteur || ''}</a> › <strong>${texte.titre}</strong>`);

  // Update sidebar active state
  document.querySelectorAll('.nav-texte-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.id === texteId);
  });

  const mouvements = await getMouvementsForTexte(texteId);

  content.innerHTML = `
    <div class="texte-view" id="texteView">
      <!-- Header -->
      <div class="texte-header-card">
        <div class="texte-ref">${oeuvre?.auteur || ''} · ${oeuvre?.titre || ''}</div>
        <h2>${texte.titre}</h2>
        ${texte.intro ? `<div class="intro-box">${texte.intro}</div>` : ''}
        <div class="kw-grid">
          ${texte.contexte ? `<div class="kw-item"><div class="kw-label">Contexte</div><p>${texte.contexte}</p></div>` : ''}
          ${texte.enjeu ? `<div class="kw-item"><div class="kw-label">Enjeu</div><p>${texte.enjeu}</p></div>` : ''}
        </div>
        ${texte.problematique ? `
          <div class="prob-box">
            <div class="prob-label">Problématique</div>
            <p>${texte.problematique}</p>
          </div>` : ''}
      </div>

      <!-- Texte intégral -->
      ${texte.texteIntegral ? `
        <div class="texte-integral-card">
          <div class="section-label">Texte intégral</div>
          <div class="texte-integral">${texte.texteIntegral}</div>
        </div>` : ''}

      <!-- Analyses -->
      <div id="analysesContainer"></div>

      <!-- Add mouvement -->
      <button class="btn-add-mouvement" id="btnAddMouvement">
        <span style="font-size:18px">+</span> Ajouter un mouvement
      </button>

      <!-- Conclusion -->
      ${texte.conclusion ? `
        <div class="conclusion-card">
          <div class="section-label">Conclusion</div>
          <div class="conclusion-full">${texte.conclusion}</div>
          <div class="conclusion-grid">
            ${(texte.conclusionItems || []).map(item => `
              <div class="conclusion-item">
                <div class="conc-label">${item.label}</div>
                <p>${item.texte}</p>
              </div>`).join('')}
          </div>
        </div>` : ''}
    </div>
  `;

  // Render mouvements
  const container = document.getElementById('analysesContainer');
  for (const mvt of mouvements) {
    const block = await renderMouvement(mvt, texteId);
    container.appendChild(block);
  }

  // Add mouvement button
  document.getElementById('btnAddMouvement').addEventListener('click', () => {
    state.pendingMouvementTexteId = texteId;
    openModal('modalMouvement');
  });
}

async function renderMouvement(mvt, texteId) {
  const procedes = await getProcedesForMouvement(mvt.id);

  const mvtColors = {1:'mvt-1', 2:'mvt-2', 3:'mvt-3', 4:'mvt-4'};
  const mvtClass = mvtColors[mvt.mouvement] || 'mvt-1';

  const div = document.createElement('div');
  div.className = 'analyse-card';
  div.dataset.mvtId = mvt.id;

  div.innerHTML = `
    <div class="analyse-card-header">
      <div class="mvt-title ${mvtClass}">
        Mouvement ${mvt.mouvement} <span>— ${mvt.titre || ''}${mvt.vers ? ' (' + mvt.vers + ')' : ''}</span>
      </div>
    </div>
    <div class="analyse-card-body" id="body-${mvt.id}">
      ${procedes.map((p, i) => renderProcede(p, mvt.mouvement, i + 1)).join('')}
      <button class="btn-add-procede" data-mvt="${mvt.id}" data-texte="${texteId}">
        <span style="font-size:16px">+</span> Ajouter un procédé
      </button>
    </div>
  `;

  // Events
  div.querySelectorAll('.procede-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.closest('[data-procede-id]').dataset.procedeId;
      if (confirm('Supprimer ce procédé ?')) {
        await deleteProcede(id);
        e.target.closest('.procede-row').remove();
        toast('Procédé supprimé', 'success');
      }
    });
  });

  div.querySelector('.btn-add-procede').addEventListener('click', () => {
    state.pendingAnalyseMvtId = mvt.id;
    state.pendingAnalyseTexteId = texteId;
    document.getElementById('analyseMouvement').value = mvt.mouvement;
    openModal('modalAnalyse');
  });

  return div;
}

function renderProcede(p, mvtNum, displayNum) {
  const numClass = `pn-${mvtNum}-${Math.min(displayNum, 6)}`;
  return `
    <div class="procede-row" data-procede-id="${p.id}">
      <div class="procede-num ${numClass}">${displayNum}</div>
      <div class="procede-content">
        <span class="procede-citation">« ${p.citation} »</span>
        <span class="procede-ref">${p.ref || ''}</span>
        <span class="procede-analyse">${p.analyse}</span>
      </div>
      <button class="procede-delete" title="Supprimer">✕</button>
    </div>
  `;
}

// ----------------------------------------------------------------
// MODALS
// ----------------------------------------------------------------
function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));
}

function openModalTexte(oeuvreId) {
  state.pendingTexteOeuvreId = oeuvreId;
  openModal('modalTexte');
}

// ---- Save: Oeuvre ----
document.getElementById('saveOeuvre').addEventListener('click', async () => {
  const auteur = document.getElementById('oeuvreAuteur').value.trim();
  const titre = document.getElementById('oeuvreTitre').value.trim();
  if (!auteur || !titre) { toast('Auteur et titre requis', 'error'); return; }

  const data = {
    auteur,
    titre,
    soustitre: document.getElementById('oeuvreSoustitre').value.trim(),
    mouvement: document.getElementById('oeuvreMouvement').value.trim(),
    couleur1: document.getElementById('oeuvreCouleur1').value,
    couleur2: document.getElementById('oeuvreCouleur2').value,
    motsCles: document.getElementById('oeuvreMots').value.split(',').map(s => s.trim()).filter(Boolean),
    enjeu: document.getElementById('oeuvreEnjeu').value.trim()
  };

  const id = await addOeuvre(data);
  state.oeuvres = await getOeuvres();
  renderSidebar();
  closeAllModals();
  toast('Œuvre ajoutée !', 'success');
  navigate(`oeuvre/${id}`);
});

// ---- Save: Texte ----
document.getElementById('saveTexte').addEventListener('click', async () => {
  const titre = document.getElementById('texteTitre').value.trim();
  if (!titre) { toast('Titre requis', 'error'); return; }

  const data = {
    titre,
    intro: document.getElementById('texteIntro').value.trim(),
    contexte: document.getElementById('texteContexte').value.trim(),
    enjeu: document.getElementById('texteEnjeu').value.trim(),
    problematique: document.getElementById('texteProblematique').value.trim(),
    texteIntegral: document.getElementById('texteIntegral').value.trim(),
    conclusion: '',
    conclusionItems: []
  };

  const id = await addTexte(state.pendingTexteOeuvreId, data);

  // Refresh sidebar textes
  const navTextes = document.getElementById(`nav-textes-${state.pendingTexteOeuvreId}`);
  if (navTextes) {
    const textes = await getTextesForOeuvre(state.pendingTexteOeuvreId);
    navTextes.innerHTML = '';
    textes.forEach(t => {
      const b = document.createElement('button');
      b.className = 'nav-texte-btn';
      b.textContent = t.titre;
      b.dataset.id = t.id;
      b.addEventListener('click', () => { navigate(`texte/${t.id}`); closeSidebar(); });
      navTextes.appendChild(b);
    });
    const addBtn = document.createElement('button');
    addBtn.className = 'nav-add-texte';
    addBtn.innerHTML = '<span>+</span> Ajouter un texte';
    addBtn.addEventListener('click', () => openModalTexte(state.pendingTexteOeuvreId));
    navTextes.appendChild(addBtn);
  }

  closeAllModals();
  toast('Texte ajouté !', 'success');
  navigate(`texte/${id}`);

  // Reset form
  document.getElementById('texteTitre').value = '';
  document.getElementById('texteIntro').value = '';
  document.getElementById('texteIntegral').value = '';
  document.getElementById('texteContexte').value = '';
  document.getElementById('texteEnjeu').value = '';
  document.getElementById('texteProblematique').value = '';
});

// ---- Save: Mouvement ----
document.getElementById('saveMouvement').addEventListener('click', async () => {
  const titre = document.getElementById('mouvementTitre').value.trim();
  if (!titre) { toast('Titre requis', 'error'); return; }

  // Count existing mouvements to auto-number
  const existing = await getMouvementsForTexte(state.pendingMouvementTexteId);
  const nextNum = Math.min(existing.length + 1, 4);

  const data = {
    mouvement: nextNum,
    titre,
    vers: document.getElementById('mouvementVers').value.trim()
  };

  const id = await addMouvement(state.pendingMouvementTexteId, data);
  closeAllModals();
  toast('Mouvement ajouté !', 'success');

  // Re-render analyses
  const container = document.getElementById('analysesContainer');
  const allMvts = await getMouvementsForTexte(state.pendingMouvementTexteId);
  container.innerHTML = '';
  for (const mvt of allMvts) {
    const block = await renderMouvement(mvt, state.pendingMouvementTexteId);
    container.appendChild(block);
  }

  document.getElementById('mouvementTitre').value = '';
  document.getElementById('mouvementVers').value = '';
});

// ---- Save: Analyse (procédé) ----
document.getElementById('saveAnalyse').addEventListener('click', async () => {
  const citation = document.getElementById('analyseCitation').value.trim();
  const procede = document.getElementById('analyseProcede').value.trim();
  const analyseText = document.getElementById('analyseTexte').value.trim();
  if (!citation || !analyseText) { toast('Citation et analyse requises', 'error'); return; }

  const mvtNum = parseInt(document.getElementById('analyseMouvement').value);
  const num = parseInt(document.getElementById('analyseNumero').value);

  const analyse = `La <span class="procede-type">${procede}</span> ${analyseText}`;

  const data = {
    num,
    citation,
    ref: document.getElementById('analyseRef').value.trim(),
    procede,
    analyse,
    mouvement: mvtNum
  };

  const ref = await addProcede(state.pendingAnalyseMvtId, state.pendingAnalyseTexteId, data);
  const docData = { id: ref.id, ...data };

  // Add to DOM
  const body = document.getElementById(`body-${state.pendingAnalyseMvtId}`);
  const addBtn = body.querySelector('.btn-add-procede');
  const count = body.querySelectorAll('.procede-row').length + 1;
  const row = document.createElement('div');
  row.innerHTML = renderProcede(docData, mvtNum, count);
  const rowEl = row.firstElementChild;
  rowEl.querySelector('.procede-delete').addEventListener('click', async (e) => {
    if (confirm('Supprimer ce procédé ?')) {
      await deleteProcede(docData.id);
      rowEl.remove();
      toast('Procédé supprimé', 'success');
    }
  });
  body.insertBefore(rowEl, addBtn);

  closeAllModals();
  toast('Analyse ajoutée !', 'success');

  // Reset
  document.getElementById('analyseCitation').value = '';
  document.getElementById('analyseRef').value = '';
  document.getElementById('analyseProcede').value = '';
  document.getElementById('analyseTexte').value = '';
  document.getElementById('analysePreview').textContent = '';
});

// Live preview for analyse modal
function updateAnalysePreview() {
  const citation = document.getElementById('analyseCitation').value;
  const procede = document.getElementById('analyseProcede').value;
  const texte = document.getElementById('analyseTexte').value;
  const preview = document.getElementById('analysePreview');
  if (citation || texte) {
    preview.innerHTML = `<em>« ${citation} »</em> — La <strong>${procede}</strong> ${texte}`;
  } else {
    preview.textContent = '';
  }
}
document.getElementById('analyseCitation').addEventListener('input', updateAnalysePreview);
document.getElementById('analyseProcede').addEventListener('input', updateAnalysePreview);
document.getElementById('analyseTexte').addEventListener('input', updateAnalysePreview);

// ----------------------------------------------------------------
// GLOBAL EVENTS
// ----------------------------------------------------------------
function bindGlobalEvents() {
  // Sidebar toggle (mobile)
  document.getElementById('menuBtn').addEventListener('click', openSidebar);
  document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  // Add oeuvre
  document.getElementById('btnAddOeuvre').addEventListener('click', () => openModal('modalOeuvre'));

  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    document.getElementById('themeToggle').textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  });

  // Print
  document.getElementById('btnPrint').addEventListener('click', () => window.print());

  // Modal close buttons
  document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAllModals();
    });
  });

  // Search
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.nav-texte-btn').forEach(btn => {
      btn.style.display = btn.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
    document.querySelectorAll('.nav-oeuvre-btn').forEach(btn => {
      btn.style.display = btn.querySelector('.nav-oeuvre-name').textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  // Logo/title → home
  document.querySelector('.sidebar-logo').addEventListener('click', () => {
    navigate('');
    closeSidebar();
  });

  // Update theme icon
  if (document.body.classList.contains('dark')) {
    document.getElementById('themeToggle').textContent = '☀️';
  }
}

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
}

// ----------------------------------------------------------------
// BREADCRUMB
// ----------------------------------------------------------------
function setBreadcrumb(html) {
  breadcrumb.innerHTML = html;
}

// ----------------------------------------------------------------
// TOAST
// ----------------------------------------------------------------
let toastEl = null;
let toastTimer = null;

function toast(msg, type = '') {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  toastEl.className = `toast ${type}`;
  setTimeout(() => toastEl.classList.add('show'), 10);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
}

// ----------------------------------------------------------------
// START
// ----------------------------------------------------------------
init().catch(err => {
  console.error(err);
  content.innerHTML = `<div style="padding:40px;color:#dc2626">
    <h2>Erreur de connexion Firebase</h2>
    <p>Vérifie ta configuration dans <code>js/firebase-config.js</code></p>
    <pre style="margin-top:12px;font-size:12px;background:#fee2e2;padding:12px;border-radius:8px">${err.message}</pre>
  </div>`;
});
