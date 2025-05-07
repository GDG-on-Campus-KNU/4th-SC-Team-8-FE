import { useState, createContext, useContext, useEffect } from 'react';
import YoutubeVideoPlayPanel from './components/YoutubeVideoPlayPanel';
import WebcamPanel from './components/WebcamPanel';
import Socket from "./webSocket/socket";
import { ai } from '../../shared/ServerEndpoint';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
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
    const [captions, setCaptions] = useState(null);

    useEffect(() => {
        async function fetchCaptions() {
            let caps: any = await sendSubtitleRequest(`https://www.youtube.com/watch?v=${gameUrl}`);
            setCaptions(caps.captions);
        };
        fetchCaptions();
    }, []);

    useEffect(() => {
        console.log(captions);
    }, [captions]);



    // useEffect(() => {
    //     console.log(landmarks);
    // }, [landmarks]);


    return (
        <>
            <LandmarkContext.Provider value={{ landmarks, setLandmarks }}>
                <Socket/>
                <PanelWrapper>
                    <YoutubeVideoPlayPanel captions={captions}/>
                    <WebcamPanel />
                </PanelWrapper>
                {/* <PostureLandmarker/> */}
                {/* <YoutubeHandTracking/> */}
            </LandmarkContext.Provider>
        </>
    );
}

const PanelWrapper = styled.div`
    display: flex;
`;

export default GamePage;
