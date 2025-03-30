import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import YouTube from "react-youtube";
import YoutubeHandTracking from "../utils/youtubeHandTracking";
import { PanelWrapper } from "../../../globalStyle";
import { useParams } from "react-router-dom";

//https://www.youtube.com/watch?v=42fmMP81EvA&t=854s
//https://www.youtube.com/watch?v=HRWakz9pnnY
// videoId : https://www.youtube.com/watch?v={videoId} 유튜브 링크의 끝부분에 있는 고유한 아이디
// const dummyKey = 'HRWakz9pnnY';

const YoutubeVideoPlayPanel = () => {
  const playerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playingState, setPlayingState] = useState(false);

  // Function to update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
      <button onClick={setPause}>Play/Pause</button>
      <button onClick={() => {setTime(3)}}>Jump to 3s forward</button>
      <button onClick={() => {setTime(-3)}}>Jump to 3s backward</button>
      <p>Current Time: {currentTime.toFixed(2)} seconds</p>
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
            start: 5,
            end: 10,
          },
        }}
        //이벤트 리스너
        onEnd={(e) => {
          e.target.stopVideo(0);
        }}
      />
      <YoutubeURLInputField valueSetFunction={setUrlValue} />
    </PanelWrapper>
  );
};
//https://developers.google.com/youtube/v3/docs/search/list?hl=ko

interface YoutubeURLInputFieldProps {
  valueSetFunction: (value: string | null) => void;
}

const YoutubeURLInputField: React.FC<YoutubeURLInputFieldProps> = ({
  valueSetFunction,
}) => {
  const extractKey = (url: string) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  };

  const setURL = (event: React.ChangeEvent<HTMLInputElement>) => {
    let str = extractKey(event.target.value); //event.target.value('https://www.youtube.com/watch?v=', '');
    // if(str == null) {
    //     alert('이 URL은 처리할 수 없습니다. live나 short 영상은 지원하지 않습니다.');
    // }
    valueSetFunction(str);
    console.log(`url set to ${str}`);
  };

  return (
    <InputField type="text" placeholder="유튜브 영상 주소:" onChange={setURL} />
  );
};

const InputField = styled.input`
  width: 100%;
  padding: 5px;
  border: 0;
  background-color: rgb(200, 200, 200);
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35);
  border-radius: 20px;
`;

export default YoutubeVideoPlayPanel;
