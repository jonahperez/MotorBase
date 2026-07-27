/* MotorBase UI mockup — self-contained clickable prototype.
   Measurement validation and the compression-ratio calculator are the real
   algorithms (ported from scripts/spec_eval.py and scripts/compression_ratio.py),
   driven by the actual VG33E engine spec JSON. */

const ICONS = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
  builds: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2v6h6"/><path d="M4 2h10l6 6v14H4z"/><path d="M8 13h8M8 17h8"/></svg>',
  specs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h4"/></svg>',
  orders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L23 7H6"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21V9"/><path d="M7 14l5-5 5 5"/><path d="M5 3h14"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>',
  bang: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 8v5M12 17h.01"/></svg>',
};

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'builds', label: 'Builds', icon: 'builds' },
  { id: 'specs', label: 'Engine specs', icon: 'specs' },
  { id: 'orders', label: 'Orders', icon: 'orders' },
];

const BUILDS = [
  { id: 'vg33e', name: 'VG33E Pathfinder rebuild', engine: 'VG33E', engineName: 'Nissan 3.3L V6', status: 'in_progress', specRev: 'example-1', progress: 45 },
  { id: 'sbc350', name: 'SBC 350 street build', engine: 'SBC350', engineName: 'Chevrolet 5.7L V8', status: 'planned', specRev: '—', progress: 8 },
  { id: 'coyote', name: 'Coyote 5.0 track engine', engine: 'COYOTE', engineName: 'Ford 5.0L V8', status: 'completed', specRev: 'v2', progress: 100 },
];

const PHASES = ['TEARDOWN', 'CLEAN', 'INSPECT', 'MACHINE', 'ASSEMBLE', 'FINAL'];

const TASKS = [
  { id: 't1', phase: 'TEARDOWN', name: 'Disassemble & label components', sub: 'Bag hardware, record teardown notes', status: 'done', m: [] },
  { id: 't2', phase: 'CLEAN', name: 'Hot-tank & clean block / head', sub: 'Degrease, chase threads', status: 'done', m: [] },
  { id: 't3', phase: 'INSPECT', name: 'Examine cylinders', category: 'cylinder_block', status: 'done',
    m: [['cylinder_block', 'bore_inner_diameter'], ['cylinder_block', 'out_of_round'], ['cylinder_block', 'taper'], ['cylinder_block', 'surface_flatness']] },
  { id: 't4', phase: 'INSPECT', name: 'Examine pistons', category: 'piston', status: 'todo',
    m: [['piston', 'skirt_diameter'], ['piston', 'to_cylinder_clearance'], ['piston', 'pin_hole_diameter']] },
  { id: 't5', phase: 'INSPECT', name: 'Examine cylinder head', category: 'cylinder_head', status: 'todo',
    m: [['cylinder_head', 'surface_flatness'], ['cylinder_head', 'height'], ['valve_seat', 'contact_width_intake'], ['valve_seat', 'contact_width_exhaust']] },
  { id: 't6', phase: 'INSPECT', name: 'Evaluate valvetrain', category: 'valvetrain', status: 'issue',
    m: [['valve', 'stem_diameter_intake'], ['valve', 'stem_diameter_exhaust'], ['valve', 'seat_angle'], ['valve', 'margin_thickness_intake'], ['valve', 'to_guide_clearance_intake'], ['valve', 'to_guide_clearance_exhaust'], ['valve_spring', 'free_height_outer'], ['valve_spring', 'pressure_outer']] },
  { id: 't7', phase: 'INSPECT', name: 'Crankshaft & bearings', category: 'crankshaft', status: 'todo',
    m: [['crankshaft', 'main_journal_diameter'], ['crankshaft', 'runout'], ['crankshaft', 'free_end_play'], ['main_bearing', 'no1_thickness'], ['bearing_clearance', 'main_bearing_clearance']] },
  { id: 't8', phase: 'MACHINE', name: 'Bore & hone to piston size', status: 'todo', m: [] },
  { id: 't9', phase: 'MACHINE', name: 'Valve job & resurface head', status: 'todo', m: [] },
  { id: 't10', phase: 'ASSEMBLE', name: 'Set bearing clearances & torque', sub: 'Angular torque per precautions', status: 'todo', m: [] },
  { id: 't11', phase: 'ASSEMBLE', name: 'Degree cam & set valvetrain', status: 'todo', m: [] },
  { id: 't12', phase: 'FINAL', name: 'Compression check & final specs', status: 'todo', m: [] },
];

