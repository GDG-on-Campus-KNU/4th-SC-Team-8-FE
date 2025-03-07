import styled from 'styled-components'
import HandLandmarker from './utils/handLandmarker';

const WebcamPanel = () => {
    return(
        <PanelWrapper>
        <HandLandmarker/>
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
    