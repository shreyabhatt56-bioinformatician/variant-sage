/* ============================================================
   VARIANT SAGE — Shared JavaScript (Mock Data + Utilities)
   ============================================================ */

// ── SVG Icon Library (Lucide-style) ─────────────────────────
const ICONS = {
  dna:        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/><path d="m17 6-2.5-2.5"/><path d="m14 8-1-1"/><path d="m7 18 2.5 2.5"/><path d="m3.5 14.5.5.5"/><path d="m20 9 .5.5"/><path d="m6.5 17.5-1-1"/></svg>`,
  users:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  user:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  stethoscope:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>`,
  flask:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6l1 9H8z"/><path d="M3 21h18"/><path d="M6 21c0-3.7 1.8-7 4.5-9H14c2.7 2 4.5 5.3 4.5 9"/></svg>`,
  microscope: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8"/><path d="M3 21h18"/><path d="M14 21v-4a2 2 0 0 0-2-2H8"/><path d="M8 21V7l2-4 6 4v7"/><path d="M8 7H5a2 2 0 0 0-2 2v0c0 1.1.9 2 2 2h3"/></svg>`,
  chart:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  fileText:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  clipboard:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`,
  upload:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>`,
  search:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  bell:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  help:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  logOut:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  home:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  zap:        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  settings:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  monitor:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  check:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  clock:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  activity:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  refresh:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
  shield:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  mail:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  edit:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  plus:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  download:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  info:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  alertTriangle:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  checkCircle:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  folder:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  cpu:        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`,
  x:          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  play:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  list:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  messageSquare:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
};

function icon(name, style='') {
  return `<span style="display:inline-flex;align-items:center;${style}">${ICONS[name] || ''}</span>`;
}

// ── Mock Data ────────────────────────────────────────────────
const VS = {
  users: {
    doctor:    { name: 'Dr. Ananya Krishnan',   role: 'Doctor',            avatar: 'AK', color: '#2563eb', bg: '#eff6ff' },
    lab:       { name: 'Rajesh Nair',           role: 'Lab Supervisor',    avatar: 'RN', color: '#0d9488', bg: '#f0fdfa' },
    counselor: { name: 'Dr. Preethi Menon',     role: 'Genetic Counselor', avatar: 'PM', color: '#7c3aed', bg: '#f5f3ff' },
    admin:     { name: 'Gaurab Banerjee',       role: 'Management Admin',  avatar: 'GB', color: '#d97706', bg: '#fffbeb' },
  },

  patients: [
    { id: 'VS-1042', name: 'Sarah Mitchell',     age: 34, gender: 'F', dob: '1992-03-15', mrn: 'MRN-84521',
      vcfStatus: 'uploaded',   clinicalStatus: 'submitted', analysisStatus: 'complete', reportStatus: 'approved',
      gene: 'BRCA2', variant: 'c.5946delT', classification: 'Pathogenic',
      submittedDate: '2026-08-24', completedDate: '2026-08-25',
      hpoTerms: ['HP:0000789','HP:0001231','HP:0002664'],
      clinicalNotes: 'Family history of breast and ovarian cancer. Mother diagnosed at 42, maternal aunt at 38. Patient presents for prophylactic screening. BRCA testing recommended by oncologist.',
      confidence: 97 },
    { id: 'VS-1043', name: 'James Chen',         age: 8,  gender: 'M', dob: '2017-11-02', mrn: 'MRN-84522',
      vcfStatus: 'uploaded',   clinicalStatus: 'submitted', analysisStatus: 'running',  reportStatus: 'pending',
      gene: 'CFTR', variant: 'p.Phe508del', classification: 'Pathogenic',
      submittedDate: '2026-08-25', completedDate: null,
      hpoTerms: ['HP:0002099','HP:0001508','HP:0002019'],
      clinicalNotes: 'Chronic respiratory infections since age 2. Sweat chloride test elevated at 68 mEq/L. Failure to thrive noted by pediatrician.',
      confidence: 94 },
    { id: 'VS-1044', name: 'Priya Sharma',       age: 52, gender: 'F', dob: '1973-07-21', mrn: 'MRN-84523',
      vcfStatus: 'uploaded',   clinicalStatus: 'pending',   analysisStatus: 'waiting',  reportStatus: 'pending',
      gene: 'TP53', variant: 'c.817C>T', classification: 'Likely Pathogenic',
      submittedDate: '2026-08-25', completedDate: null,
      hpoTerms: ['HP:0003002','HP:0000786'],
      clinicalNotes: '',
      confidence: 86 },
    { id: 'VS-1045', name: 'Mohammed Al-Rashid', age: 29, gender: 'M', dob: '1997-01-09', mrn: 'MRN-84524',
      vcfStatus: 'processing', clinicalStatus: 'submitted', analysisStatus: 'waiting',  reportStatus: 'pending',
      gene: 'MLH1', variant: 'c.1852_1854del', classification: 'VUS',
      submittedDate: '2026-08-26', completedDate: null,
      hpoTerms: ['HP:0005227','HP:0100787'],
      clinicalNotes: 'Young-onset colorectal polyps. Lynch syndrome suspected.',
      confidence: 62 },
    { id: 'VS-1046', name: 'Elena Kowalski',     age: 41, gender: 'F', dob: '1984-09-30', mrn: 'MRN-84525',
      vcfStatus: 'uploaded',   clinicalStatus: 'submitted', analysisStatus: 'complete', reportStatus: 'review',
      gene: 'EGFR', variant: 'p.Leu858Arg', classification: 'Pathogenic',
      submittedDate: '2026-08-23', completedDate: '2026-08-24',
      hpoTerms: ['HP:0100526','HP:0030358','HP:0002664'],
      clinicalNotes: 'Non-small cell lung carcinoma, stage IIIA. Never smoker. EGFR exon 21 mutation testing for targeted therapy selection.',
      confidence: 99 },
  ],

  hpoLabels: {
    'HP:0000789': 'Infertility',
    'HP:0001231': 'Abnormal fingernail',
    'HP:0002664': 'Neoplasm',
    'HP:0002099': 'Asthma',
    'HP:0001508': 'Failure to thrive',
    'HP:0002019': 'Constipation',
    'HP:0003002': 'Breast carcinoma',
    'HP:0000786': 'Primary amenorrhea',
    'HP:0005227': 'Colorectal polyposis',
    'HP:0100787': 'Neoplasm of the rectum',
    'HP:0100526': 'Neoplasm of the lung',
    'HP:0030358': 'Non-small cell lung carcinoma',
  },

  variantDetails: {
    'VS-1042': {
      criteria_path: [
        { code: 'PVS1', level: 'Very Strong', desc: 'Frameshift variant causes loss of function in BRCA2' },
        { code: 'PM2',  level: 'Moderate',    desc: 'Absent in gnomAD (0 alleles in 251,378 controls)' },
        { code: 'PP5',  level: 'Supporting',  desc: '148 ClinVar P/LP submissions, no conflicting' },
        { code: 'PS3',  level: 'Strong',      desc: 'Functional studies confirm LOF in vitro' },
      ],
      acmg_class: 'Pathogenic', inheritance: 'Autosomal Dominant',
      clinical_sig: 'Increased risk for Hereditary Breast and Ovarian Cancer Syndrome. NCCN Category 1 recommendation for prophylactic salpingo-oophorectomy and enhanced screening.',
    },
    'VS-1046': {
      criteria_path: [
        { code: 'PS1',  level: 'Strong',      desc: 'Same amino acid change as established pathogenic p.L858R' },
        { code: 'PM5',  level: 'Moderate',    desc: 'Novel missense at codon with known pathogenic variants' },
        { code: 'PP3',  level: 'Supporting',  desc: 'SIFT=0.001, PolyPhen2=0.998, CADD=34.7' },
        { code: 'PP5',  level: 'Supporting',  desc: '312 ClinVar P/LP entries, FDA-approved companion diagnostic' },
      ],
      acmg_class: 'Pathogenic', inheritance: 'Somatic',
      clinical_sig: 'EGFR L858R is a validated oncogenic driver mutation. Tier I somatic variant. Erlotinib, gefitinib, and osimertinib are FDA-approved targeted therapies.',
    },
  },

  systemUsers: [
    { name: 'Dr. Ananya Krishnan',  role: 'doctor',    dept: 'Oncology',           status: 'active',   reports: 142, lastActive: '2h ago' },
    { name: 'Dr. Vikram Patel',     role: 'doctor',    dept: 'Clinical Genetics',  status: 'active',   reports: 98,  lastActive: '30m ago' },
    { name: 'Dr. Fatima Al-Amin',   role: 'doctor',    dept: 'Pediatrics',         status: 'active',   reports: 67,  lastActive: '1d ago' },
    { name: 'Rajesh Nair',          role: 'lab',       dept: 'NGS Laboratory',     status: 'active',   reports: 0,   lastActive: '15m ago' },
    { name: 'Sana Iqbal',           role: 'lab',       dept: 'NGS Laboratory',     status: 'active',   reports: 0,   lastActive: '4h ago' },
    { name: 'Dr. Preethi Menon',    role: 'counselor', dept: 'Genetic Counseling', status: 'active',   reports: 231, lastActive: '5m ago' },
    { name: 'Dr. Arun Thomas',      role: 'counselor', dept: 'Genetic Counseling', status: 'inactive', reports: 89,  lastActive: '3d ago' },
  ],

  activityFeed: [
    { dot: '#16a34a', text: '<strong>VS-1046</strong> report approved by Dr. Preethi Menon',       time: '5 minutes ago' },
    { dot: '#2563eb', text: '<strong>VS-1043</strong> pipeline analysis started (Variant 23/100)', time: '12 minutes ago' },
    { dot: '#d97706', text: '<strong>VS-1044</strong> awaiting clinical history from Dr. Ananya Krishnan', time: '38 minutes ago' },
    { dot: '#7c3aed', text: 'New user <strong>Dr. Fatima Al-Amin</strong> added to system',        time: '2 hours ago' },
    { dot: '#16a34a', text: '<strong>VS-1042</strong> report released to doctor',                  time: '3 hours ago' },
    { dot: '#2563eb', text: 'Weekly batch of <strong>127 samples</strong> uploaded by Rajesh Nair',time: '1 day ago' },
  ],

  weeklyData: [62, 78, 91, 84, 103, 115, 97],
  weekDays:   ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

// ── Utilities ────────────────────────────────────────────────
function getClassBadge(cls) {
  const map = { 'Pathogenic':'badge-pathogenic','Likely Pathogenic':'badge-likely-p','VUS':'badge-vus','Likely Benign':'badge-likely-b','Benign':'badge-benign' };
  return `<span class="badge ${map[cls]||'badge-vus'}">${cls}</span>`;
}

function getStatusBadge(status) {
  const map = {
    'uploaded':   ['badge-complete','Uploaded'],
    'processing': ['badge-running', 'Processing'],
    'missing':    ['badge-rejected','Missing'],
    'submitted':  ['badge-complete','Submitted'],
    'pending':    ['badge-pending', 'Pending'],
    'complete':   ['badge-complete','Complete'],
    'running':    ['badge-running', 'Running'],
    'waiting':    ['badge-pending', 'Waiting'],
    'approved':   ['badge-approved','Approved'],
    'review':     ['badge-review',  'In Review'],
    'rejected':   ['badge-rejected','Rejected'],
    'active':     ['badge-active',  'Active'],
    'inactive':   ['badge-inactive','Inactive'],
  };
  const [cls, label] = map[status] || ['badge-vus', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

function getRoleBadge(role) {
  const map = { doctor:'badge-doctor', lab:'badge-lab', counselor:'badge-counselor', admin:'badge-admin' };
  const labels = { doctor:'Doctor', lab:'Lab Supervisor', counselor:'Counselor', admin:'Admin' };
  return `<span class="badge ${map[role]}">${labels[role]||role}</span>`;
}

function getConfColor(score) {
  if (score >= 90) return '#16a34a';
  if (score >= 70) return '#d97706';
  return '#dc2626';
}

// ── Sidebar Renderer ─────────────────────────────────────────
function renderSidebar(container, role, activeItem) {
  const user = VS.users[role];
  const navItems = {
    doctor:    [
      { id:'overview', iconKey:'zap',         label:'Overview',        badge:null },
      { id:'patients', iconKey:'stethoscope', label:'My Patients',     badge:'5' },
      { id:'submit',   iconKey:'clipboard',   label:'Submit History',  badge:null },
      { id:'reports',  iconKey:'fileText',    label:'Reports',         badge:'1' },
      { id:'messages', iconKey:'messageSquare',label:'Messages',       badge:'2' },
    ],
    lab:       [
      { id:'overview', iconKey:'zap',         label:'Overview',        badge:null },
      { id:'queue',    iconKey:'list',         label:'Sample Queue',   badge:'5' },
      { id:'upload',   iconKey:'upload',       label:'Upload VCF',     badge:null },
      { id:'running',  iconKey:'refresh',      label:'Live Analysis',  badge:'1' },
      { id:'history',  iconKey:'clipboard',    label:'Run History',    badge:null },
    ],
    counselor: [
      { id:'overview', iconKey:'zap',         label:'Overview',        badge:null },
      { id:'review',   iconKey:'shield',       label:'Review Queue',   badge:'3' },
      { id:'pipeline', iconKey:'activity',     label:'Pipeline',       badge:null },
      { id:'reports',  iconKey:'fileText',     label:'Report Approval',badge:'1' },
      { id:'history',  iconKey:'clipboard',    label:'Case History',   badge:null },
    ],
    admin:     [
      { id:'overview', iconKey:'zap',         label:'Overview',        badge:null },
      { id:'users',    iconKey:'users',        label:'User Management', badge:null },
      { id:'reports',  iconKey:'chart',        label:'Analytics',       badge:null },
      { id:'system',   iconKey:'monitor',      label:'System Logs',     badge:null },
      { id:'settings', iconKey:'settings',     label:'Settings',        badge:null },
    ],
  };

  const items = navItems[role] || [];
  container.innerHTML = `
    <div class="sidebar-logo">
      <div class="logo-icon">${ICONS.dna}</div>
      <div>
        <div class="logo-text">Variant<span>Sage</span></div>
        <div class="logo-sub">AI Genomics Platform</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section-label">Navigation</div>
      ${items.map(item => `
        <div class="nav-item ${item.id===activeItem?'active':''}" data-nav="${item.id}">
          ${ICONS[item.iconKey]||''}
          <span>${item.label}</span>
          ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
        </div>
      `).join('')}
      <div class="nav-section-label" style="margin-top:14px;">Account</div>
      <a href="index.html" class="nav-item">${ICONS.home}<span>Switch Role</span></a>
    </nav>
    <div class="sidebar-user">
      <div class="user-avatar" style="background:${user.bg};color:${user.color};">${user.avatar}</div>
      <div class="user-info">
        <div class="user-name">${user.name}</div>
        <div class="user-role">${user.role}</div>
      </div>
      <button class="logout-btn" onclick="window.location='index.html'" title="Sign out">${ICONS.logOut}</button>
    </div>
  `;
}

// ── Topbar Renderer ──────────────────────────────────────────
function renderTopbar(container, title, sub) {
  container.innerHTML = `
    <div>
      <div class="topbar-title">${title}</div>
      ${sub ? `<div class="topbar-sub">${sub}</div>` : ''}
    </div>
    <div class="topbar-right">
      <div class="topbar-search">
        ${ICONS.search}
        <input type="text" placeholder="Search patients, variants...">
      </div>
      <div class="icon-btn" title="Notifications" style="position:relative;">
        ${ICONS.bell}<span class="notif-dot"></span>
      </div>
      <div class="icon-btn" title="Help">${ICONS.help}</div>
    </div>
  `;
}

// ── Navigation ───────────────────────────────────────────────
function loginAs(role) {
  const dest = { doctor:'doctor.html', lab:'lab.html', counselor:'counselor.html', admin:'admin.html' };
  window.location.href = dest[role];
}
