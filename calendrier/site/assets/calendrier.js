
/* Calendrier Pionniers de Touraine : logique commune desktop/mobile.
   Reconstruction fidèle du handoff designer (différences mobile sous
   `this.mobile`) ; données servies par l'API (/api/events.php). */
(() => {
class PionniersCalendrier {

  constructor(mobile) { this.mobile = !!mobile; }

  init() {
    this.SECTIONS = {
      footus:    { label:"Foot US Senior",  hex:"#c8383f", light:false },
      flag:      { label:"Flag Senior",     hex:"#FFAD00", light:true  },
      footus_jr: { label:"Foot US Junior",  hex:"#3B82C4", light:false },
      flag_jr:   { label:"Flag Junior",     hex:"#8B5CF6", light:false },
      ecole:     { label:"École de Flag",   hex:"#2B6E66", light:false },
      club:      { label:"Vie du club",     hex:"#9A6B4F", light:false },
    };
    this.MONTHS = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
    this.WD = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
    // Compétitions Flag Senior extraites du calendrier FFFA 2026-2027
    // CM = Championnat Mixte | CdF = Coupe de France
    // Chaque week-end est bloqué sam. + dim. (le match peut être l'un ou l'autre)

    this.evts = [];
    this.view = "semaine";
    this.today = new Date(); this.today.setHours(0,0,0,0);
    this.cursor = new Date(this.today);
    this.active = new Set(Object.keys(this.SECTIONS));

    // Calendrier interne (dossier /private) : API et assets un cran plus haut,
    // flux privé derrière une session.
    this.scope     = document.body.dataset.scope === "private" ? "private" : "public";
    this.apiBase   = this.scope === "private" ? "../api/"    : "api/";
    this.assetBase = this.scope === "private" ? "../assets/" : "assets/";

    // Vacances scolaires / jours fériés (fichier optionnel jours-speciaux.js)
    this.SPECIAUX = this._buildSpeciaux(
      typeof window !== "undefined" ? window.PIONNIERS_JOURS_SPECIAUX : null);
    this.hasSpeciaux = Object.keys(this.SPECIAUX).length > 0;

    const q = id => document.getElementById(id);
    q("prev").onclick     = () => this._nav(-1);
    q("next").onclick     = () => this._nav(1);
    q("todayBtn").onclick = () => this._goToday();
    q("viewMois").onclick    = () => this._setView("mois");
    q("viewSemaine").onclick = () => this._setView("semaine");
    q("viewAgenda").onclick  = () => this._setView("agenda");
    q("viewSaison").onclick  = () => this._setView("saison");
    q("mClose").onclick   = () => this._closeModal();
    q("overlay").onclick  = e => { if(e.target.id === "overlay") this._closeModal(); };
    const np = q("navPrint"); if (np) np.onclick = () => window.print();
    ["Mois","Semaine","Agenda","Saison"].forEach(v => {
      const b = q("nav" + v); if (b) b.onclick = () => this._setView(v.toLowerCase());
    });
    document.addEventListener("keydown", e => {
      const ov = document.getElementById("overlay");
      if (e.key === "Escape" && ov && ov.classList.contains("open")) this._closeModal();
    });

    if (this.mobile) {
      // tiroir latéral
      const drawer = q("drawer"), scrim = q("scrim"), burger = q("burger");
      const setDrawer = open => {
        drawer.classList.toggle("open", open);
        scrim.classList.toggle("open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
      };
      const syncTopH = () => {
        const h = document.querySelector(".mtop");
        if (h) document.documentElement.style.setProperty("--mtop-h", Math.round(h.getBoundingClientRect().height) + "px");
      };
      this._syncTopH = syncTopH;
      syncTopH(); window.addEventListener("resize", syncTopH);
      burger.onclick = () => setDrawer(!drawer.classList.contains("open"));
      q("drawerClose").onclick = () => setDrawer(false);
      scrim.onclick = () => setDrawer(false);
      drawer.querySelectorAll(".navitem").forEach(el => el.addEventListener("click", () => setDrawer(false)));
      document.addEventListener("keydown", e => { if (e.key === "Escape") setDrawer(false); });

      // barre d'onglets basse
      document.querySelectorAll(".tabbtn").forEach(b => {
        b.onclick = () => this._setView(b.dataset.view);
      });
    }

    // Titre défilant au hover quand le texte est tronqué
    document.addEventListener("mouseenter", e => {
      const chip = e.target && e.target.closest ? e.target.closest(".ev,.week-ev") : null;
      if (!chip) return;
      const title = chip.querySelector(".ev-title");
      if (!title) return;
      const ov = title.scrollWidth - title.offsetWidth;
      if (ov <= 2) return;
      // +14px pour dépasser le fondu droit et voir jusqu'au dernier caractère
      title.style.setProperty("--title-ov", `-${ov + 14}px`);
      title.classList.add("scrolling");
      chip.classList.add("has-scrolling");
    }, true);
    document.addEventListener("mouseleave", e => {
      const chip = e.target && e.target.closest ? e.target.closest(".ev,.week-ev") : null;
      if (!chip) return;
      const title = chip.querySelector(".ev-title");
      if (!title) return;
      title.classList.remove("scrolling");
      title.style.removeProperty("--title-ov");
      chip.classList.remove("has-scrolling");
    }, true);

    // libellé de saison calculé (l'original avait « Saison 2026 – 2027 » en dur)
    const sl = document.getElementById("saisonLabel");
    if (sl) {
      const sy = this.today.getMonth() >= 6 ? this.today.getFullYear() : this.today.getFullYear() - 1;
      sl.textContent = `Saison ${sy} – ${sy + 1}`;
    }
    this._boot();
    this._scheduleMidnight();
  }

  /** Rafraîchit « aujourd'hui » au passage de minuit (écran laissé ouvert). */
  _scheduleMidnight() {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
    window.setTimeout(() => {
      this.today = new Date(); this.today.setHours(0,0,0,0);
      this._render();
      this._scheduleMidnight();
    }, next.getTime() - now.getTime());
  }



  async _boot() {
    if (this.scope === "private") return this._bootPrivate();
    const done = (rows) => {
      this.evts = this._norm(rows);
      this._buildFilters();
      this._render();
      this._checkHash();
    };
    try {
      const res = await fetch(this.apiBase + "events.php", { cache: "no-cache" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const rows = await res.json();
      done(Array.isArray(rows) ? rows : []);
      this._notice(this.evts.length ? "" : "Aucun événement publié pour le moment.");
    } catch (err) {
      done([]);
      this._notice("Impossible de charger le calendrier. Vérifie ta connexion puis recharge la page.");
    }
  }

  // ── Calendrier interne : session, login, flux privé ──────────────────────

  /** Démarrage de /private : état de session, puis login ou calendrier. */
  async _bootPrivate() {
    this._bindLogin();
    let role = null;
    try {
      const res = await fetch(this.apiBase + "auth.php", { cache: "no-store" });
      if (res.ok) {
        const j = await res.json();
        role = j && j.role ? j.role : null;
      }
    } catch (err) { /* hors ligne : l'écran de login le dira à la tentative */ }
    if (!role) { this._showLogin(); return; }
    await this._loadPrivate();
  }

  /** Charge le flux interne (public + privé) et affiche le calendrier. */
  async _loadPrivate() {
    this._showCalendar();
    const done = (rows) => {
      this.evts = this._norm(rows);
      this._buildFilters();
      this._render();
      this._checkHash();
    };
    try {
      const res = await fetch(this.apiBase + "events-private.php", { cache: "no-store" });
      if (res.status === 401) {
        this.evts = [];
        this._showLogin("Session expirée. Reconnecte-toi pour voir le calendrier interne.");
        return;
      }
      if (!res.ok) throw new Error("HTTP " + res.status);
      const rows = await res.json();
      done(Array.isArray(rows) ? rows : []);
      this._notice(this.evts.length ? "" : "Aucun événement enregistré pour le moment.");
    } catch (err) {
      done([]);
      this._notice("Impossible de charger le calendrier interne. Vérifie ta connexion puis recharge la page.");
    }
  }

  _bindLogin() {
    const btn = document.getElementById("loginBtn");
    const pw  = document.getElementById("pwInput");
    if (btn) btn.onclick = () => this._tryLogin();
    if (pw)  pw.addEventListener("keydown", e => { if (e.key === "Enter") this._tryLogin(); });
    const out = document.getElementById("logoutBtn");
    if (out) out.onclick = async () => {
      try {
        await fetch(this.apiBase + "auth.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "logout" }),
        });
      } catch (err) { /* déconnexion locale quoi qu'il arrive */ }
      this.evts = [];
      this._notice("");
      this._showLogin();
    };
  }

  async _tryLogin() {
    const pw = document.getElementById("pwInput"); if (!pw) return;
    const val = (pw.value || "").trim(); if (!val) return;
    const err = document.getElementById("loginErr");
    const fail = (msg) => {
      if (err) { err.textContent = msg; err.classList.add("show"); }
      pw.value = ""; pw.focus();
    };
    try {
      const res = await fetch(this.apiBase + "auth.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: val }),
      });
      if (res.status === 429) { fail("Trop de tentatives. Réessaie plus tard."); return; }
      if (!res.ok)            { fail("Mot de passe incorrect."); return; }
      const j = await res.json().catch(() => null);
      if (!j || !j.ok || !j.role) { fail("Mot de passe incorrect."); return; }
      if (err) { err.textContent = ""; err.classList.remove("show"); }
      pw.value = "";
      await this._loadPrivate();
    } catch (e) {
      fail("Connexion impossible. Vérifie ta connexion puis réessaie.");
    }
  }

  _showLogin(msg) {
    const ls = document.getElementById("loginScreen");
    const cw = document.getElementById("calWrap");
    if (cw) cw.style.display = "none";
    if (ls) ls.style.display = "";
    const err = document.getElementById("loginErr");
    if (err) {
      if (msg) { err.textContent = msg; err.classList.add("show"); }
      else     { err.textContent = ""; err.classList.remove("show"); }
    }
    const pw = document.getElementById("pwInput");
    if (pw) { pw.value = ""; pw.focus(); }
  }

  _showCalendar() {
    const ls = document.getElementById("loginScreen");
    const cw = document.getElementById("calWrap");
    if (ls) ls.style.display = "none";
    if (cw) cw.style.display = "";
    // l'en-tête mobile était masqué : sa hauteur (sticky) doit être remesurée
    if (this._syncTopH) this._syncTopH();
  }

  /** Bandeau d'information sous les filtres (vide = masqué). */
  _notice(msg) {
    let el = document.getElementById("calNotice");
    if (!el) {
      el = document.createElement("div");
      el.id = "calNotice";
      el.className = "cal-notice";
      const panel = document.getElementById("calPanel");
      if (panel && panel.parentNode) panel.parentNode.insertBefore(el, panel);
      else return;
    }
    el.textContent = msg;
    el.style.display = msg ? "" : "none";
  }





  _checkHash() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const ev = this.evts.find(e => this._idOf(e) === hash);
    if (ev) setTimeout(() => this._openModal(hash), 150);
  }

  _norm(rows) {
    return rows
      .filter(r => r && r.section && r.date && this.SECTIONS[String(r.section).trim()])
      .map(r => ({
        // id stable fourni par l'API (rec:{uuid}:{date} / ev:{uuid}) : corrige
        // les collisions de l'ancien id dérivé tronqué à 40 caractères.
        id:      String(r.id || "").trim(),
        section: String(r.section).trim(),
        // séance reportée ou annulée : le suffixe et la note sont générés à
        // l'affichage (mêmes libellés qu'avant, la donnée stockée reste propre)
        titre:   (r.titre||"Événement").trim() + (r.moved ? " (reporté)" : "") + (r.cancelled ? " (ANNULÉ)" : ""),
        date:    String(r.date).trim(),
        debut:   (r.debut||"").trim(),
        fin:     (r.fin||"").trim(),
        lieu:    (r.lieu||"").trim(),
        adresse: (r.adresse||"").trim(),
        type:    (r.type||"").trim(),
        domicile:(r.domicile||"").trim().toLowerCase(),
        cancelled: !!r.cancelled,
        motif:   (r.motif||"").trim(),
        // uniquement servi par le flux interne ('public' | 'prive')
        visibilite: (r.visibilite||"").trim(),
        notes:   (r.notes||"").trim()
                 || (r.cancelled ? ((r.motif||"").trim() || "Séance annulée") : "")
                 || (r.moved && r.original_date ? "Reporté du " + r.original_date : ""),
        arbitres:(r.arbitres||"").trim(),
      }))
      .sort((a,b) => (a.date+a.debut).localeCompare(b.date+b.debut));
  }

  /** Indexe les vacances et jours fériés par date ISO (fichier optionnel). */
  _buildSpeciaux(src) {
    const map = {};
    if (!src || typeof src !== "object") return map;
    const at = iso => (map[iso] || (map[iso] = {}));
    (Array.isArray(src.vacances) ? src.vacances : []).forEach(v => {
      if (!v || !v.from || !v.to) return;
      const end = new Date(String(v.to) + "T12:00");
      const d = new Date(String(v.from) + "T12:00");
      if (isNaN(d) || isNaN(end)) return;
      let first = true, guard = 0;
      while (d <= end && guard++ < 400) {
        const cur = at(this._isoOf(d));
        cur.vac = v.nom || "Vacances scolaires";
        if (first) { cur.vacStart = true; first = false; }
        d.setDate(d.getDate() + 1);
      }
    });
    (Array.isArray(src.feries) ? src.feries : []).forEach(f => {
      if (!f || !f.date) return;
      at(String(f.date).trim()).ferie = f.nom || "Jour férié";
    });
    return map;
  }

  /** { vac?, vacStart?, ferie? } pour une date ISO, ou null. */
  _spec(iso) { return (this.SPECIAUX && this.SPECIAUX[iso]) || null; }

  /** Classe de teinte à poser sur la cellule / colonne / ligne du jour. */
  _specCls(sp) { return sp ? (sp.ferie ? " day-ferie" : (sp.vac ? " day-vac" : "")) : ""; }

  /** Étiquettes discrètes : le férié, et le premier jour d'une période. */
  _specTags(sp) {
    if (!sp) return "";
    let out = "";
    if (sp.ferie) out += `<span class="daytag daytag-ferie">${this._esc(sp.ferie)}</span>`;
    if (sp.vac && sp.vacStart) out += `<span class="daytag daytag-vac">${this._esc(sp.vac)}</span>`;
    return out;
  }

  /** Vue semaine : une étiquette sous la date, tous les jours concernés. */
  _weekSpecTag(sp) {
    if (!sp) return "";
    if (sp.ferie) return `<span class="daytag daytag-ferie">${this._esc(sp.ferie)}</span>`;
    if (sp.vac)   return `<span class="daytag daytag-vac">${this._esc(sp.vac)}</span>`;
    return "";
  }

  /** Texte de tooltip pour les vues compactes (saison). */
  _specTitle(sp) {
    if (!sp) return "";
    return [sp.ferie, sp.vac].filter(Boolean).join(" · ");
  }

  _buildFilters() {
    const box = document.getElementById("filters"); if(!box) return;
    box.innerHTML = "";
    this._chipBtns = {};
    const keys = Object.keys(this.SECTIONS);
    for (const [key, s] of Object.entries(this.SECTIONS)) {
      const b = document.createElement("button");
      b.className = "chip";
      b.setAttribute("aria-pressed", "true");
      b.title = "Clic : voir uniquement cette section · Maj+clic : ajouter / retirer";
      b.innerHTML = `<span class="dot" style="background:${s.hex}"></span>${s.label}`;
      b.onclick = (ev) => {
        if (ev.shiftKey || ev.metaKey || ev.ctrlKey) {
          if (this.active.has(key) && this.active.size > 1) this.active.delete(key);
          else this.active.add(key);
        } else if (this.active.size === 1 && this.active.has(key)) {
          this.active = new Set(keys);            // re-clic sur le solo → tout revient
        } else {
          this.active = new Set([key]);           // clic simple → isole la section
        }
        this._syncFilters();
        this._render();
      };
      this._chipBtns[key] = b;
      box.appendChild(b);
    }
    this._buildLegend(box);
  }

  /** Légende non cliquable, à la suite des filtres de section. */
  _buildLegend(box) {
    const items = [`<span class="legend-item"><span class="dot dot-cancelled"></span>Annulé</span>`];
    if (this.hasSpeciaux) {
      items.push(`<span class="legend-item"><span class="dot dot-vac"></span>Vacances scolaires</span>`);
      items.push(`<span class="legend-item"><span class="dot dot-ferie"></span>Jour férié</span>`);
    }
    if (this.scope === "private") {
      items.push(`<span class="legend-item"><span class="dot dot-priv"></span>Événement privé</span>`);
    }
    const wrap = document.createElement("span");
    wrap.className = "legend";
    wrap.innerHTML = `<span class="legend-sep" aria-hidden="true"></span>` + items.join("");
    box.appendChild(wrap);
  }

  _syncFilters() {
    if (!this._chipBtns) return;
    const solo = this.active.size === 1;
    for (const [key, b] of Object.entries(this._chipBtns)) {
      const on = this.active.has(key);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.classList.toggle("chip-solo", on && solo);
    }
  }

  _shown() { return this.evts.filter(e => this.active.has(e.section)); }

  _render() {
    // Period label
    let label = "";
    if (this.view === "semaine") {
      const mon = this._getMonday(this.cursor);
      const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
      if (mon.getMonth() === sun.getMonth()) {
        label = `${mon.getDate()} – ${sun.getDate()} ${this.MONTHS[mon.getMonth()]} ${mon.getFullYear()}`;
      } else {
        const MAB = ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
        const ab = m => MAB[m];
        label = `${mon.getDate()} ${ab(mon.getMonth())} – ${sun.getDate()} ${ab(sun.getMonth())} ${sun.getFullYear()}`;
      }
    } else if (this.view === "saison") {
      const sy = this.cursor.getMonth() >= 6 ? this.cursor.getFullYear() : this.cursor.getFullYear()-1;
      label = `Saison ${sy} – ${sy+1}`;
    } else {
      label = `${this.MONTHS[this.cursor.getMonth()]} ${this.cursor.getFullYear()}`;
    }
    const lbl = document.getElementById("periodLabel");
    if (lbl) lbl.textContent = this._cap(label);

    // View toggles
    ["mois","semaine","agenda","saison"].forEach(v => {
      const btn = document.getElementById("view" + this._cap(v));
      if (btn) btn.setAttribute("aria-pressed", String(this.view === v));
      const nb = document.getElementById("nav" + v.charAt(0).toUpperCase() + v.slice(1));
      if (nb) nb.setAttribute("aria-current", String(this.view === v));
    });
    this._renderNextCard();

    // Render calendar
    const root = document.getElementById("calRoot"); if(!root) return;
    const panel = document.getElementById("calPanel");
    const fit = this.view === "mois" && window.innerWidth > 980 && window.innerHeight > 620;
    if (panel) panel.classList.toggle("fitmonth", fit);
    const mainEl = document.querySelector(".main");
    if (mainEl) {
      mainEl.classList.toggle("fitmain", fit);
      if (fit) {
        mainEl.style.removeProperty("--fit-h");
        const top = mainEl.getBoundingClientRect().top + window.scrollY;
        const avail = window.innerHeight - top - 5;
        mainEl.style.setProperty("--fit-h", avail + "px");
        // hauteur d'une rangée -> combien de chips tiennent réellement sous le numéro
      } else { mainEl.style.removeProperty("--fit-h"); this._evCap = 3; }
    }
    if (!this.mobile) {
      const seEl = document.querySelector(".tb-season");
      if (seEl) seEl.style.display = this.view === "saison" ? "none" : "";
    }
    if (!this._fitBound) {
      this._fitBound = true;
      // throttlé via rAF : l'original re-rendait tout le DOM à chaque pixel de resize
      window.addEventListener("resize", () => {
        if (this._rzRaf) return;
        this._rzRaf = requestAnimationFrame(() => { this._rzRaf = 0; this._render(); });
      });
    }
    if      (this.view === "mois")    { root.innerHTML = this._monthHTML(); this._fitEvCap(fit); }
    else if (this.view === "semaine") root.innerHTML = this._weekHTML();
    else if (this.view === "saison")  root.innerHTML = this._saisonHTML();
    else                              root.innerHTML = this._agendaHTML();
    this._bindEvBtns();
  }

  _renderNextCard() {
    const todayIso = this._isoOf(this.today);
    // aujourd'hui : ne proposer que ce qui n'est pas déjà passé (les événements
    // sans heure restent affichés : impossible de savoir s'ils sont finis)
    const now = new Date();
    const nowHM = String(now.getHours()).padStart(2,"0") + ":" + String(now.getMinutes()).padStart(2,"0");
    // une séance annulée n'est plus « la prochaine »
    const upcoming = this._shown().filter(e => !e.cancelled).filter(e =>
        e.date > todayIso || (e.date === todayIso && (!e.debut || e.debut >= nowHM)))
      .sort((a, b) => (a.date + (a.debut || "")).localeCompare(b.date + (b.debut || "")));
    const isTrain = e => /entra|séance|seance|stage|camp|combine/i.test(e.type || "") || /entr\./i.test(e.titre || "");
    const isPlay  = e => /match|tournoi|finale|scrimmage|barrage|coupe|champ/i.test((e.type || "") + " " + (e.titre || ""));
    const fill = (idT, idW, ev) => {
      const t = document.getElementById(idT), w = document.getElementById(idW);
      const sc = document.getElementById(idT.replace("Title", "Sec"));
      if (!t || !w) return;
      if (!ev) { t.textContent = "Rien de prévu"; w.textContent = ""; if (sc) sc.innerHTML = ""; t.style.removeProperty("--sc-accent"); return; }
      const d = new Date(ev.date + "T12:00");
      const sec = this.SECTIONS[ev.section];
      t.textContent = ev.titre;
      t.style.setProperty("--sc-accent", sec ? sec.hex : "var(--gold)");
      if (sc) sc.innerHTML = sec ? `<span class="sc-dot" style="background:${sec.hex}"></span>${this._esc(sec.label)}` : "";
      w.textContent = `${["lun.","mar.","mer.","jeu.","ven.","sam.","dim."][(d.getDay()+6)%7]} ${d.getDate()} ${this.MONTHS[d.getMonth()].toLowerCase()}${ev.debut ? " · " + ev.debut : ""}`;
    };
    const trainCard = document.getElementById("nextTrain"), matchCard = document.getElementById("nextMatch");
    // Vie du club isolée : une seule carte "Prochain évènement"
    const clubOnly = this.active.size === 1 && this.active.has("club");
    const soloSport = this.active.size === 1 && !this.active.has("club");
    const lab = trainCard && trainCard.querySelector(".sc-lab");
    if (matchCard) matchCard.style.display = clubOnly ? "none" : "";
    if (clubOnly) {
      if (lab) lab.textContent = "Prochain évènement";
      fill("ntTitle", "ntWhen", upcoming[0]);
      return;
    }
    if (soloSport) {
      // une seule section sportive isolée : son prochain entraînement
      if (lab) lab.textContent = "Prochain entraînement";
      fill("ntTitle", "ntWhen", upcoming.find(e => isTrain(e) && !isPlay(e)));
    } else {
      // plusieurs sections : pas de favoritisme, on montre la vie du club
      if (lab) lab.textContent = "Prochain évènement vie de club";
      fill("ntTitle", "ntWhen", upcoming.find(e => e.section === "club"));
    }
    fill("nmTitle", "nmWhen", upcoming.find(isPlay));
  }

  _syncTabbar() {
    document.querySelectorAll(".tabbtn").forEach(b => {
      if (b.dataset.view === this.view) b.setAttribute("aria-current", "true");
      else b.removeAttribute("aria-current");
    });
  }

  _setView(v) {
    this.view = v;
    if (v === "semaine") {
      // garder une semaine cohérente : celle d'aujourd'hui si le mois affiché est le mois courant
      const sameMonth = this.cursor.getFullYear() === this.today.getFullYear()
                     && this.cursor.getMonth() === this.today.getMonth();
      if (sameMonth) this.cursor = new Date(this.today);
      else if (this.cursor.getDate() === 1) this.cursor = new Date(this.cursor.getFullYear(), this.cursor.getMonth(), 1);
    } else if (v !== "saison") {
      this.cursor = new Date(this.cursor.getFullYear(), this.cursor.getMonth(), 1);
    }
    this._syncTabbar();
    this._render();
    if (this.mobile) {
      const se = document.querySelector(".tb-season");
      if (se) se.style.display = v === "saison" ? "none" : "";
      window.scrollTo(0, 0);
    }
  }

  _nav(dir) {
    if (this.view === "semaine") {
      const d = new Date(this.cursor); d.setDate(d.getDate() + dir * 7); this.cursor = d;
    } else if (this.view === "saison") {
      this.cursor = new Date(this.cursor.getFullYear() + dir, this.cursor.getMonth(), 1);
    } else {
      this.cursor = new Date(this.cursor.getFullYear(), this.cursor.getMonth() + dir, 1);
    }
    this._render();
  }

  _goToday() {
    this.cursor = new Date(this.today);
    if (this.view !== "semaine") this.cursor = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    this._render();
  }

  _getMonday(d) {
    const mon = new Date(d);
    mon.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    mon.setHours(0,0,0,0);
    return mon;
  }

  _evByDate() {
    const m = {};
    this._shown().forEach(e => { (m[e.date] = m[e.date] || []).push(e); });
    return m;
  }

  // Mesure la hauteur de case réellement rendue et ajuste le nombre de chips
  _fitEvCap(fit) {
    if (!fit) { if (this._evCap !== 3) { this._evCap = 3; } return; }
    const cell = document.querySelector(".cal-grid .cell");
    const num  = cell && cell.querySelector(".daynum");
    if (!cell || !num) return;
    const cellBox = cell.getBoundingClientRect();
    const padBottom = parseFloat(getComputedStyle(cell).paddingBottom) || 6;
    // espace sous le numéro du jour, à l'intérieur de la case
    const usable = cellBox.bottom - padBottom - num.getBoundingClientRect().bottom;
    const CHIP = 26, GAP = 3, MORE = 15.5;
    let cap = Math.floor((usable + GAP) / (CHIP + GAP));
    if (cap * CHIP + cap * GAP + MORE > usable) cap -= 1;   // place du "+N autres"
    cap = Math.max(0, Math.min(4, cap));
    if (cap !== this._evCap && !this._capPass) {
      this._capPass = true;
      this._evCap = cap;
      const root = document.getElementById("calRoot");
      if (root) root.innerHTML = this._monthHTML();
      this._capPass = false;
    }
  }

  _monthHTML() {
    const y = this.cursor.getFullYear(), mo = this.cursor.getMonth();
    const first = new Date(y, mo, 1);
    const start = new Date(y, mo, 1 - ((first.getDay()+6)%7));
    const map = this._evByDate();
    // Nombre exact de lignes (4, 5 ou 6 selon le mois) : pas de ligne vide inutile
    const offset = (first.getDay()+6)%7;
    const daysInMonth = new Date(y, mo+1, 0).getDate();
    const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
    const colCount = [0,0,0,0,0,0,0];
    for (let i = 0; i < totalCells; i++) {
      const dd = new Date(start); dd.setDate(start.getDate() + i);
      if (dd.getMonth() === mo) colCount[i % 7] += (map[this._isoOf(dd)] || []).length;
    }
    let cells = `<div class="weeknum-cell weeknum-head"></div>` + this.WD.map((d, i) =>
      `<div class="dayhead">${d}${colCount[i] ? `<span class="dh-n">· ${colCount[i]}</span>` : ""}</div>`).join("");
    for (let i = 0; i < totalCells; i++) {
      if (i % 7 === 0) {
        const wd = new Date(start); wd.setDate(start.getDate() + i);
        cells += `<div class="weeknum-cell">S${this._isoWeek(wd)}</div>`;
      }
      const d = new Date(start); d.setDate(start.getDate() + i);
      const iso = this._isoOf(d), out = d.getMonth() !== mo, isT = d.getTime() === this.today.getTime();
      const evs = map[iso] || [];
      const sp = this._spec(iso);
      let inner = `<span class="daynum">${String(d.getDate()).padStart(2, "0")}</span>`;
      if (sp && !out) inner += this._specTags(sp);
      if (evs.length) {
        const cap = this._evCap === 0 ? 0 : (this._evCap || 3);
        let list = evs.slice(0, cap).map(e => this._chip(e)).join("");
        if (evs.length > cap) {
          const extra = evs.length - cap;
          const lab = cap === 0 ? `${extra} évén.` : `+${extra} autre${extra > 1 ? "s" : ""}`;
          list += `<button class="more" data-action="more">${lab}</button>`;
        }
        inner += `<div class="cell-evs">${list}</div>`;
      } else if (!out) {
        inner += `<span class="cell-none">Aucun</span>`;
      }
      const isEmpty = !evs.length && !out && !isT;
      const isPast = d.getTime() < this.today.getTime() && !isT;
      const spCls = out ? "" : this._specCls(sp);
      const spTtl = out ? "" : this._specTitle(sp);
      cells += `<div class="cell${out?" out":""}${isT?" today":""}${isEmpty?" cell-empty":""}${isPast?" cell-past":""}${spCls}"${spTtl?` title="${this._esc(spTtl)}"`:""}>${inner}</div>`;
    }
    return `<div class="cal-grid">${cells}</div>`;
  }

  _weekHTML() {
    const mon = this._getMonday(this.cursor);
    let html = '<div class="week-grid">';
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon); d.setDate(mon.getDate() + i);
      const iso = this._isoOf(d), isT = d.getTime() === this.today.getTime();
      const evs = this._shown().filter(e => e.date === iso);
      const isPast = d.getTime() < this.today.getTime() && !isT;
      const sp = this._spec(iso);
      const spTtl = this._specTitle(sp);
      html += `<div class="week-col${isPast ? " week-past" : ""}${this._specCls(sp)}"${spTtl?` title="${this._esc(spTtl)}"`:""}>
        <div class="week-head${isT ? " today-col" : ""}">
          <span class="week-wd">${this.WD[i]}</span>
          <span class="week-num${isT ? " today-num" : ""}">${d.getDate()}</span>
          <span class="week-mo">${this.MONTHS[d.getMonth()].toLowerCase()}</span>
          ${sp ? this._weekSpecTag(sp) : ""}
        </div>
        <div class="week-evs">`;
      if (!evs.length) html += `<span class="week-empty">${this.mobile ? "Rien de prévu" : "·"}</span>`;
      else evs.forEach(e => { html += this._weekChip(e); });
      html += `</div></div>`;
    }
    return html + "</div>";
  }

  _agendaHTML() {
    const y = this.cursor.getFullYear(), mo = this.cursor.getMonth();
    const list = this._shown().filter(e => {
      const d = new Date(e.date + "T00:00");
      return d.getFullYear() === y && d.getMonth() === mo;
    });
    if (!list.length) return `<div class="empty">Aucun événement ce mois-ci pour les sections affichées.</div>`;
    const byDay = {};
    list.forEach(e => { (byDay[e.date] = byDay[e.date] || []).push(e); });
    let html = '<div class="agenda">';
    Object.keys(byDay).sort().forEach(iso => {
      const d = new Date(iso + "T00:00"), isT = d.getTime() === this.today.getTime();
      html += `<div class="agenda-day">
        <div class="agenda-date${isT ? " is-today" : ""}">
          <div class="dnum">${d.getDate()}</div>
          <div class="dwd">${this.WD[(d.getDay()+6)%7]}</div>
        </div>
        <div class="agenda-items">`;
      byDay[iso].forEach(e => {
        const s = this.SECTIONS[e.section];
        const time = e.debut ? (e.fin ? `${e.debut}–${e.fin}` : e.debut) : "-";
        const hav = e.domicile === "oui" ? `<span class="a-tag badge-dom">Domicile</span>`
                  : e.domicile === "non" ? `<span class="a-tag badge-ext">Extérieur</span>` : "";
        const priv = this._isPriv(e) ? `<span class="a-tag badge-priv">Privé</span>` : "";
        html += `<div class="arow${e.cancelled?" ev-cancelled":""}" data-id="${this._idOf(e)}">
          <span class="bar" style="background:${this._evHex(e)}"></span>
          <span class="a-time">${time}</span>
          <div class="a-body">
            <div class="a-title">${this._esc(e.titre)}${hav}${priv}</div>
            <div class="a-meta">${s.label}${e.lieu ? " · "+this._esc(e.lieu) : ""}${e.adresse ? ", "+this._esc(e.adresse) : ""}</div>
          </div>
        </div>`;
      });
      html += "</div></div>";
    });
    return html + "</div>";
  }

  /** Gris commun à toutes les sections : le code visuel de l'annulation. */
  _evHex(e) { return e.cancelled ? "#8a8f98" : this.SECTIONS[e.section].hex; }

  _isPriv(e) { return e.visibilite === "prive"; }

  _chip(e) {
    const hex = this._evHex(e);
    const priv = this._isPriv(e);
    return `<button class="ev${e.cancelled?" ev-cancelled":""}${priv?" ev-priv-on":""}" style="--ev-bg:${hex}" data-id="${this._idOf(e)}"><span class="ev-dot" style="background:${hex}"></span><span class="ev-scroll-track"><span class="ev-title">${this._esc(e.titre)}</span></span>${e.debut?`<span class="ev-time">${e.debut}</span>`:""}${priv?`<span class="ev-priv">Privé</span>`:""}</button>`;
  }

  _weekChip(e) {
    const s = this.SECTIONS[e.section];
    const hex = this._evHex(e);
    // fond gris forcé quand c'est annulé : plus de couleur de section, donc
    // plus de variante « gold » (texte sombre) non plus
    const gold = s.light && !e.cancelled;
    const priv = this._isPriv(e);
    return `<button class="week-ev${gold?" gold":""}${e.cancelled?" ev-cancelled":""}${priv?" ev-priv-on":""}" style="background:${hex};--ev-bg:${hex}" data-id="${this._idOf(e)}">${e.debut?`<div class="ev-time">${e.debut}${e.fin?"–"+e.fin:""}</div>`:""}<span class="ev-scroll-track"><div class="ev-title">${this._esc(e.titre)}</div></span>${priv?`<span class="ev-priv">Privé</span>`:""}</button>`;
  }

  _bindEvBtns() {
    // portée limitée au calendrier (l'original ratissait tout le document)
    const root = document.getElementById("calRoot") || document;
    root.querySelectorAll("[data-id]").forEach(el => {
      el.onclick = () => this._openModal(el.getAttribute("data-id"));
    });
    root.querySelectorAll("[data-action='more']").forEach(b => {
      b.onclick = () => this._setView("agenda");
    });
  }

  _openModal(id) {
    const e = this.evts.find(x => this._idOf(x) === id); if(!e) return;
    const s = this.SECTIONS[e.section];
    const top = document.getElementById("mTop");
    top.style.background = s.hex;
    top.classList.toggle("gold", s.light);
    document.getElementById("mSec").textContent = s.label;
    document.getElementById("mTitle").textContent = e.titre;

    // pastilles d'état (annulé / privé) sous le nom de section
    const badges = document.getElementById("mBadges");
    if (badges) {
      let b = "";
      if (e.cancelled)     b += `<span class="badge-cancel">ANNULÉ</span>`;
      if (this._isPriv(e)) b += `<span class="badge-priv-modal">PRIVÉ</span>`;
      badges.innerHTML = b;
      badges.style.display = b ? "" : "none";
    }

    const d = new Date(e.date + "T00:00");
    const dateStr = d.toLocaleDateString("fr-FR", {weekday:"long",day:"numeric",month:"long",year:"numeric"});
    const time = e.debut ? (e.fin ? `${e.debut} – ${e.fin}` : `À partir de ${e.debut}`) : "Horaire à préciser";
    const hav = e.domicile === "oui" ? `<span class="badge-hav badge-dom">Domicile</span>`
              : e.domicile === "non" ? `<span class="badge-hav badge-ext">Extérieur</span>` : "";

    let body = "";
    const ico = f => `<img src="${this.assetBase}emojis/${f}.webp" alt="">`;
    const cancelNote = e.cancelled ? (e.motif || "Séance annulée") : "";
    body += this._row(ico("calendrier"), "Date",    this._cap(dateStr));
    body += this._row(ico("horloge"),   "Horaire", time);
    if (e.cancelled)         body += this._row(ico("dossier"), "Motif", this._esc(cancelNote));
    if (e.lieu || e.adresse) body += this._row(ico("drapeau"), "Lieu", this._esc([e.lieu, e.adresse].filter(Boolean).join(", ")));
    if (e.type || hav)       body += this._row(ico("ballon"), "Type", `${this._esc(e.type)} ${hav}`);
    if (e.arbitres)          body += this._row(ico("arbitre"), "Arbitres", this._esc(e.arbitres));
    // la note générée pour une annulation est déjà affichée en « Motif »
    if (e.notes && e.notes !== cancelNote) body += this._row(ico("dossier"), "Infos", this._esc(e.notes));
    document.getElementById("mBody").innerHTML = body;

    const gcalBtn = document.getElementById("mGcal");
    const icsBtn  = document.getElementById("mIcs");
    // rien à ajouter dans son agenda quand la séance est annulée
    if (gcalBtn) { gcalBtn.href = this._gcalURL(e); gcalBtn.style.display = e.cancelled ? "none" : ""; }
    if (icsBtn)  { icsBtn.onclick = () => this._downloadICS(e); icsBtn.style.display = e.cancelled ? "none" : ""; }

    const sh = document.getElementById("mShare");
    if (sh) sh.onclick = () => {
      const url = location.href.split("#")[0] + "#" + id;
      const fallback = () => {
        history.replaceState(null, "", "#" + id);
        sh.textContent = "✓ URL mise à jour";
        setTimeout(() => sh.textContent = "🔗 Partager", 2200);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          sh.textContent = "✓ Lien copié !";
          setTimeout(() => sh.textContent = "🔗 Partager", 2200);
        }).catch(fallback);
      } else {
        fallback();
      }
    };

    // replaceState : ne pas empiler une entrée d'historique par fiche ouverte
    history.replaceState(null, "", "#" + id);
    document.getElementById("overlay").classList.add("open");
    // accessibilité : focus dans la modale + piège Tab, restitué à la fermeture
    this._modalOpener = document.activeElement;
    const modal = document.querySelector("#overlay .modal") || document.getElementById("overlay");
    const closeBtn = document.getElementById("mClose");
    if (closeBtn) closeBtn.focus();
    if (!this._trapBound) {
      this._trapBound = true;
      document.addEventListener("keydown", ev => {
        const ov = document.getElementById("overlay");
        if (ev.key !== "Tab" || !ov || !ov.classList.contains("open")) return;
        const f = ov.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])");
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
        else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
      });
    }
  }

  _closeModal() {
    const ov = document.getElementById("overlay");
    if (!ov.classList.contains("open")) return;
    ov.classList.remove("open");
    history.replaceState(null, "", location.pathname + location.search);
    // restitution du focus à l'élément qui a ouvert la fiche
    if (this._modalOpener && this._modalOpener.focus) this._modalOpener.focus();
    this._modalOpener = null;
  }

  _row(ic, lbl, val) {
    return `<div class="frow"><span class="ic">${ic}</span><span class="lbl">${lbl}</span><span>${val}</span></div>`;
  }

  _gcalURL(e) {
    const p = new URLSearchParams({
      action:"TEMPLATE", text:e.titre,
      dates:`${this._dt(e,"s")}/${this._dt(e,"e")}`,
      details:[e.type, e.notes].filter(Boolean).join(" : "),
      location:[e.lieu, e.adresse].filter(Boolean).join(", "),
    });
    return "https://calendar.google.com/calendar/render?" + p.toString();
  }

  _downloadICS(e) {
    // RFC 5545 : DTSTAMP obligatoire + échappement des , ; \ et retours ligne
    const esc = s => String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
    const p2 = n => String(n).padStart(2, "0");
    const n = new Date();
    const dtstamp = `${n.getUTCFullYear()}${p2(n.getUTCMonth()+1)}${p2(n.getUTCDate())}T${p2(n.getUTCHours())}${p2(n.getUTCMinutes())}${p2(n.getUTCSeconds())}Z`;
    const ics = [
      "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Pionniers de Touraine//Calendrier//FR",
      "BEGIN:VEVENT","UID:"+this._idOf(e)+"@pionniers-touraine",
      "DTSTAMP:"+dtstamp,
      "DTSTART:"+this._dt(e,"s"),"DTEND:"+this._dt(e,"e"),
      "SUMMARY:"+esc(e.titre),
      "LOCATION:"+esc([e.lieu,e.adresse].filter(Boolean).join(", ")),
      "DESCRIPTION:"+esc([e.type,e.notes].filter(Boolean).join(" - ")),
      "END:VEVENT","END:VCALENDAR"
    ].join("\r\n");
    const a = document.createElement("a");
    const url = URL.createObjectURL(new Blob([ics], {type:"text/calendar"}));
    a.href = url;
    a.download = e.titre.replace(/[^\w]+/g,"_") + ".ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  _dt(e, which) {
    const start = e.debut || "00:00";
    const t = (which === "e" ? (e.fin || this._h2(e.debut)) : e.debut) || "00:00";
    let date = e.date;
    // fin ≤ début (séance passant minuit, ou +2h ayant bouclé) → jour suivant
    if (which === "e" && t <= start) {
      const nd = new Date(e.date + "T12:00");
      nd.setDate(nd.getDate() + 1);
      date = this._isoOf(nd);
    }
    return date.replace(/-/g,"") + "T" + t.replace(":","") + "00";
  }

  _h2(hhmm) {
    if (!hhmm) return "01:00";
    let [h, m] = hhmm.split(":").map(Number);
    h = (h + 2) % 24;
    return String(h).padStart(2,"0") + ":" + String(m).padStart(2,"0");
  }

  _isoWeek(d) {
    const date = new Date(d); date.setHours(0,0,0,0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const w1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date - w1) / 86400000 - 3 + (w1.getDay() + 6) % 7) / 7);
  }

  _fmtWeek(s, e) {
    const M = ['jan','fév','mar','avr','mai','jun','jui','aoû','sep','oct','nov','déc'];
    return s.getMonth() === e.getMonth()
      ? `${s.getDate()} – ${e.getDate()} ${M[s.getMonth()]}`
      : `${s.getDate()} ${M[s.getMonth()]}. – ${e.getDate()} ${M[e.getMonth()]}.`;
  }

  _saisonHTML() {
    // Saison de juillet (année sy) à juin (sy+1), comme le planning du manager
    const sy = this.cursor.getMonth() >= 6 ? this.cursor.getFullYear() : this.cursor.getFullYear()-1;
    const monthsOrder = [
      [6,sy],[7,sy],[8,sy],[9,sy],[10,sy],[11,sy],
      [0,sy+1],[1,sy+1],[2,sy+1],[3,sy+1],[4,sy+1],[5,sy+1]
    ];
    const DL = ['D','L','M','M','J','V','S']; // lettre du jour (getDay 0=Dim)
    const map = this._evByDate();

    let html = '<div class="saison-grid">';
    // mobile : ne pas afficher les mois déjà écoulés de la saison en cours
    const tY = this.today.getFullYear(), tM = this.today.getMonth();
    const visible = this.mobile ? monthsOrder.filter(([mo, yr]) => yr > tY || (yr === tY && mo >= tM)) : monthsOrder;
    (visible.length ? visible : monthsOrder).forEach(([mo, yr]) => {
      const daysInMonth = new Date(yr, mo+1, 0).getDate();
      html += `<div class="smonth">
        <div class="smonth-head">${this._cap(this.MONTHS[mo])} <span class="smonth-yr">${String(yr).slice(2)}</span></div>
        <div class="sdays">`;
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(yr, mo, day);
        const iso = this._isoOf(d);
        const dow = d.getDay();
        const isWE = dow === 0 || dow === 6;
        const isT = d.getTime() === this.today.getTime();
        const isPast = d.getTime() < this.today.getTime() && !isT;
        const evs = map[iso] || [];
        const weekBadge = dow === 1 ? `<span class="sweek">S${this._isoWeek(d)}</span>` : `<span class="sweek"></span>`;
        let chips = '';
        evs.forEach(e => {
          const s = this.SECTIONS[e.section];
          const hex = this._evHex(e);
          const gold = s.light && !e.cancelled;
          const short = this._shortLabel(e);
          const ttl = this._esc(e.titre) + (e.cancelled ? ' (annulé)' : '');
          chips += `<button class="schip${gold?' gold':''}${e.cancelled?' ev-cancelled':''}${this._isPriv(e)?' ev-priv-on':''}" style="background:${hex};--ev-bg:${hex}" data-id="${this._idOf(e)}" title="${ttl}">${this._esc(short)}</button>`;
          if (this._isPriv(e)) chips += `<span class="schip schip-priv" title="Événement privé">Privé</span>`;
        });
        const sp = this._spec(iso);
        const spTtl = this._specTitle(sp);
        const rowCls = ['sday', isWE?'sday-we':'', isT?'sday-today':'', isPast?'sday-past':'',
                        this._specCls(sp).trim()].filter(Boolean).join(' ');
        html += `<div class="${rowCls}"${spTtl?` title="${this._esc(spTtl)}"`:''}>
          ${weekBadge}
          <span class="snum">${day}</span>
          <span class="sletter">${DL[dow]}</span>
          <div class="schips">${chips}</div>
        </div>`;
      }
      html += `</div></div>`;
    });
    return html + '</div>';
  }

  _shortLabel(e) {
    // Étiquette courte pour la grille annuelle
    const t = e.type || '';
    if (t === 'Entraînement') return 'Entr.';
    if (t === 'Séance') return 'École';
    if (e.titre.length > 16) return e.titre.slice(0, 15) + '…';
    return e.titre;
  }

  _isoOf(d) {
    return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
  }

  _idOf(e) {
    // id stable de l'API en priorité ; repli sur l'ancienne dérivation
    if (e.id) return e.id.replace(/[^\w:-]+/g, "");
    return (e.date + e.debut + e.section + e.titre).replace(/[^\w]+/g,"").slice(0, 40);
  }

  _esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }

  _cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }


}

document.addEventListener("DOMContentLoaded", () => {
  new PionniersCalendrier(document.body.dataset.variant === "mobile").init();
});
})();
