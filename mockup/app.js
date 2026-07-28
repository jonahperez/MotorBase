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
  { id: 'vg33e', name: 'VG33E Pathfinder rebuild', engine: 'VG33E', engineName: 'Nissan 3.3L V6', status: 'in_progress', specRev: 'example-1', progress: 45,
    layout: { config: 'V6', heads: ['Left', 'Right'], cylinders: 6, mainJournals: 4, valves: { intake: 1, exhaust: 1 } } },
  { id: 'sbc350', name: 'SBC 350 street build', engine: 'SBC350', engineName: 'Chevrolet 5.7L V8', status: 'planned', specRev: '—', progress: 8 },
  { id: 'coyote', name: 'Coyote 5.0 track engine', engine: 'COYOTE', engineName: 'Ford 5.0L V8', status: 'completed', specRev: 'v2', progress: 100 },
];

const PHASES = ['TEARDOWN', 'CLEAN', 'INSPECT', 'MACHINE', 'ASSEMBLE', 'SYSTEMS', 'FINAL'];

const TASKS = [
  { id: 't1', phase: 'TEARDOWN', name: 'Disassemble & label components', sub: 'Bag hardware, record teardown notes', status: 'done' },
  { id: 't2', phase: 'CLEAN', name: 'Hot-tank & clean block / heads', sub: 'Degrease, chase threads', status: 'done' },
  { id: 't5', phase: 'INSPECT', name: 'Examine cylinder heads', status: 'todo' },
  { id: 't3', phase: 'INSPECT', name: 'Examine cylinders', status: 'done' },
  { id: 't4', phase: 'INSPECT', name: 'Examine pistons', status: 'todo' },
  { id: 't6', phase: 'INSPECT', name: 'Evaluate valvetrain', status: 'issue' },
  { id: 'tcam', phase: 'INSPECT', name: 'Camshaft inspection', status: 'todo' },
  { id: 'tc', phase: 'INSPECT', name: 'Crankshaft inspection', status: 'todo' },
  { id: 'tr', phase: 'INSPECT', name: 'Connecting rods & bearings', status: 'todo' },
  { id: 'top', phase: 'INSPECT', name: 'Oil pump', status: 'todo' },
  { id: 'twp', phase: 'INSPECT', name: 'Water pump', status: 'todo' },
  { id: 'tt', phase: 'INSPECT', name: 'Timing chain / belt', status: 'todo' },
  { id: 't8', phase: 'MACHINE', name: 'Bore & hone to piston size', status: 'todo' },
  { id: 't9', phase: 'MACHINE', name: 'Valve job & resurface heads', status: 'todo' },
  { id: 'tbal', phase: 'MACHINE', name: 'Balance rotating assembly', status: 'todo' },
  { id: 't10', phase: 'ASSEMBLE', name: 'Set bearing clearances & torque', sub: 'Angular torque per precautions', status: 'todo' },
  { id: 't11', phase: 'ASSEMBLE', name: 'Degree cams & set valvetrain', status: 'todo' },
  { id: 'tlub', phase: 'SYSTEMS', name: 'Lubrication system', status: 'todo' },
  { id: 'tcool', phase: 'SYSTEMS', name: 'Cooling system', status: 'todo' },
  { id: 'tdiag', phase: 'SYSTEMS', name: 'Overheating diagnostics', status: 'todo' },
  { id: 't12', phase: 'FINAL', name: 'Compression check & final specs', status: 'todo' },
];

// Pre-entered per-instance readings that produce the shown task statuses.
// Field format: `${section}.${key}` or `${section}.${key}@${instanceKey}`.
const READINGS = {
  t3: {
    'cylinder_block.bore_inner_diameter@1': 91.505, 'cylinder_block.bore_inner_diameter@2': 91.506,
    'cylinder_block.bore_inner_diameter@3': 91.512, 'cylinder_block.bore_inner_diameter@4': 91.508,
    'cylinder_block.bore_inner_diameter@5': 91.503, 'cylinder_block.bore_inner_diameter@6': 91.521,
  },
  t6: { 'valve.to_guide_clearance_exhaust@C4EX': 0.130, 'valve.stem_diameter_intake@C1IN': 6.900 },
};

