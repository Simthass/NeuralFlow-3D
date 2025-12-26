import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { NeuronLayer } from "./NeuronLayer";
import { SynapseSystem } from "./SynapseSystem";

export function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Slow subtle rotation for the whole network
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  // Define network architecture
  const layers = [
    {
      count: 16,
      pos: [-4, 0, 0] as [number, number, number],
      color: "#ef4444",
    }, // Input
    {
      count: 24,
      pos: [-1.5, 0, 0] as [number, number, number],
      color: "#3b82f6",
    }, // Hidden 1
    {
      count: 24,
      pos: [1.5, 0, 0] as [number, number, number],
      color: "#8b5cf6",
    }, // Hidden 2
    { count: 10, pos: [4, 0, 0] as [number, number, number], color: "#10b981" }, // Output
  ];

  return (
    <group ref={groupRef}>
      {/* Render Layers */}
      {layers.map((layer, i) => (
        <NeuronLayer
          key={i}
          count={layer.count}
          position={layer.pos}
          color={layer.color}
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
            />
          );
        }
        return null;
      })}
    </group>
  );
}