// Pre-entered readings that produce the shown task statuses.
const READINGS = {
  t3: { 'cylinder_block.bore_inner_diameter': 91.505, 'cylinder_block.out_of_round': 0.008, 'cylinder_block.taper': 0.010, 'cylinder_block.surface_flatness': 0.02 },
  t6: { 'valve.stem_diameter_intake': 6.900, 'valve.stem_diameter_exhaust': 7.965, 'valve.seat_angle': 45.5, 'valve.margin_thickness_intake': 1.30, 'valve.to_guide_clearance_intake': 0.035, 'valve.to_guide_clearance_exhaust': 0.130, 'valve_spring.free_height_outer': 51.0, 'valve_spring.pressure_outer': 300 },
};

let BOM = [
  { part: 'Main bearing set — grade 2 (green)', pn: 'MB-VG33-STD', need: 1, ordered: 1, received: 1, src: 'inspection' },
  { part: 'Piston ring set (STD)', pn: 'RS-9150', need: 6, ordered: 6, received: 6, src: 'plan' },
  { part: 'Head gasket set', pn: 'HG-VG33', need: 1, ordered: 1, received: 0, src: 'plan' },
  { part: 'Freeze plug kit', pn: 'FP-VG33', need: 1, ordered: 0, received: 0, src: 'plan' },
];

const ORDERS = [
  { id: 'PO-1042', vendor: 'Summit Racing', status: 'RECEIVED', lines: 3, total: '$742.10', eta: '—' },
  { id: 'PO-1051', vendor: 'RockAuto', status: 'SUBMITTED', lines: 2, total: '$318.44', eta: 'Aug 2' },
  { id: 'PO-1055', vendor: 'Nissan OEM', status: 'BACKORDERED', lines: 1, total: '$96.00', eta: 'Aug 14' },
];

const STATUS_BADGE = {
  in_progress: ['warn', 'In progress'], planned: ['muted', 'Planned'], completed: ['ok', 'Completed'],
  RECEIVED: ['ok', 'Received'], SUBMITTED: ['info', 'Submitted'], BACKORDERED: ['bad', 'Backordered'],
};

let SPEC = null;
const state = { route: 'dashboard', buildId: null, tab: 'workflow', taskId: 't6' };

/* ---------- spec helpers (real algorithms) ---------- */
function findMeasurement(sectionKey, measKey) {
  const s = SPEC.sections.find(x => x.key === sectionKey);
  return s && s.measurements.find(x => x.key === measKey);
}
const lo = r => (r && r.min != null) ? r.min : -Infinity;
const hi = r => (r && r.max != null) ? r.max : Infinity;

function evaluate(m, reading) {
  if (reading === '' || reading == null || isNaN(reading)) return { cls: 'muted', text: '—' };
  reading = Number(reading);
  if (m.grades && m.grades.length) {
    for (const g of m.grades) if (reading >= lo(g) && reading <= hi(g)) return { cls: 'info', text: 'Grade ' + g.grade };
    return { cls: 'bad', text: 'No grade match' };
  }
  const std = m.standard, lim = m.limit;
  if (std && reading >= lo(std) && reading <= hi(std)) return { cls: 'ok', text: 'In spec' };
  if (lim) {
    if (reading > hi(lim) || reading < lo(lim)) return { cls: 'bad', text: 'Beyond limit' };
    return { cls: 'warn', text: 'Out of standard' };
  }
  if (std) return { cls: 'warn', text: 'Out of standard' };
  if (m.nominal != null) return reading === m.nominal ? { cls: 'ok', text: 'In spec' } : { cls: 'warn', text: 'Off nominal' };
  return { cls: 'ok', text: 'Recorded' };
}

