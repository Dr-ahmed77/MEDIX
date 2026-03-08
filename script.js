// ── FIREBASE CONFIG ──
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA1zwmnlXIeHQDfkzhNbT0vdhus5kWLB-w",
  authDomain: "medix-517ae.firebaseapp.com",
  projectId: "medix-517ae",
  storageBucket: "medix-517ae.firebasestorage.app",
  messagingSenderId: "422565745821",
  appId: "1:422565745821:web:ee8bab723337181b4c7074",
  measurementId: "G-ZT0M332MJN"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// ── DATE ──
const d = new Date();
document.getElementById('tbDate').textContent = d.toLocaleDateString('fr-DZ', { day:'numeric', month:'short', year:'numeric' });

// ── STATE ──
const state = { section: null, year: null, module: null, lesson: null };

// ── DATA ──
const YEARS = [
  { id:1, label:'1ère Année',  color:'#2563EB', bg:'#EFF6FF', short:'1A' },
  { id:2, label:'2ème Année',  color:'#7C3AED', bg:'#F5F3FF', short:'2A' },
  { id:3, label:'3ème Année',  color:'#059669', bg:'#ECFDF5', short:'3A' },
  { id:4, label:'4ème Année',  color:'#D97706', bg:'#FFFBEB', short:'4A' },
  { id:5, label:'5ème Année',  color:'#DC2626', bg:'#FEF2F2', short:'5A' },
  { id:6, label:'6ème Année',  color:'#0891B2', bg:'#ECFEFF', short:'6A' },
];
const MODULES = {
  1: ['Anatomie','Biologie Cellulaire','Chimie Médicale','Physique Médicale','Biophysique'],
  2: ['Biochimie','Histologie','Physiologie','Microbiologie','Immunologie'],
  3: ['Anatomie Pathologique','Pharmacologie','Sémiologie Médicale','Bactériologie','Parasitologie'],
  4: ['Médecine Interne','Chirurgie Générale','Pédiatrie','Neurologie','Cardiologie'],
  5: ['Gynécologie-Obstétrique','Spécialités Médicales','Psychiatrie','Médecine d\'Urgence','Dermatologie'],
  6: ['Médecine Légale','Santé Publique','Stage Clinique','Préparation Résidanat','Cas Cliniques'],
};
const LESSONS = {
  'Anatomie':['Ostéologie','Arthrologie','Myologie','Système Nerveux','Appareil Cardio-vasculaire'],
  'Biologie Cellulaire':['Structure Cellulaire','Mitose & Méiose','ADN & ARN','Protéines','Membranes'],
  'Biochimie':['Glucides','Lipides','Protides','Enzymologie','Cycle de Krebs'],
  'Physiologie':['Physiologie Cardiovasculaire','Physiologie Rénale','Physiologie Respiratoire','Neurophysiologie','Endocrinologie'],
  'Pharmacologie':['Pharmacocinétique','Pharmacodynamie','Antibiotiques','Anti-inflammatoires','Anesthésiques'],
  'Médecine Interne':['HTA','Diabète Mellitus','Insuffisance Cardiaque','Pneumonie','Insuffisance Rénale'],
  'Chirurgie Générale':['Appendicite','Occlusion Intestinale','Hernie Inguinale','Cholécystite','Traumatismes'],
  'Sémiologie Médicale':['Examen Clinique','Auscultation','Palpation','Percussion','Signes Vitaux'],
  'Cardiologie':['ECG','Infarctus du Myocarde','Arythmies','Valvulopathies','Insuffisance Cardiaque'],
  'Gynécologie-Obstétrique':['Grossesse Normale','Accouchement','Pré-éclampsie','Hémorragies','Contraception'],
};
function getLessons(mod) { return LESSONS[mod] || ['Cours 1','Cours 2','Cours 3','Cours 4','Cours 5']; }

