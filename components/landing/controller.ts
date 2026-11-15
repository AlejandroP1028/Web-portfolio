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

// A generic gamepad, not any real product. Front outline, right half, clockwise from
// the top centre; the left half is its mirror. Body about 410 wide.
const HALF: [number, number][] = [
  [0, 92], [60, 96], [120, 104], [165, 100], [192, 80], [204, 40], [206, -10],
  [200, -60], [186, -110], [160, -140], [130, -146], [106, -128], [92, -96],
  [70, -70], [30, -60], [0, -58],
];

const FACE = 20; // z of the front face

function outline() {
  const right = HALF.map(([x, y]) => new THREE.Vector2(x, y));
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

/** Line-art generic gamepad: d-pad, four face buttons, two sticks, shoulders, home. */
export function buildController(kit: Kit): ControllerParts {
  const { part, disc, circle, heavy, ink, fine, detail, lineMat, fillMat, colors } = kit;
  const model = new THREE.Group();
  const at = <T extends THREE.Object3D>(o: T, x: number, y: number, z: number) => (o.position.set(x, y, z), o);

  // pen weights: the body heaviest; buttons, d-pad and stick bases lighter; the small parts finest
  model.add(part(slab(outline(), -FACE, FACE, 28), undefined, heavy));

  // shoulder buttons, peeking over the top edge behind the face
  for (const x of [-130, 130]) model.add(at(part(slab(roundRect(92, 24, 11), -12, 12, 8), undefined, ink), x, 100, 0));

  // d-pad in a shallow dish
  const d = new THREE.Shape();
  const [a, w] = [24, 8];
  [[-w, a], [w, a], [w, w], [a, w], [a, -w], [w, -w], [w, -a], [-w, -a], [-w, -w], [-a, -w], [-a, w], [-w, w]].forEach(([x, y], i) =>
    i ? d.lineTo(x, y) : d.moveTo(x, y),
  );
  model.add(at(circle(36, detail, FACE + 0.3), -120, 30, 0));
  model.add(at(part(slab(d, FACE, FACE + 6, 1), undefined, ink), -120, 30, 0));

  // face buttons: top, right, bottom, left
  const abxyMats: THREE.MeshBasicMaterial[] = [];
  for (const [x, y] of [
    [120, 56],
    [146, 30],
    [120, 4],
    [94, 30],
  ]) {
    const m = fillMat();
    abxyMats.push(m);
    model.add(at(part(disc(12, 6), m, ink), x, y, FACE + 3));
  }

  // two sticks, side by side: base, light ring, stem, dished cap
  const ringMats: LineMaterial[] = [];
  const glowMats: LineMaterial[] = [];
  for (const x of [-62, 62]) {
    const g = at(new THREE.Group(), x, -38, 0);
    g.add(at(part(disc(31, 4), undefined, ink), 0, 0, FACE + 2));
    const glow = lineMat({ linewidth: 9, transparent: true, opacity: 0, depthWrite: false, color: colors.fun.getHex() });
    const ring = lineMat({ linewidth: 1.8 });
    g.add(circle(27, glow, FACE + 4.2));
    g.add(circle(27, ring, FACE + 4.4));
    g.add(at(part(disc(9, 10), undefined, fine), 0, 0, FACE + 9));
    g.add(at(part(disc(19, 7), undefined, ink), 0, 0, FACE + 17.5));
    g.add(circle(13, detail, FACE + 21.2, 40));
    model.add(g);
    ringMats.push(ring);
    glowMats.push(glow);
  }

  // centre: two small buttons either side of the orange home button
  for (const x of [-38, 38]) model.add(at(part(slab(roundRect(20, 9, 4.5), FACE, FACE + 3, 6), undefined, fine), x, 56, 0));
  const homeMat = fillMat();
  homeMat.color.copy(colors.fun);
  const home = at(part(disc(11, 4), homeMat, fine), 0, 56, FACE + 2);
  model.add(home);

  return { model, ringMats, glowMats, abxyMats, home, homeMat };
}