function specRangeText(m) {
  const f = v => (v == null ? '' : v);
  if (m.grades && m.grades.length) return m.grades.map(g => `${g.grade}: ${f(g.min)}–${f(g.max)}`).join('  ·  ');
  const parts = [];
  if (m.standard && (m.standard.min != null || m.standard.max != null)) {
    if (m.standard.min != null && m.standard.max != null) parts.push(`std ${m.standard.min}–${m.standard.max}`);
    else if (m.standard.max != null) parts.push(`std ≤ ${m.standard.max}`);
    else parts.push(`std ≥ ${m.standard.min}`);
  }
  if (m.limit && (m.limit.min != null || m.limit.max != null)) {
    if (m.limit.max != null) parts.push(`limit ${m.limit.max}`);
    if (m.limit.min != null) parts.push(`min ${m.limit.min}`);
  }
  if (!parts.length && m.nominal != null) parts.push(`nominal ${m.nominal}`);
  return parts.join(' · ') || '—';
}

function crCompute(v) {
  const K = 0.7854;
  const swept = K * v.bore ** 2 * v.stroke / 1000;
  const deck = K * v.bore ** 2 * v.deck / 1000;
  const gasket = K * v.gbore ** 2 * v.gthk / 1000;
  const clearance = v.chamber + v.dome + v.ringland + deck + gasket;
  return { swept, deck, gasket, clearance, cr: (swept + clearance) / clearance };
}

/* ---------- render ---------- */
const $ = s => document.querySelector(s);
const content = () => $('#content');

function badge(cls, text) { return `<span class="badge ${cls}"><span class="dot"></span>${text}</span>`; }

function renderNav() {
  $('#nav').innerHTML = NAV.map(n =>
    `<button class="nav-item ${state.route === n.id || (n.id === 'builds' && state.route === 'build') ? 'active' : ''}" data-nav="${n.id}">${ICONS[n.icon]}<span>${n.label}</span></button>`
  ).join('');
}

function render() {
  renderNav();
  const r = state.route;
  if (r === 'dashboard') return renderDashboard();
  if (r === 'builds') return renderBuilds();
  if (r === 'build') return renderBuild();
  if (r === 'specs') return renderSpecs();
  if (r === 'orders') return renderOrders();
}

function renderDashboard() {
  $('#crumb').innerHTML = '<b>Dashboard</b>';
  content().innerHTML = `
    <div class="page-head"><div><h2>Welcome back, Rob</h2><p>Precision Engine Works · 3 active builds</p></div></div>
    <div class="grid stats">
      ${stat('Active builds', '3')}
      ${stat('Parts to order', '2', 'this week')}
      ${stat('Orders on the way', '2')}
      ${stat('Open inspections', '5')}
    </div>
    <div class="page-head"><h2 style="font-size:16px">Your builds</h2><div class="spacer"></div><button class="btn primary" data-nav="builds">${ICONS.plus} New build</button></div>
    <div class="grid cards">${BUILDS.map(buildCard).join('')}</div>`;
}

function stat(label, value, sub) {
  return `<div class="card stat"><div class="label">${label}</div><div class="value">${value} ${sub ? `<small>${sub}</small>` : ''}</div></div>`;
}

function buildCard(b) {
  const [cls, txt] = STATUS_BADGE[b.status];
  return `<div class="card click build-card" data-build="${b.id}">
    ${badge(cls, txt)}
    <div class="title">${b.name}</div>
    <div class="sub">${b.engineName} · <b>${b.engine}</b></div>
    <div class="progress"><span style="width:${b.progress}%"></span></div>
    <div class="meta">${badge('muted', 'spec ' + b.specRev)}<span class="badge muted">${b.progress}% complete</span></div>
  </div>`;
}

function renderBuilds() {
  $('#crumb').innerHTML = '<b>Builds</b>';
  content().innerHTML = `
    <div class="page-head"><div><h2>Builds</h2><p>Every engine build for your tenant</p></div><div class="spacer"></div><button class="btn primary">${ICONS.plus} New build</button></div>
    <div class="grid cards">${BUILDS.map(buildCard).join('')}</div>`;
}

function renderBuild() {
  const b = BUILDS.find(x => x.id === state.buildId);
  $('#crumb').innerHTML = `<span data-nav="builds">Builds</span> / <b>${b.name}</b>`;
  const tabs = [['workflow', 'Guided workflow'], ['bom', 'Bill of materials'], ['orders', 'Orders'], ['cr', 'Compression ratio']];
  content().innerHTML = `
    <div class="page-head">
      <div><h2>${b.name}</h2><p>${b.engineName} · engine type <b>${b.engine}</b> · spec revision <b>${b.specRev}</b></p></div>
      <div class="spacer"></div>${badge(...STATUS_BADGE[b.status])}
    </div>
    <div class="tabs">${tabs.map(([id, l]) => `<button class="tab ${state.tab === id ? 'active' : ''}" data-tab="${id}">${l}</button>`).join('')}</div>
    <div id="tab-body"></div>`;
  renderTab();
}

