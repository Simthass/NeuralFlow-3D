import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface SynapseSystemProps {
  layer1count: number;
  layer1pos: [number, number, number];
  layer2count: number;
  layer2pos: [number, number, number];
}

export function SynapseSystem({
  layer1count,
  layer1pos,
  layer2count,
  layer2pos,
}: SynapseSystemProps) {
  const linesRef = useRef<THREE.LineSegments>(null);

  // Calculate positions of all neurons in both layers to draw lines between them
  // This needs to match the logic in NeuronLayer.tsx
  const geometry = useMemo(() => {
    const points: number[] = [];

    // Reconstruct neuron positions
    const getNeuronPositions = (
      count: number,
      basePos: [number, number, number]
    ) => {
      const pos = [];
      const cols = Math.ceil(Math.sqrt(count));
      const rows = Math.ceil(count / cols);

      for (let i = 0; i < count; i++) {
        const x = (i % cols) * 0.5 - cols * 0.5 * 0.5 + 0.25 + basePos[0];
        const y =
          Math.floor(i / cols) * 0.5 - rows * 0.5 * 0.5 + 0.25 + basePos[1];
        const z = basePos[2];
        pos.push(new THREE.Vector3(x, y, z));
      }
      return pos;
    };

    const startPoints = getNeuronPositions(layer1count, layer1pos);
    const endPoints = getNeuronPositions(layer2count, layer2pos);

    // Create full mesh connectivity
    startPoints.forEach((start) => {
      endPoints.forEach((end) => {
        points.push(start.x, start.y, start.z);
        points.push(end.x, end.y, end.z);
      });
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, [layer1count, layer1pos, layer2count, layer2pos]);

  useFrame((state) => {
    if (linesRef.current) {
      // Optional: Animate opacity or dash offset here to simulate data flow
      (linesRef.current.material as THREE.LineBasicMaterial).opacity =
        0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial
        color="#60a5fa"
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}
