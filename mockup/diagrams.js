/* Technical SVG diagrams + step-by-step procedures for the guided walkthrough.
   Diagrams use CSS classes defined in styles.css (.dgm-*). Numbered markers (①②③)
   correspond to the numbered measurement rows shown beside each diagram. */

const AH = (x, y, dir) => { // small arrowhead triangle, dir: up/down/left/right
  const s = 5;
  if (dir === 'up') return `<polygon points="${x - s},${y + s} ${x + s},${y + s} ${x},${y - s}" fill="#ea580c"/>`;
  if (dir === 'down') return `<polygon points="${x - s},${y - s} ${x + s},${y - s} ${x},${y + s}" fill="#ea580c"/>`;
  if (dir === 'left') return `<polygon points="${x + s},${y - s} ${x + s},${y + s} ${x - s},${y}" fill="#ea580c"/>`;
  return `<polygon points="${x - s},${y - s} ${x - s},${y + s} ${x + s},${y}" fill="#ea580c"/>`;
};
const MK = (n, x, y) => `<g class="mk"><circle cx="${x}" cy="${y}" r="12"/><text x="${x}" y="${y}">${n}</text></g>`;

const DIAGRAMS = {
  head_flatness: `<svg viewBox="0 0 460 300">
    <rect x="34" y="52" width="392" height="196" rx="12" class="dgm-face"/>
    <circle cx="118" cy="108" r="30" class="dgm-part"/><circle cx="230" cy="108" r="30" class="dgm-part"/><circle cx="342" cy="108" r="30" class="dgm-part"/>
    <circle cx="118" cy="192" r="30" class="dgm-part"/><circle cx="230" cy="192" r="30" class="dgm-part"/><circle cx="342" cy="192" r="30" class="dgm-part"/>
    <line x1="46" y1="150" x2="414" y2="150" class="dgm-dash"/><line x1="230" y1="58" x2="230" y2="242" class="dgm-dash"/>
    <line x1="50" y1="74" x2="410" y2="226" class="dgm-acc"/>
    <text x="366" y="70" class="dgm-lbl">straightedge</text>
    ${MK(1, 230, 150)}
    <text x="230" y="278" class="dgm-cap" text-anchor="middle">Slide a feeler gauge under a straightedge in six directions; record the widest gap.</text>
  </svg>`,

  head_height: `<svg viewBox="0 0 460 300">
    <rect x="120" y="66" width="250" height="150" rx="6" class="dgm-face"/>
    <path d="M150 216 q40 -58 80 0" class="dgm-part"/><path d="M250 216 q40 -58 80 0" class="dgm-part"/>
    <line x1="120" y1="66" x2="370" y2="66" class="dgm-acc"/><line x1="120" y1="216" x2="370" y2="216" class="dgm-acc"/>
    <text x="374" y="63" class="dgm-cap">cam-cover face</text><text x="374" y="228" class="dgm-cap">deck face</text>
    <line x1="86" y1="66" x2="86" y2="216" class="dgm-acc"/>${AH(86, 66, 'up')}${AH(86, 216, 'down')}
    <text x="52" y="145" class="dgm-lbl">height</text>
    ${MK(1, 86, 141)}
    <text x="230" y="266" class="dgm-cap" text-anchor="middle">Measure deck (head-to-block) face to the cam-cover face.</text>
  </svg>`,

  valve_guide: `<svg viewBox="0 0 460 300">
    <rect x="196" y="70" width="30" height="90" class="dgm-part"/>
    <line x1="211" y1="40" x2="211" y2="210" class="dgm-line"/>
    <path d="M181 210 q30 46 60 0 z" class="dgm-part"/>
    <text x="236" y="120" class="dgm-cap">guide</text>
    <circle cx="300" cy="60" r="26" class="dgm-part"/><line x1="300" y1="60" x2="285" y2="48" class="dgm-acc"/><text x="330" y="64" class="dgm-cap">dial gauge</text>
    <line x1="188" y1="46" x2="234" y2="46" class="dgm-acc"/>${AH(188, 46, 'left')}${AH(234, 46, 'right')}
    <text x="150" y="34" class="dgm-lbl">deflection</text>
    ${MK(1, 260, 120)}
    <g transform="translate(60,150)"><rect x="0" y="0" width="16" height="60" class="dgm-part"/><rect x="-7" y="18" width="30" height="24" class="dgm-acc-fill"/><text x="8" y="82" class="dgm-cap" text-anchor="middle">stem/guide</text></g>
    <text x="230" y="278" class="dgm-cap" text-anchor="middle">Rock the valve to read deflection; else measure stem OD vs guide ID.</text>
  </svg>`,

  valve_seat: `<svg viewBox="0 0 460 300">
    <path d="M120 90 H360 V150 L300 210 H180 L120 150 Z" class="dgm-face"/>
    <line x1="180" y1="210" x2="300" y2="210" class="dgm-line"/>
    <line x1="250" y1="150" x2="300" y2="210" class="dgm-acc"/>
    <text x="308" y="196" class="dgm-lbl">45°</text>
    <line x1="250" y1="150" x2="285" y2="150" class="dgm-acc"/>${AH(250, 150, 'left')}${AH(285, 150, 'right')}
    <text x="248" y="140" class="dgm-lbl">W</text>
    ${MK(1, 268, 150)}${MK(2, 300, 210)}
    <text x="230" y="262" class="dgm-cap" text-anchor="middle">Check seat contact band: measure contacting width W ① and confirm angle ②.</text>
  </svg>`,

  valve_dims: `<svg viewBox="0 0 460 300">
    <path d="M150 210 q80 60 160 0 l-6 -22 h-148 z" class="dgm-face"/>
    <rect x="222" y="60" width="16" height="128" class="dgm-part"/>
    <line x1="150" y1="232" x2="310" y2="232" class="dgm-dash"/>${AH(150, 232, 'left')}${AH(310, 232, 'right')}<text x="220" y="248" class="dgm-lbl">D (head)</text>
    <line x1="360" y1="60" x2="360" y2="222" class="dgm-dash"/>${AH(360, 60, 'up')}${AH(360, 222, 'down')}<text x="368" y="145" class="dgm-cap">L</text>
    <line x1="214" y1="96" x2="246" y2="96" class="dgm-acc"/>${AH(214, 96, 'left')}${AH(246, 96, 'right')}<text x="140" y="100" class="dgm-lbl">d (stem)</text>
    <line x1="300" y1="196" x2="322" y2="188" class="dgm-acc"/><text x="326" y="192" class="dgm-lbl">T</text>
    ${MK(1, 230, 96)}${MK(2, 300, 210)}
    <text x="230" y="276" class="dgm-cap" text-anchor="middle">Measure stem diameter d ① (top/center/bottom) and margin thickness T ②.</text>
  </svg>`,

  valve_spring: `<svg viewBox="0 0 460 300">
    <line x1="120" y1="220" x2="230" y2="220" class="dgm-line"/>
    <path d="M140 220 L200 200 L140 180 L200 160 L140 140 L200 120 L140 100 L200 80" class="dgm-line-2"/>
    <line x1="96" y1="80" x2="96" y2="220" class="dgm-acc"/>${AH(96, 80, 'up')}${AH(96, 220, 'down')}<text x="40" y="152" class="dgm-lbl">free ht</text>
    ${MK(1, 96, 150)}
    <g transform="translate(280,90)"><line x1="0" y1="0" x2="0" y2="120" class="dgm-dash"/><path d="M0 100 L60 100 L60 92" class="dgm-line-2"/><line x1="0" y1="0" x2="20" y2="0" class="dgm-acc"/><text x="26" y="4" class="dgm-cap">out-of-square</text><line x1="70" y1="60" x2="70" y2="120" class="dgm-acc"/>${AH(70, 120, 'down')}<text x="78" y="96" class="dgm-lbl">P @ ht</text></g>
    ${MK(2, 350, 150)}
    <text x="230" y="272" class="dgm-cap" text-anchor="middle">Check free height ①, out-of-square, and pressure at installed height ②.</text>
  </svg>`,

  bore: `<svg viewBox="0 0 460 300">
    <rect x="46" y="56" width="120" height="190" class="dgm-face"/>
    <line x1="46" y1="90" x2="166" y2="90" class="dgm-dash"/><text x="24" y="94" class="dgm-cap">A</text>
    <line x1="46" y1="150" x2="166" y2="150" class="dgm-dash"/><text x="24" y="154" class="dgm-cap">B</text>
    <line x1="46" y1="212" x2="166" y2="212" class="dgm-dash"/><text x="24" y="216" class="dgm-cap">C</text>
    <line x1="106" y1="70" x2="106" y2="232" class="dgm-acc"/><circle cx="106" cy="150" r="6" class="dgm-acc-fill"/><text x="112" y="70" class="dgm-cap">bore gauge</text>
    <circle cx="330" cy="150" r="74" class="dgm-face"/><circle cx="330" cy="150" r="74" class="dgm-line" fill="none"/>
    <line x1="256" y1="150" x2="404" y2="150" class="dgm-acc"/>${AH(256, 150, 'left')}${AH(404, 150, 'right')}<text x="410" y="154" class="dgm-lbl">X</text>
    <line x1="330" y1="76" x2="330" y2="224" class="dgm-acc"/>${AH(330, 76, 'up')}${AH(330, 224, 'down')}<text x="336" y="72" class="dgm-lbl">Y</text>
    ${MK(1, 330, 150)}
    <text x="230" y="276" class="dgm-cap" text-anchor="middle">Measure bore at A/B/C depths in the X and Y axes.</text>
  </svg>`,

  piston: `<svg viewBox="0 0 460 300">
    <path d="M160 70 H300 V210 Q300 234 276 234 H184 Q160 234 160 210 Z" class="dgm-face"/>
    <line x1="160" y1="92" x2="300" y2="92" class="dgm-line"/><line x1="160" y1="104" x2="300" y2="104" class="dgm-line"/><line x1="160" y1="116" x2="300" y2="116" class="dgm-line"/>
    <circle cx="230" cy="160" r="20" class="dgm-part"/>
    <line x1="160" y1="210" x2="300" y2="210" class="dgm-acc"/>${AH(160, 210, 'left')}${AH(300, 210, 'right')}<text x="196" y="204" class="dgm-lbl">skirt dia</text>
    <line x1="322" y1="210" x2="322" y2="234" class="dgm-dash"/>${AH(322, 210, 'up')}${AH(322, 234, 'down')}<text x="330" y="226" class="dgm-cap">a</text>
    ${MK(1, 200, 224)}${MK(2, 230, 160)}
    <text x="230" y="276" class="dgm-cap" text-anchor="middle">Measure skirt diameter ① at height 'a', 90° to the pin; pin bore ②.</text>
  </svg>`,

  crank: `<svg viewBox="0 0 460 300">
    <line x1="60" y1="150" x2="400" y2="150" class="dgm-line-2"/>
    <circle cx="120" cy="150" r="26" class="dgm-part"/><circle cx="360" cy="150" r="26" class="dgm-part"/>
    <rect x="210" y="108" width="40" height="30" class="dgm-part"/><line x1="230" y1="138" x2="230" y2="150" class="dgm-line"/>
    <text x="120" y="118" class="dgm-cap">Dm</text><text x="204" y="102" class="dgm-cap">Dp</text>
    <path d="M96 176 L144 176 L120 200 Z" class="dgm-part"/><path d="M336 176 L384 176 L360 200 Z" class="dgm-part"/>
    <circle cx="240" cy="92" r="20" class="dgm-part"/><line x1="240" y1="92" x2="240" y2="124" class="dgm-acc"/><text x="264" y="92" class="dgm-cap">dial gauge (TIR)</text>
    ${MK(1, 120, 150)}${MK(2, 230, 123)}
    <text x="230" y="266" class="dgm-cap" text-anchor="middle">Measure main journal Dm ①; read runout at center ② on V-blocks.</text>
  </svg>`,
};

