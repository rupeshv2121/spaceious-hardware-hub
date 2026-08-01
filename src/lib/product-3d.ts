/**
 * Procedural 3D models for the Space-ious catalogue.
 *
 * Every product is built from primitives at render time rather than loaded from
 * a .glb file — the catalogue is ~30 SKUs of boxes, cylinders and lathed
 * profiles, so generating them costs a few kilobytes of code instead of a few
 * megabytes of binary assets, and a new SKU only needs a builder function.
 *
 * Conventions for builders:
 *   - Build around the origin; `fitToUnitBox` rescales and recentres afterwards.
 *   - Y is up. The camera starts on +Z, so the "face" of a product looks at +Z.
 *   - Take materials from the passed `Palette` so the finish switcher works.
 */
import * as THREE from "three";
import { finishSpec } from "./finishes";

/* ------------------------------------------------------------------ finishes */

/** Materials a builder can draw on. `metal` follows the selected finish. */
export type Palette = {
  metal: THREE.Material;
  /** Darker companion metal — screws, pins, mechanism internals. */
  dark: THREE.Material;
  /** Bright companion metal — keyways, springs, bearing rings. */
  bright: THREE.Material;
  glass: THREE.Material;
  wood: THREE.Material;
  rubber: THREE.Material;
};

export function createPalette(finish: string): Palette {
  const spec = finishSpec(finish);
  return {
    metal: new THREE.MeshStandardMaterial({
      color: spec.color,
      metalness: spec.metalness,
      roughness: spec.roughness,
    }),
    dark: new THREE.MeshStandardMaterial({
      color: 0x4a4d52,
      metalness: 0.9,
      roughness: 0.55,
    }),
    bright: new THREE.MeshStandardMaterial({
      color: 0xdfe4e8,
      metalness: 1,
      roughness: 0.16,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xdfeef2,
      metalness: 0,
      roughness: 0.04,
      transmission: 0.92,
      thickness: 0.4,
      ior: 1.52,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
    }),
    wood: new THREE.MeshStandardMaterial({
      color: 0xa9805a,
      metalness: 0,
      roughness: 0.78,
    }),
    rubber: new THREE.MeshStandardMaterial({
      color: 0x1f2023,
      metalness: 0,
      roughness: 0.92,
    }),
  };
}

export function disposePalette(palette: Palette) {
  Object.values(palette).forEach((m) => m.dispose());
}

/* ----------------------------------------------------------------- primitives */

type Place = {
  x?: number;
  y?: number;
  z?: number;
  rx?: number;
  ry?: number;
  rz?: number;
};

const DEG = Math.PI / 180;

function part(geometry: THREE.BufferGeometry, material: THREE.Material, at: Place = {}) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(at.x ?? 0, at.y ?? 0, at.z ?? 0);
  mesh.rotation.set(at.rx ?? 0, at.ry ?? 0, at.rz ?? 0);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/** A rounded rectangle, used as the profile for plates and lock cases. */
function roundedRect(w: number, h: number, r: number) {
  const radius = Math.max(Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4), 0);
  const x = -w / 2;
  const y = -h / 2;
  const s = new THREE.Shape();
  s.moveTo(x + radius, y);
  s.lineTo(x + w - radius, y);
  s.quadraticCurveTo(x + w, y, x + w, y + radius);
  s.lineTo(x + w, y + h - radius);
  s.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  s.lineTo(x + radius, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - radius);
  s.lineTo(x, y + radius);
  s.quadraticCurveTo(x, y, x + radius, y);
  return s;
}

/**
 * Bevelled slab in the XY plane, extruded along Z. Preferred over BoxGeometry
 * for anything the camera gets close to — the bevel catches the key light and
 * is most of what makes these read as machined metal rather than as blocks.
 */
function slab(w: number, h: number, d: number, r = 0.06, bevel = 0.012) {
  const b = Math.min(bevel, d / 2.5);
  const g = new THREE.ExtrudeGeometry(roundedRect(w, h, r), {
    depth: Math.max(d - b * 2, 1e-3),
    bevelEnabled: true,
    bevelSize: b,
    bevelThickness: b,
    bevelSegments: 2,
    curveSegments: 14,
  });
  g.center();
  return g;
}

/** Cylinder along Y. */
const rod = (radius: number, height: number, segments = 32) =>
  new THREE.CylinderGeometry(radius, radius, height, segments);

const cone = (top: number, bottom: number, height: number, segments = 32) =>
  new THREE.CylinderGeometry(top, bottom, height, segments);

const ball = (radius: number, segments = 28) =>
  new THREE.SphereGeometry(radius, segments, Math.max(12, segments / 2));

const ring = (radius: number, tube: number, arc = Math.PI * 2) =>
  new THREE.TorusGeometry(radius, tube, 18, 48, arc);

const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);

/** Surface of revolution from an [x, y] profile, spun around Y. */
const lathe = (profile: [number, number][], segments = 40) =>
  new THREE.LatheGeometry(
    profile.map(([x, y]) => new THREE.Vector2(x, y)),
    segments,
  );

/** Swept tube through a smooth curve — levers, pull handles, closer arms. */
function sweep(points: [number, number, number][], radius: number, segments = 72) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    "catmullrom",
    0.4,
  );
  return new THREE.TubeGeometry(curve, segments, radius, 20, false);
}

