import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function ParticleCloud() {
  const ref = useRef();

  const particles = useMemo(() => {
    const temp = [];
    const count = 3000;
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.05;
      ref.current.rotation.y += delta * 0.075;
    }
  });

  return (
    <group>
      <Points ref={ref} positions={particles} stride={3}>
        <PointMaterial
          transparent
          color="#fbbf24"
          size={0.12}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

function FloatingGeometry() {
  const meshRef = useRef();
  const torusRef = useRef();
  const icosahedronRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.3;
      meshRef.current.rotation.y = Math.cos(t * 0.3) * 0.3;
      meshRef.current.position.y = Math.sin(t * 0.5) * 1.5;
    }

    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.2;
      torusRef.current.rotation.y = t * 0.15;
      torusRef.current.position.y = Math.cos(t * 0.4) * 2;
    }

    if (icosahedronRef.current) {
      icosahedronRef.current.rotation.x = t * 0.25;
      icosahedronRef.current.rotation.z = t * 0.2;
      icosahedronRef.current.position.y = Math.sin(t * 0.35 + 2) * 1.8;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={[-6, 0, -5]}>
        <octahedronGeometry args={[1.5]} />
        <meshStandardMaterial
          color="#f59e0b"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      <mesh ref={torusRef} position={[6, 0, -8]}>
        <torusGeometry args={[1.2, 0.4, 16, 32]} />
        <meshStandardMaterial
          color="#f59e0b"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      <mesh ref={icosahedronRef} position={[0, 0, -10]}>
        <icosahedronGeometry args={[1.8]} />
        <meshStandardMaterial
          color="#fb923c"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
    </>
  );
}

// Simple 2D fallback canvas background (no WebGL needed)
function FallbackBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationRef;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.min(80, Math.floor(window.innerWidth / 15));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.4 + 0.15,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${p.opacity})`;
        ctx.fill();

        particles.forEach((other, j) => {
          if (i !== j) {
            const dist = Math.hypot(p.x - other.x, p.y - other.y);
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = `rgba(251, 191, 36, ${0.08 * (1 - dist / 100)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
      });
    };

    const animate = () => {
      drawParticles();
      animationRef = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();
    window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });

    return () => {
      if (animationRef) cancelAnimationFrame(animationRef);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 opacity-60"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}
    />
  );
}

// Error boundary to catch WebGL context failures
class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn('WebGL not available, using fallback background:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackBackground />;
    }
    return this.props.children;
  }
}

export default function AnimatedBackground() {
  const [use3D, setUse3D] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Test WebGL support before mounting Canvas
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl || gl instanceof Error) {
        setUse3D(false);
      }
    } catch (e) {
      setUse3D(false);
    } finally {
      setChecked(true);
    }
  }, []);

  if (!checked) {
    return (
      <div
        className="fixed inset-0 z-0"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}
      />
    );
  }

  if (!use3D) {
    return <FallbackBackground />;
  }

  return (
    <div className="fixed inset-0 z-0 opacity-70">
      <WebGLErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 15], fov: 75 }}
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}
          gl={{ powerPreference: 'low-power', antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <ParticleCloud />
          <FloatingGeometry />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
