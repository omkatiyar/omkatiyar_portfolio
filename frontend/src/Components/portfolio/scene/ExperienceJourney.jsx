import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { experienceStore, projectsStore } from './experienceStore';
import { SpecVisual, AMBER, CYAN, OFFWHITE, P } from './SpecVisual';

/**
 * The Work Experience career path, rendered inside the SAME canvas as the
 * Hero system (no second renderer). Four checkpoints sit along -Z in
 * newest-first order; the camera flies down that axis as the user
 * scrolls. Only abstract visualization lives here — all real career
 * content is HTML (see ExperienceSection).
 *
 * Camera ownership: this component's useFrame is mounted after SystemCore's,
 * so while Experience is active it wins the shared camera. At cp = 0 its
 * pose is identical to where the Hero dolly leaves the camera, so the
 * handoff has no pop.
 */


// Newest first (Airawat, Turing, InsuranceDekho, Samsung) — must match the order in ExperienceSection.
// Each spec only visualizes what the HTML copy for that company actually says.
const SPECS = [
  {
    // Airawat: user -> Keycloak SSO -> permission-check API -> OpenFGA, serving internal apps
    nodes: [
      { p: P(-2.4), kind: 'oct', color: OFFWHITE, size: 0.12 },
      { p: P(-1.2, 0.45), kind: 'box', color: CYAN, size: 0.17 },
      { p: P(0), kind: 'oct', color: AMBER, size: 0.22 },
      { p: P(1.1, -0.5), kind: 'stack', color: AMBER, size: 0.2 },
      { p: P(2.4, 0.9), kind: 'oct', color: OFFWHITE, size: 0.11 },
      { p: P(2.4, 0.05), kind: 'oct', color: OFFWHITE, size: 0.11 },
      { p: P(2.4, -0.8), kind: 'oct', color: OFFWHITE, size: 0.11 },
    ],
    links: [[0, 1], [1, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
    paths: [
      { via: [0, 1, 2, 3], count: 1, speed: 0.14 },
      { via: [4, 2, 3, 2, 4], count: 1, speed: 0.18 },
      { via: [6, 2, 3, 2, 6], count: 1, speed: 0.16 },
    ],

  },
  {
    // Turing: isolated language sandboxes -> Redis aggregation -> evaluation -> RLHF data
    nodes: [
      { p: P(-2.3, 1.05), kind: 'cell', color: CYAN, size: 0.13 },
      { p: P(-2.3, 0.35), kind: 'cell', color: CYAN, size: 0.13 },
      { p: P(-2.3, -0.35), kind: 'cell', color: CYAN, size: 0.13 },
      { p: P(-2.3, -1.05), kind: 'cell', color: CYAN, size: 0.13 },
      { p: P(-0.6), kind: 'oct', color: AMBER, size: 0.22 },
      { p: P(0.9), kind: 'stack', color: AMBER, size: 0.2 },
      { p: P(2.3), kind: 'oct', color: OFFWHITE, size: 0.14 },
    ],
    links: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 5], [5, 6]],
    paths: [
      { via: [0, 4, 5, 6], count: 1, speed: 0.15 },
      { via: [1, 4, 5, 6], count: 1, speed: 0.18 },
      { via: [2, 4, 5, 6], count: 1, speed: 0.21 },
      { via: [3, 4, 5, 6], count: 1, speed: 0.17 },
    ],
  },
  {
    // InsuranceDekho: 4 services -> RabbitMQ -> single consumer -> partners, DLQ/retry branch
    nodes: [
      { p: P(-2.3, 0.9), kind: 'oct', color: OFFWHITE, size: 0.1 },
      { p: P(-2.3, 0.3), kind: 'oct', color: OFFWHITE, size: 0.1 },
      { p: P(-2.3, -0.3), kind: 'oct', color: OFFWHITE, size: 0.1 },
      { p: P(-2.3, -0.9), kind: 'oct', color: OFFWHITE, size: 0.1 },
      { p: P(-0.8), kind: 'stack', color: AMBER, size: 0.2 },
      { p: P(0.7), kind: 'oct', color: AMBER, size: 0.2 },
      { p: P(2.2, 0.4), kind: 'box', color: OFFWHITE, size: 0.17 },
      { p: P(0.7, -1.15), kind: 'box', color: CYAN, size: 0.13 },
    ],
    links: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 5], [5, 6], [5, 7]],
    paths: [
      { via: [0, 4, 5, 6], count: 1, speed: 0.2 },
      { via: [1, 4, 5, 6], count: 1, speed: 0.23 },
      { via: [2, 4, 5, 6], count: 1, speed: 0.26 },
      { via: [3, 4, 5, 6], count: 1, speed: 0.21 },
      { via: [5, 7, 5], count: 1, speed: 0.22, color: CYAN },
    ],
  },
  {
    // Samsung: raw sensor input -> preprocessing -> UNet -> RGB output
    nodes: [
      { p: P(-2.1), kind: 'box', color: CYAN, size: 0.2 },
      { p: P(-0.7), kind: 'oct', color: OFFWHITE, size: 0.17 },
      { p: P(0.7), kind: 'stack', color: AMBER, size: 0.2 },
      { p: P(2.1), kind: 'box', color: AMBER, size: 0.2 },
    ],
    links: [[0, 1], [1, 2], [2, 3]],
    paths: [{ via: [0, 1, 2, 3], count: 3, speed: 0.16, ramp: true }],
  }
];