/** Countersunk screw, sunk into a leaf or plate lying in the XY plane. */
function screw(palette: Palette, at: Place, radius = 0.055) {
  const g = new THREE.Group();
  g.add(part(cone(radius, radius * 0.55, radius * 0.9, 20), palette.dark, { rx: 90 * DEG }));
  g.add(
    part(box(radius * 1.5, radius * 0.16, radius * 0.16), palette.dark, {
      z: radius * 0.5,
      rx: 90 * DEG,
    }),
  );
  const holder = new THREE.Group();
  holder.add(g);
  holder.position.set(at.x ?? 0, at.y ?? 0, at.z ?? 0);
  return holder;
}

const group = (...children: THREE.Object3D[]) => {
  const g = new THREE.Group();
  children.forEach((c) => g.add(c));
  return g;
};

/* --------------------------------------------------------- shared sub-models */

/** Round rose + neck, the mount shared by every lever and knob. */
function roseAssembly(p: Palette, radius = 0.55) {
  return group(
    part(
      lathe([
        [0, 0],
        [radius, 0],
        [radius, 0.08],
        [radius * 0.93, 0.14],
        [radius * 0.55, 0.17],
        [0, 0.17],
      ]),
      p.metal,
      { rx: -90 * DEG },
    ),
    part(cone(0.19, 0.23, 0.22, 28), p.metal, { z: 0.27, rx: 90 * DEG }),
  );
}

/** Butt-hinge knuckle: interleaved barrels around a single pin. */
function knuckle(p: Palette, height: number, radius: number, count = 5) {
  const g = new THREE.Group();
  const seg = height / count;
  for (let i = 0; i < count; i++) {
    g.add(part(rod(radius, seg * 0.94, 26), p.metal, { y: -height / 2 + seg * (i + 0.5) }));
  }
  g.add(part(rod(radius * 0.42, height * 1.06, 20), p.dark, {}));
  g.add(part(ball(radius * 0.5), p.metal, { y: (height / 2) * 1.06 }));
  g.add(part(ball(radius * 0.5), p.metal, { y: (-height / 2) * 1.06 }));
  return g;
}

/** Toughened glass pane in the XY plane, for the glass-fittings models. */
const pane = (p: Palette, w: number, h: number, t = 0.06) => part(box(w, h, t), p.glass);

/* ------------------------------------------------------------------ builders */

export type Builder = (p: Palette) => THREE.Object3D;

/* -- Locks ----------------------------------------------------------------- */

const mortiseLock: Builder = (p) =>
  group(
    // Case
    part(slab(1.5, 2.1, 0.34, 0.09), p.metal),
    // Faceplate down the leading edge, standing proud of the case
    part(slab(0.2, 2.55, 0.5, 0.07), p.metal, { x: -0.79 }),
    screw(p, { x: -0.79, y: 1.06, z: 0.26 }),
    screw(p, { x: -0.79, y: -1.06, z: 0.26 }),
    // Latch bolt (chamfered) and square deadbolt
    part(cone(0.11, 0.15, 0.3, 24), p.bright, { x: -0.99, y: 0.62, rz: 90 * DEG }),
    part(box(0.34, 0.42, 0.2), p.bright, { x: -0.95, y: -0.42 }),
    // Euro cylinder through the case
    part(rod(0.27, 0.42, 32), p.metal, { y: -0.42, rx: 90 * DEG }),
    part(box(0.1, 0.34, 0.44), p.dark, { y: -0.6 }),
    // Spindle hub + follower
    part(rod(0.23, 0.44, 32), p.metal, { y: 0.5, rx: 90 * DEG }),
    part(box(0.13, 0.13, 0.6), p.dark, { y: 0.5, rz: 45 * DEG }),
    // Anti-drill plate
    part(slab(0.9, 0.5, 0.06, 0.06), p.dark, { y: 0.02, z: 0.18 }),
  );

const cylindricalLock: Builder = (p) =>
  group(
    part(rod(0.62, 0.16, 40), p.metal, { z: 0.5, rx: 90 * DEG }),
    part(rod(0.62, 0.16, 40), p.metal, { z: -0.5, rx: 90 * DEG }),
    part(rod(0.17, 1.1, 28), p.dark, { rx: 90 * DEG }),
    // Knobs either side
    part(
      lathe([
        [0, 0],
        [0.32, 0.02],
        [0.44, 0.16],
        [0.42, 0.38],
        [0.26, 0.5],
        [0, 0.54],
      ]),
      p.metal,
      { z: 0.62, rx: 90 * DEG },
    ),
    part(
      lathe([
        [0, 0],
        [0.32, 0.02],
        [0.44, 0.16],
        [0.42, 0.38],
        [0.26, 0.5],
        [0, 0.54],
      ]),
      p.metal,
      { z: -0.62, rx: -90 * DEG },
    ),
    // Keyway in the outside knob
    part(box(0.07, 0.2, 0.05), p.dark, { z: 1.17 }),
    // Latch tube running to the door edge
    part(rod(0.16, 0.9, 24), p.metal, { x: -0.62, rz: 90 * DEG }),
    part(slab(0.14, 0.66, 0.34, 0.05), p.metal, { x: -1.08 }),
    part(cone(0.1, 0.13, 0.22, 20), p.bright, { x: -1.24, rz: 90 * DEG }),
  );