const FC_DATA = {
  '1-Anatomie-Ostéologie':[
    {q:'Combien de vertèbres dans la colonne vertébrale ?',a:'33 vertèbres : 7C + 12T + 5L + 5S + 4Co'},
    {q:'Quel est le plus petit os du corps humain ?',a:'L\'étrier (stapes) dans l\'oreille moyenne'},
    {q:'Combien d\'os composent le crâne ?',a:'8 os : frontal, pariétal×2, temporal×2, occipital, sphénoïde, ethmoïde'},
  ],
  '1-Anatomie-Myologie':[
    {q:'Muscle le plus long du corps ?',a:'Le sartorius (muscle couturier)'},
    {q:'Muscle le plus volumineux ?',a:'Le grand fessier (gluteus maximus)'},
  ],
  '1-Biologie Cellulaire-Structure Cellulaire':[
    {q:'Organite de la synthèse protéique ?',a:'Le ribosome (RER pour protéines sécrétées)'},
    {q:'Organite énergétique de la cellule ?',a:'La mitochondrie — "centrale énergétique"'},
  ],
  '2-Physiologie-Physiologie Cardiovasculaire':[
    {q:'Valeur normale de la PA systolique ?',a:'< 120 mmHg (optimale) / < 140 mmHg (normale)'},
    {q:'Définition du débit cardiaque ?',a:'DC = FC × Volume d\'éjection systolique (normal : 4–8 L/min)'},
  ],
  '3-Pharmacologie-Antibiotiques':[
    {q:'Mécanisme d\'action de la pénicilline ?',a:'Inhibition de la synthèse de la paroi bactérienne (PBP)'},
    {q:'Antidote de la warfarine ?',a:'Vitamine K (phytoménadione)'},
  ],
  '4-Cardiologie-ECG':[
    {q:'Que représente l\'onde P sur l\'ECG ?',a:'Dépolarisation auriculaire'},
    {q:'Durée normale du complexe QRS ?',a:'< 120 ms (0.12 sec)'},
  ],
  '5-Gynécologie-Obstétrique-Pré-éclampsie':[
    {q:'Définition de la pré-éclampsie ?',a:'HTA (≥140/90) + protéinurie (≥0.3g/24h) après 20 SA'},
    {q:'Traitement de la pré-éclampsie sévère ?',a:'Sulfate de magnésium + antihypertenseurs + extraction fœtale'},
  ],
};
const QCM_DATA = {
  '1-Anatomie-Ostéologie':[
    {q:'Combien de paires de côtes possède l\'être humain ?',opts:['10','11','12','14'],ans:2,expl:'L\'être humain possède 12 paires de côtes : 7 vraies, 3 fausses et 2 flottantes.'},
    {q:'Quel os forme le talon ?',opts:['Astragale','Calcanéum','Cuboïde','Scaphoïde'],ans:1,expl:'Le calcanéum (os du talon) est le plus grand os du pied.'},
  ],
  '2-Physiologie-Physiologie Cardiovasculaire':[
    {q:'Valeur normale de la fréquence cardiaque au repos ?',opts:['40–60 bpm','60–100 bpm','100–120 bpm','50–80 bpm'],ans:1,expl:'La FC normale au repos chez l\'adulte est de 60 à 100 bpm.'},
  ],
  '3-Pharmacologie-Antibiotiques':[
    {q:'Quel antibiotique est bactériostatique ?',opts:['Pénicilline','Gentamicine','Tétracycline','Ciprofloxacine'],ans:2,expl:'Les tétracyclines sont bactériostatiques.'},
  ],
  '4-Cardiologie-ECG':[
    {q:'Le sus-décalage du segment ST indique :',opts:['Ischémie sous-endocardique','Infarctus du myocarde','Bloc de branche','Péricardite chronique'],ans:1,expl:'Le sus-décalage ST est le signe ECG de l\'infarctus du myocarde aigu.'},
  ],
};
const DRIVE_DATA = {
  '1-Anatomie':['Cours Anatomie Générale.pdf','Schémas Ostéologie.pdf','QCM Anatomie.pdf'],
  '1-Biologie Cellulaire':['Cours Biologie Cellulaire.pdf','Fiches Révision.pdf'],
  '2-Physiologie':['Cours Physiologie Cardio.pdf','Physiologie Rénale.pdf','QCM Physiologie.pdf'],
  '2-Biochimie':['Biochimie Structurale.pdf','Métabolisme Glucidique.pdf','Cycle de Krebs.pdf'],
  '3-Pharmacologie':['Pharmacologie Générale.pdf','Antibiotiques Complet.pdf'],
  '4-Cardiologie':['Sémiologie Cardiologique.pdf','Lecture ECG.pdf'],
  '5-Gynécologie-Obstétrique':['Obstétrique Normale.pdf','Pathologies Grossesse.pdf'],
  '6-Préparation Résidanat':['Annales Résidanat 2022.pdf','Annales Résidanat 2021.pdf','Fiches Synthèse.pdf'],
};
const EXAMS_DATA = {
  '1-Anatomie':[
    {title:'Examen Anatomie — Juin 2023',type:'60 QCM',corrige:true,year:'2023'},
    {title:'Examen Anatomie — Juin 2022',type:'50 QCM',corrige:false,year:'2022'},
  ],
  '2-Physiologie':[
    {title:'Examen Physiologie — Juin 2023',type:'70 QCM',corrige:true,year:'2023'},
  ],
  '3-Pharmacologie':[
    {title:'Examen Pharmacologie — Juin 2023',type:'80 QCM',corrige:true,year:'2023'},
    {title:'Examen Pharmacologie — Juin 2022',type:'60 QCM',corrige:true,year:'2022'},
  ],
  '4-Cardiologie':[
    {title:'Examen Cardiologie — Juin 2023',type:'50 QCM',corrige:true,year:'2023'},
  ],
  '5-Gynécologie-Obstétrique':[
    {title:'Examen GYN-OBS — Juin 2023',type:'60 QCM',corrige:false,year:'2023'},
  ],
  '6-Préparation Résidanat':[
    {title:'Résidanat 2022 — Session 1',type:'200 QCM',corrige:true,year:'2022'},
    {title:'Résidanat 2021 — Session 1',type:'200 QCM',corrige:true,year:'2021'},
  ],
};

