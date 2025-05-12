import {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
  RefObject,
} from "react";
import YoutubeVideoPlayPanel from "./components/YoutubeVideoPlayPanel";
import WebcamPanel from "./components/WebcamPanel";
import { ai, aiws } from "../../shared/ServerEndpoint";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import GeminiPromptPanel, {
  GeminiCoverPanel,
} from "./components/GeminiPromptPanel";
// import PostureLandmarker from './utils/postureLandmarker';
// import YoutubeHandTracking from './utils/youtubeHandTracking';

//sendSubtitleRequest("https://www.youtube.com/watch?v=gI5uNff3kbM");
//Ex: sendSubtitleRequest("https://www.youtube.com/watch?v=gI5uNff3kbM");
//To be implemented... captions are separated apart, unable to use it...
function sendSubtitleRequest(youtubeUrl: string) {
  return fetch(`${ai}/get_subtitle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: youtubeUrl, lang: "ko" }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
}

interface LandmarkContextProps {
  socket: RefObject<WebSocket | null>;
  landmarks: any;
  setLandmarks: React.Dispatch<React.SetStateAction<any>>;
}

const LandmarkContext = createContext<LandmarkContextProps | undefined>(
  undefined
); // Use undefined

export const useLandmarkContext = () => {
  const context = useContext(LandmarkContext);
  if (!context) {
    throw new Error(
      "useLandmarkContext must be used within a LandmarkContextProvider"
    );
  }
  return context;
};

const GamePage = () => {
  const { gameUrl } = useParams<{ gameUrl?: string }>();
  const [landmarks, setLandmarks] = useState(null);
  const [captions, setCaptions] = useState<any>(null);
  const socket = useRef<WebSocket | null>(null);
  const [scoreData, setScoreData] = useState<any>(null);
  const [displayCaption, setDisplayCaption] = useState<string | null>(
    "자막이 여기에 표시됩니다."
  );
  const displayCaptionRef = useRef(displayCaption);
  const displayCaptionPrevRef = useRef(displayCaption);
  useEffect(() => {
    displayCaptionPrevRef.current = displayCaptionRef.current;
    displayCaptionRef.current = displayCaption;
  }, [displayCaption]);

  const [captionState, setCaptionState] = useState("gray");
  const [socketState, setSocketState] = useState("gray");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cvx, setCvx] = useState<any>(null);
  const [scoreHistory, setScoreHistory] = useState<any>([]);
  const [captionHistory, setCaptionHistory] = useState<any>([]);

  useEffect(() => {
    async function fetchCaptions() {
      let youtubeURL = `https://www.youtube.com/watch?v=${gameUrl}`;
      console.log("자막 요청, 대기중...");
      setCaptionState("orange");
      let caps: any = await sendSubtitleRequest(youtubeURL);
      console.log("caps => ", caps);
      if (caps && caps.status == "success") {
        console.log("자막 반환됨: ", caps);
        setCaptions(caps.subtitle.events);
        setCaptionState("green");
      } else {
        console.log("자막 없음");
        setCaptionState("red");
        return;
      }
      socket.current = new WebSocket(
        `${aiws}?video_url=${encodeURIComponent(youtubeURL)}`
      );
      setSocketState("orange");
      socket.current.onopen = () => {
        console.log("소켓 연결됨");
        setSocketState("green");
      };
      socket.current.onmessage = (e: any) => {
        console.log("소켓 메시지 수신됨");
        const data = JSON.parse(e.data);
        setScoreData(data);
        console.log(data);

        setScoreHistory((prev: any) => [...prev, data.sentence_score]);
        setCaptionHistory((prev: any) => [
          ...prev,
          displayCaptionPrevRef.current,
        ]);
      };
      socket.current.onclose = (e: any) => {
        console.log("소켓 연결 종료됨", e);
        setSocketState("red");
      };
    }
    fetchCaptions();
  }, []);

  useEffect(() => {
    let cvs = canvasRef.current;
    let ctx = cvs?.getContext("2d");
    if (cvs && ctx) {
      setCvx({ cvs, ctx });
    }
  }, [canvasRef]);

  const handleDrawOnCanvas = () => {
    if (cvx) {
      let cvs = cvx.cvs as HTMLCanvasElement;
      let ctx = cvx.ctx as CanvasRenderingContext2D;
      let WIDTH = cvs.width;
      let HEIGHT = cvs.height;
      //ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      //   ctx.beginPath();
      //   ctx.lineWidth = 3;
      //   ctx.moveTo(0, 0);
      //   ctx.lineTo(0, HEIGHT);
      //   ctx.lineTo(WIDTH, HEIGHT);
      //   ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.moveTo(0, 0);
      ctx.lineTo(WIDTH, 0);
      ctx.stroke();
      ctx.moveTo(0, HEIGHT);
      ctx.lineTo(WIDTH, HEIGHT);
      ctx.stroke();

      const average = (array: any) =>
        array.reduce((a: number, b: number) => a + b) / array.length;
      let max = Math.max(...scoreHistory);
      let min = Math.min(...scoreHistory);
      let avg = average(scoreHistory);
      ctx.lineWidth = 1;
      for (let i = 0; i < scoreHistory.length; i++) {
        ctx.beginPath();
        if (i == 0) {
          ctx.moveTo(0, HEIGHT);
        } else {
          ctx.moveTo(
            (WIDTH / scoreHistory.length) * (i - 1),
            HEIGHT - scoreHistory[i - 1] * HEIGHT
          );
        }
        ctx.lineTo(
          (WIDTH / scoreHistory.length) * i,
          HEIGHT - scoreHistory[i] * HEIGHT
        );
        let originalSS = ctx.strokeStyle;
        let c = 255 - (255 * i) / scoreHistory.length / 2;
        ctx.strokeStyle = `rgb(${c},${c},${c})`;
        ctx.stroke();
        ctx.strokeStyle = originalSS;
        ctx.beginPath();
        ctx.arc(
          (WIDTH / scoreHistory.length) * i,
          HEIGHT - scoreHistory[i] * HEIGHT,
          (4 * i) / scoreHistory.length + 1,
          0,
          Math.PI * 2
        );
        let originalFS: string = ctx.fillStyle;
        ctx.fillStyle = `rgb(${c},${c},${c})`;
        ctx.fill();
        ctx.fillStyle = originalFS;
      }

      drawExtreme(max, `최고: ${max.toFixed(2)}`);
      drawExtreme(min, `최저: ${min.toFixed(2)}`);
      drawExtreme(avg, `평균: ${avg.toFixed(2)}`);

      function drawExtreme(v: number, n: string) {
        ctx.strokeText(
          n,
          n.includes("평균") ? 80 : 1,
          n.includes("평균")
            ? 80
            : HEIGHT - v * HEIGHT + (n.includes("최고") ? 10 : -5)
        );
        ctx.beginPath();
        ctx.moveTo(0, HEIGHT - v * HEIGHT);
        ctx.lineTo(
          (WIDTH / scoreHistory.length) * scoreHistory.indexOf(v),
          HEIGHT - v * HEIGHT
        );
        ctx.setLineDash([5, 15]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(
          (WIDTH / scoreHistory.length) * scoreHistory.indexOf(v),
          HEIGHT - v * HEIGHT,
          5,
          0,
          Math.PI * 2
        );
        let original = ctx.fillStyle;
        ctx.fillStyle = n.includes("최고") ? "palevioletred" : "lightblue";
        ctx.fill();
        ctx.fillStyle = original;
        if (!n.includes("평균")) {
          ctx.strokeText(
            captionHistory[scoreHistory.indexOf(v)],
            (WIDTH / scoreHistory.length) * scoreHistory.indexOf(v) + 50,
            HEIGHT + (n.includes("최고") ? -20 : -5)
          );
        }
      }
    }
  };

  useEffect(() => {
    handleDrawOnCanvas();
  }, [scoreHistory]);

  // useEffect(() => {
  //     console.log(landmarks);
  // }, [landmarks]);

  function getScore(score: any) {
    if (!score) return "여기에 점수가 표시됩니다.";
    switch (score) {
      case "bad":
        return "조금 더 노력해 보세요!";
      case "good":
        return "잘하고 있어요!";
      case "great":
        return "아주 잘했어요!";
      case "perfect":
        return "완벽해요!";
    }
  }

  const [openGemini, setOpenGemini] = useState<boolean>(false);

  return (
    <>
      <LandmarkContext.Provider value={{ socket, landmarks, setLandmarks }}>
        <PanelWrapper>
          <VerticalWrapper>
            <YoutubeVideoPlayPanel
              captions={captions}
              displayCaption={displayCaption}
              setDisplayCaption={setDisplayCaption}
            />
            <CaptionDisplay>현재 문장 : {displayCaption}</CaptionDisplay>
          </VerticalWrapper>
          <VerticalWrapper>
            <WebcamPanel />
            <ScoreDisplay>
              {getScore(scoreData?.sentence_label)} ({scoreData?.sentence_label}
              :{scoreData?.sentence_score})
            </ScoreDisplay>
          </VerticalWrapper>
        </PanelWrapper>
        {/* <PostureLandmarker/> */}
        {/* <YoutubeHandTracking/> */}
        <PanelWrapper>
          <InfoDisplay>
            <ul>
              <li>상태 목록</li>
              <li>
                <span style={{ color: "gray" }}>⬤</span> : 대기중
              </li>
              <li>
                <span style={{ color: "orange" }}>⬤</span> : 시도중
              </li>
              <li>
                <span style={{ color: "green" }}>⬤</span> : 성공
              </li>
              <li>
                <span style={{ color: "red" }}>⬤</span> : 실패
              </li>
            </ul>
            <h3>
              자막 정보 <span style={{ color: captionState }}>⬤</span>
            </h3>
            <h3>
              서버 연결 <span style={{ color: socketState }}>⬤</span>
            </h3>
          </InfoDisplay>

          <CanvasDisplay>
            <button
              onClick={() => {
                setScoreHistory([...scoreHistory, Math.random()]);
                setCaptionHistory([
                  ...captionHistory,
                  captions[Math.floor(Math.random() * (captions.length - 1))]
                    .segs[0].utf8,
                ]);
              }}
            >
              샘플 <br />
              그래프
              <br /> 그리기
            </button>
            <canvas
              width={900}
              style={{ width: "90%" }}
              ref={canvasRef}
            ></canvas>
          </CanvasDisplay>
          <GeminiHelper
            open={openGemini}
            onClick={() => !openGemini && setOpenGemini(true)}
          >
            {openGemini ? (
              <GeminiPromptPanel
                setOpenGemini={setOpenGemini}
                scoreHistory={scoreHistory}
                captionHistory={captionHistory}
              />
            ) : (
              <GeminiCoverPanel />
            )}
          </GeminiHelper>
        </PanelWrapper>
      </LandmarkContext.Provider>
    </>
  );
};

