import * as THREE from "three";
import type { LineMaterial } from "three/addons/lines/LineMaterial.js";
import type { Kit } from "./kit";

/**
 * What the scene needs back from the controller model.
 * - model: the whole controller, front face toward +z, about 400 units wide.
 *   The scene centres and scales it, so its origin does not matter.
 * - ringMats / glowMats: the light ring around each stick (ink line, plus a wide
 *   translucent line behind it that glows on hover).
 * - abxyMats: fills of the four face buttons, lit one after another on hover.
 * - home / homeMat: the centre (home) button, always orange; the Fun transition
 *   dives into it and the orange grows out of it.
 */
export type ControllerParts = {
  model: THREE.Group;
  ringMats: LineMaterial[];
  glowMats: LineMaterial[];
  abxyMats: THREE.MeshBasicMaterial[];
  home: THREE.Object3D;
  homeMat: THREE.MeshBasicMaterial;
};

// Traced from photos of an 8BitDo Ultimate 2 (front view; no logos or lettering). Front
// outline, right half, clockwise from the top centre; the left half is its mirror.
// About 416 wide and 290 tall, with long grips.
const HALF: [number, number][] = [
  [0, 106], [80, 106], [130, 103], [160, 92], [178, 70], [192, 40], [203, 0], [208, -40],
  [207, -75], [202, -110], [192, -150], [178, -172], [160, -180], [143, -175], [128, -158],
  [114, -130], [100, -96], [84, -86], [40, -84], [0, -84],
];

const FACE = 20; // z of the front face

function outline(k = 1) {
  const right = HALF.map(([x, y]) => new THREE.Vector2(x * k, y * k));
  const left = right.slice(1, -1).reverse().map((p) => new THREE.Vector2(-p.x, p.y));
  const pts = [...right, ...left, right[0]];
  const s = new THREE.Shape();
  s.moveTo(pts[0].x, pts[0].y);
  s.splineThru(pts.slice(1));
  return s;
}

/** Flat extrusion between z0 and z1: only the outline creases get drawn. */
function slab(shape: THREE.Shape, z0: number, z1: number, curveSegments = 12) {
  const g = new THREE.ExtrudeGeometry(shape, { depth: z1 - z0, bevelEnabled: false, curveSegments });
  g.translate(0, 0, z0);
  return g;
}

function roundRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const [x, y] = [-w / 2, -h / 2];
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** Line-art 8BitDo Ultimate 2: offset sticks, d-pad, four face buttons, bumpers and triggers. */
export function buildController(kit: Kit): ControllerParts {
  const { part, disc, circle, heavy, ink, fine, detail, lineMat, fillMat, colors } = kit;
  const model = new THREE.Group();
  const at = <T extends THREE.Object3D>(o: T, x: number, y: number, z: number) => (o.position.set(x, y, z), o);

  // pen weights: the body heaviest; buttons, d-pad and stick bases lighter; the small parts finest.
  // The front shell, and a slightly smaller back shell behind it for the rounded back.
  model.add(part(slab(outline(), -FACE, FACE, 28), undefined, heavy));
  model.add(part(slab(outline(0.93), -FACE - 22, -FACE, 28), undefined, fine));

  // bumpers over the top edge, the triggers standing up behind them
  for (const x of [-120, 120]) {
    model.add(at(part(slab(roundRect(84, 22, 10), -14, 10, 8), undefined, ink), x, 104, 0));
    model.add(at(part(slab(roundRect(62, 30, 12), -36, -16, 8), undefined, fine), x * 1.04, 110, 0));
  }

  // d-pad, low on the left, with its pivot dot
  const d = new THREE.Shape();
  const [a, w] = [34, 12];
  [[-w, a], [w, a], [w, w], [a, w], [a, -w], [w, -w], [w, -a], [-w, -a], [-w, -w], [-a, -w], [-a, w], [-w, w]].forEach(([x, y], i) =>
    i ? d.lineTo(x, y) : d.moveTo(x, y),
  );
  model.add(at(circle(42, detail, FACE + 0.3), -61, -28, 0));
  model.add(at(part(slab(d, FACE, FACE + 6, 1), undefined, ink), -61, -28, 0));
  model.add(at(circle(4, detail, FACE + 6.3, 20), -61, -28, 0));

  // face buttons: top (X), right (A), bottom (B), left (Y)
  const abxyMats: THREE.MeshBasicMaterial[] = [];
  for (const [x, y] of [
    [126, 73],
    [157, 41],
    [128, 9],
    [97, 41],
  ]) {
    const m = fillMat();
    abxyMats.push(m);
    model.add(at(part(disc(12, 6), m, ink), x, y, FACE + 3));
  }

  // left stick high, right stick low: base, light ring, stem, dished cap
  const ringMats: LineMaterial[] = [];
  const glowMats: LineMaterial[] = [];
  for (const [x, y] of [
    [-126, 53],
    [58, -32],
  ]) {
    const g = at(new THREE.Group(), x, y, 0);
    g.add(at(part(disc(31, 4), undefined, ink), 0, 0, FACE + 2));
    const glow = lineMat({ linewidth: 9, transparent: true, opacity: 0, depthWrite: false, color: colors.fun.getHex() });
    const ring = lineMat({ linewidth: 1.8 });
    g.add(circle(27, glow, FACE + 4.2));
    g.add(circle(27, ring, FACE + 4.4));
    g.add(at(part(disc(9, 10), undefined, fine), 0, 0, FACE + 9));
    g.add(at(part(disc(20, 7), undefined, ink), 0, 0, FACE + 17.5));
    g.add(circle(14, detail, FACE + 21.2, 40));
    model.add(g);
    ringMats.push(ring);
    glowMats.push(glow);
  }

  // the centre column: two round buttons either side of the (orange) home button, the
  // two icon buttons under them, the pill button, then the three player lights
  for (const x of [-56, 53]) model.add(at(part(disc(8, 3), undefined, fine), x, 74, FACE + 1.5));
  for (const x of [-28, 30]) model.add(at(part(disc(8.5, 3), undefined, fine), x, 43, FACE + 1.5));
  model.add(at(part(slab(roundRect(18, 9, 4.5), FACE, FACE + 3, 6), undefined, fine), 0, 8, 0));
  for (const y of [-20, -30, -40]) model.add(at(circle(1.6, detail, FACE + 0.3, 10), 0, y, 0));
  model.add(at(circle(14, detail, FACE + 0.3), 0, 76, 0));
  const homeMat = fillMat();
  homeMat.color.copy(colors.fun);
  const home = at(part(disc(11, 4), homeMat, fine), 0, 76, FACE + 2);
  model.add(home);

  return { model, ringMats, glowMats, abxyMats, home, homeMat };
}