const N = SPECS.length;

/** Experience -> Projects handoff: an aperture opens past the last company
 *  and the camera flies through a short corridor of rings and node glyphs. */
function Tunnel({ zStart, reducedMotion, isMobile }) {
  const groupRef = useRef();
  const ringMats = useRef([]);
  const glyphMat = useRef();
  const RINGS = isMobile ? 5 : 7;
  const GLYPHS = isMobile ? 8 : 16;

  const glyphs = useMemo(
    () =>
      Array.from({ length: GLYPHS }, (_, i) => {
        const a = (i / GLYPHS) * Math.PI * 2 + i * 0.7;
        const r = 2.6 + ((i * 37) % 10) / 10;
        return { x: Math.cos(a) * r, y: Math.sin(a) * r, z: -((i * 53) % 100) / 100 * RINGS * 3.6, s: 0.08 + ((i * 17) % 5) * 0.015 };
      }),
    [GLYPHS, RINGS]
  );

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const tail = reducedMotion ? 0 : experienceStore.tail;
    const open = THREE.MathUtils.smoothstep(tail, 0.03, 0.6);
    g.visible = open > 0.01;
    if (!g.visible) return;
    g.scale.setScalar(0.45 + 0.55 * open);
    const fadeOut = 1 - THREE.MathUtils.smoothstep(projectsStore.head, 0.3, 0.6);
    ringMats.current.forEach((m, i) => m && (m.opacity = (0.15 + 0.5 * (1 - i / RINGS)) * open * fadeOut));
    if (glyphMat.current) glyphMat.current.opacity = 0.7 * open * fadeOut;
    g.rotation.z += delta * 0.05;
  });

  return (
    <group ref={groupRef} position={[0, 0, zStart]} visible={false}>
      {Array.from({ length: RINGS }, (_, i) => (
        <mesh key={i} position={[0, 0, -i * 3.6]}>
          <torusGeometry args={[2.4, 0.02, 8, 80]} />
          <meshBasicMaterial
            ref={(m) => (ringMats.current[i] = m)}
            color={i % 2 ? CYAN : AMBER}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
      {glyphs.map((gl, i) => (
        <mesh key={`g-${i}`} position={[gl.x, gl.y, gl.z]} scale={gl.s / 0.1}>
          <octahedronGeometry args={[0.1, 0]} />
          <meshBasicMaterial
            ref={i === 0 ? glyphMat : undefined}
            color={i % 3 === 0 ? CYAN : AMBER}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Where the Experience camera ends up inside the tunnel; Projects starts from exactly here. */
export function getExperienceEndZ(isMobile) {
  const spacing = isMobile ? 6 : 9;
  const dist = isMobile ? 10.1 : 8.1;
  const tailTravel = isMobile ? 20 : 26;
  return -(N - 1) * spacing + dist - tailTravel;
}

export default function ExperienceJourney({ pointer, reducedMotion, isMobile, suppress, vignetteRef }) {
  const { camera } = useThree();
  const rootRef = useRef();
  const lightRef = useRef();
  const st = useMemo(() => ({ cpS: 0, cpRaw: 0, vis: 0, conv: 0 }), []);

  const spacing = isMobile ? 6 : 9;
  const dist = isMobile ? 10.1 : 8.1; // must equal where Hero's dolly leaves the camera
  const tailTravel = isMobile ? 20 : 26;
  const nodeX = isMobile ? 0 : -2.0;
  const nodeY = isMobile ? 2.8 : 0.2;
  const scale = isMobile ? 0.62 : 0.6;
  const zLast = -(N - 1) * spacing;
  const positions = useMemo(
    () => SPECS.map((_, i) => [nodeX, nodeY, -i * spacing]),
    [nodeX, nodeY, spacing]
  );

  // Shared by all visuals; shape is a dummy so group transforms stay in one place.
  const particleCount = isMobile ? 50 : 180;
  const particles = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    const depth = (N - 1) * spacing + 50;
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = 6 - Math.random() * depth;
    }
    return arr;
  }, [particleCount, spacing]);

  const spine = useMemo(() => {
    const pts = [];
    for (let i = 0; i < N; i++) pts.push(new THREE.Vector3(nodeX, nodeY, -i * spacing));
    pts.push(new THREE.Vector3(0, 0, zLast - 8));
    const arr = new Float32Array((pts.length - 1) * 6);
    for (let i = 0; i < pts.length - 1; i++) {
      pts[i].toArray(arr, i * 6);
      pts[i + 1].toArray(arr, i * 6 + 3);
    }
    return arr;
  }, [nodeX, nodeY, spacing, zLast]);

  const spineMat = useRef();
  const particleMat = useRef();

  useFrame((state, delta) => {
    const { enter, cp, tail } = experienceStore;
    const ctrl = enter > 0.02;
    if (suppress) suppress.current = ctrl;
    if (vignetteRef?.current) {
      vignetteRef.current.style.opacity = String(1 - 0.88 * THREE.MathUtils.smoothstep(enter, 0.1, 0.8));
    }

    // Stay alive through the tunnel until the Projects journey has taken the camera and exited it.
    st.vis = THREE.MathUtils.smoothstep(enter, 0.15, 0.9) * (1 - THREE.MathUtils.smoothstep(projectsStore.head, 0.3, 0.6));
    if (rootRef.current) rootRef.current.visible = st.vis > 0.005;
    if (spineMat.current) spineMat.current.opacity = 0.2 * st.vis;
    if (particleMat.current) particleMat.current.opacity = 0.3 * st.vis;
    if (!ctrl) return;

    const cpTarget = Math.min(N - 1, Math.max(0, cp));
    st.cpRaw = cpTarget;
    if (reducedMotion) st.cpS = Math.round(cpTarget);
    else st.cpS += (cpTarget - st.cpS) * (1 - Math.pow(0.02, delta));

    const tailE = reducedMotion ? 0 : THREE.MathUtils.smoothstep(tail, 0, 1);
    const z = -st.cpS * spacing + dist - tailE * tailTravel;
    const sway = isMobile || reducedMotion ? 0 : Math.sin(st.cpS * Math.PI * 0.9) * 0.35 * (1 - tailE);
    camera.position.set(sway, 0, z);
    camera.lookAt(sway * 0.4, 0, z - 10);

    if (lightRef.current) lightRef.current.position.set(sway + 2, 2, z - 3);
  });

  return (
    <group>
      <pointLight ref={lightRef} color={AMBER} intensity={1.6} distance={22} />
      <group ref={rootRef} visible={false}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={spine.length / 3} array={spine} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial ref={spineMat} color={AMBER} transparent opacity={0} />
        </lineSegments>

        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particles.length / 3}
              array={particles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            ref={particleMat}
            size={0.045}
            color={AMBER}
            transparent
            opacity={0}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {SPECS.map((spec, i) => (
          <SpecVisual
            key={i}
            spec={spec}
            index={i}
            position={positions[i]}
            scale={scale}
            st={st}
            pointer={pointer}
            reducedMotion={reducedMotion}
            isMobile={isMobile}
          />
        ))}

        <Tunnel zStart={zLast - 8} reducedMotion={reducedMotion} isMobile={isMobile} />
      </group>
    </group>
  );
}