// Live measurement values (seeded from prefilled readings) + per-step notes.
const VALUES = {};
Object.entries(READINGS).forEach(([t, obj]) => { VALUES[t] = { ...obj }; });
const NOTES = {};
const getV = (t, field) => (VALUES[t] && VALUES[t][field] != null) ? VALUES[t][field] : '';
const setV = (t, field, v) => { (VALUES[t] = VALUES[t] || {})[field] = v; };

const DEFAULT_LAYOUT = { config: 'I4', heads: ['Head'], cylinders: 4, mainJournals: 5, valves: { intake: 1, exhaust: 1 } };
const getLayout = () => (BUILDS.find(b => b.id === state.buildId) || {}).layout || DEFAULT_LAYOUT;

// Resolve a step measurement ref to { id, m, scope, section }.
function resolveStepMeas(entry) {
  if (Array.isArray(entry)) {
    const [sk, mk, scope] = entry;
    return { id: `${sk}.${mk}`, m: findMeasurement(sk, mk), scope: scope || 'single', section: sk };
  }
  return { id: `inline.${entry.key}`, m: entry, scope: entry.scope || 'single', section: 'inline' };
}

// Build the list of instances for a measurement given its scope + the layout.
function instancesFor(scope, m) {
  const L = getLayout();
  const range = (n, fn) => Array.from({ length: n }, (_, i) => fn(i + 1));
  switch (scope) {
    case 'head': return L.heads.map(h => ({ key: h[0], label: h }));
    case 'cylinder':
    case 'piston': return range(L.cylinders, n => ({ key: String(n), label: 'Cyl ' + n }));
    case 'main_journal': return range(L.mainJournals, n => ({ key: 'M' + n, label: 'Main ' + n }));
    case 'rod': return range(L.cylinders, n => ({ key: 'R' + n, label: 'Rod ' + n }));
    case 'camshaft': return L.heads.map(h => ({ key: h[0] + 'cam', label: h + ' cam' }));
    case 'valve': {
      const groups = m.appliesTo === 'intake' ? ['IN'] : m.appliesTo === 'exhaust' ? ['EX'] : ['IN', 'EX'];
      const out = [];
      for (let c = 1; c <= L.cylinders; c++) for (const g of groups) {
        const count = g === 'IN' ? L.valves.intake : L.valves.exhaust;
        for (let i = 1; i <= count; i++) {
          const sfx = count > 1 ? i : '';
          out.push({ key: `C${c}${g}${sfx}`, label: `C${c} ${g}${sfx}` });
        }
      }
      return out;
    }
    default: return [{ key: '', label: '' }];
  }
}
const fieldFor = (res, instKey) => res.id + (instKey ? '@' + instKey : '');

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
const state = { route: 'dashboard', buildId: null, tab: 'workflow', taskId: 't5', step: 0, renaming: false };

/* ---------- spec helpers (real algorithms) ---------- */
function findMeasurement(sectionKey, measKey) {
  const s = SPEC.sections.find(x => x.key === sectionKey);
  return s && s.measurements.find(x => x.key === measKey);
}
const lo = r => (r && r.min != null) ? r.min : -Infinity;
const hi = r => (r && r.max != null) ? r.max : Infinity;

function evaluate(m, reading) {
  if (m && m.type === 'check') {
    if (reading === 'pass') return { cls: 'ok', text: 'Pass' };
    if (reading === 'fail') return { cls: 'bad', text: 'Fail' };
    if (reading === 'na') return { cls: 'muted', text: 'N/A' };
    return { cls: 'muted', text: '—' };
  }
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
    // Within the limit: if there is also a standard range, it's serviceable-but-out-of-standard;
    // if the limit is the only spec (e.g. "more than 59 kPa"), within-limit is in spec.
    return std ? { cls: 'warn', text: 'Out of standard' } : { cls: 'ok', text: 'In spec' };
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

const SHORT = { 'In spec': 'OK', 'Out of standard': 'OoS', 'Beyond limit': 'LIM', 'No grade match': 'NG', 'Off nominal': 'OoS', 'Recorded': 'OK', '—': '–' };
function miniBadge(e) {
  const t = e.text.startsWith('Grade ') ? 'G' + e.text.slice(6) : (SHORT[e.text] || e.text);
  return `<span class="badge ${e.cls} mini" title="${e.text}">${t}</span>`;
}

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
      <div><h2 class="build-title">${state.renaming
        ? `<input id="rename-input" class="rename-input" value="${b.name.replace(/"/g, '&quot;')}"/><button class="btn sm primary" data-rename-save>Save</button><button class="btn sm" data-rename-cancel>Cancel</button>`
        : `${b.name} <button class="icon-btn" data-rename title="Rename build">✎</button>`}</h2><p>${b.engineName} · engine type <b>${b.engine}</b> · spec revision <b>${b.specRev}</b></p>
      ${b.layout ? `<p class="layout-line">${b.layout.config} · ${b.layout.heads.length} cylinder head${b.layout.heads.length > 1 ? 's' : ''} · ${b.layout.cylinders} cylinders · ${b.layout.cylinders * (b.layout.valves.intake + b.layout.valves.exhaust)} valves (${b.layout.valves.intake} intake + ${b.layout.valves.exhaust} exhaust per cylinder) · ${b.layout.mainJournals} mains</p>` : ''}
      </div>
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
  renderTaskPanel();
}