const rimLatch: Builder = (p) =>
  group(
    part(slab(1.5, 1.7, 0.55, 0.1), p.metal),
    part(slab(1.24, 1.44, 0.06, 0.08), p.dark, { z: 0.3 }),
    screw(p, { x: -0.58, y: 0.66, z: 0.29 }),
    screw(p, { x: 0.58, y: 0.66, z: 0.29 }),
    screw(p, { x: -0.58, y: -0.66, z: 0.29 }),
    screw(p, { x: 0.58, y: -0.66, z: 0.29 }),
    // Thumb turn
    part(rod(0.3, 0.12, 32), p.metal, { y: 0.34, z: 0.34, rx: 90 * DEG }),
    part(box(0.16, 0.5, 0.14), p.metal, { y: 0.34, z: 0.5 }),
    // Deadlocking bolts into the striker
    part(box(0.3, 0.24, 0.3), p.bright, { x: -0.88, y: -0.3 }),
    part(box(0.3, 0.24, 0.3), p.bright, { x: -0.88, y: -0.66 }),
    part(slab(0.9, 1.0, 0.34, 0.08), p.metal, { x: -1.32, y: -0.48 }),
  );

const camLock: Builder = (p) =>
  group(
    part(rod(0.34, 1.0, 36), p.metal, { rx: 90 * DEG }),
    // Bezel + keyway
    part(cone(0.44, 0.4, 0.14, 36), p.metal, { z: 0.56, rx: 90 * DEG }),
    part(rod(0.3, 0.06, 32), p.dark, { z: 0.64, rx: 90 * DEG }),
    part(box(0.07, 0.22, 0.05), p.dark, { z: 0.68 }),
    // Retaining nut + cam plate at the back
    part(new THREE.CylinderGeometry(0.42, 0.42, 0.16, 6), p.dark, { z: -0.4, rx: 90 * DEG }),
    part(slab(0.3, 0.95, 0.07, 0.14), p.bright, { y: -0.38, z: -0.56 }),
  );

/* -- Handles & knobs ------------------------------------------------------- */

const leverHandle: Builder = (p) =>
  group(
    roseAssembly(p),
    part(
      sweep(
        [
          [0, 0, 0.34],
          [0, 0.02, 0.3],
          [0.42, 0.04, 0.28],
          [0.9, 0.02, 0.24],
          [1.24, -0.1, 0.18],
          [1.38, -0.3, 0.12],
        ],
        0.115,
      ),
      p.metal,
    ),
    part(ball(0.12), p.metal, { x: 1.38, y: -0.3, z: 0.12 }),
  );

const pullHandle: Builder = (p) =>
  group(
    part(
      sweep(
        [
          [-0.05, -1.15, 0],
          [0.34, -1.05, 0],
          [0.46, -0.72, 0],
          [0.46, 0.72, 0],
          [0.34, 1.05, 0],
          [-0.05, 1.15, 0],
        ],
        0.13,
      ),
      p.metal,
    ),
    // Back-to-back fixing bosses
    part(rod(0.2, 0.2, 28), p.metal, { x: -0.12, y: 1.15, rz: 90 * DEG }),
    part(rod(0.2, 0.2, 28), p.metal, { x: -0.12, y: -1.15, rz: 90 * DEG }),
    part(rod(0.26, 0.07, 28), p.dark, { x: -0.24, y: 1.15, rz: 90 * DEG }),
    part(rod(0.26, 0.07, 28), p.dark, { x: -0.24, y: -1.15, rz: 90 * DEG }),
  );

const roundKnob: Builder = (p) =>
  group(
    part(
      lathe([
        [0, 0],
        [0.6, 0],
        [0.6, 0.1],
        [0.34, 0.18],
        [0.26, 0.34],
        [0.46, 0.5],
        [0.56, 0.74],
        [0.44, 0.96],
        [0.2, 1.06],
        [0, 1.08],
      ]),
      p.metal,
      { y: -0.55 },
    ),
    // Decorative bead where the shank meets the ball
    part(ring(0.3, 0.045), p.metal, { y: -0.19, rx: 90 * DEG }),
  );

const squareLever: Builder = (p) =>
  group(
    part(slab(1.05, 1.05, 0.17, 0.05), p.metal),
    part(box(0.34, 0.34, 0.26), p.metal, { z: 0.2 }),
    part(box(0.28, 0.28, 1.5), p.metal, { x: 0.62, z: 0.3, ry: 90 * DEG }),
    part(box(0.26, 0.26, 0.52), p.metal, { x: 1.32, y: -0.16, rx: 22 * DEG, ry: 90 * DEG }),
    part(slab(0.26, 0.26, 0.26, 0.05), p.metal, { x: 1.42, y: -0.42 }),
  );

/* -- Aldrops & bolts ------------------------------------------------------- */

const heavyAldrop: Builder = (p) => {
  const bracket = (x: number) =>
    group(
      part(slab(0.42, 0.72, 0.16, 0.08), p.metal, { x, y: -0.34 }),
      part(box(0.38, 0.16, 0.5), p.metal, { x, y: 0.06, z: 0.22 }),
      part(box(0.38, 0.44, 0.14), p.metal, { x, y: 0.28, z: 0.4 }),
      part(box(0.38, 0.16, 0.5), p.metal, { x, y: 0.5, z: 0.22 }),
      screw(p, { x, y: -0.56, z: 0.1 }),
    );
  return group(
    // Baton
    part(rod(0.15, 2.6, 32), p.metal, { y: 0.28, z: 0.32, rz: 90 * DEG }),
    part(ball(0.21), p.metal, { x: 1.36, y: 0.28, z: 0.32 }),
    part(ring(0.17, 0.05), p.metal, { x: 1.1, y: 0.28, z: 0.32, ry: 90 * DEG }),
    bracket(-0.55),
    bracket(0.45),
    // Hasp / staple the baton drops behind
    part(slab(0.5, 1.0, 0.16, 0.08), p.metal, { x: -1.35, y: -0.2 }),
    part(ring(0.28, 0.075, Math.PI), p.metal, { x: -1.35, y: 0.28, z: 0.16, rx: 90 * DEG }),
    screw(p, { x: -1.35, y: -0.5, z: 0.1 }),
  );
};

