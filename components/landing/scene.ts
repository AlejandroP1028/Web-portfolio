import * as THREE from "three";
import type { LineMaterial } from "three/addons/lines/LineMaterial.js";
import type { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { createKit, type Kit, type Palette } from "./kit";
import { buildController } from "./controller";

export type Side = "work" | "learning" | "fun";

/**
 * Values the page's GSAP timelines tween; the scene reads them every frame.
 * lapDraw / ctlDraw: 0..1 share of each object's lines drawn (the intro draws them in).
 * flash: 0..1 extra glow on the controller's rings. press: the object being opened
 * (it turns to face you while its colour fills the screen).
 */
export type AnimState = { lapDraw: number; ctlDraw: number; flash: number; press: Side | null };

/** Where an object's door sits on screen, in viewport px. */
export type Target = { x: number; y: number; w: number; h: number };

type Placed = { root: THREE.Group; pivot: THREE.Group; size: THREE.Vector3; fit: number };

/** Every line in a model, in build order, so a share of them can be drawn. */
function linesOf(model: THREE.Object3D) {
  const list: { g: THREE.InstancedBufferGeometry; n: number }[] = [];
  model.traverse((o) => {
    if ((o as LineSegments2).isLineSegments2) {
      const g = (o as LineSegments2).geometry as unknown as THREE.InstancedBufferGeometry;
      list.push({ g, n: g.attributes.instanceStart.count });
    }
  });
  return { list, total: list.reduce((s, l) => s + l.n, 0), last: -1 };
}
function draw(lines: ReturnType<typeof linesOf>, p: number) {
  const budget = Math.round(Math.min(1, Math.max(0, p)) * lines.total);
  if (budget === lines.last) return;
  lines.last = budget;
  let left = budget;
  for (const l of lines.list) {
    l.g.instanceCount = Math.min(l.n, left);
    left -= l.g.instanceCount;
  }
}

/** Laptop from boxes: base with keyboard and trackpad, lid on a hinge, screen. */
function buildLaptop(kit: Kit) {
  const { part, segs, heavy, ink, fine, detail, fillMat, colors } = kit;
  const model = new THREE.Group();
  // pen weights: the body (base and lid) heaviest, then the screen, then the keyboard and
  // trackpad, and the key grid finest
  const base = part(new THREE.BoxGeometry(300, 12, 200), undefined, heavy);
  base.position.y = -6;
  model.add(base);
  const kb = part(new THREE.BoxGeometry(262, 2, 104), undefined, fine);
  kb.position.set(0, 1, -38);
  model.add(kb);
  const keys: number[] = [];
  const [x0, z0, kw, kd] = [-131, -90, 262, 104];
  for (let r = 1; r < 5; r++) keys.push(x0, 2.2, z0 + (r * kd) / 5, x0 + kw, 2.2, z0 + (r * kd) / 5);
  for (let c = 1; c < 13; c++) keys.push(x0 + (c * kw) / 13, 2.2, z0, x0 + (c * kw) / 13, 2.2, z0 + kd);
  model.add(segs(keys, detail));
  const pad = part(new THREE.BoxGeometry(96, 2, 56), undefined, fine);
  pad.position.set(0, 1, 52);
  model.add(pad);

  const hinge = new THREE.Group();
  hinge.position.set(0, 0, -100);
  model.add(hinge);
  const lid = new THREE.BoxGeometry(300, 200, 10);
  lid.translate(0, 100, -5);
  hinge.add(part(lid, undefined, heavy));
  const screenMat = fillMat();
  screenMat.polygonOffsetFactor = 0.5;
  const screen = new THREE.PlaneGeometry(270, 168);
  screen.translate(0, 104, 0.6);
  const screenPart = part(screen, screenMat, ink);
  hinge.add(screenPart);
  const screenMesh = screenPart.children[0] as THREE.Mesh;
  const barMats = (
    [
      [190, 150],
      [150, 122],
      [210, 94],
    ] as const
  ).map(([w, y]) => {
    const m = new THREE.MeshBasicMaterial({ color: colors.bar.clone(), transparent: true, opacity: 0, depthWrite: false });
    const g = new THREE.PlaneGeometry(w, 14);
    g.translate(-(210 - w) / 2, y, 1.4);
    hinge.add(new THREE.Mesh(g, m));
    return m;
  });
  hinge.rotation.x = -0.2;
  return { model, hinge, screenMat, screenMesh, barMats };
}

/** Wrap a model so it rotates about its own centre. */
function mount(scene: THREE.Scene, model: THREE.Group): Placed {
  const root = new THREE.Group();
  const pivot = new THREE.Group();
  root.add(pivot);
  pivot.add(model);
  const box = new THREE.Box3().setFromObject(model);
  model.position.sub(box.getCenter(new THREE.Vector3()));
  scene.add(root);
  return { root, pivot, size: box.getSize(new THREE.Vector3()), fit: 1 };
}

function readPalette(el: HTMLElement): Palette {
  const cs = getComputedStyle(el);
  const c = (n: string) => new THREE.Color(cs.getPropertyValue(n).trim() || "#000");
  return { ink: c("--ink"), paper: c("--paper"), work: c("--work"), fun: c("--fun"), bar: c("--screen-bar") };
}

/**
 * The landing row's 3D layer: one canvas behind the three links. Objects sit on the
 * centre of their link's stage, so the row and the stacked phone layout both work.
 * Throws if WebGL is unavailable; the caller shows the flat drawings instead.
 */
export function createLandingScene(opts: {
  canvas: HTMLCanvasElement;
  row: HTMLElement;
  stageWork: HTMLElement;
  stageFun: HTMLElement;
  tokens: HTMLElement;
  anim: AnimState;
}) {
  const { canvas, row, stageWork, stageFun, tokens, anim } = opts;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -4000, 4000);
  camera.position.z = 2000;

  const kit = createKit(readPalette(tokens));
  const C = kit.colors;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const laptop = buildLaptop(kit);
  const lap = mount(scene, laptop.model);
  const controller = buildController(kit);
  const ctl = mount(scene, controller.model);
  const glow = new Set<LineMaterial>(controller.glowMats);
  const lapLines = linesOf(laptop.model);
  const ctlLines = linesOf(controller.model);
  // the controller's door: its orange home button (radius 11, front face 2 units out)
  const HOME_R = 11;
  controller.homeMat.transparent = true; // fades in as the intro finishes drawing the controller
  const homeFront = () => controller.home.localToWorld(new THREE.Vector3(0, 0, 2));

  // layout: the canvas covers the viewport (so the camera dive isn't cropped to the row);
  // each object follows its link's stage, including while the page scrolls
  let W = 1;
  let H = 1;
  const place = (o: Placed, stage: HTMLElement) => {
    const s = stage.getBoundingClientRect();
    o.root.position.set(s.left + s.width / 2 - W / 2, -(s.top + s.height / 2 - H / 2), 0);
    o.fit = Math.min(s.width / o.size.x, s.height / o.size.y) * 0.8;
  };
  const layout = () => {
    W = Math.max(1, window.innerWidth);
    H = Math.max(1, window.innerHeight);
    renderer.setSize(W, H, false);
    Object.assign(camera, { left: -W / 2, right: W / 2, top: H / 2, bottom: -H / 2 });
    camera.updateProjectionMatrix();
    kit.lineMats.forEach((m) => m.resolution.set(W, H));
  };
  const ro = new ResizeObserver(layout);
  ro.observe(row);
  window.addEventListener("resize", layout);
  layout();

  // theme
  const dark = window.matchMedia("(prefers-color-scheme: dark)");
  const retheme = () => {
    Object.assign(C, readPalette(tokens));
    kit.paper.color.copy(C.paper);
    controller.homeMat.color.copy(C.fun);
    kit.lineMats.forEach((m) => m.color.copy(glow.has(m) ? C.fun : C.ink));
    // draw the new colours now, not next frame: a theme switch snapshots the page right away
    cancelAnimationFrame(raf);
    frame(performance.now());
  };
  dark.addEventListener("change", retheme);
  // the theme picker sets <html data-theme>; re-read the colours when it changes
  const themeObserver = new MutationObserver(retheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // input
  let hover: Side | null = null;
  const ptr = { x: 0, y: 0 };
  const onMove = (e: PointerEvent) => {
    ptr.x = (e.clientX / window.innerWidth) * 2 - 1;
    ptr.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener("pointermove", onMove);

  // animation
  const st = { lYaw: 0.35, lPitch: 0.42, lid: 0.2, scr: 0, cYaw: -0.26, cPitch: -0.06, roll: -0.04, glow: 0 };
  const lit = [0, 0, 0, 0];
  const tmp = new THREE.Color();
  const t0 = performance.now();
  let last = t0;
  let raf = 0;

  // world point → viewport px (the camera never moves: one world unit is one CSS px)
  const toView = (v: THREE.Vector3) => ({ x: W / 2 + v.x, y: H / 2 - v.y });
  const v3 = new THREE.Vector3();
  /** The door of an object on screen: the laptop's screen, or the controller's home button. */
  const target = (side: "work" | "fun"): Target | null => {
    scene.updateMatrixWorld();
    if (side === "work") {
      const g = laptop.screenMesh.geometry;
      g.computeBoundingBox();
      const b = g.boundingBox!;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const x of [b.min.x, b.max.x])
        for (const y of [b.min.y, b.max.y]) {
          const p = toView(v3.set(x, y, b.max.z).applyMatrix4(laptop.screenMesh.matrixWorld));
          x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y);
        }
      return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    }
    const c = toView(homeFront());
    const r = HOME_R * controller.home.getWorldScale(new THREE.Vector3()).x;
    return { x: c.x - r, y: c.y - r, w: 2 * r, h: 2 * r };
  };

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = (now - t0) / 1000;
    const rm = reduce.matches;
    const k = rm ? 1 : 1 - Math.exp(-dt * 7);
    const px = rm ? 0 : ptr.x;
    const py = rm ? 0 : ptr.y;

    place(lap, stageWork);
    place(ctl, stageFun);
    draw(lapLines, anim.lapDraw);
    draw(ctlLines, anim.ctlDraw);
    controller.homeMat.opacity = Math.min(1, Math.max(0, (anim.ctlDraw - 0.7) / 0.3));

    // laptop: turns to face you, lid opens, screen lights up
    const pw = anim.press === "work";
    const hw = hover === "work" || pw;
    st.lYaw += ((pw ? 0 : hw ? px * 0.1 : 0.35 + (rm ? 0 : Math.sin(t * 0.6) * 0.06) + px * 0.12) - st.lYaw) * k;
    st.lPitch += ((pw ? 0.3 : 0.42 - py * 0.06) - st.lPitch) * k;
    st.lid += ((pw ? 0.5 : hw ? 0.36 : 0.2) - st.lid) * k;
    st.scr += ((hw ? 1 : 0) - st.scr) * k;
    lap.pivot.rotation.set(st.lPitch, st.lYaw, 0);
    laptop.hinge.rotation.x = -st.lid;
    laptop.screenMat.color.copy(C.paper).lerp(C.work, st.scr);
    laptop.barMats.forEach((m, i) => {
      m.color.copy(C.bar);
      m.opacity = st.scr * (rm ? 0.7 : 0.45 + 0.3 * Math.sin(t * 2.4 + i * 1.3));
    });
    lap.root.scale.setScalar(lap.fit);

    // controller: turns to the cursor, rings glow, face buttons light in turn
    const pf = anim.press === "fun";
    const hf = hover === "fun" || pf;
    st.cYaw += ((pf ? 0 : hf ? px * 0.32 : -0.26 + (rm ? 0 : Math.sin(t * 0.5 + 1) * 0.05) + px * 0.1) - st.cYaw) * k;
    st.cPitch += ((pf ? 0.22 : hf ? -py * 0.14 : -0.06 + (rm ? 0 : Math.sin(t * 0.7) * 0.02)) - st.cPitch) * k;
    st.roll += ((hf ? 0 : -0.04) - st.roll) * k;
    st.glow += ((hf ? 1 : 0) - st.glow) * k;
    ctl.pivot.rotation.set(st.cPitch, st.cYaw, st.roll);
    const g = Math.max(st.glow, anim.flash);
    controller.ringMats.forEach((m) => m.color.copy(C.ink).lerp(C.fun, g));
    controller.glowMats.forEach((m) => (m.opacity = g * 0.38));
    const phase = (t % 2.5) / 2.5;
    const kb = rm ? 1 : 1 - Math.exp(-dt * 14);
    controller.abxyMats.forEach((m, i) => {
      const on = hf && (rm || (phase >= i * 0.15 && phase < i * 0.15 + 0.2)) ? 1 : 0;
      lit[i] += (on - lit[i]) * kb;
      m.color.copy(C.paper).lerp(tmp.copy(C.fun), lit[i]);
    });
    ctl.root.scale.setScalar(ctl.fit);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return {
    setHover(side: Side | null) {
      hover = side;
    },
    target,
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", layout);
      dark.removeEventListener("change", retheme);
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
      });
      renderer.dispose();
    },
  };
}
