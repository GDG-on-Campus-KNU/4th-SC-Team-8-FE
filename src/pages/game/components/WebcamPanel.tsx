import styled from "styled-components";
import HandLandmarker from "../utils/handLandmarker";
// import PostureLandmarker from './utils/postureLandmarker';
import { PanelWrapper } from "../../../globalStyle";
import { useState } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PostureLandmarker from "../utils/postureLandmarker";

let screenResolution = { x: 560, y: 315 }; //{x: 1280, y: 720};

const WebcamPanel = () => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  return (
    <PanelWrapper
      style={{ width: screenResolution.x, height: screenResolution.y }}
    >
      {cameraEnabled ? (
        // <PostureLandmarker/>
        <HandLandmarker />
      ) : (
        <WebCamAccessButton
          onClick={() => {
            setCameraEnabled(!cameraEnabled);
          }}
        >
          <CameraAltIcon
            style={{ width: "100px", height: "100px", color: "black" }}
          />
          <span>웹캠 켜기</span>
        </WebCamAccessButton>
      )}
      {/* <PostureLandmarker/> */}
    </PanelWrapper>
  );
};

const WebCamAccessButton = styled.button`
  border: 0;
  border-radius: 10%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: whitegray;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset,
    rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
  transition: 0.3s;
  &:hover,
  &:focus {
    background: cornflowerblue;
    color: white;
    transition: 0.3s;
    transform: scale(1.05);
  }
`;

export default WebcamPanel;