const towerBolt: Builder = (p) =>
  group(
    part(slab(0.62, 2.6, 0.14, 0.1), p.metal),
    screw(p, { y: 1.12, z: 0.09 }),
    screw(p, { y: -1.12, z: 0.09 }),
    // Guides the shaft slides through
    part(box(0.56, 0.2, 0.42), p.metal, { y: 0.72, z: 0.2 }),
    part(box(0.56, 0.2, 0.42), p.metal, { y: -0.72, z: 0.2 }),
    // Shaft + thumb knob riding in the slot
    part(rod(0.12, 2.2, 28), p.metal, { y: -0.1, z: 0.3 }),
    part(cone(0.1, 0.14, 0.2, 24), p.bright, { y: -1.28, z: 0.3 }),
    part(rod(0.08, 0.3, 20), p.metal, { y: 0.28, z: 0.48, rx: 90 * DEG }),
    part(ball(0.16), p.metal, { y: 0.28, z: 0.66 }),
  );

const babyLatch: Builder = (p) =>
  group(
    part(slab(1.5, 0.8, 0.14, 0.1), p.metal),
    part(box(0.7, 0.44, 0.34), p.metal, { x: 0.1, z: 0.2 }),
    part(rod(0.1, 0.7, 24), p.metal, { x: -0.62, z: 0.24, rz: 90 * DEG }),
    part(cone(0.1, 0.16, 0.22, 22), p.bright, { x: -1.02, z: 0.24, rz: 90 * DEG }),
    part(box(0.1, 0.26, 0.12), p.metal, { x: 0.42, y: 0.32, z: 0.24 }),
    screw(p, { x: 0.62, y: -0.22, z: 0.09 }),
    screw(p, { x: -0.32, y: -0.22, z: 0.09 }),
  );

const slidingBolt: Builder = (p) =>
  group(
    part(slab(1.0, 2.3, 0.16, 0.08), p.metal),
    part(box(0.9, 0.3, 0.46), p.metal, { y: 0.78, z: 0.22 }),
    part(box(0.9, 0.3, 0.46), p.metal, { y: -0.5, z: 0.22 }),
    part(box(0.34, 2.5, 0.24), p.dark, { y: -0.1, z: 0.3 }),
    part(box(0.2, 0.5, 0.16), p.metal, { x: 0.3, y: 0.16, z: 0.42, rz: -35 * DEG }),
    part(ball(0.17), p.metal, { x: 0.44, y: 0.34, z: 0.5 }),
    screw(p, { x: -0.3, y: 1.02, z: 0.1 }),
    screw(p, { x: 0.3, y: -1.02, z: 0.1 }),
  );

/* -- Door kits ------------------------------------------------------------- */

/** A cropped door leaf, so kit contents read at the right scale against it. */
const doorLeaf = (p: Palette, w = 1.9, h = 3.0) =>
  group(
    part(box(w, h, 0.3), p.wood),
    part(slab(w * 0.78, h * 0.42, 0.03, 0.04), p.wood, { y: h * 0.24, z: 0.16 }),
    part(slab(w * 0.78, h * 0.42, 0.03, 0.04), p.wood, { y: -h * 0.24, z: 0.16 }),
  );

const essentialKit: Builder = (p) =>
  group(
    doorLeaf(p),
    // Lever set on the leading stile
    group(
      roseAssembly(p, 0.4),
      part(
        sweep(
          [
            [0, 0, 0.26],
            [0.3, 0.02, 0.24],
            [0.66, -0.02, 0.2],
            [0.86, -0.18, 0.14],
          ],
          0.085,
        ),
        p.metal,
      ),
    )
      .translateX(-0.62)
      .translateZ(0.15),
    // Mortise case sunk into the edge
    part(slab(0.16, 1.0, 0.28, 0.04), p.metal, { x: -0.96, y: 0.02 }),
    // Tower bolt higher up
    part(slab(0.3, 1.0, 0.08, 0.06), p.metal, { x: -0.62, y: 1.12, z: 0.16 }),
    part(rod(0.06, 0.86, 18), p.metal, { x: -0.62, y: 1.12, z: 0.22 }),
    part(ball(0.08), p.metal, { x: -0.62, y: 1.28, z: 0.3 }),
    // Hinges on the hanging stile
    part(slab(0.5, 0.72, 0.07, 0.03), p.metal, { x: 0.9, y: 0.95, z: 0.16 }),
    part(rod(0.075, 0.72, 18), p.metal, { x: 1.14, y: 0.95, z: 0.16 }),
    part(slab(0.5, 0.72, 0.07, 0.03), p.metal, { x: 0.9, y: -0.95, z: 0.16 }),
    part(rod(0.075, 0.72, 18), p.metal, { x: 1.14, y: -0.95, z: 0.16 }),
    // Floor stopper
    part(cone(0.16, 0.22, 0.16, 24), p.metal, { x: -0.3, y: -1.66, z: 0.3, rx: 90 * DEG }),
  );

