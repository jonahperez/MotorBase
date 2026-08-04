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
];

const BUILDS = [
  {
    id: 'vg33e', name: 'VG33E Pathfinder rebuild', engine: 'VG33E', engineName: 'Nissan 3.3L V6',
    status: 'in_progress', specRev: 'example-1', progress: 45,
    archTemplateId: 'v6_sohc_rocker',
    architecture: cloneArch(ARCH_TEMPLATES.find(t => t.id === 'v6_sohc_rocker')),
  },
  {
    id: 'sbc350', name: 'SBC 350 street build', engine: 'SBC350', engineName: 'Chevrolet 5.7L V8',
    status: 'planned', specRev: '—', progress: 8,
    archTemplateId: 'v8_ohv_pushrod',
    architecture: cloneArch(ARCH_TEMPLATES.find(t => t.id === 'v8_ohv_pushrod')),
  },
  {
    id: 'coyote', name: 'Coyote 5.0 track engine', engine: 'COYOTE', engineName: 'Ford 5.0L V8',
    status: 'completed', specRev: 'v2', progress: 100,
    archTemplateId: 'i4_dohc_16v',
    architecture: (() => {
      const a = cloneArch(ARCH_TEMPLATES.find(t => t.id === 'i4_dohc_16v'));
      // Demo: Coyote-like counts on a DOHC template (V8 would be a future template)
      a.block.form = 'V'; a.block.banks = ['Left', 'Right']; a.block.cylinders = 8; a.block.mainJournals = 5;
      syncHeadsFromBlock(a);
      a.camshafts = [
        { id: 'left_in', mount: 'head', headId: 'left', role: 'intake', label: 'Left intake cam' },
        { id: 'left_ex', mount: 'head', headId: 'left', role: 'exhaust', label: 'Left exhaust cam' },
        { id: 'right_in', mount: 'head', headId: 'right', role: 'intake', label: 'Right intake cam' },
        { id: 'right_ex', mount: 'head', headId: 'right', role: 'exhaust', label: 'Right exhaust cam' },
      ];
      a.family = 'dohc_bucket';
      a.valvetrain = { type: 'bucket_follower', hasPushrods: false, hasLifters: false, hasRockerShafts: false };
      a.valvesPerCylinder = { intake: 2, exhaust: 2 };
      return a;
    })(),
  },
];

const PHASES = [
  { key: 'INTAKE', num: 1, label: 'Intake — general inspection' },
  { key: 'TEARDOWN', num: 2, label: 'Teardown' },
  { key: 'CLEAN', num: 3, label: 'Clean' },
  { key: 'INSPECT', num: 4, label: 'Inspect' },
  { key: 'MACHINE', num: 5, label: 'Machine' },
  { key: 'ASSEMBLE', num: 6, label: 'Assemble' },
  { key: 'SYSTEMS', num: 7, label: 'Systems check' },
  { key: 'FINAL', num: 8, label: 'Final' },
];

