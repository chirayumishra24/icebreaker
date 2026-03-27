'use client';

import { Suspense, useRef, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useGameStore from '../store/gameStore';
import { PHASES } from '../lib/constants';
import { playPop } from '../lib/sounds';

// ===== STUDENT DATA =====
const AUDIENCE_LEFT = [
  { name: 'Aarav', color: '#3b82f6', hair: '#1a1a2e', skin: '#f5c9a8', hairstyle: 'spiky', seat: [-7.5, -0.8, 1], greeting: 'Hi! I love cricket! 🏏' },
  { name: 'Priya', color: '#ec4899', hair: '#3d2914', skin: '#e8b896', hairstyle: 'ponytail', seat: [-6, -0.8, 2.5], greeting: 'Hello! I enjoy dancing! 💃' },
  { name: 'Rohan', color: '#22c55e', hair: '#0f0f0f', skin: '#d4a574', hairstyle: 'curly', seat: [-8.5, -0.8, 3.5], greeting: 'Hey! Books are the best! 📚' },
  { name: 'Ananya', color: '#f97316', hair: '#2d1810', skin: '#f0c8a0', hairstyle: 'bob', seat: [-6.5, -0.8, 5], greeting: 'Namaste! I love painting! 🎨' },
];
const AUDIENCE_RIGHT = [
  { name: 'Dev', color: '#8b5cf6', hair: '#1a1a2e', skin: '#f5c9a8', hairstyle: 'spiky', seat: [7.5, -0.8, 1], greeting: 'Yo! Gaming is life! 🎮' },
  { name: 'Meera', color: '#06b6d4', hair: '#2d1810', skin: '#e8b896', hairstyle: 'bob', seat: [6, -0.8, 2.5], greeting: 'Hi! I sing songs! 🎵' },
  { name: 'Kabir', color: '#fbbf24', hair: '#0f0f0f', skin: '#d4a574', hairstyle: 'curly', seat: [8.5, -0.8, 3.5], greeting: 'Football forever! ⚽' },
  { name: 'Ishita', color: '#ef4444', hair: '#3d2914', skin: '#f0c8a0', hairstyle: 'ponytail', seat: [6.5, -0.8, 5], greeting: 'I love cooking yummy food! 🍳' },
];

// ===== CURTAIN (Animated open/close) =====
function Curtain({ side }) {
  const ref = useRef();
  const phase = useGameStore((s) => s.phase);
  const prevPhase = useRef(phase);
  const openAmount = useRef(1); // 1 = fully open, 0 = fully closed
  const targetOpen = useRef(1);
  const transitionTimer = useRef(0);

  const restX = side === 'left' ? -11 : 11;
  const closedX = side === 'left' ? -4 : 4;

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();

    // Detect phase change → trigger close then open
    if (prevPhase.current !== phase) {
      prevPhase.current = phase;
      targetOpen.current = 0; // close first
      transitionTimer.current = 1.2; // reopen after 1.2s
    }

    // Timer to reopen
    if (transitionTimer.current > 0) {
      transitionTimer.current -= delta;
      if (transitionTimer.current <= 0) {
        targetOpen.current = 1; // reopen
      }
    }

    // Smooth lerp the open amount
    openAmount.current += (targetOpen.current - openAmount.current) * 3 * delta;

    // Position based on open amount
    const currentX = THREE.MathUtils.lerp(closedX, restX, openAmount.current);
    ref.current.position.x = currentX;

    // Gentle sway
    ref.current.rotation.y = Math.sin(t * 0.3 + (side === 'left' ? 0 : Math.PI)) * 0.02;
  });

  return (
    <group ref={ref} position={[restX, 3, -6]}>
      {/* Main curtain fabric */}
      <mesh>
        <boxGeometry args={[4, 14, 0.3]} />
        <meshStandardMaterial
          color="#b91c1c"
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>
      {/* Gold trim stripe */}
      <mesh position={[side === 'left' ? 1.8 : -1.8, 0, 0.16]}>
        <boxGeometry args={[0.3, 14, 0.05]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Curtain drape top */}
      <mesh position={[0, 7.2, 0]}>
        <boxGeometry args={[5, 1.5, 0.5]} />
        <meshStandardMaterial color="#991b1b" roughness={0.6} />
      </mesh>
      {/* Gold tassel */}
      <mesh position={[side === 'left' ? 1.5 : -1.5, -2, 0.3]}>
        <cylinderGeometry args={[0.08, 0.15, 0.8, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ===== TOP VALANCE (header curtain) =====
function Valance() {
  return (
    <mesh position={[0, 10.2, -6]}>
      <boxGeometry args={[26, 2, 0.6]} />
      <meshStandardMaterial color="#991b1b" roughness={0.6} />
    </mesh>
  );
}

// ===== BUNTING / STREAMERS =====
function Bunting() {
  const flags = useMemo(() => {
    const colors = ['#f97316', '#3b82f6', '#22c55e', '#ec4899', '#fbbf24', '#8b5cf6'];
    return Array.from({ length: 14 }, (_, i) => ({
      x: -9 + i * 1.4,
      color: colors[i % colors.length],
      phase: i * 0.4,
    }));
  }, []);

  return (
    <group position={[0, 8.5, -5]}>
      {/* String */}
      <mesh>
        <boxGeometry args={[20, 0.04, 0.04]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Flags */}
      {flags.map((f, i) => (
        <BuntingFlag key={i} x={f.x} color={f.color} phase={f.phase} />
      ))}
    </group>
  );
}

function BuntingFlag({ x, color, phase }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = Math.sin(t * 1.5 + phase) * 0.1;
  });

  return (
    <mesh ref={ref} position={[x, -0.5, 0]} rotation={[0.2, 0, 0]}>
      <coneGeometry args={[0.35, 0.9, 3]} />
      <meshStandardMaterial color={color} roughness={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ===== CENTER STAGE (circular platform) =====
function CenterStage() {
  const ringRef = useRef();

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
  });

  return (
    <group position={[0, -2.8, -3]}>
      {/* Main stage platform */}
      <mesh receiveShadow>
        <cylinderGeometry args={[4, 4.5, 0.5, 32]} />
        <meshStandardMaterial color="#4a2c0a" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Stage edge gold ring */}
      <mesh position={[0, 0.26, 0]}>
        <torusGeometry args={[4.1, 0.08, 8, 48]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Rotating light ring on stage */}
      <group ref={ringRef} position={[0, 0.3, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 3.2, 0, Math.sin(angle) * 3.2]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial
                color={['#f97316', '#3b82f6', '#22c55e', '#ec4899', '#fbbf24', '#8b5cf6'][i]}
                emissive={['#f97316', '#3b82f6', '#22c55e', '#ec4899', '#fbbf24', '#8b5cf6'][i]}
                emissiveIntensity={1.5}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// ===== STAGE FLOOR =====
function StageFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
      <planeGeometry args={[40, 30]} />
      <meshStandardMaterial color="#deb887" roughness={0.7} />
    </mesh>
  );
}

// ===== BACK WALL =====
function BackWall() {
  return (
    <mesh position={[0, 4, -10]}>
      <planeGeometry args={[30, 18]} />
      <meshStandardMaterial color="#c7d2fe" roughness={0.9} />
    </mesh>
  );
}

// ===== ANIMATED SPOTLIGHTS =====
function StageSpotlights() {
  const celebrationActive = useGameStore((s) => s.celebrationActive);
  const phase = useGameStore((s) => s.phase);

  // Colors change based on phase
  const getSpotColor = (index) => {
    if (celebrationActive) {
      return ['#f97316', '#ec4899', '#22c55e', '#fbbf24'][index % 4];
    }
    switch (phase) {
      case PHASES.WELCOME: return ['#fbbf24', '#f97316', '#fbbf24', '#f97316'][index];
      case PHASES.SONG: return ['#8b5cf6', '#ec4899', '#8b5cf6', '#ec4899'][index];
      case PHASES.ADD_STUDENT: return ['#3b82f6', '#22c55e', '#3b82f6', '#22c55e'][index];
      case PHASES.SPOTLIGHT: return ['#f97316', '#fbbf24', '#f97316', '#fbbf24'][index];
      default: return '#fbbf24';
    }
  };

  return (
    <group>
      {/* Main center spotlight */}
      <spotLight
        position={[0, 12, 2]}
        angle={0.4}
        penumbra={0.6}
        intensity={celebrationActive ? 3 : 1.8}
        color={celebrationActive ? '#fbbf24' : '#fff5e6'}
        castShadow
        target-position={[0, -3, -3]}
      />

      {/* Side color spots */}
      {[[-8, 10, 0], [8, 10, 0], [-5, 11, -4], [5, 11, -4]].map((pos, i) => (
        <SpotlightBeam key={i} position={pos} color={getSpotColor(i)} index={i} celebration={celebrationActive} />
      ))}
    </group>
  );
}

function SpotlightBeam({ position, color, index, celebration }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const speed = celebration ? 2 : 0.5;
    // Sweep the spot back and forth
    ref.current.position.x = position[0] + Math.sin(t * speed + index * 1.5) * 2;
  });

  return (
    <spotLight
      ref={ref}
      position={position}
      angle={0.3}
      penumbra={0.8}
      intensity={celebration ? 2 : 1}
      color={color}
      distance={20}
    />
  );
}

