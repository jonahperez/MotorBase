#!/usr/bin/env python3
"""Compression-ratio math for MotorBase.

Implements the method from the reference article (Maximum Drive,
"Putting the Squeeze On", 2015):

    compression ratio = (swept volume + clearance volume) / clearance volume

where the clearance volume (everything above top dead center) is built up
from the individual volumes captured in the engine spec's "compression_ratio"
section:

    clearance = combustion chamber
              + piston dome/dish  (dish positive, dome negative)
              + top ring-land crevice (~1 cc)
              + deck clearance volume
              + head-gasket volume

All linear dimensions are millimetres; all volumes are cubic centimetres.
"""

K = 0.7854  # pi / 4


def swept_volume_cc(bore_mm, stroke_mm):
    """Displacement of one cylinder, BDC to TDC."""
    return K * bore_mm ** 2 * stroke_mm / 1000.0


def cylinder_volume_cc(bore_mm, height_mm):
    """Volume of a short cylinder (used for deck-clearance and gasket volumes)."""
    return K * bore_mm ** 2 * height_mm / 1000.0


def clearance_volume_cc(chamber, dome_dish, ringland, deck, gasket):
    return chamber + dome_dish + ringland + deck + gasket


def compression_ratio(swept, clearance):
    return (swept + clearance) / clearance


def compute(bore_mm, stroke_mm, chamber_cc, dome_dish_cc, ringland_cc,
            deck_clearance_mm, gasket_bore_mm, gasket_thickness_mm):
    swept = swept_volume_cc(bore_mm, stroke_mm)
    deck = cylinder_volume_cc(bore_mm, deck_clearance_mm)
    gasket = cylinder_volume_cc(gasket_bore_mm, gasket_thickness_mm)
    clearance = clearance_volume_cc(chamber_cc, dome_dish_cc, ringland_cc, deck, gasket)
    return {
        "swept_volume": swept,
        "deck_volume": deck,
        "head_gasket_volume": gasket,
        "clearance_volume": clearance,
        "compression_ratio": compression_ratio(swept, clearance),
    }


def _demo():
    # 1) Verify the ratio formula against the article's big-block example:
    #    combined (swept + clearance) = 1380.34 cc, clearance = 86.69 cc -> 15.92:1
    combined, clearance = 1380.34, 86.69
    cr = compression_ratio(combined - clearance, clearance)
    print(f"Article big-block check: {combined}/{clearance} = {cr:.2f}:1  (expected 15.92:1)")
    assert round(cr, 2) == 15.92

    # 2) Article's piston-supplier clearance figures (chamber 51.7 + 1 cc ringland + piston 16.8):
    print(f"Article clearance build-up: 51.7 + 1.0 + 16.8 = {51.7 + 1.0 + 16.8:.1f} cc")

    # 3) Full component build-up for a VG33E (91.5 x 83 mm), targeting ~8.9:1:
    r = compute(bore_mm=91.5, stroke_mm=83.0, chamber_cc=60.0, dome_dish_cc=3.0,
                ringland_cc=1.0, deck_clearance_mm=0.20,
                gasket_bore_mm=92.0, gasket_thickness_mm=0.50)
    print("\nVG33E component build-up (per cylinder):")
    for k in ("swept_volume", "deck_volume", "head_gasket_volume", "clearance_volume"):
        print(f"  {k:<20} {r[k]:8.3f} cc")
    print(f"  {'compression_ratio':<20} {r['compression_ratio']:8.2f}:1")
    print(f"\nTotal displacement: {swept_volume_cc(91.5, 83.0) * 6:.0f} cc (6 cylinders)")
    print("OK")


if __name__ == "__main__":
    _demo()
