// ================================================================
// APP.JS — Main application logic + Edit Mode
// ================================================================

import {
  seedIfEmpty, getOeuvres, addOeuvre, updateOeuvre,
  getTextesForOeuvre, getTexte, addTexte, updateTexte,
  getMouvementsForTexte, addMouvement, updateMouvement, deleteMouvement,
  getProcedesForMouvement, addProcede, updateProcede, deleteProcede
} from './data.js';

// ----------------------------------------------------------------
// STATE
// ----------------------------------------------------------------
let state = {
  oeuvres: [],
  editMode: false,
  currentOeuvreId: null,
  currentTexteId: null,
  currentTexteData: null,
  currentMouvements: [],
  pendingTexteOeuvreId: null,
  pendingAnalyseMvtId: null,
  pendingAnalyseTexteId: null,
  pendingMouvementTexteId: null,
  editingProcede: null  // { id, mouvementId, texteId }
};

// ----------------------------------------------------------------
// DOM
// ----------------------------------------------------------------
const sidebar    = document.getElementById('sidebar');
const overlay    = document.getElementById('overlay');
const sidebarNav = document.getElementById('sidebarNav');
const content    = document.getElementById('content');
const breadcrumb = document.getElementById('breadcrumb');
const searchInput= document.getElementById('searchInput');
const editToggle = document.getElementById('editToggle');