const TASKS = [
  { id: 't0', phase: 'INTAKE', name: 'General engine inspection', sub: 'As-received survey before teardown', status: 'todo' },
  { id: 't1', phase: 'TEARDOWN', name: 'Disassemble & label components', sub: 'Bag hardware, record teardown notes', status: 'done' },
  { id: 't2', phase: 'CLEAN', name: 'Hot-tank & clean block / heads', sub: 'Degrease, chase threads', status: 'done' },
  { id: 't5', phase: 'INSPECT', name: 'Examine cylinder heads', status: 'todo' },
  { id: 't3', phase: 'INSPECT', name: 'Examine cylinders', status: 'done' },
  { id: 't4', phase: 'INSPECT', name: 'Examine pistons', status: 'todo' },
  { id: 't6', phase: 'INSPECT', name: 'Evaluate valvetrain', status: 'issue' },
  { id: 'tspring', phase: 'INSPECT', name: 'Valve springs', status: 'todo' },
  { id: 'trockshaft', phase: 'INSPECT', name: 'Rocker arm shaft', status: 'todo', requires: ['shaft_rocker'] },
  { id: 'trocker', phase: 'INSPECT', name: 'Rocker arms', status: 'todo', requires: ['shaft_rocker'] },
  { id: 'tpedrocker', phase: 'INSPECT', name: 'Pedestal rockers', status: 'todo', requires: ['pedestal_rocker'] },
  { id: 'tpushrod', phase: 'INSPECT', name: 'Pushrods', status: 'todo', requires: ['pushrods'] },
  { id: 'tlifter', phase: 'INSPECT', name: 'Lifters / tappets', status: 'todo', requires: ['lifters'] },
  { id: 'tbucket', phase: 'INSPECT', name: 'Bucket followers', status: 'todo', requires: ['bucket_follower'] },
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

// Pre-entered per-instance readings (VG33E demo only).
// Field format: `${section}.${key}` or `${section}.${key}@${instanceKey}`.
const READINGS_VG33E = {
  t3: {
    'cylinder_block.bore_inner_diameter@1': 91.505, 'cylinder_block.bore_inner_diameter@2': 91.506,
    'cylinder_block.bore_inner_diameter@3': 91.512, 'cylinder_block.bore_inner_diameter@4': 91.508,
    'cylinder_block.bore_inner_diameter@5': 91.503, 'cylinder_block.bore_inner_diameter@6': 91.521,
  },
  t6: { 'valve.to_guide_clearance_exhaust@C4EX': 0.130, 'valve.stem_diameter_intake@C1IN': 6.900 },
};

function emptyBuildStore() {
  return { values: {}, notes: {}, replace: {}, needs: [], cart: [], pos: [], doneTaskIds: [] };
}

function seedValues(readings) {
  const values = {};
  Object.entries(readings || {}).forEach(([t, obj]) => { values[t] = { ...obj }; });
  return values;
}

const BUILD_STORES = {
  vg33e: {
    values: seedValues(READINGS_VG33E),
    notes: {},
    replace: {},
    doneTaskIds: ['t1', 't2'],
    needs: [
      {
        id: 'n1', part: 'Main bearing set — grade 2 (green)', pn: 'MB-VG33-STD', need: 1,
        why: 'inspection', reason: 'Inspect › Crankshaft — grade from clearance', taskId: 'tc',
        fulfill: 'order', estUnitCost: 86, vendorHint: 'Summit Racing', qtyReserved: 0, qtyIssued: 0,
      },
      {
        id: 'n2', part: 'Piston ring set (STD)', pn: 'RS-9150', need: 6,
        why: 'plan', reason: 'Build kit · 6 cyl', taskId: null,
        fulfill: 'order', estUnitCost: 38, vendorHint: 'Summit Racing', qtyReserved: 0, qtyIssued: 0,
      },
      {
        id: 'n3', part: 'Head gasket set', pn: 'HG-VG33', need: 1,
        why: 'plan', reason: 'Build kit', taskId: null,
        fulfill: 'order', estUnitCost: 96, vendorHint: 'RockAuto', qtyReserved: 0, qtyIssued: 0,
      },
      {
        id: 'n4', part: 'Freeze plug kit', pn: 'FP-VG33', need: 1,
        why: 'plan', reason: 'Build kit', taskId: null,
        fulfill: 'order', estUnitCost: 24, vendorHint: 'RockAuto', qtyReserved: 0, qtyIssued: 0,
      },
      {
        id: 'n5', part: 'Anaerobic sealant', pn: 'GSK-MISC', need: 1,
        why: 'plan', reason: 'Assembly consumable', taskId: null,
        fulfill: 'stock', estUnitCost: 12, vendorHint: null, qtyReserved: 1, qtyIssued: 0,
      },
      {
        id: 'n6', part: 'Camshaft position sensor', pn: 'OEM-23731', need: 1,
        why: 'manual', reason: 'Customer request · OEM only', taskId: null,
        fulfill: 'order', estUnitCost: 96, vendorHint: 'Nissan OEM', qtyReserved: 0, qtyIssued: 0,
      },
    ],
    cart: [],
    pos: [
      {
        id: 'PO-1042', vendor: 'Summit Racing', status: 'RECEIVED', eta: null,
        lines: [
          { needId: 'n1', qtyOrdered: 1, qtyReceived: 1, unitCost: 82 },
          { needId: 'n2', qtyOrdered: 6, qtyReceived: 6, unitCost: 36 },
        ],
      },
      {
        id: 'PO-1051', vendor: 'RockAuto', status: 'SUBMITTED', eta: 'Aug 2',
        lines: [{ needId: 'n3', qtyOrdered: 1, qtyReceived: 0, unitCost: 92 }],
      },
      {
        id: 'PO-1055', vendor: 'Nissan OEM', status: 'BACKORDERED', eta: 'Aug 14',
        lines: [{ needId: 'n6', qtyOrdered: 1, qtyReceived: 0, unitCost: 96 }],
      },
    ],
  },
  sbc350: {
    ...emptyBuildStore(),
    needs: [
      {
        id: 's1', part: 'Flat tappet cam + lifter kit', pn: 'CAM-SBC-FT', need: 1,
        why: 'plan', reason: 'Build kit · OHV', taskId: null,
        fulfill: 'order', estUnitCost: 320, vendorHint: 'Summit Racing', qtyReserved: 0, qtyIssued: 0,
      },
      {
        id: 's2', part: 'Head bolt set (shop)', pn: 'BOLT-HP', need: 1,
        why: 'plan', reason: 'Use shop stock', taskId: null,
        fulfill: 'stock', estUnitCost: 64, vendorHint: null, qtyReserved: 0, qtyIssued: 0,
      },
    ],
  },
  coyote: {
    ...emptyBuildStore(),
    doneTaskIds: TASKS.map(t => t.id),
    needs: [
      {
        id: 'c1', part: 'Timing chain kit', pn: 'TC-COYOTE', need: 1,
        why: 'plan', reason: 'Build kit — received', taskId: null,
        fulfill: 'order', estUnitCost: 210, vendorHint: 'Ford OEM', qtyReserved: 0, qtyIssued: 0,
      },
    ],
    pos: [{
      id: 'PO-980', vendor: 'Ford OEM', status: 'RECEIVED', eta: null,
      lines: [{ needId: 'c1', qtyOrdered: 1, qtyReceived: 1, unitCost: 198 }],
    }],
  },
};

function store(buildId = state.buildId) {
  if (!buildId) return emptyBuildStore();
  if (!BUILD_STORES[buildId]) BUILD_STORES[buildId] = emptyBuildStore();
  return BUILD_STORES[buildId];
}

function withBuild(b, fn) {
  const prev = state.buildId;
  state.buildId = typeof b === 'string' ? b : b.id;
  try { return fn(); }
  finally { state.buildId = prev; }
}

const getV = (t, field) => {
  const values = store().values;
  return (values[t] && values[t][field] != null) ? values[t][field] : '';
};
const setV = (t, field, v) => {
  const values = store().values;
  (values[t] = values[t] || {})[field] = v;
};
const getNote = key => store().notes[key] || '';
const setNote = (key, v) => { store().notes[key] = v; };
const replStoreKey = (tid, field) => `${tid}|${field}`;
const isReplace = (tid, field) => !!store().replace[replStoreKey(tid, field)];
const componentLabel = (t, r, inst) => {
  const proc = PROCEDURES[t.id];
  const base = proc?.part || r.m.label;
  return inst?.label ? `${base} — ${inst.label}` : base;
};
function toggleReplace(tid, field, partLabel) {
  const k = replStoreKey(tid, field);
  const s = store();
  if (s.replace[k]) {
    delete s.replace[k];
    s.needs = s.needs.filter(x => x._replaceKey !== k);
    toast('Replace cleared');
  } else {
    s.replace[k] = partLabel;
    const task = TASKS.find(t => t.id === tid);
    s.needs.unshift({
      id: 'n' + Date.now().toString(36),
      part: partLabel + ' — replace',
      pn: '—',
      need: 1,
      why: 'inspection',
      reason: task ? `Inspect › ${shortTaskName(task)}` : 'Inspection finding',
      taskId: tid,
      fulfill: 'order',
      estUnitCost: 45,
      vendorHint: 'RockAuto',
      qtyReserved: 0,
      qtyIssued: 0,
      _replaceKey: k,
    });
    toast('Added to need list', {
      label: 'View',
      onClick: () => { state.tab = 'parts'; renderBuild(); },
    });
  }
}
const replaceBtn = (tid, field, partLabel) => {
  const on = isReplace(tid, field);
  const esc = partLabel.replace(/"/g, '&quot;');
  const tip = on ? 'Clear replace mark' : 'Mark for replace';
  return `<button type="button" class="repl-btn ${on ? 'on' : ''}" data-repl="${tid}|${field}" data-part="${esc}" title="${tip}" aria-label="${tip}" aria-pressed="${on}">Replace</button>`;
};

const getBuild = () => BUILDS.find(b => b.id === state.buildId);
const getArchitecture = () => getBuild()?.architecture || cloneArch(ARCH_TEMPLATES[0]);
const getLayout = () => archToLayout(getArchitecture());
const buildTasks = (b = getBuild()) => TASKS.filter(t => archTaskVisible(t, b?.architecture || getArchitecture()));

// Resolve a step measurement ref to { id, m, scope, section }.
function resolveStepMeas(entry) {
  if (Array.isArray(entry)) {
    const [sk, mk, scope] = entry;
    return { id: `${sk}.${mk}`, m: findMeasurement(sk, mk), scope: scope || 'single', section: sk };
  }
  return { id: `inline.${entry.key}`, m: entry, scope: entry.scope || 'single', section: 'inline' };
}

// Build the list of instances for a measurement given its scope + architecture.
function instancesFor(scope, m) {
  const arch = getArchitecture();
  const L = archToLayout(arch);
  const range = (n, fn) => Array.from({ length: n }, (_, i) => fn(i + 1));
  switch (scope) {
    case 'head': return arch.heads.map(h => ({ key: h.id, label: h.label }));
    case 'cylinder':
    case 'piston': return range(L.cylinders, n => ({ key: String(n), label: 'Cyl ' + n }));
    case 'main_journal': return range(L.mainJournals, n => ({ key: 'M' + n, label: 'Main ' + n }));
    case 'rod': return range(L.cylinders, n => ({ key: 'R' + n, label: 'Rod ' + n }));
    case 'camshaft': return (arch.camshafts || []).map(c => ({ key: c.id, label: c.label }));
    case 'rocker_bank': {
      const out = [];
      for (const h of arch.heads) {
        out.push({ key: `${h.id}_IN`, label: `${h.label} intake` }, { key: `${h.id}_EX`, label: `${h.label} exhaust` });
      }
      return out;
    }
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

/* ---- Parts workbench helpers (per-build via store()) ---- */
const SHOP_STOCK = [
  { pn: 'FP-VG33', name: 'Freeze plug kit', onHand: 3, reserved: 1, bin: 'A-12', unitCost: 18.5 },
  { pn: 'GSK-MISC', name: 'Anaerobic sealant', onHand: 8, reserved: 1, bin: 'C-02', unitCost: 12 },
  { pn: 'BOLT-HP', name: 'Head bolt set (shop)', onHand: 1, reserved: 0, bin: 'B-11', unitCost: 64 },
];

const STATUS_BADGE = {
  in_progress: ['warn', 'In progress'], planned: ['muted', 'Planned'], completed: ['ok', 'Completed'],
  RECEIVED: ['ok', 'Received'], SUBMITTED: ['info', 'Submitted'], BACKORDERED: ['bad', 'Backordered'],
  DRAFT: ['muted', 'Draft'],
};

let SPEC = null;
const state = {
  route: 'dashboard', buildId: null, tab: 'measurements', taskId: 't0', renaming: false,
  setup: null, // { step: 'template'|'edit', templateId, arch, name }
  parts: { filter: 'all', selected: {}, openPo: null },
};

const money = n => '$' + (Number(n) || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const money2 = n => '$' + (Number(n) || 0).toFixed(2);
const stockFor = pn => SHOP_STOCK.find(s => s.pn === pn);
const needById = id => store().needs.find(n => n.id === id);

function poQtyForNeed(needId, field) {
  let sum = 0;
  store().pos.forEach(po => po.lines.forEach(l => { if (l.needId === needId) sum += (l[field] || 0); }));
  return sum;
}

function needCoverage(n) {
  const ordered = poQtyForNeed(n.id, 'qtyOrdered');
  const receivedPo = poQtyForNeed(n.id, 'qtyReceived');
  const fromStock = n.qtyIssued || 0;
  const reserved = n.qtyReserved || 0;
  const covered = receivedPo + fromStock;
  const inFlight = Math.max(0, ordered - receivedPo);
  const stillOpen = Math.max(0, n.need - covered - inFlight - (n.fulfill === 'stock' ? reserved : 0));
  let status = 'to_order';
  if (covered >= n.need) status = 'received';
  else if (n.fulfill === 'stock' && reserved > 0 && covered + reserved >= n.need) status = 'stock_reserved';
  else if (n.fulfill === 'customer') status = 'customer';
  else if (inFlight > 0 && covered + inFlight >= n.need) status = 'on_order';
  else if (inFlight > 0 || covered > 0 || reserved > 0) status = 'partial';
  else if (n.fulfill === 'stock') status = 'use_stock';
  return { ordered, receivedPo, fromStock, reserved, covered, inFlight, stillOpen, status };
}

function needStatusBadge(n) {
  const c = needCoverage(n);
  const map = {
    received: ['ok', 'Received'],
    on_order: ['info', 'On order'],
    stock_reserved: ['primary', 'Stock reserved'],
    use_stock: ['primary', 'Use stock'],
    customer: ['warn', 'Customer'],
    partial: ['warn', 'Partial'],
    to_order: ['bad', 'To order'],
  };
  return badge(...(map[c.status] || ['muted', c.status]));
}

function partsTotals() {
  let estimate = 0, committed = 0, fromStock = 0, actual = 0;
  store().needs.forEach(n => {
    estimate += n.need * (n.estUnitCost || 0);
    const sc = stockFor(n.pn)?.unitCost ?? n.estUnitCost ?? 0;
    fromStock += ((n.qtyIssued || 0) + (n.qtyReserved || 0)) * sc;
    actual += (n.qtyIssued || 0) * sc;
  });
  store().pos.forEach(po => po.lines.forEach(l => {
    actual += (l.qtyReceived || 0) * (l.unitCost || 0);
    if (po.status !== 'RECEIVED') committed += Math.max(0, l.qtyOrdered - l.qtyReceived) * (l.unitCost || 0);
  }));
  const cart = cartTotal();
  const stillToCover = store().needs.reduce((a, n) => {
    const c = needCoverage(n);
    if (['received', 'stock_reserved', 'on_order', 'customer'].includes(c.status)) return a;
    const inCart = store().cart.filter(l => l.needId === n.id).reduce((s, l) => s + l.qty, 0);
    const open = Math.max(0, c.stillOpen - inCart);
    return a + open * (n.estUnitCost || 0);
  }, 0);
  return { estimate, committed, cart, fromStock, actual, stillToCover };
}

function blockingParts() {
  return store().needs.filter(n => {
    const c = needCoverage(n);
    return ['to_order', 'use_stock', 'partial', 'customer'].includes(c.status)
      || store().pos.some(po => po.status === 'BACKORDERED' && po.lines.some(l => l.needId === n.id));
  }).map(n => {
    const c = needCoverage(n);
    const bo = store().pos.find(po => po.status === 'BACKORDERED' && po.lines.some(l => l.needId === n.id));
    return { n, c, bo };
  });
}

function cartTotal() {
  return store().cart.reduce((a, l) => a + l.qty * l.unitCost, 0);
}

function cartGrouped() {
  const map = {};
  store().cart.forEach(l => {
    (map[l.vendor] = map[l.vendor] || []).push(l);
  });
  return map;
}

function addNeedToCart(needId, qty) {
  const n = needById(needId);
  if (!n) return;
  const vendor = n.vendorHint || 'RockAuto';
  const existing = store().cart.find(l => l.needId === needId && l.vendor === vendor);
  const unitCost = n.estUnitCost || 0;
  const q = qty ?? Math.max(1, needCoverage(n).stillOpen || n.need);
  if (existing) existing.qty += q;
  else store().cart.push({ needId, vendor, qty: q, unitCost });
  n.fulfill = 'order';
}

function reserveFromStock(needId) {
  const n = needById(needId);
  const stock = stockFor(n?.pn);
  if (!n || !stock) { toast('No matching shop stock for this PN'); return false; }
  const c = needCoverage(n);
  const want = Math.max(1, c.stillOpen || n.need - n.qtyReserved - n.qtyIssued);
  const available = stock.onHand - stock.reserved;
  if (available <= 0) { toast('None available in shop stock'); return false; }
  const take = Math.min(want, available);
  stock.reserved += take;
  n.qtyReserved += take;
  n.fulfill = 'stock';
  n.estUnitCost = stock.unitCost;
  toast(`Reserved ${take} from bin ${stock.bin}`);
  return true;
}

function issueStock(needId) {
  const n = needById(needId);
  const stock = stockFor(n?.pn);
  if (!n || !stock || !n.qtyReserved) return;
  const q = n.qtyReserved;
  stock.onHand -= q;
  stock.reserved -= q;
  n.qtyIssued += q;
  n.qtyReserved = 0;
  toast(`Issued ${q} from stock · bin ${stock.bin}`);
}

function submitCartAsPOs() {
  const groups = cartGrouped();
  const vendors = Object.keys(groups);
  if (!vendors.length) { toast('Cart is empty'); return; }
  vendors.forEach(vendor => {
    const id = 'PO-' + (1056 + store().pos.length);
    store().pos.unshift({
      id, vendor, status: 'SUBMITTED', eta: 'TBD',
      lines: groups[vendor].map(l => ({ needId: l.needId, qtyOrdered: l.qty, qtyReceived: 0, unitCost: l.unitCost })),
    });
  });
  store().cart = [];
  toast(`Submitted ${vendors.length} PO${vendors.length > 1 ? 's' : ''}`);
}

function receivePoLine(poId, lineIdx, qty) {
  const po = store().pos.find(p => p.id === poId);
  if (!po) return;
  const line = po.lines[lineIdx];
  if (!line) return;
  const add = Math.min(qty ?? (line.qtyOrdered - line.qtyReceived), line.qtyOrdered - line.qtyReceived);
  line.qtyReceived += add;
  if (po.lines.every(l => l.qtyReceived >= l.qtyOrdered)) po.status = 'RECEIVED';
  toast(`Received ${add} on ${po.id}`);
}

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
  document.body.classList.toggle('report-mode', state.route === 'report');
  const r = state.route;
  if (r === 'dashboard') return renderDashboard();
  if (r === 'builds') return renderBuilds();
  if (r === 'setup') return renderSetup();
  if (r === 'build') return renderBuild();
  if (r === 'report') return renderReport();
  if (r === 'specs') return renderSpecs();
}

function renderDashboard() {
  $('#crumb').innerHTML = '<b>Dashboard</b>';
  const active = BUILDS.filter(b => b.status === 'in_progress');
  const planned = BUILDS.filter(b => b.status === 'planned');
  let partsBlocking = 0, openPos = 0, openIssues = 0;
  const attention = [];
  BUILDS.filter(b => b.status !== 'completed').forEach(b => {
    withBuild(b, () => {
      const block = blockingParts();
      partsBlocking += block.length;
      openPos += store().pos.filter(p => p.status === 'SUBMITTED' || p.status === 'BACKORDERED').length;
      const issueTask = buildTasks(b).find(t => taskProgress(t).issue);
      if (issueTask) openIssues++;
      if (block[0]) attention.push({ b, label: block[0].n.part, kind: block[0].bo ? 'Backordered' : 'Still to cover' });
      else if (issueTask) attention.push({ b, label: shortTaskName(issueTask), kind: 'Inspection issue' });
    });
  });
  content().innerHTML = `
    <div class="page-head">
      <div><h2>Shop desk</h2><p>Precision Engine Works · what needs attention today</p></div>
      <div class="spacer"></div>
      <button class="btn primary" data-setup-new>${ICONS.plus} New build</button>
    </div>
    <div class="grid stats">
      <button class="card stat click" data-nav="builds"><div class="label">Active builds</div><div class="value">${active.length}</div></button>
      <button class="card stat click" data-dash-focus="parts"><div class="label">Still to cover</div><div class="value" style="color:var(--bad)">${partsBlocking}</div><small>parts blocking jobs</small></button>
      <button class="card stat click" data-dash-focus="parts"><div class="label">Open POs</div><div class="value" style="color:var(--info)">${openPos}</div><small>submitted / backordered</small></button>
      <button class="card stat click" data-dash-focus="meas"><div class="label">Inspection issues</div><div class="value" style="color:var(--warn)">${openIssues}</div><small>OoS / fail readings</small></button>
    </div>
    <div class="page-head section-head"><h2>Needs attention</h2><div class="spacer"></div><button class="btn" data-nav="builds">All builds</button></div>
    <div class="attn-list">
      ${attention.length ? attention.slice(0, 6).map(({ b, label, kind }) => `
        <button class="attn-row" data-build="${b.id}">
          <div><b>${b.name}</b><div class="spec-range">${archSummaryLine(b.architecture)}</div></div>
          <div class="attn-meta"><span class="badge warn">${kind}</span><span>${label}</span></div>
        </button>`).join('') : `<div class="card" style="padding:18px;color:var(--muted)">Nothing blocking — ${planned.length} planned build${planned.length === 1 ? '' : 's'} ready to start.</div>`}
    </div>
    <div class="page-head section-head"><h2>In progress</h2></div>
    <div class="grid cards">${(active.length ? active : BUILDS.slice(0, 1)).map(buildCard).join('')}</div>`;
}

function stat(label, value, sub) {
  return `<div class="card stat"><div class="label">${label}</div><div class="value">${value} ${sub ? `<small>${sub}</small>` : ''}</div></div>`;
}

function isTaskDone(t, b = getBuild()) {
  const s = store(b?.id);
  if (s.doneTaskIds?.includes(t.id)) return true;
  return withBuild(b, () => taskProgress(t).complete);
}

function buildLiveProgress(b) {
  if (b.status === 'completed') return 100;
  return withBuild(b, () => {
    const tasks = buildTasks(b);
    if (!tasks.length) return b.progress || 0;
    let done = 0;
    tasks.forEach(t => { if (isTaskDone(t, b)) done++; });
    return Math.round((done / tasks.length) * 100);
  });
}

function buildNextAction(b) {
  if (b.status === 'completed') return 'Complete';
  return withBuild(b, () => {
    const next = buildTasks(b).find(t => !isTaskDone(t, b));
    if (!next) return b.status === 'planned' ? 'Not started' : 'All sections complete';
    const phase = PHASES.find(p => p.key === next.phase);
    const phaseLabel = (phase?.label || next.phase).split(' — ')[0];
    return `Next: ${phaseLabel} · ${shortTaskName(next)}`;
  });
}

function buildPartsBlockingCount(b) {
  return withBuild(b, () => blockingParts().length);
}

function buildCard(b) {
  const [cls, txt] = STATUS_BADGE[b.status];
  const pct = buildLiveProgress(b);
  const next = buildNextAction(b);
  const archLine = archSummaryLine(b.architecture);
  const blockN = buildPartsBlockingCount(b);
  return `<div class="card click build-card" data-build="${b.id}">
    ${badge(cls, txt)}
    <div class="title">${b.name}</div>
    <div class="sub">${b.engineName} · <b>${b.engine}</b></div>
    <div class="arch-line">${archLine}</div>
    ${next ? `<div class="next-action ${b.status === 'completed' ? 'is-done' : b.status === 'planned' ? 'is-planned' : ''}">${next}</div>` : ''}
    ${blockN ? `<div class="build-block-chip">${blockN} still to cover</div>` : ''}
    <div class="progress"><span style="width:${pct}%"></span></div>
    <div class="meta">${badge('muted', 'spec ' + b.specRev)}<span class="badge muted">${pct}% complete</span></div>
  </div>`;
}

function renderBuilds() {
  $('#crumb').innerHTML = '<b>Builds</b>';
  content().innerHTML = `
    <div class="page-head"><div><h2>Builds</h2><p>Shop builds — architecture drives what you measure; specs supply limits</p></div>
    <div class="spacer"></div><button class="btn primary" data-setup-new>${ICONS.plus} New build</button></div>
    <div class="grid cards">${BUILDS.map(buildCard).join('')}</div>`;
}

function renderBuild() {
  const b = BUILDS.find(x => x.id === state.buildId);
  // Keep taskId valid for this architecture
  const tasks = buildTasks(b);
  if (!tasks.find(t => t.id === state.taskId)) state.taskId = tasks[0]?.id || 't0';
  $('#crumb').innerHTML = `<span data-nav="builds">Builds</span> / <b>${b.name}</b>`;
  const tabs = [['measurements', 'Measurements'], ['architecture', 'Architecture'], ['parts', 'Parts & orders']];
  content().innerHTML = `
    <div class="page-head compact-head">
      <div><h2 class="build-title">${state.renaming
        ? `<input id="rename-input" class="rename-input" value="${b.name.replace(/"/g, '&quot;')}"/><button class="btn sm primary" data-rename-save>Save</button><button class="btn sm" data-rename-cancel>Cancel</button>`
        : `${b.name} <button class="icon-btn" data-rename title="Rename build">✎</button>`}</h2>
        <p class="build-meta">${b.engineName} · <b>${b.engine}</b> · spec ${b.specRev} · ${archSummaryLine(b.architecture)}</p>
      </div>
      <div class="spacer"></div>
      <button class="btn" data-report>${ICONS.download} Generate report</button>
      ${badge(...STATUS_BADGE[b.status])}
    </div>
    <div class="tabs compact-tabs">${tabs.map(([id, l]) => `<button class="tab ${state.tab === id ? 'active' : ''}" data-tab="${id}">${l}</button>`).join('')}</div>
    <div id="tab-body"></div>`;
  renderTab();
}

function renderTab() {
  const body = $('#tab-body');
  if (state.tab === 'measurements') return renderMeasurements(body);
  if (state.tab === 'architecture') return renderArchitectureTab(body);
  if (state.tab === 'parts') return renderParts(body);
}

/* ---------- Task progress & section navigation ---------- */
function taskFields(t) {
  const proc = PROCEDURES[t.id];
  if (!proc) return [];
  const out = [];
  proc.steps.forEach(step => {
    if (step.calc === 'bore') {
      for (let c = 1; c <= getLayout().cylinders; c++)
        BORE_POS.forEach(p => out.push({ id: `cylinder_block.bore.C${c}.${p}`, m: findMeasurement('cylinder_block', 'bore_inner_diameter') || { unit: 'mm' } }));
      return;
    }
    if (step.calc === 'balance') {
      BAL_FIELDS.forEach(f => out.push({ id: 'balance.' + f.k, m: { unit: 'g' } }));
      out.push({ id: 'balance.oil', m: { unit: 'g' } });
      return;
    }
    step.m.forEach(entry => {
      const r = resolveStepMeas(entry);
      if (!r.m) return;
      instancesFor(r.scope, r.m).forEach(inst => out.push({ id: fieldFor(r, inst.key), m: r.m }));
    });
  });
  return out;
}

function taskProgress(t) {
  const fields = taskFields(t);
  if (!fields.length) return { filled: 0, total: 0, complete: !PROCEDURES[t.id], issue: t.status === 'issue' };
  let filled = 0, issue = false;
  fields.forEach(f => {
    const v = getV(t.id, f.id);
    if (v !== '') filled++;
    if (['Beyond limit', 'Fail', 'No grade match'].includes(evaluate(f.m, v).text)) issue = true;
  });
  return { filled, total: fields.length, complete: filled === fields.length && fields.length > 0, issue };
}

function phaseProgress(key) {
  const ts = buildTasks().filter(t => t.phase === key);
  let done = 0;
  ts.forEach(t => { if (isTaskDone(t)) done++; });
  return { done, total: ts.length };
}

function activePhase() {
  const t = buildTasks().find(x => x.id === state.taskId) || TASKS.find(x => x.id === state.taskId);
  return t ? t.phase : PHASES[0].key;
}

function nextTaskId(fromId) {
  const list = buildTasks();
  const i = list.findIndex(t => t.id === fromId);
  for (let j = i + 1; j < list.length; j++) if (!isTaskDone(list[j])) return list[j].id;
  return null;
}

function prevTaskId(fromId) {
  const list = buildTasks();
  const i = list.findIndex(t => t.id === fromId);
  for (let j = i - 1; j >= 0; j--) return list[j].id;
  return null;
}

function shortTaskName(t) {
  return t.name.replace(/^Examine /, '').replace(/^Evaluate /, '').replace(/ inspection$/, '');
}

function selectTask(taskId) {
  const list = buildTasks();
  const prev = list.find(t => t.id === state.taskId) || TASKS.find(t => t.id === state.taskId);
  state.taskId = taskId;
  const next = list.find(t => t.id === taskId) || TASKS.find(t => t.id === taskId);
  if (prev?.phase !== next?.phase) renderMeasurements($('#tab-body'));
  else { syncWorkspaceNavHeight(); renderSectionPanel(); }
}

function renderMeasurements(body) {
  const phase = activePhase();
  const visiblePhases = PHASES.filter(p => buildTasks().some(t => t.phase === p.key));
  const phaseStrip = visiblePhases.map(p => {
    const prog = phaseProgress(p.key);
    const on = p.key === phase;
    return `<button class="phase-pill ${on ? 'on' : ''} ${prog.done === prog.total && prog.total ? 'done' : ''}" data-phase="${p.key}">
      <span class="pn">${p.num}</span><span class="pl">${p.label.split(' — ')[0]}</span><span class="pc">${prog.done}/${prog.total}</span>
    </button>`;
  }).join('');
  const tasks = buildTasks().filter(t => t.phase === phase);
  const taskStrip = tasks.map(t => {
    const p = taskProgress(t);
    const on = t.id === state.taskId;
    const done = isTaskDone(t);
    const cls = [on ? 'on' : '', done ? 'done' : '', p.issue ? 'issue' : ''].filter(Boolean).join(' ');
    return `<button class="task-pill ${cls}" data-task="${t.id}" title="${t.name}">
      <span class="tn">${done ? '✓ ' : p.issue ? '! ' : ''}${shortTaskName(t)}</span><span class="tp">${p.total ? `${p.filled}/${p.total}` : '—'}</span>
    </button>`;
  }).join('');
  const arch = getArchitecture();
  body.innerHTML = `
    <div class="arch-banner">
      <div>
        <div class="arch-banner-title">Measuring against architecture</div>
        <div class="arch-banner-sub">${archSummaryLine(arch)} — sections below are gated by valvetrain capabilities</div>
      </div>
      <button class="btn sm" data-tab="architecture">Edit architecture</button>
    </div>
    <div class="workspace">
      <div class="workspace-nav" id="workspace-nav">
        <div class="strip phase-strip quiet">${phaseStrip}</div>
        <div class="strip task-strip">${taskStrip}</div>
      </div>
      <div id="meas-panel" class="sheet card"></div>
    </div>`;
  syncWorkspaceNavHeight();
  renderSectionPanel();
}

function syncWorkspaceNavHeight() {
  const nav = $('#workspace-nav');
  if (nav) document.documentElement.style.setProperty('--workspace-nav-h', `${Math.ceil(nav.getBoundingClientRect().height)}px`);
}

function renderSectionPanel() {
  const panel = $('#meas-panel');
  const t = TASKS.find(x => x.id === state.taskId);
  if (!t) { panel.innerHTML = '<p class="panel-sub">Select a section.</p>'; return; }
  const proc = PROCEDURES[t.id];
  if (!proc) return renderSimpleSection(panel, t);

  const prog = taskProgress(t);
  const beyond = collectBeyond(t, proc);
  const groups = proc.steps.map(step => {
    if (step.calc === 'bore') return `<div class="step-group"><div class="step-label">${step.title}</div>${boreCalc(t)}</div>`;
    if (step.calc === 'balance') return `<div class="step-group"><div class="step-label">${step.title}</div>${balanceCalc(t)}</div>`;
    if (!step.m.length) return '';
    return `<div class="step-group"><div class="step-label">${step.title}</div>${step.m.map((e, i) => measRow(t, e, i)).join('')}</div>`;
  }).join('');

  const noteKey = t.id + '._notes';
  const nxt = nextTaskId(t.id), prv = prevTaskId(t.id);
  const left = Math.max(0, prog.total - prog.filled);
  const progLabel = prog.total
    ? (prog.complete ? 'Complete' : left === prog.total ? 'Not started' : `${left} left · ${prog.filled}/${prog.total}`)
    : '';
  panel.innerHTML = `
    <div class="sheet-head">
      <div>
        <h3 class="panel-title">${t.name}</h3>
        <span class="sheet-prog">${progLabel}</span>
        <div class="sheet-hint">← → sections · Enter next field</div>
      </div>
      <div class="sheet-nav">
        ${prv ? `<button class="btn sm" data-task="${prv}">‹ Prev</button>` : ''}
        ${nxt ? `<button class="btn primary sm" data-task="${nxt}">Next ›</button>` : `<button class="btn sm" disabled>Done</button>`}
      </div>
    </div>
    <div class="meas-sheet">${groups}</div>
    ${beyond.length ? `<div class="callout compact-callout"><span>⚠</span><div><b>${beyond.length} beyond limit</b> — ${beyond.map(b => b.inst.label || b.r.m.label).join(', ')}. Mark <b>Replace</b> on each component to add parts.</div></div>` : ''}
    <div class="sheet-foot">
      <textarea class="wk-notes sheet-notes" data-note="${noteKey}" placeholder="Section notes…">${getNote(noteKey)}</textarea>
    </div>`;

  bindMeasInputs(panel, t, () => renderSectionPanel());
  bindReplaceButtons(panel, () => renderSectionPanel());
  bindFieldAdvance(panel);
  const ta = panel.querySelector('textarea[data-note]');
  if (ta) ta.addEventListener('input', () => { setNote(ta.dataset.note, ta.value); });
  proc.steps.forEach(s => { if (s.calc === 'bore') bindBoreCalc(panel, t); if (s.calc === 'balance') bindBalanceCalc(panel, t); });
  refreshStrips();
}

function collectBeyond(t, proc) {
  const beyond = [];
  proc.steps.forEach(step => step.m.forEach(entry => {
    const r = resolveStepMeas(entry); if (!r.m) return;
    const insts = r.m.type === 'check' ? [{ key: '', label: '' }] : instancesFor(r.scope, r.m);
    insts.forEach(inst => { if (['Beyond limit', 'Fail'].includes(evalField(t, r, inst.key).text)) beyond.push({ r, inst }); });
  }));
  return beyond;
}

function refreshStrips() {
  document.querySelectorAll('.task-pill').forEach(el => {
    const t = buildTasks().find(x => x.id === el.dataset.task); if (!t) return;
    const p = taskProgress(t);
    const done = isTaskDone(t);
    el.classList.toggle('done', done);
    el.classList.toggle('issue', p.issue);
    el.classList.toggle('on', t.id === state.taskId);
    const tp = el.querySelector('.tp');
    if (tp) tp.textContent = p.total ? `${p.filled}/${p.total}` : '—';
    const tn = el.querySelector('.tn');
    if (tn) tn.textContent = `${done ? '✓ ' : p.issue ? '! ' : ''}${shortTaskName(t)}`;
  });
  document.querySelectorAll('.phase-pill').forEach(el => {
    const prog = phaseProgress(el.dataset.phase);
    el.classList.toggle('on', el.dataset.phase === activePhase());
    el.classList.toggle('done', prog.done === prog.total && prog.total > 0);
    const pc = el.querySelector('.pc');
    if (pc) pc.textContent = `${prog.done}/${prog.total}`;
  });
}

function renderSimpleSection(panel, t) {
  const noteKey = t.id + '._notes';
  panel.innerHTML = `
    <div class="sheet-head"><h3 class="panel-title">${t.name}</h3></div>
    <div class="meas-sheet">
      <p class="panel-sub">${t.sub || 'Checklist / note-only step.'}</p>
      <textarea class="wk-notes sheet-notes" data-note="${noteKey}" placeholder="Notes…">${getNote(noteKey)}</textarea>
      <button class="btn sm" style="margin-top:10px">Mark complete</button>
    </div>`;
  panel.querySelector('textarea[data-note]')?.addEventListener('input', e => { setNote(noteKey, e.target.value); });
}

function measRow(t, entry, idx) {
  const r = resolveStepMeas(entry);
  if (!r.m) return '';
  if (r.m.type === 'note') {
    const insts = instancesFor(r.scope, r.m);
    const single = insts.length === 1 && insts[0].key === '';
    const ph = (r.m.placeholder || '').replace(/"/g, '&quot;');
    if (single) {
      const f = fieldFor(r, '');
      return `<div class="mrow note"><label>${r.m.label}</label><textarea class="wk-notes" data-mv="${t.id}|${f}" placeholder="${ph}">${getV(t.id, f)}</textarea></div>`;
    }
    return `<div class="mrow block"><div class="mrow-label">${r.m.label}</div><div class="inst-grid tight">${insts.map(inst => {
      const f = fieldFor(r, inst.key);
      const lbl = componentLabel(t, r, inst);
      return `<div class="inst-wrap ${isReplace(t.id, f) ? 'replace-on' : ''}"><div class="inst-note-cell"><label>${inst.label}</label>
        <textarea class="wk-notes" data-mv="${t.id}|${f}" placeholder="${ph}">${getV(t.id, f)}</textarea></div>${replaceBtn(t.id, f, lbl)}</div>`;
    }).join('')}</div></div>`;
  }
  if (r.m.type === 'check') {
    const f = fieldFor(r, ''); const val = getV(t.id, f); const e = evaluate(r.m, val);
    const opt = (v, l) => `<option value="${v}" ${val === v ? 'selected' : ''}>${l}</option>`;
    const lbl = componentLabel(t, r, null);
    return `<div class="mrow ${isReplace(t.id, f) ? 'replace-on' : ''}"><div class="mrow-label">${r.m.label}</div>
      <select class="check-sel" data-mv="${t.id}|${f}">${opt('', '—')}${opt('pass', 'Pass')}${opt('fail', 'Fail')}${opt('na', 'N/A')}</select>
      <div data-badge="${f}">${miniBadge(e)}</div>${replaceBtn(t.id, f, lbl)}</div>`;
  }
  const insts = instancesFor(r.scope, r.m);
  const single = insts.length === 1 && insts[0].key === '';
  if (single) {
    const f = fieldFor(r, ''); const val = getV(t.id, f); const e = evaluate(r.m, val);
    const lbl = componentLabel(t, r, null);
    return `<div class="mrow ${isReplace(t.id, f) ? 'replace-on' : ''}"><div class="mrow-label">${r.m.label}<span class="spec">${specRangeText(r.m)} ${r.m.unit || ''}</span></div>
      <div class="mrow-input"><input type="number" step="0.001" inputmode="decimal" value="${val !== '' ? val : ''}" data-mv="${t.id}|${f}"><span class="unit">${r.m.unit || ''}</span></div>
      <div data-badge="${f}">${miniBadge(e)}</div>${replaceBtn(t.id, f, lbl)}</div>`;
  }
  return `<div class="mrow block"><div class="mrow-label">${r.m.label}<span class="spec">${specRangeText(r.m)} ${r.m.unit || ''}</span></div>
    <div class="inst-grid tight">${insts.map(inst => {
      const f = fieldFor(r, inst.key); const val = getV(t.id, f); const ev = evalField(t, r, inst.key);
      const lbl = componentLabel(t, r, inst);
      const unit = r.m.unit ? `<span class="unit">${r.m.unit}</span>` : '';
      return `<div class="inst-wrap ${isReplace(t.id, f) ? 'replace-on' : ''}"><div class="inst-cell"><span class="inst-lbl">${inst.label}</span>
        <div class="inst-in"><input type="number" step="0.001" inputmode="decimal" value="${val !== '' ? val : ''}" data-mv="${t.id}|${f}">${unit}</div></div>
        <span class="inst-badge" data-badge="${f}">${miniBadge(ev)}</span>${replaceBtn(t.id, f, lbl)}</div>`;
    }).join('')}</div></div>`;
}

function measFieldEls(panel) {
  return [...panel.querySelectorAll('input[data-mv], input[data-bore], input[data-bal], select[data-mv]')];
}

function focusNextMeasField(fromEl) {
  const panel = $('#meas-panel');
  if (!panel) return;
  const fields = measFieldEls(panel);
  const i = fields.indexOf(fromEl);
  if (i < 0) return;
  for (let j = i + 1; j < fields.length; j++) {
    if (fields[j].value === '' || fields[j].value == null) {
      fields[j].focus();
      if (fields[j].select) fields[j].select();
      return;
    }
  }
  if (i + 1 < fields.length) {
    fields[i + 1].focus();
    if (fields[i + 1].select) fields[i + 1].select();
  }
}

function bindFieldAdvance(panel) {
  measFieldEls(panel).forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        focusNextMeasField(el);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        el.blur();
      }
    });
  });
}

function bindReplaceButtons(panel, onChange) {
  panel.querySelectorAll('[data-repl]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const bar = btn.dataset.repl.indexOf('|');
      toggleReplace(btn.dataset.repl.slice(0, bar), btn.dataset.repl.slice(bar + 1), btn.dataset.part);
      onChange();
    });
  });
}

function bindMeasInputs(panel, t, onChange) {
  panel.querySelectorAll('[data-mv]').forEach(inp => {
    const parse = () => { const bar = inp.dataset.mv.indexOf('|'); return [inp.dataset.mv.slice(0, bar), inp.dataset.mv.slice(bar + 1)]; };
    const isNote = inp.tagName === 'TEXTAREA';
    inp.addEventListener('input', () => {
      const [tid, field] = parse(); setV(tid, field, inp.value);
      if (isNote) { refreshStrips(); return; }
      const e = evaluate(fieldToResolved(field).m, inp.value);
      const b = panel.querySelector(`[data-badge="${cssEsc(field)}"]`);
      if (b) b.innerHTML = miniBadge(e);
      refreshStrips();
      const p = taskProgress(t);
      if (p.complete && nextTaskId(t.id)) toast('Section complete — press Next ›');
    });
    inp.addEventListener('change', () => { const [tid, field] = parse(); setV(tid, field, inp.value); if (!isNote) onChange(); });
  });
}

function evalField(t, r, instKey) { return evaluate(r.m, getV(t.id, fieldFor(r, instKey))); }

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
  const replField = `__cyl_${n}`;
  const lbl = `Cylinder ${n} — bore / hone`;
  const inp = p => `<input type="number" step="0.001" inputmode="decimal" value="${getV(t.id, `cylinder_block.bore.C${n}.${p}`)}" data-bore="${n}|${p}">`;
  const row = L => `<div class="bore-row"><span>${L}</span>${inp(L + 'X')}${inp(L + 'Y')}</div>`;
  return `<div class="bore-cyl ${isReplace(t.id, replField) ? 'replace-on' : ''}">
    <div class="bore-cyl-head">Cylinder ${n}<span data-bore-status="${n}"></span>${replaceBtn(t.id, replField, lbl)}</div>
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
  return `<div class="bore-cyls">${cards}</div>`;
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
    refreshStrips();
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
  const input = f => `<div class="bal-field"><label>${f.l}</label><div class="in"><input type="number" step="0.1" inputmode="decimal" value="${getV(t.id, 'balance.' + f.k)}" data-bal="${f.k}"><span class="unit">g</span></div></div>`;
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

function renderArchitectureTab(body) {
  const b = getBuild();
  const arch = b.architecture;
  const modules = moduleCatalog(arch);
  const chips = archChips(arch).map(c => `<span class="chip">${c}</span>`).join('');
  const camRows = arch.camshafts.map((c, i) => `
    <tr>
      <td><b>${c.label}</b><div class="spec-range">${c.id}</div></td>
      <td>${c.mount}</td>
      <td>${c.role}</td>
      <td>${c.headId || '—'}</td>
      <td><button class="btn sm ghost" data-arch-del-cam="${i}">Remove</button></td>
    </tr>`).join('');
  body.innerHTML = `
    <div class="arch-layout">
      <div class="arch-main">
        <div class="card arch-card">
          <div class="arch-card-head">
            <div>
              <h3 class="panel-title">Engine architecture</h3>
              <p class="panel-sub" style="margin:0">Topology defines instance counts and which inspection modules appear. Specs only supply limits.</p>
            </div>
            <button class="btn sm" data-arch-apply-template>Switch template…</button>
          </div>
          <div class="chip-row">${chips}</div>
          ${topologyHtml(arch)}
        </div>
        <div class="card arch-card">
          <h3 class="panel-title">Edit topology</h3>
          <p class="panel-sub">Guided controls — not a freeform parts dump.</p>
          <div class="arch-form">
            <label class="field"><span>Valvetrain family</span>
              <select data-arch-family>
                ${Object.entries(ARCH_FAMILIES).map(([k, v]) => `<option value="${k}" ${arch.family === k ? 'selected' : ''}>${v.label}</option>`).join('')}
              </select>
            </label>
            <label class="field"><span>Block form</span>
              <select data-arch-form>
                <option value="inline" ${arch.block.form === 'inline' ? 'selected' : ''}>Inline</option>
                <option value="V" ${arch.block.form === 'V' ? 'selected' : ''}>V</option>
              </select>
            </label>
            <label class="field"><span>Cylinders</span>
              <input type="number" min="1" max="16" data-arch-cyls value="${arch.block.cylinders}">
            </label>
            <label class="field"><span>Main journals</span>
              <input type="number" min="1" max="12" data-arch-mains value="${arch.block.mainJournals}">
            </label>
            <label class="field"><span>Intake valves / cyl</span>
              <input type="number" min="1" max="4" data-arch-vin value="${arch.valvesPerCylinder.intake}">
            </label>
            <label class="field"><span>Exhaust valves / cyl</span>
              <input type="number" min="1" max="4" data-arch-vex value="${arch.valvesPerCylinder.exhaust}">
            </label>
          </div>
          <div class="arch-actions">
            <button class="btn sm" data-arch-add-cam="head">+ Head cam</button>
            <button class="btn sm" data-arch-add-cam="block">+ Block cam</button>
            <button class="btn sm primary" data-arch-save>Save architecture</button>
          </div>
        </div>
        <div class="card table-card">
          <h4 class="table-title">Camshafts</h4>
          <table>
            <thead><tr><th>Cam</th><th>Mount</th><th>Role</th><th>Head</th><th></th></tr></thead>
            <tbody>${camRows || '<tr><td colspan="5">No camshafts — add one above.</td></tr>'}</tbody>
          </table>
        </div>
      </div>
      <aside class="arch-side">
        <div class="card arch-card arch-context">
          <h3 class="panel-title">This build</h3>
          <p class="panel-sub" style="margin:0">${b.name}</p>
          <div class="chip-row tight" style="margin-top:10px">${chips}</div>
          <p class="panel-sub" style="margin-top:10px">Topology here · limits on Engine specs. Switching template resets counts to the template defaults.</p>
        </div>
        <div class="card arch-card">
          <h3 class="panel-title">Active modules</h3>
          <p class="panel-sub">Shown in Measurements for this architecture</p>
          <div class="module-list">
            ${modules.filter(m => m.active).map(m => `
              <div class="module-row on">
                <div>
                  <b>${m.name}</b>
                  <div class="spec-range">${m.note}</div>
                </div>
                ${badge('ok', 'Active')}
              </div>`).join('') || '<p class="panel-sub">No modules active.</p>'}
          </div>
          ${modules.some(m => !m.active) ? `<details class="module-hidden"><summary>${modules.filter(m => !m.active).length} hidden for this architecture</summary>
            <div class="module-list">
              ${modules.filter(m => !m.active).map(m => `
                <div class="module-row off"><div><b>${m.name}</b><div class="spec-range">${m.note}</div></div>${badge('muted', 'Hidden')}</div>`).join('')}
            </div>
          </details>` : ''}
        </div>
        <div class="card arch-card">
          <h3 class="panel-title">Instance preview</h3>
          <ul class="inst-preview">
            <li><b>${arch.heads.length}</b> heads → ${arch.heads.map(h => h.label).join(', ')}</li>
            <li><b>${arch.block.cylinders}</b> cylinders / pistons / rods</li>
            <li><b>${arch.camshafts.length}</b> camshaft measurement groups</li>
            <li><b>${arch.block.cylinders * (arch.valvesPerCylinder.intake + arch.valvesPerCylinder.exhaust)}</b> valve instances</li>
            <li><b>${arch.block.mainJournals}</b> main journals</li>
          </ul>
        </div>
      </aside>
    </div>`;
  bindArchitectureEditor(body, b);
}

function bindArchitectureEditor(body, b) {
  const arch = b.architecture;
  const readForm = () => {
    arch.family = body.querySelector('[data-arch-family]').value;
    arch.block.form = body.querySelector('[data-arch-form]').value;
    arch.block.cylinders = Math.max(1, +body.querySelector('[data-arch-cyls]').value || 1);
    arch.block.mainJournals = Math.max(1, +body.querySelector('[data-arch-mains]').value || 1);
    arch.valvesPerCylinder.intake = Math.max(1, +body.querySelector('[data-arch-vin]').value || 1);
    arch.valvesPerCylinder.exhaust = Math.max(1, +body.querySelector('[data-arch-vex]').value || 1);
    if (arch.block.form === 'V' && arch.block.banks.length < 2) arch.block.banks = ['Left', 'Right'];
    if (arch.block.form === 'inline') arch.block.banks = ['Inline'];
    syncHeadsFromBlock(arch);
  };
  body.querySelector('[data-arch-family]')?.addEventListener('change', e => {
    readForm();
    setValvetrainFamily(arch, e.target.value);
    toast('Valvetrain family updated — modules refreshed');
    renderArchitectureTab(body);
  });
  body.querySelector('[data-arch-save]')?.addEventListener('click', () => {
    readForm();
    toast('Architecture saved — measurement sections updated');
    state.tab = 'measurements';
    renderBuild();
  });
  body.querySelectorAll('[data-arch-add-cam]').forEach(btn => btn.addEventListener('click', () => {
    readForm();
    addCamshaft(arch, { mount: btn.dataset.archAddCam, role: 'shared', headId: arch.heads[0]?.id });
    renderArchitectureTab(body);
  }));
  body.querySelectorAll('[data-arch-del-cam]').forEach(btn => btn.addEventListener('click', () => {
    arch.camshafts.splice(+btn.dataset.archDelCam, 1);
    renderArchitectureTab(body);
  }));
  body.querySelector('[data-arch-apply-template]')?.addEventListener('click', () => {
    state.setup = { step: 'template', templateId: b.archTemplateId, arch: cloneArch(arch), name: b.name, replaceBuildId: b.id };
    state.route = 'setup';
    render();
  });
}

function renderSetup() {
  const s = state.setup || { step: 'template', templateId: 'v6_sohc_rocker', arch: cloneArch(ARCH_TEMPLATES[0]), name: '' };
  state.setup = s;
  $('#crumb').innerHTML = `<span data-nav="builds">Builds</span> / <b>New build</b>`;
  if (s.step === 'template') {
    content().innerHTML = `
      <div class="page-head">
        <div>
          <h2>Choose an architecture template</h2>
          <p>Templates define topology. Specs (uploaded later) only supply measurement limits.</p>
        </div>
        <div class="spacer"></div>
        <button class="btn" data-nav="builds">Cancel</button>
      </div>
      <div class="grid cards template-grid">
        ${ARCH_TEMPLATES.map(t => `
          <button class="card click template-card ${s.templateId === t.id ? 'selected' : ''}" data-setup-template="${t.id}">
            <div class="template-family">${ARCH_FAMILIES[t.family]?.short || t.family}</div>
            <div class="title">${t.title}</div>
            <div class="sub">${t.blurb}</div>
            <div class="chip-row tight">${archChips(t).slice(0, 4).map(c => `<span class="chip">${c}</span>`).join('')}</div>
            ${t.example ? badge('primary', 'Demo example') : ''}
          </button>`).join('')}
      </div>
      <div class="setup-foot">
        <button class="btn primary" data-setup-next ${s.templateId ? '' : 'disabled'}>Continue to topology ›</button>
      </div>`;
    return;
  }
  const arch = s.arch;
  content().innerHTML = `
    <div class="page-head">
      <div>
        <h2>Confirm topology</h2>
        <p>Tweak counts or cams, then create the build. Measurement modules follow automatically.</p>
      </div>
      <div class="spacer"></div>
      <button class="btn" data-setup-back>‹ Templates</button>
    </div>
    <div class="arch-layout">
      <div class="arch-main">
        <div class="card arch-card">
          <label class="field"><span>Build name</span>
            <input type="text" data-setup-name value="${(s.name || '').replace(/"/g, '&quot;')}" placeholder="e.g. Shop truck 350 rebuild">
          </label>
          <div class="chip-row">${archChips(arch).map(c => `<span class="chip">${c}</span>`).join('')}</div>
          ${topologyHtml(arch)}
        </div>
        <div class="card arch-card">
          <div class="arch-form">
            <label class="field"><span>Cylinders</span><input type="number" min="1" max="16" data-setup-cyls value="${arch.block.cylinders}"></label>
            <label class="field"><span>Main journals</span><input type="number" min="1" max="12" data-setup-mains value="${arch.block.mainJournals}"></label>
            <label class="field"><span>Intake valves / cyl</span><input type="number" min="1" max="4" data-setup-vin value="${arch.valvesPerCylinder.intake}"></label>
            <label class="field"><span>Exhaust valves / cyl</span><input type="number" min="1" max="4" data-setup-vex value="${arch.valvesPerCylinder.exhaust}"></label>
          </div>
          <div class="arch-actions">
            <button class="btn sm" data-setup-add-cam="head">+ Head cam</button>
            <button class="btn sm" data-setup-add-cam="block">+ Block cam</button>
          </div>
        </div>
      </div>
      <aside class="arch-side">
        <div class="card arch-card">
          <h3 class="panel-title">Modules that will appear</h3>
          <div class="module-list">
            ${moduleCatalog(arch).map(m => `
              <div class="module-row ${m.active ? 'on' : 'off'}">
                <div><b>${m.name}</b><div class="spec-range">${m.note}</div></div>
                ${badge(m.active ? 'ok' : 'muted', m.active ? 'Active' : 'Hidden')}
              </div>`).join('')}
          </div>
        </div>
        <button class="btn primary" style="width:100%" data-setup-create>${s.replaceBuildId ? 'Apply to build' : 'Create build'}</button>
      </aside>
    </div>`;
  bodyBindSetupEdit();
}

function bodyBindSetupEdit() {
  const s = state.setup;
  const refresh = () => { s.step = 'edit'; renderSetup(); };
  const read = () => {
    s.name = document.querySelector('[data-setup-name]')?.value || s.name;
    s.arch.block.cylinders = Math.max(1, +document.querySelector('[data-setup-cyls]')?.value || 1);
    s.arch.block.mainJournals = Math.max(1, +document.querySelector('[data-setup-mains]')?.value || 1);
    s.arch.valvesPerCylinder.intake = Math.max(1, +document.querySelector('[data-setup-vin]')?.value || 1);
    s.arch.valvesPerCylinder.exhaust = Math.max(1, +document.querySelector('[data-setup-vex]')?.value || 1);
    syncHeadsFromBlock(s.arch);
  };
  document.querySelectorAll('[data-setup-cyls], [data-setup-mains], [data-setup-vin], [data-setup-vex]').forEach(el => {
    el.addEventListener('change', () => { read(); refresh(); });
  });
  document.querySelector('[data-setup-name]')?.addEventListener('change', e => { s.name = e.target.value; });
  document.querySelectorAll('[data-setup-add-cam]').forEach(btn => btn.addEventListener('click', () => {
    read();
    addCamshaft(s.arch, { mount: btn.dataset.setupAddCam, headId: s.arch.heads[0]?.id });
    refresh();
  }));
}

function renderParts(body) {
  const tot = partsTotals();
  const blocking = blockingParts();
  const filter = state.parts.filter || 'all';
  const selected = state.parts.selected || {};
  const whyBadge = w => badge(w === 'inspection' ? 'primary' : w === 'manual' ? 'warn' : 'muted', w === 'inspection' ? 'Inspection' : w === 'manual' ? 'Manual' : 'Plan');

  const filtered = store().needs.filter(n => {
    const c = needCoverage(n);
    if (filter === 'to_order') return ['to_order', 'use_stock', 'partial'].includes(c.status);
    if (filter === 'on_order') return c.status === 'on_order' || store().pos.some(p => p.status !== 'RECEIVED' && p.lines.some(l => l.needId === n.id));
    if (filter === 'stock') return n.fulfill === 'stock' || c.status === 'stock_reserved' || c.status === 'use_stock';
    if (filter === 'inspection') return n.why === 'inspection';
    return true;
  });

  const needRows = filtered.map(n => {
    const c = needCoverage(n);
    const stock = stockFor(n.pn);
    const avail = stock ? stock.onHand - stock.reserved : 0;
    const sel = !!selected[n.id];
    const estExt = n.need * (n.estUnitCost || 0);
    const fulfillOpts = ['order', 'stock', 'customer'].map(f =>
      `<option value="${f}" ${n.fulfill === f ? 'selected' : ''}>${f === 'order' ? 'Order' : f === 'stock' ? 'Shop stock' : 'Customer'}</option>`).join('');
    return `<tr class="need-row ${sel ? 'sel' : ''}" data-need="${n.id}">
      <td><input type="checkbox" data-need-sel="${n.id}" ${sel ? 'checked' : ''} ${c.status === 'received' ? 'disabled' : ''}></td>
      <td>
        <b>${n.part}</b>
        <div class="spec-range">${n.pn}${stock ? ` · bin ${stock.bin} · ${avail} avail` : ''}</div>
        <div class="need-why">${n.reason || ''}${n.taskId ? ` · <button class="linkish" data-goto-task="${n.taskId}">open</button>` : ''}</div>
      </td>
      <td>${whyBadge(n.why)}</td>
      <td><select class="fulfill-sel" data-need-fulfill="${n.id}">${fulfillOpts}</select></td>
      <td class="num">${n.need}</td>
      <td class="num">${c.ordered}</td>
      <td class="num">${c.receivedPo + c.fromStock}${c.reserved ? ` <span class="spec-range">(+${c.reserved} res)</span>` : ''}</td>
      <td class="num">
        <input type="number" min="0" step="0.01" class="cost-inp" data-need-cost="${n.id}" value="${n.estUnitCost ?? ''}">
        <div class="spec-range">${money2(estExt)} est</div>
      </td>
      <td>${needStatusBadge(n)}</td>
      <td class="need-actions">
        ${stock && c.status !== 'received' ? `<button class="btn sm" data-use-stock="${n.id}">Use stock</button>` : ''}
        ${n.qtyReserved ? `<button class="btn sm" data-issue-stock="${n.id}">Issue</button>` : ''}
        ${c.status !== 'received' && n.fulfill !== 'stock' ? `<button class="btn sm" data-add-cart="${n.id}">Cart</button>` : ''}
      </td>
    </tr>`;
  }).join('');

  const groups = cartGrouped();
  const cartHtml = Object.keys(groups).length ? Object.entries(groups).map(([vendor, lines]) => `
    <div class="cart-vendor">
      <div class="cart-vendor-head"><b>${vendor}</b><span>${money2(lines.reduce((a, l) => a + l.qty * l.unitCost, 0))}</span></div>
      ${lines.map(l => {
        const n = needById(l.needId);
        return `<div class="cart-line"><span>${n?.part || l.needId} ×${l.qty}</span><span>${money2(l.qty * l.unitCost)}</span>
          <button class="btn sm ghost" data-cart-remove="${l.needId}">✕</button></div>`;
      }).join('')}
    </div>`).join('') : '<p class="panel-sub" style="margin:0">Cart is empty — select lines and add, or use Cart on a row.</p>';

  const poCards = store().pos.map(po => {
    const open = state.parts.openPo === po.id;
    const total = po.lines.reduce((a, l) => a + l.qtyOrdered * l.unitCost, 0);
    const lines = po.lines.map((l, i) => {
      const n = needById(l.needId);
      const left = l.qtyOrdered - l.qtyReceived;
      return `<tr>
        <td>${n?.part || l.needId}<div class="spec-range">${n?.pn || ''}</div></td>
        <td class="num">${l.qtyOrdered}</td>
        <td class="num">${l.qtyReceived}</td>
        <td class="num">${money2(l.unitCost)}</td>
        <td>${left > 0 && po.status !== 'RECEIVED'
          ? `<button class="btn sm primary" data-receive="${po.id}|${i}">Receive${left > 1 ? ` ${left}` : ''}</button>`
          : badge('ok', 'Done')}</td>
      </tr>`;
    }).join('');
    return `<div class="po-card ${open ? 'open' : ''}">
      <button class="po-head" data-po-toggle="${po.id}">
        <span><b>${po.id}</b> · ${po.vendor}</span>
        <span class="po-meta">${money(total)} · ETA ${po.eta || '—'} ${badge(...(STATUS_BADGE[po.status] || ['muted', po.status]))}</span>
      </button>
      ${open ? `<div class="po-body"><table><thead><tr><th>Line</th><th>Ord</th><th>Rcv</th><th>Unit</th><th></th></tr></thead><tbody>${lines || '<tr><td colspan="5">No lines</td></tr>'}</tbody></table></div>` : ''}
    </div>`;
  }).join('');

  const selCount = Object.values(selected).filter(Boolean).length;
  body.innerHTML = `
    <div class="parts-cost-strip">
      <div class="cost-cell"><div class="label">Est. parts</div><div class="value">${money(tot.estimate)}</div></div>
      <div class="cost-cell"><div class="label">Committed (POs)</div><div class="value">${money(tot.committed)}</div></div>
      <div class="cost-cell"><div class="label">Cart</div><div class="value">${money(tot.cart)}</div></div>
      <div class="cost-cell"><div class="label">From stock</div><div class="value">${money(tot.fromStock)}</div></div>
      <div class="cost-cell emphasize"><div class="label">Still to cover</div><div class="value">${money(tot.stillToCover)}</div></div>
      <div class="cost-cell muted"><div class="label">Actual so far</div><div class="value">${money(tot.actual)}</div></div>
    </div>

    ${blocking.length ? `<div class="parts-blocking">
      <div class="parts-blocking-label">Blocking / at risk</div>
      <div class="parts-blocking-chips">
        ${blocking.slice(0, 6).map(({ n, c, bo }) => `
          <button class="block-chip ${bo ? 'risk' : ''}" data-filter-need="${n.id}">
            <b>${n.part}</b>
            <span>${bo ? `Backordered · ${bo.eta}` : c.status === 'use_stock' || c.status === 'stock_reserved' ? 'Shop stock' : c.status === 'customer' ? 'Awaiting customer' : 'Needs order'} · ${money2(n.estUnitCost)}</span>
          </button>`).join('')}
      </div>
    </div>` : ''}

    <div class="parts-workbench">
      <div class="parts-main">
        <div class="parts-toolbar">
          <div class="parts-filters">
            ${[['all', 'All'], ['to_order', 'Still to cover'], ['on_order', 'On order'], ['stock', 'Stock'], ['inspection', 'Inspection']].map(([id, l]) =>
              `<button class="filter-chip ${filter === id ? 'on' : ''}" data-parts-filter="${id}">${l}</button>`).join('')}
          </div>
          <div class="parts-toolbar-actions">
            <button class="btn sm" data-parts-add-selected ${selCount ? '' : 'disabled'}>Add selected to cart (${selCount})</button>
            <button class="btn sm" data-parts-add-manual>+ Add part</button>
          </div>
        </div>
        <div class="card table-card need-table-card">
          <h4 class="table-title">Need list <span class="spec-range" style="text-transform:none;letter-spacing:0;font-weight:500">— plan, inspection & stock</span></h4>
          <div class="table-scroll">
            <table class="need-table">
              <thead><tr>
                <th></th><th>Part</th><th>Why</th><th>Fulfill</th><th>Need</th><th>Ord</th><th>Rcv</th><th>Est. cost</th><th>Status</th><th></th>
              </tr></thead>
              <tbody>${needRows || '<tr><td colspan="10">No parts in this filter.</td></tr>'}</tbody>
            </table>
          </div>
        </div>

        <div class="card table-card" style="margin-top:14px">
          <h4 class="table-title">Purchase orders</h4>
          <div class="po-list">${poCards}</div>
        </div>
      </div>

      <aside class="parts-side">
        <div class="card arch-card cart-card">
          <div class="arch-card-head" style="margin-bottom:8px">
            <div>
              <h3 class="panel-title">Cart</h3>
              <p class="panel-sub" style="margin:0">${store().cart.length} line${store().cart.length === 1 ? '' : 's'} · ${money2(cartTotal())}</p>
            </div>
          </div>
          <div class="cart-body">${cartHtml}</div>
          <button class="btn primary" style="width:100%;margin-top:12px" data-submit-cart ${store().cart.length ? '' : 'disabled'}>Submit PO${Object.keys(groups).length > 1 ? 's' : ''} by vendor</button>
        </div>
        <div class="card arch-card">
          <h3 class="panel-title">Shop stock</h3>
          <p class="panel-sub">Reserve against this build, then issue to the bench.</p>
          <div class="stock-list">
            ${SHOP_STOCK.map(s => `
              <div class="stock-row">
                <div>
                  <b>${s.name}</b>
                  <div class="spec-range">${s.pn} · bin ${s.bin}</div>
                </div>
                <div class="stock-qty">
                  <div><b>${s.onHand - s.reserved}</b> avail</div>
                  <div class="spec-range">${s.reserved} res · ${money2(s.unitCost)}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </aside>
    </div>`;

  bindPartsWorkbench(body);
}

function bindPartsWorkbench(body) {
  const redraw = () => renderParts(body);

  body.querySelectorAll('[data-parts-filter]').forEach(btn => btn.addEventListener('click', () => {
    state.parts.filter = btn.dataset.partsFilter;
    redraw();
  }));
  body.querySelectorAll('[data-need-sel]').forEach(cb => cb.addEventListener('change', () => {
    state.parts.selected[cb.dataset.needSel] = cb.checked;
    redraw();
  }));
  body.querySelectorAll('[data-need-fulfill]').forEach(sel => sel.addEventListener('change', () => {
    const n = needById(sel.dataset.needFulfill);
    if (n) n.fulfill = sel.value;
    redraw();
  }));
  body.querySelectorAll('[data-need-cost]').forEach(inp => inp.addEventListener('change', () => {
    const n = needById(inp.dataset.needCost);
    if (n) n.estUnitCost = Math.max(0, +inp.value || 0);
    redraw();
  }));
  body.querySelectorAll('[data-use-stock]').forEach(btn => btn.addEventListener('click', () => {
    reserveFromStock(btn.dataset.useStock);
    redraw();
  }));
  body.querySelectorAll('[data-issue-stock]').forEach(btn => btn.addEventListener('click', () => {
    issueStock(btn.dataset.issueStock);
    redraw();
  }));
  body.querySelectorAll('[data-add-cart]').forEach(btn => btn.addEventListener('click', () => {
    addNeedToCart(btn.dataset.addCart);
    toast('Added to cart');
    redraw();
  }));
  body.querySelector('[data-parts-add-selected]')?.addEventListener('click', () => {
    Object.entries(state.parts.selected).forEach(([id, on]) => { if (on) addNeedToCart(id); });
    state.parts.selected = {};
    toast('Selected lines added to cart');
    redraw();
  });
  body.querySelector('[data-parts-add-manual]')?.addEventListener('click', () => {
    store().needs.unshift({
      id: 'n' + Date.now().toString(36),
      part: 'New part',
      pn: 'TBD',
      need: 1,
      why: 'manual',
      reason: 'Added by service writer',
      taskId: null,
      fulfill: 'order',
      estUnitCost: 0,
      vendorHint: 'RockAuto',
      qtyReserved: 0,
      qtyIssued: 0,
    });
    toast('Manual part added — set PN and estimate');
    redraw();
  });
  body.querySelectorAll('[data-cart-remove]').forEach(btn => btn.addEventListener('click', () => {
    store().cart = store().cart.filter(l => l.needId !== btn.dataset.cartRemove);
    redraw();
  }));
  body.querySelector('[data-submit-cart]')?.addEventListener('click', () => {
    submitCartAsPOs();
    redraw();
  });
  body.querySelectorAll('[data-po-toggle]').forEach(btn => btn.addEventListener('click', () => {
    state.parts.openPo = state.parts.openPo === btn.dataset.poToggle ? null : btn.dataset.poToggle;
    redraw();
  }));
  body.querySelectorAll('[data-receive]').forEach(btn => {
    const [poId, idx] = btn.dataset.receive.split('|');
    btn.addEventListener('click', () => { receivePoLine(poId, +idx); redraw(); });
  });
  body.querySelectorAll('[data-goto-task]').forEach(btn => btn.addEventListener('click', () => {
    state.tab = 'measurements';
    state.taskId = btn.dataset.gotoTask;
    renderBuild();
  }));
  body.querySelectorAll('[data-filter-need]').forEach(btn => btn.addEventListener('click', () => {
    state.parts.filter = 'all';
    state.parts.selected = { [btn.dataset.filterNeed]: true };
    redraw();
  }));
}

/* ---------- End-of-build report ---------- */
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function reportFieldLabel(fieldId, m) {
  if (fieldId.startsWith('cylinder_block.bore.')) {
    const rest = fieldId.slice('cylinder_block.bore.'.length); // C1.TX
    const [cyl, pos] = rest.split('.');
    return `Bore ${cyl} ${pos || ''}`.trim();
  }
  if (fieldId.startsWith('balance.')) return 'Balance · ' + fieldId.slice(8);
  const [base, inst] = fieldId.split('@');
  const label = m?.label || base.split('.').slice(1).join('.') || base;
  return inst ? `${label} · ${inst}` : label;
}

function buildReportData(b = getBuild()) {
  return withBuild(b, () => {
    const tasks = buildTasks(b);
    const readings = [];
    const exceptions = [];
    tasks.forEach(t => {
      const fields = taskFields(t);
      const phase = PHASES.find(p => p.key === t.phase);
      fields.forEach(f => {
        const v = getV(t.id, f.id);
        if (v === '' || v == null) return;
        const ev = evaluate(f.m, v);
        const row = {
          phase: phase?.label?.split(' — ')[0] || t.phase,
          task: shortTaskName(t),
          taskId: t.id,
          field: f.id,
          label: reportFieldLabel(f.id, f.m),
          value: v,
          unit: f.m?.unit || '',
          limit: specRangeText(f.m || {}),
          result: ev.text,
          cls: ev.cls,
          replace: isReplace(t.id, f.id),
        };
        readings.push(row);
        if (['warn', 'bad'].includes(ev.cls) || row.replace) exceptions.push(row);
      });
      const note = getNote(t.id + '._notes');
      if (note) readings.push({
        phase: phase?.label?.split(' — ')[0] || t.phase,
        task: shortTaskName(t), taskId: t.id, field: '_notes',
        label: 'Section notes', value: note, unit: '', limit: '—', result: 'Note', cls: 'muted', replace: false, isNote: true,
      });
    });

    const replaced = [];
    Object.entries(store().replace).forEach(([k, partLabel]) => {
      const [tid, field] = k.split('|');
      const t = TASKS.find(x => x.id === tid);
      const need = store().needs.find(n => n._replaceKey === k);
      replaced.push({
        part: partLabel,
        pn: need?.pn || '—',
        why: t ? `Inspect › ${shortTaskName(t)}` : 'Inspection',
        field,
        fulfill: need?.fulfill || 'order',
        need,
      });
    });
    store().needs.filter(n => n.why === 'inspection' && !n._replaceKey).forEach(n => {
      if (replaced.some(r => r.need?.id === n.id)) return;
      replaced.push({ part: n.part, pn: n.pn, why: n.reason, field: null, fulfill: n.fulfill, need: n });
    });

    const used = store().needs.map(n => {
      const c = needCoverage(n);
      return { n, c };
    }).filter(({ n, c }) => c.receivedPo > 0 || c.fromStock > 0 || n.fulfill === 'customer');

    const blocking = blockingParts();
    const totals = partsTotals();
    const pos = store().pos.map(po => ({
      ...po,
      total: po.lines.reduce((a, l) => a + l.qtyOrdered * l.unitCost, 0),
      lines: po.lines.map(l => ({ ...l, part: needById(l.needId)?.part || l.needId, pn: needById(l.needId)?.pn || '' })),
    }));

    const checklist = PHASES.map(p => {
      const ts = tasks.filter(t => t.phase === p.key);
      if (!ts.length) return null;
      return {
        phase: p,
        done: ts.filter(t => isTaskDone(t)).length,
        total: ts.length,
        tasks: ts.map(t => {
          const prog = taskProgress(t);
          return { t, done: isTaskDone(t), prog };
        }),
      };
    }).filter(Boolean);

    return {
      b,
      generatedAt: new Date(),
      progress: buildLiveProgress(b),
      archLine: archSummaryLine(b.architecture),
      readings,
      exceptions,
      replaced,
      used,
      blocking,
      totals,
      pos,
      checklist,
      spec: SPEC?.engine || null,
    };
  });
}

function fmtReading(v) {
  if (v === 'pass' || v === 'fail' || v === 'na') return String(v).toUpperCase();
  if (typeof v === 'number' || (v !== '' && v != null && !isNaN(v))) {
    const n = Number(v);
    return Number.isInteger(n) ? String(n) : String(Math.round(n * 1000) / 1000);
  }
  return String(v);
}

function renderReport() {
  const b = BUILDS.find(x => x.id === state.buildId);
  if (!b) return navigate('builds');
  const d = buildReportData(b);
  const [stCls, stTxt] = STATUS_BADGE[b.status];
  const dateStr = d.generatedAt.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  $('#crumb').innerHTML = `<span data-nav="builds">Builds</span> / <span data-build="${b.id}">${esc(b.name)}</span> / <b>Report</b>`;

  const exceptionHtml = (d.exceptions.length || d.blocking.length || d.replaced.length) ? `
    <section class="rpt-section">
      <h3>Exceptions</h3>
      <p class="rpt-lead">Findings that need attention — out of spec, replaced, or parts still open.</p>
      ${d.exceptions.length ? `
        <h4 class="rpt-subh">Measurement findings (${d.exceptions.length})</h4>
        <table class="rpt-table">
          <thead><tr><th>Section</th><th>Measurement</th><th>Value</th><th>Limit</th><th>Result</th><th></th></tr></thead>
          <tbody>${d.exceptions.map(r => `<tr class="rpt-${r.cls}">
            <td>${esc(r.task)}</td><td>${esc(r.label)}</td>
            <td class="num">${esc(fmtReading(r.value))} ${esc(r.unit)}</td>
            <td class="muted">${esc(r.limit)}</td>
            <td>${badge(r.cls, SHORT[r.result] || r.result)}</td>
            <td>${r.replace ? badge('bad', 'Replace') : ''}</td>
          </tr>`).join('')}</tbody>
        </table>` : '<p class="rpt-empty">No out-of-spec readings recorded.</p>'}
      ${d.replaced.length ? `
        <h4 class="rpt-subh">Replaced / rejected (${d.replaced.length})</h4>
        <table class="rpt-table">
          <thead><tr><th>Part</th><th>P/N</th><th>Why</th><th>Fulfill</th></tr></thead>
          <tbody>${d.replaced.map(r => `<tr>
            <td><b>${esc(r.part)}</b></td><td>${esc(r.pn)}</td><td>${esc(r.why)}</td><td>${esc(r.fulfill)}</td>
          </tr>`).join('')}</tbody>
        </table>` : ''}
      ${d.blocking.length ? `
        <h4 class="rpt-subh">Parts still open (${d.blocking.length})</h4>
        <table class="rpt-table">
          <thead><tr><th>Part</th><th>Need</th><th>Status</th><th>Est.</th></tr></thead>
          <tbody>${d.blocking.map(({ n, c, bo }) => `<tr>
            <td><b>${esc(n.part)}</b><div class="muted">${esc(n.pn)}</div></td>
            <td class="num">${n.need}</td>
            <td>${bo ? badge('bad', 'Backordered') : needStatusBadge(n)}</td>
            <td class="num">${money2(n.need * (n.estUnitCost || 0))}</td>
          </tr>`).join('')}</tbody>
        </table>` : ''}
    </section>` : `
    <section class="rpt-section">
      <h3>Exceptions</h3>
      <p class="rpt-ok">No exceptions — no OoS/LIM findings, replacements, or open parts.</p>
    </section>`;

  const checklistHtml = `
    <section class="rpt-section">
      <h3>Completion checklist</h3>
      <p class="rpt-lead">Work-plan progress by phase for this architecture.</p>
      <div class="rpt-check-grid">
        ${d.checklist.map(ph => `
          <div class="rpt-check-phase ${ph.done === ph.total ? 'done' : ''}">
            <div class="rpt-check-head">
              <b>${esc(ph.phase.num)}. ${esc(ph.phase.label.split(' — ')[0])}</b>
              <span>${ph.done}/${ph.total}</span>
            </div>
            <ul>${ph.tasks.map(({ t, done, prog }) => `
              <li class="${done ? 'done' : prog.issue ? 'issue' : ''}">
                <span class="mark">${done ? '✓' : prog.issue ? '!' : '○'}</span>
                ${esc(shortTaskName(t))}
                ${prog.total ? `<span class="muted">${prog.filled}/${prog.total}</span>` : ''}
              </li>`).join('')}
            </ul>
          </div>`).join('')}
      </div>
    </section>`;

  const measHtml = `
    <section class="rpt-section">
      <h3>Measurement log</h3>
      <p class="rpt-lead">${d.readings.filter(r => !r.isNote).length} recorded values · ${d.progress}% sections complete</p>
      ${d.readings.length ? `
        <table class="rpt-table">
          <thead><tr><th>Phase</th><th>Section</th><th>Measurement</th><th>Value</th><th>Limit</th><th>Result</th></tr></thead>
          <tbody>${d.readings.map(r => r.isNote ? `<tr class="rpt-note">
            <td>${esc(r.phase)}</td><td>${esc(r.task)}</td><td colspan="4"><i>${esc(r.value)}</i></td>
          </tr>` : `<tr class="rpt-${r.cls}">
            <td>${esc(r.phase)}</td><td>${esc(r.task)}</td><td>${esc(r.label)}${r.replace ? ' ' + badge('bad', 'Replace') : ''}</td>
            <td class="num">${esc(fmtReading(r.value))} ${esc(r.unit)}</td>
            <td class="muted">${esc(r.limit)}</td>
            <td>${badge(r.cls, SHORT[r.result] || r.result)}</td>
          </tr>`).join('')}</tbody>
        </table>` : '<p class="rpt-empty">No measurements recorded yet.</p>'}
    </section>`;

  const usedRows = d.used.map(({ n, c }) => {
    const qty = Math.max(c.receivedPo + c.fromStock, n.fulfill === 'customer' ? n.need : 0);
    let unitCost = n.estUnitCost || 0;
    let source = 'Purchase order';
    if (n.fulfill === 'customer') source = 'Customer';
    else if (c.fromStock && !c.receivedPo) {
      source = 'Shop stock';
      unitCost = stockFor(n.pn)?.unitCost ?? n.estUnitCost ?? 0;
    } else if (c.receivedPo && c.fromStock) source = 'PO + stock';
    d.pos.forEach(po => po.lines.forEach(l => {
      if (l.needId === n.id && l.qtyReceived) unitCost = l.unitCost;
    }));
    if (c.fromStock && !c.receivedPo) unitCost = stockFor(n.pn)?.unitCost ?? n.estUnitCost ?? 0;
    return `<tr>
      <td><b>${esc(n.part)}</b><div class="muted">${esc(n.pn)}</div></td>
      <td>${esc(n.reason || n.why)}</td>
      <td>${esc(source)}</td>
      <td class="num">${qty}</td>
      <td class="num">${money2(unitCost)}</td>
      <td class="num">${money2(qty * unitCost)}</td>
    </tr>`;
  }).join('');

  const usedHtml = `
    <section class="rpt-section">
      <h3>Parts used</h3>
      <p class="rpt-lead">Received, issued from stock, or customer-supplied.</p>
      ${d.used.length ? `<table class="rpt-table">
          <thead><tr><th>Part</th><th>Why</th><th>Source</th><th>Qty</th><th>Unit</th><th>Ext.</th></tr></thead>
          <tbody>${usedRows}</tbody>
        </table>` : '<p class="rpt-empty">No parts received or issued yet.</p>'}
    </section>`;

  const costHtml = `
    <section class="rpt-section">
      <h3>Cost rollup</h3>
      <div class="rpt-cost-strip">
        <div><div class="label">Estimate</div><div class="value">${money(d.totals.estimate)}</div></div>
        <div><div class="label">Committed (open POs)</div><div class="value">${money(d.totals.committed)}</div></div>
        <div><div class="label">From stock</div><div class="value">${money(d.totals.fromStock)}</div></div>
        <div><div class="label">Still to cover</div><div class="value ${d.totals.stillToCover ? 'bad' : ''}">${money(d.totals.stillToCover)}</div></div>
        <div class="emphasize"><div class="label">Actual so far</div><div class="value">${money(d.totals.actual)}</div></div>
      </div>
    </section>`;

  const poHtml = `
    <section class="rpt-section">
      <h3>Purchase order trail</h3>
      ${d.pos.length ? d.pos.map(po => `
        <div class="rpt-po">
          <div class="rpt-po-head">
            <b>${esc(po.id)}</b> · ${esc(po.vendor)}
            <span>${money(po.total)} · ${po.eta ? 'ETA ' + esc(po.eta) + ' · ' : ''}${badge(...(STATUS_BADGE[po.status] || ['muted', po.status]))}</span>
          </div>
          <table class="rpt-table compact">
            <thead><tr><th>Line</th><th>Ordered</th><th>Received</th><th>Unit</th><th>Ext.</th></tr></thead>
            <tbody>${po.lines.map(l => `<tr>
              <td>${esc(l.part)}<div class="muted">${esc(l.pn)}</div></td>
              <td class="num">${l.qtyOrdered}</td>
              <td class="num">${l.qtyReceived}</td>
              <td class="num">${money2(l.unitCost)}</td>
              <td class="num">${money2(l.qtyOrdered * l.unitCost)}</td>
            </tr>`).join('')}</tbody>
          </table>
        </div>`).join('') : '<p class="rpt-empty">No purchase orders on this build.</p>'}
    </section>`;

  content().innerHTML = `
    <div class="rpt-toolbar no-print">
      <button class="btn" data-build="${b.id}">‹ Back to build</button>
      <div class="spacer"></div>
      <button class="btn primary" data-report-print>Print / Save PDF</button>
    </div>
    <article class="rpt" id="build-report">
      <header class="rpt-cover">
        <div class="rpt-brand">Motor<span>Base</span> · Precision Engine Works</div>
        <h1>${esc(b.name)}</h1>
        <p class="rpt-meta">
          ${esc(b.engineName)} · <b>${esc(b.engine)}</b> · spec ${esc(b.specRev)}<br>
          ${esc(d.archLine)} · ${badge(stCls, stTxt)} · ${d.progress}% complete
        </p>
        <p class="rpt-generated">Report generated ${esc(dateStr)}</p>
      </header>
      ${exceptionHtml}
      ${checklistHtml}
      ${measHtml}
      ${usedHtml}
      ${costHtml}
      ${poHtml}
      <footer class="rpt-foot">MotorBase build report · ${esc(b.id)} · ${esc(dateStr)}</footer>
    </article>`;
}

function renderSpecs() {
  $('#crumb').innerHTML = '<b>Engine specs</b>';
  const nMeas = SPEC?.sections?.reduce((a, s) => a + s.measurements.length, 0) || 0;
  content().innerHTML = `
    <div class="page-head">
      <div>
        <h2>Engine specifications</h2>
        <p>Limits catalogs for pass/fail. Topology (cams, valves, modules) lives on each build’s Architecture tab.</p>
      </div>
      <div class="spacer"></div>
      <button class="btn" id="dl-template">${ICONS.download} Download template</button>
      <button class="btn primary" id="up-spec">${ICONS.upload} Upload spec</button>
    </div>
    <div class="card table-card" style="margin-bottom:20px"><table>
      <thead><tr><th>Engine type</th><th>Description</th><th>Sections</th><th>Limit fields</th><th></th></tr></thead>
      <tbody>
        <tr>
          <td><b>${SPEC.engine.type}</b></td>
          <td>${SPEC.engine.manufacturer} ${SPEC.engine.displacementCc}cc ${SPEC.engine.configuration}</td>
          <td>${SPEC.sections.length}</td><td>${nMeas}</td><td>${badge('ok', 'Active')}</td>
        </tr>
        <tr>
          <td><b>SBC350</b></td><td>Chevrolet 5735cc V8</td>
          <td>—</td><td>—</td><td>${badge('muted', 'Limits not uploaded')}</td>
        </tr>
        <tr>
          <td><b>COYOTE</b></td><td>Ford 4951cc V8</td>
          <td>—</td><td>—</td><td>${badge('muted', 'Limits not uploaded')}</td>
        </tr>
      </tbody></table></div>
    <div class="page-head"><h2 style="font-size:16px">${SPEC.engine.type} · specification sections</h2></div>
    <div class="grid cards">${(SPEC.sections || []).map(s => `
      <div class="section-block"><h4>${s.title} <span class="badge muted" style="float:right">${s.measurements.length}</span></h4>
      <div style="padding:12px 14px">${s.measurements.slice(0, 4).map(m => `<span class="chip">${m.label}</span>`).join('')}${s.measurements.length > 4 ? `<span class="chip">+${s.measurements.length - 4} more</span>` : ''}</div></div>`).join('')}</div>`;
  $('#dl-template').addEventListener('click', () => toast('Downloading engine-spec.template.json'));
  $('#up-spec').addEventListener('click', () => toast('Validated against schema ✓'));
}

/* ---------- toast + events ---------- */
let toastTimer;
function toast(msg, action) {
  const t = $('#toast');
  if (action?.label && action?.onClick) {
    t.innerHTML = `<span>${msg}</span><button type="button" class="toast-action">${action.label}</button>`;
    t.querySelector('.toast-action').onclick = e => {
      e.stopPropagation();
      t.classList.remove('show');
      action.onClick();
    };
  } else {
    t.textContent = msg;
  }
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), action ? 4200 : 2600);
}

function navigate(route, arg) {
  state.route = route;
  if (route === 'build') { state.buildId = arg; state.tab = 'measurements'; }
  window.scrollTo(0, 0);
  render();
}

function dashGoto(focus) {
  const candidates = BUILDS.filter(b => b.status !== 'completed');
  let target = null;
  if (focus === 'parts') {
    target = candidates.find(b => buildPartsBlockingCount(b) > 0)
      || candidates.find(b => withBuild(b, () => store().pos.some(p => p.status === 'SUBMITTED' || p.status === 'BACKORDERED')))
      || candidates[0];
    if (target) { navigate('build', target.id); state.tab = 'parts'; return renderBuild(); }
  }
  if (focus === 'meas') {
    target = candidates.find(b => withBuild(b, () => buildTasks(b).some(t => taskProgress(t).issue)))
      || candidates.find(b => b.status === 'in_progress')
      || candidates[0];
    if (target) { navigate('build', target.id); state.tab = 'measurements'; return renderBuild(); }
  }
  return navigate('builds');
}

document.addEventListener('click', e => {
  const nav = e.target.closest('[data-nav]');
  if (nav) { state.setup = null; document.body.classList.remove('report-mode'); return navigate(nav.dataset.nav); }
  const dash = e.target.closest('[data-dash-focus]');
  if (dash) return dashGoto(dash.dataset.dashFocus);
  if (e.target.closest('[data-report-print]')) { window.print(); return; }
  if (e.target.closest('[data-report]')) {
    if (!state.buildId) return;
    state.route = 'report';
    window.scrollTo(0, 0);
    return render();
  }
  const b = e.target.closest('[data-build]');
  if (b) return navigate('build', b.dataset.build);
  if (e.target.closest('[data-setup-new]')) {
    state.setup = { step: 'template', templateId: 'v6_sohc_rocker', arch: cloneArch(ARCH_TEMPLATES[0]), name: '' };
    state.route = 'setup';
    window.scrollTo(0, 0);
    return render();
  }
  const tmpl = e.target.closest('[data-setup-template]');
  if (tmpl) {
    const t = ARCH_TEMPLATES.find(x => x.id === tmpl.dataset.setupTemplate);
    state.setup.templateId = t.id;
    state.setup.arch = cloneArch(t);
    return renderSetup();
  }
  if (e.target.closest('[data-setup-next]')) {
    if (!state.setup?.templateId) return;
    state.setup.step = 'edit';
    if (!state.setup.name) state.setup.name = ARCH_TEMPLATES.find(t => t.id === state.setup.templateId)?.title + ' build';
    return renderSetup();
  }
  if (e.target.closest('[data-setup-back]')) {
    state.setup.step = 'template';
    return renderSetup();
  }
  if (e.target.closest('[data-setup-create]')) {
    const s = state.setup;
    if (!s?.arch) return;
    const name = (document.querySelector('[data-setup-name]')?.value || s.name || 'New build').trim();
    if (s.replaceBuildId) {
      const build = BUILDS.find(x => x.id === s.replaceBuildId);
      build.architecture = cloneArch(s.arch);
      build.archTemplateId = s.templateId;
      toast('Architecture applied');
      state.setup = null;
      return navigate('build', build.id);
    }
    const id = 'b' + Date.now().toString(36);
    const tmpl = ARCH_TEMPLATES.find(t => t.id === s.templateId);
    BUILD_STORES[id] = emptyBuildStore();
    BUILDS.unshift({
      id, name, engine: tmpl?.id?.toUpperCase() || 'CUSTOM', engineName: tmpl?.title || 'Custom',
      status: 'planned', specRev: '—', progress: 0,
      archTemplateId: s.templateId, architecture: cloneArch(s.arch),
    });
    state.setup = null;
    toast('Build created from architecture template');
    return navigate('build', id);
  }
  const tab = e.target.closest('[data-tab]');
  if (tab && state.route === 'build') { state.tab = tab.dataset.tab; renderBuild(); return; }
  const phase = e.target.closest('[data-phase]');
  if (phase) {
    const ts = buildTasks().filter(t => t.phase === phase.dataset.phase);
    const first = ts.find(t => !isTaskDone(t)) || ts[0];
    if (first) selectTask(first.id);
    return;
  }
  const task = e.target.closest('[data-task]');
  if (task) { selectTask(task.dataset.task); return; }
  if (e.target.closest('[data-rename]')) { state.renaming = true; renderBuild(); const i = $('#rename-input'); if (i) { i.focus(); i.select(); } return; }
  if (e.target.closest('[data-rename-cancel]')) { state.renaming = false; renderBuild(); return; }
  if (e.target.closest('[data-rename-save]')) {
    const i = $('#rename-input'); const build = BUILDS.find(x => x.id === state.buildId);
    if (i && build && i.value.trim()) { build.name = i.value.trim(); toast('Build renamed'); }
    state.renaming = false; renderBuild(); return;
  }
});
document.addEventListener('keydown', e => {
  if (state.route !== 'build' || state.tab !== 'measurements') return;
  if (e.target.matches('input, textarea, select')) return;
  if (e.key === 'ArrowRight' || e.key === 'j') { const n = nextTaskId(state.taskId); if (n) selectTask(n); }
  if (e.key === 'ArrowLeft' || e.key === 'k') { const p = prevTaskId(state.taskId); if (p) selectTask(p); }
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
