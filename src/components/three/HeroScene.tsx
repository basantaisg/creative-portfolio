"use client";

/**
 * HeroScene — the 3D rig behind the hero headline.
 *
 * Deliberately low-poly and monochrome-plus-signal so it reads as
 * engineering, not decoration:
 *   - outer wireframe icosahedron (the "market")
 *   - inner faceted core (the "strategy")
 *   - two thin orbit rings (the "system in motion")
 *   - a sparse particle shell for depth
 *
 * Performance guardrails: capped DPR, low segment counts, a single
 * canvas, damped pointer parallax instead of per-frame raycasting.
 * The whole scene is ~1.5k triangles.
 */
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SIGNAL = "#ff4d00";
const BONE = "#e9e6df";

/** How fast the gradient sweeps around the ring / cycles through the light (cycles per second). */
const CYCLE_SPEED = 0.06;

/**
 * Curated 4-stop palette the ring gradient and rim light both cycle through,
 * starting from the brand signal orange. Kept in JS (for the light) and
 * mirrored as floats in the ring shader below — GLSL can't import this array.
 */
const PALETTE = [
  new THREE.Color("#ff4d00"), // signal orange
  new THREE.Color("#ffb020"), // amber
  new THREE.Color("#ff2ea6"), // magenta
  new THREE.Color("#2e6bff"), // electric blue
];

function paletteColor(t: number, target: THREE.Color) {
  const scaled = THREE.MathUtils.euclideanModulo(t, 1) * PALETTE.length;
  const i = Math.floor(scaled);
  const a = PALETTE[i];
  const b = PALETTE[(i + 1) % PALETTE.length];
  return target.copy(a).lerp(b, scaled - i);
}

const RING_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const RING_FRAGMENT_SHADER = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpacity;

  vec3 palette(float t) {
    vec3 c0 = vec3(1.000, 0.302, 0.000); // signal orange
    vec3 c1 = vec3(1.000, 0.690, 0.125); // amber
    vec3 c2 = vec3(1.000, 0.180, 0.651); // magenta
    vec3 c3 = vec3(0.180, 0.420, 1.000); // electric blue

    float scaled = fract(t) * 4.0;
    float i = floor(scaled);
    float f = smoothstep(0.0, 1.0, fract(scaled));

    vec3 a = i < 1.0 ? c0 : i < 2.0 ? c1 : i < 3.0 ? c2 : c3;
    vec3 b = i < 1.0 ? c1 : i < 2.0 ? c2 : i < 3.0 ? c3 : c0;
    return mix(a, b, f);
  }

  void main() {
    vec3 color = palette(vUv.x + uTime * ${CYCLE_SPEED.toFixed(3)});
    gl_FragColor = vec4(color, uOpacity);
  }
`;

/** Damped mouse-parallax wrapper — the only pointer-reactive node. */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      state.pointer.x * 0.3,
      2,
      delta
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      -state.pointer.y * 0.22,
      2,
      delta
    );
  });
  return <group ref={group}>{children}</group>;
}

/** Central geometry: wireframe shell + faceted core + orbit rings. */
function Core() {
  const shell = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringMaterial = useRef<THREE.ShaderMaterial>(null);
  const ringUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uOpacity: { value: 0.9 } }),
    []
  );

  useFrame((_, delta) => {
    if (shell.current) {
      shell.current.rotation.y += delta * 0.08;
      shell.current.rotation.x += delta * 0.02;
    }
    if (core.current) core.current.rotation.y -= delta * 0.12;
    if (ringA.current) ringA.current.rotation.z += delta * 0.05;
    if (ringB.current) ringB.current.rotation.z -= delta * 0.04;
    if (ringMaterial.current) ringMaterial.current.uniforms.uTime.value += delta;
  });

  return (
    <group>
      {/* Outer wireframe shell */}
      <mesh ref={shell}>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshBasicMaterial
          color="#4a463d"
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* Inner faceted core — catches the signal-colored rim light */}
      <mesh ref={core}>
        <icosahedronGeometry args={[1.05, 0]} />
        <meshStandardMaterial
          color="#181815"
          flatShading
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>

      {/* Orbit ring — living gradient sweeping orange → amber → magenta → blue */}
      <mesh ref={ringA} rotation={[Math.PI / 2.6, 0.4, 0]}>
        <torusGeometry args={[3.4, 0.008, 6, 96]} />
        <shaderMaterial
          ref={ringMaterial}
          transparent
          uniforms={ringUniforms}
          vertexShader={RING_VERTEX_SHADER}
          fragmentShader={RING_FRAGMENT_SHADER}
        />
      </mesh>

      {/* Orbit ring — dim counterweight */}
      <mesh ref={ringB} rotation={[Math.PI / 1.7, -0.5, 0]}>
        <torusGeometry args={[3.9, 0.006, 6, 96]} />
        <meshBasicMaterial color={BONE} transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

/** Rim light that cycles through the same palette as the orbit ring, so the whole scene breathes as one. */
function SignalLight() {
  const light = useRef<THREE.PointLight>(null);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    if (!light.current) return;
    light.current.color.copy(
      paletteColor(state.clock.elapsedTime * CYCLE_SPEED, color)
    );
  });

  return <pointLight ref={light} position={[-6, -3, -2]} intensity={14} />;
}

/** Sparse particle shell (radius 4.5–7.5) for parallax depth. */
function Particles({ count = 450 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const v = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      v.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      )
        .normalize()
        .multiplyScalar(4.5 + Math.random() * 3);
      arr.set([v.x, v.y, v.z], i * 3);
    }
    return arr;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={BONE}
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </points>
  );
}

/** Default export: the canvas itself. Loaded client-side only. */
export default function HeroScene() {
  // This component never renders on the server (ssr:false), so window
  // is safe here. Phones get a lighter scene: fewer particles and a
  // pulled-back camera so the rig fits a narrow viewport.
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, isMobile ? 10.5 : 8], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} />
      {/* Palette-cycling rim light from below-left, synced with the ring gradient */}
      <SignalLight />
      <Rig>
        <Core />
        <Particles count={isMobile ? 220 : 450} />
      </Rig>
    </Canvas>
  );
}
