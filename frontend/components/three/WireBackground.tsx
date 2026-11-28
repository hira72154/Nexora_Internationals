
"use client";

import { useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const POINTS_PER_WIRE = 180;

type WirePath = {
  angle: number;
  phase: number;
  height: number;
  amplitude: number;
  depth: number;
  speed: number;
  frequency: number;
};

function FlowingWires() {
  const sceneData = useMemo(() => {
    const paths: WirePath[] = [
      { angle: 0.05, phase: 0.2, height: 10, amplitude: 2.2, depth: -5, speed: 0.35, frequency: 0.16 },
      { angle: 0.16, phase: 1.4, height: 6, amplitude: 2.8, depth: -2, speed: 0.48, frequency: 0.13 },
      { angle: -0.12, phase: 2.5, height: 2, amplitude: 1.8, depth: 3, speed: 0.3, frequency: 0.2 },
      { angle: 0.22, phase: 3.2, height: -3, amplitude: 2.5, depth: -4, speed: 0.42, frequency: 0.14 },
      { angle: -0.2, phase: 4.1, height: -8, amplitude: 2.4, depth: 2, speed: 0.38, frequency: 0.17 },
      { angle: 0.38, phase: 0.9, height: 4, amplitude: 2.1, depth: 5, speed: 0.28, frequency: 0.12 },
      { angle: -0.42, phase: 2.1, height: -2, amplitude: 2.8, depth: -6, speed: 0.32, frequency: 0.15 },
      { angle: 0.62, phase: 3.8, height: 0, amplitude: 2.4, depth: 1, speed: 0.4, frequency: 0.11 },
      { angle: -0.65, phase: 1.7, height: 1, amplitude: 2.2, depth: 4, speed: 0.34, frequency: 0.18 },
      { angle: 1.05, phase: 2.9, height: 0, amplitude: 2.6, depth: -3, speed: 0.3, frequency: 0.13 },
      { angle: -1.12, phase: 4.6, height: 0, amplitude: 2.1, depth: 3, speed: 0.36, frequency: 0.16 },
    ];

    const linePositions = new Float32Array(
      paths.length * POINTS_PER_WIRE * 3
    );
    const lineIndices: number[] = [];

    const nodePositions = new Float32Array(
      paths.length * 7 * 3
    );

    const pulsePositions = new Float32Array(
      paths.length * 2 * 3
    );

    paths.forEach((_, pathIndex) => {
      const pointStart = pathIndex * POINTS_PER_WIRE;

      for (let i = 0; i < POINTS_PER_WIRE - 1; i++) {
        lineIndices.push(
          pointStart + i,
          pointStart + i + 1
        );
      }
    });

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3)
    );
    lineGeometry.setIndex(lineIndices);
    lineGeometry.boundingSphere = new THREE.Sphere(
      new THREE.Vector3(0, 0, 0),
      100
    );

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(nodePositions, 3)
    );

    const pulseGeometry = new THREE.BufferGeometry();
    pulseGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(pulsePositions, 3)
    );

    return {
      paths,
      lineGeometry,
      nodeGeometry,
      pulseGeometry,
      linePositions,
      nodePositions,
      pulsePositions,
    };
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    const {
      paths,
      lineGeometry,
      nodeGeometry,
      pulseGeometry,
      linePositions,
      nodePositions,
      pulsePositions,
    } = sceneData;

    paths.forEach((path, pathIndex) => {
      const cos = Math.cos(path.angle);
      const sin = Math.sin(path.angle);

      const getPoint = (t: number) => {
        const x = (t - 0.5) * 68;

        const wave =
          Math.sin(
            x * path.frequency +
              time * path.speed +
              path.phase
          ) *
            path.amplitude +
          Math.sin(
            x * 0.075 -
              time * path.speed * 0.7 +
              path.phase
          ) *
            path.amplitude *
            0.45;

        const localY = path.height + wave;
        const localZ =
          path.depth +
          Math.sin(
            x * 0.11 + time * path.speed * 0.65 + path.phase
          ) *
            1.3;

        return {
          x: x * cos - localY * sin,
          y: x * sin + localY * cos,
          z: localZ,
        };
      };

      // Animate the complete flowing wire
      for (let i = 0; i < POINTS_PER_WIRE; i++) {
        const t = i / (POINTS_PER_WIRE - 1);
        const point = getPoint(t);
        const index = (pathIndex * POINTS_PER_WIRE + i) * 3;

        linePositions[index] = point.x;
        linePositions[index + 1] = point.y;
        linePositions[index + 2] = point.z;
      }

      // Small glowing connection points along the wires
      for (let i = 0; i < 7; i++) {
        const t = (i + 0.5) / 7;
        const point = getPoint(t);
        const index = (pathIndex * 7 + i) * 3;

        nodePositions[index] = point.x;
        nodePositions[index + 1] = point.y;
        nodePositions[index + 2] = point.z + 0.04;
      }

      // Moving light pulses
      for (let i = 0; i < 2; i++) {
        const t = (time * path.speed * 0.08 + i * 0.5 + pathIndex * 0.07) % 1;
        const point = getPoint(t);
        const index = (pathIndex * 2 + i) * 3;

        pulsePositions[index] = point.x;
        pulsePositions[index + 1] = point.y;
        pulsePositions[index + 2] = point.z + 0.1;
      }
    });

    lineGeometry.attributes.position.needsUpdate = true;
    nodeGeometry.attributes.position.needsUpdate = true;
    pulseGeometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* Soft outer glow */}
      <lineSegments geometry={sceneData.lineGeometry}>
        <lineBasicMaterial
          color="#2866A4"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Main fine wires */}
      <lineSegments geometry={sceneData.lineGeometry}>
        <lineBasicMaterial
          color="#6BADEB"
          transparent
          opacity={0.62}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Small connection lights */}
      <points geometry={sceneData.nodeGeometry}>
        <pointsMaterial
          color="#8BC8FF"
          size={0.085}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Moving light pulses */}
      <points geometry={sceneData.pulseGeometry}>
        <pointsMaterial
          color="#D5ECFF"
          size={0.19}
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export default function WireBackground() {
  return (
    <div className="wire-background" aria-hidden="true">
      <Canvas
        camera={{
          position: [0, 0, 38],
          fov: 48,
        }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <FlowingWires />
      </Canvas>
    </div>
  );
}