function renderTab() {
  const body = $('#tab-body');
  if (state.tab === 'workflow') return renderWorkflow(body);
  if (state.tab === 'bom') return renderBom(body);
  if (state.tab === 'orders') return renderOrders(body);
  if (state.tab === 'cr') return renderCR(body);
}

function renderWorkflow(body) {
  const phasesHtml = PHASES.map(p => {
    const ts = TASKS.filter(t => t.phase === p);
    if (!ts.length) return '';
    return `<div class="phase"><div class="phase-title">${p}<span class="line"></span></div>${ts.map(taskRow).join('')}</div>`;
  }).join('');
  body.innerHTML = `<div class="workflow"><div>${phasesHtml}</div><div id="meas-panel" class="card"></div></div>`;
  renderMeasPanel();
}

function taskRow(t) {
  const stateCls = t.status === 'done' ? 'done' : t.status === 'issue' ? 'issue' : '';
  const tick = t.status === 'done' ? ICONS.check : t.status === 'issue' ? ICONS.bang : '';
  const active = t.id === state.taskId ? 'active' : '';
  const right = t.status === 'issue' ? badge('bad', 'Needs part') : t.status === 'done' ? badge('ok', 'Pass') : (t.m.length ? badge('muted', t.m.length + ' checks') : '');
  return `<div class="task ${stateCls} ${active}" data-task="${t.id}">
    <div class="tick">${tick}</div>
    <div><div class="tname">${t.name}</div>${t.sub ? `<div class="tsub">${t.sub}</div>` : (t.category ? `<div class="tsub">${t.m.length} measurements</div>` : '')}</div>
    <div class="tright">${right}</div>
  </div>`;
}

function renderMeasPanel() {
  const panel = $('#meas-panel');
  const t = TASKS.find(x => x.id === state.taskId);
  if (!t) { panel.innerHTML = '<p class="panel-sub">Select a task.</p>'; return; }
  if (!t.m.length) {
    panel.innerHTML = `<h3 class="panel-title">${t.name}</h3><p class="panel-sub">${t.sub || 'No recorded measurements for this task.'}</p><button class="btn">Mark complete</button>`;
    return;
  }
  const rows = t.m.map(([sk, mk]) => {
    const m = findMeasurement(sk, mk);
    if (!m) return '';
    const val = (READINGS[t.id] || {})[`${sk}.${mk}`];
    const id = `in_${t.id}_${sk}_${mk}`;
    return `<div class="meas-row">
      <div class="meas-name">${m.label}<small>${sk.replace(/_/g, ' ')}</small></div>
      <div class="meas-input"><input id="${id}" type="number" step="0.001" value="${val != null ? val : ''}" data-m="${sk}.${mk}"><span class="unit">${m.unit}</span></div>
      <div class="spec-range">${specRangeText(m)}</div>
      <div data-badge="${sk}.${mk}">${(() => { const e = evaluate(m, val); return badge(e.cls, e.text); })()}</div>
    </div>`;
  }).join('');
  const issue = t.status === 'issue';
  panel.innerHTML = `
    <h3 class="panel-title">${t.name}</h3>
    <p class="panel-sub">Readings validate live against the <b>${SPEC.engine.type}</b> spec (standard range → service limit; graded parts resolve a grade).</p>
    ${rows}
    ${issue ? `<div class="callout">${ICONS.bang}<div><b>Exhaust valve-to-guide clearance is beyond limit.</b> Replace the exhaust valve guides.</div><button class="btn primary sm" id="add-need">${ICONS.plus} Add to parts needed</button></div>` : ''}`;
  panel.querySelectorAll('input[data-m]').forEach(inp => {
    inp.addEventListener('input', () => {
      const [sk, mk] = inp.dataset.m.split('.');
      const m = findMeasurement(sk, mk);
      const e = evaluate(m, inp.value);
      panel.querySelector(`[data-badge="${sk}.${mk}"]`).innerHTML = badge(e.cls, e.text);
    });
  });
  const add = $('#add-need');
  if (add) add.addEventListener('click', () => {
    BOM.push({ part: 'Exhaust valve guide — service size', pn: 'VG-EX-050', need: 2, ordered: 0, received: 0, src: 'inspection' });
    toast('Added “Exhaust valve guide” to the bill of materials');
    state.tab = 'bom'; renderBuild();
  });
}

