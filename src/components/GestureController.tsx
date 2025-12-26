```typescript
import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { GestureManager } from "../gesture/GestureManager";
import { type HandLandmarkerResult } from "@mediapipe/tasks-vision";

interface GestureControllerProps {
  onPinch: (distance: number) => void;
  onToggle: () => void;
}

export function GestureController({
  onPinch,
  onToggle,
}: GestureControllerProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gestureStatus, setGestureStatus] = useState<string>("Scanning...");
  const requestRef = useRef<number>(0);
  const lastGeatureTime = useRef<number>(0);

  useEffect(() => {
    const init = async () => {
      await GestureManager.getInstance().initialize();
      setIsLoaded(true);
    };
    init();
  }, []);

  const detect = () => {
    const webcam = webcamRef.current;
    const landmarker = GestureManager.getInstance().getLandmarker();
    const canvas = canvasRef.current;

    if (
      webcam &&
      webcam.video &&
      webcam.video.readyState === 4 &&
      landmarker &&
      canvas
    ) {
      const video = webcam.video;
      const { videoWidth, videoHeight } = video;

      canvas.width = videoWidth;
      canvas.height = videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Mirror effect
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-videoWidth, 0);

      const startTimeMs = performance.now();
      const result = landmarker.detectForVideo(video, startTimeMs);

      // Clear with sci-fi grid overlay
      ctx.clearRect(0, 0, videoWidth, videoHeight);

      // Draw Sci-Fi HUD Elements
      drawHUD(ctx, videoWidth, videoHeight);

      if (result.landmarks && result.landmarks.length > 0) {
        processGestures(result, ctx, videoWidth, videoHeight);
      } else {
        setGestureStatus("No Hand Detected");
      }

      ctx.restore();
    }
    requestRef.current = requestAnimationFrame(detect);
  };

  const drawHUD = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Draw corner brackets
    const s = 40; // size
    ctx.moveTo(20, 20 + s);
    ctx.lineTo(20, 20);
    ctx.lineTo(20 + s, 20);
    ctx.moveTo(w - 20 - s, 20);
    ctx.lineTo(w - 20, 20);
    ctx.lineTo(w - 20, 20 + s);
    ctx.moveTo(20, h - 20 - s);
    ctx.lineTo(20, h - 20);
    ctx.lineTo(20 + s, h - 20);
    ctx.moveTo(w - 20 - s, h - 20);
    ctx.lineTo(w - 20, h - 20);
    ctx.lineTo(w - 20, h - 20 - s);
    ctx.stroke();
  };

  const processGestures = (
    result: HandLandmarkerResult,
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number
  ) => {
    const landmarks = result.landmarks[0];
    if (!landmarks) return;

    // Draw connections manually for custom sci-fi look
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#00f0ff";
    ctx.fillStyle = "#ffffff";

    // Draw Points
    landmarks.forEach((p) => {
      const x = p.x * w;
      const y = p.y * h;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();

      // Glow effect
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(0, 255, 255, 0.3)";
      ctx.stroke();
    });

    // Check Pinch (Thumb Tip 4 - Index Tip 8)
    const thumb = landmarks[4];
    const index = landmarks[8];
    const dist = Math.hypot(thumb.x - index.x, thumb.y - index.y);

    // Draw Line between pinch fingers
    ctx.beginPath();
    ctx.moveTo(thumb.x * w, thumb.y * h);
    ctx.lineTo(index.x * w, index.y * h);
    if (dist < 0.05) {
      ctx.strokeStyle = "#00ff00"; // Active Green
      setGestureStatus("PINCH: Active");
      onPinch(dist);
    } else {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; // Inactive
      setGestureStatus("Tracking Hand...");
    }
    ctx.stroke();

    // Check Toggle (Fist) - Simple heuristic: Finger tips below PIP joints
    // Index tip 8 > Index PIP 6 (in Y axis, since Y increases downwards)
    const isFist =
      landmarks[8].y > landmarks[6].y &&
      landmarks[12].y > landmarks[10].y &&
      landmarks[16].y > landmarks[14].y;

    if (isFist) {
      // Debounce toggle
      if (Date.now() - lastGeatureTime.current > 1000) {
        onToggle();
        lastGeatureTime.current = Date.now();
      }
      ctx.strokeStyle = "red";
      ctx.strokeRect(
        landmarks[0].x * w - 50,
        landmarks[0].y * h - 50,
        100,
        100
      );
      setGestureStatus("GESTURE: Fist (Toggle)");
    }
  };

  useEffect(() => {
    if (isLoaded) {
      requestRef.current = requestAnimationFrame(detect);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isLoaded]);

  return (
    <div className="absolute top-4 right-4 w-64 h-48 bg-black/50 border border-cyan-500/30 rounded-lg overflow-hidden backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.3)]">
      <Webcam
        ref={webcamRef}
        className="absolute inset-0 w-full h-full object-cover opacity-60 scale-x-[-1]"
        mirrored
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute bottom-2 left-2 right-2 text-xs font-mono text-cyan-400 bg-black/60 px-2 py-1 rounded border border-cyan-900/50 flex justify-between">
        <span>VISION SYS</span>
        <span
          className={
            gestureStatus.includes("Active")
              ? "text-green-400 font-bold"
              : "text-cyan-600"
          }
        >
          {gestureStatus}
        </span>
      </div>
    </div>
  );
}
