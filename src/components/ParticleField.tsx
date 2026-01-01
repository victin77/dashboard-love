import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleCloud({ count = 3000, mouse }: { count?: number; mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 15;
      
      // Purple to cyan gradient colors
      const t = Math.random();
      colors[i3] = 0.5 + t * 0.3; // R
      colors[i3 + 1] = 0.2 + t * 0.5; // G
      colors[i3 + 2] = 0.8 + t * 0.2; // B
    }
    
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Gentle rotation
    ref.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    ref.current.rotation.y = time * 0.05;
    
    // Mouse interaction
    const mouseX = (mouse.current.x / window.innerWidth) * 2 - 1;
    const mouseY = -(mouse.current.y / window.innerHeight) * 2 + 1;
    
    ref.current.rotation.x += mouseY * 0.1;
    ref.current.rotation.y += mouseX * 0.1;
    
    // Update positions for wave effect
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = particles.positions[i3];
      const y = particles.positions[i3 + 1];
      const z = particles.positions[i3 + 2];
      
      positions[i3 + 2] = z + Math.sin(time + x * 0.5) * 0.02;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={particles.positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function FloatingOrbs({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const orb1 = useRef<THREE.Mesh>(null);
  const orb2 = useRef<THREE.Mesh>(null);
  const orb3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mouseX = (mouse.current.x / window.innerWidth) * 2 - 1;
    const mouseY = -(mouse.current.y / window.innerHeight) * 2 + 1;

    if (orb1.current) {
      orb1.current.position.x = Math.sin(time * 0.3) * 3 + mouseX * 0.5;
      orb1.current.position.y = Math.cos(time * 0.4) * 2 + mouseY * 0.5;
      orb1.current.position.z = Math.sin(time * 0.2) * 2 - 3;
    }
    if (orb2.current) {
      orb2.current.position.x = Math.cos(time * 0.4) * 4 + mouseX * 0.3;
      orb2.current.position.y = Math.sin(time * 0.3) * 3 + mouseY * 0.3;
      orb2.current.position.z = Math.cos(time * 0.3) * 2 - 4;
    }
    if (orb3.current) {
      orb3.current.position.x = Math.sin(time * 0.5) * 2 - mouseX * 0.4;
      orb3.current.position.y = Math.cos(time * 0.2) * 4 - mouseY * 0.4;
      orb3.current.position.z = Math.sin(time * 0.4) * 3 - 5;
    }
  });

  return (
    <>
      <mesh ref={orb1}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
      </mesh>
      <mesh ref={orb2}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} />
      </mesh>
      <mesh ref={orb3}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.25} />
      </mesh>
    </>
  );
}

export default function ParticleField() {
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouse.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div 
      className="fixed inset-0 -z-10"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/20" />
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <ParticleCloud mouse={mouse} count={2000} />
        <FloatingOrbs mouse={mouse} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
