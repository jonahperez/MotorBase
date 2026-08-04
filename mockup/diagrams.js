/* Inspection procedures — measurement definitions only (no diagrams). */

const IM = (o) => Object.assign({ inline: true }, o);

const PROCEDURES = {
  t0: { title: 'General engine inspection', steps: [
    { title: 'External condition', m: [
      IM({ key: 'oil_leaks', label: 'Signs of oil leaks', type: 'note', scope: 'single',
        placeholder: 'Valve covers, oil pan, rear main, timing cover, head gasket seepage…' }),
      IM({ key: 'mounting_hardware', label: 'Broken / damaged mounting hardware', type: 'note', scope: 'single',
        placeholder: 'Broken bolts, stripped threads, missing nuts, cracked brackets…' }),
      IM({ key: 'missing_pieces', label: 'Missing pieces', type: 'note', scope: 'single',
        placeholder: 'Covers, sensors, brackets, pulleys, hardware bags…' }),
    ] },
    { title: 'Initial compression test', m: [
      IM({ key: 'initial_compression', label: 'Initial compression', unit: 'kPa', scope: 'cylinder',
        standard: { min: 980, max: 1275 }, limit: { min: 780 } }),
    ] },
    { title: 'Spark plug condition', m: [
      IM({ key: 'spark_plug_condition', label: 'Spark plug condition', type: 'note', scope: 'cylinder',
        placeholder: 'Color, deposits, gap, electrode wear, oil fouling…' }),
    ] },
  ] },
  t5: { title: 'Examine cylinder head', steps: [
    { title: 'Head surface flatness', m: [['cylinder_head', 'surface_flatness', 'head']] },
    { title: 'Head height', m: [['cylinder_head', 'height', 'head']] },
    { title: 'Valve-to-guide clearance', m: [['valve', 'to_guide_clearance_intake', 'valve'], ['valve', 'to_guide_clearance_exhaust', 'valve']] },
    { title: 'Valve seats', m: [['valve_seat', 'contact_width_intake', 'valve'], ['valve_seat', 'contact_width_exhaust', 'valve'], ['valve', 'seat_angle', 'valve']] },
  ] },
  t6: { title: 'Evaluate valvetrain', steps: [
    { title: 'Valve stem diameter', m: [['valve', 'stem_diameter_intake', 'valve'], ['valve', 'stem_diameter_exhaust', 'valve']] },
    { title: 'Valve margin thickness', m: [['valve', 'margin_thickness_intake', 'valve'], ['valve', 'margin_thickness_exhaust', 'valve']] },
    { title: 'Valve-to-guide clearance', m: [['valve', 'to_guide_clearance_intake', 'valve'], ['valve', 'to_guide_clearance_exhaust', 'valve']] },
  ] },
  tspring: { title: 'Valve springs', part: 'Valve spring', steps: [
    { title: 'Free height', m: [['valve_spring', 'free_height_outer', 'valve'], ['valve_spring', 'free_height_inner', 'valve']] },
    { title: 'Spring pressure', m: [['valve_spring', 'pressure_outer', 'valve'], ['valve_spring', 'pressure_inner', 'valve']] },
    { title: 'Spring squareness', m: [['valve_spring', 'out_of_square_outer', 'valve'], ['valve_spring', 'out_of_square_inner', 'valve']] },
  ] },
  trockshaft: { title: 'Rocker arm shaft', part: 'Rocker arm shaft', steps: [
    { title: 'Shaft outer diameter', m: [['rocker', 'shaft_outer_diameter', 'rocker_bank']] },
  ] },
  trocker: { title: 'Rocker arms', part: 'Rocker arm', steps: [
    { title: 'Arm inner diameter', m: [['rocker', 'arm_inner_diameter', 'rocker_bank']] },
    { title: 'Shaft-to-arm clearance', m: [['rocker', 'clearance', 'rocker_bank']] },
  ] },
  tpushrod: { title: 'Pushrods', part: 'Pushrod', steps: [
    { title: 'Length & straightness', m: [
      IM({ key: 'pushrod_length', label: 'Pushrod length', unit: 'mm', scope: 'valve', standard: { min: 190, max: 195 } }),
      IM({ key: 'pushrod_runout', label: 'Pushrod runout', unit: 'mm', scope: 'valve', limit: { max: 0.30 } }),
    ] },
  ] },
  tlifter: { title: 'Lifters / tappets', part: 'Lifter', steps: [
    { title: 'Lifter body', m: [
      IM({ key: 'lifter_od', label: 'Lifter outer diameter', unit: 'mm', scope: 'valve', standard: { min: 21.4, max: 21.5 }, limit: { min: 21.35 } }),
      IM({ key: 'lifter_bore', label: 'Lifter bore diameter', unit: 'mm', scope: 'valve', standard: { min: 21.5, max: 21.55 } }),
    ] },
  ] },
  tbucket: { title: 'Bucket followers', part: 'Bucket follower', steps: [
    { title: 'Bucket OD & clearance', m: [
      IM({ key: 'bucket_od', label: 'Bucket outer diameter', unit: 'mm', scope: 'valve', standard: { min: 29.96, max: 29.98 } }),
      IM({ key: 'bucket_clearance', label: 'Bucket-to-bore clearance', unit: 'mm', scope: 'valve', standard: { min: 0.02, max: 0.06 }, limit: { max: 0.10 } }),
    ] },
  ] },
  tpedrocker: { title: 'Pedestal rockers', part: 'Rocker arm', steps: [
    { title: 'Rocker geometry', m: [
      IM({ key: 'rocker_ratio_check', label: 'Rocker tip / roller condition', type: 'check', scope: 'rocker_bank' }),
      IM({ key: 'rocker_bore', label: 'Rocker pivot bore', unit: 'mm', scope: 'rocker_bank', standard: { min: 18.0, max: 18.05 } }),
    ] },
  ] },
  t3: { title: 'Examine cylinders', part: 'Cylinder block (bore / hone)', steps: [
    { title: 'Bore measurement & grade', calc: 'bore', m: [] },
    { title: 'Deck flatness', m: [['cylinder_block', 'surface_flatness', 'head']] },
    { title: 'Wall condition', m: [IM({ key: 'wall_condition', label: 'Bore wall condition (no scoring/damage)', type: 'check', scope: 'cylinder' })] },
  ] },
  t4: { title: 'Examine pistons', steps: [
    { title: 'Skirt diameter', m: [['piston', 'skirt_diameter', 'piston']] },
    { title: 'Piston-to-bore clearance', m: [['piston', 'to_cylinder_clearance', 'piston']] },
    { title: 'Pin bore', m: [['piston', 'pin_hole_diameter', 'piston']] },
  ] },
  tc: { title: 'Crankshaft inspection', steps: [
    { title: 'Main journal diameter', m: [['crankshaft', 'main_journal_diameter', 'main_journal']] },
    { title: 'Rod journal diameter', m: [['crankshaft', 'pin_journal_diameter', 'rod']] },
    { title: 'Out-of-round & taper', m: [['crankshaft', 'out_of_round', 'main_journal'], ['crankshaft', 'taper', 'main_journal']] },
    { title: 'Runout', m: [['crankshaft', 'runout', 'single']] },
    { title: 'End play & main bearing clearance', m: [['crankshaft', 'free_end_play', 'single'], ['bearing_clearance', 'main_bearing_clearance', 'main_journal']] },
  ] },
  tr: { title: 'Connecting rods & bearings', steps: [
    { title: 'Bend & twist', m: [['connecting_rod', 'bend_limit', 'rod'], ['connecting_rod', 'torsion_limit', 'rod']] },
    { title: 'Big-end bore', m: [['connecting_rod', 'big_end_inner_diameter', 'rod']] },
    { title: 'Side clearance', m: [['connecting_rod', 'side_clearance', 'rod']] },
    { title: 'Rod bearing clearance', m: [['bearing_clearance', 'connecting_rod_bearing_clearance', 'rod']] },
  ] },
  top: { title: 'Oil pump', steps: [
    { title: 'Rotor tip clearance', m: [IM({ key: 'tip_clearance', label: 'Rotor tip clearance', unit: 'mm', standard: { min: 0.05, max: 0.12 }, limit: { max: 0.20 } })] },
    { title: 'Outer rotor to housing', m: [IM({ key: 'outer_clearance', label: 'Outer rotor to housing', unit: 'mm', standard: { min: 0.11, max: 0.20 }, limit: { max: 0.30 } })] },
    { title: 'Rotor side clearance', m: [IM({ key: 'side_clearance', label: 'Rotor side clearance', unit: 'mm', standard: { min: 0.05, max: 0.11 }, limit: { max: 0.20 } })] },
  ] },
  twp: { title: 'Water pump', steps: [
    { title: 'Shaft bearing play', m: [IM({ key: 'shaft_play', label: 'Shaft bearing play', unit: 'mm', limit: { max: 0.10 } })] },
    { title: 'Impeller-to-housing clearance', m: [IM({ key: 'impeller_clearance', label: 'Impeller to housing', unit: 'mm', standard: { min: 0.5, max: 1.0 } })] },
  ] },
  tt: { title: 'Timing chain / belt', steps: [
    { title: 'Chain stretch', m: [IM({ key: 'chain_stretch', label: 'Chain stretch (over 20 links)', unit: 'mm', limit: { max: 3.0 } })] },
    { title: 'Guide wear', m: [IM({ key: 'guide_wear', label: 'Guide wear depth', unit: 'mm', limit: { max: 1.0 } })] },
  ] },
  tlub: { title: 'Lubrication system', steps: [
    { title: 'Oil pressure', m: [['lubrication', 'oil_pressure_idle', 'single'], ['lubrication', 'oil_pressure_2000', 'single']] },
    { title: 'Oil pump clearances', m: [['lubrication', 'oil_pump_body_outer_radial', 'single'], ['lubrication', 'oil_pump_tip_clearance', 'single'], ['lubrication', 'oil_pump_inner_axial', 'single'], ['lubrication', 'oil_pump_outer_axial', 'single'], ['lubrication', 'oil_pump_housing_clearance', 'single']] },
    { title: 'Regulator valve', m: [['lubrication', 'regulator_valve_clearance', 'single']] },
  ] },
  tcool: { title: 'Cooling system', steps: [
    { title: 'Leak test', m: [['cooling', 'leak_test_pressure', 'single'], IM({ key: 'hose_condition', label: 'Cooling hose condition', type: 'check' }), IM({ key: 'holds_pressure', label: 'System holds test pressure', type: 'check' })] },
    { title: 'Radiator cap', m: [['cooling', 'radiator_cap_relief', 'single']] },
    { title: 'Thermostat', m: [['cooling', 'thermostat_opening_temp', 'single'], ['cooling', 'thermostat_valve_lift', 'single'], IM({ key: 'thermostat_seating', label: 'Valve seats at ambient', type: 'check' })] },
  ] },
  tdiag: { title: 'Overheating diagnostics', steps: [
    { title: 'Cause checklist', m: [
      IM({ key: 'd_water_pump', label: 'Water pump OK', type: 'check' }),
      IM({ key: 'd_thermostat', label: 'Thermostat not stuck closed', type: 'check' }),
      IM({ key: 'd_radiator_flow', label: 'Radiator flow OK', type: 'check' }),
      IM({ key: 'd_fins', label: 'Fins & airflow OK', type: 'check' }),
      IM({ key: 'd_cap', label: 'Cap seals & relieves', type: 'check' }),
      IM({ key: 'd_coolant', label: 'Coolant quality OK', type: 'check' }),
      IM({ key: 'd_fan', label: 'Fan / clutch OK', type: 'check' }),
      IM({ key: 'd_headgasket', label: 'No exhaust in coolant', type: 'check' }),
    ] },
  ] },
  tcam: { title: 'Camshaft inspection', part: 'Camshaft', steps: [
    { title: 'Cam lobe height', m: [['camshaft', 'cam_height_intake', 'valve'], ['camshaft', 'cam_height_exhaust', 'valve']] },
    { title: 'Journal & end play', m: [['camshaft', 'journal_outer_diameter', 'single'], ['camshaft', 'journal_clearance', 'single'], ['camshaft', 'end_play', 'camshaft']] },
    { title: 'Runout', m: [['camshaft', 'runout', 'camshaft']] },
  ] },
  tbal: { title: 'Balance rotating assembly', part: 'Rotating assembly', steps: [
    { title: 'Component weights', calc: 'balance', m: [] },
    { title: 'Spin balance', m: [IM({ key: 'imbalance_front', label: 'Residual imbalance — front', unit: 'g·cm', limit: { max: 4 } }), IM({ key: 'imbalance_rear', label: 'Residual imbalance — rear', unit: 'g·cm', limit: { max: 4 } })] },
  ] },
};