/* Procedures: ordered steps per task. Each step: title, tool, instruction,
   optional caution, diagram id, and measurement refs [section, key]. */
const PROCEDURES = {
  t5: { title: 'Examine cylinder head', steps: [
    { title: 'Check head surface flatness', tool: 'Straightedge + feeler gauge', diagram: 'head_flatness',
      instruction: 'Lay a precision straightedge across the head deck in six directions and slide a feeler gauge underneath to find the widest gap. Record the largest reading.',
      caution: 'If beyond limit, resurface within the combined head + block limit, or replace.',
      m: [['cylinder_head', 'surface_flatness']] },
    { title: 'Measure cylinder head height', tool: 'Vernier caliper / height gauge', diagram: 'head_height',
      instruction: 'Measure from the deck (head-to-block) face to the cam-cover face at the specified location. Compare against the nominal height.',
      m: [['cylinder_head', 'height']] },
    { title: 'Check valve-to-guide clearance', tool: 'Dial gauge, bore gauge + micrometer', diagram: 'valve_guide',
      instruction: 'Rock the valve against its guide with a dial gauge to read deflection. If excessive, measure the stem OD and guide ID and compute the clearance.',
      m: [['valve', 'to_guide_clearance_intake'], ['valve', 'to_guide_clearance_exhaust']] },
    { title: 'Inspect valve seats', tool: 'Prussian blue / seat-width gauge', diagram: 'valve_seat',
      instruction: 'Check the seat contact band on the valve face. Measure the contacting width W and confirm the seat angle. Re-cut or replace if worn.',
      m: [['valve_seat', 'contact_width_intake'], ['valve_seat', 'contact_width_exhaust'], ['valve', 'seat_angle']] },
  ] },
  t6: { title: 'Evaluate valvetrain', steps: [
    { title: 'Measure valve stem diameter', tool: 'Micrometer', diagram: 'valve_dims',
      instruction: 'Measure the stem at the top, center, and bottom of the wear area. Record the smallest reading for intake and exhaust.',
      m: [['valve', 'stem_diameter_intake'], ['valve', 'stem_diameter_exhaust']] },
    { title: 'Check valve margin thickness', tool: 'Vernier caliper', diagram: 'valve_dims',
      instruction: 'Measure margin thickness T. Replace the valve if it has worn below the limit.',
      caution: 'A margin below the limit runs too hot and can burn the valve.',
      m: [['valve', 'margin_thickness_intake']] },
    { title: 'Verify seat angle', tool: 'Valve grinder / protractor', diagram: 'valve_seat',
      instruction: 'Confirm the valve face / seat angle before cutting.',
      m: [['valve', 'seat_angle']] },
    { title: 'Measure valve-to-guide clearance', tool: 'Dial gauge', diagram: 'valve_guide',
      instruction: 'Read valve deflection in the wear direction; replace the valve or guide if beyond limit.',
      m: [['valve', 'to_guide_clearance_intake'], ['valve', 'to_guide_clearance_exhaust']] },
    { title: 'Test valve springs', tool: 'Spring tester + square', diagram: 'valve_spring',
      instruction: 'Check free height and out-of-square, then measure installed pressure at the specified height.',
      m: [['valve_spring', 'free_height_outer'], ['valve_spring', 'pressure_outer']] },
  ] },
  t3: { title: 'Examine cylinders', steps: [
    { title: 'Measure bore diameter', tool: 'Bore gauge', diagram: 'bore',
      instruction: 'Measure each cylinder at A (top), B (middle) and C (bottom), in both the X and Y axes. Note the grade.',
      m: [['cylinder_block', 'bore_inner_diameter']] },
    { title: 'Check out-of-round', tool: 'Bore gauge', diagram: 'bore',
      instruction: 'Out-of-round = X − Y at the same depth. Record the largest difference.',
      m: [['cylinder_block', 'out_of_round']] },
    { title: 'Check taper', tool: 'Bore gauge', diagram: 'bore',
      instruction: 'Taper = top (A) reading − bottom (B/C) reading.',
      m: [['cylinder_block', 'taper']] },
    { title: 'Check deck flatness', tool: 'Straightedge + feeler gauge', diagram: 'head_flatness',
      instruction: 'Check block-deck flatness the same way as the head deck.',
      m: [['cylinder_block', 'surface_flatness']] },
  ] },
  t4: { title: 'Examine pistons', steps: [
    { title: 'Measure piston skirt diameter', tool: 'Micrometer', diagram: 'piston',
      instruction: "Measure the skirt 90° to the pin, at the specified height 'a' from the bottom. Note the grade.",
      m: [['piston', 'skirt_diameter']] },
    { title: 'Piston-to-bore clearance', tool: 'Micrometer + bore gauge', diagram: 'piston',
      instruction: 'Clearance = measured bore − skirt diameter.',
      m: [['piston', 'to_cylinder_clearance']] },
    { title: 'Measure pin bore', tool: 'Small-bore gauge', diagram: 'piston',
      instruction: 'Measure the piston pin bore diameter.',
      m: [['piston', 'pin_hole_diameter']] },
  ] },
  t7: { title: 'Crankshaft & bearings', steps: [
    { title: 'Main journal diameter', tool: 'Micrometer', diagram: 'crank',
      instruction: 'Measure each main journal; record the grade used to select bearings.',
      m: [['crankshaft', 'main_journal_diameter']] },
    { title: 'Crankshaft runout', tool: 'V-blocks + dial gauge', diagram: 'crank',
      instruction: 'Support the end journals on V-blocks and read total indicator runout at the center journal.',
      m: [['crankshaft', 'runout']] },
    { title: 'Crankshaft end play', tool: 'Dial gauge', diagram: 'crank',
      instruction: 'Pry the crank fore and aft and read the end float.',
      m: [['crankshaft', 'free_end_play']] },
    { title: 'Bearing selection & clearance', tool: 'Plastigage / micrometer', diagram: 'crank',
      instruction: 'Select the bearing grade that lands the clearance in range, then confirm with Plastigage.',
      m: [['main_bearing', 'no1_thickness'], ['bearing_clearance', 'main_bearing_clearance']] },
  ] },
};
