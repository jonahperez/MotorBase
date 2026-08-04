# MotorBase

MotorBase is an engine-building platform that combines guided inspection workflows with parts procurement in one place. Builders work through phase-based tasks—teardown, inspect, machine, assemble—recording measurements against engine specs and getting immediate pass/fail/out-of-spec feedback. When something fails inspection, it automatically becomes a part need on the build's bill of materials, so ordering and tracking parts (to order, on order, received, backordered) stays tied to what the build actually requires. It's designed as multi-tenant SaaS for shops that want a single system to both execute and supply an engine rebuild.

## What it's for

MotorBase helps an engine builder **do a build and supply a build** in one place, across two connected pillars:

- **Guided build workflow** — walk through the common tasks of a build (examine the cylinders, pistons, and cylinder head, evaluate the valvetrain, crankshaft/bearings, etc.), following step-by-step procedures and recording the measurements each task requires. Readings are checked against the engine's specifications and flagged as in-spec, out-of-standard, or beyond the service limit. Which modules appear is driven by the build’s **engine architecture** (topology), separate from numeric limits.
- **Parts ordering (procurement)** — maintain a need list / BOM, fulfill from **vendor order**, **shop stock**, or **customer-supplied**, and track cost and coverage (estimate · committed · still to cover · actual).

The pillars connect: an inspection that measures beyond limit (or a **Replace** mark) generates a part need (including the correct graded/selective-fit part), which flows into the need list and ordering workflow. At the end of a build, MotorBase produces a **print/PDF report** (exceptions, measurement log, parts used, costs, PO trail, completion checklist).

### Engine architecture vs specification templates

- **Architecture** — what the engine *is* (V/inline, cylinder count, valvetrain family, cams). Chosen at build setup; editable on the build. Gates the work plan.
- **Engine specs** — numeric **limits** for an engine type. A user downloads a blank JSON template, fills values (e.g. VG33E), and uploads it. See `schema/` for the JSON Schema, blank template, and VG33E example.

### UI mockup

A clickable prototype lives in [`mockup/`](./mockup/) (architecture wizard, measurement workspace, parts workbench, shop desk, build report). See [`mockup/README.md`](./mockup/README.md).

## Architecture (light)

Multi-tenant SaaS on an AWS serverless stack:

- **Auth** — Amazon Cognito user pool with Google federated sign-in. A custom `tenant_id` claim is attached to each identity so every request is scoped to its tenant.
- **API** — Amazon API Gateway (HTTP API) with a Cognito JWT authorizer, backed by Python (AWS Lambda).
- **Data** — a single tenant-scoped Amazon DynamoDB table (`tenant_id` is the leading segment of every key) storing builds, tasks/measurements, parts, orders, and uploaded engine specs.

```
Google ──▶ Cognito ──▶ API Gateway (JWT authorizer) ──▶ Lambda (Python) ──▶ DynamoDB
```

The design (domain model, single-table keys, identity, and the spec-template feature) is documented in [`DESIGN.md`](./DESIGN.md).

## Repository layout

- `DESIGN.md` — full design (domain, AWS, specs, mockup-validated UX in §13).
- `mockup/` — clickable UI prototype.
- `schema/` — standardized engine-spec JSON Schema, blank template, and VG33E example.
- `scripts/` — helpers to generate the blank template and evaluate readings against a spec.
