import YoutubeVideoPlayPanel from './components/YoutubeVideoPlayPanel';
import WebcamPanel from './components/WebcamPanel';
// import PostureLandmarker from './utils/postureLandmarker';
// import YoutubeHandTracking from './utils/youtubeHandTracking';
const GamePage = () => {
    return (
        <>
        <YoutubeVideoPlayPanel/>
        <WebcamPanel/>
        {/* <PostureLandmarker/> */}
        {/* <YoutubeHandTracking/> */}
        </>
    );
}

export default GamePage;