const brassSignatureSet: Builder = (p) =>
  group(
    doorLeaf(p, 2.0, 3.0),
    group(
      part(
        lathe([
          [0, 0],
          [0.4, 0],
          [0.4, 0.07],
          [0.22, 0.13],
          [0, 0.14],
        ]),
        p.metal,
        { rx: -90 * DEG },
      ),
      part(
        sweep(
          [
            [0, 0, 0.2],
            [0.34, 0.03, 0.19],
            [0.74, 0, 0.16],
            [0.96, -0.16, 0.11],
          ],
          0.09,
        ),
        p.metal,
      ),
    )
      .translateX(-0.66)
      .translateZ(0.15),
    // Long back-plate escutcheon, the "signature" of the set
    part(slab(0.44, 1.9, 0.06, 0.16), p.metal, { x: -0.66, y: -0.1, z: 0.15 }),
    part(rod(0.13, 0.1, 26), p.dark, { x: -0.66, y: -0.72, z: 0.2, rx: 90 * DEG }),
    part(slab(0.5, 0.8, 0.06, 0.04), p.metal, { x: 0.94, y: 1.0, z: 0.16 }),
    part(slab(0.5, 0.8, 0.06, 0.04), p.metal, { x: 0.94, y: -1.0, z: 0.16 }),
    part(ring(0.24, 0.05), p.metal, { x: -0.66, y: 0.62, z: 0.2, rx: 90 * DEG }),
  );

const shutterKit: Builder = (p) => {
  const g = new THREE.Group();
  // Rolling shutter slats
  for (let i = 0; i < 9; i++) {
    g.add(part(slab(3.0, 0.3, 0.14, 0.07), p.dark, { y: 1.3 - i * 0.32 }));
  }
  g.add(part(box(3.2, 0.24, 0.26), p.metal, { y: -1.62 }));
  // Aldrop across the bottom rail
  g.add(part(rod(0.09, 1.5, 24), p.metal, { y: -1.62, z: 0.24, rz: 90 * DEG }));
  g.add(part(ball(0.13), p.metal, { x: 0.78, y: -1.62, z: 0.24 }));
  g.add(part(slab(0.3, 0.5, 0.12, 0.05), p.metal, { x: -0.82, y: -1.62, z: 0.16 }));
  g.add(part(slab(0.3, 0.5, 0.12, 0.05), p.metal, { x: 0.2, y: -1.62, z: 0.16 }));
  // Shutter lock hanging under the rail
  g.add(part(slab(0.66, 0.5, 0.3, 0.1), p.metal, { y: -1.98, z: 0.14 }));
  g.add(part(rod(0.15, 0.1, 26), p.dark, { y: -1.98, z: 0.31, rx: 90 * DEG }));
  return g;
};

const bathroomKit: Builder = (p) =>
  group(
    doorLeaf(p, 1.8, 2.8),
    group(
      roseAssembly(p, 0.36),
      part(
        sweep(
          [
            [0, 0, 0.24],
            [0.28, 0.02, 0.22],
            [0.6, -0.02, 0.19],
            [0.78, -0.16, 0.13],
          ],
          0.08,
        ),
        p.metal,
      ),
    )
      .translateX(-0.56)
      .translateZ(0.15),
    // Occupancy indicator turn
    part(rod(0.2, 0.09, 28), p.metal, { x: -0.56, y: 0.62, z: 0.2, rx: 90 * DEG }),
    part(box(0.07, 0.24, 0.07), p.metal, { x: -0.56, y: 0.62, z: 0.27 }),
    // Rust-resistant hinges
    part(slab(0.44, 0.62, 0.06, 0.03), p.metal, { x: 0.82, y: 0.86, z: 0.16 }),
    part(slab(0.44, 0.62, 0.06, 0.03), p.metal, { x: 0.82, y: -0.86, z: 0.16 }),
    // Towel/robe hook
    part(rod(0.14, 0.07, 24), p.metal, { x: 0.2, y: 1.0, z: 0.18, rx: 90 * DEG }),
    part(
      sweep(
        [
          [0.2, 1.0, 0.2],
          [0.2, 0.86, 0.3],
          [0.2, 0.78, 0.4],
          [0.24, 0.84, 0.46],
        ],
        0.05,
      ),
      p.metal,
    ),
  );

/* -- Hinges & closers ------------------------------------------------------ */

const buttHinge: Builder = (p) => {
  const leaf = (side: 1 | -1) => {
    const g = group(
      part(slab(0.92, 1.7, 0.11, 0.05), p.metal, { x: side * 0.5 }),
      screw(p, { x: side * 0.5, y: 0.5, z: 0.06 }),
      screw(p, { x: side * 0.5, y: 0, z: 0.06 }),
      screw(p, { x: side * 0.5, y: -0.5, z: 0.06 }),
    );
    // Open the hinge ~30° about the knuckle axis so it reads as a hinge
    g.rotation.y = side === 1 ? -30 * DEG : 30 * DEG;
    return g;
  };
  return group(leaf(1), leaf(-1), knuckle(p, 1.7, 0.15, 5));
};