// ----------------------------------------------------------------
// INIT
// ----------------------------------------------------------------
async function init() {
  if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
  updateThemeIcon();

  await seedIfEmpty();
  state.oeuvres = await getOeuvres();

  renderSidebar();
  renderHome();
  bindGlobalEvents();
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
function navigate(hash) { window.location.hash = hash; }

// ----------------------------------------------------------------
// EDIT MODE
// ----------------------------------------------------------------
function setEditMode(on) {
  state.editMode = on;
  document.body.classList.toggle('edit-mode', on);
  editToggle.innerHTML = on ? '✓ Terminer' : '✏️ Modifier';
  editToggle.classList.toggle('active', on);

  // Refresh current view to show/hide edit controls
  const hash = window.location.hash.slice(1);
  const [type, id] = hash.split('/');
  if (type === 'texte' && id) showTexte(id);
  else if (type === 'oeuvre' && id) showOeuvre(id);
}

// ----------------------------------------------------------------
// SIDEBAR
// ----------------------------------------------------------------
function renderSidebar() {
  sidebarNav.innerHTML = '';
  if (!state.oeuvres.length) {
    sidebarNav.innerHTML = '<div class="nav-loading">Aucune œuvre.</div>';
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
      <div class="nav-textes" id="nav-textes-${oeuvre.id}"></div>
    `;
    sidebarNav.appendChild(div);
    div.querySelector('.nav-oeuvre-btn').addEventListener('click', () => toggleOeuvreNav(oeuvre.id, div));
  });
}

async function toggleOeuvreNav(oeuvreId, div) {
  const btn = div.querySelector('.nav-oeuvre-btn');
  const list = div.querySelector('.nav-textes');
  const isOpen = btn.classList.contains('open');

  document.querySelectorAll('.nav-oeuvre-btn').forEach(b => b.classList.remove('open','active'));
  document.querySelectorAll('.nav-textes').forEach(t => t.classList.remove('open'));

  if (isOpen) return;
  btn.classList.add('open','active');
  list.classList.add('open');

  await refreshSidebarTextes(oeuvreId, list);
}

async function refreshSidebarTextes(oeuvreId, list) {
  list.innerHTML = '';
  const textes = await getTextesForOeuvre(oeuvreId);
  textes.forEach(texte => {
    const b = document.createElement('button');
    b.className = 'nav-texte-btn' + (texte.id === state.currentTexteId ? ' active' : '');
    b.textContent = texte.titre;
    b.dataset.id = texte.id;
    b.addEventListener('click', () => { navigate(`texte/${texte.id}`); closeSidebar(); });
    list.appendChild(b);
  });
  const addBtn = document.createElement('button');
  addBtn.className = 'nav-add-texte';
  addBtn.innerHTML = '<span>+</span> Ajouter un texte';
  addBtn.addEventListener('click', () => openModalTexte(oeuvreId));
  list.appendChild(addBtn);
  return textes;
}

// ----------------------------------------------------------------
// HOME
// ----------------------------------------------------------------
function renderHome() {
  state.currentOeuvreId = null;
  state.currentTexteId = null;
  setBreadcrumb('Accueil');

  content.innerHTML = `
    <div class="home-hero">
      <div class="hero-badge">Baccalauréat · Français</div>
      <h1>Livret d'<em>Études</em><br>Linéaires</h1>
      <p class="hero-sub">Retrouve tes analyses, surligne les textes, ajoute tes propres observations.</p>
    </div>
    <div class="home-oeuvres" id="homeOeuvres"></div>
  `;

  const grid = document.getElementById('homeOeuvres');
  state.oeuvres.forEach(o => {
    const card = document.createElement('div');
    card.className = 'home-card';
    card.style.borderTop = `3px solid ${o.couleur2}`;
    card.innerHTML = `
      <div class="home-card-author">${o.auteur}</div>
      <div class="home-card-title">${o.titre}</div>
      <div class="home-card-count">${o.soustitre || ''}</div>
    `;
    card.addEventListener('click', () => navigate(`oeuvre/${o.id}`));
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
      <div class="oeuvre-banner" style="background:linear-gradient(135deg,${oeuvre.couleur1} 0%,${oeuvre.couleur2} 100%)">
        ${state.editMode ? `<div class="edit-section-label">✏️ Cliquez sur un champ pour le modifier</div>` : ''}
        <div class="oeuvre-num">Œuvre</div>
        <h2 ${state.editMode ? `class="editable" data-field="titre" data-doc="oeuvre" data-id="${oeuvreId}"` : ''}>${oeuvre.titre}</h2>
        <div class="oeuvre-banner-sub" ${state.editMode ? `class="oeuvre-banner-sub editable" data-field="soustitre" data-doc="oeuvre" data-id="${oeuvreId}"` : ''}>${oeuvre.soustitre||''}</div>
        <div class="oeuvre-meta-grid">
          <div class="meta-field">
            <label>Mouvement</label>
            <p ${state.editMode ? `class="editable" data-field="mouvement" data-doc="oeuvre" data-id="${oeuvreId}"` : ''}>${oeuvre.mouvement||'—'}</p>
          </div>
          <div class="meta-field full">
            <label>Mots-clés</label>
            <div class="oeuvre-tags">${(oeuvre.motsCles||[]).map(m=>`<span class="oeuvre-tag">${m}</span>`).join('')}</div>
            ${state.editMode ? `<input type="text" class="edit-inline-input" style="margin-top:8px;width:100%;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:white;border-radius:6px;padding:6px 10px;font-size:12px" placeholder="Modifier les mots-clés (virgule séparés)" data-field="motsCles" data-doc="oeuvre" data-id="${oeuvreId}" value="${(oeuvre.motsCles||[]).join(', ')}">` : ''}
          </div>
          <div class="meta-field full">
            <label>Enjeu</label>
            <p ${state.editMode ? `class="editable" data-field="enjeu" data-doc="oeuvre" data-id="${oeuvreId}"` : ''}>${oeuvre.enjeu||'—'}</p>
          </div>
        </div>
      </div>
      <h3 style="font-family:'Playfair Display',serif;font-size:18px;margin-bottom:14px;color:var(--text)">Textes de l'œuvre</h3>
      <div class="oeuvre-textes-grid" id="textesGrid"></div>
    </div>
  `;

  // inline edit for oeuvre fields
  if (state.editMode) {
    bindInlineEdits();
    const mkcInput = content.querySelector('.edit-inline-input[data-field="motsCles"]');
    if (mkcInput) {
      mkcInput.addEventListener('change', async () => {
        const vals = mkcInput.value.split(',').map(s=>s.trim()).filter(Boolean);
        await updateOeuvre(oeuvreId, { motsCles: vals });
        state.oeuvres = await getOeuvres();
        toast('Mots-clés mis à jour', 'success');
      });
    }
  }

  const grid = document.getElementById('textesGrid');
  textes.forEach((t,i) => {
    const card = document.createElement('div');
    card.className = 'texte-card';
    card.innerHTML = `
      <div class="texte-card-num">Texte ${i+1}</div>
      <div class="texte-card-title">${t.titre}</div>
      <div class="texte-card-preview">${t.intro||''}</div>
    `;
    card.addEventListener('click', () => navigate(`texte/${t.id}`));
    grid.appendChild(card);
  });

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
  state.currentTexteData = texte;

  const oeuvre = state.oeuvres.find(o => o.id === texte.oeuvreId);
  setBreadcrumb(`<a href="#oeuvre/${texte.oeuvreId}" style="color:inherit;text-decoration:none">${oeuvre?.auteur||''}</a> › <strong>${texte.titre}</strong>`);

  document.querySelectorAll('.nav-texte-btn').forEach(b => b.classList.toggle('active', b.dataset.id === texteId));

  const mouvements = await getMouvementsForTexte(texteId);
  state.currentMouvements = mouvements;

  const EM = state.editMode;
  // eAttr: adds editable class WITHOUT replacing existing classes — use on elements that have their own class
  const eAttr = (field, extraClass = '') => EM
    ? `class="${extraClass ? extraClass + ' ' : ''}editable" data-field="${field}" data-doc="texte" data-id="${texteId}"`
    : (extraClass ? `class="${extraClass}"` : '');

  const eConcItem = (field, idx) => EM
    ? `class="editable-conc" contenteditable="true" data-conc-field="${field}" data-conc-idx="${idx}" data-texte-id="${texteId}"`
    : '';

  content.innerHTML = `
    <div class="texte-view" id="texteView">

      ${EM ? `<div class="edit-mode-banner">✏️ Mode édition actif — cliquez sur n'importe quel texte pour le modifier</div>` : ''}

      <!-- Header -->
      <div class="texte-header-card">
        <div class="texte-ref">${oeuvre?.auteur||''} · ${oeuvre?.titre||''}</div>
        <h2 ${eAttr('titre')}>${texte.titre}</h2>

        <div ${eAttr('intro', 'intro-box')}>${texte.intro||'<em style="color:var(--text-light)">Ajouter une introduction…</em>'}</div>

        <div class="kw-grid">
          <div class="kw-item">
            <div class="kw-label">Contexte</div>
            <p ${eAttr('contexte')}>${texte.contexte||'—'}</p>
          </div>
          <div class="kw-item">
            <div class="kw-label">Enjeu</div>
            <p ${eAttr('enjeu')}>${texte.enjeu||'—'}</p>
          </div>
        </div>

        <div class="prob-box">
          <div class="prob-label">Problématique</div>
          <p ${eAttr('problematique')}>${texte.problematique||'—'}</p>
        </div>
      </div>

      <!-- Texte intégral -->
      <div class="texte-integral-card">
        <div class="section-label">Texte intégral</div>
        <div class="texte-integral" ${EM ? `contenteditable="true" data-field="texteIntegral" data-doc="texte" data-id="${texteId}"` : ''}>${texte.texteIntegral||'<em style="color:var(--text-light)">Coller le texte intégral ici…</em>'}</div>
        ${EM ? `<button class="btn-save-field" data-field="texteIntegral" data-doc="texte" data-id="${texteId}" style="margin-top:8px">💾 Sauvegarder le texte</button>` : ''}
      </div>

      <!-- Analyses -->
      <div id="analysesContainer"></div>

      ${EM ? `
      <button class="btn-add-mouvement" id="btnAddMouvement">
        <span style="font-size:18px">+</span> Ajouter un mouvement
      </button>` : ''}

      <!-- Conclusion -->
      <div class="conclusion-card">
        <div class="section-label">Conclusion</div>
        <div ${eAttr('conclusion', 'conclusion-full')}>${texte.conclusion||'<em style="color:var(--text-light)">Ajouter une conclusion…</em>'}</div>
        <div class="conclusion-grid" id="conclusionGrid">
          ${(texte.conclusionItems||[]).map((item,i) => `
            <div class="conclusion-item" data-conc-idx="${i}" style="${EM ? 'position:relative' : ''}">
              <div class="conc-label" ${eConcItem('label', i)}>${item.label}</div>
              <p ${eConcItem('texte', i)}>${item.texte}</p>
              ${EM ? `<button class="btn-delete-conc" data-idx="${i}" style="position:absolute;top:6px;right:6px;background:none;border:none;color:#dc2626;cursor:pointer;font-size:12px;">✕</button>` : ''}
            </div>`).join('')}
        </div>
        ${EM ? `
        <button class="btn-add-conc" id="btnAddConc" style="margin-top:10px">+ Ajouter un élément de conclusion</button>
        ` : ''}
      </div>

    </div>
  `;

  // Render mouvements
  const container = document.getElementById('analysesContainer');
  for (const mvt of mouvements) {
    const block = await renderMouvement(mvt, texteId);
    container.appendChild(block);
  }

  // Bind events
  if (EM) {
    bindInlineEdits();
    bindConclusionEdits(texte, texteId);

    document.getElementById('btnAddMouvement')?.addEventListener('click', () => {
      state.pendingMouvementTexteId = texteId;
      openModal('modalMouvement');
    });

    // Save contenteditable texte intégral
    document.querySelector('.btn-save-field')?.addEventListener('click', async (e) => {
      const el = content.querySelector('[data-field="texteIntegral"]');
      await updateTexte(texteId, { texteIntegral: el.innerHTML });
      toast('Texte intégral sauvegardé', 'success');
    });
  }
}

// ----------------------------------------------------------------
// INLINE EDITS — click on text → textarea → save on blur
// ----------------------------------------------------------------
function bindInlineEdits() {
  content.querySelectorAll('.editable').forEach(el => {
    el.style.cursor = 'text';
    el.style.outline = '2px dashed var(--accent)';
    el.style.borderRadius = '4px';
    el.style.padding = '2px 4px';

    el.addEventListener('click', () => startInlineEdit(el));
  });
}

function startInlineEdit(el) {
  if (el.classList.contains('editing')) return;
  el.classList.add('editing');

  const isMultiline = el.tagName === 'P' || el.tagName === 'DIV';
  const field = el.dataset.field;
  const docType = el.dataset.doc;
  const docId = el.dataset.id;

  const input = isMultiline
    ? document.createElement('textarea')
    : document.createElement('input');
  input.value = el.textContent.trim();
  input.style.cssText = `width:100%;font:inherit;color:inherit;background:var(--surface3);
    border:2px solid var(--accent);border-radius:6px;padding:6px 8px;
    resize:vertical;min-height:${isMultiline ? '80px' : '36px'};box-sizing:border-box;`;

  const originalDisplay = el.style.display;
  el.style.display = 'none';
  el.parentNode.insertBefore(input, el.nextSibling);
  input.focus();

  const currentText = el.textContent.trim();

  const save = async () => {
    const newVal = input.value.trim();
    input.remove();
    el.style.display = originalDisplay;
    el.classList.remove('editing');

    if (newVal === currentText) return; // no change

    el.textContent = newVal;
    if (docType === 'texte') await updateTexte(docId, { [field]: newVal });
    else if (docType === 'oeuvre') { await updateOeuvre(docId, { [field]: newVal }); state.oeuvres = await getOeuvres(); }
    else if (docType === 'mvt') await updateMouvement(docId, { [field]: newVal });
    toast('Modifié ✓', 'success');
  };

  input.addEventListener('blur', save);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !isMultiline) { e.preventDefault(); save(); }
    if (e.key === 'Escape') { input.remove(); el.style.display = originalDisplay; el.classList.remove('editing'); }
  });
}

// ----------------------------------------------------------------
// CONCLUSION EDITS
// ----------------------------------------------------------------
function bindConclusionEdits(texte, texteId) {
  // Edit existing items inline
  content.querySelectorAll('.editable-conc').forEach(el => {
    el.style.outline = '2px dashed var(--accent)';
    el.style.borderRadius = '4px';
    el.style.minHeight = '20px';
    el.style.cursor = 'text';
    el.style.padding = '2px 4px';
    el.addEventListener('blur', async () => {
      const idx = parseInt(el.dataset.concIdx);
      const field = el.dataset.concField;
      const items = [...(texte.conclusionItems || [])];
      if (!items[idx]) return;
      items[idx] = { ...items[idx], [field]: el.textContent.trim() };
      texte.conclusionItems = items;
      await updateTexte(texteId, { conclusionItems: items });
      toast('Conclusion mise à jour ✓', 'success');
    });
  });

  // Delete conclusion item
  content.querySelectorAll('.btn-delete-conc').forEach(btn => {
    btn.addEventListener('click', async () => {
      const idx = parseInt(btn.dataset.idx);
      const items = [...(texte.conclusionItems || [])].filter((_,i) => i !== idx);
      texte.conclusionItems = items;
      await updateTexte(texteId, { conclusionItems: items });
      btn.closest('.conclusion-item').remove();
      toast('Élément supprimé', 'success');
    });
  });

  // Add conclusion item
  document.getElementById('btnAddConc')?.addEventListener('click', async () => {
    const label = prompt('Titre de l\'élément (ex: "Thématique"):');
    if (!label) return;
    const texteEl = prompt('Contenu:');
    if (!texteEl) return;
    const items = [...(texte.conclusionItems || []), { label: label.trim(), texte: texteEl.trim() }];
    texte.conclusionItems = items;
    await updateTexte(texteId, { conclusionItems: items });
    toast('Élément ajouté', 'success');
    // Refresh
    showTexte(texteId);
  });
}

// ----------------------------------------------------------------
// RENDER MOUVEMENT
// ----------------------------------------------------------------
async function renderMouvement(mvt, texteId) {
  const procedes = await getProcedesForMouvement(mvt.id);
  const mvtClass = `mvt-${Math.min(mvt.mouvement, 4)}`;
  const EM = state.editMode;

  const div = document.createElement('div');
  div.className = 'analyse-card';
  div.dataset.mvtId = mvt.id;

  div.innerHTML = `
    <div class="analyse-card-header">
      <div class="mvt-title ${mvtClass}">
        Mouvement ${mvt.mouvement}
        <span
          ${EM ? `contenteditable="true" class="mvt-editable-title" data-mvt-id="${mvt.id}" style="outline:1px dashed rgba(255,255,255,0.5);border-radius:4px;padding:0 4px;cursor:text;"` : ''}>
          — ${mvt.titre||''}${mvt.vers ? ' ('+mvt.vers+')' : ''}
        </span>
      </div>
      ${EM ? `<button class="btn-delete-mvt" data-mvt-id="${mvt.id}" style="background:rgba(220,38,38,0.2);border:1px solid rgba(220,38,38,0.4);color:#fca5a5;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px;">✕ Supprimer ce mouvement</button>` : ''}
    </div>
    <div class="analyse-card-body" id="body-${mvt.id}">
      ${procedes.map((p,i) => renderProcede(p, mvt.mouvement, i+1)).join('')}
      ${EM ? `<button class="btn-add-procede" data-mvt="${mvt.id}" data-texte="${texteId}">
        <span style="font-size:16px">+</span> Ajouter un procédé
      </button>` : ''}
    </div>
  `;

  // Edit mouvement title
  if (EM) {
    const titleSpan = div.querySelector('.mvt-editable-title');
    if (titleSpan) {
      titleSpan.addEventListener('blur', async () => {
        const raw = titleSpan.textContent.replace(/^[\s—]+/, '').trim();
        const parts = raw.match(/^(.+?)\s*\((.+)\)$/);
        if (parts) {
          await updateMouvement(mvt.id, { titre: parts[1].trim(), vers: parts[2].trim() });
        } else {
          await updateMouvement(mvt.id, { titre: raw });
        }
        toast('Mouvement mis à jour', 'success');
      });
    }

    div.querySelector('.btn-delete-mvt')?.addEventListener('click', async () => {
      if (!confirm('Supprimer ce mouvement et tous ses procédés ?')) return;
      await deleteMouvement(mvt.id);
      div.remove();
      toast('Mouvement supprimé', 'success');
    });

    div.querySelector('.btn-add-procede')?.addEventListener('click', () => {
      state.pendingAnalyseMvtId = mvt.id;
      state.pendingAnalyseTexteId = texteId;
      state.editingProcede = null;
      document.getElementById('analyseMouvement').value = mvt.mouvement;
      // Reset citation zone
      resetCitationZone();
      openModal('modalAnalyse');
    });
  }

  // Delete procede buttons
  div.querySelectorAll('.procede-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Supprimer ce procédé ?')) return;
      await deleteProcede(btn.dataset.procedeId);
      btn.closest('.procede-row').remove();
      toast('Procédé supprimé', 'success');
    });
  });

  // Edit procede (click on row in edit mode)
  if (EM) {
    div.querySelectorAll('.procede-row[data-procede-id]').forEach(row => {
      row.style.cursor = 'pointer';
      row.addEventListener('click', (e) => {
        if (e.target.classList.contains('procede-delete')) return;
        const pid = row.dataset.procedeId;
        const p = procedes.find(p => p.id === pid);
        if (!p) return;
        openEditProcede(p, mvt.id, texteId, row);
      });
    });
  }

  return div;
}

function renderProcede(p, mvtNum, displayNum) {
  const EM = state.editMode;
  const nClass = `pn-${Math.min(mvtNum,4)}-${Math.min(displayNum,6)}`;
  return `
    <div class="procede-row${EM ? ' procede-row--editable' : ''}" data-procede-id="${p.id}">
      <div class="procede-num ${nClass}">${displayNum}</div>
      <div class="procede-content">
        <span class="procede-citation">« ${p.citation} »</span>
        <span class="procede-ref">${p.ref||''}</span>
        <span class="procede-analyse">${p.analyse}</span>
      </div>
      ${EM ? `<button class="procede-delete" data-procede-id="${p.id}" title="Supprimer">✕</button>` : ''}
    </div>`;
}

// ----------------------------------------------------------------
// EDIT PROCEDE (inline dans la modal)
// ----------------------------------------------------------------
function openEditProcede(p, mouvementId, texteId, rowEl) {
  state.editingProcede = { id: p.id, mouvementId, texteId, rowEl };

  document.getElementById('analyseCitation').value = p.citation || '';
  document.getElementById('analyseRef').value = p.ref || '';
  document.getElementById('analyseProcede').value = p.procede || '';
  document.getElementById('analyseTexte').value = (p.analyse || '').replace(/<[^>]+>/g,'').replace(/^La |^L'|^Le /, '').replace(p.procede||'','').trim();
  document.getElementById('analyseMouvement').value = p.mouvement || 1;
  document.getElementById('analyseNumero').value = p.num || 1;

  // Show existing citation
  if (p.citation) {
    const mvtNum = p.mouvement || 1;
    const color = getMvtColor(mvtNum);
    showCitationChoisie(p.citation, p.ref || '', color);
  } else {
    resetCitationZone();
  }

  document.getElementById('modalAnalyse').querySelector('h3').textContent = 'Modifier le procédé';
  updateAnalysePreview();
  openModal('modalAnalyse');
}

// ----------------------------------------------------------------
// MODALS
// ----------------------------------------------------------------
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeAllModals() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));
  // Reset modal title
  const analyseModal = document.getElementById('modalAnalyse');
  if (analyseModal) analyseModal.querySelector('h3').textContent = 'Nouvelle analyse de procédé';
  state.editingProcede = null;
  resetCitationZone();
}
function openModalTexte(oeuvreId) { state.pendingTexteOeuvreId = oeuvreId; openModal('modalTexte'); }

// ---- Save: Oeuvre ----
document.getElementById('saveOeuvre').addEventListener('click', async () => {
  const auteur = document.getElementById('oeuvreAuteur').value.trim();
  const titre = document.getElementById('oeuvreTitre').value.trim();
  if (!auteur || !titre) { toast('Auteur et titre requis', 'error'); return; }

  const id = await addOeuvre({
    auteur, titre,
    soustitre: document.getElementById('oeuvreSoustitre').value.trim(),
    mouvement: document.getElementById('oeuvreMouvement').value.trim(),
    couleur1: document.getElementById('oeuvreCouleur1').value,
    couleur2: document.getElementById('oeuvreCouleur2').value,
    motsCles: document.getElementById('oeuvreMots').value.split(',').map(s=>s.trim()).filter(Boolean),
    enjeu: document.getElementById('oeuvreEnjeu').value.trim()
  });
  state.oeuvres = await getOeuvres();
  renderSidebar();
  closeAllModals();
  toast('Œuvre ajoutée !', 'success');
  navigate(`oeuvre/${id}`);
  document.querySelectorAll('#modalOeuvre input, #modalOeuvre textarea').forEach(el => el.value='');
});

// ---- Save: Texte ----
document.getElementById('saveTexte').addEventListener('click', async () => {
  const titre = document.getElementById('texteTitre').value.trim();
  if (!titre) { toast('Titre requis', 'error'); return; }

  const id = await addTexte(state.pendingTexteOeuvreId, {
    titre,
    intro: document.getElementById('texteIntro').value.trim(),
    contexte: document.getElementById('texteContexte').value.trim(),
    enjeu: document.getElementById('texteEnjeu').value.trim(),
    problematique: document.getElementById('texteProblematique').value.trim(),
    texteIntegral: document.getElementById('texteIntegral').value.trim(),
    conclusion: '', conclusionItems: []
  });

  const navList = document.getElementById(`nav-textes-${state.pendingTexteOeuvreId}`);
  if (navList) await refreshSidebarTextes(state.pendingTexteOeuvreId, navList);

  closeAllModals();
  toast('Texte ajouté !', 'success');
  navigate(`texte/${id}`);
  document.querySelectorAll('#modalTexte input, #modalTexte textarea').forEach(el => el.value='');
});

// ---- Save: Mouvement ----
document.getElementById('saveMouvement').addEventListener('click', async () => {
  const titre = document.getElementById('mouvementTitre').value.trim();
  if (!titre) { toast('Titre requis', 'error'); return; }

  const existing = await getMouvementsForTexte(state.pendingMouvementTexteId);
  const nextNum = Math.min(existing.length + 1, 4);

  await addMouvement(state.pendingMouvementTexteId, {
    mouvement: nextNum,
    titre,
    vers: document.getElementById('mouvementVers').value.trim()
  });

  closeAllModals();
  toast('Mouvement ajouté !', 'success');
  document.getElementById('mouvementTitre').value = '';
  document.getElementById('mouvementVers').value = '';
  showTexte(state.pendingMouvementTexteId);
});

// ---- Save: Procédé (add or edit) ----
document.getElementById('saveAnalyse').addEventListener('click', async () => {
  const citation = document.getElementById('analyseCitation').value.trim();
  const procede = document.getElementById('analyseProcede').value.trim();
  const analyseText = document.getElementById('analyseTexte').value.trim();
  if (!citation || !analyseText) { toast('Citation et analyse requises', 'error'); return; }

  const mvtNum = parseInt(document.getElementById('analyseMouvement').value);
  const num = parseInt(document.getElementById('analyseNumero').value);
  const analyse = `La <span class="procede-type">${procede}</span> ${analyseText}`;
  const ref = document.getElementById('analyseRef').value.trim();

  if (state.editingProcede) {
    // UPDATE existing
    await updateProcede(state.editingProcede.id, { citation, ref, procede, analyse, mouvement: mvtNum, num });
    toast('Procédé modifié !', 'success');
    closeAllModals();
    showTexte(state.currentTexteId);
  } else {
    // ADD new
    const docRef = await addProcede(state.pendingAnalyseMvtId, state.pendingAnalyseTexteId, { num, citation, ref, procede, analyse, mouvement: mvtNum });
    const body = document.getElementById(`body-${state.pendingAnalyseMvtId}`);
    const addBtn = body?.querySelector('.btn-add-procede');
    const count = body?.querySelectorAll('.procede-row').length + 1;
    const row = document.createElement('div');
    row.innerHTML = renderProcede({ id: docRef.id, citation, ref, procede, analyse, mouvement: mvtNum, num }, mvtNum, count);
    const rowEl = row.firstElementChild;
    rowEl.querySelector('.procede-delete')?.addEventListener('click', async () => {
      if (!confirm('Supprimer ?')) return;
      await deleteProcede(docRef.id);
      rowEl.remove();
      toast('Supprimé', 'success');
    });
    if (state.editMode) {
      rowEl.style.cursor = 'pointer';
      rowEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('procede-delete')) return;
        openEditProcede({ id: docRef.id, citation, ref, procede, analyse, mouvement: mvtNum, num }, state.pendingAnalyseMvtId, state.pendingAnalyseTexteId, rowEl);
      });
    }
    if (body && addBtn) body.insertBefore(rowEl, addBtn);
    toast('Analyse ajoutée !', 'success');
    closeAllModals();
  }

  document.getElementById('analyseCitation').value = '';
  document.getElementById('analyseRef').value = '';
  document.getElementById('analyseProcede').value = '';
  document.getElementById('analyseTexte').value = '';
  document.getElementById('analysePreview').textContent = '';
  resetCitationZone();
});

// Live preview
['analyseCitation','analyseProcede','analyseTexte'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateAnalysePreview);
});
function updateAnalysePreview() {
  const c = document.getElementById('analyseCitation').value;
  const p = document.getElementById('analyseProcede').value;
  const t = document.getElementById('analyseTexte').value;
  const prev = document.getElementById('analysePreview');
  prev.innerHTML = (c||t) ? `<em>« ${c} »</em> — La <strong>${p}</strong> ${t}` : '';
}

// ----------------------------------------------------------------
// GLOBAL EVENTS
// ----------------------------------------------------------------
function bindGlobalEvents() {
  document.getElementById('menuBtn').addEventListener('click', openSidebar);
  document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  document.getElementById('btnAddOeuvre').addEventListener('click', () => openModal('modalOeuvre'));

  document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    updateThemeIcon();
  });

  document.getElementById('btnPrint').addEventListener('click', () => window.print());

  // Edit toggle
  editToggle.addEventListener('click', () => setEditMode(!state.editMode));

  document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => btn.addEventListener('click', closeAllModals));
  document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => { if (e.target===m) closeAllModals(); }));

  searchInput.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.nav-texte-btn').forEach(b => b.style.display = b.textContent.toLowerCase().includes(q) ? '' : 'none');
    document.querySelectorAll('.nav-oeuvre-btn').forEach(b => b.style.display = b.querySelector('.nav-oeuvre-name').textContent.toLowerCase().includes(q) ? '' : 'none');
  });

  document.querySelector('.sidebar-logo').addEventListener('click', () => { navigate(''); closeSidebar(); });
}

function openSidebar() { sidebar.classList.add('open'); overlay.classList.add('active'); }
function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('active'); }
function setBreadcrumb(html) { breadcrumb.innerHTML = html; }
function updateThemeIcon() {
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}

// ----------------------------------------------------------------
// TOAST
// ----------------------------------------------------------------
let toastEl, toastTimer;
function toast(msg, type='') {
  if (!toastEl) { toastEl = document.createElement('div'); toastEl.className='toast'; document.body.appendChild(toastEl); }
  toastEl.textContent = msg;
  toastEl.className = `toast ${type}`;
  setTimeout(() => toastEl.classList.add('show'), 10);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
}

// ----------------------------------------------------------------
// CITATION PICKER
// ----------------------------------------------------------------

// Couleurs par mouvement (correspondance avec les classes CSS mvt-1 à mvt-4)
function getMvtColor(mvtNum) {
  const colors = {
    1: '#0d5c8a',  // bleu
    2: '#2d7a4a',  // vert
    3: '#b45309',  // orange
    4: '#6a3093'   // violet
  };
  return colors[Math.min(mvtNum, 4)] || colors[1];
}

function resetCitationZone() {
  document.getElementById('analyseCitation').value = '';
  document.getElementById('analyseRef').value = '';
  document.getElementById('citationChoisieZone').style.display = 'none';
  document.getElementById('citationVide').style.display = '';
  document.getElementById('citationChoisieAffichage').innerHTML = '';
}

function showCitationChoisie(citation, ref, color) {
  document.getElementById('citationChoisieZone').style.display = '';
  document.getElementById('citationVide').style.display = 'none';
  const affichage = document.getElementById('citationChoisieAffichage');
  affichage.innerHTML = `
    <span class="citation-badge" style="border-color:${color};color:${color}">« ${citation} »</span>
    ${ref ? `<span class="citation-ref-badge">${ref}</span>` : ''}
  `;
}

// State du picker
let citationPickerState = {
  selectedWords: [],  // [{wordIndex, text, lineRef}]
  words: []           // [{index, text, lineRef, el}]
};

function openCitationPicker() {
  const texte = state.currentTexteData;
  if (!texte || !texte.texteIntegral) {
    toast('Aucun texte intégral disponible', 'error');
    return;
  }

  const mvtNum = parseInt(document.getElementById('analyseMouvement').value) || 1;
  const color = getMvtColor(mvtNum);

  citationPickerState.selectedWords = [];
  citationPickerState.words = [];

  // Convertir le texteIntegral HTML en mots cliquables
  const container = document.getElementById('citationTexteContainer');
  container.innerHTML = '';

  // On parse le HTML du texteIntegral pour extraire le texte en conservant les numéros de vers
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = texte.texteIntegral;

  // Extraire le texte brut avec conservation des lignes
  const rawText = tempDiv.innerText || tempDiv.textContent;
  const lines = rawText.split('\n');

  let wordIndex = 0;
  const fragment = document.createDocumentFragment();

  lines.forEach((line, lineIdx) => {
    if (!line.trim()) {
      fragment.appendChild(document.createElement('br'));
      return;
    }

    // Détecter si la ligne a un numéro (ex: "quelque chose 5")
    // Ou si c'est un nom de personnage (en majuscules)
    const lineDiv = document.createElement('div');
    lineDiv.className = 'citation-line';

    // Détecter numéro de vers en fin de ligne
    const versMatch = line.match(/\s+(\d+)\s*$/);
    const versNum = versMatch ? versMatch[1] : null;
    const lineText = versMatch ? line.replace(/\s+\d+\s*$/, '') : line;

    // Détecter personnage (ligne commençant par un nom en gras-like: "Dorante." ou tout en majuscules)
    const isPersonnage = /^[A-ZÀÂÉÈÊÎÏÔÙÛÜ][a-zàâéèêîïôùûüA-Z]*\.$/.test(lineText.trim()) ||
                         /^[A-ZÀÂÉÈÊÎÏÔÙÛÜ]+\s*\.$/.test(lineText.trim());

    if (isPersonnage) {
      const span = document.createElement('span');
      span.className = 'citation-personnage';
      span.textContent = lineText.trim();
      lineDiv.appendChild(span);
    } else {
      // Tokeniser en mots + ponctuation
      const tokens = lineText.split(/(\s+)/);
      tokens.forEach(token => {
        if (/^\s+$/.test(token)) {
          lineDiv.appendChild(document.createTextNode(token));
          return;
        }
        if (!token) return;

        const wordSpan = document.createElement('span');
        wordSpan.className = 'citation-word';
        wordSpan.textContent = token;
        wordSpan.dataset.wordIndex = wordIndex;
        wordSpan.dataset.lineRef = versNum ? `v. ${versNum}` : `l. ${lineIdx + 1}`;

        const wi = wordIndex;
        wordSpan.addEventListener('click', () => toggleCitationWord(wi, color));

        citationPickerState.words.push({
          index: wi,
          text: token,
          lineRef: versNum ? `v. ${versNum}` : `l. ${lineIdx + 1}`,
          el: wordSpan
        });

        lineDiv.appendChild(wordSpan);
        wordIndex++;
      });
    }

    if (versNum) {
      const versSpan = document.createElement('span');
      versSpan.className = 'citation-vers-num';
      versSpan.textContent = versNum;
      lineDiv.appendChild(versSpan);
    }

    fragment.appendChild(lineDiv);
  });

  container.appendChild(fragment);
  updateCitationInfo(color);

  // Update couleur du bouton valider
  document.getElementById('citationValider').style.background = color;

  // Ouvrir la modal
  document.getElementById('modalCitation').classList.add('open');
}

function toggleCitationWord(wordIndex, color) {
  const word = citationPickerState.words.find(w => w.index === wordIndex);
  if (!word) return;

  const existing = citationPickerState.selectedWords.findIndex(w => w.index === wordIndex);
  if (existing >= 0) {
    citationPickerState.selectedWords.splice(existing, 1);
    word.el.classList.remove('selected');
    word.el.style.removeProperty('--sel-color');
  } else {
    citationPickerState.selectedWords.push({ index: wordIndex, text: word.text, lineRef: word.lineRef });
    word.el.classList.add('selected');
    word.el.style.setProperty('--sel-color', color);
  }

  updateCitationInfo(color);
}

function updateCitationInfo(color) {
  const selected = citationPickerState.selectedWords;
  const info = document.getElementById('citationSelectionInfo');
  const btn = document.getElementById('citationValider');

  if (selected.length === 0) {
    info.textContent = 'Aucun mot sélectionné';
    btn.disabled = true;
    return;
  }

  // Trier par ordre d'apparition dans le texte
  const sorted = [...selected].sort((a, b) => a.index - b.index);
  const citation = sorted.map(w => w.text).join(' ');

  // Référence : premier et dernier vers/ligne sélectionnés
  const firstRef = sorted[0].lineRef;
  const lastRef = sorted[sorted.length - 1].lineRef;
  const ref = firstRef === lastRef ? firstRef : `${firstRef}–${lastRef}`;

  info.innerHTML = `<span style="color:${color}">« ${citation} »</span> <em style="opacity:0.7">${ref}</em>`;
  btn.disabled = false;
}

// Valider la citation choisie
document.getElementById('citationValider').addEventListener('click', () => {
  const selected = [...citationPickerState.selectedWords].sort((a, b) => a.index - b.index);
  if (selected.length === 0) return;

  const citation = selected.map(w => w.text).join(' ');
  const firstRef = selected[0].lineRef;
  const lastRef = selected[selected.length - 1].lineRef;
  const ref = firstRef === lastRef ? firstRef : `${firstRef}–${lastRef}`;

  const mvtNum = parseInt(document.getElementById('analyseMouvement').value) || 1;
  const color = getMvtColor(mvtNum);

  // Remplir les champs cachés
  document.getElementById('analyseCitation').value = citation;
  document.getElementById('analyseRef').value = ref;

  // Afficher dans la zone de la modal analyse
  showCitationChoisie(citation, ref, color);

  // Mettre à jour la preview
  updateAnalysePreview();

  // Fermer la modal citation
  document.getElementById('modalCitation').classList.remove('open');
});

document.getElementById('citationAnnuler').addEventListener('click', () => {
  document.getElementById('modalCitation').classList.remove('open');
});
document.getElementById('citationModalClose').addEventListener('click', () => {
  document.getElementById('modalCitation').classList.remove('open');
});
document.getElementById('modalCitation').addEventListener('click', e => {
  if (e.target === document.getElementById('modalCitation'))
    document.getElementById('modalCitation').classList.remove('open');
});

document.getElementById('btnChoisirCitation').addEventListener('click', openCitationPicker);

// ----------------------------------------------------------------
// START
// ----------------------------------------------------------------
init().catch(err => {
  console.error(err);
  content.innerHTML = `<div style="padding:40px;color:#dc2626">
    <h2>Erreur Firebase</h2>
    <p>Vérifie ta config dans <code>js/firebase-config.js</code></p>
    <pre style="margin-top:12px;font-size:12px;background:#fee2e2;padding:12px;border-radius:8px">${err.message}</pre>
  </div>`;
});
