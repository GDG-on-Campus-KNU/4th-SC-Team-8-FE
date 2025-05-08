import { useState, createContext, useContext, useEffect, useRef, RefObject } from 'react';
import YoutubeVideoPlayPanel from './components/YoutubeVideoPlayPanel';
import WebcamPanel from './components/WebcamPanel';
import { ai, aiws } from '../../shared/ServerEndpoint';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import geminiLogo from '../../assets/geminiLogo.png';
// import PostureLandmarker from './utils/postureLandmarker';
// import YoutubeHandTracking from './utils/youtubeHandTracking';

//sendSubtitleRequest("https://www.youtube.com/watch?v=gI5uNff3kbM");
//Ex: sendSubtitleRequest("https://www.youtube.com/watch?v=gI5uNff3kbM");
//To be implemented... captions are separated apart, unable to use it...
function sendSubtitleRequest(youtubeUrl: string) {
    return fetch(`${ai}/get_subtitle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: youtubeUrl, lang: "ko" })
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}


interface LandmarkContextProps {
    socket: RefObject<WebSocket | null>;
    landmarks: any;
    setLandmarks: React.Dispatch<React.SetStateAction<any>>;
}

const LandmarkContext = createContext<LandmarkContextProps | undefined>(undefined); // Use undefined

export const useLandmarkContext = () => {
    const context = useContext(LandmarkContext);
    if (!context) {
        throw new Error("useLandmarkContext must be used within a LandmarkContextProvider");
    }
    return context;
};

const GamePage = () => {
    const { gameUrl } = useParams<{ gameUrl?: string }>();
    const [landmarks, setLandmarks] = useState(null);
    const [captions, setCaptions] = useState<any>(null);
    const socket = useRef<WebSocket | null>(null);
    const [scoreData, setScoreData] = useState<any>(null);
    const [displayCaption, setDisplayCaption] = useState<string | null>("자막이 여기에 표시됩니다.");

    const [captionState, setCaptionState] = useState("gray");
    const [socketState, setSocketState] = useState("gray");

    useEffect(() => {
        async function fetchCaptions() {
            let youtubeURL = `https://www.youtube.com/watch?v=${gameUrl}`;
            console.log("자막 요청, 대기중...");
            setCaptionState("orange");
            let caps: any = await sendSubtitleRequest(youtubeURL);
            setCaptionState(!caps ? "red" : "green");
            console.log("자막 반환됨: ", caps);
            setCaptions(caps.subtitle.events);
            socket.current = new WebSocket(`${aiws}?video_url=${encodeURIComponent(youtubeURL)}`);
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

            };
            socket.current.onclose = (e: any) => {
                console.log("소켓 연결 종료됨", e);
                setSocketState("red");
            }
        };
        fetchCaptions();
    }, []);


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

    return (
        <>
            <LandmarkContext.Provider value={{ socket, landmarks, setLandmarks }}>
                <PanelWrapper>
                    <VerticalWrapper>
                        <YoutubeVideoPlayPanel captions={captions} displayCaption={displayCaption} setDisplayCaption={setDisplayCaption} />
                        <CaptionDisplay>현재 문장 : {displayCaption}</CaptionDisplay>
                    </VerticalWrapper>
                    <VerticalWrapper>
                        <WebcamPanel />
                        <ScoreDisplay>{getScore(scoreData?.sentence_label)} ({scoreData?.sentence_label}:{scoreData?.sentence_score})</ScoreDisplay>
                    </VerticalWrapper>
                </PanelWrapper>
                {/* <PostureLandmarker/> */}
                {/* <YoutubeHandTracking/> */}
                <PanelWrapper>
                <InfoDisplay>
                    <ul>
                        <li>상태 목록</li>
                        <li><span style={{ color: "gray" }}>⬤</span> : 대기중</li>
                        <li><span style={{ color: "orange" }}>⬤</span> : 시도중</li>
                        <li><span style={{ color: "green" }}>⬤</span> : 성공</li>
                        <li><span style={{ color: "red" }}>⬤</span> : 실패</li>
                    </ul>
                    <h3>자막 정보 <span style={{ color: captionState }}>⬤</span></h3>
                    <h3>서버 연결 <span style={{ color: socketState }}>⬤</span></h3>
                </InfoDisplay>

                <CanvasDisplay>여기에 추후 점수 그래프 표시</CanvasDisplay>
                <GeminiHelper>
                <img src={geminiLogo} height={75}></img>
                <p>AI 도우미</p>
                </GeminiHelper>
                </PanelWrapper>
            </LandmarkContext.Provider>
        </>
    );
}

const GeminiHelper = styled.div`
width: 120px;
height: 120px;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35);
padding: 10px;
border-radius: 100px;
transition: all 0.5s ease-in-out;

&:hover {
    font-size: 20px;
    transform: scale(1.05);
    background-color: rgb(100, 100, 100);
    color: white;
}
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