const doorCloser: Builder = (p) =>
  group(
    // Hydraulic body
    part(slab(2.0, 0.9, 0.72, 0.16), p.metal),
    part(slab(1.7, 0.6, 0.05, 0.12), p.dark, { z: 0.38 }),
    // Speed-adjustment valves
    part(rod(0.09, 0.1, 18), p.dark, { x: -0.6, y: -0.24, z: 0.4, rx: 90 * DEG }),
    part(rod(0.09, 0.1, 18), p.dark, { x: -0.3, y: -0.24, z: 0.4, rx: 90 * DEG }),
    // Pinion + two-piece arm folding away from the body
    part(rod(0.16, 1.0, 26), p.dark, { x: 0.72, y: -0.6 }),
    part(slab(0.34, 1.25, 0.16, 0.16), p.metal, { x: 0.72, y: -1.2, z: 0.2, rz: -18 * DEG }),
    part(slab(0.3, 1.4, 0.14, 0.14), p.metal, { x: 0.05, y: -1.9, z: 0.2, rz: 62 * DEG }),
    part(rod(0.08, 0.24, 18), p.dark, { x: 0.34, y: -1.78, z: 0.2 }),
    // Bracket at the far end of the arm
    part(slab(0.5, 0.34, 0.2, 0.06), p.metal, { x: -0.64, y: -2.1, z: 0.2 }),
    // Mounting plate behind the body
    part(slab(2.3, 1.1, 0.08, 0.1), p.dark, { z: -0.42 }),
  );

const concealedHinge: Builder = (p) =>
  group(
    // 35 mm cup
    part(
      lathe([
        [0, -0.24],
        [0.62, -0.24],
        [0.62, 0.06],
        [0.72, 0.06],
        [0.72, 0.12],
        [0, 0.12],
      ]),
      p.metal,
      { x: -1.0, rx: -90 * DEG },
    ),
    part(rod(0.5, 0.06, 32), p.dark, { x: -1.0, z: 0.16, rx: 90 * DEG }),
    // Cranked arm
    part(slab(1.5, 0.34, 0.14, 0.07), p.metal, { x: -0.1, y: 0.14 }),
    part(slab(1.3, 0.22, 0.1, 0.05), p.bright, { x: 0.0, y: -0.16 }),
    part(rod(0.07, 0.4, 18), p.dark, { x: -0.62, y: 0, rx: 90 * DEG }),
    // Soft-close damper cylinder riding on the arm
    part(rod(0.16, 0.62, 26), p.dark, { x: -0.34, y: 0.42, rz: 90 * DEG }),
    part(rod(0.07, 0.3, 18), p.bright, { x: -0.74, y: 0.42, rz: 90 * DEG }),
    // Cross mounting plate
    part(slab(0.9, 0.5, 0.12, 0.05), p.metal, { x: 0.98 }),
    part(slab(0.34, 1.1, 0.1, 0.05), p.metal, { x: 0.98 }),
    screw(p, { x: 0.98, y: 0.42, z: 0.08 }),
    screw(p, { x: 0.98, y: -0.42, z: 0.08 }),
  );

const floorSpring: Builder = (p) =>
  group(
    // Cement case
    part(slab(2.6, 1.2, 0.66, 0.08), p.dark),
    // Stainless cover plate
    part(slab(2.75, 1.35, 0.09, 0.07), p.metal, { z: 0.4 }),
    // Spindle + top plate
    part(rod(0.2, 0.34, 28), p.bright, { x: -0.82, z: 0.58, rx: 90 * DEG }),
    part(box(0.2, 0.2, 0.2), p.bright, { x: -0.82, z: 0.78 }),
    part(rod(0.34, 0.07, 32), p.metal, { x: -0.82, z: 0.46, rx: 90 * DEG }),
    // Adjustment ports
    part(rod(0.09, 0.09, 18), p.dark, { x: 0.55, y: 0.3, z: 0.46, rx: 90 * DEG }),
    part(rod(0.09, 0.09, 18), p.dark, { x: 0.85, y: 0.3, z: 0.46, rx: 90 * DEG }),
    part(rod(0.09, 0.09, 18), p.dark, { x: 0.7, y: -0.24, z: 0.46, rx: 90 * DEG }),
  );

/* -- Cabinet hardware ------------------------------------------------------ */

const cabinetPull: Builder = (p) =>
  group(
    // Extruded slim profile with softened edges
    part(slab(0.34, 2.6, 0.3, 0.1), p.metal, { z: 0.28, rz: 90 * DEG, rx: 90 * DEG }),
    part(box(0.22, 0.22, 0.3), p.metal, { x: -0.95, z: 0.14 }),
    part(box(0.22, 0.22, 0.3), p.metal, { x: 0.95, z: 0.14 }),
    part(rod(0.09, 0.2, 18), p.dark, { x: -0.95, z: -0.08 }),
    part(rod(0.09, 0.2, 18), p.dark, { x: 0.95, z: -0.08 }),
  );

const drawerChannel: Builder = (p) => {
  // Three nested C-sections, stepped out to show the extension
  const rail = (y: number, w: number, offset: number, mat: THREE.Material) =>
    group(
      part(box(w, 0.09, 0.5), mat, { x: offset, y }),
      part(box(w, 0.42, 0.09), mat, { x: offset, y: y + 0.2, z: 0.2 }),
      part(box(w, 0.42, 0.09), mat, { x: offset, y: y - 0.2, z: 0.2 }),
    );
  const g = group(
    rail(0.62, 3.0, -0.5, p.metal),
    rail(0, 2.7, 0, p.bright),
    rail(-0.62, 2.4, 0.5, p.metal),
  );
  // Ball-bearing carriers between the rails
  for (let i = -3; i <= 3; i++) {
    g.add(part(ball(0.07, 16), p.bright, { x: i * 0.34, y: 0.32, z: 0.24 }));
    g.add(part(ball(0.07, 16), p.bright, { x: i * 0.34 + 0.2, y: -0.32, z: 0.24 }));
  }
  return g;
};

