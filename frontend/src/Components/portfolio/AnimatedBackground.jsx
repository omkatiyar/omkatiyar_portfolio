import React from 'react';

/**
 * Global background — a static deep-space gradient. The themed 3D
 * effects live per-section in SectionAmbient.jsx (pure CSS 3D,
 * works everywhere without WebGL).
 */
export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 z-0"
      aria-hidden="true"
      style={{
        background:
          'radial-gradient(ellipse at 20% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(56, 189, 248, 0.06) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      }}
    />
  );
}