function renderTaskPanel() {
  const panel = $('#meas-panel');
  const t = TASKS.find(x => x.id === state.taskId);
  if (!t) { panel.innerHTML = '<p class="panel-sub">Select a task.</p>'; return; }
  if (PROCEDURES[t.id]) return renderWalkthrough(panel, t);
  renderMeasPanel(panel, t);
}

function evalField(t, r, instKey) { return evaluate(r.m, getV(t.id, fieldFor(r, instKey))); }

function measBlock(t, entry, idx) {
  const r = resolveStepMeas(entry);
  if (!r.m) return '';
  if (r.m.type === 'check') {
    const f = fieldFor(r, ''); const val = getV(t.id, f); const e = evaluate(r.m, val);
    const opt = (v, l) => `<option value="${v}" ${val === v ? 'selected' : ''}>${l}</option>`;
    return `<div class="meas-row wmeas">
      <div class="meas-name"><span class="mknum">${idx + 1}</span>${r.m.label}<small>${r.m.note || 'pass / fail check'}</small></div>
      <div class="meas-input"><select class="check-sel" data-mv="${t.id}|${f}">${opt('', '—')}${opt('pass', 'Pass')}${opt('fail', 'Fail')}${opt('na', 'N/A')}</select></div>
      <div data-badge="${f}">${badge(e.cls, e.text)}</div>
    </div>`;
  }
  const insts = instancesFor(r.scope, r.m);
  const single = insts.length === 1 && insts[0].key === '';
  if (single) {
    const f = fieldFor(r, ''); const val = getV(t.id, f); const e = evaluate(r.m, val);
    return `<div class="meas-row wmeas">
      <div class="meas-name"><span class="mknum">${idx + 1}</span>${r.m.label}<small>${specRangeText(r.m)} ${r.m.unit}</small></div>
      <div class="meas-input"><input type="number" step="0.001" value="${val !== '' ? val : ''}" data-mv="${t.id}|${f}"><span class="unit">${r.m.unit}</span></div>
      <div data-badge="${f}">${badge(e.cls, e.text)}</div>
    </div>`;
  }
  const cells = insts.map(inst => {
    const f = fieldFor(r, inst.key); const val = getV(t.id, f); const e = evalField(t, r, inst.key);
    return `<div class="inst-cell">
      <span class="inst-lbl">${inst.label}</span>
      <input type="number" step="0.001" value="${val !== '' ? val : ''}" data-mv="${t.id}|${f}">
      <span class="inst-badge" data-badge="${f}">${miniBadge(e)}</span>
    </div>`;
  }).join('');
  const applies = r.m.appliesTo ? ` <span class="tag">${r.m.appliesTo}</span>` : '';
  return `<div class="meas-block">
    <div class="meas-block-head"><span class="mknum">${idx + 1}</span><b>${r.m.label}${applies}</b><small>${specRangeText(r.m)} ${r.m.unit} · ${insts.length} readings</small></div>
    <div class="inst-grid">${cells}</div>
  </div>`;
}