const wardrobeKnob: Builder = (p) =>
  group(
    part(
      lathe([
        [0, 0],
        [0.34, 0],
        [0.34, 0.1],
        [0.16, 0.16],
        [0.14, 0.42],
        [0.4, 0.56],
        [0.5, 0.78],
        [0.36, 0.98],
        [0.14, 1.06],
        [0, 1.07],
      ]),
      p.metal,
      { y: -0.55 },
    ),
    part(ring(0.24, 0.04), p.metal, { y: -0.05, rx: 90 * DEG }),
    part(rod(0.09, 0.4, 18), p.dark, { y: -0.72 }),
  );

const flapStay: Builder = (p) =>
  group(
    // Gas cylinder + piston rod
    part(rod(0.19, 1.5, 30), p.dark, { x: -0.4, rz: 90 * DEG }),
    part(cone(0.19, 0.15, 0.12, 24), p.dark, { x: 0.36, rz: 90 * DEG }),
    part(rod(0.08, 1.1, 22), p.bright, { x: 0.92, rz: 90 * DEG }),
    // End fittings
    part(slab(0.42, 0.3, 0.18, 0.09), p.metal, { x: -1.28 }),
    part(rod(0.07, 0.28, 16), p.metal, { x: -1.28, rz: 90 * DEG }),
    part(slab(0.42, 0.3, 0.18, 0.09), p.metal, { x: 1.55 }),
    part(rod(0.07, 0.28, 16), p.metal, { x: 1.55, rz: 90 * DEG }),
    // Cabinet-side mounting bracket
    part(slab(0.7, 0.9, 0.1, 0.05), p.metal, { x: -1.62, z: -0.2, ry: 90 * DEG }),
    // Adjustment collar for stopping force
    part(rod(0.22, 0.14, 26), p.metal, { x: 0.2, rz: 90 * DEG }),
  );

/* -- Glass fittings -------------------------------------------------------- */

const patchFitting: Builder = (p) =>
  group(
    pane(p, 2.4, 2.6),
    // Top patch clamped over the glass
    part(slab(1.1, 0.75, 0.42, 0.08), p.metal, { x: -0.5, y: 1.05 }),
    part(rod(0.11, 0.3, 22), p.bright, { x: -0.5, y: 1.42 }),
    // Bottom patch with pivot
    part(slab(1.1, 0.75, 0.42, 0.08), p.metal, { x: -0.5, y: -1.05 }),
    part(rod(0.13, 0.3, 22), p.bright, { x: -0.5, y: -1.42 }),
    // Corner patch on the lock stile
    part(slab(0.85, 0.85, 0.42, 0.08), p.metal, { x: 0.85, y: -1.0 }),
    part(rod(0.15, 0.5, 24), p.dark, { x: 0.85, y: -1.0, rx: 90 * DEG }),
    // Fixing bolt heads
    part(rod(0.08, 0.46, 18), p.dark, { x: -0.75, y: 1.05, rx: 90 * DEG }),
    part(rod(0.08, 0.46, 18), p.dark, { x: -0.25, y: 1.05, rx: 90 * DEG }),
    part(rod(0.08, 0.46, 18), p.dark, { x: -0.75, y: -1.05, rx: 90 * DEG }),
    part(rod(0.08, 0.46, 18), p.dark, { x: -0.25, y: -1.05, rx: 90 * DEG }),
  );

const spiderFitting: Builder = (p) => {
  const g = group(
    // Hub + back tube to the structure
    part(
      lathe([
        [0, 0],
        [0.42, 0],
        [0.46, 0.14],
        [0.36, 0.3],
        [0, 0.34],
      ]),
      p.metal,
      { rx: -90 * DEG },
    ),
    part(rod(0.2, 0.9, 26), p.metal, { z: -0.45, rx: 90 * DEG }),
    part(rod(0.34, 0.1, 28), p.metal, { z: -0.9, rx: 90 * DEG }),
  );
  // Four arms, each ending in a routel that bolts through the glass
  for (const [dx, dy] of [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ] as const) {
    const len = 1.35;
    const ax = (dx * len) / Math.SQRT2;
    const ay = (dy * len) / Math.SQRT2;
    g.add(
      part(cone(0.11, 0.17, len, 22), p.metal, {
        x: ax / 2,
        y: ay / 2,
        rz: dx * dy > 0 ? -45 * DEG : 45 * DEG,
        ry: dx < 0 ? Math.PI : 0,
      }),
    );
    g.add(part(rod(0.19, 0.28, 24), p.bright, { x: ax, y: ay, z: 0.16, rx: 90 * DEG }));
    g.add(part(ball(0.12), p.metal, { x: ax, y: ay }));
  }
  g.add(pane(p, 3.1, 3.1, 0.08).translateZ(0.34));
  return g;
};

