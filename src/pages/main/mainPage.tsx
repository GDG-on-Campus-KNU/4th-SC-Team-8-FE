import YoutubeVideoPlayPanel from './components/YoutubeVideoPlayPanel';
import WebcamPanel from './components/WebcamPanel';
// import YoutubeHandTracking from './utils/youtubeHandTracking';
const MainPage = () => {
    return (
        <>
        <YoutubeVideoPlayPanel/>
        <WebcamPanel/>
        {/* <YoutubeHandTracking/> */}
        </>
    );
}

export default MainPage;