// ── NAVIGATION ──
function goto(pageId, navEl, section) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (navEl) navEl.classList.add('active');
  if (section) {
    state.section = section;
    state.year = null; state.module = null; state.lesson = null;
    showYearPicker(section);
  }
}

function setBreadcrumb(items) {
  const bc = document.getElementById('breadcrumb');
  if (!bc) return;
  bc.innerHTML = items.map((item, i) => {
    const isLast = i === items.length - 1;
    if (isLast) return `<span class="bc-current">${item.label}</span>`;
    return `<span class="bc-link" onclick="${item.fn}">${item.label}</span><span class="bc-sep">›</span>`;
  }).join('');
}

// ── STEP 1: YEAR ──
function showYearPicker(section) {
  const titles = {flashcards:'Flashcards',qcm:'QCM',drive:'Drive',exams:'Examens Passés'};
  const eyebrows = {flashcards:'Mémorisation',qcm:'Entraînement',drive:'Documents',exams:'Archives'};
  document.getElementById('ph-eyebrow').textContent = eyebrows[section]||'';
  document.getElementById('ph-title-main').textContent = titles[section]||'';
  document.getElementById('ph-title-em').textContent = ' — Choisissez votre année';
  setBreadcrumb([{label:titles[section]}]);
  document.getElementById('section-content').innerHTML = `
    <div class="step-grid">
      ${YEARS.map(y=>`
        <div class="step-card" onclick="selectYear(${y.id})" style="border-top:4px solid ${y.color}">
          <div class="sc-year-badge" style="background:${y.bg};color:${y.color}">${y.short}</div>
          <div class="sc-title">${y.label}</div>
          <div class="sc-modules">${(MODULES[y.id]||[]).slice(0,3).join(' · ')}…</div>
          <div class="sc-arrow" style="color:${y.color}">→</div>
        </div>`).join('')}
    </div>`;
}