const showerHinge: Builder = (p) =>
  group(
    pane(p, 1.9, 2.6, 0.07),
    // Glass-side clamp block
    part(slab(0.8, 0.9, 0.46, 0.07), p.metal, { x: -0.75, y: 0.75 }),
    part(slab(0.8, 0.9, 0.46, 0.07), p.metal, { x: -0.75, y: -0.75 }),
    // Wall-side blocks, folded back on the pivot
    part(slab(0.55, 0.9, 0.46, 0.07), p.metal, { x: -1.38, y: 0.75, z: -0.3, ry: 35 * DEG }),
    part(slab(0.55, 0.9, 0.46, 0.07), p.metal, { x: -1.38, y: -0.75, z: -0.3, ry: 35 * DEG }),
    part(rod(0.11, 1.0, 24), p.bright, { x: -1.15, y: 0.75 }),
    part(rod(0.11, 1.0, 24), p.bright, { x: -1.15, y: -0.75 }),
    // Gasket seal down the clamp faces
    part(box(0.06, 0.9, 0.3), p.rubber, { x: -0.4, y: 0.75 }),
    part(box(0.06, 0.9, 0.3), p.rubber, { x: -0.4, y: -0.75 }),
    // Handle knob on the open edge
    part(rod(0.13, 0.36, 22), p.metal, { x: 0.72, rx: 90 * DEG }),
    part(ball(0.19), p.metal, { x: 0.72, z: 0.28 }),
  );

const slidingTrack: Builder = (p) => {
  const g = group(
    // Track extrusion
    part(box(3.4, 0.34, 0.42), p.metal, { y: 1.15 }),
    part(box(3.4, 0.12, 0.1), p.dark, { y: 0.98, z: 0.16 }),
    part(box(3.4, 0.16, 0.5), p.metal, { y: 1.36 }),
    // Wall brackets
    part(slab(0.3, 0.5, 0.26, 0.06), p.metal, { x: -1.4, y: 1.5 }),
    part(slab(0.3, 0.5, 0.26, 0.06), p.metal, { x: 1.4, y: 1.5 }),
    // Glass leaf hung below
    pane(p, 2.6, 2.1, 0.08).translateY(-0.15),
  );
  // Roller carriages + clamps
  for (const x of [-0.85, 0.85]) {
    g.add(part(rod(0.17, 0.12, 26), p.bright, { x, y: 1.05, rx: 90 * DEG, z: 0.18 }));
    g.add(part(slab(0.36, 0.5, 0.24, 0.05), p.metal, { x, y: 0.78 }));
    g.add(part(rod(0.07, 0.3, 16), p.dark, { x, y: 1.05, rx: 90 * DEG }));
  }
  // Soft-close stoppers at each end of the track
  g.add(part(box(0.14, 0.2, 0.24), p.rubber, { x: -1.6, y: 1.05, z: 0.16 }));
  g.add(part(box(0.14, 0.2, 0.24), p.rubber, { x: 1.6, y: 1.05, z: 0.16 }));
  return g;
};

/* ------------------------------------------------------------------ registry */

const BUILDERS: Record<string, Builder> = {
  "sx-l-101": mortiseLock,
  "sx-l-102": cylindricalLock,
  "sx-l-103": rimLatch,
  "sx-l-104": camLock,
  "sx-h-201": leverHandle,
  "sx-h-202": pullHandle,
  "sx-h-203": roundKnob,
  "sx-h-204": squareLever,
  "sx-a-301": heavyAldrop,
  "sx-a-302": towerBolt,
  "sx-a-303": babyLatch,
  "sx-a-304": slidingBolt,
  "sx-k-401": essentialKit,
  "sx-k-402": brassSignatureSet,
  "sx-k-403": shutterKit,
  "sx-k-404": bathroomKit,
  "sx-g-501": buttHinge,
  "sx-g-502": doorCloser,
  "sx-g-503": concealedHinge,
  "sx-g-504": floorSpring,
  "sx-c-601": cabinetPull,
  "sx-c-602": drawerChannel,
  "sx-c-603": wardrobeKnob,
  "sx-c-604": flapStay,
  "sx-gf-701": patchFitting,
  "sx-gf-702": spiderFitting,
  "sx-gf-703": showerHinge,
  "sx-gf-704": slidingTrack,
};

/** Used when a SKU has no dedicated builder yet. */
const CATEGORY_FALLBACK: Record<string, Builder> = {
  locks: mortiseLock,
  "handles-knobs": leverHandle,
  "aldrops-bolts": towerBolt,
  "door-kits": essentialKit,
  "hinges-closers": buttHinge,
  "cabinet-hardware": cabinetPull,
  "glass-fittings": patchFitting,
};

export const hasModel = (productId: string) => productId in BUILDERS;

/**
 * Scales and recentres a model so it sits inside a unit-ish box, which lets the
 * viewer use one camera framing for every product regardless of real-world size.
 */
function fitToUnitBox(object: THREE.Object3D, target = 2.4) {
  const bounds = new THREE.Box3().setFromObject(object);
  const size = bounds.getSize(new THREE.Vector3());
  const centre = bounds.getCenter(new THREE.Vector3());
  const largest = Math.max(size.x, size.y, size.z) || 1;
  const scale = target / largest;

  const wrapper = new THREE.Group();
  object.position.sub(centre);
  wrapper.add(object);
  wrapper.scale.setScalar(scale);
  return wrapper;
}

/** Builds the model for a product. Caller owns disposal of the returned tree. */
export function buildProductModel(
  productId: string,
  categorySlug: string,
  finish: string,
): { object: THREE.Object3D; palette: Palette } {
  const builder = BUILDERS[productId] ?? CATEGORY_FALLBACK[categorySlug] ?? mortiseLock;
  const palette = createPalette(finish);
  return { object: fitToUnitBox(builder(palette)), palette };
}

/** Frees every geometry (and the palette) held by a built model. */
export function disposeModel(object: THREE.Object3D, palette: Palette) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) child.geometry.dispose();
  });
  disposePalette(palette);
}
