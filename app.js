/* Japan Visa Form Helper – runs fully in the browser (no server). */
(function () {
  'use strict';

  const STORE = 'visa-helper-v1';

  const STATUSES = [
    'Student', 'Dependent', 'Engineer/Specialist in Humanities/International Services',
    'Skilled Labor', 'Instructor', 'Researcher', 'Professor', 'Business Manager',
    'Intra-company Transferee', 'Designated Activities', 'Spouse or Child of Japanese National',
    'Long-Term Resident', 'Other'
  ];

  // Item numbers follow the official "For applicant, part 1" layout.
  // If ISA changes the layout, edit only the "no" values and labels here.
  const SECTIONS = [
    { title: 'Personal details', fields: [
      { key: 'nationality', no: '1', label: 'Nationality / Region', type: 'text' },
      { key: 'dob', no: '2', label: 'Date of birth', type: 'date' },
      { key: 'family', no: '3', label: 'Name: family name (as in passport)', type: 'text' },
      { key: 'given', no: '3', label: 'Name: given name(s)', type: 'text' },
      { key: 'sex', no: '4', label: 'Sex', type: 'select', options: ['Male', 'Female'] },
      { key: 'birthplace', no: '5', label: 'Place of birth', type: 'text' },
      { key: 'marital', no: '6', label: 'Marital status', type: 'select', options: ['Married', 'Single'] },
      { key: 'occupation', no: '7', label: 'Occupation', type: 'text' },
      { key: 'homeaddr', no: '8', label: 'Home town / city in home country', type: 'text', full: true }
    ]},
    { title: 'Address in Japan', fields: [
      { key: 'jpaddr', no: '9', label: 'Address in Japan', type: 'text', full: true },
      { key: 'tel', no: '9', label: 'Telephone number', type: 'tel' },
      { key: 'mobile', no: '9', label: 'Mobile phone number', type: 'tel' }
    ]},
    { title: 'Passport', fields: [
      { key: 'passno', no: '10', label: 'Passport number', type: 'text' },
      { key: 'passexp', no: '10', label: 'Passport date of expiration', type: 'date' }
    ]},
    { title: 'Current status of residence', fields: [
      { key: 'status', no: '11', label: 'Status of residence', type: 'select', options: STATUSES },
      { key: 'period', no: '11', label: 'Period of stay (e.g. 1 year)', type: 'text' },
      { key: 'stayexp', no: '11', label: 'Date of expiration of period of stay', type: 'date' },
      { key: 'rcno', no: '12', label: 'Residence card number', type: 'text' }
    ]}
  ];

  const TARGET_STATUSES = STATUSES.filter(s => s !== 'Student');

  const CRIM = [
    { key: 'crim', no: '15', label: 'Criminal record (Japan / overseas, incl. traffic violations)', type: 'select', options: ['No', 'Yes'] },
    { key: 'crimdetail', no: '15', label: 'If Yes, details', type: 'text', full: true }
  ];

  const APP_EXTENSION = { title: 'Application', fields: [
    { key: 'desired', no: '13', label: 'Desired length of extension', type: 'text' },
    { key: 'reason', no: '14', label: 'Reason for extension', type: 'textarea', full: true }
  ].concat(CRIM) };

  const APP_CHANGE = { title: 'Application: change of status', fields: [
    { key: 'newstatus', no: '13', label: 'Desired status of residence', type: 'select', options: TARGET_STATUSES },
    { key: 'newperiod', no: '13', label: 'Desired period of stay', type: 'text' },
    { key: 'reason', no: '14', label: 'Reason for change of status of residence', type: 'textarea', full: true }
  ].concat(CRIM) };

  // Not part 1 of the official form: handy details for part 2 and the employer's documents.
  const WORKPLACE = { title: 'New workplace (reference for part 2 / employer documents)', fields: [
    { key: 'empname', no: '-', label: 'Employer / company name', type: 'text' },
    { key: 'empaddr', no: '-', label: 'Employer address', type: 'text', full: true },
    { key: 'emptel', no: '-', label: 'Employer telephone', type: 'tel' },
    { key: 'empjob', no: '-', label: 'Job title / duties', type: 'text' },
    { key: 'empstart', no: '-', label: 'Employment start date', type: 'date' },
    { key: 'empsalary', no: '-', label: 'Monthly salary (JPY)', type: 'text' }
  ]};

  function modeOf() { return data.mode === 'change' ? 'change' : 'extension'; }
  function sections() {
    return modeOf() === 'change'
      ? SECTIONS.concat([APP_CHANGE, WORKPLACE])
      : SECTIONS.concat([APP_EXTENSION]);
  }
  function formTitle() {
    return modeOf() === 'change' ? 'Application for Change of Status of Residence' : 'Application for Extension of Period of Stay';
  }

  const FAMILY_FIELDS = [
    { key: 'rel', label: 'Relationship', type: 'text' },
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'dob', label: 'Date of birth', type: 'date' },
    { key: 'nat', label: 'Nationality / Region', type: 'text' },
    { key: 'live', label: 'Residing with applicant', type: 'select', options: ['Yes', 'No'] },
    { key: 'work', label: 'Workplace / School', type: 'text' },
    { key: 'rc', label: 'Residence card number', type: 'text' }
  ];

  let data = load();
  if (!data.mode) data.mode = 'change';

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE)) || { f: {}, fam: [] }; }
    catch (e) { return { f: {}, fam: [] }; }
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(data)); } catch (e) { /* private mode etc. */ }
    renderSheet();
    updateProgress();
  }

  function updateProgress() {
    const bar = document.getElementById('bar'); if (!bar) return;
    const fs = [];
    sections().forEach(sec => sec.fields.forEach(f => { if (f.key !== 'crimdetail') fs.push(f); }));
    const done = fs.filter(f => (data.f[f.key] || '').trim() !== '').length;
    bar.style.width = Math.round(100 * done / fs.length) + '%';
  }

  /* ---------- build form ---------- */
  const form = document.getElementById('form');

  function control(f, value, onInput, id) {
    let el;
    if (f.type === 'select') {
      el = document.createElement('select');
      const blank = document.createElement('option'); blank.value = ''; blank.textContent = '— select —';
      el.appendChild(blank);
      f.options.forEach(o => { const op = document.createElement('option'); op.value = o; op.textContent = o; el.appendChild(op); });
    } else if (f.type === 'textarea') {
      el = document.createElement('textarea');
    } else {
      el = document.createElement('input'); el.type = f.type;
    }
    el.id = id; el.value = value || '';
    el.addEventListener('input', () => onInput(el.value));
    el.addEventListener('change', () => onInput(el.value));
    return el;
  }

  function fieldWrap(f, el, id, withNo) {
    const w = document.createElement('div'); w.className = 'field' + (f.full ? ' full' : '');
    const l = document.createElement('label'); l.htmlFor = id;
    l.innerHTML = (withNo && f.no !== '-' ? '<small>Item ' + f.no + '</small> ' : '') + escapeHtml(f.label);
    w.appendChild(l); w.appendChild(el);
    return w;
  }

  function renderForm() {
    form.innerHTML = '';
    const mh = document.createElement('h3'); mh.textContent = 'Which application?'; form.appendChild(mh);
    const mg = document.createElement('div'); mg.className = 'grid';
    const mf = { label: 'Application type', type: 'select', options: ['Change of status (Student → work visa)', 'Extension of period of stay'], full: true };
    const mel = document.createElement('select'); mel.id = 'f_mode';
    [['change', mf.options[0]], ['extension', mf.options[1]]].forEach(o => {
      const op = document.createElement('option'); op.value = o[0]; op.textContent = o[1]; mel.appendChild(op);
    });
    mel.value = modeOf();
    mel.addEventListener('change', () => { data.mode = mel.value; save(); renderForm(); });
    mg.appendChild(fieldWrap(mf, mel, 'f_mode', false)); form.appendChild(mg);
    sections().forEach(sec => {
      const h = document.createElement('h3'); h.textContent = sec.title; form.appendChild(h);
      const g = document.createElement('div'); g.className = 'grid';
      sec.fields.forEach(f => {
        const id = 'f_' + f.key;
        const el = control(f, data.f[f.key], v => { data.f[f.key] = v; save(); }, id);
        g.appendChild(fieldWrap(f, el, id, true));
      });
      form.appendChild(g);
    });

    const h = document.createElement('h3');
    h.textContent = 'Item 16: Family members in Japan';
    form.appendChild(h);
    const box = document.createElement('div'); form.appendChild(box);
    const add = document.createElement('button');
    add.type = 'button'; add.className = 'secondary small'; add.textContent = '+ Add family member';
    add.addEventListener('click', () => { data.fam.push({}); save(); renderFamily(box); });
    form.appendChild(add);
    renderFamily(box);
  }

  function renderFamily(box) {
    box.innerHTML = '';
    data.fam.forEach((m, i) => {
      const card = document.createElement('div'); card.className = 'fam';
      const g = document.createElement('div'); g.className = 'grid';
      FAMILY_FIELDS.forEach(f => {
        const id = 'fam_' + i + '_' + f.key;
        const el = control(f, m[f.key], v => { data.fam[i][f.key] = v; save(); }, id);
        g.appendChild(fieldWrap(f, el, id, false));
      });
      card.appendChild(g);
      const rm = document.createElement('button');
      rm.type = 'button'; rm.className = 'danger small'; rm.textContent = 'Remove'; rm.style.marginTop = '10px';
      rm.addEventListener('click', () => { data.fam.splice(i, 1); save(); renderFamily(box); });
      card.appendChild(rm);
      box.appendChild(card);
    });
  }

  /* ---------- data sheet (used for print/PDF and Excel) ---------- */
  function rows() {
    const out = [];
    sections().forEach(sec => sec.fields.forEach(f => out.push([f.no === '-' ? '' : f.no, f.label, data.f[f.key] || ''])));
    return out;
  }
  function famRows() {
    return data.fam.map(m => FAMILY_FIELDS.map(f => m[f.key] || ''));
  }

  function renderSheet() {
    const s = document.getElementById('sheet');
    const today = new Date().toISOString().slice(0, 10);
    let h = '<h1>' + escapeHtml(formTitle()) + ': applicant data</h1>';
    h += '<p class="note">Item numbers match the official ISA form (applicant, part 1). Prepared ' + today +
         '. Copy these values into the official form.</p>';
    h += '<table><thead><tr><th>No.</th><th>Item</th><th>Your entry</th></tr></thead><tbody>';
    rows().forEach(r => {
      h += '<tr><td class="no">' + escapeHtml(r[0]) + '</td><td class="item">' + escapeHtml(r[1]) +
           '</td><td>' + escapeHtml(r[2]).replace(/\n/g, '<br>') + '</td></tr>';
    });
    h += '</tbody></table>';
    const fr = famRows();
    h += '<h1 style="font-size:13pt">Item 16: Family members in Japan</h1>';
    if (fr.length) {
      h += '<table><thead><tr>' + FAMILY_FIELDS.map(f => '<th>' + escapeHtml(f.label) + '</th>').join('') + '</tr></thead><tbody>';
      fr.forEach(r => { h += '<tr>' + r.map(c => '<td>' + escapeHtml(c) + '</td>').join('') + '</tr>'; });
      h += '</tbody></table>';
    } else {
      h += '<p>None entered.</p>';
    }
    s.innerHTML = h;
  }

  /* ---------- actions ---------- */
  document.getElementById('btnPdf').addEventListener('click', () => window.print());

  document.getElementById('btnXlsx').addEventListener('click', () => {
    if (typeof XLSX === 'undefined') {
      alert('The Excel library could not be loaded (check your internet connection) and try again.');
      return;
    }
    const wb = XLSX.utils.book_new();
    const a = [['No.', 'Item', 'Your entry']].concat(rows());
    const ws = XLSX.utils.aoa_to_sheet(a);
    ws['!cols'] = [{ wch: 6 }, { wch: 58 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Applicant data');
    const b = [FAMILY_FIELDS.map(f => f.label)].concat(famRows());
    const ws2 = XLSX.utils.aoa_to_sheet(b);
    ws2['!cols'] = FAMILY_FIELDS.map(() => ({ wch: 24 }));
    XLSX.utils.book_append_sheet(wb, ws2, 'Item 16 Family');
    XLSX.writeFile(wb, (modeOf() === 'change' ? 'change-of-status' : 'extension') + '-application-data.xlsx');
  });

  document.getElementById('btnSave').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'visa-data.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  document.getElementById('fileLoad').addEventListener('change', e => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        if (!d || typeof d.f !== 'object') throw new Error('bad');
        data = { f: d.f, fam: Array.isArray(d.fam) ? d.fam : [], mode: d.mode === 'extension' ? 'extension' : 'change' };
        save(); renderForm();
      } catch (err) { alert('That file is not a valid saved data file.'); }
    };
    r.readAsText(file); e.target.value = '';
  });

  document.getElementById('btnClear').addEventListener('click', () => {
    if (!confirm('Delete everything you entered on this device?')) return;
    data = { f: {}, fam: [], mode: modeOf() }; save(); renderForm();
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  renderForm();
  renderSheet();
  updateProgress();
})();