const GeminiHelper = styled.div<{ open: boolean }>`
  width: ${(props) => (props.open ? 400 : 120)}px;
  height: ${(props) => (props.open ? 190 : 120)}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35);
  padding: 10px;
  border-radius: ${(props) => (props.open ? 10 : 120)}px;
  transition: all 0.5s ease-in-out;

  ${(props) =>
    !props.open &&
    `
    &:hover {
      font-size: 20px;
      transform: scale(1.05);
      background-color: rgb(100, 100, 100);
      color: white;
    }
  `}
`;

const CanvasDisplay = styled.div`
  width: 50vw;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35);
`;

const InfoDisplay = styled.div`
  border-radius: 10px;
  width: fit-content;
  padding: 10px;
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35);

  ul {
    font-size: 12px;
    list-style: none;
    padding: 5px;
    background-color: rgb(200, 200, 200);
    border-radius: 10px;

    li:nth-child(1) {
      background-color: rgb(100, 100, 100);
      color: white;
      padding: 5px;
      border-radius: 20px;
      text-align: center;
    }
  }

  h3 {
    span {
      transition: all 0.25s ease-in;
    }
  }
`;

const VerticalWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const CaptionDisplay = styled.div`
  border-radius: 10px;
  width: fit-content;
  padding: 10px;
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35);
  font-weight: bold;
  font-size: 20px;
`;

const ScoreDisplay = styled.div`
  border-radius: 10px;
  width: fit-content;
  padding: 10px;
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35);
  font-size: 20px;
`;

const PanelWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

export default GamePage;
