/* Engine architecture — topology templates and capability helpers.
   Specs hold numeric limits; architecture holds what exists and how it's arranged. */

const ARCH_FAMILIES = {
  sohc_rocker: { label: 'SOHC · shaft rocker', short: 'SOHC rocker' },
  dohc_bucket: { label: 'DOHC · bucket follower', short: 'DOHC bucket' },
  ohv_pushrod: { label: 'OHV · pushrod', short: 'OHV pushrod' },
  sohc_single: { label: 'SOHC · single cylinder', short: 'Single OHC' },
};

function cloneArch(a) {
  return JSON.parse(JSON.stringify(a));
}

function bankCylinders(form, banks, cylinders) {
  if (form === 'inline' || banks.length === 1) {
    return { [banks[0]]: Array.from({ length: cylinders }, (_, i) => i + 1) };
  }
  // Odd cylinders on bank 0, even on bank 1 (common V numbering for demos)
  const map = {};
  banks.forEach(b => { map[b] = []; });
  for (let c = 1; c <= cylinders; c++) map[banks[(c - 1) % banks.length]].push(c);
  return map;
}

function buildHeads(form, banks, cylinders) {
  const byBank = bankCylinders(form, banks, cylinders);
  return banks.map((bank, i) => ({
    id: bank.toLowerCase().replace(/\s+/g, '_'),
    label: bank,
    bank,
    cylinders: byBank[bank],
  }));
}

function makeArch({ id, title, blurb, family, form, banks, cylinders, mainJournals, valves, cams, valvetrain, example }) {
  const heads = buildHeads(form, banks, cylinders);
  const camshafts = cams.map(c => {
    if (c.mount === 'block') return { id: c.id, mount: 'block', role: c.role || 'shared', label: c.label || 'Block cam' };
    const head = heads.find(h => h.id === c.headId) || heads[0];
    return {
      id: c.id,
      mount: 'head',
      headId: head.id,
      role: c.role || 'shared',
      label: c.label || `${head.label} · ${c.role === 'intake' ? 'Intake' : c.role === 'exhaust' ? 'Exhaust' : 'Cam'}`,
    };
  });
  return {
    id, title, blurb, family, example: !!example,
    block: { form, banks: [...banks], cylinders, mainJournals },
    heads,
    valvesPerCylinder: { intake: valves.intake, exhaust: valves.exhaust },
    camshafts,
    valvetrain: { ...valvetrain },
  };
}

const ARCH_TEMPLATES = [
  makeArch({
    id: 'v6_sohc_rocker',
    title: 'V6 SOHC · shaft rocker',
    blurb: 'Two heads, one shared cam per head, intake/exhaust rocker banks — e.g. VG33E.',
    family: 'sohc_rocker',
    form: 'V', banks: ['Left', 'Right'], cylinders: 6, mainJournals: 4,
    valves: { intake: 1, exhaust: 1 },
    cams: [
      { id: 'left_cam', mount: 'head', headId: 'left', role: 'shared', label: 'Left cam' },
      { id: 'right_cam', mount: 'head', headId: 'right', role: 'shared', label: 'Right cam' },
    ],
    valvetrain: { type: 'shaft_rocker', hasPushrods: false, hasLifters: true, hasRockerShafts: true, rockerBanks: 'per_head_intake_exhaust' },
    example: true,
  }),
  makeArch({
    id: 'i4_dohc_16v',
    title: 'Inline-4 DOHC · 16v',
    blurb: 'One head, separate intake & exhaust cams, bucket followers — modern 4-cyl.',
    family: 'dohc_bucket',
    form: 'inline', banks: ['Inline'], cylinders: 4, mainJournals: 5,
    valves: { intake: 2, exhaust: 2 },
    cams: [
      { id: 'intake_cam', mount: 'head', headId: 'inline', role: 'intake', label: 'Intake cam' },
      { id: 'exhaust_cam', mount: 'head', headId: 'inline', role: 'exhaust', label: 'Exhaust cam' },
    ],
    valvetrain: { type: 'bucket_follower', hasPushrods: false, hasLifters: false, hasRockerShafts: false },
  }),
  makeArch({
    id: 'v8_ohv_pushrod',
    title: 'V8 OHV · pushrod',
    blurb: 'One block-mounted cam, pushrods & pedestal rockers — classic SBC / similar.',
    family: 'ohv_pushrod',
    form: 'V', banks: ['Left', 'Right'], cylinders: 8, mainJournals: 5,
    valves: { intake: 1, exhaust: 1 },
    cams: [{ id: 'block_cam', mount: 'block', role: 'shared', label: 'Block cam' }],
    valvetrain: { type: 'pushrod', hasPushrods: true, hasLifters: true, hasRockerShafts: false, rockerType: 'pedestal' },
    example: true,
  }),
  makeArch({
    id: 'single_sohc',
    title: 'Single-cylinder SOHC',
    blurb: 'One cylinder, one head cam — motorcycle / industrial small engines.',
    family: 'sohc_single',
    form: 'inline', banks: ['Inline'], cylinders: 1, mainJournals: 2,
    valves: { intake: 1, exhaust: 1 },
    cams: [{ id: 'cam', mount: 'head', headId: 'inline', role: 'shared', label: 'Camshaft' }],
    valvetrain: { type: 'shaft_rocker', hasPushrods: false, hasLifters: true, hasRockerShafts: true, rockerBanks: 'per_head_intake_exhaust' },
  }),
];

