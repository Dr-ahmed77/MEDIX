// ── DATE ──
const d = new Date();
document.getElementById('tbDate').textContent = d.toLocaleDateString('fr-DZ', { day:'numeric', month:'short', year:'numeric' });

// ── NAVIGATION ──
function goto(pageId, navEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
  if (navEl) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    navEl.classList.add('active');
  }
}

function gotoYear(n, el) {
  goto('years', null);
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
}

function setQcmYear(n) {
  goto('qcm', null);
  const btns = document.querySelectorAll('.qcm-year-btn');
  btns.forEach((b,i) => { b.classList.toggle('active', i === n-1); });
  renderQcm(n);
}

function setFcYear(n) {
  goto('flashcards', null);
  const label = n + 'A';
  document.querySelectorAll('.fc-f').forEach(b => {
    b.classList.toggle('on', b.textContent.includes(n + 'ème') || b.textContent.includes(n + 'ère') || b.textContent === 'Toutes');
    if (b.textContent.includes(n+'ème') || b.textContent.includes(n+'ère')) { b.classList.add('on'); }
    else if (b.textContent !== 'Toutes') b.classList.remove('on');
  });
  filterFcByYear(label);
}

// ── QCM DATA ──
const qcmData = {
  1: [
    { mat:'Anatomie', q:'Combien de vertèbres compose la colonne vertébrale humaine ?', opts:['24','26','33','31'], ans:2, expl:'La colonne vertébrale comprend 33 vertèbres : 7 cervicales, 12 thoraciques, 5 lombaires, 5 sacrées (fusionnées) et 4 coccygiennes (fusionnées).' },
    { mat:'Biologie', q:'Quelle est la durée de vie approximative d\'un globule rouge ?', opts:['30 jours','60 jours','90 jours','120 jours'], ans:3, expl:'Les globules rouges (érythrocytes) ont une durée de vie d\'environ 120 jours, après quoi ils sont détruits par la rate et le foie.' },
    { mat:'Chimie', q:'Quel est le pH normal du sang artériel ?', opts:['7.0 – 7.2','7.35 – 7.45','7.5 – 7.6','6.8 – 7.0'], ans:1, expl:'Le pH normal du sang artériel est de 7.35 à 7.45. En dessous = acidose, au-dessus = alcalose.' },
  ],
  2: [
    { mat:'Physiologie', q:'Quelle structure produit l\'insuline ?', opts:['Cellules alpha du pancréas','Cellules bêta du pancréas','Cellules delta du pancréas','Foie'], ans:1, expl:'L\'insuline est produite par les cellules bêta des îlots de Langerhans du pancréas en réponse à une hyperglycémie.' },
    { mat:'Biochimie', q:'Le cycle de Krebs se déroule dans :', opts:['Cytoplasme','Noyau','Mitochondrie','Réticulum endoplasmique'], ans:2, expl:'Le cycle de Krebs (cycle de l\'acide citrique) se déroule dans la matrice mitochondriale.' },
  ],
  3: [
    { mat:'Pharmacologie', q:'L\'antidote de la warfarine est :', opts:['Naloxone','Vitamine K','Flumazénil','Protamine'], ans:1, expl:'La vitamine K (phytoménadione) est l\'antidote spécifique de la warfarine (anticoagulant AVK). Le plasma frais congelé est utilisé en urgence.' },
    { mat:'Sémiologie', q:'Le signe de Murphy positif oriente vers :', opts:['Appendicite aiguë','Cholécystite aiguë','Occlusion intestinale','Péritonite'], ans:1, expl:'Le signe de Murphy est une douleur à la palpation de l\'hypochondre droit lors de l\'inspiration profonde, caractéristique de la cholécystite aiguë.' },
  ],
  4: [
    { mat:'Médecine Interne', q:'Quel médicament est le traitement de première intention dans l\'HTA essentielle ?', opts:['Bêta-bloquants','IEC ou ARA2','Diurétiques de l\'anse','Digitaliques'], ans:1, expl:'Les IEC (Inhibiteurs de l\'Enzyme de Conversion) ou ARA2 sont le traitement de première intention de l\'HTA essentielle selon les recommandations actuelles.' },
  ],
  5: [
    { mat:'Gynécologie', q:'La pré-éclampsie est définie par :', opts:['HTA + protéinurie après 20 SA','HTA seule après 20 SA','Protéinurie seule','HTA avant 20 SA'], ans:0, expl:'La pré-éclampsie est définie par une HTA (≥140/90 mmHg) associée à une protéinurie (≥0.3g/24h) apparaissant après 20 semaines d\'aménorrhée.' },
  ],
  6: [
    { mat:'Résidanat', q:'Devant un AVC ischémique, la thrombolyse est indiquée dans les :', opts:['2 heures','4h30','6 heures','12 heures'], ans:1, expl:'La thrombolyse par rtPA est indiquée dans les 4h30 suivant le début des symptômes d\'un AVC ischémique, après exclusion des contre-indications.' },
  ],
};
let qcmYear = 1, qcmIdx = 0;
function renderQcm(year) {
  qcmYear = year; qcmIdx = 0;
  const qs = qcmData[year] || [];
  if (!qs.length) {
    document.getElementById('qcmMain').innerHTML = '<div class="empty-state"><div class="es-icon">📝</div><div class="es-title">Questions à venir</div><div class="es-sub">Le contenu pour cette année sera ajouté prochainement.</div></div>';
    return;
  }
  showQcm();
}
function showQcm() {
  const qs = qcmData[qcmYear] || [];
  if (!qs.length) return;
  const q = qs[qcmIdx];
  const keys = ['A','B','C','D'];
  document.getElementById('qcmMain').innerHTML = `
    <div class="qcm-card">
      <div class="qcm-card-head">
        <div class="qch-title">${q.mat}</div>
        <div class="qch-meta">Q${qcmIdx+1}/${qs.length} · ${qcmYear}ème Année</div>
      </div>
      <div class="qcm-card-body">
        <div class="q-text">${q.q}</div>
        <div class="q-options" id="qOpts">
          ${q.opts.map((o,i)=>`<div class="q-opt" onclick="answerQ(this,${i},${q.ans})"><span class="opt-key">${keys[i]}</span>${o}</div>`).join('')}
        </div>
        <div class="q-expl" id="qExpl">${q.expl}</div>
      </div>
      <div class="qcm-card-foot">
        <button class="btn btn-ghost" onclick="nextQcm()">Question suivante →</button>
      </div>
    </div>`;
}
function answerQ(el, chosen, correct) {
  const opts = document.querySelectorAll('.q-opt');
  opts.forEach(o => o.style.pointerEvents = 'none');
  opts[correct].classList.add('correct');
  if (chosen !== correct) el.classList.add('wrong');
  document.getElementById('qExpl').classList.add('show');
}
function nextQcm() {
  const qs = qcmData[qcmYear] || [];
  qcmIdx = (qcmIdx + 1) % qs.length;
  showQcm();
}
function filterQcm(btn, year) {
  document.querySelectorAll('.qcm-year-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderQcm(year);
}
renderQcm(1);

// ── FLASHCARD DATA ──
const fcData = [
  { year:'1A', cat:'Anatomie', q:'Nombre de paires de nerfs crâniens ?', a:'12 paires de nerfs crâniens (I à XII)' },
  { year:'1A', cat:'Biologie Cellulaire', q:'Organite responsable de la synthèse des protéines ?', a:'Le ribosome (sur le RER pour les protéines sécrétées)' },
  { year:'2A', cat:'Physiologie', q:'Valeur normale de la glycémie à jeun ?', a:'0.7 – 1.1 g/L (3.9 – 6.1 mmol/L)' },
  { year:'2A', cat:'Biochimie', q:'Enzyme limitante de la glycolyse ?', a:'La phosphofructokinase-1 (PFK-1)' },
  { year:'3A', cat:'Pharmacologie', q:'Mécanisme d\'action des bêta-bloquants ?', a:'Blocage des récepteurs bêta-adrénergiques → diminution FC et PA' },
  { year:'3A', cat:'Sémiologie', q:'Définition de la bradycardie ?', a:'Fréquence cardiaque < 60 bpm au repos chez l\'adulte' },
  { year:'4A', cat:'Médecine Interne', q:'Signes cardinaux du diabète ?', a:'Polyurie, polydipsie, polyphagie, amaigrissement' },
  { year:'4A', cat:'Chirurgie', q:'Signe de Blumberg positif signifie ?', a:'Douleur à la décompression brutale = irritation péritonéale' },
  { year:'5A', cat:'Gynécologie', q:'Définition de la prématurité ?', a:'Naissance avant 37 SA (semaines d\'aménorrhée)' },
  { year:'5A', cat:'Urgences', q:'Score de Glasgow minimum et maximum ?', a:'Minimum : 3 / Maximum : 15' },
  { year:'6A', cat:'Résidanat', q:'Critères diagnostiques du syndrome métabolique ?', a:'≥3 sur 5 : obésité abdominale, TG↑, HDL↓, HTA, glycémie↑' },
  { year:'6A', cat:'Résidanat', q:'Traitement de première ligne du lupus érythémateux systémique ?', a:'Hydroxychloroquine (Plaquenil) — traitement de fond' },
];
function renderFc(cards) {
  const colors = {'1A':'#2563EB','2A':'#7C3AED','3A':'#059669','4A':'#D97706','5A':'#DC2626','6A':'#0891B2'};
  const bgs    = {'1A':'#EFF6FF','2A':'#F5F3FF','3A':'#ECFDF5','4A':'#FFFBEB','5A':'#FEF2F2','6A':'#ECFEFF'};
  document.getElementById('fcGrid').innerHTML = cards.map(c => `
    <div class="flashcard" onclick="this.classList.toggle('flipped')">
      <div class="fc-inner">
        <div class="fc-face fc-front" style="border-top-color:${colors[c.year]}">
          <div>
            <div class="fc-cat">${c.cat}</div>
            <div class="fc-q">${c.q}</div>
          </div>
          <div class="fc-foot">
            <span class="fc-year-tag" style="background:${bgs[c.year]};color:${colors[c.year]}">${c.year}</span>
            <span>Cliquer pour répondre</span>
          </div>
        </div>
        <div class="fc-face fc-back">
          <div>
            <div class="fc-cat">Réponse</div>
            <div class="fc-q">${c.a}</div>
          </div>
          <div class="fc-foot">
            <span class="fc-year-tag" style="background:rgba(37,99,235,.2);color:#60A5FA">${c.year}</span>
          </div>
        </div>
      </div>
    </div>`).join('');
}
function filterFc(btn, cat) {
  document.querySelectorAll('.fc-f').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  const filtered = cat === 'all' ? fcData : fcData.filter(c => c.year === cat);
  renderFc(filtered);
}
function filterFcByYear(year) {
  const filtered = fcData.filter(c => c.year === year);
  renderFc(filtered);
}
renderFc(fcData);

// ── HERO IMAGE ──
var heroImg = null;
try { heroImg = localStorage.getItem('medix_hero_img'); } catch(e) {}

function renderHeroImg() {
  var slot = document.getElementById('heroSlot');
  var ph   = document.getElementById('heroPlaceholder');
  var dateEl = document.getElementById('heroDate');
  if (!slot) return;
  if (heroImg) {
    // remove old img if any
    var old = slot.querySelector('img');
    if (old) old.remove();
    var img = document.createElement('img');
    img.src = heroImg;
    slot.insertBefore(img, slot.firstChild);
    if (ph) ph.style.display = 'none';
    var today = new Date().toLocaleDateString('fr-DZ', {day:'numeric', month:'short', year:'numeric'});
    if (dateEl) dateEl.textContent = today;
  } else {
    var old2 = slot.querySelector('img');
    if (old2) old2.remove();
    if (ph) ph.style.display = '';
    if (dateEl) dateEl.textContent = '';
  }
}

function heroChangeImg() {
  document.getElementById('heroImgInput').click();
}

function handleHeroImg(e) {
  var file = e.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(ev) {
    heroImg = ev.target.result;
    try { localStorage.setItem('medix_hero_img', heroImg); } catch(err) {}
    renderHeroImg();
    e.target.value = '';
  };
  reader.readAsDataURL(file);
}

renderHeroImg();

// ── FEEDBACK ──
let selectedType = '';
function selectType(el, type) {
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  selectedType = type;
  document.getElementById('fbType').value = type;
}
function submitFeedback() {
  const name = document.getElementById('fbName').value.trim();
  const year = document.getElementById('fbYear').value;
  const msg  = document.getElementById('fbMessage').value.trim();
  if (!name || !year || !msg || !selectedType) {
    alert('Veuillez remplir tous les champs obligatoires.');
    return;
  }
  document.getElementById('successMsg').classList.add('show');
  document.getElementById('fbName').value = '';
  document.getElementById('fbYear').value = '';
  document.getElementById('fbMessage').value = '';
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
  selectedType = '';
  setTimeout(() => document.getElementById('successMsg').classList.remove('show'), 5000);
}