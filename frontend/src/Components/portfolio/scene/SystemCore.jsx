import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Line, Html } from '@react-three/drei';

/**
 * The "system core" — a living distributed-system visualization.
 * One persistent scene: a layered computational core, orbiting
 * architecture nodes (API / QUEUE / AI / DATABASE / AUTH / CLOUD),
 * directed data-flow packets traveling along real edges, and a
 * restrained ambient particle field. Driven entirely from useFrame —
 * no per-frame React state, no re-renders.
 */

const AMBER = '#fbbf24';
const AMBER_DIM = '#f59e0b';
const CYAN = '#38bdf8';
const OFFWHITE = '#e7e9ee';

// Positions are defined directly in the camera-facing XY plane (not the
// XZ "table-top" plane) so `angle` controls real left/right + up/down
// screen placement. Desktop clusters nodes into the left/right margins,
// clear of the center text column; mobile clusters them above/below the
// stacked text instead, since there's no horizontal margin to use.
const NODE_DEFS_DESKTOP = [
  { key: 'QUEUE', angle: 0, radius: 5.0, z: 0.4, color: OFFWHITE },
  { key: 'API', angle: 24, radius: 5.0, z: -0.3, color: OFFWHITE },
  { key: 'DATABASE', angle: -24, radius: 5.0, z: 0.2, color: OFFWHITE },
  { key: 'CLOUD', angle: 180, radius: 5.0, z: -0.4, color: OFFWHITE },
  { key: 'AUTH', angle: 156, radius: 5.0, z: 0.3, color: OFFWHITE },
  { key: 'AI', angle: -156, radius: 5.0, z: -0.2, color: CYAN },
];

const NODE_DEFS_MOBILE = [
  { key: 'API', angle: 90, radius: 3.2, z: 0.3, color: OFFWHITE },
  { key: 'AI', angle: 70, radius: 3.2, z: -0.3, color: CYAN },
  { key: 'DATABASE', angle: -90, radius: 3.2, z: 0.3, color: OFFWHITE },
  { key: 'CLOUD', angle: -70, radius: 3.2, z: -0.3, color: OFFWHITE },
];

const EDGES_DESKTOP = [
  ['AUTH', 'API'],
  ['API', 'QUEUE'],
  ['QUEUE', 'DATABASE'],
  ['AI', 'API'],
  ['AI', 'DATABASE'],
  ['CLOUD', 'API'],
];

const EDGES_MOBILE = [
  ['AI', 'API'],
  ['API', 'DATABASE'],
  ['CLOUD', 'API'],
];

function nodePosition(def) {
  const rad = THREE.MathUtils.degToRad(def.angle);
  return new THREE.Vector3(Math.cos(rad) * def.radius, Math.sin(rad) * def.radius, def.z || 0);
}

function NodeLabel({ label, accent, labelRef }) {
  return (
    <Html center distanceFactor={9} transform sprite occlude={false} style={{ pointerEvents: 'none' }}>
      <div
        ref={labelRef}
        className="whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] backdrop-blur-sm"
        style={{
          borderColor: accent ? 'rgba(56,189,248,0.35)' : 'rgba(251,191,36,0.3)',
          background: 'rgba(5,7,13,0.55)',
          color: accent ? 'rgba(165,230,255,0.9)' : 'rgba(234,220,186,0.85)',
        }}
      >
        {label}
      </div>
    </Html>
  );
}

