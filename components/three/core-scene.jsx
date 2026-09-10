"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Html, OrbitControls, Line } from "@react-three/drei";

const NODE_DEFS = [
  { label: "Medical Records", color: "#2dd4bf", angle: 0.0 },
  { label: "Lab Reports", color: "#818cf8", angle: 1.26 },
  { label: "Medications", color: "#fbbf24", angle: 2.51 },
  { label: "Vitals", color: "#38bdf8", angle: 3.77 },
  { label: "Appointments", color: "#f472b6", angle: 5.03 },
];

const RADIUS = 3.1;

function nodePosition(angle, i) {
  return [Math.cos(angle) * RADIUS, Math.sin(i * 2.1) * 0.9, Math.sin(angle) * RADIUS];
}

function CoreOrb({ reduced }) {
  const group = React.useRef();
  const [hovered, setHovered] = React.useState(false);

  useFrame((state, delta) => {
    if (!group.current) return;
    const target = hovered ? 1.09 : 1;
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, target, delta * 4));
    if (!reduced) group.current.rotation.y += delta * 0.12;
  });

  return (
    <group
      ref={group}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Halo */}
      <mesh>
        <sphereGeometry args={[1.9, 32, 32]} />
        <meshBasicMaterial color="#14b8a6" transparent opacity={0.055} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      {/* Translucent outer sphere */}
      <mesh>
        <sphereGeometry args={[1.32, 48, 48]} />
        <meshPhysicalMaterial
          color="#0f9e94"
          transparent
          opacity={0.32}
          roughness={0.12}
          metalness={0.18}
          clearcoat={0.7}
          clearcoatRoughness={0.25}
        />
      </mesh>
      {/* Inner luminous core */}
      <mesh>
        <sphereGeometry args={[0.72, 32, 32]} />
        <meshBasicMaterial color="#5eead4" transparent opacity={0.85} />
      </mesh>
      <pointLight color="#2dd4bf" intensity={reduced ? 1.4 : 2.1} distance={9} decay={1.6} />
    </group>
  );
}

function Rings({ reduced }) {
  const r1 = React.useRef();
  const r2 = React.useRef();
  const r3 = React.useRef();

  useFrame((_, delta) => {
    if (reduced) return;
    if (r1.current) r1.current.rotation.z += delta * 0.16;
    if (r2.current) r2.current.rotation.z -= delta * 0.11;
    if (r3.current) r3.current.rotation.z += delta * 0.07;
  });

  const ringMaterial = (color, opacity) => (
    <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
  );

  return (
    <group rotation={[0.5, 0, -0.15]}>
      <group ref={r1} rotation={[Math.PI / 2.25, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.15, 0.014, 12, 96]} />
          {ringMaterial("#2dd4bf", 0.5)}
        </mesh>
      </group>
      <group ref={r2} rotation={[Math.PI / 1.85, 0.4, 0]}>
        <mesh>
          <torusGeometry args={[2.75, 0.011, 12, 96]} />
          {ringMaterial("#818cf8", 0.4)}
        </mesh>
      </group>
      <group ref={r3} rotation={[Math.PI / 1.6, -0.35, 0]}>
        <mesh>
          <torusGeometry args={[3.4, 0.009, 12, 96]} />
          {ringMaterial("#38bdf8", 0.28)}
        </mesh>
      </group>
    </group>
  );
}

function DataNodes({ reduced, showLabels }) {
  const group = React.useRef();

  useFrame((_, delta) => {
    if (!group.current || reduced) return;
    group.current.rotation.y += delta * 0.14;
  });

  return (
    <group ref={group}>
      {NODE_DEFS.map((node, i) => {
        const pos = nodePosition(node.angle, i);
        return (
          <group key={node.label} position={pos}>
            <Line points={[pos, [0, 0, 0]]} color={node.color} transparent opacity={0.22} lineWidth={1} />
            <mesh>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshBasicMaterial color={node.color} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.17, 16, 16]} />
              <meshBasicMaterial color={node.color} transparent opacity={0.18} depthWrite={false} />
            </mesh>
            {showLabels && (
              <Html center distanceFactor={9} zIndexRange={[10, 0]} style={{ pointerEvents: "none" }} ariaHidden>
                <div
                  style={{
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    color: "#e2e8f0",
                    background: "rgba(11,17,32,0.72)",
                    border: `1px solid ${node.color}55`,
                    borderRadius: "999px",
                    padding: "4px 10px",
                    backdropFilter: "blur(6px)",
                    transform: "translateY(-24px)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: node.color, display: "inline-block" }} />
                  {node.label}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

export default function CoreScene({ reduced = false, showLabels = true }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.6, 9.6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[6, 6, 6]} intensity={0.9} color="#e0f2fe" />
      <Float speed={reduced ? 0 : 1.1} rotationIntensity={reduced ? 0 : 0.35} floatIntensity={reduced ? 0 : 0.55}>
        <CoreOrb reduced={reduced} />
        <Rings reduced={reduced} />
        <DataNodes reduced={reduced} showLabels={showLabels} />
      </Float>
      {!reduced && <Sparkles count={64} scale={[9, 6, 9]} size={1.5} speed={0.32} opacity={0.42} color="#99f6e4" />}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reduced}
        autoRotateSpeed={0.55}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.7}
      />
    </Canvas>
  );
}
