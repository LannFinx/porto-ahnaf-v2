'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- 1. Custom Hook untuk Deteksi Mobile ---
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// --- 2. Komponen Bintang Minimalis & Hidup ---
function PlayableStars({ isMobile, mouseRef }: { isMobile: boolean, mouseRef: React.MutableRefObject<{x: number, y: number}> }) {
  const count = 400; 
  const pointsRef = useRef<THREE.Points>(null);

  const starColors = [
    '#ffffff', '#ffffff', '#e2e8f0', '#9bb0ff', '#fff4ea',
  ];

  const { positions, basePositions, phases, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const basePos = new Float32Array(count * 3);
    const phaseArray = new Float32Array(count * 3); 
    const col = new Float32Array(count * 3);
    
    const tempColor = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 30 - 5; 
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      basePos[i * 3] = x;
      basePos[i * 3 + 1] = y;
      basePos[i * 3 + 2] = z;

      phaseArray[i * 3] = Math.random() * Math.PI * 2;
      phaseArray[i * 3 + 1] = Math.random() * Math.PI * 2;
      phaseArray[i * 3 + 2] = Math.random() * Math.PI * 2;

      tempColor.set(starColors[Math.floor(Math.random() * starColors.length)]);
      
      col[i * 3] = tempColor.r;
      col[i * 3 + 1] = tempColor.g;
      col[i * 3 + 2] = tempColor.b;
    }
    return { positions: pos, basePositions: basePos, phases: phaseArray, colors: col };
  }, []);

  useFrame(({ camera, clock }) => {
    if (!pointsRef.current) return;
    
    const time = clock.getElapsedTime();
    const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Menggunakan mouseRef dari Global Listener, bukan bawaan R3F yang terblokir UI
    const vector = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const mousePos = camera.position.clone().add(dir.multiplyScalar(distance));

    for (let i = 0; i < count; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const bz = basePositions[i * 3 + 2];

      const floatX = bx + Math.sin(time * 0.3 + phases[i * 3]) * 1.5;
      const floatY = by + Math.cos(time * 0.3 + phases[i * 3 + 1]) * 1.5;
      const floatZ = bz + Math.sin(time * 0.2 + phases[i * 3 + 2]) * 1.0;

      const targetPos = new THREE.Vector3(floatX, floatY, floatZ);
      const currentPos = new THREE.Vector3(positionsArray[i * 3], positionsArray[i * 3 + 1], positionsArray[i * 3 + 2]);

      const distToMouse = mousePos.distanceTo(currentPos);
      const interactRadius = 3.5; 

      if (distToMouse < interactRadius && !isMobile) {
        const force = (interactRadius - distToMouse) / interactRadius;
        const pushDir = currentPos.clone().sub(mousePos).normalize();
        targetPos.add(pushDir.multiplyScalar(force * 2.5));
      }

      currentPos.lerp(targetPos, 0.05);

      positionsArray[i * 3] = currentPos.x;
      positionsArray[i * 3 + 1] = currentPos.y;
      positionsArray[i * 3 + 2] = currentPos.z;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        {/* FIX TYPESCRIPT: Menggunakan args={[array, itemSize]} agar bebas error merah */}
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

// --- 3. Wrapper Utama ---
export default function StarBackground() {
  const isMobile = useIsMobile();
  
  // Referensi mouse global agar tembus layer z-index
  const mouseRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalisasi kursor dari -1 ke 1
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  return (
    <div className="fixed inset-0 z-[-1] bg-[#020305]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 2]}>
        <PlayableStars isMobile={isMobile} mouseRef={mouseRef} />
      </Canvas>
      <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] bg-white opacity-[0.015] blur-[150px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}