export default function SystemCore({ pointer, scrollProgress, reducedMotion, isMobile, suppress }) {
  const { camera } = useThree();

  const nodeDefs = isMobile ? NODE_DEFS_MOBILE : NODE_DEFS_DESKTOP;
  const edgeDefs = isMobile ? EDGES_MOBILE : EDGES_DESKTOP;

  const nodePositions = useMemo(() => {
    const map = {};
    nodeDefs.forEach((def) => {
      map[def.key] = nodePosition(def);
    });
    return map;
  }, [nodeDefs]);

  const edges = useMemo(
    () =>
      edgeDefs.map(([from, to], i) => ({
        from,
        to,
        a: nodePositions[from],
        b: nodePositions[to],
        speed: 0.22 + (i % 3) * 0.05,
        offset: i / edgeDefs.length,
      })),
    [edgeDefs, nodePositions]
  );

  const particlePositions = useMemo(() => {
    const count = isMobile ? 60 : 220;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi) * 0.6;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [isMobile]);

  const rigRef = useRef();
  const visualsRef = useRef();
  const coreGroupRef = useRef();
  const nodesGroupRef = useRef();
  const innerSphereRef = useRef();
  const ringARef = useRef();
  const ringBRef = useRef();
  const icoRef = useRef();
  const particlesRef = useRef();
  const nodeMatRefs = useRef([]);
  const labelRefs = useRef([]);
  const packetRefs = useRef([]);

  const rotX = useRef(0);
  const rotY = useRef(0);
  const camZ = useRef(camera.position.z);
  const started = useRef(null);
  // Smoothed 1 -> 0 factor: lets another section (Experience) take over the
  // shared camera/origin without this rig's geometry visually colliding
  // with whatever is built further down the same Z axis.
  const suppressScale = useRef(1);

  // Must match the initial camera z set on <Canvas> in SystemScene, or the
  // dolly lerp drifts the camera on load even with zero scroll.
  const baseCamZ = isMobile ? 12.5 : 10.5;

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    const suppressTarget = suppress?.current ? 0.001 : 1;
    suppressScale.current = THREE.MathUtils.lerp(
      suppressScale.current,
      suppressTarget,
      1 - Math.pow(0.001, delta)
    );
    if (visualsRef.current) visualsRef.current.scale.setScalar(suppressScale.current);
    // drei <Html> labels are plain DOM and ignore 3D scale/visibility, so fade them by hand.
    labelRefs.current.forEach((el) => {
      if (el) el.style.opacity = String(suppressScale.current);
    });

    if (reducedMotion) {
      // Static premium composition — settle once at a pleasant angle, no travel.
      if (rigRef.current) rigRef.current.rotation.set(0, 0, 0);
      if (coreGroupRef.current) coreGroupRef.current.scale.setScalar(1);
      if (nodesGroupRef.current) nodesGroupRef.current.scale.setScalar(1);
      if (!suppress?.current) {
        camera.position.z = baseCamZ;
        camera.lookAt(0, 0, 0);
      }
      return;
    }

    // ---- intro assembly (fade + scale in once on mount) ----
    if (started.current === null) started.current = t;
    const elapsed = t - started.current;
    const coreIntro = THREE.MathUtils.smoothstep(elapsed, 0.05, 1.1);
    const nodesIntro = THREE.MathUtils.smoothstep(elapsed, 0.5, 1.7);

    if (coreGroupRef.current) {
      coreGroupRef.current.scale.setScalar(0.3 + coreIntro * 0.7);
    }
    if (nodesGroupRef.current) {
      const expand = THREE.MathUtils.lerp(1, 1.45, scrollProgress.current);
      nodesGroupRef.current.scale.setScalar((0.6 + nodesIntro * 0.4) * expand);
    }

    // ---- gentle continuous rotation ----
    if (coreGroupRef.current) {
      icoRef.current && (icoRef.current.rotation.y += delta * 0.08);
      ringARef.current && (ringARef.current.rotation.z += delta * 0.12);
      ringBRef.current && (ringBRef.current.rotation.z -= delta * 0.07);
    }
    if (nodesGroupRef.current) {
      nodesGroupRef.current.rotation.y += delta * 0.045 + scrollProgress.current * delta * 0.1;
    }
    if (innerSphereRef.current) {
      const pulse = 1 + Math.sin(t * 1.4) * 0.05;
      innerSphereRef.current.scale.setScalar(pulse);
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.01;
    }

    // ---- pointer parallax (subtle, 1-3 degree feel) ----
    const targetY = pointer.current.x * THREE.MathUtils.degToRad(3);
    const targetX = -pointer.current.y * THREE.MathUtils.degToRad(2);
    rotY.current = THREE.MathUtils.lerp(rotY.current, targetY, 1 - Math.pow(0.001, delta));
    rotX.current = THREE.MathUtils.lerp(rotX.current, targetX, 1 - Math.pow(0.001, delta));
    if (rigRef.current) {
      rigRef.current.rotation.y = rotY.current;
      rigRef.current.rotation.x = rotX.current;
    }

    // ---- scroll-driven dolly ----
    const targetZ = THREE.MathUtils.lerp(baseCamZ, baseCamZ - 2.4, scrollProgress.current);
    camZ.current = THREE.MathUtils.lerp(camZ.current, targetZ, 1 - Math.pow(0.0005, delta));
    camera.position.z = camZ.current;
    camera.lookAt(0, 0, 0);

    // ---- data packets traveling along edges, feeding receiving-node glow ----
    const glow = new Array(nodeDefs.length).fill(0);
    edges.forEach((edge, i) => {
      const localT = ((t * edge.speed + edge.offset) % 1 + 1) % 1;
      const eased = localT * localT * (3 - 2 * localT);
      const mesh = packetRefs.current[i];
      if (mesh) {
        mesh.position.lerpVectors(edge.a, edge.b, eased);
        const envelope = Math.sin(Math.PI * localT);
        mesh.material.opacity = Math.max(0, envelope) * 0.9;
        mesh.scale.setScalar(0.6 + envelope * 0.6);
      }
      if (localT > 0.82) {
        const idx = nodeDefs.findIndex((n) => n.key === edge.to);
        if (idx >= 0) {
          const arrival = Math.pow((localT - 0.82) / 0.18, 2);
          glow[idx] = Math.max(glow[idx], arrival);
        }
      }
    });
    nodeMatRefs.current.forEach((mat, i) => {
      if (!mat) return;
      const base = (nodeDefs[i].color === CYAN ? 0.9 : 0.6) * (isMobile ? 0.45 : 1);
      mat.emissiveIntensity = base + glow[i] * (isMobile ? 0.8 : 1.6);
    });
  });

  return (
    <group ref={rigRef}>
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 2, 4]} color={AMBER} intensity={1.1} distance={14} />
      <pointLight position={[-4, -2, -3]} intensity={0.5} color={CYAN} distance={14} />

      <group ref={visualsRef}>
      {/* ambient particle field */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlePositions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color={AMBER}
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* system core */}
      <group ref={coreGroupRef}>
        <mesh ref={innerSphereRef}>
          <sphereGeometry args={[0.45, 24, 24]} />
          <meshStandardMaterial
            color={AMBER}
            emissive={AMBER_DIM}
            emissiveIntensity={1.4}
            roughness={0.35}
            metalness={0.2}
          />
        </mesh>

        <mesh ref={icoRef}>
          <icosahedronGeometry args={[1.3, 1]} />
          <meshBasicMaterial color={AMBER} wireframe transparent opacity={0.22} />
        </mesh>

        <mesh ref={ringARef} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[2.05, 0.012, 8, 96]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.3} />
        </mesh>

        <mesh ref={ringBRef} rotation={[Math.PI / 1.8, 0.4, 0]}>
          <torusGeometry args={[2.55, 0.01, 8, 96]} />
          <meshBasicMaterial color={AMBER} transparent opacity={0.22} />
        </mesh>
      </group>

      {/* architecture nodes + spokes + labels */}
      <group ref={nodesGroupRef}>
        {nodeDefs.map((def, i) => {
          const pos = nodePositions[def.key];
          const accent = def.color === CYAN;
          return (
            <group key={def.key} position={pos}>
              <mesh>
                <octahedronGeometry args={[0.16, 0]} />
                <meshStandardMaterial
                  ref={(m) => (nodeMatRefs.current[i] = m)}
                  color={def.color}
                  emissive={def.color}
                  emissiveIntensity={accent ? 0.9 : 0.6}
                  roughness={0.4}
                  metalness={0.1}
                />
              </mesh>
              {/* Labels read as readable text on top of readable text — skip
                  them on mobile where there's no horizontal margin to hide
                  them in, and keep only the abstract node geometry. */}
              {!isMobile && <NodeLabel label={def.key} accent={accent} labelRef={(el) => (labelRefs.current[i] = el)} />}
            </group>
          );
        })}

        {/* spokes: each node tethered back to the core, showing one architecture */}
        {nodeDefs.map((def) => (
          <Line
            key={`spoke-${def.key}`}
            points={[[0, 0, 0], nodePositions[def.key].toArray()]}
            color={def.color === CYAN ? CYAN : AMBER}
            transparent
            opacity={0.1}
            lineWidth={1}
          />
        ))}

        {/* directed data-flow edges */}
        {edges.map((edge) => (
          <Line
            key={`edge-${edge.from}-${edge.to}`}
            points={[edge.a.toArray(), edge.b.toArray()]}
            color={OFFWHITE}
            transparent
            opacity={0.14}
            lineWidth={1}
          />
        ))}

        {/* traveling packets */}
        {edges.map((edge, i) => (
          <mesh key={`packet-${edge.from}-${edge.to}`} ref={(m) => (packetRefs.current[i] = m)}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial
              color={edge.to === 'AI' || edge.from === 'AI' ? CYAN : AMBER}
              transparent
              opacity={0}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
      </group>
    </group>
  );
}