// ── STEP 2: MODULE ──
function selectYear(yearId) {
  state.year = yearId;
  const y = YEARS.find(x=>x.id===yearId);
  const mods = MODULES[yearId]||[];
  const titles = {flashcards:'Flashcards',qcm:'QCM',drive:'Drive',exams:'Examens Passés'};
  document.getElementById('ph-title-em').textContent = ` — ${y.label}`;
  setBreadcrumb([
    {label:titles[state.section], fn:`showYearPicker('${state.section}')`},
    {label:y.label},
  ]);
  document.getElementById('section-content').innerHTML = `
    <div class="step-grid step-grid-3">
      ${mods.map(mod=>`
        <div class="step-card" onclick="selectModule('${mod.replace(/'/g,"\\'")}')" style="border-top:4px solid ${y.color}">
          <div class="sc-mod-icon" style="background:${y.bg};color:${y.color}">📚</div>
          <div class="sc-title">${mod}</div>
          <div class="sc-modules">${getLessons(mod).length} leçons</div>
          <div class="sc-arrow" style="color:${y.color}">→</div>
        </div>`).join('')}
    </div>`;
}

// ── STEP 3: LESSON ──
function selectModule(mod) {
  state.module = mod;
  const y = YEARS.find(x=>x.id===state.year);
  const titles = {flashcards:'Flashcards',qcm:'QCM',drive:'Drive',exams:'Examens Passés'};
  document.getElementById('ph-title-em').textContent = ` — ${mod}`;
  setBreadcrumb([
    {label:titles[state.section], fn:`showYearPicker('${state.section}')`},
    {label:y.label, fn:`selectYear(${y.id})`},
    {label:mod},
  ]);
  if (state.section==='drive')  { showDriveFiles(mod,y); return; }
  if (state.section==='exams')  { showExamsList(mod,y);  return; }
  const lessons = getLessons(mod);
  document.getElementById('section-content').innerHTML = `
    <div class="step-grid step-grid-3">
      ${lessons.map(les=>`
        <div class="step-card" onclick="selectLesson('${les.replace(/'/g,"\\'")}')" style="border-top:4px solid ${y.color}">
          <div class="sc-mod-icon" style="background:${y.bg};color:${y.color}">📖</div>
          <div class="sc-title">${les}</div>
          <div class="sc-arrow" style="color:${y.color}">→</div>
        </div>`).join('')}
    </div>`;
}

// ── STEP 4: CONTENT ──
function selectLesson(lesson) {
  state.lesson = lesson;
  const y = YEARS.find(x=>x.id===state.year);
  const titles = {flashcards:'Flashcards',qcm:'QCM'};
  document.getElementById('ph-title-em').textContent = ` — ${lesson}`;
  setBreadcrumb([
    {label:titles[state.section], fn:`showYearPicker('${state.section}')`},
    {label:y.label, fn:`selectYear(${y.id})`},
    {label:state.module, fn:`selectModule('${state.module.replace(/'/g,"\\'")}')` },
    {label:lesson},
  ]);
  if (state.section==='flashcards') showFlashcards(y);
  if (state.section==='qcm')        showQcm(y);
}

// ── FLASHCARDS ──
function showFlashcards(y) {
  const key = `${state.year}-${state.module}-${state.lesson}`;
  const cards = FC_DATA[key]||[];
  if (!cards.length) {
    document.getElementById('section-content').innerHTML = `<div class="empty-state"><div class="es-icon">🃏</div><div class="es-title">Flashcards à venir</div><div class="es-sub">Le contenu pour « ${state.lesson} » sera ajouté prochainement.</div></div>`;
    return;
  }
  document.getElementById('section-content').innerHTML = `
    <div class="fc-grid">
      ${cards.map(c=>`
        <div class="flashcard" onclick="this.classList.toggle('flipped')">
          <div class="fc-inner">
            <div class="fc-face fc-front" style="border-top-color:${y.color}">
              <div><div class="fc-cat" style="color:${y.color}">${state.module}</div><div class="fc-q">${c.q}</div></div>
              <div class="fc-foot"><span class="fc-year-tag" style="background:${y.bg};color:${y.color}">${y.short}</span><span>Cliquer pour répondre</span></div>
            </div>
            <div class="fc-face fc-back">
              <div><div class="fc-cat">Réponse</div><div class="fc-q">${c.a}</div></div>
              <div class="fc-foot"><span class="fc-year-tag" style="background:rgba(37,99,235,.2);color:#60A5FA">${y.short}</span></div>
            </div>
          </div>
        </div>`).join('')}
    </div>`;
}

