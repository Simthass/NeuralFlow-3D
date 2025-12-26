import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";

interface SynapseSystemProps {
  layer1count: number;
  layer1pos: [number, number, number];
  layer2count: number;
  layer2pos: [number, number, number];
  active: boolean; // If training, animate faster
}

export function SynapseSystem({
  layer1count,
  layer1pos,
  layer2count,
  layer2pos,
  active,
}: SynapseSystemProps) {
  // Generate random connections instead of ALL connections to reduce clutter and restart loop
  // Connectivity: ~20% dense
  const connections = useMemo(() => {
    const conns = [];

    // Helper to get position from spiral layout (Must match NeuronLayer logic!)
    const getPos = (i: number, base: [number, number, number]) => {
      const theta = i * 2.39996;
      const r = Math.sqrt(i) * 0.6;
      return new THREE.Vector3(
        Math.cos(theta) * r + base[0],
        Math.sin(theta) * r + base[1],
        base[2]
      );
    };

    // Limit max connections for aesthetics
    const maxConnsPerNeuron = 3;

    for (let i = 0; i < layer1count; i++) {
      // Connect to random subset of next layer
      for (let j = 0; j < maxConnsPerNeuron; j++) {
        const targetIdx = Math.floor(Math.random() * layer2count);
        conns.push({
          start: getPos(i, layer1pos),
          end: getPos(targetIdx, layer2pos),
        });
      }
    }
    return conns;
  }, [layer1count, layer1pos, layer2count, layer2pos]);

  return (
    <group>
      {connections.map((conn, i) => (
        <EnergyBeam
          key={i}
          start={conn.start}
          end={conn.end}
          active={active}
          delay={Math.random() * 2}
        />
      ))}
    </group>
  );
}

function EnergyBeam({
  start,
  end,
  active,
  delay,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  active: boolean;
  delay: number;
}) {
  const ref = useRef<any>(null);

  useFrame(() => {
    if (ref.current) {
      // Dash offset animation for "data flow" look
      ref.current.material.dashOffset -= active ? 0.02 : 0.005;
    }
  });

  return (
    <Line
      ref={ref}
      points={[start, end]}
      color={active ? "#ffffff" : "#444444"}
      opacity={active ? 0.6 : 0.1}
      transparent
      lineWidth={1}
      dashed
      dashScale={5}
      dashSize={0.5}
      dashOffset={delay}
      gapSize={0.5}
    />
  );
}
