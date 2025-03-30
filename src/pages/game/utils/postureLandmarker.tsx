import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import {
  Holistic,
  Results,
  POSE_CONNECTIONS,
  HAND_CONNECTIONS,
} from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

let screenResolution = { x: 560, y: 315 }; //{x: 1280, y: 720};

const PostureLandmarker: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fps, setFps] = useState<number>(0);
  const lastTimestamp = useRef<number>(performance.now());

  useEffect(() => {
    if (!webcamRef.current || !canvasRef.current) return;

    const holistic = new Holistic({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });

    holistic.setOptions({
      modelComplexity: 0,
      smoothLandmarks: false,
      enableSegmentation: false,
      refineFaceLandmarks: false,
    });

    holistic.onResults((results: Results) => {
      measureFPS(); // Measure FPS per frame
      drawResults(results);
    });

    const videoElement = webcamRef.current.video as HTMLVideoElement;
    if (!videoElement) return;

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await holistic.send({ image: videoElement });
      },
      width: screenResolution.x,
      height: screenResolution.y,
    });

    camera.start();

    return () => {
      camera.stop();
    };
  }, []);

  /** 🕒 Measure FPS per frame */
  const measureFPS = () => {
    const now = performance.now();
    const deltaTime = now - lastTimestamp.current;
    lastTimestamp.current = now;
    setFps(Math.round(1000 / deltaTime)); // Convert to FPS
  };

  /** 🎨 Draw results on the canvas */
  const drawResults = (results: Results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Pose Landmarks
    if (results.poseLandmarks) {
      drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: "white",
      });
      drawLandmarks(ctx, results.poseLandmarks, { color: "red" });
    }

    // Draw Hands Landmarks
    if (results.leftHandLandmarks) {
      drawConnectors(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, {
        color: "blue",
      });
      drawLandmarks(ctx, results.leftHandLandmarks, { color: "lightblue" });
    }
    if (results.rightHandLandmarks) {
      drawConnectors(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, {
        color: "green",
      });
      drawLandmarks(ctx, results.rightHandLandmarks, { color: "lightgreen" });
    }

    // Draw Face Landmarks
    if (results.faceLandmarks) {
      drawLandmarks(ctx, results.faceLandmarks, { color: "yellow", radius: 1 });
    }
  };

  return (
    <div style={{ position: "relative", width: screenResolution.x, height: screenResolution.y }}>
      {/* Webcam */}
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: screenResolution.x,
          height: screenResolution.y,
          transform: "scaleX(-1)", // Flip horizontally
        }}
        mirrored
      />

      {/* Canvas for drawing landmarks */}
      <canvas
        ref={canvasRef}
        width={screenResolution.x}
        height={screenResolution.y}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
        }}
      />

      {/* FPS Display */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          background: "black",
          color: "white",
          padding: "5px 10px",
          fontSize: "16px",
          borderRadius: "5px",
        }}
      >
        FPS: {fps}
      </div>
    </div>
  );
};

export default PostureLandmarker;
