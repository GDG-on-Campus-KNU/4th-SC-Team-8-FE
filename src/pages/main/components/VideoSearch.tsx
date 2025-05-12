import { useState } from "react";
import styled from "styled-components";
import { backend } from "../../../shared/ServerEndpoint";
import { LoadToken } from "../../../shared/auth";
import VideoCardDetail from "../utils/VideoCardDetail";
import { BarLoader, DotLoader, MoonLoader } from "react-spinners";

const CheckVideoExist = async (url: String) => {
  try {
    const response = await fetch(`${backend}/api/v1/game/check-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LoadToken().accessToken}`,
      },
      body: JSON.stringify({
        youtubeLink: url,
      }),
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
};

const handleVideoRequest = async (url: String) => {
  try {
    const response = await fetch(`${backend}/api/v1/game`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LoadToken().accessToken}`,
      },
      body: JSON.stringify({
        youtubeLink: url,
      }),
    });

    switch (response.status) {
      case 200:
        // const msg = await response.json();
        // console.log("Request Success", msg.message);
        alert("영상 처리가 요청되었어요, 처리가 끝나면 이메일로 알려드려요.");
        return true;

      case 400:
        console.log("Conflict: ", await response.json());
        alert("랜드마크 추출에 실패했어요, 이 영상은 처리가 불가능 해요.");
        return false;

      // Login pre-checked
      case 401:
        console.log("Conflict: ", await response.json());
        alert("영상");
        return false;

      case 409:
        console.log("Conflict: ", await response.json());
        alert("영상이 이미 존재해요, 검색에 뜨지 않는다면 조금 기다려 주세요.");
        return false;

      default:
        console.log("Unexpected status code:", response.status);
        break;
    }
  } catch (error) {
    console.error("Error:", error);
  }
  return false;
};

const VideoSearch = ({ isLoggedIn }: any) => {
  const [url, setUrl] = useState<string>("");
  const [showPanel, setShowPanel] = useState<Boolean>(false);
  const [result, setResult] = useState<string>("none");

  const ButtonHandler = async () => {
    let exist = await CheckVideoExist(url);
    setShowPanel(true);
    if (exist) {
      setResult("yes");
    } else {
      setResult("no");
    }
  };

  return (
    <VideoSearchPanelWrapper>
      {isLoggedIn ? (
        <>
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
            (result === "yes" ? (
              <>
                바로 재생하실 수 있어요!
                <VideoCardDetail videoUrl={url} />
              </>
            ) : (
              <>
                영상이 존재하지 않아요, 영상 처리를 요청할까요?
                <Button
                  onClick={() => {
                    const handleVideoProc = async () => {
                      if (await handleVideoRequest(url)) {
                        setShowPanel(false);
                      } else {
                        setShowPanel(false);
                      }
                    };
                    setResult("try");
                    handleVideoProc();
                  }}
                >
                  {result == "try" ? <BarLoader /> : <>요청하기</>}
                </Button>
              </>
            ))}
        </>
      ) : (
        <>
          <p>영상 검색 기능을 사용하려면</p>
          <p>로그인이 필요합니다</p>
        </>
      )}
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
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;

  border: 1px solid black;
  border-radius: 10px;
  padding: 5px 20px 5px 20px;
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
