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

  useFrame((_, delta) => {
    if (shell.current) {
      shell.current.rotation.y += delta * 0.08;
      shell.current.rotation.x += delta * 0.02;
    }
    if (core.current) core.current.rotation.y -= delta * 0.12;
    if (ringA.current) ringA.current.rotation.z += delta * 0.05;
    if (ringB.current) ringB.current.rotation.z -= delta * 0.04;
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

      {/* Orbit ring — signal */}
      <mesh ref={ringA} rotation={[Math.PI / 2.6, 0.4, 0]}>
        <torusGeometry args={[3.4, 0.008, 6, 96]} />
        <meshBasicMaterial color={SIGNAL} transparent opacity={0.85} />
      </mesh>

      {/* Orbit ring — dim counterweight */}
      <mesh ref={ringB} rotation={[Math.PI / 1.7, -0.5, 0]}>
        <torusGeometry args={[3.9, 0.006, 6, 96]} />
        <meshBasicMaterial color={BONE} transparent opacity={0.18} />
      </mesh>
    </group>
  );
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
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} />
      {/* Signal-colored rim light from below-left */}
      <pointLight position={[-6, -3, -2]} intensity={14} color={SIGNAL} />
      <Rig>
        <Core />
        <Particles />
      </Rig>
    </Canvas>
  );
}
