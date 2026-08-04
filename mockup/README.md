# MotorBase — UI mockup

A self-contained, clickable prototype of the MotorBase UI (no build step, no backend). Compact measurement-entry workflow: phase/section strips for quick navigation, live spec validation, and parts tracking.

Measurement validation uses the **real algorithm** (ported from `scripts/spec_eval.py`) against the VG33E spec at `data/vg33e.engine-spec.json`.

## Run

```
cd mockup
python3 -m http.server 8123
```

Open http://localhost:8123/index.html → **Continue with Google** → **VG33E Pathfinder rebuild**.

## What to try

- **New build**: pick an architecture template (V6 SOHC rocker, I4 DOHC, V8 OHV pushrod, single-cylinder), tweak topology, then create.
- Open **VG33E** vs **SBC 350** and compare the **Measurements** section list — rocker shafts vs pushrods/lifters are gated by architecture.
- **Architecture** tab on a build: topology map, edit family/counts/cams, see which work-plan modules are active.
- **Measurements** tab: phase/section strips, live OK/OoS badges, **Replace** → Parts toast, Enter advances fields.
- **Parts & orders**: cost strip (est / committed / cart / stock / still to cover), need list with fulfill path (order · shop stock · customer), cart → submit PO by vendor, expand PO to receive lines, inspection “why” deep-link.
- **Dashboard**: shop desk — still-to-cover parts, open POs, inspection issues, attention list (not a Builds clone).
- **Generate report** (on a build): print-ready dossier — exceptions, completion checklist, measurement log, parts used, cost rollup, PO trail. Use Print / Save PDF.
- **Engine specs**: limits catalogs only (architecture templates live on New build / Architecture tab).

## Notes

- Architecture (topology) and engine-spec (limits) are separate layers.
- Readings, need list, cart, and POs are per build.
- Mockup only: auth and persistence are stubbed.
- Files: `index.html`, `styles.css`, `architecture.js`, `app.js`, `diagrams.js`, `data/`.
