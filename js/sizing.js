/**
 * Wrist size → Italian 9mm link count.
 *
 * Formula (also shown in the builder):
 *   mm = wristInches * 25.4
 *   links = round((mm + comfortMm) / linkPitchMm)
 *   then clamp to minLinks..maxLinks
 *
 * Defaults: pitch 9.5mm (within a 9–9.5mm link), comfort 10mm (about 1cm).
 * A 6.5 inch wrist is (165.1 + 10) / 9.5 = 18.43, which rounds to 18 links.
 */
(function (root) {
  'use strict';

  function linksForWrist(inches, sizing) {
    var cfg = sizing || root.CS.sizing;
    var mm = Number(inches) * 25.4;
    var raw = (mm + cfg.comfortMm) / cfg.linkPitchMm;
    var rounded = Math.round(raw);
    if (rounded < cfg.minLinks) return cfg.minLinks;
    if (rounded > cfg.maxLinks) return cfg.maxLinks;
    return rounded;
  }

  function formulaText() {
    var s = root.CS.sizing;
    return (
      'Link count is the wrist in millimetres, plus ' +
      s.comfortMm +
      'mm of comfort, divided by ' +
      s.linkPitchMm +
      'mm per link, then rounded. A 6.5 inch wrist comes to 18 links.'
    );
  }

  root.Sizing = {
    linksForWrist: linksForWrist,
    formulaText: formulaText,
  };
})(typeof window !== 'undefined' ? window : globalThis);
