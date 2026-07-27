#!/usr/bin/env python3
"""Derive a blank engine-spec template from a filled spec.

The app's "download standardized template" link is generated the same way:
take the canonical set of measurement definitions (keys/labels/units/grade
labels) and clear the numeric value fields so a user only fills in numbers.

Usage:
    python scripts/make_blank_template.py <filled-spec.json> <out-template.json>
"""
import json
import sys

VALUE_KEYS = {"nominal", "atValue"}


def clear_range(rng):
    return {k: None for k in rng}


def blank_measurement(m):
    out = {}
    for k, v in m.items():
        if k in VALUE_KEYS:
            out[k] = None
        elif k in ("standard", "limit"):
            out[k] = clear_range(v)
        elif k == "grades":
            out[k] = [
                {gk: (None if gk in ("min", "max") else gv) for gk, gv in g.items()}
                for g in v
            ]
        else:
            out[k] = v
    return out


def blank_spec(spec):
    engine = dict(spec["engine"])
    for k in ("displacementCc", "boreMm", "strokeMm"):
        if k in engine:
            engine[k] = None
    engine["revision"] = None
    engine["source"] = None
    engine["notes"] = "Fill in every value for your engine type, then upload."
    return {
        "specVersion": spec["specVersion"],
        "engine": engine,
        "sections": [
            {
                "key": s["key"],
                "title": s["title"],
                "component": s.get("component"),
                "measurements": [blank_measurement(m) for m in s["measurements"]],
            }
            for s in spec["sections"]
        ],
    }


def main():
    src, dst = sys.argv[1], sys.argv[2]
    with open(src) as f:
        spec = json.load(f)
    with open(dst, "w") as f:
        json.dump(blank_spec(spec), f, indent=2)
        f.write("\n")
    print(f"Wrote blank template: {dst}")


if __name__ == "__main__":
    main()
