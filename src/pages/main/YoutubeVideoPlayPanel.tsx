import React, { useState } from 'react'
import styled from 'styled-components'
import YouTube from 'react-youtube'

//https://www.youtube.com/watch?v=42fmMP81EvA&t=854s
//https://www.youtube.com/watch?v=HRWakz9pnnY
// videoId : https://www.youtube.com/watch?v={videoId} 유튜브 링크의 끝부분에 있는 고유한 아이디
// const dummyKey = 'HRWakz9pnnY';

const YoutubeVideoPlayPanel = () => {
    const [urlValue, setUrlValue] = useState<string | null>(null); // Allow null

    return(
        <PanelWrapper>
        <YoutubeURLInputField valueSetFunction={setUrlValue}/>
        <YouTube
        videoId={urlValue ?? undefined}
        opts={{
            width: "560",
            height: "315",
            playerVars: {
                autoplay: 0,
                rel: 0,
                modestbranding: 1,
            },
        }}
        //이벤트 리스너 
        onEnd={(e)=>{e.target.stopVideo(0);}}      
        />
        </PanelWrapper>
    );
}

const PanelWrapper = styled.div`
display: flex;
flex-direction: column;
gap: 10px;
border: 2px solid black;
border-radius: 20px;
padding: 20px;
width: min-content;
`;

interface YoutubeURLInputFieldProps {
    valueSetFunction: (value: string | null) => void;
}

const YoutubeURLInputField: React.FC<YoutubeURLInputFieldProps> = ({ valueSetFunction }) => {
    const extractKey = (url: string) => {
        const match = url.match(/[?&]v=([^&]+)/);
        return match ? match[1] : null;
    }

    const setURL = (event: React.ChangeEvent<HTMLInputElement>) => {
        let str = extractKey(event.target.value);//event.target.value('https://www.youtube.com/watch?v=', '');
        // if(str == null) {
        //     alert('이 URL은 처리할 수 없습니다. live나 short 영상은 지원하지 않습니다.');
        // }
        valueSetFunction(str);
        console.log(`url set to ${str}`);
      };

    return(
        <InputFieldWrapper>
        <div>유튜브 영상 주소=</div>
        <InputField type="text" onChange={setURL}/>
        </InputFieldWrapper>
    );
}

const InputField = styled.input`
width: 75%;
`;

const InputFieldWrapper = styled.div`
display: flex;
flex-direction: row;
`;

export default YoutubeVideoPlayPanel;
