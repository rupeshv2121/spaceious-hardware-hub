import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Minus, Plus, RotateCcw, RotateCw } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { finishOptions } from "@/lib/finishes";
import { ProductThumb } from "./ProductThumb";

/**
 * Interactive 3D product viewer.
 *
 * three.js and the model builders are imported dynamically so they stay out of
 * the SSR bundle and out of the initial client chunk — nothing here runs until
 * the component actually mounts in a browser with WebGL.
 */

type Handle = {
  applyFinish: (finish: string) => void;
  reset: () => void;
  rotate: (direction: 1 | -1) => void;
  zoom: (direction: 1 | -1) => void;
  stopAutoRotate: () => void;
  dispose: () => void;
};

type Props = {
  product: Product;
  /** Controlled finish. Omit to let the viewer manage its own. */
  finish?: string;
  onFinishChange?: (finish: string) => void;
  /** Hide the built-in chips when the page provides its own finish picker. */
  showFinishChips?: boolean;
  className?: string;
};

export function Product3DViewer({
  product,
  finish: finishProp,
  onFinishChange,
  showFinishChips = true,
  className = "",
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<Handle | null>(null);

  const options = finishOptions(product);
  const [internalFinish, setInternalFinish] = useState(product.finish);
  const finish = finishProp ?? internalFinish;
  const setFinish = onFinishChange ?? setInternalFinish;
  const finishRef = useRef(finish);
  finishRef.current = finish;

  const [status, setStatus] = useState<"loading" | "ready" | "unsupported">("loading");
  const [spinning, setSpinning] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;

    (async () => {
      const [THREE, { OrbitControls }, models, stageLib] = await Promise.all([
        import("three"),
        import("three/examples/jsm/controls/OrbitControls.js"),
        import("@/lib/product-3d"),
        import("@/lib/three-stage"),
      ]);

      if (disposed) return;
      if (!stageLib.supportsWebGL()) {
        setStatus("unsupported");
        return;
      }

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      stageLib.configureRenderer(renderer, true);
      renderer.domElement.classList.add("h-full", "w-full", "block", "touch-none");
      mount.appendChild(renderer.domElement);

      const stage = stageLib.createStage(renderer, { shadows: true });
      const controls = new OrbitControls(stage.camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enablePan = false;
      // Wheel zoom stays off until the user deliberately grabs the model, so
      // scrolling past the viewer never gets swallowed by it.
      controls.enableZoom = false;
      controls.minDistance = 3;
      controls.maxDistance = 11;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.6;
      controls.saveState();

      const stopAutoRotate = () => {
        if (!controls.autoRotate) return;
        controls.autoRotate = false;
        setSpinning(false);
      };
      controls.addEventListener("start", stopAutoRotate);
      const enableWheelZoom = () => {
        controls.enableZoom = true;
      };
      renderer.domElement.addEventListener("pointerdown", enableWheelZoom);

      let model: import("three").Object3D | null = null;
      let palette: import("@/lib/product-3d").Palette | null = null;

      const build = (nextFinish: string) => {
        const previous = model && palette ? { model, palette } : null;
        const built = models.buildProductModel(product.id, product.category, nextFinish);
        model = built.object;
        palette = built.palette;
        stage.setModel(model);
        if (previous) models.disposeModel(previous.model, previous.palette);
      };
      build(finishRef.current);

      const resize = () => {
        const { clientWidth, clientHeight } = mount;
        if (!clientWidth || !clientHeight) return;
        renderer.setSize(clientWidth, clientHeight, false);
        stage.resize(clientWidth, clientHeight);
      };
      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(mount);

      let frame = 0;
      const tick = () => {
        frame = requestAnimationFrame(tick);
        controls.update();
        renderer.render(stage.scene, stage.camera);
      };
      tick();

      setStatus("ready");

      handleRef.current = {
        applyFinish: build,
        reset: () => {
          controls.reset();
          controls.autoRotate = false;
          setSpinning(false);
        },
        rotate: (direction) => {
          stopAutoRotate();
          controls.rotateLeft(direction * 0.35);
        },
        zoom: (direction) => {
          // Inverted on purpose: OrbitControls applies its dolly scale as
          // `radius *= scale`, so `dollyIn` moves the camera *away*.
          if (direction > 0) controls.dollyOut(1.15);
          else controls.dollyIn(1.15);
        },
        stopAutoRotate,
        dispose: () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          controls.removeEventListener("start", stopAutoRotate);
          renderer.domElement.removeEventListener("pointerdown", enableWheelZoom);
          controls.dispose();
          if (model && palette) models.disposeModel(model, palette);
          stage.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        },
      };

      if (disposed) {
        handleRef.current.dispose();
        handleRef.current = null;
      }
    })().catch(() => {
      if (!disposed) setStatus("unsupported");
    });

    return () => {
      disposed = true;
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, [product.id, product.category]);

  // Finish changes only rebuild the mesh — the renderer and its cached
  // environment map survive, so switching is instant.
  useEffect(() => {
    handleRef.current?.applyFinish(finish);
  }, [finish]);

  useEffect(() => {
    setInternalFinish(product.finish);
  }, [product.finish]);

  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    const handle = handleRef.current;
    if (!handle) return;
    if (event.key === "ArrowLeft") handle.rotate(-1);
    else if (event.key === "ArrowRight") handle.rotate(1);
    else if (event.key === "+" || event.key === "=") handle.zoom(1);
    else if (event.key === "-") handle.zoom(-1);
    else return;
    event.preventDefault();
  }, []);

  if (status === "unsupported") {
    return <ProductThumb name={product.name} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden bg-secondary ${className}`}>
      {/* Backdrop — a soft studio sweep so the metal has something to sit on. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,var(--color-card),var(--color-secondary)_72%)]" />
      <div className="gradient-brand-soft absolute inset-0" />

      <div
        ref={mountRef}
        role="img"
        tabIndex={0}
        aria-label={`Interactive 3D model of the ${product.name}. Drag to rotate, or use the arrow keys.`}
        onKeyDown={onKeyDown}
        className="absolute inset-0 cursor-grab outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset active:cursor-grabbing"
      />

      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Loading 3D model…
          </div>
        </div>
      )}

      {status === "ready" && (
        <>
          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5">
            <span className="gradient-brand rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground shadow-sm">
              3D
            </span>
            {spinning && (
              <span className="rounded-full bg-card/85 px-2.5 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur-sm">
                Drag to rotate
              </span>
            )}
          </div>

          <div className="absolute right-3 top-3 flex flex-col gap-1.5">
            <ViewerButton label="Rotate left" onClick={() => handleRef.current?.rotate(-1)}>
              <RotateCcw className="h-4 w-4" />
            </ViewerButton>
            <ViewerButton label="Rotate right" onClick={() => handleRef.current?.rotate(1)}>
              <RotateCw className="h-4 w-4" />
            </ViewerButton>
            <ViewerButton label="Zoom in" onClick={() => handleRef.current?.zoom(1)}>
              <Plus className="h-4 w-4" />
            </ViewerButton>
            <ViewerButton label="Zoom out" onClick={() => handleRef.current?.zoom(-1)}>
              <Minus className="h-4 w-4" />
            </ViewerButton>
            <ViewerButton label="Reset view" onClick={() => handleRef.current?.reset()}>
              <Maximize2 className="h-4 w-4" />
            </ViewerButton>
          </div>

          {showFinishChips && options.length > 1 && (
            <div className="absolute inset-x-3 bottom-3 flex flex-wrap justify-center gap-1.5">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFinish(option)}
                  aria-pressed={finish === option}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-colors ${
                    finish === option
                      ? "gradient-brand text-primary-foreground shadow-sm"
                      : "bg-card/85 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ViewerButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-8 w-8 place-items-center rounded-lg bg-card/85 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </button>
  );
}
