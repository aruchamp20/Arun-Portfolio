import * as THREE from "three";
import { BRAND } from "@/components/ui/TechLogo";

/**
 * The page-wide 3D scene: the systems Arun connects, drawn as a network around the hero photo.
 * Scrolling past the hero spreads it to the edges as a slow constellation that sits behind every section.
 * Positions are viewport fractions (x, y from top-left) plus a world depth z.
 */
type P = [number, number, number];
const NODES: { key: keyof typeof BRAND; label: string; hero: P; heroM: P; amb: P }[] = [
  { key: "salesforce", label: "Salesforce", hero: [0.7, 0.34, 0.6], heroM: [0.82, 0.25, 0.4], amb: [0.93, 0.3, -2] },
  { key: "hubspot", label: "HubSpot", hero: [0.3, 0.32, 0.6], heroM: [0.18, 0.23, 0.4], amb: [0.07, 0.36, -2] },
  { key: "claude", label: "Claude Code", hero: [0.88, 0.17, -1.2], heroM: [0.86, 0.4, -0.6], amb: [0.95, 0.62, -4] },
  { key: "mcp", label: "MCP", hero: [0.83, 0.39, -0.2], heroM: [0.74, 0.51, -0.2], amb: [0.88, 0.86, -3] },
  { key: "zapier", label: "Zapier", hero: [0.13, 0.2, -1.2], heroM: [0.1, 0.37, -0.6], amb: [0.05, 0.13, -4] },
  { key: "nodejs", label: "Node.js", hero: [0.2, 0.5, -0.3], heroM: [0.25, 0.5, -0.2], amb: [0.1, 0.7, -3] },
  { key: "vercel", label: "Vercel", hero: [0.64, 0.58, -0.8], heroM: [0.89, 0.58, -1], amb: [0.9, 0.1, -5] },
  { key: "typescript", label: "TypeScript", hero: [0.06, 0.4, -2.6], heroM: [0.08, 0.58, -1.6], amb: [0.04, 0.92, -5] },
  { key: "github", label: "GitHub", hero: [0.97, 0.3, -2.6], heroM: [0.92, 0.13, -1.6], amb: [0.97, 0.46, -6] },
];
/** Data flows between systems; the number is how many pulses ride the line. */
const EDGES: [string, string, number][] = [
  ["hubspot", "salesforce", 2],
  ["mcp", "salesforce", 1],
  ["mcp", "hubspot", 1],
  ["claude", "mcp", 1],
  ["zapier", "hubspot", 1],
  ["zapier", "salesforce", 1],
  ["nodejs", "vercel", 1],
  ["vercel", "salesforce", 1],
  ["vercel", "hubspot", 1],
  ["typescript", "nodejs", 1],
  ["github", "nodejs", 1],
  ["claude", "github", 1],
];
const PALETTE = ["#5b4bff", "#ff6b4a", "#0ea5a4", "#f5a700", "#ec4899"];
const SEG = 40;
const FOV = 35;
const CAM_Z = 14;
const TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2));

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const back = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 + 2.4 * (t - 1) ** 3 + 1.4 * (t - 1) ** 2);

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

/** SVGs without width/height draw blank in some browsers, so give them a size before rasterising. */
async function loadSvg(src: string, size: number) {
  const text = (await (await fetch(src)).text()).replace("<svg ", `<svg width="${size}" height="${size}" `);
  const url = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
  const img = new Image();
  img.src = url;
  await img.decode();
  URL.revokeObjectURL(url);
  return img;
}

