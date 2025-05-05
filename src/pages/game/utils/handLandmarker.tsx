import { useCallback, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { css } from "@emotion/css";
import { Camera } from "@mediapipe/camera_utils";
import { Hands, Results } from "@mediapipe/hands";
import { drawCanvas } from "./drawCanvas";
import { useLandmarkContext } from "../gamePage";

//https://velog.io/@jsj9620/React-MediaPipe-Hands-%EC%9B%B9%EC%97%90%EC%84%9C-%EB%9D%84%EC%9B%8C%EB%B3%B4%EA%B8%B0

let screenResolution = { x: 560, y: 315 }; //{x: 1280, y: 720};

const HandLandmarker = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultsRef = useRef<Results>(null);
  const { setLandmarks } = useLandmarkContext();
  /**
   * 검출결과（프레임마다 호출됨）
   * @param results
   */
  const onResults = useCallback((results: Results) => {
    resultsRef.current = results;
    setLandmarks(results);
    const canvasCtx = canvasRef.current!.getContext("2d")!;
    drawCanvas(canvasCtx, results);
  }, []);

  // 초기 설정
  useEffect(() => {
    setLandmarks(resultsRef.current);

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      const camera = new Camera(webcamRef.current.video!, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current!.video! });
        },
        width: screenResolution.x,
        height: screenResolution.y,
      });
      camera.start();
    }
  }, [onResults]);

  /*  랜드마크들의 좌표를 콘솔에 출력 */
  const OutputData = () => {
    const results = resultsRef.current!;
    console.log(results.multiHandLandmarks);
  };

  return (
    <div className={styles.container}>
      {/* 비디오 캡쳐 */}
      <>
        <Webcam
          audio={false}
          style={{ visibility: "hidden" }}
          width={screenResolution.x}
          height={screenResolution.y}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            // frameRate: { ideal: 30, max: 60 },
            width: screenResolution.x,
            height: screenResolution.y,
            facingMode: "user",
          }}
        />
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={screenResolution.x}
          height={screenResolution.y}
        />
      </>
      {/* 좌표 출력 */}
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={OutputData}>
          Output Data to console
        </button>
      </div>
    </div>
  );
};

// ==============================================
// styles

const styles = {
  container: css`
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  canvas: css`
    position: absolute;
    width: ${screenResolution.x}px;
    height: ${screenResolution.y}px;
    background-color: #fff;
  `,
  buttonContainer: css`
    position: absolute;
    top: 20px;
    left: 20px;
  `,
  button: css`
    color: #fff;
    background-color: #0082cf;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    padding: 10px 10px;
    cursor: pointer;
  `,
};

export default HandLandmarker;
