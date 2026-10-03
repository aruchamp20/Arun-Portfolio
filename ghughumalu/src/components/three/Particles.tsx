"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

export type ParticlePreset = "hero" | "pantry";

type Props = {
  preset?: ParticlePreset;
  /** render only while visible */
  active: boolean;
  /** 0..1 scroll progress of the owning section; particles rise with it */
  progress: RefObject<number>;
  /** -1..1 normalised pointer, shared so every section reacts the same way */
  pointer: RefObject<{ x: number; y: number }>;
  className?: string;
};

const vertex = /* glsl */ `
  attribute float aSize;
  attribute float aKind;
  attribute float aSeed;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uRise;
  uniform float uPixelRatio;
  uniform float uFocus;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vKind;
  varying float vSeed;
  varying float vBlur;
  void main() {
    vec3 p = position;
    float t = uTime * 0.08 + aSeed * 6.2831;
    // slow lateral breathing and a gentle climb; steam (kind 2) climbs faster
    p.x += sin(t * 0.9) * 0.16 + cos(t * 0.37) * 0.08;
    p.y += sin(t * 0.6 + 1.3) * 0.12;
    float climb = aKind > 1.5 ? 0.35 : 0.06;
    p.y += mod(uTime * climb * (0.5 + aSeed) + aSeed * 10.0, 8.0) - 4.0 + uRise * 2.2;
    p.z += sin(t * 0.5) * 0.1;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;
    // soft depth of field: away from the focal plane, points grow and fade
    float blur = clamp(abs(dist - uFocus) / 4.5, 0.0, 1.0);
    vBlur = blur;
    float size = aSize * (1.0 + blur * 1.1);
    gl_PointSize = size * uPixelRatio * (34.0 / dist);
    gl_Position = projectionMatrix * mv;
    vColor = aColor;
    vAlpha = mix(0.8, 0.14, blur);
    vKind = aKind;
    vSeed = aSeed;
  }
`;

const fragment = /* glsl */ `
  precision mediump float;
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vKind;
  varying float vSeed;
  varying float vBlur;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    if (vKind > 0.5 && vKind < 1.5) {
      // herb: a soft leaf-like ellipse rotated by seed
      float a = vSeed * 6.2831;
      uv = mat2(cos(a), -sin(a), sin(a), cos(a)) * uv;
      uv.x *= 0.55;
    }
    float d = length(uv);
    float edge = 0.5;
    float soft = 0.08 + vBlur * 0.34;
    float alpha = 1.0 - smoothstep(edge - soft, edge, d);
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha * vAlpha * uOpacity);
  }
`;

const PALETTES: Record<ParticlePreset, { colours: string[]; count: number; herbs: number; steam: number; spread: [number, number, number] }> = {
  hero: { colours: ["#D9A441", "#C9B9A6", "#B5412E", "#E8DCC8"], count: 150, herbs: 7, steam: 50, spread: [15, 9, 8] },
  pantry: { colours: ["#D9A441", "#B5412E", "#6E7F4B", "#A8673E", "#3A2F2A"], count: 260, herbs: 12, steam: 20, spread: [16, 10, 9] },
};

function Field({ preset, progress, pointer }: { preset: ParticlePreset; progress: RefObject<number>; pointer: RefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport, camera } = useThree();
  const pr = Math.min(1.5, typeof window === "undefined" ? 1 : window.devicePixelRatio || 1);

  const { positions, sizes, kinds, seeds, colours } = useMemo(() => {
    const cfg = PALETTES[preset];
    const n = cfg.count;
    const positions = new Float32Array(n * 3);
    const sizes = new Float32Array(n);
    const kinds = new Float32Array(n);
    const seeds = new Float32Array(n);
    const colours = new Float32Array(n * 3);
    const palette = cfg.colours.map((c) => new THREE.Color(c));
    const steamCol = new THREE.Color("#F3EEE6");
    const herbCol = new THREE.Color("#6E7F4B");
    const [sx, sy, sz] = cfg.spread;
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < n; i++) {
      positions[i * 3] = (rnd() - 0.5) * sx;
      positions[i * 3 + 1] = (rnd() - 0.5) * sy;
      positions[i * 3 + 2] = (rnd() - 0.5) * sz;
      let kind = 0;
      if (i < cfg.herbs) kind = 1;
      else if (i < cfg.herbs + cfg.steam) kind = 2;
      kinds[i] = kind;
      seeds[i] = rnd();
      sizes[i] = kind === 1 ? 2.2 + rnd() * 1.6 : kind === 2 ? 2 + rnd() * 2.2 : 0.5 + rnd() * 1.1;
      const c = kind === 1 ? herbCol : kind === 2 ? steamCol : palette[Math.floor(rnd() * palette.length)];
      colours[i * 3] = c.r;
      colours[i * 3 + 1] = c.g;
      colours[i * 3 + 2] = c.b;
    }
    return { positions, sizes, kinds, seeds, colours };
  }, [preset]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRise: { value: 0 },
      uPixelRatio: { value: pr },
      uFocus: { value: 9 },
      uOpacity: { value: preset === "hero" ? 0.55 : 0.8 },
    }),
    [pr, preset],
  );

  useFrame((_, dt) => {
    const m = mat.current;
    const g = group.current;
    if (!m || !g) return;
    m.uniforms.uTime.value += Math.min(dt, 0.05);
    m.uniforms.uRise.value += ((progress.current ?? 0) - m.uniforms.uRise.value) * 0.08;
    const p = pointer.current ?? { x: 0, y: 0 };
    // soft mouse parallax on the whole field, and a tiny camera drift so depth layers slide against each other
    g.rotation.y += (p.x * 0.09 - g.rotation.y) * 0.04;
    g.rotation.x += (-p.y * 0.06 - g.rotation.x) * 0.04;
    camera.position.x += (p.x * 0.35 - camera.position.x) * 0.03;
    camera.position.y += (p.y * 0.25 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });

  const scale = Math.max(1, viewport.width / 14);

  return (
    <group ref={group} scale={scale}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-aKind" args={[kinds, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
          <bufferAttribute attach="attributes-aColor" args={[colours, 3]} />
        </bufferGeometry>
        <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent depthWrite={false} depthTest={false} blending={THREE.NormalBlending} />
      </points>
    </group>
  );
}

/**
 * A field of spice dust, drifting herbs and steam with soft depth of field
 * and pointer parallax. Normal blending on a light canvas, so it reads as
 * particles in daylight rather than a glow. The canvas only renders while
 * its section is on screen.
 */
export default function Particles({ preset = "hero", active, progress, pointer, className = "" }: Props) {
  return (
    <div className={`prt ${className}`} aria-hidden="true">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 45, near: 0.1, far: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false, depth: false }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Field preset={preset} progress={progress} pointer={pointer} />
      </Canvas>
      <style>{`.prt{position:absolute;inset:0;pointer-events:none}`}</style>
    </div>
  );
}
