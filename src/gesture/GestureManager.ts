import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

export class GestureManager {
  private static instance: GestureManager;
  private handLandmarker: HandLandmarker | null = null;
  private isInitializing = false;

  private constructor() {}

  static getInstance(): GestureManager {
    if (!GestureManager.instance) {
      GestureManager.instance = new GestureManager();
    }
    return GestureManager.instance;
  }

  async initialize() {
    if (this.handLandmarker || this.isInitializing) return;
    this.isInitializing = true;

    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
      );

      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });

      console.log("MediaPipe HandLandmarker initialized");
    } catch (error) {
      console.error("Failed to initialize MediaPipe:", error);
    } finally {
      this.isInitializing = false;
    }
  }

  getLandmarker() {
    return this.handLandmarker;
  }
}