// ── QCM ──
let qcmIdx=0, qcmScore=0;
function showQcm(y) {
  const key=`${state.year}-${state.module}-${state.lesson}`;
  const qs=QCM_DATA[key]||[];
  qcmIdx=0; qcmScore=0;
  if (!qs.length) {
    document.getElementById('section-content').innerHTML=`<div class="empty-state"><div class="es-icon">📝</div><div class="es-title">QCM à venir</div><div class="es-sub">Les questions pour « ${state.lesson} » seront ajoutées prochainement.</div></div>`;
    return;
  }
  renderQcmQ(qs,y);
}
function renderQcmQ(qs,y) {
  if (qcmIdx>=qs.length) {
    document.getElementById('section-content').innerHTML=`
      <div class="qcm-result">
        <div class="qr-score" style="color:${y.color}">${qcmScore}/${qs.length}</div>
        <div class="qr-label">Score Final</div>
        <div class="qr-msg">${qcmScore===qs.length?'🎉 Parfait !':qcmScore>=qs.length/2?'👍 Bien joué !':'📖 Continuez à réviser'}</div>
        <button class="btn btn-primary" onclick="qcmIdx=0;qcmScore=0;renderQcmQ(window._qs,window._y)" style="margin-top:16px">Recommencer →</button>
      </div>`;
    return;
  }
  window._qs=qs; window._y=y;
  const q=qs[qcmIdx];
  const keys=['A','B','C','D'];
  const pct=Math.round((qcmIdx/qs.length)*100);
  document.getElementById('section-content').innerHTML=`
    <div class="qcm-wrap">
      <div class="qcm-card">
        <div class="qcm-card-head">
          <div class="qch-title" style="color:${y.color}">${state.module} · ${state.lesson}</div>
          <div class="qch-meta">Q${qcmIdx+1}/${qs.length} · Score: ${qcmScore}</div>
        </div>
        <div class="qp-prog-bar"><div class="qp-prog-fill" style="width:${pct}%;background:${y.color}"></div></div>
        <div class="qcm-card-body">
          <div class="q-text">${q.q}</div>
          <div class="q-options" id="qOpts">
            ${q.opts.map((o,i)=>`<div class="q-opt" onclick="answerQcm(this,${i},${q.ans})"><span class="opt-key">${keys[i]}</span>${o}</div>`).join('')}
          </div>
          <div class="q-expl" id="qExpl">${q.expl}</div>
        </div>
        <div class="qcm-card-foot">
          <button class="btn btn-primary" onclick="qcmIdx++;renderQcmQ(window._qs,window._y)">Suivant →</button>
        </div>
      </div>
    </div>`;
}
function answerQcm(el,chosen,correct) {
  document.querySelectorAll('.q-opt').forEach(o=>o.style.pointerEvents='none');
  document.querySelectorAll('.q-opt')[correct].classList.add('correct');
  if (chosen!==correct) el.classList.add('wrong'); else qcmScore++;
  document.getElementById('qExpl').classList.add('show');
}

// ── DRIVE ──
function showDriveFiles(mod,y) {
  const key=`${state.year}-${mod}`;
  const files=DRIVE_DATA[key]||[];
  if (!files.length) {
    document.getElementById('section-content').innerHTML=`<div class="empty-state"><div class="es-icon">📁</div><div class="es-title">Contenu bientôt disponible</div></div>`;
    return;
  }
  document.getElementById('section-content').innerHTML=`
    <div class="drive-file-list">
      ${files.map(f=>`
        <div class="drive-file-row">
          <div class="dfr-left">
            <div class="dfr-icon">📄</div>
            <div><div class="dfr-name">${f}</div><div class="dfr-meta">${mod} · ${y.label} · PDF</div></div>
          </div>
          <button class="btn btn-primary" style="font-size:12px;padding:7px 16px">📥 Télécharger</button>
        </div>`).join('')}
    </div>`;
}