function renderBom(body) {
  const rows = BOM.map(x => {
    const out = x.need - x.received;
    const stat = x.received >= x.need ? badge('ok', 'Received') : x.ordered >= x.need ? badge('info', 'On order') : x.ordered > 0 ? badge('warn', 'Partial') : badge('bad', 'To order');
    return `<tr><td><b>${x.part}</b><br><span class="spec-range">${x.pn}</span></td>
      <td>${x.src === 'inspection' ? badge('primary', 'Inspection') : badge('muted', 'Planned')}</td>
      <td>${x.need}</td><td>${x.ordered}</td><td>${x.received}</td><td>${stat}</td></tr>`;
  }).join('');
  body.innerHTML = `
    <div class="grid stats">
      ${stat2('To order', BOM.filter(x => x.ordered === 0).length, 'bad')}
      ${stat2('On order', BOM.filter(x => x.ordered >= x.need && x.received < x.need).length, 'info')}
      ${stat2('Received', BOM.filter(x => x.received >= x.need).length, 'ok')}
      ${stat2('From inspection', BOM.filter(x => x.src === 'inspection').length, 'primary')}
    </div>
    <div class="card table-card"><table><thead><tr><th>Part</th><th>Source</th><th>Needed</th><th>Ordered</th><th>Received</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function stat2(label, value, cls) { return `<div class="card stat"><div class="label">${label}</div><div class="value" style="color:var(--${cls === 'bad' ? 'bad' : cls === 'ok' ? 'ok' : cls === 'primary' ? 'primary' : 'info'})">${value}</div></div>`; }

function renderOrders(body) {
  const target = body || content();
  if (!body) { $('#crumb').innerHTML = '<b>Orders</b>'; }
  const rows = ORDERS.map(o => `<tr><td><b>${o.id}</b></td><td>${o.vendor}</td><td>${o.lines}</td><td>${o.total}</td><td>${o.eta}</td><td>${badge(...STATUS_BADGE[o.status])}</td></tr>`).join('');
  const html = `
    ${body ? '' : '<div class="page-head"><div><h2>Orders</h2><p>Purchase orders across builds</p></div></div>'}
    <div class="card table-card"><table><thead><tr><th>Order</th><th>Vendor</th><th>Lines</th><th>Total</th><th>ETA</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  target.innerHTML = html;
}

function renderCR(body) {
  const v = { bore: 91.5, stroke: 83.0, chamber: 60.0, dome: 3.0, ringland: 1.0, deck: 0.20, gbore: 92.0, gthk: 0.50 };
  const fields = [
    ['bore', 'Bore', 'mm'], ['stroke', 'Stroke', 'mm'], ['chamber', 'Chamber volume', 'cc'], ['dome', 'Piston dome/dish (+dish)', 'cc'],
    ['ringland', 'Top ring-land crevice', 'cc'], ['deck', 'Deck clearance', 'mm'], ['gbore', 'Gasket bore', 'mm'], ['gthk', 'Gasket thickness', 'mm'],
  ];
  body.innerHTML = `<div class="cr">
    <div class="card">
      <h3 class="panel-title">Static compression ratio</h3>
      <p class="panel-sub">CR = (swept + clearance) / clearance. Volumes computed from the inputs below.</p>
      <div class="two-col">
        ${fields.map(([k, l, u]) => `<div class="field"><label>${l}</label><div class="in"><input id="cr_${k}" type="number" step="0.01" value="${v[k]}" data-cr="${k}"><span class="unit">${u}</span></div></div>`).join('')}
      </div>
    </div>
    <div class="cr-result" id="cr-out"></div>
  </div>`;
  const recompute = () => {
    const cur = {};
    fields.forEach(([k]) => cur[k] = Number($('#cr_' + k).value));
    const r = crCompute(cur);
    $('#cr-out').innerHTML = `
      <div class="rlabel">Compression ratio</div>
      <div class="big"><span>${r.cr.toFixed(2)}</span> : 1</div>
      <div style="margin-top:18px">
        ${volRow('Swept volume', r.swept)}
        ${volRow('Deck volume', r.deck)}
        ${volRow('Gasket volume', r.gasket)}
        ${volRow('Clearance volume', r.clearance)}
        ${volRow('Displacement (×6)', r.swept * 6)}
      </div>`;
  };
  body.querySelectorAll('input[data-cr]').forEach(i => i.addEventListener('input', recompute));
  recompute();
}
function volRow(label, val) { return `<div class="vol-row"><span>${label}</span><b>${val.toFixed(2)} cc</b></div>`; }