function discTexture(logo: HTMLImageElement) {
  const S = 192;
  const [c, g] = canvas(S, S);
  g.shadowColor = "rgba(13,13,13,.22)";
  g.shadowBlur = 22;
  g.shadowOffsetY = 8;
  g.fillStyle = "#fff";
  g.beginPath();
  g.arc(S / 2, S / 2 - 6, S * 0.34, 0, Math.PI * 2);
  g.fill();
  g.shadowColor = "transparent";
  const L = S * 0.36;
  g.drawImage(logo, (S - L) / 2, (S - L) / 2 - 6, L, L);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function labelTexture(text: string, font: string) {
  const H = 48;
  const [m] = canvas(1, 1);
  const mg = m.getContext("2d")!;
  mg.font = `500 26px ${font}`;
  const W = Math.ceil(mg.measureText(text).width) + 24;
  const [c, g] = canvas(W, H);
  g.font = `500 26px ${font}`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.lineJoin = "round";
  g.lineWidth = 8;
  g.strokeStyle = "rgba(244,242,238,.92)";
  g.strokeText(text, W / 2, H / 2);
  g.fillStyle = "#3a3a3a";
  g.fillText(text, W / 2, H / 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return { t, aspect: W / H };
}

function glowTexture() {
  const S = 64;
  const [c, g] = canvas(S, S);
  const r = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  r.addColorStop(0, "rgba(255,255,255,1)");
  r.addColorStop(0.18, "rgba(255,255,255,.95)");
  r.addColorStop(0.4, "rgba(255,255,255,.3)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, S, S);
  return new THREE.CanvasTexture(c);
}

/**
 * The hero photo is a white-background still blended with multiply, so lines behind it would print on him.
 * Flood-fill the near-white background from the image border; everything not reached is the person.
 * The result masks a paper-coloured cut-out that sits between this scene and the photo.
 */
export async function silhouette(src: string) {
  const img = new Image();
  img.src = src;
  await img.decode();
  const w = 192;
  const h = Math.round((w * img.naturalHeight) / img.naturalWidth);
  const [c, g] = canvas(w, h);
  g.drawImage(img, 0, 0, w, h);
  const d = g.getImageData(0, 0, w, h);
  const px = d.data;
  const bg = new Uint8Array(w * h);
  const light = (i: number) => Math.min(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]) > 228;
  const stack: number[] = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const i = stack.pop()!;
    if (bg[i] || !light(i)) continue;
    bg[i] = 1;
    const x = i % w;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (i >= w) stack.push(i - w);
    if (i < w * (h - 1)) stack.push(i + w);
  }
  for (let i = 0; i < w * h; i++) {
    px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = 0;
    px[i * 4 + 3] = bg[i] ? 0 : 255;
  }
  g.putImageData(d, 0, 0);
  return c.toDataURL();
}

/** Mounts the scene into `host`; returns a cleanup function. Throws if WebGL is unavailable. */
export async function mount(host: HTMLElement, reduce: boolean) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.z = CAM_Z;
  const world = new THREE.Group();
  scene.add(world);

  const font =
    getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains-mono").trim() || "monospace";
  await document.fonts.load(`500 26px ${font}`).catch(() => {});
  const logos = await Promise.all(NODES.map((n) => loadSvg(BRAND[n.key].src, 256)));

  const glow = glowTexture();
  const disposables: { dispose(): void }[] = [renderer, glow];

  const nodes = NODES.map((n, i) => {
    const disc = new THREE.Sprite(new THREE.SpriteMaterial({ map: discTexture(logos[i]), transparent: true, depthWrite: false }));
    const lt = labelTexture(n.label, font);
    const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: lt.t, transparent: true, depthWrite: false }));
    disc.renderOrder = 3;
    label.renderOrder = 4;
    world.add(disc, label);
    disposables.push(disc.material.map!, disc.material, lt.t, label.material);
    return { ...n, disc, label, aspect: lt.aspect, pos: new THREE.Vector3() };
  });
  const byKey = Object.fromEntries(nodes.map((n) => [n.key, n]));

  const lineMat = new THREE.LineBasicMaterial({ color: 0x0d0d0d, transparent: true, opacity: 0.2, depthWrite: false });
  disposables.push(lineMat);
  const edges = EDGES.map(([a, b, count], i) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array((SEG + 1) * 3), 3));
    const line = new THREE.Line(geo, lineMat);
    line.frustumCulled = false;
    world.add(line);
    disposables.push(geo);
    const bend = (i % 2 ? 1 : -1) * (0.12 + (i % 3) * 0.05);
    return { a: byKey[a], b: byKey[b], count, line, geo, bend, ctrl: new THREE.Vector3() };
  });

  const pulses = edges.flatMap((e, ei) =>
    Array.from({ length: e.count }, (_, k) => {
      const mat = new THREE.SpriteMaterial({
        map: glow,
        color: PALETTE[(ei + k) % PALETTE.length],
        transparent: true,
        depthWrite: false,
      });
      const trail = [1, 0.55, 0.3].map((o) => {
        const s = new THREE.Sprite(o === 1 ? mat : mat.clone());
        s.renderOrder = 2;
        world.add(s);
        disposables.push(s.material);
        return s;
      });
      return { e, t: (k / e.count + ei * 0.137) % 1, dir: (ei + k) % 2 ? 1 : -1, speed: 0.11 + ((ei * 7) % 5) * 0.02, trail };
    }),
  );

  // Depth dust: drifts up slower than the page, which is what makes the whole scroll feel deep.
  const DUST = window.innerWidth < 900 ? 140 : 280;
  const dustGeo = new THREE.BufferGeometry();
  const dustMat = new THREE.PointsMaterial({ size: 0.06, map: glow, vertexColors: true, transparent: true, opacity: 0.55, depthWrite: false });
  const dust = new THREE.Points(dustGeo, dustMat);
  dust.frustumCulled = false;
  scene.add(dust);
  disposables.push(dustGeo, dustMat);

  let W = 1;
  let H = 1;
  let mobile = false;
  let heroH = 1;
  const halfH = (z: number) => (CAM_Z - z) * TAN;
  const wpp = (z: number) => (2 * halfH(z)) / H;
  const place = (p: P, out: THREE.Vector3) =>
    out.set((p[0] * 2 - 1) * halfH(p[2]) * (W / H), (1 - p[1] * 2) * halfH(p[2]), p[2]);

  function resize() {
    W = host.clientWidth || window.innerWidth;
    H = host.clientHeight || window.innerHeight;
    mobile = W < 900;
    heroH = document.getElementById("top")?.offsetHeight || H;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();

    const span = document.documentElement.scrollHeight * 0.35;
    const pos = new Float32Array(DUST * 3);
    const col = new Float32Array(DUST * 3);
    const c = new THREE.Color();
    for (let i = 0; i < DUST; i++) {
      const z = -10 + Math.random() * 12;
      const hh = halfH(z);
      pos[i * 3] = (Math.random() * 2 - 1) * hh * (W / H) * 1.1;
      pos[i * 3 + 1] = hh - Math.random() * (2 * hh + span * wpp(z));
      pos[i * 3 + 2] = z;
      c.set(PALETTE[i % PALETTE.length]).lerp(new THREE.Color(0x0d0d0d), 0.25);
      col.set([c.r, c.g, c.b], i * 3);
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  }

  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const start = performance.now();
  let raf = 0;

  function frame(now: number) {
    const time = (now - start) / 1000;
    const intro = reduce ? 1 : clamp(time / 1.6);
    const sy = window.scrollY;
    const p = ease(clamp(sy / (heroH * 0.85)));
    const discPx = mobile ? 40 : 62;

    nodes.forEach((n, i) => {
      place(mobile ? n.heroM : n.hero, tmpA);
      tmpA.y += sy * wpp(tmpA.z); // the hero layout scrolls with the page
      place(n.amb, tmpB);
      if (!reduce) tmpB.y += Math.sin(time * 0.5 + i) * 0.12;
      n.pos.lerpVectors(tmpA, tmpB, p);
      const s = back(intro * 1.7 - i * 0.07);
      const size = discPx * wpp(0) * s;
      n.disc.position.copy(n.pos);
      n.disc.scale.set(size, size, 1);
      n.disc.material.opacity = 1 - (mobile ? 0.75 : 0.5) * p; // narrow screens: edge nodes sit under text
      const lh = (mobile ? 15 : 19) * wpp(0) * s;
      n.label.scale.set(lh * n.aspect, lh, 1);
      n.label.position.set(n.pos.x, n.pos.y - size * 0.46, n.pos.z + 0.01);
      n.label.material.opacity = 1 - p;
    });

    const draw = Math.floor((SEG + 1) * clamp(intro * 1.5 - 0.35));
    lineMat.opacity = 0.2 - 0.13 * p; // faint once it sits behind body text
    for (const e of edges) {
      const a = e.a.pos;
      const b = e.b.pos;
      const d = tmpA.subVectors(b, a);
      e.ctrl.set(-d.y, d.x, 0).multiplyScalar(e.bend).add(a).addScaledVector(d, 0.5);
      e.ctrl.z += 1.2;
      const arr = e.geo.attributes.position.array as Float32Array;
      for (let s = 0; s <= SEG; s++) bez(a, e.ctrl, b, s / SEG, tmpB).toArray(arr, s * 3);
      e.geo.attributes.position.needsUpdate = true;
      e.geo.setDrawRange(0, draw);
    }

    const pulseOn = reduce ? 0.9 : clamp(intro * 3 - 2) * 0.9;
    for (const pl of pulses) {
      if (!reduce) pl.t = (pl.t + (pl.speed / 60) * pl.dir + 1) % 1;
      pl.trail.forEach((s, k) => {
        const t = clamp(pl.t - pl.dir * k * 0.03);
        bez(pl.e.a.pos, pl.e.ctrl, pl.e.b.pos, t, s.position);
        const size = (mobile ? 16 : 24) * wpp(0) * (1 - k * 0.25);
        s.scale.set(size, size, 1);
        s.material.opacity = pulseOn * (1 - k * 0.32) * (1 - 0.35 * p);
      });
    }

    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    world.rotation.y = pointer.x * 0.12 + Math.sin(sy / 1500) * 0.2 + (reduce ? 0 : Math.sin(time * 0.15) * 0.03);
    world.rotation.x = pointer.y * 0.08 + Math.sin(sy / 2100) * 0.08;
    dust.position.y = sy * wpp(0) * 0.35;
    dust.rotation.y = world.rotation.y * 0.5;

    renderer.render(scene, camera);
    if (!reduce) raf = requestAnimationFrame(frame);
  }

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    pointer.tx = (e.clientX / W) * 2 - 1;
    pointer.ty = (e.clientY / H) * 2 - 1;
  };
  const onResize = () => {
    resize();
    if (reduce) frame(performance.now());
  };
  // Reduced motion: one still frame, refreshed on scroll so the hero layout still moves out of the way.
  const onScroll = () => requestAnimationFrame(() => frame(performance.now()));

  resize();
  const ro = new ResizeObserver(onResize);
  ro.observe(document.documentElement);
  window.addEventListener("pointermove", onPointer, { passive: true });
  if (reduce) window.addEventListener("scroll", onScroll, { passive: true });
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("scroll", onScroll);
    disposables.forEach((d) => d.dispose());
    renderer.domElement.remove();
  };
}

function bez(a: THREE.Vector3, c: THREE.Vector3, b: THREE.Vector3, t: number, out: THREE.Vector3) {
  const u = 1 - t;
  return out.set(
    u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    u * u * a.y + 2 * u * t * c.y + t * t * b.y,
    u * u * a.z + 2 * u * t * c.z + t * t * b.z,
  );
}
