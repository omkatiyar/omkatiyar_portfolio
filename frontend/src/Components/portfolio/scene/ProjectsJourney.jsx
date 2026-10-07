import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { projectsStore, contactStore, experienceStore } from './experienceStore';
import { AMBER, CYAN } from './SpecVisual';
import { getExperienceEndZ } from './ExperienceJourney';

/**
 * The Projects "engineering lab", rendered in the SAME canvas. It starts
 * exactly where the Experience tunnel leaves the camera, flies out of the
 * tunnel, then follows an S-curve through five small system demos (one per
 * project in the repo). After the last project everything converges on a
 * single glowing core — the visual anchor the Contact section inherits.
 *
 * All real project copy lives in HTML (ProjectSection); this is only the
 * abstract visualization of what each project does.
 */

const smooth = THREE.MathUtils.smoothstep;

const INTRO_TRAVEL = 16;
const TUNNEL_LABELS = ['API', 'QUEUE', 'CACHE', 'DB', 'AI', 'AUTH'];

// Text baked into small canvas textures -> real 3D sprites, so labels genuinely
// fly past the camera in perspective (and cost no DOM).
function makeLabelTexture(text) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 96;
  const g = c.getContext('2d');
  g.fillStyle = 'rgba(5,7,13,0.65)';
  g.strokeStyle = 'rgba(251,191,36,0.55)';
  g.lineWidth = 3;
  g.beginPath();
  g.roundRect(6, 6, 244, 84, 42);
  g.fill();
  g.stroke();
  g.fillStyle = 'rgba(234,220,186,0.95)';
  g.font = '600 34px ui-monospace, Menlo, Consolas, monospace';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text.split('').join(' '), 128, 50);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function TunnelLabels({ zEnd }) {
  const { camera } = useThree();
  const mats = useRef([]);
  const items = useMemo(
    () =>
      TUNNEL_LABELS.map((label, i) => {
        const a = i * 2.1 + 0.6;
        return {
          label,
          pos: [Math.cos(a) * 1.5, Math.sin(a) * 1.5, zEnd - 2.5 - i * 2.4],
          tex: makeLabelTexture(label),
        };
      }),
    [zEnd]
  );

  useEffect(() => () => items.forEach((it) => it.tex.dispose()), [items]);

  useFrame(() => {
    const introFade = 1 - smooth(projectsStore.head, 0.25, 0.5);
    items.forEach((it, i) => {
      const m = mats.current[i];
      if (!m) return;
      const d = camera.position.z - it.pos[2]; // > 0 while the label is still ahead
      m.opacity = d <= 0 ? 0 : smooth(d, 1, 4) * (1 - smooth(d, 8, 13)) * introFade;
    });
  });

  return (
    <>
      {items.map((it, i) => (
        <sprite key={it.label} position={it.pos} scale={[1.1, 0.41, 1]}>
          <spriteMaterial
            ref={(m) => (mats.current[i] = m)}
            map={it.tex}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </sprite>
      ))}
    </>
  );
}

