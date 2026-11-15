import * as THREE from "three";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial, type LineMaterialParameters } from "three/addons/lines/LineMaterial.js";

/** Colours read from the page's CSS tokens, so both themes work. */
export type Palette = {
  ink: THREE.Color;
  paper: THREE.Color;
  work: THREE.Color;
  fun: THREE.Color;
  bar: THREE.Color;
};

/**
 * The line-art toolkit every 3D object is built with: a paper-coloured fill hides
 * the lines behind it, and creased edges are drawn in ink at a fixed pixel width.
 */
export type Kit = {
  colors: Palette;
  /** Every line material, so the scene can update resolution and theme. */
  lineMats: LineMaterial[];
  /** Pen weights: heavy for an object's body, ink for its main parts, fine for small parts, detail for texture. */
  heavy: LineMaterial;
  ink: LineMaterial;
  fine: LineMaterial;
  detail: LineMaterial;
  paper: THREE.MeshBasicMaterial;
  lineMat(opts?: LineMaterialParameters): LineMaterial;
  fillMat(): THREE.MeshBasicMaterial;
  /** A mesh with a paper fill plus its edges (creases sharper than `thr` degrees). */
  part(geom: THREE.BufferGeometry, fill?: THREE.Material, mat?: LineMaterial, thr?: number): THREE.Group;
  /** Line segments from a flat [x1,y1,z1, x2,y2,z2, ...] array. */
  segs(arr: number[], mat: LineMaterial): LineSegments2;
  /** A circle in the XY plane at depth z. */
  circle(r: number, mat: LineMaterial, z?: number, seg?: number): LineSegments2;
  /** A cylinder whose axis points at the viewer (+z). */
  disc(r: number, h: number): THREE.BufferGeometry;
};

// Hand-drawn lines. A smooth noise field bends every line a little; since it depends only on
// position, lines that share an end stay joined. Straight edges are cut into short pieces
// so they can bend, and at a corner or a loose end the pen runs on a few units past it.
const WOBBLE = 1.1; // model units (about px at the usual size)
const STEP = 10; // longest straight piece
const wob = (x: number, y: number, z: number, i: number) =>
  WOBBLE * 0.5 * (Math.sin(0.051 * x + 0.037 * y + 0.029 * z + i * 1.7) + Math.sin(0.023 * x - 0.061 * y + 0.043 * z + i * 2.9));
const hash = (x: number, y: number, z: number) => {
  const h = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return h - Math.floor(h);
};
function sketch(arr: ArrayLike<number>): number[] {
  // directions leaving each segment end, to tell corners from ends that carry straight on
  const key = (i: number) => `${Math.round(arr[i])},${Math.round(arr[i + 1])},${Math.round(arr[i + 2])}`;
  const dirs = new Map<string, THREE.Vector3[]>();
  const away = (i: number, j: number) =>
    new THREE.Vector3(arr[j] - arr[i], arr[j + 1] - arr[i + 1], arr[j + 2] - arr[i + 2]).normalize();
  const note = (i: number, d: THREE.Vector3) => {
    const k = key(i);
    if (!dirs.has(k)) dirs.set(k, []);
    dirs.get(k)!.push(d);
  };
  for (let i = 0; i < arr.length; i += 6) {
    note(i, away(i, i + 3));
    note(i + 3, away(i + 3, i));
  }
  const corner = (i: number, d: THREE.Vector3) => !dirs.get(key(i))!.some((e) => e.dot(d) < -0.9);
  const out: number[] = [];
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const p = new THREE.Vector3();
  const push = (v: THREE.Vector3) => out.push(v.x + wob(v.x, v.y, v.z, 0), v.y + wob(v.x, v.y, v.z, 1), v.z + wob(v.x, v.y, v.z, 2));
  for (let i = 0; i < arr.length; i += 6) {
    a.set(arr[i], arr[i + 1], arr[i + 2]);
    b.set(arr[i + 3], arr[i + 4], arr[i + 5]);
    const len = a.distanceTo(b);
    if (len > 14) {
      const u = b.clone().sub(a).divideScalar(len);
      const run = (v: THREE.Vector3) => Math.min(len * 0.08, 1.5 + hash(v.x, v.y, v.z) * 3);
      if (corner(i, u)) a.addScaledVector(u, -run(a));
      if (corner(i + 3, u.clone().negate())) b.addScaledVector(u, run(b));
    }
    const n = Math.max(1, Math.ceil(a.distanceTo(b) / STEP));
    for (let k = 0; k < n; k++) {
      push(p.lerpVectors(a, b, k / n));
      push(p.lerpVectors(a, b, (k + 1) / n));
    }
  }
  return out;
}

export function createKit(colors: Palette): Kit {
  const lineMats: LineMaterial[] = [];
  const lineMat = (opts: LineMaterialParameters = {}) => {
    const m = new LineMaterial({ color: colors.ink.getHex(), linewidth: 2, ...opts });
    lineMats.push(m);
    return m;
  };
  const fillMat = () =>
    new THREE.MeshBasicMaterial({
      color: colors.paper.clone(),
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      // pushed back about 2 units, so a wobbling line that dips into its own face still shows
      polygonOffsetUnits: 4000,
    });

  const heavy = lineMat({ linewidth: 2.8 });
  const ink = lineMat({ linewidth: 1.8 });
  const fine = lineMat({ linewidth: 1.3 });
  const detail = lineMat({ linewidth: 1.1, transparent: true, opacity: 0.5 });
  const paper = fillMat();

  const segs = (arr: number[], mat: LineMaterial) => {
    const g = new LineSegmentsGeometry();
    g.setPositions(sketch(arr));
    return new LineSegments2(g, mat);
  };

  return {
    colors,
    lineMats,
    heavy,
    ink,
    fine,
    detail,
    paper,
    lineMat,
    fillMat,
    segs,
    part(geom, fill = paper, mat = ink, thr = 30) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(geom, fill));
      g.add(segs(Array.from(new THREE.EdgesGeometry(geom, thr).attributes.position.array), mat));
      return g;
    },
    circle(r, mat, z = 0, seg = 56) {
      const p: number[] = [];
      for (let i = 0; i < seg; i++) {
        const a = (i / seg) * Math.PI * 2;
        const b = ((i + 1) / seg) * Math.PI * 2;
        p.push(Math.cos(a) * r, Math.sin(a) * r, z, Math.cos(b) * r, Math.sin(b) * r, z);
      }
      return segs(p, mat);
    },
    disc(r, h) {
      const g = new THREE.CylinderGeometry(r, r, h, 40);
      g.rotateX(Math.PI / 2);
      return g;
    },
  };
}