function renderSpecs() {
  $('#crumb').innerHTML = '<b>Engine specs</b>';
  const nMeas = SPEC.sections.reduce((a, s) => a + s.measurements.length, 0);
  content().innerHTML = `
    <div class="page-head">
      <div><h2>Engine specifications</h2><p>Download the standardized template, fill it in for an engine, and upload it.</p></div>
      <div class="spacer"></div>
      <button class="btn" id="dl-template">${ICONS.download} Download template</button>
      <button class="btn primary" id="up-spec">${ICONS.upload} Upload spec</button>
    </div>
    <div class="card table-card" style="margin-bottom:20px"><table>
      <thead><tr><th>Engine type</th><th>Description</th><th>Sections</th><th>Measurements</th><th>Revision</th><th></th></tr></thead>
      <tbody>
        <tr><td><b>${SPEC.engine.type}</b></td><td>${SPEC.engine.manufacturer} ${SPEC.engine.displacementCc}cc ${SPEC.engine.configuration}</td><td>${SPEC.sections.length}</td><td>${nMeas}</td><td>${SPEC.engine.revision}</td><td>${badge('ok', 'Active')}</td></tr>
        <tr><td><b>SBC350</b></td><td>Chevrolet 5735cc V8</td><td>—</td><td>—</td><td>—</td><td>${badge('muted', 'Not uploaded')}</td></tr>
      </tbody></table></div>
    <div class="page-head"><h2 style="font-size:16px">${SPEC.engine.type} · specification sections</h2></div>
    <div class="grid cards">${SPEC.sections.map(s => `
      <div class="section-block"><h4>${s.title} <span class="badge muted" style="float:right">${s.measurements.length}</span></h4>
      <div style="padding:12px 14px">${s.measurements.slice(0, 4).map(m => `<span class="chip">${m.label}</span>`).join('')}${s.measurements.length > 4 ? `<span class="chip">+${s.measurements.length - 4} more</span>` : ''}</div></div>`).join('')}</div>`;
  $('#dl-template').addEventListener('click', () => toast('Downloading engine-spec.template.json'));
  $('#up-spec').addEventListener('click', () => toast('Validated against schema ✓ — stored as new revision'));
}

/* ---------- toast + events ---------- */
let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

function navigate(route, arg) {
  state.route = route;
  if (route === 'build') { state.buildId = arg; state.tab = 'workflow'; }
  window.scrollTo(0, 0);
  render();
}

document.addEventListener('click', e => {
  const nav = e.target.closest('[data-nav]');
  if (nav) return navigate(nav.dataset.nav);
  const b = e.target.closest('[data-build]');
  if (b) return navigate('build', b.dataset.build);
  const tab = e.target.closest('[data-tab]');
  if (tab) { state.tab = tab.dataset.tab; renderBuild(); return; }
  const task = e.target.closest('[data-task]');
  if (task) { state.taskId = task.dataset.task; renderWorkflow($('#tab-body')); return; }
});

$('#google-signin').addEventListener('click', () => {
  $('#view-login').classList.add('hidden');
  $('#view-app').classList.remove('hidden');
  render();
});

/* ---------- boot ---------- */
fetch('data/vg33e.engine-spec.json')
  .then(r => r.json())
  .then(spec => { SPEC = spec; })
  .catch(() => { SPEC = { engine: { type: 'VG33E', manufacturer: 'Nissan', displacementCc: 3275, configuration: 'V6', revision: 'example-1' }, sections: [] }; });
