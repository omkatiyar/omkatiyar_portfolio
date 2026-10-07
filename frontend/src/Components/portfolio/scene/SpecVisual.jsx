import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const AMBER = '#fbbf24';
export const CYAN = '#38bdf8';
export const OFFWHITE = '#e7e9ee';
export const P = (x, y = 0, z = 0) => [x, y, z];

/**
 * Shared "small system demo" renderer used by both the Experience and
 * Projects journeys: a handful of nodes, line segments, and packets that
 * travel along polylines. Specs only describe topology; this file owns
 * fading, emphasis, tilt and convergence so every checkpoint shares one
 * visual language and one set of performance rules.
 */
const ramp = { a: new THREE.Color(CYAN).multiplyScalar(0.5), b: new THREE.Color(AMBER) };

export function buildSpec(spec) {
  const pts = spec.nodes.map((n) => new THREE.Vector3(...n.p));

  const linkArr = new Float32Array(spec.links.length * 6);
  spec.links.forEach(([a, b], i) => {
    pts[a].toArray(linkArr, i * 6);
    pts[b].toArray(linkArr, i * 6 + 3);
  });

  const paths = (spec.paths || []).map((path) => {
    const pp = path.via.map((i) => pts[i]);
    const cum = [0];
    for (let i = 1; i < pp.length; i++) cum.push(cum[i - 1] + pp[i].distanceTo(pp[i - 1]));
    return { pts: pp, cum, total: cum[cum.length - 1] };
  });

  const packets = [];
  (spec.paths || []).forEach((path, pi) => {
    for (let j = 0; j < path.count; j++) {
      packets.push({
        path: pi,
        speed: path.speed,
        offset: j / path.count + pi * 0.17,
        color: path.color || AMBER,
        ramp: !!path.ramp,
      });
    }
  });

  // Live curves (e.g. option Greeks): recomputed per frame, only while active.
  const curves = (spec.curves || []).map((c) => ({
    ...c,
    arr: new Float32Array((c.n - 1) * 6),
  }));

  return { pts, linkArr, paths, packets, curves };
}

function samplePath(path, u, out) {
  const d = u * path.total;
  let i = 0;
  while (i < path.cum.length - 2 && d > path.cum[i + 1]) i++;
  const seg = path.cum[i + 1] - path.cum[i] || 1;
  out.lerpVectors(path.pts[i], path.pts[i + 1], (d - path.cum[i]) / seg);
}

function fillCurve(c, tt) {
  const dx = (c.x1 - c.x0) / (c.n - 1);
  let px = c.x0;
  let py = c.fn(px, tt);
  for (let i = 0; i < c.n - 1; i++) {
    const nx = px + dx;
    const ny = c.fn(nx, tt);
    const o = i * 6;
    c.arr[o] = px; c.arr[o + 1] = py; c.arr[o + 2] = 0;
    c.arr[o + 3] = nx; c.arr[o + 4] = ny; c.arr[o + 5] = 0;
    px = nx;
    py = ny;
  }
}

function NodeShape({ kind, size, color }) {
  const standard = (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.85}
      roughness={0.4}
      metalness={0.1}
      transparent
    />
  );
  if (kind === 'box') {
    return (
      <mesh>
        <boxGeometry args={[size * 1.5, size * 1.5, size * 1.5]} />
        {standard}
      </mesh>
    );
  }
  if (kind === 'ring') {
    // a metering gate: a ring packets pass through
    return (
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[size * 1.5, size * 0.12, 8, 40]} />
        {standard}
      </mesh>
    );
  }
  if (kind === 'stack') {
    return (
      <group>
        {[-0.55, 0, 0.55].map((y) => (
          <mesh key={y} position={[0, y * size, 0]}>
            <boxGeometry args={[size * 1.9, size * 0.3, size * 1.9]} />
            {standard}
          </mesh>
        ))}
      </group>
    );
  }
  if (kind === 'cell') {
    return (
      <group>
        <mesh>
          <boxGeometry args={[size * 2, size * 2, size * 2]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.6} />
        </mesh>
        <mesh>
          <octahedronGeometry args={[size * 0.55, 0]} />
          {standard}
        </mesh>
      </group>
    );
  }
  return (
    <mesh>
      <octahedronGeometry args={[size, 0]} />
      {standard}
    </mesh>
  );
}

/**
 * props
 *  position     [x,y,z] of this checkpoint in world space
 *  st           shared journey state { cpS, cpRaw, vis, conv }
 *  convergeTo   optional Vector3 — when st.conv > 0 the whole visual shrinks
 *               and drifts toward it (Projects -> Contact ending)
 */