function archCapabilities(arch) {
  const vt = arch?.valvetrain || {};
  return {
    shaft_rocker: vt.type === 'shaft_rocker' || !!vt.hasRockerShafts,
    pedestal_rocker: vt.rockerType === 'pedestal' || vt.type === 'pushrod',
    pushrods: !!vt.hasPushrods,
    lifters: !!vt.hasLifters,
    bucket_follower: vt.type === 'bucket_follower',
    multi_cam_roles: (arch?.camshafts || []).some(c => c.role === 'intake' || c.role === 'exhaust'),
  };
}

function archTaskVisible(task, arch) {
  if (!task.requires || !task.requires.length) return true;
  const cap = archCapabilities(arch);
  return task.requires.every(r => cap[r]);
}

function archSummaryLine(arch) {
  if (!arch) return 'No architecture';
  const v = arch.valvesPerCylinder || { intake: 1, exhaust: 1 };
  const cams = (arch.camshafts || []).length;
  const fam = ARCH_FAMILIES[arch.family]?.short || arch.family;
  return `${arch.block.cylinders} cyl · ${v.intake + v.exhaust}v · ${cams} cam${cams === 1 ? '' : 's'} · ${fam}`;
}

function archChips(arch) {
  if (!arch) return [];
  const v = arch.valvesPerCylinder;
  const cap = archCapabilities(arch);
  const chips = [
    `${arch.block.form === 'V' ? 'V' : 'I'}${arch.block.cylinders}`,
    `${v.intake} IN / ${v.exhaust} EX per cyl`,
    `${arch.camshafts.length} camshaft${arch.camshafts.length === 1 ? '' : 's'}`,
    `${arch.block.mainJournals} mains`,
    ARCH_FAMILIES[arch.family]?.short || arch.family,
  ];
  if (cap.pushrods) chips.push('Pushrods');
  if (cap.shaft_rocker) chips.push('Rocker shafts');
  if (cap.bucket_follower) chips.push('Bucket followers');
  if (cap.pedestal_rocker && !cap.shaft_rocker) chips.push('Pedestal rockers');
  return chips;
}

/** Compatibility layout used by older instance helpers. */
function archToLayout(arch) {
  if (!arch) return { config: 'I4', heads: ['Head'], cylinders: 4, mainJournals: 5, valves: { intake: 1, exhaust: 1 } };
  return {
    config: `${arch.block.form === 'V' ? 'V' : 'I'}${arch.block.cylinders}`,
    heads: arch.heads.map(h => h.label),
    headIds: arch.heads.map(h => h.id),
    cylinders: arch.block.cylinders,
    mainJournals: arch.block.mainJournals,
    valves: { ...arch.valvesPerCylinder },
    camshafts: arch.camshafts,
    valvetrain: arch.valvetrain,
  };
}

function moduleCatalog(arch) {
  const cap = archCapabilities(arch);
  return [
    { id: 'core', name: 'Block, pistons, rods, crank', active: true, note: 'Always on — counts from architecture' },
    { id: 'heads', name: 'Heads, valves, springs, guides', active: true, note: `${arch.heads.length} head(s) · ${arch.block.cylinders * (arch.valvesPerCylinder.intake + arch.valvesPerCylinder.exhaust)} valves` },
    { id: 'cams', name: 'Camshaft inspection', active: true, note: arch.camshafts.map(c => c.label).join(', ') },
    { id: 'shaft_rocker', name: 'Rocker shafts & shaft rockers', active: cap.shaft_rocker, note: cap.shaft_rocker ? 'Gated by shaft_rocker valvetrain' : 'Hidden for this architecture' },
    { id: 'pushrods', name: 'Pushrods & lifters', active: cap.pushrods || cap.lifters, note: cap.pushrods ? 'OHV pushrod path' : 'Not part of this valvetrain' },
    { id: 'bucket', name: 'Bucket / finger followers', active: cap.bucket_follower, note: cap.bucket_follower ? 'DOHC follower checks' : 'N/A' },
  ];
}

