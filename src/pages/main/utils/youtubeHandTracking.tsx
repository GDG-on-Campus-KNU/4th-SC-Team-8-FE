import React, { useEffect, useRef } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { Hands, HAND_CONNECTIONS, Results } from "@mediapipe/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const YoutubeHandTracking: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const handsRef = useRef<Hands | null>(null);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        const loadHandTracking = async () => {
            const hands = new Hands({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
            });

            hands.setOptions({
                maxNumHands: 2,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            hands.onResults(onHandResults);
            handsRef.current = hands;
        };

        loadHandTracking();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

   const onPlayerReady = (event: { target: any }) => {
    const ytIframe = event.target.getIframe();
    videoRef.current = ytIframe;

    // Wait for the video element to be available inside the iframe
    const checkVideoElement = setInterval(() => {
        const videoElement = ytIframe.contentWindow?.document.querySelector("video");

        if (videoElement) {
            clearInterval(checkVideoElement);
            videoRef.current = videoElement; // ✅ Set videoRef to the actual video element
            startFrameCapture();
        }
    }, 500); // Check every 500ms
};


    const startFrameCapture = () => {
        if (!videoRef.current || !handsRef.current) return;

        // Capture frames every 100ms (adjust based on performance)
        intervalRef.current = window.setInterval(async () => {
            if (!videoRef.current) return;

            // Create an offscreen canvas to capture the frame
            const offscreenCanvas = document.createElement("canvas");
            const ctx = offscreenCanvas.getContext("2d");

            if (!ctx) return;

            offscreenCanvas.width = videoRef.current.videoWidth;
            offscreenCanvas.height = videoRef.current.videoHeight;

            ctx.drawImage(videoRef.current, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

            const image = offscreenCanvas; // Use this as the input image
            await handsRef.current?.send({ image });
        }, 100);
    };

    const onHandResults = (results: Results) => {
        if (!canvasRef.current || !videoRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: "white", lineWidth: 2 });
                drawLandmarks(ctx, landmarks, { color: "red", radius: 3 });
            }
        }
    };

    return (
        <div>
        <YouTube 
        videoId="HRWakz9pnnY" 
        onReady={onPlayerReady}
        opts={{
            width: "560",
            height: "315",
            playerVars: { autoplay: 1, controls: 1 }
        }}
        style={{ position: "absolute"}}
        />
        <canvas ref={canvasRef} style={{ position: "relative", pointerEvents: "none", width: "560px", height: "315px" }} />
        </div>
    );
};

export default YoutubeHandTracking;
