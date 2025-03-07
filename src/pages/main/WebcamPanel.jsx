import { useState } from 'react'
import styled from 'styled-components'
import Webcam from 'react-webcam';

const WebcamPanel = () => {
    const [urlValue, setUrlValue] = useState('');

    return(
        <PanelWrapper>
            <Webcam/>
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

export default WebcamPanel;
