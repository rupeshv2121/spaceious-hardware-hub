/**
 * Off-screen renderer for product-card thumbnails.
 *
 * A grid of cards can hold 20+ products, and browsers cap a page at roughly 16
 * live WebGL contexts — so instead of one canvas per card, every thumbnail is
 * rendered through a single shared context and handed back as a PNG data URL
 * that the card displays in a plain <img>. Renders are serialised through one
 * queue and memoised, so scrolling the catalogue costs nothing after the first
 * pass.
 */
import type * as ThreeNamespace from "three";
import type { Stage } from "./three-stage";

const WIDTH = 560;
const HEIGHT = 420;

type Runtime = {
  THREE: typeof ThreeNamespace;
  models: typeof import("./product-3d");
  renderer: ThreeNamespace.WebGLRenderer;
  stage: Stage;
};

let runtime: Runtime | null = null;
let runtimePromise: Promise<Runtime | null> | null = null;

const cache = new Map<string, string>();
const pending = new Map<string, Promise<string | null>>();
/** Serialises renders — one shared canvas cannot draw two models at once. */
let queue: Promise<unknown> = Promise.resolve();

async function getRuntime(): Promise<Runtime | null> {
  if (runtime) return runtime;
  if (runtimePromise) return runtimePromise;

  runtimePromise = (async () => {
    const [THREE, models, stageLib] = await Promise.all([
      import("three"),
      import("./product-3d"),
      import("./three-stage"),
    ]);
    if (!stageLib.supportsWebGL()) return null;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      // Required: `toDataURL` reads the buffer after the draw call returns.
      preserveDrawingBuffer: true,
    });
    stageLib.configureRenderer(renderer, true);
    renderer.setPixelRatio(1);
    renderer.setSize(WIDTH, HEIGHT, false);

    const stage = stageLib.createStage(renderer, { shadows: true });
    stage.resize(WIDTH, HEIGHT);
    // Nudge off dead-on so the card previews read as three-dimensional.
    stage.pivot.rotation.y = -0.35;

    runtime = { THREE, models, renderer, stage };
    return runtime;
  })().catch(() => null);

  return runtimePromise;
}

function toBlobURL(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob ? URL.createObjectURL(blob) : canvas.toDataURL("image/png"));
    }, "image/png");
  });
}

const keyFor = (productId: string, finish: string) => `${productId}::${finish}`;

/** A previously rendered thumbnail, if one is already in memory. */
export const cachedThumbnail = (productId: string, finish: string): string | undefined =>
  cache.get(keyFor(productId, finish));

/**
 * Renders (or returns a cached) thumbnail as a PNG data URL.
 * Resolves to `null` when WebGL is unavailable — callers fall back to the flat
 * monogram thumb.
 */
export function renderProductThumbnail(
  productId: string,
  categorySlug: string,
  finish: string,
): Promise<string | null> {
  const key = keyFor(productId, finish);

  const done = cache.get(key);
  if (done) return Promise.resolve(done);

  const inFlight = pending.get(key);
  if (inFlight) return inFlight;

  const job = queue.then(async () => {
    const rt = await getRuntime();
    if (!rt) return null;

    const { models, renderer, stage } = rt;
    const { object, palette } = models.buildProductModel(productId, categorySlug, finish);
    stage.setModel(object);
    renderer.render(stage.scene, stage.camera);
    // Blob URL rather than a data URL: a base64 PNG of every product would sit
    // in the JS heap for the life of the page on top of the decoded bitmap.
    const url = await toBlobURL(renderer.domElement);
    stage.setModel(null);
    models.disposeModel(object, palette);

    cache.set(key, url);
    return url;
  });

  // Keep the queue alive even if one render throws.
  queue = job.catch(() => null);

  const tracked = job.catch(() => null).finally(() => pending.delete(key));
  pending.set(key, tracked);
  return tracked;
}
