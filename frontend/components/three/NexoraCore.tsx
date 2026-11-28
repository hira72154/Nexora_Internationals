
"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function ParticleField() {
  const points = useMemo(() => {
    const positions = new Float32Array(450 * 3);

    for (let i = 0; i < 450; i++) {
      const radius = 2.3 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] =
        radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] =
        radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] =
        radius * Math.cos(phi);
    }

    return positions;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.012;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#8ebaff"
        size={0.018}
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

function OrbitalStructure() {
  const root = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Group>(null);
  const ringB = useRef<THREE.Group>(null);
  const ringC = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (root.current) {
      root.current.rotation.y +=
        (state.pointer.x * 0.18 - root.current.rotation.y) *
        delta * 1.2;

      root.current.rotation.x +=
        (-state.pointer.y * 0.12 - root.current.rotation.x) *
        delta * 1.2;
    }

    if (core.current) {
      core.current.rotation.y += delta * 0.16;
      core.current.rotation.z = Math.sin(t * 0.3) * 0.08;
    }

    if (ringA.current) {
      ringA.current.rotation.x += delta * 0.18;
      ringA.current.rotation.y += delta * 0.12;
    }

    if (ringB.current) {
      ringB.current.rotation.y -= delta * 0.13;
      ringB.current.rotation.z += delta * 0.08;
    }

    if (ringC.current) {
      ringC.current.rotation.x += delta * 0.09;
    }

    if (nodes.current) {
      nodes.current.rotation.y -= delta * 0.3;
    }
  });

  return (
    <group ref={root}>
      {/* Central core */}
      <group ref={core}>
        <mesh>
          <icosahedronGeometry args={[0.83, 4]} />
          <meshPhysicalMaterial
            color="#526b8d"
            metalness={0.95}
            roughness={0.19}
            clearcoat={1}
            clearcoatRoughness={0.12}
          />
        </mesh>

        {/* Inner crystal */}
        <mesh scale={0.64} rotation={[0.3, 0.4, 0.2]}>
          <octahedronGeometry args={[1, 2]} />
          <meshPhysicalMaterial
            color="#172c4b"
            metalness={0.9}
            roughness={0.16}
            transmission={0.08}
            thickness={0.8}
            emissive="#163d78"
            emissiveIntensity={0.35}
          />
        </mesh>

        {/* Fine geometric shell */}
        <mesh scale={1.16} rotation={[0.2, 0.1, 0]}>
          <icosahedronGeometry args={[0.82, 2]} />
          <meshBasicMaterial
            color="#9bc5ff"
            wireframe
            transparent
            opacity={0.28}
          />
        </mesh>
      </group>

      {/* Main orbital ring */}
      <group ref={ringA}>
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[1.35, 0.018, 12, 180]} />
          <meshStandardMaterial
            color="#b7d3fa"
            metalness={1}
            roughness={0.18}
            emissive="#477fc8"
            emissiveIntensity={0.35}
          />
        </mesh>
      </group>

      {/* Secondary orbital ring */}
      <group ref={ringB}>
        <mesh rotation={[0.8, 0.2, 0.5]}>
          <torusGeometry args={[1.65, 0.012, 10, 180]} />
          <meshStandardMaterial
            color="#819bbd"
            metalness={1}
            roughness={0.24}
          />
        </mesh>
      </group>

      {/* Inner light ring */}
      <group ref={ringC}>
        <mesh rotation={[0.3, 0.7, 0.9]}>
          <torusGeometry args={[1.08, 0.008, 8, 160]} />
          <meshBasicMaterial
            color="#6faaff"
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>

      {/* Orbiting light nodes */}
      <group ref={nodes}>
        {[0, 1, 2, 3].map((item) => {
          const angle = (item / 4) * Math.PI * 2;

          return (
            <mesh
              key={item}
              position={[
                Math.cos(angle) * 1.72,
                Math.sin(angle) * 1.72,
                0,
              ]}
            >
              <sphereGeometry args={[0.055, 24, 24]} />
              <meshStandardMaterial
                color="#d9eaff"
                emissive="#5b9dff"
                emissiveIntensity={1.8}
                metalness={0.7}
                roughness={0.15}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.65} />

      <directionalLight
        position={[4, 5, 5]}
        intensity={2.5}
      />

      <directionalLight
        position={[-4, -3, -2]}
        color="#427fda"
        intensity={2}
      />

      <pointLight
        position={[0, 1, 3]}
        color="#8bbcff"
        intensity={18}
      />

      <Float
        speed={1.2}
        rotationIntensity={0.12}
        floatIntensity={0.2}
      >
        <OrbitalStructure />
      </Float>

      <ParticleField />

      <Environment preset="city" />
    </>
  );
}

export default function NexoraCore() {
  return (
    <div className="nexora-core">
      <Canvas
        camera={{
          position: [0, 0, 5.4],
          fov: 42,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
