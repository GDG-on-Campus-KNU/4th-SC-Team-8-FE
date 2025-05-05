import { useState, createContext, useContext, useEffect } from 'react';
import YoutubeVideoPlayPanel from './components/YoutubeVideoPlayPanel';
import WebcamPanel from './components/WebcamPanel';
import Socket from "./webSocket/socket";
import { ai } from '../../shared/ServerEndpoint';
import styled from 'styled-components';
// import PostureLandmarker from './utils/postureLandmarker';
// import YoutubeHandTracking from './utils/youtubeHandTracking';

//Ex: sendSubtitleRequest("https://www.youtube.com/watch?v=gI5uNff3kbM");
//To be implemented... captions are separated apart, unable to use it...
// function sendSubtitleRequest(youtubeUrl: string) {
//     fetch(`${ai}/get_subtitle`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ url: youtubeUrl, lang: "ko" })
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }


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
    const [landmarks, setLandmarks] = useState();

    // useEffect(() => {
    //     console.log(landmarks);
    // }, [landmarks]);


    return (
        <>
            <LandmarkContext.Provider value={{ landmarks, setLandmarks }}>
                <Socket></Socket>
                <PanelWrapper>
                    <YoutubeVideoPlayPanel />
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
