# MotorBase

MotorBase is an engine-building platform that combines guided inspection workflows with parts procurement in one place. Builders work through phase-based tasks—teardown, inspect, machine, assemble—recording measurements against engine specs and getting immediate pass/fail/out-of-spec feedback. When something fails inspection, it automatically becomes a part need on the build's bill of materials, so ordering and tracking parts (to order, on order, received, backordered) stays tied to what the build actually requires. It's designed as multi-tenant SaaS for shops that want a single system to both execute and supply an engine rebuild.

## What it's for

MotorBase helps an engine builder **do a build and supply a build** in one place, across two connected pillars:

- **Guided build workflow** — walk through the common tasks of a build (examine the cylinders, pistons, and cylinder head, evaluate the valvetrain, crankshaft/bearings, etc.), following step-by-step procedures and recording the measurements each task requires. Readings are checked against the engine's specifications and flagged as in-spec, out-of-standard, or beyond the service limit.
- **Parts ordering (procurement)** — define the parts a build needs (a bill of materials), order them from vendors, and track them: what's needed vs. ordered vs. received, from whom, and at what cost.

The pillars connect: an inspection that measures beyond limit generates a part need (including the correct graded/selective-fit part), which flows straight into the BOM and the ordering workflow.

### Engine specification templates

Measurements are validated against a **standardized JSON specification** for the engine type. A user downloads a blank template, fills in every value for their engine (e.g. VG33E — valve stem diameter, seat/face, runout, clearances, graded parts), and uploads it; MotorBase stores it and uses it to validate the workflow. See `schema/` for the JSON Schema, a blank template, and a filled VG33E example.

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

- `DESIGN.md` — full design.
- `schema/` — standardized engine-spec JSON Schema, blank template, and VG33E example.
- `scripts/` — helpers to generate the blank template and evaluate readings against a spec.
