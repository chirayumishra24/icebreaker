'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Particles({ count = 200, celebrationMode = false }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 30,
        y: Math.random() * 15 - 2,
        z: (Math.random() - 0.5) * 30,
        speedY: 0.005 + Math.random() * 0.015,
        speedX: (Math.random() - 0.5) * 0.005,
        scale: 0.03 + Math.random() * 0.06,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [count]);

  const colors = useMemo(() => {
    const palette = celebrationMode
      ? ['#fbbf24', '#ec4899', '#7c3aed', '#06b6d4', '#10b981', '#f97316']
      : ['#a78bfa', '#7c3aed', '#fbbf24', '#ffffff'];
    const colorArr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const c = new THREE.Color(palette[Math.floor(Math.random() * palette.length)]);
      colorArr[i * 3] = c.r;
      colorArr[i * 3 + 1] = c.g;
      colorArr[i * 3 + 2] = c.b;
    }
    return colorArr;
  }, [count, celebrationMode]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speed = celebrationMode ? 3 : 1;

    particles.forEach((p, i) => {
      p.y += p.speedY * speed;
      p.x += p.speedX * speed + Math.sin(time + p.phase) * 0.003;
      if (p.y > 12) p.y = -3;
      if (celebrationMode && p.y < -3) p.y = 12;

      dummy.position.set(p.x, p.y, p.z);
      const s = p.scale * (1 + 0.3 * Math.sin(time * 2 + p.phase));
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial transparent opacity={0.8} toneMapped={false}>
        <instancedBufferAttribute
          attach="geometry-attributes-color"
          args={[colors, 3]}
        />
      </meshBasicMaterial>
    </instancedMesh>
  );
}
