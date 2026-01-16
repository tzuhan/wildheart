"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

// Seeded random number generator for deterministic particle positions
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function Seed({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  const scale = 0.3 + progress * 0.7;

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={scale}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={progress < 0.3 ? "#8B4513" : "#228B22"}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

function Sprout({ progress }: { progress: number }) {
  const stemHeight = Math.max(0, (progress - 0.3) * 3);
  const leafScale = Math.max(0, (progress - 0.5) * 2);

  if (progress < 0.3) return null;

  return (
    <group position={[0, stemHeight / 2, 0]}>
      {/* Stem */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.08, stemHeight, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.6} />
      </mesh>

      {/* Leaves */}
      {progress > 0.5 && (
        <>
          <group position={[0, stemHeight / 2, 0]} rotation={[0, 0, 0.5]}>
            <mesh scale={[leafScale, leafScale * 0.5, leafScale * 0.1]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color="#32CD32" roughness={0.5} />
            </mesh>
          </group>
          <group position={[0, stemHeight / 2, 0]} rotation={[0, Math.PI, -0.5]}>
            <mesh scale={[leafScale, leafScale * 0.5, leafScale * 0.1]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color="#32CD32" roughness={0.5} />
            </mesh>
          </group>
        </>
      )}

      {/* Flower bud at full growth */}
      {progress > 0.9 && (
        <group position={[0, stemHeight / 2 + 0.3, 0]}>
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#FFD700" roughness={0.3} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Pre-generate particle data at module level for purity
const PARTICLE_DATA = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  position: [
    (seededRandom(i * 3) - 0.5) * 4,
    seededRandom(i * 3 + 1) * 3,
    (seededRandom(i * 3 + 2) - 0.5) * 4,
  ] as [number, number, number],
  speed: 0.5 + seededRandom(i * 7) * 0.5,
}));

function Particles({ progress }: { progress: number }) {
  if (progress < 0.7) return null;

  return (
    <>
      {PARTICLE_DATA.map((particle) => (
        <Float
          key={particle.id}
          speed={particle.speed}
          floatIntensity={1}
          rotationIntensity={0.5}
        >
          <mesh position={particle.position} scale={0.05}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial
              color="#90EE90"
              transparent
              opacity={0.7}
              emissive="#90EE90"
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function Scene({ progress }: { progress: number }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#90EE90" />

      <group position={[0, -1, 0]}>
        <Seed progress={progress} />
        <Sprout progress={progress} />
      </group>

      <Particles progress={progress} />

      <Environment preset="forest" background={false} />
    </>
  );
}

interface SeedAnimationProps {
  onComplete?: () => void;
  duration?: number;
}

export function SeedAnimation({
  onComplete,
  duration = 5000,
}: SeedAnimationProps) {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const animate = () => {
      if (!startTimeRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min(1, elapsed / duration);
      setProgress(newProgress);

      if (newProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => onComplete?.(), 500);
      }
    };

    requestAnimationFrame(animate);
  }, [duration, onComplete]);

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
        <Scene progress={progress} />
      </Canvas>
    </div>
  );
}
