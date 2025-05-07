import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import YouTube from "react-youtube";
import YoutubeHandTracking from "../utils/youtubeHandTracking";
import { PanelWrapper } from "../../../globalStyle";
import { useParams } from "react-router-dom";
import { useLandmarkContext } from "../gamePage";

//https://www.youtube.com/watch?v=42fmMP81EvA&t=854s
//https://www.youtube.com/watch?v=HRWakz9pnnY
// videoId : https://www.youtube.com/watch?v={videoId} 유튜브 링크의 끝부분에 있는 고유한 아이디
// const dummyKey = 'HRWakz9pnnY';

const YoutubeVideoPlayPanel = ({ captions }: any) => {
  const playerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playingState, setPlayingState] = useState(false);
  const captionCounterRef = useRef(0);
  const [caption, setCaption] = useState("여기에 자막이 표시됩니다.");
  const waitTime = 3000;

  //=============<Landmarks>==============
  /*
  
  {
  "total_frame": 12,
  "script": "옛날 어느 마을에 마음씨 좋은 나무꾼이 살고 있었어요.",
  "start_ms": 56400,
  "end_ms": 58700,
  "data": [
    {
      "frame": 0,
      "left_hand_landmarks": [
        { "x": 0.1, "y": 0.2, "z": 0.0 },
        { "x": 0.11, "y": 0.21, "z": 0.0 },
        ...
      ],
      "right_hand_landmarks": [
        { "x": 0.3, "y": 0.4, "z": 0.0 },
        { "x": 0.31, "y": 0.41, "z": 0.0 },
        ...
      ]
    },
    {
      "frame": 1,
      "left_hand_landmarks": null,
      "right_hand_landmarks": [
        { "x": 0.32, "y": 0.42, "z": 0.0 },
        ...
      ]
    },
    ...
  ],
  "is_last_sentence": false
}
  */

  type LandmarkFrame = {
    frame: number;
    left_hand_landmarks?: { x: number; y: number; z: number }[] | null;
    right_hand_landmarks?: { x: number; y: number; z: number }[] | null;
  };

  type LandmarkData = {
    total_frame: number;
    script: string;
    start_ms: number;
    end_ms: number;
    data: LandmarkFrame[];
    is_last_sentence: boolean;
  };

  const resetData = (scr: any, sm: number, em: number, ils: any) => landmarkDataOverCaption.current = { total_frame: 0, script: scr, start_ms: sm, end_ms: em, data: [], is_last_sentence: ils };
  const addData = (landmarks: any) => {
    let lFrame = { frame: landmarkDataOverCaption.current.total_frame, left_hand_landmarks: null, right_hand_landmarks: null };
    switch (landmarks.multiHandedness.length) {
      case 0:
        console.log(`No hand`);
        break;
      case 1:
        console.log(`${landmarks.multiHandedness[0].label} hand`);
        if (landmarks.multiHandedness[0].label == 'Right') {
          lFrame.left_hand_landmarks = landmarks.multiHandLandmarks[0].map((landmark: any) => ({ x: landmark.x, y: landmark.y, z: landmark.z }));
        } else {
          lFrame.right_hand_landmarks = landmarks.multiHandLandmarks[0].map((landmark: any) => ({ x: landmark.x, y: landmark.y, z: landmark.z }));
        }
        break;
      case 2:
        console.log(`Both hand`);
        if (landmarks.multiHandedness[0].label == 'Right') {
          lFrame.left_hand_landmarks = landmarks.multiHandLandmarks[0].map((landmark: any) => ({ x: landmark.x, y: landmark.y, z: landmark.z }));
          lFrame.right_hand_landmarks = landmarks.multiHandLandmarks[1].map((landmark: any) => ({ x: landmark.x, y: landmark.y, z: landmark.z }));
        } else {
          lFrame.left_hand_landmarks = landmarks.multiHandLandmarks[1].map((landmark: any) => ({ x: landmark.x, y: landmark.y, z: landmark.z }));
          lFrame.right_hand_landmarks = landmarks.multiHandLandmarks[0].map((landmark: any) => ({ x: landmark.x, y: landmark.y, z: landmark.z }));
        }
        break;
    }
    landmarkDataOverCaption.current.data.push(lFrame);
    landmarkDataOverCaption.current.total_frame += 1
  };
  const logLandmark = useRef(false);
  const landmarkDataOverCaption = useRef<LandmarkData>({ total_frame: 0, script: "", start_ms: 0, end_ms: 0, data: [], is_last_sentence: false });
  const { landmarks } = useLandmarkContext();

  const lastAddTime = useRef<number>(0);
  const captureRate = 30;

  useEffect(() => {
    if (!logLandmark.current || !landmarks) return;

    const now = performance.now(); // more precise than Date.now()
    if (now - lastAddTime.current >= 1000 / captureRate) {
      lastAddTime.current = now;
      addData(landmarks);
    }
  }, [landmarks]);
  //=============<Landmarks>==============

  useEffect(() => {
    if (!captions || captions.length === 0) return;

    const interval = setInterval(() => {
      if (playerRef.current) {
        const time = playerRef.current.getCurrentTime();
        const currentCaption = captions[captionCounterRef.current];

        if (currentCaption && time > currentCaption.start && captions[captionCounterRef.current].paused == null) {
          if (currentCaption && time > currentCaption.start && captionCounterRef.current === 0) {
            setCaption(captions[captionCounterRef.current]?.text || '');
          }
          captions[captionCounterRef.current].paused = true;
          console.log(landmarkDataOverCaption.current);
          logLandmark.current = false;
          playerRef.current.pauseVideo();
          resetData(currentCaption.text, currentCaption.start * 1000, (currentCaption.start + currentCaption.dur) * 1000, captionCounterRef.current == captions.length - 1);
          setTimeout(() => {
            playerRef.current.playVideo();
            logLandmark.current = true;
          }, waitTime);
        }
        if (currentCaption && time > currentCaption.start + currentCaption.dur) {
          logLandmark.current = false;
          const nextCounter = captionCounterRef.current + 1;
          captionCounterRef.current = nextCounter;
          setCaption(captions[nextCounter]?.text || '');
        }

        setCurrentTime(time);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [captions]);

  const onReady = (event: any) => {
    playerRef.current = event.target; // Store player instance
  };

  const setTime = (n: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(currentTime + n, true); // Jumps to 30 seconds
    }
  };

  const setPause = () => {
    if (playingState) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
    setPlayingState(!playingState);
  };

  /*==========================*/
  const { gameUrl } = useParams<{ gameUrl?: string }>();
  const [urlValue, setUrlValue] = useState<string | null>(gameUrl ?? null); // Allow null

  return (
    <PanelWrapper>
      <ButtonWrapper>
        <Button onClick={() => { setTime(-3) }}>⏪︎</Button>
        <Button onClick={setPause}>{playingState ? "⏵︎" : "⏸︎"}</Button>
        <Button onClick={() => { setTime(3) }}>⏩︎</Button>
      </ButtonWrapper>
      <p>현재 시간: {currentTime.toFixed(2)}초</p>
      <p>현재 자막 시작:{captions == null ? "-" : (captions[captionCounterRef.current].start.toFixed(2))}초</p>
      <p>현재 자막 끝:{captions == null ? "-" : (captions[captionCounterRef.current].start + captions[captionCounterRef.current].dur).toFixed(2)}초</p>
      <YouTube
        onReady={onReady}
        videoId={urlValue ?? undefined}
        opts={{
          width: "560",
          height: "315",
          playerVars: {
            autoplay: 0,
            rel: 0,
            modestbranding: 1,
            disablekb: 1,
            controls: 0, // Hide control bar
            showinfo: 0, // Hide video title and uploader info (deprecated but still works)
            // start: 5,
            // end: 10,
          },
        }}
        //이벤트 리스너
        onEnd={(e) => {
          e.target.stopVideo(0);
        }}
      />
      <p>현재 문장: {caption}</p>
    </PanelWrapper>
  );
};

const ButtonWrapper = styled.div`
display: flex;
gap: 5px;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;

  border: 1px solid black;
  border-radius: 5px;
  padding: 5px;
  transition: 0.3s;

  &:hover {
    background: black;
    color: white;
    transition: 0.3s;
  }
`;

export default YoutubeVideoPlayPanel;

//https://developers.google.com/youtube/v3/docs/search/list?hl=ko

// Deprecated
// interface YoutubeURLInputFieldProps {
//   valueSetFunction: (value: string | null) => void;
// }

// const YoutubeURLInputField: React.FC<YoutubeURLInputFieldProps> = ({
//   valueSetFunction,
// }) => {
//   const extractKey = (url: string) => {
//     const match = url.match(/[?&]v=([^&]+)/);
//     return match ? match[1] : null;
//   };

//   const setURL = (event: React.ChangeEvent<HTMLInputElement>) => {
//     let str = extractKey(event.target.value); //event.target.value('https://www.youtube.com/watch?v=', '');
//     // if(str == null) {
//     //     alert('이 URL은 처리할 수 없습니다. live나 short 영상은 지원하지 않습니다.');
//     // }
//     valueSetFunction(str);
//     console.log(`url set to ${str}`);
//   };

//   return (
//     <InputField type="text" onChange={setURL} />
//   );
// };

// const InputField = styled.input`
//   width: 100%;
//   padding: 5px;
//   border: 0;
//   background-color: rgb(200, 200, 200);
//   box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35);
//   border-radius: 20px;
// `;