function topologyHtml(arch) {
  if (!arch) return '';
  const headCards = arch.heads.map(h => {
    const cams = arch.camshafts.filter(c => c.mount === 'head' && c.headId === h.id);
    const camBits = cams.length
      ? cams.map(c => `<span class="topo-pill cam">${c.role === 'shared' ? 'Cam' : c.role}</span>`).join('')
      : '<span class="topo-muted">No head cams</span>';
    return `<div class="topo-node head">
      <div class="topo-kicker">Head</div>
      <div class="topo-title">${h.label}</div>
      <div class="topo-sub">Cyl ${h.cylinders.join(', ')}</div>
      <div class="topo-pills">${camBits}</div>
    </div>`;
  }).join('');
  const blockCams = arch.camshafts.filter(c => c.mount === 'block');
  const blockCamHtml = blockCams.length
    ? blockCams.map(c => `<span class="topo-pill cam">${c.label}</span>`).join('')
    : '<span class="topo-muted">No block cam</span>';
  const vt = arch.valvetrain;
  return `<div class="topo">
    <div class="topo-node block">
      <div class="topo-kicker">Block · ${arch.block.form}</div>
      <div class="topo-title">${arch.block.cylinders} cylinders</div>
      <div class="topo-sub">${arch.block.mainJournals} main journals · banks ${arch.block.banks.join(' / ')}</div>
      <div class="topo-pills">${blockCamHtml}</div>
    </div>
    <div class="topo-arrow" aria-hidden="true">↓</div>
    <div class="topo-heads">${headCards}</div>
    <div class="topo-arrow" aria-hidden="true">↓</div>
    <div class="topo-node valvetrain">
      <div class="topo-kicker">Valvetrain</div>
      <div class="topo-title">${ARCH_FAMILIES[arch.family]?.label || vt.type}</div>
      <div class="topo-sub">${arch.valvesPerCylinder.intake} intake + ${arch.valvesPerCylinder.exhaust} exhaust valve(s) / cyl</div>
      <div class="topo-pills">
        ${vt.hasRockerShafts ? '<span class="topo-pill">Rocker shafts</span>' : ''}
        ${vt.hasPushrods ? '<span class="topo-pill">Pushrods</span>' : ''}
        ${vt.hasLifters ? '<span class="topo-pill">Lifters</span>' : ''}
        ${vt.type === 'bucket_follower' ? '<span class="topo-pill">Buckets</span>' : ''}
        ${vt.rockerType === 'pedestal' ? '<span class="topo-pill">Pedestal rockers</span>' : ''}
      </div>
    </div>
  </div>`;
}

function syncHeadsFromBlock(arch) {
  const { form, banks, cylinders } = arch.block;
  const prev = Object.fromEntries((arch.heads || []).map(h => [h.bank, h]));
  arch.heads = buildHeads(form, banks, cylinders).map(h => {
    const old = prev[h.bank];
    return old ? { ...h, id: old.id || h.id, label: old.label || h.label } : h;
  });
  // Keep head-mounted cams linked; drop cams whose head vanished
  const headIds = new Set(arch.heads.map(h => h.id));
  arch.camshafts = (arch.camshafts || []).filter(c => c.mount === 'block' || headIds.has(c.headId));
  // If a head has no cam and family expects head cams, leave as-is (user adds via UI)
  return arch;
}

function addCamshaft(arch, { mount = 'head', role = 'shared', headId } = {}) {
  const n = arch.camshafts.length + 1;
  if (mount === 'block') {
    arch.camshafts.push({ id: `block_cam_${n}`, mount: 'block', role, label: role === 'shared' ? 'Block cam' : `Block · ${role}` });
  } else {
    const head = arch.heads.find(h => h.id === headId) || arch.heads[0];
    if (!head) return arch;
    arch.camshafts.push({
      id: `${head.id}_${role}_${n}`,
      mount: 'head',
      headId: head.id,
      role,
      label: `${head.label} · ${role === 'shared' ? 'Cam' : role}`,
    });
  }
  return arch;
}

function setValvetrainFamily(arch, family) {
  arch.family = family;
  if (family === 'ohv_pushrod') {
    arch.valvetrain = { type: 'pushrod', hasPushrods: true, hasLifters: true, hasRockerShafts: false, rockerType: 'pedestal' };
    // Prefer a single block cam
    if (!arch.camshafts.some(c => c.mount === 'block')) {
      arch.camshafts = [{ id: 'block_cam', mount: 'block', role: 'shared', label: 'Block cam' }];
    }
  } else if (family === 'dohc_bucket') {
    arch.valvetrain = { type: 'bucket_follower', hasPushrods: false, hasLifters: false, hasRockerShafts: false };
    arch.valvesPerCylinder = { intake: Math.max(2, arch.valvesPerCylinder.intake), exhaust: Math.max(2, arch.valvesPerCylinder.exhaust) };
    const head = arch.heads[0];
    if (head) {
      arch.camshafts = [
        { id: 'intake_cam', mount: 'head', headId: head.id, role: 'intake', label: 'Intake cam' },
        { id: 'exhaust_cam', mount: 'head', headId: head.id, role: 'exhaust', label: 'Exhaust cam' },
      ];
    }
  } else {
    arch.valvetrain = { type: 'shaft_rocker', hasPushrods: false, hasLifters: true, hasRockerShafts: true, rockerBanks: 'per_head_intake_exhaust' };
    if (!arch.camshafts.length) {
      arch.heads.forEach(h => addCamshaft(arch, { mount: 'head', role: 'shared', headId: h.id }));
    }
  }
  return arch;
}
