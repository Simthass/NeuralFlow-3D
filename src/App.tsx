import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import { NeuralNetwork } from "./components/NeuralNetwork";
import { ControlPanel } from "./components/ControlPanel";

const Scene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <OrbitControls makeDefault enableDamping dampingFactor={0.05} />

      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />

      <NeuralNetwork />

      <Environment preset="city" />
    </>
  );
};

export default function App() {
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [accuracy, setAccuracy] = useState(0.1);
  const [loss, setLoss] = useState(0.9);
  const [learningRate, setLearningRate] = useState(0.01);

  // Simulation Loop
  useEffect(() => {
    let animationFrame: number;

    const loop = () => {
      if (isTraining) {
        setEpoch((e) => e + 1);
        setAccuracy((a) => Math.min(0.99, a + (0.99 - a) * 0.001));
        setLoss((l) => Math.max(0.01, l * 0.995));
        // Vibrate learning rate slightly to simulate adaptive LR
        setLearningRate(0.01 + Math.sin(Date.now() * 0.001) * 0.002);
      }
      animationFrame = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationFrame);
  }, [isTraining]);

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <Scene />
      </Canvas>

      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent filter drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
          NeuralFlow 3D
        </h1>
        <p className="text-white/60 text-sm mt-1 font-mono tracking-wider">
          GESTURE-DRIVEN NETWORK VISUALIZER
        </p>
      </div>

      <ControlPanel
        isTraining={isTraining}
        onToggleTraining={() => setIsTraining(!isTraining)}
        epoch={epoch}
        accuracy={accuracy}
        loss={loss}
        learningRate={learningRate}
      />
    </div>
  );
}
