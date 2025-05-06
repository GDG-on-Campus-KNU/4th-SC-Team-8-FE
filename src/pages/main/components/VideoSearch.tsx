import { useState } from "react";
import styled from "styled-components";
import { backend } from "../../../shared/ServerEndpoint";
import { LoadToken } from "../../../shared/auth";
import VideoCardDetail from "../utils/VideoCardDetail";

const CheckVideoExist = async (url : String) => {
  try {
    const response = await fetch(`${backend}/api/v1/game/check-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LoadToken().accessToken}`,
      },
      body: JSON.stringify({
        "youtubeLink": url,
      })
    });

    switch (response.status) {
      case 200:
        return false;

      case 401: // Unauthrized
        // Handle plain text response for conflict (e.g., email already exists)
        const conflictMessage = await response.json();
        console.log("Conflict: ", conflictMessage);
        break;

      case 409:
        return true;
      
      default:
        console.log("Unexpected status code:", response.status);
        break;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

const VideoSearch = () => {
  const [url, setUrl] = useState<string>("");
  const [showPanel, setShowPanel] = useState<Boolean>(false);

  const ButtonHandler = async () => {
    let exist = await CheckVideoExist(url);
    if (exist) {
      setShowPanel(true);
    } else {

    }
  }

  return (
    <VideoSearchPanelWrapper>
      <h2>찾으시는 동영상이 있으신가요?</h2>
      <p>원하시는 수화 동영상 링크를 넣어주세요!</p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          gap: "10px",
        }}
      >
        <Input
          type="text"
          placeholder="https://www.youtube.com/watch?v=HRWakz9pnnY"
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={ButtonHandler}>검색</Button>
      </div>
      {showPanel &&
      <>
      바로 재생하실 수 있어요!
      <VideoCardDetail videoUrl={url}/>
      </>}
    </VideoSearchPanelWrapper>
  );
};

const Input = styled.input`
  width: 400px;
  height: 30px;
  padding-left: 5px;
  border: 1px solid black;
  border-radius: 10px;
`;

const Button = styled.button`
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;

  border: 1px solid black;
  border-radius: 10px;
  padding: 5px;
  transition: 0.3s;

  &:hover {
    background: black;
    color: white;
    transition: 0.3s;
  }
`;

const VideoSearchPanelWrapper = styled.div`
  flex: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5px;

  background: white;
  border: 1px solid #333;
  border-radius: 10px;
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35);
  padding: 20px;
`;

export default VideoSearch;