export function SpecVisual({ spec, index, position, scale, st, pointer, reducedMotion, isMobile, convergeTo }) {
  const built = useMemo(() => buildSpec(spec), [spec]);
  const base = useMemo(() => new THREE.Vector3(...position), [position]);
  const outerRef = useRef();
  const innerRef = useRef();
  const nodeRefs = useRef([]);
  const packetRefs = useRef([]);
  const scanRefs = useRef([]);
  const curveAttrs = useRef([]);
  const curvesFilled = useRef(false);
  const mats = useRef(null);
  const emphS = useRef(0);
  const clock = useRef(0.35);
  const tilt = useRef({ x: 0, y: 0 });
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const outer = outerRef.current;
    if (!outer) return;

    const d = Math.abs((reducedMotion ? Math.round(st.cpRaw) : st.cpS) - index);
    const raw = isMobile
      ? 1 - THREE.MathUtils.smoothstep(d, 0.15, 0.6)
      : 1 - THREE.MathUtils.smoothstep(d, 0.2, 1.15);
    emphS.current += (raw - emphS.current) * (1 - Math.pow(0.002, delta));

    const conv = convergeTo ? st.conv || 0 : 0;
    // On mobile the checkpoint sits behind scrolling text, so keep it ambient.
    const k = Math.max(0, emphS.current * st.vis) * (isMobile ? 0.45 : 1) * (1 - conv) * (st.fade ?? 1);

    outer.visible = k > 0.01;
    if (!outer.visible) return;
    outer.scale.setScalar(scale * (0.8 + 0.25 * emphS.current) * (1 - 0.9 * conv));
    if (conv > 0) outer.position.lerpVectors(base, convergeTo, conv);

    if (!mats.current) {
      const list = [];
      outer.traverse((o) => {
        if (o.userData.noFade || !o.material) return;
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
          m.userData.fadeBase = { o: m.opacity, e: m.emissiveIntensity };
          list.push(m);
        });
      });
      mats.current = list;
    }
    mats.current.forEach((m) => {
      m.opacity = m.userData.fadeBase.o * k;
      if (m.userData.fadeBase.e !== undefined) {
        m.emissiveIntensity = m.userData.fadeBase.e * (0.35 + 0.65 * emphS.current);
      }
    });

    // Inactive checkpoints keep time, but at a fraction of the speed.
    if (!reducedMotion) clock.current += delta * (0.25 + 0.75 * emphS.current);
    const t = clock.current;
    const active = emphS.current > 0.15;

    if (!reducedMotion) {
      if (active) {
        nodeRefs.current.forEach((g, i) => {
          if (!g) return;
          g.rotation.y += delta * 0.3;
          if (spec.nodes[i].breathe) g.scale.y = 1 + 0.45 * Math.sin(t * 0.9); // queue depth rising/falling
        });
      }
      if (!isMobile && innerRef.current) {
        const tx = pointer.current.y * 0.1 * emphS.current;
        const ty = pointer.current.x * 0.18 * emphS.current;
        const f = 1 - Math.pow(0.001, delta);
        tilt.current.x += (tx - tilt.current.x) * f;
        tilt.current.y += (ty - tilt.current.y) * f;
        innerRef.current.rotation.set(tilt.current.x, tilt.current.y, 0);
      }
    }

    built.packets.forEach((pk, i) => {
      const mesh = packetRefs.current[i];
      if (!mesh) return;
      const u = (((t * pk.speed + pk.offset) % 1) + 1) % 1;
      samplePath(built.paths[pk.path], u, tmp);
      mesh.position.copy(tmp);
      const env = Math.min(1, u * 6, (1 - u) * 6);
      mesh.material.opacity = env * 0.9 * k;
      if (pk.ramp) mesh.material.color.copy(tmpColor.lerpColors(ramp.a, ramp.b, u));
    });

    if (built.curves.length && (active || !curvesFilled.current)) {
      built.curves.forEach((c, ci) => {
        fillCurve(c, reducedMotion ? 0.35 : t);
        const attr = curveAttrs.current[ci];
        if (attr) attr.needsUpdate = true;
      });
      curvesFilled.current = true;
    }
    (spec.scans || []).forEach((sc, i) => {
      const mesh = scanRefs.current[i];
      if (!mesh) return;
      const c = built.curves[sc.curve];
      const u = (((t * sc.speed) % 1) + 1) % 1;
      const x = c.x0 + (c.x1 - c.x0) * u;
      mesh.position.set(x, c.fn(x, t), 0);
      mesh.material.opacity = Math.min(1, u * 8, (1 - u) * 8) * 0.9 * k;
    });
  });

  return (
    <group ref={outerRef} position={position}>
      <group ref={innerRef}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={built.linkArr.length / 3}
              array={built.linkArr}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={OFFWHITE} transparent opacity={0.28} />
        </lineSegments>

        {built.curves.map((c, ci) => (
          <lineSegments key={`c-${ci}`}>
            <bufferGeometry>
              <bufferAttribute
                ref={(a) => (curveAttrs.current[ci] = a)}
                attach="attributes-position"
                count={c.arr.length / 3}
                array={c.arr}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={c.color} transparent opacity={c.opacity ?? 0.7} />
          </lineSegments>
        ))}

        {spec.nodes.map((n, i) => (
          <group key={i} position={n.p} ref={(g) => (nodeRefs.current[i] = g)}>
            <NodeShape kind={n.kind} size={n.size} color={n.color} />
          </group>
        ))}

        {built.packets.map((pk, i) => (
          <mesh key={`pk-${i}`} ref={(m) => (packetRefs.current[i] = m)} userData={{ noFade: true }}>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshBasicMaterial
              color={pk.color}
              transparent
              opacity={0}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}

        {(spec.scans || []).map((sc, i) => (
          <mesh key={`sc-${i}`} ref={(m) => (scanRefs.current[i] = m)} userData={{ noFade: true }}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial
              color={sc.color || AMBER}
              transparent
              opacity={0}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
