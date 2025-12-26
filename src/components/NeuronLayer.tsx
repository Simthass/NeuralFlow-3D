import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Instance, Instances, Float, Sparkles } from "@react-three/drei";

interface NeuronLayerProps {
  count: number;
  position: [number, number, number];
  index: number; // Layer index for color variation
}

export function NeuronLayer({ count, position, index }: NeuronLayerProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Cyberpunk colors based on layer depth
  const colors = ["#00f3ff", "#bc13fe", "#ff0055", "#ccff00"];
  const color = colors[index % colors.length];

  const layout = useMemo(() => {
    const temp = [];
    // Spiral Distribution for a cooler look than grid
    for (let i = 0; i < count; i++) {
      const theta = i * 2.39996; // Golden angle approx
      const r = Math.sqrt(i) * 0.6;
      const x = Math.cos(theta) * r;
      const y = Math.sin(theta) * r;
      // Add random jitter for organic feel
      temp.push({ position: [x, y, 0] as [number, number, number] });
    }
    return temp;
  }, [count]);

  // Animate the neurons gently
  useFrame(() => {
    if (meshRef.current) {
      // Breathing effect on scale or individual positions could go here
      // But OrbitControls + Float wrapper usually handles the "alive" feel
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Instances range={count}>
          {/* Geometric shape: Icosahedron for tech feel */}
          <icosahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2} // High intensity for Bloom
            toneMapped={false} // Important for Bloom to work well
          />
          {layout.map((data, i) => (
            <Instance key={i} position={data.position} />
          ))}
        </Instances>

        {/* Add Sparkles around the layer for energy effect */}
        <Sparkles
          count={count * 3}
          scale={4}
          size={4}
          speed={0.4}
          opacity={0.5}
          color={color}
        />
      </Float>
    </group>
  );
}
