/**
 * Shared lighting rig for the product models.
 *
 * The models are almost entirely metal, and metal renders black without
 * something to reflect — so the important part here is the PMREM environment
 * map built from `RoomEnvironment`. The directional lights only add the
 * specular highlights and the contact shadow on top of it.
 *
 * The PMREM is expensive to generate, so it is cached per renderer.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const envCache = new WeakMap<THREE.WebGLRenderer, THREE.Texture>();

export function environmentMap(renderer: THREE.WebGLRenderer): THREE.Texture {
  const cached = envCache.get(renderer);
  if (cached) return cached;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const texture = pmrem.fromScene(room, 0.04).texture;
  room.dispose();
  pmrem.dispose();

  envCache.set(renderer, texture);
  return texture;
}

export type StageOptions = {
  /** Draw a soft contact shadow under the model. Off for small thumbnails. */
  shadows?: boolean;
  /** Multiplier on the image-based lighting. */
  envIntensity?: number;
};

export type Stage = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** Pivot the model hangs off — rotate this, not the model itself. */
  pivot: THREE.Group;
  /** Swaps the displayed model, returning the one that was there before. */
  setModel: (object: THREE.Object3D | null) => THREE.Object3D | null;
  /** Reframes the camera for a viewport aspect ratio. */
  resize: (width: number, height: number) => void;
  dispose: () => void;
};

export function createStage(
  renderer: THREE.WebGLRenderer,
  { shadows = true, envIntensity = 1 }: StageOptions = {},
): Stage {
  const scene = new THREE.Scene();
  scene.environment = environmentMap(renderer);
  scene.environmentIntensity = envIntensity;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(2.4, 1.7, 5.2);
  camera.lookAt(0, 0, 0);

  const pivot = new THREE.Group();
  scene.add(pivot);

  const key = new THREE.DirectionalLight(0xffffff, 1.9);
  key.position.set(3.5, 5.5, 4);
  const fill = new THREE.DirectionalLight(0xdfe8ff, 0.5);
  fill.position.set(-4, 1.5, -2.5);
  const rim = new THREE.DirectionalLight(0xfff0d8, 0.9);
  rim.position.set(-1.5, 2.5, -4.5);
  scene.add(key, fill, rim);

  let ground: THREE.Mesh | null = null;
  if (shadows) {
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    key.shadow.camera.left = -3;
    key.shadow.camera.right = 3;
    key.shadow.camera.top = 3;
    key.shadow.camera.bottom = -3;
    key.shadow.bias = -0.0012;
    key.shadow.radius = 4;

    ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({ opacity: 0.22 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.55;
    ground.receiveShadow = true;
    scene.add(ground);
  }

  let current: THREE.Object3D | null = null;

  return {
    scene,
    camera,
    pivot,
    setModel(object) {
      const previous = current;
      if (previous) pivot.remove(previous);
      if (object) pivot.add(object);
      current = object;
      return previous;
    },
    resize(width, height) {
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    },
    dispose() {
      if (current) pivot.remove(current);
      current = null;
      if (ground) {
        ground.geometry.dispose();
        (ground.material as THREE.Material).dispose();
      }
      scene.clear();
    },
  };
}

export function configureRenderer(renderer: THREE.WebGLRenderer, shadows = true) {
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio ?? 1, 2));
}

/** WebGL availability probe — the components fall back to a flat thumb if false. */
export function supportsWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}