function renderWalkthrough(panel, t) {
  const proc = PROCEDURES[t.id];
  const n = proc.steps.length;
  const si = Math.max(0, Math.min(n - 1, state.step));
  const step = proc.steps[si];

  const stepFilled = i => {
    const ms = proc.steps[i].m; if (!ms.length) return false;
    return ms.every(entry => { const r = resolveStepMeas(entry); return r.m && instancesFor(r.scope, r.m).every(inst => getV(t.id, fieldFor(r, inst.key)) !== ''); });
  };
  const stepper = proc.steps.map((s, i) => {
    const done = stepFilled(i), cur = i === si;
    return `<button class="wstep ${cur ? 'cur' : ''} ${done ? 'done' : ''}" data-gostep="${i}"><span class="wnum">${done && !cur ? '✓' : i + 1}</span><span class="wt">${s.title}</span></button>`;
  }).join('<span class="wsep"></span>');

  const partLabel = step.part || proc.part || t.name;
  const blocks = step.calc === 'bore' ? boreCalc(t)
    : step.calc === 'balance' ? balanceCalc(t)
    : step.m.length ? step.m.map((entry, idx) => measBlock(t, entry, idx)).join('')
    : '<p class="panel-sub">Visual / note-only step — record findings below.</p>';

  const beyond = [];
  step.m.forEach(entry => {
    const r = resolveStepMeas(entry); if (!r.m) return;
    const insts = r.m.type === 'check' ? [{ key: '', label: '' }] : instancesFor(r.scope, r.m);
    insts.forEach(inst => { if (['Beyond limit', 'Fail'].includes(evalField(t, r, inst.key).text)) beyond.push({ r, inst }); });
  });
  const hasDiagram = !!DIAGRAMS[step.diagram];
  const noteKey = `${t.id}.${si}`;
  panel.innerHTML = `
    <div class="wk-head">
      <div><h3 class="panel-title">${t.name}</h3><p class="panel-sub">Step ${si + 1} of ${n} · ${step.title}</p></div>
      <div class="wk-nav"><button class="btn sm" data-stepnav="-1" ${si === 0 ? 'disabled' : ''}>‹ Prev</button><button class="btn primary sm" data-stepnav="1">${si === n - 1 ? 'Finish ✓' : 'Next ›'}</button></div>
    </div>
    <div class="wstepper">${stepper}</div>
    <div class="wk-body ${hasDiagram ? '' : 'no-diagram'}">
      ${hasDiagram ? `<div class="diagram">${DIAGRAMS[step.diagram]}</div>` : ''}
      <div class="wk-side">
        <div class="wk-instr"><span class="chip">🛠 ${step.tool}</span><p>${step.instruction}</p>${step.caution ? `<div class="mini-caution">⚠ ${step.caution}</div>` : ''}</div>
        <div class="wk-meas">${blocks}</div>
        ${beyond.length ? `<div class="callout"><span>⚠</span><div><b>${beyond.length} reading${beyond.length > 1 ? 's are' : ' is'} beyond the service limit</b> (${beyond.map(b => b.inst.label || b.r.m.label).join(', ')}). Flag the replacement part.</div><button class="btn primary sm" data-addneed="1">${ICONS.plus} Add to parts needed</button></div>` : ''}
        <div class="reject-row"><button class="btn sm reject-btn" data-reject="1">✕ Mark “${partLabel}” unacceptable — add to parts</button></div>
        <label class="wk-notes-l">Notes for this step</label>
        <textarea class="wk-notes" data-note="${noteKey}" placeholder="Observations, tooling, sublet machine work, decisions…">${NOTES[noteKey] || ''}</textarea>
      </div>
    </div>`;

  panel.querySelectorAll('[data-mv]').forEach(inp => {
    const parse = () => { const bar = inp.dataset.mv.indexOf('|'); return [inp.dataset.mv.slice(0, bar), inp.dataset.mv.slice(bar + 1)]; };
    // Live badge update while typing (no re-render, so focus/caret is preserved).
    inp.addEventListener('input', () => {
      const [tid, field] = parse(); setV(tid, field, inp.value);
      const e = evaluate(fieldToResolved(field).m, inp.value);
      const b = panel.querySelector(`[data-badge="${cssEsc(field)}"]`);
      if (b) b.innerHTML = b.classList.contains('inst-badge') ? miniBadge(e) : badge(e.cls, e.text);
    });
    // On commit (blur / dropdown change) re-render so the callout + stepper refresh.
    inp.addEventListener('change', () => { const [tid, field] = parse(); setV(tid, field, inp.value); renderWalkthrough(panel, t); });
  });
  const ta = panel.querySelector('textarea[data-note]');
  if (ta) ta.addEventListener('input', () => { NOTES[ta.dataset.note] = ta.value; });
  const addn = panel.querySelector('[data-addneed]');
  if (addn) addn.addEventListener('click', () => {
    const label = beyond.length ? beyond[0].r.m.label : 'Replacement part';
    const where = beyond.length && beyond[0].inst.label ? ` (${beyond[0].inst.label})` : '';
    BOM.push({ part: label + where + ' — replace', pn: '—', need: 1, ordered: 0, received: 0, src: 'inspection' });
    toast('Added “' + label + '” to parts needed');
    state.tab = 'bom'; renderBuild();
  });
  const rej = panel.querySelector('[data-reject]');
  if (rej) rej.addEventListener('click', () => {
    BOM.push({ part: partLabel + ' — replace / machine', pn: '—', need: 1, ordered: 0, received: 0, src: 'inspection' });
    toast('Flagged “' + partLabel + '” as unacceptable — added to parts');
    state.tab = 'bom'; renderBuild();
  });
  if (step.calc === 'bore') bindBoreCalc(panel, t);
  if (step.calc === 'balance') bindBalanceCalc(panel, t);
}

