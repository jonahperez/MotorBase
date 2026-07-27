# MotorBase — UI mockup

A self-contained, clickable prototype of the MotorBase UI (no build step, no backend). It illustrates the core flows from the design: sign-in, builds, the guided inspection workflow, findings → bill of materials, orders, engine-spec templates, and the compression-ratio calculator.

The measurement validation and compression-ratio math are the **real algorithms** (ported from `scripts/spec_eval.py` and `scripts/compression_ratio.py`) and are driven by the actual VG33E spec at `data/vg33e.engine-spec.json` (a copy of `schema/examples/vg33e.engine-spec.json`).

## Run

Serve the folder over HTTP (needed for the `fetch` of the spec JSON):

```
cd mockup
python3 -m http.server 8123
```

Then open http://localhost:8123/index.html and click **Continue with Google**.

## What to try

- Open the **VG33E Pathfinder rebuild** build → **Guided workflow** → **Evaluate valvetrain**. Type a reading (e.g. valve stem diameter `6.972`) and watch the badge update live (In spec / Out of standard / Beyond limit; graded parts resolve a grade).
- Click **Add to parts needed** on a beyond-limit finding to push it into the **Bill of materials**.
- Open the **Compression ratio** tab and change a volume input to see the ratio recompute.
- Open **Engine specs** to see the standardized template sections.

## Notes

- Mockup only: auth, data, and orders are stubbed; nothing is persisted.
- Files: `index.html`, `styles.css` (hand-written, no framework), `app.js`, `data/`.