// ===== CARTOON STUDENT (Audience) — Detailed =====
function AudienceStudent({ data, onGreet, isGreeting }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const armLRef = useRef();
  const armRRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const offset = data.seat[0] * 0.3;
    // Gentle idle bob
    groupRef.current.position.y = data.seat[1] + Math.sin(t * 1 + offset) * 0.06;
    // Wave arm when greeting
    if (isGreeting) {
      if (armRRef.current) armRRef.current.rotation.z = -0.4 + Math.sin(t * 6) * 0.6;
      groupRef.current.rotation.y = Math.sin(t * 4) * 0.08;
    } else {
      if (armRRef.current) armRRef.current.rotation.z = -0.4;
    }
  });

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    playPop();
    onGreet(data);
  }, [data, onGreet]);

  // Determine skin tone from index
  const skinTone = data.skin || '#f5c9a8';
  const darkerShirt = data.color;

  return (
    <group
      ref={groupRef}
      position={data.seat}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.15 : 1.05}
    >
      {/* === LEGS / SHORTS === */}
      <mesh position={[-0.14, 0.2, 0]}>
        <capsuleGeometry args={[0.1, 0.3, 4, 8]} />
        <meshStandardMaterial color="#455a64" roughness={0.6} />
      </mesh>
      <mesh position={[0.14, 0.2, 0]}>
        <capsuleGeometry args={[0.1, 0.3, 4, 8]} />
        <meshStandardMaterial color="#455a64" roughness={0.6} />
      </mesh>

      {/* === SHOES === */}
      <mesh position={[-0.14, -0.05, 0.06]}>
        <boxGeometry args={[0.18, 0.1, 0.26]} />
        <meshStandardMaterial color="#333" roughness={0.5} />
      </mesh>
      <mesh position={[0.14, -0.05, 0.06]}>
        <boxGeometry args={[0.18, 0.1, 0.26]} />
        <meshStandardMaterial color="#333" roughness={0.5} />
      </mesh>

      {/* === TORSO (T-shirt) === */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.45, 6, 12]} />
        <meshStandardMaterial color={darkerShirt} roughness={0.45} />
      </mesh>

      {/* T-shirt collar */}
      <mesh position={[0, 1.15, 0.15]} rotation={[0.5, 0, 0]}>
        <torusGeometry args={[0.15, 0.04, 6, 12, Math.PI]} />
        <meshStandardMaterial color="white" roughness={0.5} />
      </mesh>

      {/* === ARMS === */}
      <group ref={armLRef}>
        <mesh position={[-0.48, 0.85, 0]} rotation={[0, 0, 0.4]}>
          <capsuleGeometry args={[0.09, 0.35, 4, 8]} />
          <meshStandardMaterial color={darkerShirt} roughness={0.5} />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.68, 0.6, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color={skinTone} roughness={0.5} />
        </mesh>
      </group>

      <group ref={armRRef} rotation={[0, 0, -0.4]}>
        <mesh position={[0.48, 0.85, 0]}>
          <capsuleGeometry args={[0.09, 0.35, 4, 8]} />
          <meshStandardMaterial color={darkerShirt} roughness={0.5} />
        </mesh>
        {/* Hand */}
        <mesh position={[0.68, 0.6, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color={skinTone} roughness={0.5} />
        </mesh>
      </group>

      {/* === HEAD === */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.38, 16, 16]} />
        <meshStandardMaterial color={skinTone} roughness={0.55} />
      </mesh>

      {/* === HAIR (varies by hairstyle prop) === */}
      {data.hairstyle === 'bob' && (
        <group>
          <mesh position={[0, 1.72, -0.06]}>
            <sphereGeometry args={[0.37, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={data.hair} roughness={0.8} />
          </mesh>
          {/* Side bangs */}
          <mesh position={[-0.28, 1.45, 0.18]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color={data.hair} roughness={0.8} />
          </mesh>
          <mesh position={[0.28, 1.45, 0.18]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color={data.hair} roughness={0.8} />
          </mesh>
        </group>
      )}
      {data.hairstyle === 'spiky' && (
        <group>
          <mesh position={[0, 1.78, -0.04]}>
            <sphereGeometry args={[0.34, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
            <meshStandardMaterial color={data.hair} roughness={0.7} />
          </mesh>
          {/* Spikes */}
          {[[-0.15, 1.92, 0], [0.15, 1.95, -0.05], [0, 1.97, 0.08], [-0.1, 1.9, -0.15], [0.1, 1.93, -0.12]].map((pos, i) => (
            <mesh key={i} position={pos}>
              <coneGeometry args={[0.06, 0.18, 4]} />
              <meshStandardMaterial color={data.hair} roughness={0.7} />
            </mesh>
          ))}
        </group>
      )}
      {data.hairstyle === 'ponytail' && (
        <group>
          <mesh position={[0, 1.72, -0.06]}>
            <sphereGeometry args={[0.36, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color={data.hair} roughness={0.8} />
          </mesh>
          {/* Ponytail */}
          <mesh position={[0, 1.65, -0.38]} rotation={[0.6, 0, 0]}>
            <capsuleGeometry args={[0.08, 0.35, 4, 8]} />
            <meshStandardMaterial color={data.hair} roughness={0.8} />
          </mesh>
          {/* Hair band */}
          <mesh position={[0, 1.72, -0.32]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color={data.color} />
          </mesh>
        </group>
      )}
      {data.hairstyle === 'curly' && (
        <group>
          <mesh position={[0, 1.74, -0.02]}>
            <sphereGeometry args={[0.4, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={data.hair} roughness={0.9} />
          </mesh>
          {/* Curly bumps */}
          {[[-0.3, 1.55, 0.15], [0.3, 1.55, 0.15], [-0.32, 1.65, -0.1], [0.32, 1.65, -0.1]].map((pos, i) => (
            <mesh key={i} position={pos}>
              <sphereGeometry args={[0.1, 6, 6]} />
              <meshStandardMaterial color={data.hair} roughness={0.9} />
            </mesh>
          ))}
        </group>
      )}

      {/* === FACE DETAILS === */}
      {/* Eye whites */}
      <mesh position={[-0.13, 1.55, 0.32]}>
        <sphereGeometry args={[0.075, 10, 10]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.13, 1.55, 0.32]}>
        <sphereGeometry args={[0.075, 10, 10]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Pupils */}
      <mesh position={[-0.13, 1.55, 0.39]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0.13, 1.55, 0.39]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Eye shine */}
      <mesh position={[-0.11, 1.57, 0.41]}>
        <sphereGeometry args={[0.015, 4, 4]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.15, 1.57, 0.41]}>
        <sphereGeometry args={[0.015, 4, 4]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
      </mesh>

      {/* Eyebrows */}
      <mesh position={[-0.13, 1.64, 0.34]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.12, 0.025, 0.03]} />
        <meshStandardMaterial color={data.hair} roughness={0.7} />
      </mesh>
      <mesh position={[0.13, 1.64, 0.34]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.12, 0.025, 0.03]} />
        <meshStandardMaterial color={data.hair} roughness={0.7} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 1.46, 0.38]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color={skinTone} roughness={0.6} />
      </mesh>

      {/* Rosy cheeks */}
      <mesh position={[-0.22, 1.42, 0.28]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ff9999" transparent opacity={0.4} roughness={0.8} />
      </mesh>
      <mesh position={[0.22, 1.42, 0.28]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ff9999" transparent opacity={0.4} roughness={0.8} />
      </mesh>

      {/* Smile */}
      <mesh position={[0, 1.38, 0.35]} rotation={[Math.PI + 0.3, 0, 0]}>
        <torusGeometry args={[0.08, 0.02, 6, 12, Math.PI]} />
        <meshStandardMaterial color="#e11d48" />
      </mesh>

      {/* === CHAIR === */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.65, 0.15, 0.5]} />
        <meshStandardMaterial color="#b45309" roughness={0.6} />
      </mesh>
      {/* Chair back */}
      <mesh position={[0, 0.35, -0.22]}>
        <boxGeometry args={[0.6, 0.7, 0.08]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>

      {/* Name tag */}
      <Html position={[0, 2.2, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
        <div style={{
          background: hovered ? data.color : 'rgba(255,255,255,0.95)',
          color: hovered ? 'white' : '#1e293b',
          padding: '3px 10px',
          borderRadius: '12px',
          fontSize: '11px',
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          border: `2px solid ${data.color}`,
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        }}>
          {data.name}
        </div>
      </Html>

      {/* Speech bubble */}
      {isGreeting && (
        <Html position={[0, 2.8, 0]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'white',
            color: '#1e293b',
            padding: '8px 14px',
            borderRadius: '16px',
            fontSize: '13px',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            border: `2px solid ${data.color}`,
            animation: 'bubblePop 0.3s ease',
          }}>
            {data.greeting}
            <div style={{
              position: 'absolute', bottom: '-7px', left: '50%',
              transform: 'translateX(-50%)', width: 0, height: 0,
              borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
              borderTop: `7px solid ${data.color}`,
            }} />
          </div>
        </Html>
      )}

      {/* Hover glow ring */}
      {hovered && (
        <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.9, 24]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.35} />
        </mesh>
      )}
    </group>
  );
}

// ===== AUDIENCE MANAGER =====
function Audience() {
  const [greetingId, setGreetingId] = useState(null);
  const timerRef = useRef(null);

  const handleGreet = useCallback((student) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setGreetingId(student.name);
    timerRef.current = setTimeout(() => setGreetingId(null), 3000);
  }, []);

  const allStudents = [...AUDIENCE_LEFT, ...AUDIENCE_RIGHT];

  return (
    <group>
      {allStudents.map((s) => {
        // Hide the student from the audience if they are currently the spotlight student
        // and we are to show them walking. Actually, to keep it simple, we just show both or let the audience student disappear.
        // Let's just keep the audience member as is, maybe they are "cloned" to the center stage.
        return (
          <AudienceStudent
            key={s.name}
            data={s}
            onGreet={handleGreet}
            isGreeting={greetingId === s.name}
          />
        );
      })}
    </group>
  );
}

// ===== SPOTLIGHT WALKING STUDENT =====
function SpotlightCharacter() {
  const phase = useGameStore((s) => s.phase);
  const students = useGameStore((s) => s.students);
  const currentStudentIndex = useGameStore((s) => s.currentStudentIndex);
  
  const groupRef = useRef();
  const walkProgress = useRef(0);
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Walk forward animation
    if (walkProgress.current < 1) {
      walkProgress.current += delta * 0.8; // 1.25s to walk
      const t = Math.min(walkProgress.current, 1);
      
      // Starts behind curtain [0, 0, -4], walks to [0, 0, 1]
      groupRef.current.position.z = THREE.MathUtils.lerp(-4, 1, t);
      
      // Wobble rotation to simulate walking
      if (t < 1) {
        groupRef.current.rotation.z = Math.sin(t * 20) * 0.1;
      } else {
        groupRef.current.rotation.z = 0;
      }
    }
  });
  
  // Reset walk progress when current student changes
  const prevStudentRef = useRef(-1);
  if (prevStudentRef.current !== currentStudentIndex) {
    walkProgress.current = 0;
    prevStudentRef.current = currentStudentIndex;
  }
  
  // Only show during spotlight or memory chain
  if ((phase !== PHASES.SPOTLIGHT && phase !== PHASES.MEMORY_CHAIN) || currentStudentIndex < 0) return null;
  
  const studentData = students[currentStudentIndex];
  if (!studentData) return null;

  // Generate deterministic appearance based on name length/chars so they aren't bald
  const nameHash = studentData.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hairstyles = ['bob', 'spiky', 'ponytail', 'curly'];
  const skinTones = ['#f5c9a8', '#e8b896', '#d4a574', '#f0c8a0', '#8d5524'];
  const hairColors = ['#1a1a2e', '#3d2914', '#0f0f0f', '#2d1810', '#b95c00'];
  
  const centerData = {
    ...studentData,
    seat: [0, 0, 0], // Handled by groupRef
    hairstyle: hairstyles[nameHash % hairstyles.length],
    skin: skinTones[nameHash % skinTones.length],
    hair: hairColors[nameHash % hairColors.length],
  };
  
  return (
    <group ref={groupRef} position={[0, 0, -4]}>
      <AudienceStudent data={centerData} onGreet={() => {}} isGreeting={true} />
    </group>
  );
}

// ===== FLOATING SPARKLES (Shaped Confetti) =====
function Sparkles({ count = 20 }) {
  const celebrationActive = useGameStore((s) => s.celebrationActive);
  const actualCount = celebrationActive ? count * 3 : count;

  const sparkles = useMemo(() => {
    return Array.from({ length: actualCount }, () => ({
      pos: [(Math.random() - 0.5) * 24, Math.random() * 12, (Math.random() - 0.5) * 15 - 3],
      speed: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      scale: 0.03 + Math.random() * 0.06,
      color: ['#fbbf24', '#f97316', '#ec4899', '#8b5cf6', '#3b82f6'][Math.floor(Math.random() * 5)],
      shape: Math.floor(Math.random() * 3), // 0: sphere, 1: star (cone), 2: ribbon (box)
      rotSpeed: [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5],
    }));
  }, [actualCount]);

  return (
    <group>
      {sparkles.map((s, i) => (
        <Sparkle key={i} data={s} />
      ))}
    </group>
  );
}

function Sparkle({ data }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.y = data.pos[1] - (t * data.speed * 2) % 15; // Fall down
    if (ref.current.position.y < -3) ref.current.position.y += 15;
    
    ref.current.position.x = data.pos[0] + Math.sin(t * data.speed + data.phase) * 1.5;
    
    // Rotation for ribbons
    ref.current.rotation.x += data.rotSpeed[0] * 0.1;
    ref.current.rotation.y += data.rotSpeed[1] * 0.1;
    ref.current.rotation.z += data.rotSpeed[2] * 0.1;

    // Twinkle scale
    ref.current.scale.setScalar(data.scale * (0.8 + Math.sin(t * 5 + data.phase) * 0.4));
  });

  return (
    <mesh ref={ref} position={data.pos}>
      {/* 0: Sphere, 1: Star/Point, 2: Ribbon/Confetti piece */}
      {data.shape === 0 && <sphereGeometry args={[1, 6, 6]} />}
      {data.shape === 1 && <coneGeometry args={[1, 2, 4]} />}
      {data.shape === 2 && <boxGeometry args={[1.5, 0.2, 0.8]} />}
      
      <meshStandardMaterial
        color={data.color}
        emissive={data.color}
        emissiveIntensity={1.5}
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ===== CHALKBOARD & STAGE TITLE =====
function StageTitle() {
  const phase = useGameStore((s) => s.phase);
  const students = useGameStore((s) => s.students);
  const currentStudentIndex = useGameStore((s) => s.currentStudentIndex);
  
  const showStudentInfo = (phase === PHASES.SPOTLIGHT || phase === PHASES.MEMORY_CHAIN) && currentStudentIndex >= 0;
  const currentStudent = showStudentInfo ? students[currentStudentIndex] : null;

  return (
    <group position={[0, 5, -9.8]}>
      {/* Chalkboard Board */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[12, 4, 0.2]} />
        <meshStandardMaterial color="#0f3b21" roughness={0.9} /> {/* Dark green chalkboard */}
      </mesh>
      {/* Chalkboard Wooden Frame */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[12.4, 4.4, 0.15]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} /> {/* Dark wood */}
      </mesh>
      
      <Html position={[0, 0, 0.2]} center distanceFactor={15} style={{ pointerEvents: 'none' }}>
        <div style={{
          width: '800px',
          textAlign: 'center',
          fontFamily: 'Outfit, sans-serif',
          color: 'white',
        }}>
          {showStudentInfo ? (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 style={{ fontSize: '36px', color: '#fbbf24', margin: '0 0 10px 0', fontWeight: 800 }}>
                Meet {currentStudent.name}!
              </h2>
              <p style={{ fontSize: '24px', margin: 0, color: '#e2e8f0', letterSpacing: '1px' }}>
                {currentStudent.icon} {currentStudent.label}
              </p>
            </div>
          ) : (
            <div style={{
              fontSize: '32px',
              fontWeight: 800,
              color: '#f97316',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              letterSpacing: '4px',
            }}>
              ⭐ JUMP IN, JUMP OUT ⭐
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

// ===== SCENE CONTENT =====
function GameShowScene() {
  const celebrationActive = useGameStore((s) => s.celebrationActive);

  return (
    <>
      {/* Ambient */}
      <ambientLight intensity={0.5} color="#fff5e6" />

      {/* Stage lights */}
      <StageSpotlights />

      {/* Room fill */}
      <pointLight position={[0, 8, 5]} intensity={0.4} color="#fef3c7" />

      {/* Structure */}
      <StageFloor />
      <BackWall />
      <CenterStage />
      <Curtain side="left" />
      <Curtain side="right" />
      <Valance />
      <Bunting />
      <StageTitle />

      {/* Audience & Spotlight */}
      <Audience />
      <SpotlightCharacter />

      {/* Sparkles */}
      <Sparkles count={celebrationActive ? 60 : 15} />
    </>
  );
}

export default function ThreeScene() {
  return (
    <div className="three-canvas-wrapper">
      <Canvas
        camera={{ position: [0, 3, 13], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
        }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#e8f4fd']} />
          <fog attach="fog" args={['#e8f4fd', 18, 38]} />
          <GameShowScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
