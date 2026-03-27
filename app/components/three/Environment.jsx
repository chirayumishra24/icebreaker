'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

export default function Environment({ energyLevel = 0.3 }) {
  const lightRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (lightRef.current) {
      lightRef.current.intensity = 0.8 + energyLevel * 1.5 + Math.sin(time) * 0.2;
    }
  });

  return (
    <>
      {/* Warm ambient fill */}
      <ambientLight intensity={0.25 + energyLevel * 0.15} color="#c4b5fd" />

      {/* Key light — warm */}
      <directionalLight
        ref={lightRef}
        position={[5, 8, 5]}
        intensity={1}
        color="#fef3c7"
        castShadow
      />

      {/* Stage spotlight — warm amber */}
      <spotLight
        position={[0, 10, 0]}
        angle={0.4}
        penumbra={0.6}
        intensity={2 + energyLevel * 3}
        color="#fbbf24"
        castShadow
      />

      {/* Rim lights — purple and pink */}
      <pointLight position={[-6, 3, -4]} intensity={0.6 + energyLevel} color="#7c3aed" />
      <pointLight position={[6, 3, -4]} intensity={0.6 + energyLevel} color="#ec4899" />
      <pointLight position={[0, -1, 6]} intensity={0.3} color="#34d399" />

      {/* Stars */}
      <Stars
        radius={50}
        depth={50}
        count={2000}
        factor={4}
        saturation={0.6}
        fade
        speed={0.5 + energyLevel * 2}
      />

      {/* Sky sphere — warm deep purple */}
      <mesh>
        <sphereGeometry args={[60, 32, 32]} />
        <meshBasicMaterial color="#0f0525" side={2} toneMapped={false} />
      </mesh>
    </>
  );
}
