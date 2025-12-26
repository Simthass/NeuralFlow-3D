import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Instance, Instances } from "@react-three/drei";

interface NeuronLayerProps {
  count: number;
  position: [number, number, number];
  color?: string;
  activation?: number[];
}

export function NeuronLayer({
  count,
  position,
  color = "#4f46e5",
  activation,
}: NeuronLayerProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation for neurons
      meshRef.current.position.y =
        position[1] +
        Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1;
    }
  });

  // Arrange neurons in a grid/circle layout based on count
  const layout = useMemo(() => {
    const temp = [];
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);

    for (let i = 0; i < count; i++) {
      const x = (i % cols) * 0.5 - cols * 0.5 * 0.5 + 0.25;
      const y = Math.floor(i / cols) * 0.5 - rows * 0.5 * 0.5 + 0.25;
      temp.push({ position: [x, y, 0] as [number, number, number] });
    }
    return temp;
  }, [count]);

  return (
    <group position={position} ref={meshRef as any}>
      <Instances range={count}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
        {layout.map((data, i) => (
          <Instance
            key={i}
            position={data.position}
            scale={activation && activation[i] ? 1 + activation[i] : 1}
          />
        ))}
      </Instances>
    </group>
  );
}
