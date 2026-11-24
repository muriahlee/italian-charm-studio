/**
 * Share a design in the URL hash.
 * Payload is UTF-8 JSON, then base64url. No server, no account.
 * Charm ids that are not in the catalog are dropped on read.
 */
(function (root) {
  'use strict';

  function toB64(str) {
    var bytes = new TextEncoder().encode(str);
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  function fromB64(b64) {
    var pad = b64.length % 4 === 0 ? '' : '===='.slice(b64.length % 4);
    var norm = String(b64).replace(/-/g, '+').replace(/_/g, '/') + pad;
    var bin = atob(norm);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function encode(design) {
    var payload = {
      v: 1,
      m: design.metal === 'silver' ? 's' : 'g',
      w: design.wrist,
      a: design.assembly === 'diy' ? 'd' : 'p',
      t: design.includeTool ? 1 : 0,
      b: design.includeGiftBox ? 1 : 0,
      s: String(design.story || '').slice(0, 180),
      g: String(design.giftMessage || '').slice(0, 140),
      c: (design.links || []).map(function (id) { return id || ''; }),
    };
    return toB64(JSON.stringify(payload));
  }

  function decode(token) {
    if (!token) return null;
    var payload;
    try {
      payload = JSON.parse(fromB64(decodeURIComponent(token)));
    } catch (e) {
      try { payload = JSON.parse(fromB64(token)); } catch (e2) { return null; }
    }
    if (!payload || payload.v !== 1 || !Array.isArray(payload.c)) return null;
    var wrists = root.CS.sizing.wrists;
    var wrist = Number(payload.w);
    if (wrists.indexOf(wrist) === -1) wrist = root.CS.sizing.defaultWrist;
    var expected = root.Sizing.linksForWrist(wrist);
    var links = payload.c.map(function (id) {
      if (!id) return null;
      return root.Catalog.byId(id) ? id : null;
    });
    if (links.length > expected) links = links.slice(0, expected);
    while (links.length < expected) links.push(null);
    return {
      metal: payload.m === 's' ? 'silver' : 'gold',
      wrist: wrist,
      links: links,
      assembly: payload.a === 'd' ? 'diy' : 'studio',
      includeTool: payload.t === 1,
      includeGiftBox: payload.b === 1,
      story: String(payload.s || '').slice(0, 180),
      giftMessage: String(payload.g || '').slice(0, 140),
    };
  }

  root.Codec = { encode: encode, decode: decode };
})(typeof window !== 'undefined' ? window : globalThis);
