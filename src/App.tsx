import { useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import { NeuralNetwork } from "./components/NeuralNetwork";
import { ControlPanel } from "./components/ControlPanel";
import { GestureController } from "./components/GestureController";
import { Effects } from "./components/Effects";

const Scene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <OrbitControls makeDefault enableDamping dampingFactor={0.05} />

      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />

      <NeuralNetwork />
      <Effects />

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

  // Gesture Handlers
  const handlePinch = useCallback((distance: number) => {
    // Map pinch distance (approx 0.01 to 0.1) to Learning Rate (0.001 to 0.1)
    const newRate = Math.min(0.1, Math.max(0.0001, distance));
    setLearningRate(newRate);
  }, []);

  const handleToggle = useCallback(() => {
    setIsTraining((prev) => !prev);
  }, []);

  // Simulation Loop
  useEffect(() => {
    let animationFrame: number;

    const loop = () => {
      if (isTraining) {
        setEpoch((e) => e + 1);
        setAccuracy((a) => Math.min(0.99, a + (0.99 - a) * 0.001));
        setLoss((l) => Math.max(0.01, l * 0.995));
        // Vibrate learning rate slightly to simulate adaptive LR unless controlled by hand
        // For now, let's keep the vibration if not being pinched, but that requires complex state tracking.
        // We'll just let the pinch override it instantly in the next frame if active.
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

      <GestureController onPinch={handlePinch} onToggle={handleToggle} />
    </div>
  );
}
