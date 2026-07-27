#!/usr/bin/env python3
"""Evaluate a measured reading against an engine-spec measurement definition.

This is the semantics MotorBase uses to validate the guided-measurement
workflow against an uploaded engine specification set. It returns one of:

    IN_SPEC              reading within the standard/new range
    OUT_OF_STANDARD      outside standard but within service/wear limit
    BEYOND_LIMIT         outside the service/wear limit -> replace/machine
    GRADE:<label>        for graded parts, the grade the reading falls into
    NO_GRADE_MATCH       graded part but reading matches no grade

Run as a script for a short demo against the VG33E example.
"""
import json
import sys

NEG_INF, POS_INF = float("-inf"), float("inf")


def _lo(rng):
    v = (rng or {}).get("min")
    return NEG_INF if v is None else v


def _hi(rng):
    v = (rng or {}).get("max")
    return POS_INF if v is None else v


def evaluate(measurement, reading):
    grades = measurement.get("grades")
    if grades:
        for g in grades:
            if _lo(g) <= reading <= _hi(g):
                return f"GRADE:{g['grade']}"
        return "NO_GRADE_MATCH"

    std, lim = measurement.get("standard"), measurement.get("limit")
    if std and _lo(std) <= reading <= _hi(std):
        return "IN_SPEC"

    if lim:
        # Upper wear limit (limit.max) and/or lower "more than" limit (limit.min).
        if reading > _hi(lim) or reading < _lo(lim):
            return "BEYOND_LIMIT"
        return "OUT_OF_STANDARD"

    if std:
        return "OUT_OF_STANDARD"

    nominal = measurement.get("nominal")
    if nominal is not None:
        return "IN_SPEC" if reading == nominal else "OUT_OF_STANDARD"
    return "IN_SPEC"


def _find(spec, section_key, meas_key):
    for s in spec["sections"]:
        if s["key"] == section_key:
            for m in s["measurements"]:
                if m["key"] == meas_key:
                    return m
    raise KeyError(f"{section_key}.{meas_key}")


def _demo(spec_path):
    spec = json.load(open(spec_path))
    cases = [
        ("valve", "stem_diameter_intake", 6.972, "IN_SPEC"),
        ("valve", "stem_diameter_intake", 6.900, "OUT_OF_STANDARD"),
        ("valve", "to_guide_clearance_exhaust", 0.045, "IN_SPEC"),
        ("valve", "to_guide_clearance_exhaust", 0.070, "OUT_OF_STANDARD"),
        ("valve", "to_guide_clearance_exhaust", 0.130, "BEYOND_LIMIT"),
        ("cylinder_head", "surface_flatness", 0.05, "IN_SPEC"),
        ("cylinder_head", "surface_flatness", 0.15, "OUT_OF_STANDARD"),
        ("piston", "skirt_diameter", 91.478, "GRADE:2"),
        ("piston", "skirt_diameter", 91.730, "GRADE:0.25 OS"),
        ("piston", "to_cylinder_clearance", 0.120, "BEYOND_LIMIT"),
        ("main_bearing", "no1_thickness", 1.827, "GRADE:2"),
        ("crankshaft", "runout", 0.02, "IN_SPEC"),
        ("crankshaft", "runout", 0.30, "BEYOND_LIMIT"),
    ]
    ok = True
    print(f"{'measurement':<42}{'reading':>10}  {'result':<16}{'expected':<16}")
    print("-" * 84)
    for sec, key, reading, expected in cases:
        got = evaluate(_find(spec, sec, key), reading)
        flag = "ok" if got == expected else "MISMATCH"
        if got != expected:
            ok = False
        print(f"{sec + '.' + key:<42}{reading:>10}  {got:<16}{expected:<16}{flag}")
    print("-" * 84)
    print("ALL PASS" if ok else "FAILURES PRESENT")
    return 0 if ok else 1


if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "schema/examples/vg33e.engine-spec.json"
    sys.exit(_demo(path))
