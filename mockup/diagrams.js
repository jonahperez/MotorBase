/* Technical SVG diagrams + step-by-step procedures for the guided walkthrough.
   Diagrams use CSS classes defined in styles.css (.dgm-*). Numbered markers (①②③)
   correspond to the numbered measurement blocks shown beside each diagram.

   Measurement refs are [section, key, scope]. scope drives how many per-instance
   inputs are rendered from the build's engine layout:
     head | cylinder | piston | valve | main_journal | rod | single
   A ref can also be an inline object {key,label,unit,scope,standard,limit,nominal,
   grades,appliesTo,note} for measurements not in the engine spec (e.g. pumps). */

const AH = (x, y, dir) => {
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

  rod: `<svg viewBox="0 0 460 300">
    <circle cx="110" cy="150" r="30" class="dgm-part"/><circle cx="110" cy="150" r="13" class="dgm-line"/><text x="84" y="112" class="dgm-cap">small end</text>
    <circle cx="356" cy="150" r="52" class="dgm-part"/><circle cx="356" cy="150" r="34" class="dgm-line"/><text x="332" y="88" class="dgm-cap">big end</text>
    <path d="M132 138 L316 128 M132 162 L312 176" class="dgm-line-2"/>
    <line x1="322" y1="150" x2="390" y2="150" class="dgm-acc"/>${AH(322, 150, 'left')}${AH(390, 150, 'right')}<text x="330" y="142" class="dgm-lbl">bore</text>
    ${MK(1, 356, 150)}
    <line x1="356" y1="202" x2="356" y2="220" class="dgm-acc"/>${AH(356, 220, 'down')}<text x="316" y="236" class="dgm-cap">side clearance</text>${MK(2, 356, 210)}
    <text x="230" y="284" class="dgm-cap" text-anchor="middle">Big-end bore ①, bend/twist, and rod side clearance ②.</text>
  </svg>`,

  oil_pump: `<svg viewBox="0 0 460 300">
    <rect x="64" y="46" width="220" height="208" rx="18" class="dgm-face"/>
    <circle cx="174" cy="150" r="90" class="dgm-part"/>
    <circle cx="188" cy="150" r="62" class="dgm-part"/>
    <line x1="174" y1="60" x2="174" y2="88" class="dgm-acc"/>${AH(174, 60, 'up')}${AH(174, 88, 'down')}
    <text x="150" y="52" class="dgm-lbl">tip clr</text>${MK(1, 174, 74)}
    <line x1="250" y1="150" x2="264" y2="150" class="dgm-acc"/><text x="238" y="180" class="dgm-cap">rotor–housing</text>${MK(2, 300, 150)}
    <rect x="330" y="112" width="98" height="80" rx="6" class="dgm-part"/>
    <line x1="330" y1="112" x2="428" y2="112" class="dgm-acc"/><text x="338" y="104" class="dgm-cap">side clr</text>${MK(3, 379, 112)}
    <text x="230" y="284" class="dgm-cap" text-anchor="middle">Rotor tip ①, outer-rotor-to-housing ②, and side ③ clearances.</text>
  </svg>`,

  water_pump: `<svg viewBox="0 0 460 300">
    <rect x="58" y="72" width="176" height="150" rx="14" class="dgm-face"/>
    <circle cx="146" cy="147" r="60" class="dgm-part"/>
    <line x1="146" y1="147" x2="118" y2="104" class="dgm-line"/><line x1="146" y1="147" x2="192" y2="122" class="dgm-line"/><line x1="146" y1="147" x2="184" y2="188" class="dgm-line"/><line x1="146" y1="147" x2="106" y2="184" class="dgm-line"/>
    <line x1="206" y1="147" x2="356" y2="147" class="dgm-line-2"/>
    <rect x="248" y="130" width="56" height="34" class="dgm-part"/><text x="250" y="124" class="dgm-cap">bearing</text>
    <circle cx="380" cy="147" r="22" class="dgm-part"/><text x="368" y="184" class="dgm-cap">pulley</text>
    <line x1="146" y1="207" x2="146" y2="228" class="dgm-acc"/>${AH(146, 228, 'down')}<text x="116" y="244" class="dgm-cap">weep hole</text>${MK(3, 146, 218)}
    <line x1="206" y1="147" x2="224" y2="147" class="dgm-acc"/><text x="208" y="138" class="dgm-cap">end play</text>${MK(2, 300, 147)}
    ${MK(1, 146, 147)}
    <text x="230" y="284" class="dgm-cap" text-anchor="middle">Impeller-to-housing ①, shaft end play ②, weep-hole leak check ③.</text>
  </svg>`,

  timing: `<svg viewBox="0 0 460 300">
    <circle cx="150" cy="200" r="52" class="dgm-part"/><circle cx="150" cy="200" r="10" class="dgm-line"/><text x="130" y="204" class="dgm-cap">crank</text>
    <circle cx="330" cy="90" r="40" class="dgm-part"/><circle cx="330" cy="90" r="8" class="dgm-line"/><text x="318" y="94" class="dgm-cap">cam</text>
    <line x1="120" y1="158" x2="300" y2="64" class="dgm-line-2"/><line x1="196" y1="234" x2="366" y2="118" class="dgm-line-2"/>
    <circle cx="250" cy="182" r="15" class="dgm-part"/><line x1="250" y1="167" x2="250" y2="152" class="dgm-acc"/>${AH(250, 152, 'up')}<text x="262" y="190" class="dgm-cap">tensioner</text>${MK(2, 250, 182)}
    ${MK(1, 238, 118)}
    <text x="230" y="284" class="dgm-cap" text-anchor="middle">Belt/chain condition & stretch ①; tensioner and guide wear ②.</text>
  </svg>`,

  oil_pressure: `<svg viewBox="0 0 460 300">
    <path d="M60 118 H206 V244 H60 Z" class="dgm-face"/><text x="72" y="234" class="dgm-cap">cylinder block</text>
    <rect x="150" y="150" width="30" height="42" class="dgm-part"/><text x="120" y="146" class="dgm-cap">sender port</text>
    <line x1="180" y1="168" x2="256" y2="120" class="dgm-line-2"/>
    <circle cx="316" cy="104" r="48" class="dgm-part"/><circle cx="316" cy="104" r="41" class="dgm-line" fill="none"/>
    <line x1="316" y1="104" x2="340" y2="76" class="dgm-acc"/><circle cx="316" cy="104" r="4" class="dgm-acc-fill"/>
    <text x="316" y="170" class="dgm-cap" text-anchor="middle">oil pressure gauge</text>
    ${MK(1, 316, 104)}
    <text x="230" y="284" class="dgm-cap" text-anchor="middle">Warm engine; read pressure at the sender port at idle and 2,000 rpm.</text>
  </svg>`,

  oil_pump_clr: `<svg viewBox="0 0 460 300">
    <circle cx="176" cy="150" r="96" class="dgm-face"/>
    <circle cx="188" cy="150" r="66" class="dgm-part"/>
    <circle cx="200" cy="150" r="40" class="dgm-part"/>
    <line x1="80" y1="150" x2="98" y2="150" class="dgm-acc"/>${AH(80, 150, 'left')}<text x="66" y="132" class="dgm-cap">radial</text>${MK(1, 90, 150)}
    <line x1="148" y1="122" x2="160" y2="118" class="dgm-acc"/><text x="150" y="108" class="dgm-cap">tip</text>${MK(2, 176, 96)}
    <rect x="330" y="112" width="98" height="80" rx="6" class="dgm-part"/>
    <line x1="330" y1="112" x2="428" y2="112" class="dgm-acc"/><text x="338" y="104" class="dgm-cap">axial (side)</text>${MK(3, 379, 112)}
    <text x="230" y="284" class="dgm-cap" text-anchor="middle">Body-to-gear radial ①, gear tip ②, and axial/side ③ clearances.</text>
  </svg>`,

  thermostat: `<svg viewBox="0 0 460 300">
    <path d="M120 66 H262 V196 A71 34 0 0 1 120 196 Z" class="dgm-face"/>
    <line x1="130" y1="112" x2="252" y2="112" class="dgm-dash"/><text x="256" y="116" class="dgm-cap">water</text>
    <circle cx="191" cy="176" r="30" class="dgm-part"/><text x="168" y="180" class="dgm-cap">t-stat</text>
    <line x1="191" y1="146" x2="191" y2="114" class="dgm-acc"/>${AH(191, 114, 'up')}<text x="198" y="132" class="dgm-lbl">lift</text>${MK(2, 191, 132)}
    <rect x="308" y="60" width="12" height="150" class="dgm-part"/><circle cx="314" cy="222" r="15" class="dgm-acc-fill"/><text x="330" y="150" class="dgm-cap">°C</text>${MK(1, 314, 140)}
    <text x="230" y="284" class="dgm-cap" text-anchor="middle">Heat in water; note valve opening temperature ① and valve lift ②.</text>
  </svg>`,

  rad_cap: `<svg viewBox="0 0 460 300">
    <rect x="150" y="86" width="34" height="26" class="dgm-part"/>
    <circle cx="167" cy="150" r="52" class="dgm-part"/><circle cx="167" cy="150" r="34" class="dgm-line" fill="none"/><text x="140" y="222" class="dgm-cap">radiator cap</text>
    <line x1="219" y1="140" x2="290" y2="126" class="dgm-line-2"/>
    <circle cx="336" cy="118" r="46" class="dgm-part"/><circle cx="336" cy="118" r="39" class="dgm-line" fill="none"/><line x1="336" y1="118" x2="358" y2="94" class="dgm-acc"/><circle cx="336" cy="118" r="4" class="dgm-acc-fill"/>
    ${MK(1, 336, 118)}
    <text x="230" y="284" class="dgm-cap" text-anchor="middle">Apply pressure to the cap with a tester; note the relief pressure.</text>
  </svg>`,

  leak_test: `<svg viewBox="0 0 460 300">
    <rect x="60" y="150" width="190" height="92" rx="8" class="dgm-face"/>
    <line x1="60" y1="176" x2="250" y2="176" class="dgm-dash"/><line x1="60" y1="202" x2="250" y2="202" class="dgm-dash"/><text x="72" y="234" class="dgm-cap">radiator</text>
    <rect x="140" y="118" width="42" height="32" class="dgm-part"/><text x="128" y="112" class="dgm-cap">filler neck</text>
    <line x1="182" y1="130" x2="300" y2="112" class="dgm-line-2"/>
    <circle cx="346" cy="104" r="46" class="dgm-part"/><circle cx="346" cy="104" r="39" class="dgm-line" fill="none"/><line x1="346" y1="104" x2="368" y2="80" class="dgm-acc"/><circle cx="346" cy="104" r="4" class="dgm-acc-fill"/>
    ${MK(1, 346, 104)}
    <text x="230" y="284" class="dgm-cap" text-anchor="middle">Pressurize to 157 kPa and watch the gauge for a drop / leaks.</text>
  </svg>`,

  cam_lobe: `<svg viewBox="0 0 460 300">
    <circle cx="170" cy="168" r="72" class="dgm-face"/>
    <path d="M126 116 Q170 20 214 116 A72 72 0 0 1 126 116 Z" class="dgm-part"/>
    <line x1="170" y1="96" x2="170" y2="40" class="dgm-acc"/>${AH(170, 40, 'up')}<text x="178" y="60" class="dgm-lbl">lobe height</text>${MK(1, 170, 78)}
    <line x1="98" y1="168" x2="242" y2="168" class="dgm-dash"/><text x="120" y="188" class="dgm-cap">base circle</text>
    <circle cx="360" cy="168" r="34" class="dgm-part"/><circle cx="360" cy="168" r="34" class="dgm-line" fill="none"/><text x="336" y="120" class="dgm-cap">journal</text>${MK(2, 360, 168)}
    <text x="230" y="286" class="dgm-cap" text-anchor="middle">Measure lobe height ① (per lobe) and journal diameter / clearance ②.</text>
  </svg>`,

  balance: `<svg viewBox="0 0 460 300">
    <line x1="46" y1="150" x2="414" y2="150" class="dgm-line-2"/>
    <circle cx="110" cy="150" r="24" class="dgm-part"/><circle cx="350" cy="150" r="24" class="dgm-part"/>
    <path d="M180 150 a52 60 0 0 0 104 0 Z" class="dgm-part"/>
    <circle cx="232" cy="150" r="22" class="dgm-part"/>
    <rect x="206" y="86" width="52" height="42" rx="4" class="dgm-acc-fill"/><text x="196" y="80" class="dgm-lbl">bob weight</text>${MK(1, 232, 107)}
    <circle cx="232" cy="196" r="7" class="dgm-line"/><text x="246" y="212" class="dgm-cap">drill / heavy metal</text>${MK(2, 232, 196)}
    <text x="230" y="284" class="dgm-cap" text-anchor="middle">Bolt bob weights to the rod journals, spin, then add/remove counterweight metal.</text>
  </svg>`,
};

