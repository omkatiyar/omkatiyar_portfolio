import React from 'react';

/**
 * Cheap, one-time probe: can this browser/machine actually create a WebGL
 * context? Some environments (VMs, remote desktops, GPU-accel disabled,
 * too many contexts already open) can't, and `new THREE.WebGLRenderer()`
 * throws synchronously when they can't. We'd rather know before mounting
 * <Canvas> than let react-three-fiber's init effect throw.
 */
export function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

/**
 * Second line of defense: if the probe passes but context creation still
 * fails inside react-three-fiber's mount effect (context loss, driver
 * quirks, etc.), catch it here instead of taking down the whole page.
 * The rest of the Hero — all real HTML content — keeps working either way.
 */
export class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.warn('[SystemScene] WebGL unavailable, falling back to static backdrop:', error?.message || error);
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