/** The single glowing core everything converges on — Contact's visual anchor. */
function ConvergenceCore({ position, groupRef, visRef, pointer, reducedMotion, isMobile }) {
  const aim = useRef({ x: 0, y: 0, hot: 0 });
  const sphereMat = useRef();
  const icoMat = useRef();
  const ringMats = useRef([]);
  const spin = useRef();

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    // Once Contact is reached the core shrinks to fit above the contact card, and on phones —
    // where the card fills the screen — it dims to an ambient glow behind it.
    const settle = smooth(projectsStore.tail, 0.7, 1);
    const v = visRef.current * (isMobile ? 1 - 0.6 * smooth(projectsStore.tail, 0.85, 1) : 1);
    g.visible = v > 0.01;
    if (!g.visible) return;
    // The core "looks at" the cursor and flares when the Email button is hovered.
    const f = 1 - Math.pow(0.002, delta);
    const tx = reducedMotion ? 0 : pointer.current.x;
    const ty = reducedMotion ? 0 : pointer.current.y;
    aim.current.x += (tx - aim.current.x) * f;
    aim.current.y += (ty - aim.current.y) * f;
    aim.current.hot += (contactStore.hot - aim.current.hot) * f;
    const hot = aim.current.hot;
    g.rotation.set(aim.current.y * 0.45, aim.current.x * 0.6, 0);

    const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 1.2) * 0.04;
    g.scale.setScalar((0.35 + 0.65 * v) * pulse * (1 + 0.08 * hot) * (1 - 0.42 * settle));
    if (sphereMat.current) {
      sphereMat.current.opacity = v;
      sphereMat.current.emissiveIntensity = 0.8 + 1.4 * v + 1.4 * hot;
    }
    if (icoMat.current) icoMat.current.opacity = (0.35 + 0.3 * hot) * v;
    ringMats.current.forEach((m, i) => m && (m.opacity = (0.4 - i * 0.12 + 0.25 * hot) * v));
    if (spin.current) spin.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={groupRef} position={position} visible={false}>
      <mesh>
        <sphereGeometry args={[0.36, 24, 24]} />
        <meshStandardMaterial
          ref={sphereMat}
          color={AMBER}
          emissive="#f59e0b"
          emissiveIntensity={1.4}
          roughness={0.35}
          transparent
          opacity={0}
        />
      </mesh>
      <group ref={spin}>
        <mesh>
          <icosahedronGeometry args={[1.0, 1]} />
          <meshBasicMaterial ref={icoMat} color={AMBER} wireframe transparent opacity={0} />
        </mesh>
        {[1.5, 2.0].map((r, i) => (
          <mesh key={r} rotation={[Math.PI / (2.4 + i * 0.6), i * 0.5, 0]}>
            <torusGeometry args={[r, 0.01, 8, 80]} />
            <meshBasicMaterial
              ref={(m) => (ringMats.current[i] = m)}
              color={i ? AMBER : CYAN}
              transparent
              opacity={0}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function ProjectsJourney({ pointer, reducedMotion, isMobile, suppress }) {
  const { camera } = useThree();
  const rootRef = useRef();
  const lightRef = useRef();
  const particleMat = useRef();
  const coreGroup = useRef();
  const coreVis = useRef(0);
  const eS = useRef(0);

  const zEnd = getExperienceEndZ(isMobile);
  // Where the camera rests once it has left the tunnel (the book is HTML in front of this).
  const rest = useMemo(() => new THREE.Vector3(isMobile ? 0 : 1.7, 0, zEnd - INTRO_TRAVEL), [isMobile, zEnd]);
  const corePos = useMemo(() => new THREE.Vector3(0, 0, rest.z - 24), [rest]);

  const particleCount = isMobile ? 45 : 170;
  const particles = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 11;
      arr[i * 3 + 2] = rest.z + 8 - Math.random() * 60;
    }
    return arr;
  }, [particleCount, rest]);

  // Scratch vectors reused every frame — no per-frame allocation.
  const tmp = useMemo(
    () => ({ pose: new THREE.Vector3(), look: new THREE.Vector3(), final: new THREE.Vector3(), aimAt: new THREE.Vector3() }),
    []
  );

  useFrame((state, delta) => {
    const { enter, tail, head } = projectsStore;
    // Projects is pinned while Experience's tunnel is still finishing, so it only takes the
    // shared camera once Experience's own camera travel is done.
    const ctrl = enter > 0.02 && experienceStore.tail > 0.98;
    if (ctrl && suppress) suppress.current = true;

    const conv = smooth(tail, 0, 1);
    coreVis.current = smooth(tail, 0.15, 0.9);
    const vis = smooth(enter, 0.35, 0.9);
    if (rootRef.current) rootRef.current.visible = vis > 0.005 || coreVis.current > 0.01;
    if (particleMat.current) particleMat.current.opacity = 0.3 * vis * (1 - 0.6 * conv);
    if (!ctrl) return;

    // Tunnel exit: still inside Experience's tunnel at head = 0, out in open space by head = 0.3.
    const eTarget = reducedMotion ? 1 : smooth(head, 0, 0.3);
    eS.current += (eTarget - eS.current) * (1 - Math.pow(0.02, delta));
    tmp.pose.set(rest.x * eS.current, 0, rest.z + (1 - eS.current) * INTRO_TRAVEL);
    tmp.look.set(tmp.pose.x, 0, tmp.pose.z - 10);

    // Ending: pull back and look at the core, which sits in the upper part of the screen
    // so the Contact content can sit below it.
    if (conv > 0) {
      tmp.final.set(0, 0, corePos.z + 8);
      tmp.pose.lerp(tmp.final, conv);
      tmp.aimAt.set(corePos.x, corePos.y - (isMobile ? 2.0 : 2.15), corePos.z);
      tmp.look.lerp(tmp.aimAt, conv);
    }
    camera.position.copy(tmp.pose);
    camera.lookAt(tmp.look);

    if (lightRef.current) lightRef.current.position.set(tmp.pose.x + 2, 2, tmp.pose.z - 3);
  });

  return (
    <group>
      <pointLight ref={lightRef} color={AMBER} intensity={1.6} distance={22} />
      <group ref={rootRef} visible={false}>
        {!isMobile && !reducedMotion && <TunnelLabels zEnd={zEnd} />}

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

        <ConvergenceCore
          position={corePos}
          groupRef={coreGroup}
          visRef={coreVis}
          pointer={pointer}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
        />
      </group>
    </group>
  );
}