// ── EXAMS ──
function showExamsList(mod,y) {
  const key=`${state.year}-${mod}`;
  const exams=EXAMS_DATA[key]||[];
  if (!exams.length) {
    document.getElementById('section-content').innerHTML=`<div class="empty-state"><div class="es-icon">📄</div><div class="es-title">Examens à venir</div><div class="es-sub">Les examens pour « ${mod} » seront ajoutés prochainement.</div></div>`;
    return;
  }
  document.getElementById('section-content').innerHTML=`
    <div class="drive-file-list">
      ${exams.map(ex=>`
        <div class="drive-file-row">
          <div class="dfr-left">
            <div class="dfr-icon">📄</div>
            <div>
              <div class="dfr-name">${ex.title}</div>
              <div class="dfr-meta">${ex.type} · Session ${ex.year} · <span style="color:${ex.corrige?'#22C55E':'#F59E0B'};font-weight:700">${ex.corrige?'✓ Corrigé':'⏳ Sans corrigé'}</span></div>
            </div>
          </div>
          <button class="btn btn-primary" style="font-size:12px;padding:7px 16px">📥 Télécharger</button>
        </div>`).join('')}
    </div>`;
}

// ── HERO IMAGE — FIRESTORE ONLY (base64) ──
async function loadHeroImg() {
  try {
    const docSnap = await getDoc(doc(db, 'config', 'heroImage'));
    if (docSnap.exists() && docSnap.data().base64) {
      setHeroImgUI(docSnap.data().base64);
    }
  } catch(e) { console.log('No hero image yet'); }
}

function setHeroImgUI(src) {
  const slot = document.getElementById('heroSlot');
  const ph   = document.getElementById('heroPlaceholder');
  const dateEl = document.getElementById('heroDate');
  let img = slot.querySelector('img');
  if (!img) { img = document.createElement('img'); slot.insertBefore(img, slot.firstChild); }
  img.src = src;
  if (ph) ph.style.display = 'none';
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('fr-DZ',{day:'numeric',month:'short',year:'numeric'});
}

function heroChangeImg() { document.getElementById('heroImgInput').click(); }

async function handleHeroImg(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Check size < 900KB (Firestore doc limit)
  if (file.size > 900 * 1024) {
    alert('الصورة كبيرة — لازم تكون أصغر من 900KB. حاول تصغرها أول.');
    e.target.value = ''; return;
  }

  const ph = document.getElementById('heroPlaceholder');
  if (ph) { ph.style.display=''; ph.querySelector('.his-plus').textContent='⏳'; ph.querySelector('.his-label').textContent='Chargement...'; }

  const reader = new FileReader();
  reader.onload = async function(ev) {
    const base64 = ev.target.result;
    try {
      await setDoc(doc(db, 'config', 'heroImage'), {
        base64,
        updatedAt: new Date().toISOString()
      });
      setHeroImgUI(base64);
    } catch(err) {
      console.error(err);
      alert('Erreur Firestore: ' + err.message);
      if (ph) { ph.querySelector('.his-plus').textContent='+'; ph.querySelector('.his-label').textContent='Ajouter une photo'; }
    }
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}

loadHeroImg();

// ── FEEDBACK ──
var selectedType='';
function selectType(el,type) {
  document.querySelectorAll('.type-btn').forEach(b=>b.classList.remove('selected'));
  el.classList.add('selected'); selectedType=type;
}
function submitFeedback() {
  const name=document.getElementById('fbName').value.trim();
  const year=document.getElementById('fbYear').value;
  const msg=document.getElementById('fbMessage').value.trim();
  if (!name||!year||!msg||!selectedType) { alert('Veuillez remplir tous les champs.'); return; }
  document.getElementById('successMsg').classList.add('show');
  document.getElementById('fbName').value='';
  document.getElementById('fbYear').value='';
  document.getElementById('fbMessage').value='';
  document.querySelectorAll('.type-btn').forEach(b=>b.classList.remove('selected'));
  selectedType='';
  setTimeout(()=>document.getElementById('successMsg').classList.remove('show'),5000);
}