/* ---- Cylinder bore grade calculator (6 readings per cylinder) ---- */
const BORE_POS = ['TX', 'TY', 'MX', 'MY', 'BX', 'BY'];
function computeBore(t, n) {
  const g = p => { const v = getV(t.id, `cylinder_block.bore.C${n}.${p}`); return v === '' || v == null || isNaN(v) ? null : Number(v); };
  const v = {}; BORE_POS.forEach(p => v[p] = g(p));
  const levelMean = L => { const a = v[L + 'X'], b = v[L + 'Y']; if (a != null && b != null) return (a + b) / 2; return a != null ? a : b; };
  const T = levelMean('T'), M = levelMean('M'), B = levelMean('B');
  const means = [['T', T], ['M', M], ['B', B]].filter(x => x[1] != null);
  const reads = BORE_POS.map(p => v[p]).filter(x => x != null);
  if (!reads.length) return { empty: true };
  const oorAt = L => (v[L + 'X'] != null && v[L + 'Y'] != null) ? Math.abs(v[L + 'X'] - v[L + 'Y']) : null;
  const oorVals = ['T', 'M', 'B'].map(oorAt).filter(x => x != null);
  const oor = oorVals.length ? Math.max(...oorVals) : null;
  const maxDia = Math.max(...reads);
  let taper = null, shape = '—';
  if (means.length >= 2) {
    const vals = means.map(m => m[1]); taper = Math.max(...vals) - Math.min(...vals);
    if (taper < 0.005) shape = 'Straight';
    else { const top = means.reduce((a, b) => b[1] > a[1] ? b : a); shape = top[0] === 'M' ? 'Barrel' : top[0] === 'T' ? 'Tapered to top' : 'Tapered to bottom'; }
  }
  const spec = findMeasurement('cylinder_block', 'bore_inner_diameter');
  let grade = null;
  (spec.grades || []).forEach(gr => { if (maxDia >= (gr.min ?? -1e9) && maxDia <= (gr.max ?? 1e9)) grade = gr.grade; });
  const oorLim = 0.015, taperLim = 0.015;
  const dev = Math.max(oor || 0, taper || 0);
  let cls = 'ok', txt = grade ? 'Grade ' + grade : 'Size?';
  if (!grade) { cls = 'warn'; txt = 'Oversize / regrind'; }
  if ((oor != null && oor > oorLim) || (taper != null && taper > taperLim)) { cls = 'bad'; txt = 'Beyond limit — bore'; }
  return { maxDia, grade, oor, taper, shape, dev, cls, txt };
}
function boreCyl(t, n) {
  const inp = p => `<input type="number" step="0.001" value="${getV(t.id, `cylinder_block.bore.C${n}.${p}`)}" data-bore="${n}|${p}">`;
  const row = L => `<div class="bore-row"><span>${L}</span>${inp(L + 'X')}${inp(L + 'Y')}</div>`;
  return `<div class="bore-cyl">
    <div class="bore-cyl-head">Cylinder ${n}<span data-bore-status="${n}"></span></div>
    <div class="bore-grid"><div class="bore-row bore-hdr"><span></span><em>X</em><em>Y</em></div>${row('T')}${row('M')}${row('B')}</div>
    <div class="bore-out" data-bore-out="${n}"></div>
  </div>`;
}
function boreOutHtml(r) {
  if (r.empty) return '<span class="bore-hint">Enter readings…</span>';
  const f = x => x == null ? '—' : x.toFixed(3);
  return `<span class="bchip">grade <b>${r.grade || 'OS'}</b></span><span class="bchip">OOR <b>${f(r.oor)}</b></span><span class="bchip">taper <b>${f(r.taper)}</b></span><span class="bchip">max dev <b>${f(r.dev)}</b></span><span class="bchip shape">${r.shape}</span>`;
}
function boreCalc(t) {
  const cards = Array.from({ length: getLayout().cylinders }, (_, i) => boreCyl(t, i + 1)).join('');
  return `<div class="panel-sub" style="margin-bottom:10px">6 readings per cylinder (Top / Middle / Bottom × X / Y). Grade, out-of-round, taper, wear shape and max deviation are computed live.</div><div class="bore-cyls">${cards}</div>`;
}
function refreshBoreCyl(panel, t, n) {
  const r = computeBore(t, n);
  const out = panel.querySelector(`[data-bore-out="${n}"]`); if (out) out.innerHTML = boreOutHtml(r);
  const st = panel.querySelector(`[data-bore-status="${n}"]`); if (st) st.innerHTML = r.empty ? '' : badge(r.cls, r.txt);
}
function bindBoreCalc(panel, t) {
  for (let n = 1; n <= getLayout().cylinders; n++) refreshBoreCyl(panel, t, n);
  panel.querySelectorAll('input[data-bore]').forEach(inp => inp.addEventListener('input', () => {
    const [n, p] = inp.dataset.bore.split('|');
    setV(t.id, `cylinder_block.bore.C${n}.${p}`, inp.value);
    refreshBoreCyl(panel, t, +n);
  }));
}

