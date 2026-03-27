'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Stage({ energyLevel = 0.3 }) {
  const ringRef = useRef();
  const glowRef = useRef();

  const ringColor = useMemo(
    () => new THREE.Color('#7c3aed').lerp(new THREE.Color('#f59e0b'), energyLevel),
    [energyLevel]
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.15;
      ringRef.current.material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.3 * energyLevel;
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.15 + Math.sin(time * 1.5) * 0.05 * energyLevel;
    }
  });

  return (
    <group position={[0, -2, 0]}>
      {/* Main platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[4, 4.2, 0.3, 32]} />
        <meshStandardMaterial
          color="#1a1f3d"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Emissive ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
        <torusGeometry args={[4, 0.08, 8, 64]} />
        <meshStandardMaterial
          color={ringColor}
          emissive={ringColor}
          emissiveIntensity={0.6}
          toneMapped={false}
        />
      </mesh>

      {/* Inner glow disc */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]}>
        <circleGeometry args={[3.8, 32]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.12}
          toneMapped={false}
        />
      </mesh>

      {/* Grid floor */}
      <gridHelper
        args={[40, 40, '#1e2254', '#141836']}
        position={[0, -0.1, 0]}
      />
    </group>
  );
}