/* Inline measurement helper (for components not in the engine spec JSON). */
const IM = (o) => Object.assign({ inline: true }, o);

const PROCEDURES = {
  t5: { title: 'Examine cylinder head', steps: [
    { title: 'Check head surface flatness', tool: 'Straightedge + feeler gauge', diagram: 'head_flatness',
      instruction: 'On each cylinder head, lay a straightedge across the deck in six directions and slide a feeler gauge underneath to find the widest gap.',
      caution: 'If beyond limit, resurface within the combined head + block limit, or replace.',
      m: [['cylinder_head', 'surface_flatness', 'head']] },
    { title: 'Measure cylinder head height', tool: 'Vernier caliper / height gauge', diagram: 'head_height',
      instruction: 'Measure each head from the deck (head-to-block) face to the cam-cover face; compare to nominal.',
      m: [['cylinder_head', 'height', 'head']] },
    { title: 'Check valve-to-guide clearance', tool: 'Dial gauge, bore gauge + micrometer', diagram: 'valve_guide',
      instruction: 'Rock each valve against its guide to read deflection; if excessive, measure stem OD and guide ID and compute clearance. Recorded per valve.',
      m: [['valve', 'to_guide_clearance_intake', 'valve'], ['valve', 'to_guide_clearance_exhaust', 'valve']] },
    { title: 'Inspect valve seats', tool: 'Prussian blue / seat-width gauge', diagram: 'valve_seat',
      instruction: 'Check each seat contact band; measure the contacting width W and confirm the seat angle. Recorded per valve seat.',
      m: [['valve_seat', 'contact_width_intake', 'valve'], ['valve_seat', 'contact_width_exhaust', 'valve'], ['valve', 'seat_angle', 'valve']] },
  ] },
  t6: { title: 'Evaluate valvetrain', steps: [
    { title: 'Measure valve stem diameter', tool: 'Micrometer', diagram: 'valve_dims',
      instruction: 'Measure each valve stem at the top, center, and bottom of the wear area; record the smallest. Per valve (intake and exhaust).',
      m: [['valve', 'stem_diameter_intake', 'valve'], ['valve', 'stem_diameter_exhaust', 'valve']] },
    { title: 'Check valve margin thickness', tool: 'Vernier caliper', diagram: 'valve_dims',
      instruction: 'Measure margin thickness T on each valve; replace any worn below the limit.',
      caution: 'A margin below the limit runs too hot and can burn the valve.',
      m: [['valve', 'margin_thickness_intake', 'valve'], ['valve', 'margin_thickness_exhaust', 'valve']] },
    { title: 'Measure valve-to-guide clearance', tool: 'Dial gauge', diagram: 'valve_guide',
      instruction: 'Read valve deflection in the wear direction for each valve; replace valve or guide if beyond limit.',
      m: [['valve', 'to_guide_clearance_intake', 'valve'], ['valve', 'to_guide_clearance_exhaust', 'valve']] },
    { title: 'Test valve springs', tool: 'Spring tester + square', diagram: 'valve_spring',
      instruction: 'Check free height and out-of-square, then measure installed pressure at the specified height. Per valve spring.',
      m: [['valve_spring', 'free_height_outer', 'valve'], ['valve_spring', 'pressure_outer', 'valve']] },
  ] },
  t3: { title: 'Examine cylinders', part: 'Cylinder block (bore / hone)', steps: [
    { title: 'Bore measurement & grade', tool: 'Bore gauge', diagram: 'bore', calc: 'bore', part: 'Cylinder block (bore / hone)',
      instruction: 'Measure each cylinder at Top / Middle / Bottom in the X and Y axes (6 readings). The calculator derives the size grade, out-of-round, taper, wear shape, and max deviation per cylinder.',
      m: [] },
    { title: 'Check deck flatness', tool: 'Straightedge + feeler gauge', diagram: 'head_flatness', part: 'Cylinder block (deck resurface)',
      instruction: 'Check block-deck flatness on each bank the same way as the head deck.',
      m: [['cylinder_block', 'surface_flatness', 'head']] },
    { title: 'Cylinder wall condition', tool: 'Visual', diagram: 'bore', part: 'Cylinder block',
      instruction: 'Inspect the bores for scoring, glaze, or damage that would require boring oversize.',
      m: [IM({ key: 'wall_condition', label: 'Bore wall condition (no scoring/damage)', type: 'check', scope: 'cylinder' })] },
  ] },
  t4: { title: 'Examine pistons', steps: [
    { title: 'Measure piston skirt diameter', tool: 'Micrometer', diagram: 'piston',
      instruction: "Measure each piston's skirt 90° to the pin at height 'a' from the bottom; record the grade per piston.",
      m: [['piston', 'skirt_diameter', 'piston']] },
    { title: 'Piston-to-bore clearance', tool: 'Micrometer + bore gauge', diagram: 'piston',
      instruction: 'Clearance = measured bore − skirt diameter, per cylinder.',
      m: [['piston', 'to_cylinder_clearance', 'piston']] },
    { title: 'Measure pin bore', tool: 'Small-bore gauge', diagram: 'piston',
      instruction: 'Measure each piston pin bore diameter.',
      m: [['piston', 'pin_hole_diameter', 'piston']] },
  ] },
  tc: { title: 'Crankshaft inspection', steps: [
    { title: 'Main journal diameter', tool: 'Micrometer', diagram: 'crank',
      instruction: 'Measure each main journal (1–4); record the grade used to select main bearings.',
      m: [['crankshaft', 'main_journal_diameter', 'main_journal']] },
    { title: 'Rod (pin) journal diameter', tool: 'Micrometer', diagram: 'crank',
      instruction: 'Measure each rod journal (1–6).',
      m: [['crankshaft', 'pin_journal_diameter', 'rod']] },
    { title: 'Journal out-of-round & taper', tool: 'Micrometer', diagram: 'crank',
      instruction: 'Check out-of-round (X − Y) and taper (A − B) on each main journal.',
      m: [['crankshaft', 'out_of_round', 'main_journal'], ['crankshaft', 'taper', 'main_journal']] },
    { title: 'Crankshaft runout', tool: 'V-blocks + dial gauge', diagram: 'crank',
      instruction: 'Support the end journals on V-blocks and read total indicator runout at the center journal.',
      m: [['crankshaft', 'runout', 'single']] },
    { title: 'End play & main bearing clearance', tool: 'Dial gauge / Plastigage', diagram: 'crank',
      instruction: 'Read crank end play; then check main bearing clearance at each main journal (select grade to suit).',
      m: [['crankshaft', 'free_end_play', 'single'], ['bearing_clearance', 'main_bearing_clearance', 'main_journal']] },
  ] },
  tr: { title: 'Connecting rods & bearings', steps: [
    { title: 'Rod bend & twist', tool: 'Rod alignment fixture', diagram: 'rod',
      instruction: 'Check each connecting rod for bend and twist per 100 mm.',
      m: [['connecting_rod', 'bend_limit', 'rod'], ['connecting_rod', 'torsion_limit', 'rod']] },
    { title: 'Big-end bore', tool: 'Bore gauge', diagram: 'rod',
      instruction: 'Measure each rod big-end housing bore (caps torqued, no bearing).',
      m: [['connecting_rod', 'big_end_inner_diameter', 'rod']] },
    { title: 'Rod side clearance', tool: 'Feeler gauge', diagram: 'rod',
      instruction: 'With rods on the crank, measure side clearance at each journal.',
      m: [['connecting_rod', 'side_clearance', 'rod']] },
    { title: 'Rod bearing clearance', tool: 'Plastigage / micrometer', diagram: 'rod',
      instruction: 'Check rod bearing clearance at each journal; select bearing grade to suit.',
      m: [['bearing_clearance', 'connecting_rod_bearing_clearance', 'rod']] },
  ] },
  top: { title: 'Oil pump', steps: [
    { title: 'Rotor tip clearance', tool: 'Feeler gauge', diagram: 'oil_pump',
      instruction: 'Measure the clearance between the inner and outer rotor tips. (Illustrative limits — verify against the manual.)',
      m: [IM({ key: 'tip_clearance', label: 'Rotor tip clearance', unit: 'mm', standard: { min: 0.05, max: 0.12 }, limit: { max: 0.20 } })] },
    { title: 'Outer rotor to housing', tool: 'Feeler gauge', diagram: 'oil_pump',
      instruction: 'Measure the clearance between the outer rotor and the pump housing.',
      m: [IM({ key: 'outer_clearance', label: 'Outer rotor to housing', unit: 'mm', standard: { min: 0.11, max: 0.20 }, limit: { max: 0.30 } })] },
    { title: 'Rotor side clearance', tool: 'Straightedge + feeler gauge', diagram: 'oil_pump',
      instruction: 'Measure the rotor end (side) clearance against the cover face.',
      m: [IM({ key: 'side_clearance', label: 'Rotor side clearance', unit: 'mm', standard: { min: 0.05, max: 0.11 }, limit: { max: 0.20 } })] },
    { title: 'Relief valve & spring', tool: 'Visual / spring tester', diagram: 'oil_pump',
      instruction: 'Inspect the relief valve for scoring and free movement; check the spring free length. Record notes.',
      m: [] },
  ] },
  twp: { title: 'Water pump', steps: [
    { title: 'Shaft bearing end play', tool: 'Dial gauge', diagram: 'water_pump',
      instruction: 'Check the pump shaft/bearing for axial and radial play. (Illustrative limit.)',
      m: [IM({ key: 'shaft_play', label: 'Shaft bearing play', unit: 'mm', limit: { max: 0.10 } })] },
    { title: 'Impeller-to-housing clearance', tool: 'Feeler gauge', diagram: 'water_pump',
      instruction: 'Measure the clearance between the impeller vanes and the housing.',
      m: [IM({ key: 'impeller_clearance', label: 'Impeller to housing', unit: 'mm', standard: { min: 0.5, max: 1.0 } })] },
    { title: 'Weep-hole & seal leak check', tool: 'Visual', diagram: 'water_pump',
      instruction: 'Inspect the weep hole for coolant traces and spin the pump to feel for roughness. Record notes / pass–fail.',
      m: [] },
  ] },
  tt: { title: 'Timing chain / belt', steps: [
    { title: 'Belt / chain condition', tool: 'Visual', diagram: 'timing',
      instruction: 'Inspect the belt for cracks/wear or the chain for stretch and worn links. Record notes.',
      m: [] },
    { title: 'Chain stretch / belt tension', tool: 'Scale / tension gauge', diagram: 'timing',
      instruction: 'Measure chain elongation over a set number of links, or belt deflection under load. (Illustrative limit.)',
      m: [IM({ key: 'chain_stretch', label: 'Chain stretch (over 20 links)', unit: 'mm', limit: { max: 3.0 } })] },
    { title: 'Tensioner & guides', tool: 'Visual / caliper', diagram: 'timing',
      instruction: 'Check tensioner travel and guide/shoe wear depth.',
      m: [IM({ key: 'guide_wear', label: 'Guide wear depth', unit: 'mm', limit: { max: 1.0 } })] },
  ] },
  tlub: { title: 'Lubrication system', steps: [
    { title: 'Oil pressure check', tool: 'Oil pressure gauge (ST25051001)', diagram: 'oil_pressure',
      instruction: 'Warm the engine to operating temperature, transmission in Neutral/Park. Read oil pressure at the sender port at idle and at 2,000 rpm.',
      caution: 'Engine and oil are hot — avoid burns. If pressure is far off, check the oil passages and pump.',
      m: [['lubrication', 'oil_pressure_idle', 'single'], ['lubrication', 'oil_pressure_2000', 'single']] },
    { title: 'Oil pump gear clearances', tool: 'Feeler gauge + straightedge', diagram: 'oil_pump_clr',
      instruction: 'With the pump apart, measure the body-to-outer-gear radial clearance, inner-to-outer gear tip clearance, and the axial (side) clearances.',
      m: [['lubrication', 'oil_pump_body_outer_radial', 'single'], ['lubrication', 'oil_pump_tip_clearance', 'single'], ['lubrication', 'oil_pump_inner_axial', 'single'], ['lubrication', 'oil_pump_outer_axial', 'single'], ['lubrication', 'oil_pump_housing_clearance', 'single']] },
    { title: 'Regulator (relief) valve', tool: 'Feeler gauge / visual', diagram: 'oil_pump_clr',
      instruction: 'Check the regulator valve to oil-pump-cover clearance and that the valve slides freely.',
      m: [['lubrication', 'regulator_valve_clearance', 'single']] },
  ] },
  tcool: { title: 'Cooling system', steps: [
    { title: 'Pressure-test for leaks', tool: 'Radiator cap tester (EG17650301)', diagram: 'leak_test',
      instruction: 'Inspect all hoses, then apply 157 kPa to the system and hold. The gauge should not drop and there should be no external leaks.',
      caution: 'Never exceed the specified pressure — higher pressure can damage the radiator.',
      m: [['cooling', 'leak_test_pressure', 'single'], IM({ key: 'hose_condition', label: 'Cooling hose condition', type: 'check', note: 'cracks / leaks / chafing / loose clamps' }), IM({ key: 'holds_pressure', label: 'System holds test pressure (no leaks)', type: 'check' })] },
    { title: 'Radiator cap relief pressure', tool: 'Cap tester', diagram: 'rad_cap',
      instruction: 'Apply pressure to the cap and note the relief pressure; compare to the standard and service limit.',
      m: [['cooling', 'radiator_cap_relief', 'single']] },
    { title: 'Thermostat test', tool: 'Beaker + thermometer', diagram: 'thermostat',
      instruction: 'Confirm the valve seats tightly at ambient. Heat in water and record the valve opening temperature and the valve lift.',
      m: [['cooling', 'thermostat_opening_temp', 'single'], ['cooling', 'thermostat_valve_lift', 'single'], IM({ key: 'thermostat_seating', label: 'Valve seats tightly at ambient temperature', type: 'check' })] },
    { title: 'Water pump condition', tool: 'Visual / by hand', diagram: 'water_pump',
      instruction: 'The pump is a sealed unit (not serviceable). Check for rust/corrosion of the body and vanes, and for rough operation or excess end play.',
      m: [IM({ key: 'wp_body', label: 'No rust / corrosion on body & vanes', type: 'check' }), IM({ key: 'wp_endplay', label: 'Smooth operation, no excess end play', type: 'check' })] },
  ] },
  tdiag: { title: 'Overheating diagnostics', steps: [
    { title: 'Cause analysis', tool: 'Diagnostic checklist', diagram: '',
      instruction: 'Work the common overheating causes from the manual’s cause-analysis chart. Mark each “Fail” if a problem is found — failures can be flagged into the bill of materials.',
      m: [
        IM({ key: 'd_water_pump', label: 'Water pump (sealing / operation)', type: 'check' }),
        IM({ key: 'd_thermostat', label: 'Thermostat not stuck closed', type: 'check' }),
        IM({ key: 'd_radiator_flow', label: 'Radiator core not clogged / good flow', type: 'check' }),
        IM({ key: 'd_fins', label: 'Radiator fins & airflow (no blockage)', type: 'check' }),
        IM({ key: 'd_cap', label: 'Radiator cap seals & relieves correctly', type: 'check' }),
        IM({ key: 'd_coolant', label: 'Coolant quality & mixture ratio', type: 'check' }),
        IM({ key: 'd_fan', label: 'Cooling fan operation / fan clutch', type: 'check' }),
        IM({ key: 'd_headgasket', label: 'No exhaust gas leak into coolant (head/gasket)', type: 'check' }),
      ] },
  ] },
  tcam: { title: 'Camshaft inspection', part: 'Camshaft', steps: [
    { title: 'Cam lobe height', tool: 'Micrometer', diagram: 'cam_lobe', part: 'Camshaft',
      instruction: 'Measure the height of each intake and exhaust lobe (SOHC VG33E has one camshaft per head — 6 intake + 6 exhaust lobes). Compare to standard; a worn lobe reduces lift and duration.',
      m: [['camshaft', 'cam_height_intake', 'valve'], ['camshaft', 'cam_height_exhaust', 'valve']] },
    { title: 'Journal diameter, clearance & end play', tool: 'Micrometer / dial gauge', diagram: 'cam_lobe', part: 'Camshaft',
      instruction: 'Measure the cam journal diameter (graded by position), the journal-to-bearing clearance, and camshaft end play (per camshaft).',
      m: [['camshaft', 'journal_outer_diameter', 'single'], ['camshaft', 'journal_clearance', 'single'], ['camshaft', 'end_play', 'camshaft']] },
    { title: 'Camshaft runout', tool: 'V-blocks + dial gauge', diagram: 'cam_lobe', part: 'Camshaft',
      instruction: 'Support the end journals on V-blocks and read runout at the center journal, per camshaft.',
      m: [['camshaft', 'runout', 'camshaft']] },
  ] },
  tbal: { title: 'Balance rotating assembly', part: 'Rotating assembly (balance)', steps: [
    { title: 'Weigh & match components', tool: 'Gram scale + belt sander', diagram: 'balance', calc: 'balance', part: 'Rotating assembly (balance)',
      instruction: 'Weigh each piston and rod and match the set to the lightest by removing material (rod big-end side / small-end tip). Enter representative weights; the calculator derives reciprocating, rotating, and bob weight (100% rotating + 50% reciprocating). Bearings count double per journal, plus ~0.5 g of oil.',
      m: [] },
    { title: 'Spin-balance & correct', tool: 'Crank balancer', diagram: 'balance', part: 'Crankshaft (balance)',
      instruction: 'Bolt the bob weights to the rod journals and spin the crank. Record the residual imbalance at each end; correct by drilling counterweights or pressing in heavy metal.',
      m: [IM({ key: 'imbalance_front', label: 'Residual imbalance — front', unit: 'g·cm', limit: { max: 4 } }), IM({ key: 'imbalance_rear', label: 'Residual imbalance — rear', unit: 'g·cm', limit: { max: 4 } })] },
  ] },
};