/* ---- Rotating-assembly bob-weight calculator ---- */
const BAL_FIELDS = [
  { k: 'piston', l: 'Piston', grp: 'recip' }, { k: 'pin', l: 'Pin', grp: 'recip' }, { k: 'rings', l: 'Ring set', grp: 'recip' },
  { k: 'locks', l: 'Locks / clips', grp: 'recip' }, { k: 'rod_small', l: 'Rod small-end', grp: 'recip' },
  { k: 'rod_big', l: 'Rod big-end', grp: 'rot' }, { k: 'bearing', l: 'Rod bearing (×2)', grp: 'rot' }, { k: 'oil', l: 'Oil allowance', grp: 'rot' },
];
function computeBalance(t) {
  const g = k => { const v = getV(t.id, 'balance.' + k); return v === '' || v == null || isNaN(v) ? 0 : Number(v); };
  const recip = g('piston') + g('pin') + g('rings') + g('locks') + g('rod_small');
  const rotating = g('rod_big') + 2 * g('bearing') + g('oil');
  return { recip, rotating, bob: rotating + 0.5 * recip };
}
function balanceCalc(t) {
  if (getV(t.id, 'balance.oil') === '') setV(t.id, 'balance.oil', 0.5);
  const input = f => `<div class="bal-field"><label>${f.l}</label><div class="in"><input type="number" step="0.1" value="${getV(t.id, 'balance.' + f.k)}" data-bal="${f.k}"><span class="unit">g</span></div></div>`;
  const grp = (title, g) => `<div class="bal-grp"><h5>${title}</h5>${BAL_FIELDS.filter(f => f.grp === g).map(input).join('')}</div>`;
  return `<div class="bal-calc">
    <div class="bal-inputs">${grp('Reciprocating', 'recip')}${grp('Rotating', 'rot')}</div>
    <div class="bal-out" data-bal-out></div>
    <div class="bal-note">Bob weight = 100% rotating + 50% reciprocating (typical V-engine). Bearings count double per journal; ~0.5 g added for oil. A ¼-oz imbalance at 4″ makes ~63 lb of force at 6,000 rpm.</div>
  </div>`;
}
function refreshBalance(panel, t) {
  const r = computeBalance(t);
  const out = panel.querySelector('[data-bal-out]');
  if (out) out.innerHTML = `<span class="bchip">reciprocating <b>${r.recip.toFixed(1)} g</b></span><span class="bchip">rotating <b>${r.rotating.toFixed(1)} g</b></span><span class="bchip big">bob weight <b>${r.bob.toFixed(1)} g</b></span>`;
}
function bindBalanceCalc(panel, t) {
  refreshBalance(panel, t);
  panel.querySelectorAll('input[data-bal]').forEach(inp => inp.addEventListener('input', () => { setV(t.id, 'balance.' + inp.dataset.bal, inp.value); refreshBalance(panel, t); }));
}

