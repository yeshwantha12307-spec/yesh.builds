import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// City Buildings with procedural geometry and emissive windows
const CityBuildings: React.FC<{ mouse: React.MutableRefObject<{ x: number; y: number }> }> = ({ mouse }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Generate building data with deterministic random seeds
  const buildings = useMemo(() => {
    const list: Array<{
      x: number;
      z: number;
      w: number;
      d: number;
      h: number;
      color: string;
      beaconColor: string;
    }> = [];

    const gridSize = 14;
    const spacing = 4.2;

    for (let i = -gridSize; i <= gridSize; i++) {
      for (let j = -gridSize; j <= gridSize; j++) {
        // Leave central highway corridor open
        if (Math.abs(i) <= 1 && j > -6) continue;

        // Skip random plots for street variation
        const hash = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
        const rand = hash - Math.floor(hash);
        if (rand > 0.85) continue;

        const distFromCenter = Math.sqrt(i * i + j * j);
        const heightMultiplier = Math.max(1, 14 - distFromCenter * 0.6);
        const h = 4 + rand * heightMultiplier * 3.5;
        const w = 1.8 + (rand % 0.8);
        const d = 1.8 + ((rand * 3) % 0.8);

        const colors = ['#081226', '#0a1630', '#050c1e', '#0d1d3d'];
        const beacons = ['#00f0ff', '#ff5500', '#10b981', '#3b82f6'];

        list.push({
          x: i * spacing + (rand - 0.5) * 0.8,
          z: j * spacing - 10 + (rand - 0.5) * 0.8,
          w,
          d,
          h,
          color: colors[Math.floor(rand * colors.length)],
          beaconColor: beacons[Math.floor((rand * 7) % beacons.length)]
        });
      }
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Subtle smooth parallax tilt following mouse coordinates
      const targetRotY = mouse.current.x * 0.12;
      const targetRotX = mouse.current.y * 0.08;
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 2, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 2, delta);
    }
  });

  return (
    <group ref={groupRef} scale={[0.83, 0.83, 0.83]}>
      {buildings.map((b, idx) => (
        <group key={idx} position={[b.x, b.h / 2 - 5, b.z]}>
          {/* Main Tower Box */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial
              color={b.color}
              roughness={0.25}
              metalness={0.85}
              emissive="#001830"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Roof Spire / Antenna */}
          {b.h > 15 && (
            <mesh position={[0, b.h / 2 + 1.2, 0]}>
              <cylinderGeometry args={[0.04, 0.08, 2.4, 6]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
          )}

          {/* Rooftop Glowing Beacon */}
          <mesh position={[0, b.h / 2 + 0.1, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial color={b.beaconColor} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Cyber particles / Atmospheric Fog Embers
const AtmosphericParticles: React.FC = () => {
  const count = 180;
  const meshRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 35;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
      spd[i] = 0.2 + Math.random() * 0.8;
    }
    return [pos, spd];
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= speeds[i] * delta * 2.5;
      if (pos[i * 3 + 1] < 0) {
        pos[i * 3 + 1] = 35;
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.25}
        color="#00f0ff"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Moving Neon Highway Light Streaks
const NeonHighway: React.FC = () => {
  const lineRef1 = useRef<THREE.Mesh>(null);
  const lineRef2 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (lineRef1.current) {
      lineRef1.current.position.z += delta * 18;
      if (lineRef1.current.position.z > 20) lineRef1.current.position.z = -70;
    }
    if (lineRef2.current) {
      lineRef2.current.position.z -= delta * 22;
      if (lineRef2.current.position.z < -70) lineRef2.current.position.z = 20;
    }
  });

  return (
    <group position={[0, -4.8, 0]}>
      {/* Highway Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -25]}>
        <planeGeometry args={[12, 100]} />
        <meshStandardMaterial color="#020610" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Traffic beam forward (Cyan) */}
      <mesh ref={lineRef1} position={[-2.5, 0.1, -30]}>
        <boxGeometry args={[0.3, 0.15, 6]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* Traffic beam reverse (Orange) */}
      <mesh ref={lineRef2} position={[2.5, 0.1, 10]}>
        <boxGeometry args={[0.3, 0.15, 6]} />
        <meshBasicMaterial color="#ff5500" />
      </mesh>
    </group>
  );
};

export const CityScene3D: React.FC = () => {
  const mouse = useRef({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!hasWebGL) {
    // Lightweight 2D Fallback per specification
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-cyber-dark overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-tactical-grid opacity-30" />
        <div className="absolute bottom-0 w-full h-80 bg-gradient-to-t from-cyan-950/20 via-orange-950/10 to-transparent" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 5.5, 24], fov: 50, near: 0.1, far: 180 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.fog = new THREE.FogExp2('#030712', 0.022);
        }}
      >
        {/* Cinematic Ambient & Directional Lighting */}
        <ambientLight intensity={0.4} color="#0d1b38" />
        <directionalLight position={[15, 30, 20]} intensity={1.2} color="#00f0ff" castShadow />
        <directionalLight position={[-15, 20, -10]} intensity={0.8} color="#ff5500" />
        <pointLight position={[0, 10, 5]} intensity={1.5} color="#00f0ff" distance={40} />

        {/* 3D Elements */}
        <CityBuildings mouse={mouse} />
        <AtmosphericParticles />
        <NeonHighway />
      </Canvas>

      {/* Atmospheric Vignette and Depth Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-slate-950/80 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-60" />
    </div>
  );
};
