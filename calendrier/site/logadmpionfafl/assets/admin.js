/* Admin du calendrier Pionniers — logique commune desktop/mobile.
   Reconstruction fidèle du handoff designer, avec :
   - stockage via l'API (../api/*.php) au lieu du localStorage,
   - authentification par session serveur (le mot de passe n'est plus côté client),
   - CRUD par identifiant (plus jamais par index de liste),
   - exceptions réversibles (« Rétablir la séance ») + nouvelle heure de fin,
   - import CSV robuste (BOM, guillemets RFC 4180, dédoublonnage, rapport détaillé),
   - export CSV avec BOM UTF-8 + CRLF (compatible Excel). */
(() => {
const API = "../api/";

class PionniersAdmin {

  init() {
    this.editEvId = null;
    this.editRecId = null;
    this.deleteTarget = null;
    this.deleteType = null;
    this.search = "";
    this.filterSec = "all";
    this.recs = [];
    this.evs = [];
    this.currentRecForDates = null; // id de récurrence
    this.currentExDate = null;
    this.currentExState = null;     // exception existante sur la date ouverte

    this.SECTIONS = {
      footus:    {label:'Foot US Senior', hex:'#c8383f'},
      flag:      {label:'Flag Senior',    hex:'#FFAD00'},
      footus_jr: {label:'Foot US Junior', hex:'#3B82C4'},
      flag_jr:   {label:'Flag Junior',    hex:'#8B5CF6'},
      ecole:     {label:'École de Flag',  hex:'#2B6E66'},
      club:      {label:'Vie du club',    hex:'#9A6B4F'},
    };
    this.DAYS_FR = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];

    this._bindAll();
    this._checkSession();
  }

  /* ---- API ---- */
  async _api(path, method = "GET", body = null) {
    const opt = { method, headers: {}, credentials: "same-origin" };
    if (body !== null) {
      opt.headers["Content-Type"] = "application/json";
      opt.body = JSON.stringify(body);
    }
    const res = await fetch(API + path, opt);
    let data = null;
    try { data = await res.json(); } catch (e) { /* réponse vide */ }
    if (res.status === 401) {
      this._showLogin();
      throw new Error("auth");
    }
    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || ("Erreur " + res.status);
      const fields = data && data.fields ? " (" + data.fields.join(", ") + ")" : "";
      throw new Error(msg + fields);
    }
    return data;
  }

  async _checkSession() {
    try {
      const s = await this._api("auth.php");
      if (s && s.admin) { await this._showAdmin(); return; }
    } catch (e) { /* hors ligne : l'écran de login l'indiquera à la tentative */ }
    this._showLogin();
  }

  _bindAll() {
    // Login
    const pw = document.getElementById('pwInput');
    document.getElementById('loginBtn').onclick = () => this._tryLogin();
    pw.addEventListener('keydown', e => { if(e.key==='Enter') this._tryLogin(); });

    // Topbar
    document.getElementById('logoutBtn').onclick = async () => {
      try { await this._api('auth.php', 'POST', { action: 'logout' }); } catch (e) {}
      this._showLogin();
    };
    document.getElementById('exportBtn').onclick = () => this._exportCSV();

    // Tabs
    document.getElementById('tabRec').onclick = () => this._setTab('rec');
    document.getElementById('tabEv').onclick  = () => this._setTab('ev');

    // Recurrence form
    document.getElementById('saveRec').onclick = () => this._saveRec();

    // Event form
    document.getElementById('saveEv').onclick    = () => this._saveEv();
    document.getElementById('cancelEv').onclick  = () => this._cancelEvEdit();
    document.getElementById('searchEv').oninput  = e => { this.search = e.target.value.toLowerCase(); this._renderEvList(); };
    document.querySelectorAll('.sec-filter-btn').forEach(btn => {
      btn.onclick = () => {
        this.filterSec = btn.getAttribute('data-sec');
        document.querySelectorAll('.sec-filter-btn').forEach(b => b.classList.toggle('active', b === btn));
        this._renderEvList();
      };
    });

    // Confirm modal
    document.getElementById('wipeEvBtn').onclick = () => this._askWipe();
    document.getElementById('confirmYes').onclick = () => this._confirmDelete();
    document.getElementById('confirmNo').onclick  = () => this._closeConfirm();
    document.getElementById('confirmOverlay').onclick = e => { if(e.target.id==='confirmOverlay') this._closeConfirm(); };

    // Edit rec modal
    document.getElementById('erSave').onclick   = () => this._saveEditRec();
    document.getElementById('erCancel').onclick = () => document.getElementById('editRecOverlay').classList.remove('open');
    document.getElementById('editRecOverlay').onclick = e => { if(e.target.id==='editRecOverlay') document.getElementById('editRecOverlay').classList.remove('open'); };

    // CSV import
    document.getElementById('csvImport').onchange = e => this._importCSV(e);

    // Exception modal
    document.getElementById('exCancel').onclick = () => this._applyException('cancel');
    document.getElementById('exMove').onclick   = () => this._applyException('move');
    const exRestore = document.getElementById('exRestore');
    if (exRestore) exRestore.onclick = () => this._restoreException();
    document.getElementById('exClose').onclick  = () => document.getElementById('exOverlay').classList.remove('open');
    document.getElementById('exOverlay').onclick = e => { if(e.target.id==='exOverlay') document.getElementById('exOverlay').classList.remove('open'); };

    // Dates modal
    document.getElementById('datesClose').onclick = () => document.getElementById('datesOverlay').classList.remove('open');
    document.getElementById('datesOverlay').onclick = e => { if(e.target.id==='datesOverlay') document.getElementById('datesOverlay').classList.remove('open'); };
  }

  async _tryLogin() {
    const val = (document.getElementById('pwInput').value||'').trim();
    if (!val) return;
    const err = document.getElementById('loginErr');
    try {
      await this._api('auth.php', 'POST', { password: val });
      err.classList.remove('show');
      document.getElementById('pwInput').value = '';
      await this._showAdmin();
    } catch (e) {
      err.textContent = e.message === 'auth' || /password|401/.test(e.message)
        ? 'Mot de passe incorrect.' : e.message;
      err.classList.add('show');
      document.getElementById('pwInput').value = '';
    }
  }

  _showLogin() {
    document.getElementById('loginScreen').style.display = '';
    document.getElementById('adminWrap').style.display = 'none';
  }

  async _showAdmin() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminWrap').style.display = 'flex';
    await this._refresh();
  }

  async _refresh() {
    try {
      [this.recs, this.evs] = await Promise.all([
        this._api('recurrences.php'),
        this._api('singles.php'),
      ]);
    } catch (e) {
      if (e.message !== 'auth') this._toast('Chargement impossible : ' + e.message, 'err');
      return;
    }
    this._renderRecList();
    this._renderEvList();
  }

  _setTab(t) {
    ['rec','ev'].forEach(tab => {
      document.getElementById('tab'+this._cap(tab)).classList.toggle('active', tab===t);
      document.getElementById('content'+this._cap(tab)).classList.toggle('active', tab===t);
    });
  }

  /* ---- RECURRENCES ---- */
  _readRecForm(prefix, daysRowId) {
    const g = id => (document.getElementById(id)||{}).value||'';
    return {
      section: g(prefix+'Section'),
      titre:   g(prefix+'Titre').trim(),
      days:    [...document.querySelectorAll('#'+daysRowId+' .day-cb:checked')].map(c=>parseInt(c.value)),
      debut:   g(prefix+'Debut'),
      fin:     g(prefix+'Fin'),
      from:    g(prefix+'From'),
      to:      g(prefix+'To'),
      lieu:    g(prefix+'Lieu').trim(),
      adresse: g(prefix+'Adresse').trim(),
      type:    g(prefix+'Type'),
    };
  }

  _validateRec(r) {
    if (!r.days.length)                 return 'Sélectionne au moins un jour';
    if (!r.titre)                       return 'Le titre est obligatoire';
    if (!r.from || !r.to)               return 'Les dates « Du » et « Au » sont obligatoires';
    if (r.from > r.to)                  return 'La date « Du » doit précéder « Au »';
    if (r.debut && r.fin && r.fin <= r.debut) return 'L\'heure de fin doit être après le début';
    return null;
  }

  async _saveRec() {
    const r = this._readRecForm('r', 'daysRow');
    const pb = this._validateRec(r);
    if (pb) { this._toast(pb, 'err'); return; }
    try {
      await this._api('recurrences.php', 'POST', r);
    } catch (e) { if (e.message !== 'auth') this._toast(e.message, 'err'); return; }
    await this._refresh();
    this._toast('Récurrence ajoutée ✓','ok');
    ['rTitre','rFrom','rTo','rDebut','rFin','rLieu','rAdresse'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    document.querySelectorAll('#daysRow .day-cb').forEach(c=>c.checked=false);
  }

  _renderRecList() {
    const recs = this.recs;
    document.getElementById('cntRec').textContent = recs.length;
    const container = document.getElementById('recList');
    if(!recs.length) { container.innerHTML='<div class="empty-msg">Aucune récurrence. Ajoute-en une ci-dessus.</div>'; return; }
    container.innerHTML = recs.map(r => {
      const s = this.SECTIONS[r.section]||{hex:'#555'};
      const daysStr = (r.days||[]).slice().sort((a,b)=>a-b).map(d=>this.DAYS_FR[d]).join(', ');
      const period = `${this._esc(r.from)} → ${this._esc(r.to)}`;
      const time   = r.debut ? (r.fin ? `${this._esc(r.debut)}–${this._esc(r.fin)}` : this._esc(r.debut)) : '';
      return `<div class="rec-item">
        <span class="rec-dot" style="background:${s.hex}"></span>
        <div class="rec-info">
          <div class="rec-title">${this._esc(r.titre)}</div>
          <div class="rec-meta">${daysStr} · ${time} · ${period}</div>
        </div>
        <button class="btn btn-ghost btn-sm" data-dates-rec="${this._esc(r.id)}" title="Voir les dates"><img src="../assets/emojis/calendrier.webp" alt=""></button>
        <button class="btn btn-ghost btn-sm" data-edit-rec="${this._esc(r.id)}" title="Modifier"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>
        <button class="btn btn-danger btn-sm" data-del-rec="${this._esc(r.id)}" data-title="${this._esc(r.titre)}" title="Supprimer">✕</button>
      </div>`;
    }).join('');
    container.querySelectorAll('[data-dates-rec]').forEach(b =>
      b.onclick = () => this._openDates(b.getAttribute('data-dates-rec'))
    );
    container.querySelectorAll('[data-edit-rec]').forEach(b =>
      b.onclick = () => this._openEditRec(b.getAttribute('data-edit-rec'))
    );
    container.querySelectorAll('[data-del-rec]').forEach(b =>
      b.onclick = () => this._askDelete('rec', b.getAttribute('data-del-rec'), b.getAttribute('data-title'))
    );
  }

  _recById(id) { return this.recs.find(r => r.id === id); }

  _openEditRec(id) {
    const r = this._recById(id); if(!r) return;
    this.editRecId = id;
    // Section et Type sont désormais éditables (impossibles à corriger avant)
    const sec = document.getElementById('erSection'); if (sec) sec.value = r.section || 'footus';
    const typ = document.getElementById('erType');    if (typ) typ.value = r.type || 'Entraînement';
    document.getElementById('erTitre').value  = r.titre||'';
    document.getElementById('erDebut').value  = r.debut||'';
    document.getElementById('erFin').value    = r.fin||'';
    document.getElementById('erFrom').value   = r.from||'';
    document.getElementById('erTo').value     = r.to||'';
    document.getElementById('erLieu').value   = r.lieu||'';
    document.getElementById('erAdresse').value= r.adresse||'';
    document.querySelectorAll('#erDaysRow .day-cb').forEach(c => {
      c.checked = (r.days||[]).includes(parseInt(c.value));
    });
    document.getElementById('editRecOverlay').classList.add('open');
  }

  async _saveEditRec() {
    if(this.editRecId === null) return;
    const r = this._readRecForm('er', 'erDaysRow');
    const pb = this._validateRec(r);
    if (pb) { this._toast(pb, 'err'); return; }
    try {
      await this._api('recurrences.php?id=' + encodeURIComponent(this.editRecId), 'PUT', r);
    } catch (e) { if (e.message !== 'auth') this._toast(e.message, 'err'); return; }
    document.getElementById('editRecOverlay').classList.remove('open');
    await this._refresh();
    this._toast('Récurrence mise à jour ✓','ok');
  }

  /* ---- DATES & EXCEPTIONS ---- */
  async _openDates(id) {
    const r = this._recById(id); if(!r) return;
    this.currentRecForDates = id;
    let exs = [];
    try { exs = await this._api('exceptions.php?recurrence_id=' + encodeURIComponent(id)); }
    catch (e) { if (e.message !== 'auth') this._toast(e.message, 'err'); return; }
    const exMap = {};
    exs.forEach(x => exMap[x.original_date] = x);
    this._exMap = exMap;
    document.getElementById('datesTitle').textContent = r.titre + ' — dates';
    const start = new Date(r.from+'T12:00'), end = new Date(r.to+'T12:00');
    const dates = [];
    const d = new Date(start);
    while(d <= end) {
      if((r.days||[]).includes(d.getDay())) {
        dates.push(this._isoOf(d));
      }
      d.setDate(d.getDate()+1);
    }
    const container = document.getElementById('datesList');
    container.innerHTML = dates.map(iso => {
      const ex = exMap[iso];
      const d2 = new Date(iso+'T12:00');
      const label = d2.toLocaleDateString('fr-FR',{weekday:'short',day:'2-digit',month:'short'});
      let cls = 'btn btn-ghost btn-sm';
      let badge = '';
      if(ex && ex.kind === 'cancelled') { cls='btn btn-danger btn-sm'; badge=' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/></svg>'; }
      else if(ex && ex.kind === 'moved') { cls='btn btn-gold btn-sm'; badge=' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>'; }
      return `<button class="${cls}" data-ex-date="${iso}" style="font-size:11px">${label}${badge}</button>`;
    }).join('');
    container.querySelectorAll('[data-ex-date]').forEach(b =>
      b.onclick = () => this._openException(id, b.getAttribute('data-ex-date'))
    );
    document.getElementById('datesOverlay').classList.add('open');
  }

  _openException(recId, date) {
    const r = this._recById(recId); if(!r) return;
    this.currentRecForDates = recId;
    this.currentExDate = date;
    this.currentExState = (this._exMap || {})[date] || null;
    const d = new Date(date+'T12:00');
    const label = d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
    document.getElementById('exTitle').textContent = r.titre;
    const desc = this.currentExState
      ? (this.currentExState.kind === 'cancelled'
          ? `Séance du ${label} : ANNULÉE` : `Séance du ${label} : reportée au ${this.currentExState.new_date}`)
      : `Exception pour le ${label}`;
    document.getElementById('exDesc').textContent = desc;
    document.getElementById('exNewDate').value  = this.currentExState?.new_date || date;
    document.getElementById('exNewDebut').value = this.currentExState?.new_debut || r.debut || '';
    const exFin = document.getElementById('exNewFin');
    if (exFin) exFin.value = this.currentExState?.new_fin || r.fin || '';
    document.getElementById('exNewLieu').value  = this.currentExState?.new_lieu || '';
    const restore = document.getElementById('exRestore');
    if (restore) restore.style.display = this.currentExState ? '' : 'none';
    document.getElementById('exOverlay').classList.add('open');
  }

  async _applyException(type) {
    if(this.currentRecForDates === null || !this.currentExDate) return;
    const r = this._recById(this.currentRecForDates); if(!r) return;
    const body = { recurrence_id: r.id, original_date: this.currentExDate };
    if(type === 'cancel') {
      body.kind = 'cancelled';
    } else {
      const newDate  = document.getElementById('exNewDate').value;
      const newDebut = document.getElementById('exNewDebut').value;
      const exFin    = document.getElementById('exNewFin');
      const newFin   = exFin ? exFin.value : '';
      const newLieu  = document.getElementById('exNewLieu').value.trim();
      if(!newDate) { this._toast('Indique une nouvelle date','err'); return; }
      if(newDate === this.currentExDate && !newDebut && !newFin && !newLieu) {
        this._toast('Rien ne change : indique une autre date, heure ou lieu','err'); return;
      }
      body.kind = 'moved';
      body.new_date  = newDate;
      body.new_debut = newDebut || r.debut;
      body.new_fin   = newFin   || r.fin;
      body.new_lieu  = newLieu  || r.lieu;
    }
    try { await this._api('exceptions.php', 'PUT', body); }
    catch (e) { if (e.message !== 'auth') this._toast(e.message, 'err'); return; }
    this._toast(type === 'cancel' ? 'Entraînement annulé ✓' : 'Entraînement reporté ✓','ok');
    document.getElementById('exOverlay').classList.remove('open');
    await this._refresh();
    if(document.getElementById('datesOverlay').classList.contains('open')) {
      this._openDates(this.currentRecForDates);
    }
  }

  /** Nouvelle possibilité : retirer l'exception → la séance d'origine revient. */
  async _restoreException() {
    if(this.currentRecForDates === null || !this.currentExDate) return;
    try {
      await this._api('exceptions.php', 'DELETE', {
        recurrence_id: this.currentRecForDates, original_date: this.currentExDate,
      });
    } catch (e) { if (e.message !== 'auth') this._toast(e.message, 'err'); return; }
    this._toast('Séance rétablie ✓','ok');
    document.getElementById('exOverlay').classList.remove('open');
    await this._refresh();
    if(document.getElementById('datesOverlay').classList.contains('open')) {
      this._openDates(this.currentRecForDates);
    }
  }

  _isoOf(d) {
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }

  /* ---- CSV IMPORT ---- */
  async _importCSV(e) {
    const file = e.target.files[0]; if(!file) return;
    const text = await file.text();
    e.target.value = '';
    const rows = this._parseCSV(text);
    if(!rows.length) { this._toast('Fichier vide ou illisible','err'); return; }
    const headers = rows[0].map(h => h.toLowerCase().trim());
    const objs = rows.slice(1).map(vals => {
      const o = {};
      headers.forEach((h,i) => o[h] = (vals[i]||'').trim());
      if (o.title && !o.titre) o.titre = o.title;
      return o;
    });
    const recurring = [];
    const candidates = [];
    objs.forEach(o => {
      const type = (o.type||'').toLowerCase();
      if (['entraînement','séance','entrainement','seance'].includes(type)) recurring.push(o);
      else candidates.push(o);
    });
    if(!candidates.length) {
      this._toast(`Aucun événement ponctuel à importer (${recurring.length} lignes d'entraînements/séances ignorées — gère-les via les récurrences)`, 'err');
      return;
    }
    let rep;
    try { rep = await this._api('singles.php', 'POST', { bulk: candidates }); }
    catch (err2) { if (err2.message !== 'auth') this._toast(err2.message, 'err'); return; }
    await this._refresh();
    const parts = [`${rep.inserted} importés`];
    if (rep.duplicates)      parts.push(`${rep.duplicates} doublons ignorés`);
    if (rep.invalid.length)  parts.push(`${rep.invalid.length} lignes invalides`);
    if (recurring.length)    parts.push(`${recurring.length} lignes récurrentes ignorées`);
    this._toast(parts.join(' · '), rep.inserted ? 'ok' : 'err');
    if (rep.invalid.length) console.warn('Lignes CSV invalides :', rep.invalid);
  }

  /** Parseur CSV RFC 4180 : BOM, guillemets doublés, retours ligne quotés, CRLF. */
  _parseCSV(text) {
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    const rows = [];
    let row = [], cur = '', inQ = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQ) {
        if (c === '"') {
          if (text[i+1] === '"') { cur += '"'; i++; }
          else inQ = false;
        } else cur += c;
      } else if (c === '"') {
        inQ = true;
      } else if (c === ',') {
        row.push(cur); cur = '';
      } else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i+1] === '\n') i++;
        row.push(cur); cur = '';
        if (row.length > 1 || row[0] !== '') rows.push(row);
        row = [];
      } else cur += c;
    }
    row.push(cur);
    if (row.length > 1 || row[0] !== '') rows.push(row);
    return rows;
  }

  /* ---- SINGLE EVENTS ---- */
  async _saveEv() {
    const g = id => (document.getElementById(id)||{}).value||'';
    const ev = {
      section: g('eSection'), titre: g('eTitre').trim(), date: g('eDate'),
      debut: g('eDebut'), fin: g('eFin'), lieu: g('eLieu').trim(),
      adresse: g('eAdresse').trim(), type: g('eType'),
      domicile: g('eDomicile'), notes: g('eNotes').trim(), arbitres: g('eArbitres').trim(),
    };
    if(!ev.titre||!ev.date) { this._toast('Titre et date obligatoires','err'); return; }
    if(ev.debut && ev.fin && ev.fin <= ev.debut) { this._toast('L\'heure de fin doit être après le début','err'); return; }
    try {
      if(this.editEvId) {
        await this._api('singles.php?id=' + encodeURIComponent(this.editEvId), 'PUT', ev);
        this._toast('Événement mis à jour ✓','ok');
      } else {
        await this._api('singles.php', 'POST', ev);
        this._toast('Événement ajouté ✓','ok');
      }
    } catch (e) { if (e.message !== 'auth') this._toast(e.message, 'err'); return; }
    this._cancelEvEdit();
    await this._refresh();
  }

  _cancelEvEdit() {
    this.editEvId = null;
    document.getElementById('evFormTitle').textContent = 'Nouvel événement ponctuel';
    document.getElementById('saveEv').textContent = 'Ajouter l\'événement';
    document.getElementById('cancelEv').style.display = 'none';
    ['eTitre','eDate','eDebut','eFin','eLieu','eAdresse','eNotes','eArbitres'].forEach(id=>{
      const el=document.getElementById(id); if(el) el.value='';
    });
    // défauts cohérents avec le premier chargement du formulaire
    document.getElementById('eSection').value='footus';
    document.getElementById('eType').value='Tournoi';
    document.getElementById('eDomicile').value='';
  }

  _startEvEdit(id) {
    const ev = this.evs.find(e=>e.id===id); if(!ev) return;
    this.editEvId = id;
    document.getElementById('eSection').value  = ev.section||'footus';
    document.getElementById('eTitre').value    = ev.titre||'';
    document.getElementById('eDate').value     = ev.date||'';
    document.getElementById('eDebut').value    = ev.debut||'';
    document.getElementById('eFin').value      = ev.fin||'';
    document.getElementById('eLieu').value     = ev.lieu||'';
    document.getElementById('eAdresse').value  = ev.adresse||'';
    // le type n'est jamais perdu : s'il manque au select, on l'y ajoute
    const sel = document.getElementById('eType');
    if (ev.type && ![...sel.options].some(o => o.value === ev.type)) {
      const o = document.createElement('option');
      o.value = o.textContent = ev.type;
      sel.appendChild(o);
    }
    sel.value = ev.type||'Tournoi';
    document.getElementById('eDomicile').value = ev.domicile||'';
    document.getElementById('eNotes').value    = ev.notes||'';
    document.getElementById('eArbitres').value = ev.arbitres||'';
    document.getElementById('evFormTitle').textContent = 'Modifier l\'événement';
    document.getElementById('saveEv').textContent = 'Mettre à jour';
    document.getElementById('cancelEv').style.display='';
    document.querySelector('.tab-content.active .card').scrollIntoView({behavior:'smooth'});
  }

  _renderEvList() {
    const evs = this.evs;
    document.getElementById('cntEv').textContent = evs.length;
    if(document.getElementById('evCountBadge')) document.getElementById('evCountBadge').textContent = evs.length;
    let list = [...evs];
    if(this.filterSec && this.filterSec !== 'all') list = list.filter(e => e.section === this.filterSec);
    if(this.search) list = list.filter(e =>
      [e.titre, e.lieu, e.notes, e.type, e.adresse, e.arbitres].join(' ').toLowerCase().includes(this.search));
    list.sort((a,b)=>((a.date||'')+(a.debut||'')).localeCompare((b.date||'')+(b.debut||'')));
    const container = document.getElementById('evList');
    if(!list.length){
      container.innerHTML='<div class="empty-msg">Aucun événement ponctuel. Ajoute des compétitions, matchs, événements club…</div>';
      return;
    }
    container.innerHTML = list.map(ev => {
      const s = this.SECTIONS[ev.section]||{hex:'#555'};
      const d = ev.date ? new Date(ev.date+'T12:00') : null;
      const dateStr = d ? d.toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}) : '—';
      const time = ev.debut ? (ev.fin?`${this._esc(ev.debut)}–${this._esc(ev.fin)}`:this._esc(ev.debut)) : '';
      return `<div class="ev-row">
        <span class="ev-dot" style="background:${s.hex}"></span>
        <span class="ev-date">${dateStr}</span>
        <span class="ev-title" title="${this._esc(ev.titre)}">${this._esc(ev.titre)}</span>
        <span class="ev-time">${time}</span>
        <div class="ev-actions">
          <button class="btn btn-ghost btn-sm" data-edit-ev="${this._esc(ev.id)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>
          <button class="btn btn-danger btn-sm" data-del-ev="${this._esc(ev.id)}" data-title="${this._esc(ev.titre)}">✕</button>
        </div>
      </div>`;
    }).join('');
    container.querySelectorAll('[data-edit-ev]').forEach(b=>
      b.onclick=()=>this._startEvEdit(b.getAttribute('data-edit-ev'))
    );
    container.querySelectorAll('[data-del-ev]').forEach(b=>
      b.onclick=()=>this._askDelete('ev', b.getAttribute('data-del-ev'), b.getAttribute('data-title'))
    );
  }

  /* ---- DELETE ---- */
  _askDelete(type, id, titre) {
    this.deleteTarget = id;
    this.deleteType   = type;
    document.getElementById('confirmText').textContent = `"${titre}" sera supprimé définitivement.` +
      (type === 'rec' ? ' Ses exceptions (annulations/reports) seront retirées aussi.' : '');
    document.getElementById('confirmOverlay').classList.add('open');
  }

  _askWipe() {
    const n = this.evs.length;
    if (!n) { this._toast('Aucun événement à supprimer', 'err'); return; }
    this.deleteType = 'wipe'; this.deleteTarget = null;
    document.querySelector('#confirmOverlay h3').textContent = 'Vider la liste ?';
    document.getElementById('confirmText').textContent =
      `Les ${n} événements ponctuels seront supprimés définitivement. Les récurrences ne sont pas touchées.`;
    document.getElementById('confirmYes').textContent = `Supprimer les ${n} événements`;
    document.getElementById('confirmOverlay').classList.add('open');
  }

  async _confirmDelete() {
    try {
      if(this.deleteType==='wipe'){
        await this._api('singles.php?all=1', 'DELETE');
        this._toast('Liste vidée ✓','ok');
      } else if(this.deleteType==='rec'){
        await this._api('recurrences.php?id=' + encodeURIComponent(this.deleteTarget), 'DELETE');
        this._toast('Supprimé ✓','ok');
      } else {
        await this._api('singles.php?id=' + encodeURIComponent(this.deleteTarget), 'DELETE');
        this._toast('Supprimé ✓','ok');
      }
    } catch (e) { if (e.message !== 'auth') this._toast(e.message, 'err'); this._closeConfirm(); return; }
    this._closeConfirm();
    await this._refresh();
  }

  _closeConfirm() {
    this.deleteTarget=null; this.deleteType=null;
    document.querySelector('#confirmOverlay h3').textContent = 'Supprimer ?';
    document.getElementById('confirmYes').textContent = 'Supprimer';
    document.getElementById('confirmOverlay').classList.remove('open');
  }

  /* ---- EXPORT ---- */
  async _exportCSV() {
    let all;
    try { all = await this._api('events.php'); }
    catch (e) { if (e.message !== 'auth') this._toast(e.message, 'err'); return; }
    if(!all.length){ this._toast('Aucun événement','err'); return; }
    const headers=['section','titre','date','debut','fin','lieu','adresse','type','domicile','notes','arbitres'];
    const esc = v=>`"${String(v||'').replace(/"/g,'""')}"`;
    // BOM UTF-8 (accents corrects dans Excel) + CRLF
    const csv='﻿'+[headers.join(','),...all.map(e=>headers.map(h=>esc(e[h])).join(','))].join('\r\n');
    const a=document.createElement('a');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    a.href=url;
    a.download='Pionniers_Calendrier.csv';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 5000);
    this._toast(`CSV exporté — ${all.length} événements ✓`,'ok');
  }

  /* ---- UTILS ---- */
  _cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
  _esc(s){ return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  _toast(msg, type) {
    type = type === 'ok' ? 'ok' : 'err';
    const t=document.getElementById('toast');
    t.textContent=(type==='ok'?'✓ ':'✗ ')+msg;
    t.className='toast '+type;
    void t.offsetWidth;
    t.classList.add('show');
    clearTimeout(this._tt);
    this._tt=setTimeout(()=>t.classList.remove('show'),3600);
  }
}

document.addEventListener("DOMContentLoaded", () => new PionniersAdmin().init());
})();
