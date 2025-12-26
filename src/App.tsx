import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";

const RotatingCube = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#4f46e5"
        emissive="#312e81"
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
};

const Scene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls makeDefault enableDamping dampingFactor={0.05} />

      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      <RotatingCube />

      <Environment preset="city" />
    </>
  );
};

export default function App() {
  return (
    <div className="h-screen w-full bg-black">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <Scene />
      </Canvas>

      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent filter drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
          NeuralFlow 3D
        </h1>
        <p className="text-white/60 text-sm mt-1 font-mono">
          System Initialized...
        </p>
      </div>
    </div>
  );
}
