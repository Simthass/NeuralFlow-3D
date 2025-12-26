import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { NeuronLayer } from "./NeuronLayer";
import { SynapseSystem } from "./SynapseSystem";
import { Stars } from "@react-three/drei";

interface NeuralNetworkProps {
  isTraining?: boolean;
}

export function NeuralNetwork({ isTraining = false }: NeuralNetworkProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Slow subtle rotation for the whole network
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  // Define network architecture
  const layers = [
    { count: 12, pos: [-4, 0, 0] as [number, number, number] },
    { count: 16, pos: [-1.5, 0, 0] as [number, number, number] },
    { count: 16, pos: [1.5, 0, 0] as [number, number, number] },
    { count: 8, pos: [4, 0, 0] as [number, number, number] },
  ];

  return (
    <group ref={groupRef}>
      {/* Background Stars for depth */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Render Layers */}
      {layers.map((layer, i) => (
        <NeuronLayer
          key={i}
          index={i}
          count={layer.count}
          position={layer.pos}
        />
      ))}

      {/* Render Connections */}
      {layers.map((layer, i) => {
        if (i < layers.length - 1) {
          return (
            <SynapseSystem
              key={i}
              layer1count={layer.count}
              layer1pos={layer.pos}
              layer2count={layers[i + 1].count}
              layer2pos={layers[i + 1].pos}
              active={isTraining}
            />
          );
        }
        return null;
      })}
    </group>
  );
}