// Resolve a stored field string back to its measurement object (for live re-eval).
function fieldToResolved(field) {
  const id = field.split('@')[0];
  if (id.startsWith('inline.')) {
    for (const p of Object.values(PROCEDURES)) for (const s of p.steps) for (const e of s.m)
      if (!Array.isArray(e) && `inline.${e.key}` === id) return { m: e };
    return { m: {} };
  }
  const [sk, mk] = id.split('.');
  return { m: findMeasurement(sk, mk) || {} };
}
const cssEsc = s => (window.CSS && CSS.escape) ? CSS.escape(s) : s.replace(/[^a-zA-Z0-9_-]/g, '\\$&');

function taskRow(t) {
  const proc = PROCEDURES[t.id];
  const stateCls = t.status === 'done' ? 'done' : t.status === 'issue' ? 'issue' : '';
  const tick = t.status === 'done' ? ICONS.check : t.status === 'issue' ? ICONS.bang : '';
  const active = t.id === state.taskId ? 'active' : '';
  const right = t.status === 'issue' ? badge('bad', 'Needs part') : t.status === 'done' ? badge('ok', 'Pass') : (proc ? badge('muted', proc.steps.length + ' steps') : '');
  return `<div class="task ${stateCls} ${active}" data-task="${t.id}">
    <div class="tick">${tick}</div>
    <div><div class="tname">${t.name}</div>${t.sub ? `<div class="tsub">${t.sub}</div>` : (proc ? `<div class="tsub">${proc.steps.length} steps</div>` : '')}</div>
    <div class="tright">${right}</div>
  </div>`;
}

function renderMeasPanel(panel, t) {
  panel.innerHTML = `<h3 class="panel-title">${t.name}</h3><p class="panel-sub">${t.sub || 'This step has no recorded measurements yet.'}</p><button class="btn">Mark complete</button>`;
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
  if (route === 'build') { state.buildId = arg; state.tab = 'workflow'; state.step = 0; }
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
  if (task) { state.taskId = task.dataset.task; state.step = 0; renderWorkflow($('#tab-body')); return; }
  const sn = e.target.closest('[data-stepnav]');
  if (sn) {
    const proc = PROCEDURES[state.taskId]; if (!proc) return;
    const d = +sn.dataset.stepnav, n = proc.steps.length;
    if (state.step + d >= n) { toast('Inspection recorded ✓'); return; }
    state.step = Math.max(0, Math.min(n - 1, state.step + d));
    renderWorkflow($('#tab-body')); return;
  }
  const gs = e.target.closest('[data-gostep]');
  if (gs) { state.step = +gs.dataset.gostep; renderWorkflow($('#tab-body')); return; }
  if (e.target.closest('[data-rename]')) { state.renaming = true; renderBuild(); const i = $('#rename-input'); if (i) { i.focus(); i.select(); } return; }
  if (e.target.closest('[data-rename-cancel]')) { state.renaming = false; renderBuild(); return; }
  if (e.target.closest('[data-rename-save]')) {
    const i = $('#rename-input'); const b = BUILDS.find(x => x.id === state.buildId);
    if (i && b && i.value.trim()) { b.name = i.value.trim(); toast('Build renamed'); }
    state.renaming = false; renderBuild(); return;
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.id === 'rename-input') { e.preventDefault(); $('[data-rename-save]')?.click(); }
  if (e.key === 'Escape' && e.target.id === 'rename-input') { state.renaming = false; renderBuild(); }
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
