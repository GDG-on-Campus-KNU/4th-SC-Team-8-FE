import { useState } from 'react'
import styled from 'styled-components'
import YoutubeVideoPlayPanel from './YoutubeVideoPlayPanel';
import WebcamPanel from './WebCamPanel';

//videoId : https://www.youtube.com/watch?v={videoId} 유튜브 링크의 끝부분에 있는 고유한 아이디
const dummyKey = 'HRWakz9pnnY';

const MainPage = () => {
    return (
        <>
        <h1>Experimental Service</h1>
        <YoutubeVideoPlayPanel/>
        <WebcamPanel/>
        </>
    );
}

export default MainPage;
